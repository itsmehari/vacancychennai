"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCandidateRegistration, listLocations } from "@/features/core/repository";
import { createSession } from "@/lib/auth";
import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";
import {
  finalizeAdminPasswordReset,
  finalizeEmployerPasswordReset,
} from "@/lib/email/verification-tokens";
import { logger } from "@/lib/logger";
import { isAllowedEducation, isAllowedJobPreference } from "@/lib/candidate-profile-constants";
import { normalizePhone } from "@/lib/phone";
import {
  consumeRateLimit,
  getRateLimitState,
  registerFailedAttempt,
} from "@/lib/rate-limit";
import { safeCandidateNextPath } from "@/lib/safe-next-path";

const MIN_PASSWORD = 8;

function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}

async function findUserByEmail(email: string) {
  return dbQuery<{
    id: string;
    role: "candidate" | "employer" | "admin";
    full_name: string;
    email: string;
    password_hash: string | null;
    email_verified_at: string | null;
  }>(
    `select id, role, full_name, email, password_hash, email_verified_at
     from users where lower(email) = $1 limit 1`,
    [email],
  ).then((r) => r[0]);
}

export async function registerEmployerAction(formData: FormData) {
  if (!hasDatabase()) {
    redirect("/employer/register?error=db-required");
  }

  const companyName = String(formData.get("companyName") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phoneRaw = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!companyName || !fullName || !email || !password) {
    redirect("/employer/register?error=invalid");
  }
  if (password.length < MIN_PASSWORD || passwordConfirm.length < MIN_PASSWORD) {
    redirect("/employer/register?error=weak-password");
  }
  if (password !== passwordConfirm) {
    redirect("/employer/register?error=password-mismatch");
  }
  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    redirect("/employer/register?error=invalid-phone");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    redirect("/employer/register?error=email-taken");
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const inserted = await dbQuery<{ id: string }>(
    `insert into users (role, full_name, email, phone, password_hash, status, email_verified_at)
     values ('employer'::user_role, $1, $2, $3, $4, 'active'::account_status, now())
     returning id`,
    [fullName, email, phone, passwordHash],
  );
  const userId = inserted[0]?.id;
  if (!userId) {
    redirect("/employer/register?error=invalid");
  }

  try {
    await dbExecute(
      `insert into employer_profiles (user_id, company_name) values ($1, $2)`,
      [userId, companyName],
    );
  } catch (e) {
    logger.warn({ err: e, userId }, "employer_profiles insert failed; rolling back user");
    await dbExecute(`delete from users where id = $1`, [userId]);
    redirect("/employer/register?error=invalid");
  }

  await createSession({
    role: "employer",
    actorId: userId,
    displayName: fullName,
  });

  redirect("/employer/dashboard");
}

function registerRedirect(error: string, next: string | null): never {
  const params = new URLSearchParams({ error });
  if (next) params.set("next", next);
  redirect(`/candidate/register?${params.toString()}`);
}

async function requestIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return (first || h.get("x-real-ip") || "unknown").slice(0, 80);
}

export async function registerCandidateAction(formData: FormData) {
  const next = safeCandidateNextPath(String(formData.get("next") ?? ""));
  if (!hasDatabase()) {
    registerRedirect("db-required", next);
  }

  const honeypot = String(formData.get("companyWebsite") ?? "").trim();
  if (honeypot) {
    redirect(next ? `/candidate/login?sent=1&next=${encodeURIComponent(next)}` : "/candidate/login?sent=1");
  }

  const ip = await requestIp();
  if (!consumeRateLimit(`candidate-register:${ip}`, 8, 60 * 60 * 1000)) {
    registerRedirect("rate-limited", next);
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const locationId = String(formData.get("locationId") ?? "").trim();
  const education = String(formData.get("education") ?? "").trim();
  const jobPreferences = [
    ...new Set(
      formData
        .getAll("jobPreferences")
        .map((value) => String(value).trim())
        .filter(isAllowedJobPreference),
    ),
  ];

  if (fullName.length < 2 || fullName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    registerRedirect("invalid", next);
  }
  if (password.length < MIN_PASSWORD || passwordConfirm.length < MIN_PASSWORD) {
    registerRedirect("weak-password", next);
  }
  if (password !== passwordConfirm) {
    registerRedirect("password-mismatch", next);
  }
  if (!phone) registerRedirect("invalid-phone", next);
  if (!isAllowedEducation(education)) registerRedirect("invalid-education", next);
  if (jobPreferences.length === 0) registerRedirect("invalid-preferences", next);

  const locations = await listLocations();
  if (!locations.some((location) => location.id === locationId)) {
    registerRedirect("invalid-location", next);
  }

  const created = await createCandidateRegistration({
    fullName,
    email,
    phone,
    locationId,
    education,
    jobPreferences,
    passwordHash: bcrypt.hashSync(password, 10),
  });
  if (!created.ok) {
    registerRedirect(created.error === "failed" ? "invalid" : created.error, next);
  }

  await createSession({
    role: "candidate",
    actorId: created.userId,
    displayName: fullName,
  });

  redirect(next ?? "/candidate/dashboard");
}

export async function setCandidatePasswordAction(formData: FormData) {
  if (!hasDatabase()) {
    redirect("/candidate/login?error=db-required");
  }

  const next = safeCandidateNextPath(String(formData.get("next") ?? ""));
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  function back(error: string): never {
    const params = new URLSearchParams({ error });
    if (next) params.set("next", next);
    redirect(`/candidate/login?${params.toString()}`);
  }

  if (!email || !phone) back("invalid");
  if (password.length < MIN_PASSWORD || passwordConfirm.length < MIN_PASSWORD) back("weak-password");
  if (password !== passwordConfirm) back("password-mismatch");

  const limiterKey = `candidate-set-password:${email}`;
  if (getRateLimitState(limiterKey).blocked) back("rate-limited");

  const rows = await dbQuery<{
    id: string;
    role: string;
    full_name: string;
    phone: string | null;
  }>(
    `select id, role::text as role, full_name, phone
     from users where lower(email) = $1 limit 1`,
    [email],
  );
  const user = rows[0];
  if (!user || user.role !== "candidate") {
    registerFailedAttempt(limiterKey);
    back("invalid-candidate");
  }
  if (user.phone && user.phone !== phone) {
    registerFailedAttempt(limiterKey);
    back("phone-mismatch");
  }

  try {
    await dbExecute(
      `update users set password_hash = $2, phone = $3, updated_at = now() where id = $1`,
      [user.id, bcrypt.hashSync(password, 10), phone],
    );
  } catch (error) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code?: string }).code
        : undefined;
    if (code === "23505") back("phone-taken");
    throw error;
  }
  await createSession({
    role: "candidate",
    actorId: user.id,
    displayName: user.full_name,
  });
  redirect(next ?? "/candidate/dashboard");
}

export async function requestEmployerPasswordResetAction() {
  redirect("/employer/forgot-password");
}

export async function resetEmployerPasswordAction(formData: FormData) {
  if (!hasDatabase()) {
    redirect("/employer/reset-password?error=db-required");
  }

  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!token) {
    redirect("/employer/reset-password?error=invalid-token");
  }
  if (password.length < MIN_PASSWORD) {
    redirect("/employer/reset-password?error=weak-password");
  }
  if (password !== passwordConfirm) {
    redirect("/employer/reset-password?error=password-mismatch");
  }

  const hash = bcrypt.hashSync(password, 10);
  const ok = await finalizeEmployerPasswordReset(token, hash);
  if (!ok) {
    redirect("/employer/reset-password?error=invalid-token");
  }

  redirect("/employer/login?reset=1");
}

export async function requestAdminPasswordResetAction() {
  redirect("/admin/forgot-password");
}

export async function resetAdminPasswordAction(formData: FormData) {
  if (!hasDatabase()) {
    redirect("/admin/reset-password?error=db-required");
  }

  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!token) {
    redirect("/admin/reset-password?error=invalid-token");
  }
  if (password.length < MIN_PASSWORD) {
    redirect("/admin/reset-password?error=weak-password");
  }
  if (password !== passwordConfirm) {
    redirect("/admin/reset-password?error=password-mismatch");
  }

  const hash = bcrypt.hashSync(password, 10);
  const ok = await finalizeAdminPasswordReset(token, hash);
  if (!ok) {
    redirect("/admin/reset-password?error=invalid-token");
  }

  redirect("/admin/login?reset=1");
}

export type SubscriptionChannel = "email_digest" | "sms_reminder" | "job_alerts";

export async function subscribeAlertsAction(formData: FormData) {
  if (!hasDatabase()) {
    redirect("/subscribe?error=db-required");
  }

  const channel = String(formData.get("channel") ?? "").trim() as SubscriptionChannel;
  const address = String(formData.get("address") ?? "").trim();

  const allowed: SubscriptionChannel[] = ["email_digest", "sms_reminder", "job_alerts"];
  if (!allowed.includes(channel) || !address) {
    redirect("/subscribe?error=invalid");
  }

  let storeAddress: string;
  if (channel === "email_digest" || channel === "job_alerts") {
    storeAddress = address.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeAddress)) {
      redirect(`/subscribe?error=invalid&ch=${channel}`);
    }
  } else {
    const digits = address.replace(/[\s().-]/g, "");
    const e164 = digits.startsWith("+") ? digits : `+${digits}`;
    if (!/^\+\d{10,15}$/.test(e164)) {
      redirect(`/subscribe?error=invalid&ch=${channel}`);
    }
    storeAddress = e164;
  }

  const interestAreaRaw = String(formData.get("interestArea") ?? "").trim();
  const interestRoleRaw = String(formData.get("interestRole") ?? "").trim();
  const { listLocations } = await import("@/features/core/repository");
  const { getRoleHub } = await import("@/lib/discover/roles");
  const locations = await listLocations();
  const interestArea = locations.some((location) => location.area === interestAreaRaw)
    ? interestAreaRaw
    : "";
  const interestRole = getRoleHub(interestRoleRaw) ? interestRoleRaw : "";

  try {
    await dbExecute(
      `insert into email_subscriptions (channel, address, active, interest_area, interest_role)
       values ($1, $2, true, $3, $4)
       on conflict (address, channel)
       do update set active = true, interest_area = $3, interest_role = $4, updated_at = now()`,
      [channel, storeAddress, interestArea || null, interestRole || null],
    );
  } catch (e) {
    logger.warn({ err: e, channel }, "email_subscriptions insert with interests failed; retrying without");
    try {
      await dbExecute(
        `insert into email_subscriptions (channel, address, active)
         values ($1, $2, true)
         on conflict (address, channel)
         do update set active = true, updated_at = now()`,
        [channel, storeAddress],
      );
    } catch (retryError) {
      logger.warn({ err: retryError, channel }, "email_subscriptions insert failed");
      redirect(`/subscribe?error=invalid&ch=${channel}`);
    }
  }

  redirect(`/subscribe?subscribed=1&ch=${channel}`);
}
