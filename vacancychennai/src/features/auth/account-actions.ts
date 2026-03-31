"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";
import {
  sendAdminPasswordResetEmail,
  sendCandidateMagicLinkEmail,
  sendEmployerPasswordResetEmail,
  sendEmployerVerificationEmail,
} from "@/lib/email/send-auth-email";
import {
  createEmailVerificationToken,
  finalizeAdminPasswordReset,
  finalizeEmployerPasswordReset,
} from "@/lib/email/verification-tokens";
import { getResendClient } from "@/lib/email/resend-client";
import { logger } from "@/lib/logger";
import {
  canSendVerificationEmail,
  getRateLimitState,
  recordVerificationEmailSent,
  registerFailedAttempt,
} from "@/lib/rate-limit";

const MIN_PASSWORD = 8;

function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s().-]/g, "");
  if (!digits) return null;
  if (digits.startsWith("+")) {
    return /^\+\d{10,15}$/.test(digits) ? digits : null;
  }
  if (/^\d{10}$/.test(digits)) return `+91${digits}`;
  if (/^\d{11,15}$/.test(digits)) return `+${digits}`;
  return null;
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

async function sendEmployerVerifyAfterRegister(user: {
  id: string;
  email: string;
  full_name: string;
}): Promise<"sent" | "rate-limited" | "config" | "failed"> {
  if (!getResendClient()) return "config";
  const rateKey = `employer-verify-send:${user.email.toLowerCase()}`;
  if (!canSendVerificationEmail(rateKey)) return "rate-limited";
  const plaintext = await createEmailVerificationToken(user.id, "employer_verify");
  if (!plaintext) return "failed";
  try {
    await sendEmployerVerificationEmail({
      to: user.email,
      fullName: user.full_name,
      plaintextToken: plaintext,
    });
    recordVerificationEmailSent(rateKey);
    return "sent";
  } catch (e) {
    logger.warn({ err: e, email: user.email }, "employer verification after register failed");
    return "failed";
  }
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
    `insert into users (role, full_name, email, phone, password_hash, status)
     values ('employer'::user_role, $1, $2, $3, $4, 'active'::account_status)
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

  const sendResult = await sendEmployerVerifyAfterRegister({
    id: userId,
    email,
    full_name: fullName,
  });
  if (sendResult === "config") {
    redirect("/employer/register?error=email-config");
  }
  if (sendResult === "rate-limited") {
    redirect("/employer/register?error=email-rate-limited");
  }
  if (sendResult === "failed") {
    redirect("/employer/register?error=email-failed");
  }

  redirect("/employer/login?registered=1");
}

export async function registerCandidateAction(formData: FormData) {
  if (!hasDatabase()) {
    redirect("/candidate/register?error=db-required");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));

  if (!fullName || !email) {
    redirect("/candidate/register?error=invalid");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    redirect("/candidate/register?error=email-taken");
  }

  if (!getResendClient()) {
    redirect("/candidate/register?error=email-config");
  }

  const inserted = await dbQuery<{ id: string }>(
    `insert into users (role, full_name, email, phone, password_hash, status)
     values ('candidate'::user_role, $1, $2, null, null, 'active'::account_status)
     returning id`,
    [fullName, email],
  );
  const userId = inserted[0]?.id;
  if (!userId) {
    redirect("/candidate/register?error=invalid");
  }

  try {
    await dbExecute(`insert into candidate_profiles (user_id) values ($1)`, [userId]);
  } catch (e) {
    logger.warn({ err: e, userId }, "candidate_profiles insert failed");
    await dbExecute(`delete from users where id = $1`, [userId]);
    redirect("/candidate/register?error=invalid");
  }

  const rateKey = `candidate-magic:${email}`;
  if (!canSendVerificationEmail(rateKey)) {
    redirect("/candidate/register?error=email-rate-limited");
  }

  const plaintext = await createEmailVerificationToken(userId, "candidate_magic");
  if (!plaintext) {
    redirect("/candidate/register?error=email-failed");
  }

  try {
    await sendCandidateMagicLinkEmail({
      to: email,
      fullName: fullName,
      plaintextToken: plaintext,
    });
    recordVerificationEmailSent(rateKey);
  } catch (e) {
    logger.warn({ err: e, email }, "candidate welcome magic link failed");
    redirect("/candidate/register?error=email-failed");
  }

  redirect("/candidate/login?sent=1");
}

export async function requestEmployerPasswordResetAction(formData: FormData) {
  if (!hasDatabase()) {
    redirect("/employer/forgot-password?error=db-required");
  }

  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) {
    redirect("/employer/forgot-password?error=invalid");
  }

  const limiterKey = `pwd-reset-req:${email}`;
  const rate = getRateLimitState(limiterKey);
  if (rate.blocked) {
    redirect("/employer/forgot-password?error=rate-limited");
  }

  if (!getResendClient()) {
    redirect("/employer/forgot-password?error=email-config");
  }

  const user = await findUserByEmail(email);
  if (user && user.role === "employer") {
    const rateKey = `pwd-reset-send:${email}`;
    if (!canSendVerificationEmail(rateKey, 5, 60 * 60 * 1000)) {
      redirect("/employer/forgot-password?error=email-rate-limited");
    }
    const plaintext = await createEmailVerificationToken(user.id, "password_reset");
    if (plaintext) {
      try {
        await sendEmployerPasswordResetEmail({
          to: user.email,
          fullName: user.full_name,
          plaintextToken: plaintext,
        });
        recordVerificationEmailSent(rateKey);
      } catch (e) {
        logger.warn({ err: e, email }, "password reset email failed");
        registerFailedAttempt(limiterKey, { maxAttempts: 10, blockMs: 15 * 60 * 1000 });
        redirect("/employer/forgot-password?error=email-failed");
      }
    }
  }

  redirect("/employer/forgot-password?forgot=1");
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

export async function requestAdminPasswordResetAction(formData: FormData) {
  if (!hasDatabase()) {
    redirect("/admin/forgot-password?error=db-required");
  }

  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) {
    redirect("/admin/forgot-password?error=invalid");
  }

  const limiterKey = `admin-pwd-reset-req:${email}`;
  const rate = getRateLimitState(limiterKey);
  if (rate.blocked) {
    redirect("/admin/forgot-password?error=rate-limited");
  }

  if (!getResendClient()) {
    redirect("/admin/forgot-password?error=email-config");
  }

  const user = await findUserByEmail(email);
  if (user && user.role === "admin") {
    const rateKey = `admin-pwd-reset-send:${email}`;
    if (!canSendVerificationEmail(rateKey, 5, 60 * 60 * 1000)) {
      redirect("/admin/forgot-password?error=email-rate-limited");
    }
    const plaintext = await createEmailVerificationToken(user.id, "admin_password_reset");
    if (plaintext) {
      try {
        await sendAdminPasswordResetEmail({
          to: user.email,
          fullName: user.full_name,
          plaintextToken: plaintext,
        });
        recordVerificationEmailSent(rateKey);
      } catch (e) {
        logger.warn({ err: e, email }, "admin password reset email failed");
        registerFailedAttempt(limiterKey, { maxAttempts: 10, blockMs: 15 * 60 * 1000 });
        redirect("/admin/forgot-password?error=email-failed");
      }
    }
  }

  redirect("/admin/forgot-password?forgot=1");
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

  try {
    await dbExecute(
      `insert into email_subscriptions (channel, address, active)
       values ($1, $2, true)
       on conflict (address, channel)
       do update set active = true, updated_at = now()`,
      [channel, storeAddress],
    );
  } catch (e) {
    logger.warn({ err: e, channel }, "email_subscriptions insert failed");
    redirect(`/subscribe?error=invalid&ch=${channel}`);
  }

  redirect(`/subscribe?subscribed=1&ch=${channel}`);
}
