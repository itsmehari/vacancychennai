"use server";

import { redirect } from "next/navigation";
import { createSession, getSession } from "@/lib/auth";
import { isAllowedExperienceLevel } from "@/lib/candidate-profile-constants";
import { getResendClient } from "@/lib/email/resend-client";
import { sendCandidateMagicLinkEmail } from "@/lib/email/send-auth-email";
import { createEmailVerificationToken } from "@/lib/email/verification-tokens";
import { hasDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  isAllowedEducation,
  isValidJobSeekerDateOfBirth,
  JOB_NEEDS_MAX_LENGTH,
  NANGANALLUR_AREA_SLUG,
  NANGANALLUR_PAGE_PATH,
} from "@/lib/local-job-request-constants";
import { sendLoginOtp } from "@/lib/otp-send";
import { verifyOtp } from "@/lib/otp-store";
import { normalizePhone } from "@/lib/phone";
import {
  canSendVerificationEmail,
  getRateLimitState,
  recordVerificationEmailSent,
  registerFailedAttempt,
} from "@/lib/rate-limit";
import { candidates } from "@/features/core/mock-db";
import {
  createCandidateUserForJobRequest,
  findCandidateUserByEmail,
  findCandidateUserByPhone,
  updateCandidateUserName,
  updateCandidateUserPhone,
  upsertLocalJobRequest,
} from "@/features/local-job-request/repository";

function pageUrl(query?: Record<string, string>) {
  const params = new URLSearchParams(query);
  const q = params.toString();
  return q ? `${NANGANALLUR_PAGE_PATH}?${q}` : NANGANALLUR_PAGE_PATH;
}

function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}

async function ensureCandidateAccount(input: {
  fullName: string;
  email: string;
  phone: string;
}): Promise<{ userId: string; fullName: string }> {
  if (!hasDatabase()) {
    const existing = candidates.find((c) => c.email.toLowerCase() === input.email);
    if (existing) {
      return { userId: existing.id, fullName: existing.name };
    }
    return { userId: `mock-jr-${input.email}`, fullName: input.fullName };
  }

  const byEmail = await findCandidateUserByEmail(input.email);
  if (byEmail) {
    if (byEmail.role !== "candidate") {
      redirect(pageUrl({ error: "email-taken" }));
    }
    if (byEmail.phone && byEmail.phone !== input.phone) {
      redirect(pageUrl({ error: "phone-mismatch" }));
    }
    if (!byEmail.phone) {
      await updateCandidateUserPhone(byEmail.id, input.phone);
    }
    if (byEmail.full_name !== input.fullName) {
      await updateCandidateUserName(byEmail.id, input.fullName);
    }
    return { userId: byEmail.id, fullName: input.fullName };
  }

  const byPhone = await findCandidateUserByPhone(input.phone);
  if (byPhone && byPhone.email.toLowerCase() !== input.email) {
    redirect(pageUrl({ error: "phone-taken" }));
  }

  try {
    const userId = await createCandidateUserForJobRequest(input);
    return { userId, fullName: input.fullName };
  } catch (e) {
    logger.warn({ err: e, email: input.email }, "job request candidate create failed");
    redirect(pageUrl({ error: "invalid-auth" }));
  }
}

function parseAuthFields(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  if (!fullName || !email || !phone) {
    redirect(pageUrl({ error: "invalid-auth" }));
  }
  return { fullName, email, phone };
}

export async function jobRequestMagicLinkAction(formData: FormData) {
  const { fullName, email, phone } = parseAuthFields(formData);

  if (!hasDatabase()) {
    const { userId, fullName: name } = await ensureCandidateAccount({ fullName, email, phone });
    await createSession({ role: "candidate", actorId: userId, displayName: name });
    redirect(pageUrl({ auth: "signed-in" }));
  }

  const limiterKey = `candidate:${email}`;
  if (getRateLimitState(limiterKey).blocked) {
    redirect(pageUrl({ error: "rate-limited" }));
  }

  await ensureCandidateAccount({ fullName, email, phone });

  if (!getResendClient()) {
    redirect(pageUrl({ error: "email-config" }));
  }

  const rateKey = `candidate-magic:${email}`;
  if (!canSendVerificationEmail(rateKey)) {
    redirect(pageUrl({ error: "email-rate-limited" }));
  }

  const user = await findCandidateUserByEmail(email);
  if (!user || user.role !== "candidate") {
    redirect(pageUrl({ error: "invalid-auth" }));
  }

  const plaintext = await createEmailVerificationToken(user.id, "candidate_magic");
  if (!plaintext) {
    redirect(pageUrl({ error: "email-failed" }));
  }

  try {
    await sendCandidateMagicLinkEmail({
      to: email,
      fullName,
      plaintextToken: plaintext,
      nextPath: NANGANALLUR_PAGE_PATH,
    });
    recordVerificationEmailSent(rateKey);
  } catch (e) {
    logger.warn({ err: e, email }, "job request magic link send failed");
    redirect(pageUrl({ error: "email-failed" }));
  }

  redirect(pageUrl({ auth: "sent" }));
}

export async function jobRequestOtpAction(formData: FormData) {
  const { fullName, email, phone } = parseAuthFields(formData);

  const otpKey = `otp-request:${phone}`;
  if (getRateLimitState(otpKey).blocked) {
    redirect(pageUrl({ error: "rate-limited" }));
  }

  await ensureCandidateAccount({ fullName, email, phone });

  try {
    await sendLoginOtp(phone);
    registerFailedAttempt(otpKey, { maxAttempts: 5, blockMs: 5 * 60 * 1000 });
  } catch {
    redirect(pageUrl({ error: "otp-failed" }));
  }

  redirect(
    pageUrl({
      auth: "otp-sent",
      phone,
      name: fullName,
      email,
    }),
  );
}

export async function jobRequestVerifyOtpAction(formData: FormData) {
  const otp = String(formData.get("otp") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));

  if (!otp || !phone || !fullName || !email) {
    redirect(pageUrl({ error: "invalid-auth" }));
  }

  const ok = await verifyOtp(phone, otp);
  if (!ok) {
    redirect(
      pageUrl({
        auth: "otp-sent",
        phone,
        name: fullName,
        email,
        error: "invalid-otp",
      }),
    );
  }

  const { userId, fullName: name } = await ensureCandidateAccount({ fullName, email, phone });
  await createSession({ role: "candidate", actorId: userId, displayName: name });
  redirect(pageUrl({ auth: "signed-in" }));
}

export async function submitLocalJobRequestAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "candidate") {
    redirect(pageUrl({ error: "login-required" }));
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim();
  const education = String(formData.get("education") ?? "").trim();
  const locationText = String(formData.get("locationText") ?? "").trim();
  const experienceLevel = String(formData.get("experienceLevel") ?? "").trim();
  const jobNeeds = String(formData.get("jobNeeds") ?? "").trim().slice(0, JOB_NEEDS_MAX_LENGTH);
  const contactPhone = normalizePhone(String(formData.get("contactPhone") ?? ""));

  if (
    !fullName ||
    !isValidJobSeekerDateOfBirth(dateOfBirth) ||
    !isAllowedEducation(education) ||
    !locationText ||
    !isAllowedExperienceLevel(experienceLevel) ||
    !jobNeeds ||
    !contactPhone
  ) {
    redirect(pageUrl({ error: "invalid-request" }));
  }

  await upsertLocalJobRequest({
    userId: session.actorId,
    areaSlug: NANGANALLUR_AREA_SLUG,
    fullName,
    dateOfBirth,
    education,
    locationText,
    experienceLevel,
    jobNeeds,
    contactPhone,
  });

  redirect(pageUrl({ success: "posted" }));
}
