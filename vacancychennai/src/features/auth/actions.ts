"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";
import { candidates, employers } from "@/features/core/mock-db";
import { dbQuery, hasDatabase } from "@/lib/db";
import { getResendClient } from "@/lib/email/resend-client";
import {
  sendCandidateMagicLinkEmail,
  sendEmployerVerificationEmail,
} from "@/lib/email/send-auth-email";
import { createEmailVerificationToken } from "@/lib/email/verification-tokens";
import { logger } from "@/lib/logger";
import { incrementMetric } from "@/lib/metrics";
import {
  canSendVerificationEmail,
  clearFailedAttempts,
  getRateLimitState,
  recordVerificationEmailSent,
  registerFailedAttempt,
} from "@/lib/rate-limit";

async function findDbUserByEmail(email: string) {
  const rows = await dbQuery<{
    id: string;
    role: "candidate" | "employer" | "admin";
    full_name: string;
    email: string;
    password_hash: string | null;
    email_verified_at: string | null;
  }>(
    `select id, role, full_name, email, password_hash, email_verified_at
     from users
     where lower(email) = $1
     limit 1`,
    [email.toLowerCase()],
  );
  return rows[0];
}

async function trySendEmployerVerificationEmail(user: {
  id: string;
  email: string;
  full_name: string;
}): Promise<"sent" | "rate-limited" | "config" | "failed"> {
  if (!getResendClient()) {
    return "config";
  }
  const rateKey = `employer-verify-send:${user.email.toLowerCase()}`;
  if (!canSendVerificationEmail(rateKey)) {
    return "rate-limited";
  }
  const plaintext = await createEmailVerificationToken(user.id, "employer_verify");
  if (!plaintext) {
    return "failed";
  }
  try {
    await sendEmployerVerificationEmail({
      to: user.email,
      fullName: user.full_name,
      plaintextToken: plaintext,
    });
    recordVerificationEmailSent(rateKey);
    return "sent";
  } catch (e) {
    logger.warn({ err: e, email: user.email }, "employer verification email send failed");
    return "failed";
  }
}

export async function loginCandidateAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const limiterKey = `candidate:${email}`;
  const rate = getRateLimitState(limiterKey);
  if (rate.blocked) {
    redirect("/candidate/login?error=rate-limited");
  }

  if (hasDatabase()) {
    const user = await findDbUserByEmail(email);
    if (!user || user.role !== "candidate") {
      registerFailedAttempt(limiterKey);
      incrementMetric("authFailure");
      redirect("/candidate/login?error=invalid-candidate");
    }
    clearFailedAttempts(limiterKey);

    if (!getResendClient()) {
      incrementMetric("authFailure");
      redirect("/candidate/login?error=email-config");
    }

    const rateKey = `candidate-magic:${email}`;
    if (!canSendVerificationEmail(rateKey)) {
      redirect("/candidate/login?error=email-rate-limited");
    }

    const plaintext = await createEmailVerificationToken(user.id, "candidate_magic");
    if (!plaintext) {
      redirect("/candidate/login?error=email-failed");
    }

    try {
      await sendCandidateMagicLinkEmail({
        to: user.email,
        fullName: user.full_name,
        plaintextToken: plaintext,
      });
      recordVerificationEmailSent(rateKey);
    } catch (e) {
      logger.warn({ err: e, email: user.email }, "candidate magic link send failed");
      redirect("/candidate/login?error=email-failed");
    }

    redirect("/candidate/login?sent=1");
  }

  const candidate = candidates.find((item) => item.email.toLowerCase() === email);
  if (!candidate) {
    registerFailedAttempt(limiterKey);
    incrementMetric("authFailure");
    redirect("/candidate/login?error=invalid-candidate");
  }
  clearFailedAttempts(limiterKey);
  incrementMetric("authSuccess");
  await createSession({
    role: "candidate",
    actorId: candidate.id,
    displayName: candidate.name,
  });
  redirect("/candidate/dashboard");
}

export async function loginEmployerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const limiterKey = `employer:${email}`;
  const rate = getRateLimitState(limiterKey);
  if (rate.blocked) {
    redirect("/employer/login?error=rate-limited");
  }

  if (hasDatabase()) {
    const user = await findDbUserByEmail(email);
    const isValid =
      !!user &&
      user.role === "employer" &&
      !!user.password_hash &&
      bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      registerFailedAttempt(limiterKey);
      incrementMetric("authFailure");
      redirect("/employer/login?error=invalid");
    }
    clearFailedAttempts(limiterKey);

    if (!user.email_verified_at) {
      const sendResult = await trySendEmployerVerificationEmail({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      });
      if (sendResult === "config") {
        redirect("/employer/login?error=email-config");
      }
      if (sendResult === "rate-limited") {
        redirect("/employer/login?error=email-rate-limited");
      }
      if (sendResult === "failed") {
        redirect("/employer/login?error=email-failed");
      }
      redirect("/employer/login?error=unverified");
    }

    incrementMetric("authSuccess");
    await createSession({
      role: "employer",
      actorId: user.id,
      displayName: user.full_name,
    });
    redirect("/employer/dashboard");
  }

  const employer = employers.find(
    (item) =>
      item.email.toLowerCase() === email && item.password === password,
  );
  if (!employer) {
    registerFailedAttempt(limiterKey);
    incrementMetric("authFailure");
    redirect("/employer/login?error=invalid");
  }
  clearFailedAttempts(limiterKey);
  incrementMetric("authSuccess");
  await createSession({
    role: "employer",
    actorId: employer.id,
    displayName: employer.companyName,
  });
  redirect("/employer/dashboard");
}

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const limiterKey = `admin:${email}`;
  const rate = getRateLimitState(limiterKey);
  if (rate.blocked) {
    redirect("/admin/login?error=rate-limited");
  }

  if (hasDatabase()) {
    const user = await findDbUserByEmail(email);
    const isValid =
      !!user &&
      user.role === "admin" &&
      !!user.password_hash &&
      bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      registerFailedAttempt(limiterKey);
      incrementMetric("authFailure");
      redirect("/admin/login?error=invalid");
    }
    clearFailedAttempts(limiterKey);
    incrementMetric("authSuccess");
    await createSession({
      role: "admin",
      actorId: user.id,
      displayName: user.full_name,
    });
    redirect("/admin/dashboard");
  }

  if (email !== "admin@vacancychennai.in" || password !== "admin123") {
    registerFailedAttempt(limiterKey);
    incrementMetric("authFailure");
    redirect("/admin/login?error=invalid");
  }
  clearFailedAttempts(limiterKey);
  incrementMetric("authSuccess");
  await createSession({
    role: "admin",
    actorId: "admin-001",
    displayName: "Vacancy Chennai Admin",
  });
  redirect("/admin/dashboard");
}

export async function resendEmployerVerificationAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    redirect("/employer/login?error=invalid");
  }

  const user = await findDbUserByEmail(email);
  if (user && user.role === "employer" && !user.email_verified_at) {
    const sendResult = await trySendEmployerVerificationEmail({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    });

    if (sendResult === "config") {
      redirect("/employer/login?error=email-config");
    }
    if (sendResult === "rate-limited") {
      redirect("/employer/login?error=email-rate-limited");
    }
    if (sendResult === "failed") {
      redirect("/employer/login?error=email-failed");
    }
  }

  redirect("/employer/login?resent=1");
}

export async function logoutAction() {
  await destroySession();
  logger.info({ event: "logout" }, "user session destroyed");
  redirect("/");
}

