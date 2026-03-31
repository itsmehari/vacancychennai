import { logger } from "@/lib/logger";
import { requireResendClient } from "@/lib/email/resend-client";
import type { EmailVerificationPurpose } from "@/lib/email/verification-tokens";

function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set");
  }
  return raw.replace(/\/$/, "");
}

function buildVerifyUrl(plaintext: string, purpose: EmailVerificationPurpose) {
  const base = getSiteBaseUrl();
  const params = new URLSearchParams({
    token: plaintext,
    purpose,
  });
  return `${base}/api/auth/email/verify?${params.toString()}`;
}

function buildPasswordResetPageUrl(plaintext: string) {
  const base = getSiteBaseUrl();
  const params = new URLSearchParams({ token: plaintext });
  return `${base}/employer/reset-password?${params.toString()}`;
}

function buildAdminPasswordResetPageUrl(plaintext: string) {
  const base = getSiteBaseUrl();
  const params = new URLSearchParams({ token: plaintext });
  return `${base}/admin/reset-password?${params.toString()}`;
}

export async function sendEmployerVerificationEmail(input: {
  to: string;
  fullName: string;
  plaintextToken: string;
}): Promise<void> {
  const { resend, from } = requireResendClient();
  const url = buildVerifyUrl(input.plaintextToken, "employer_verify");
  const subject = "Verify your email — Vacancy Chennai";
  const text = `Hi ${input.fullName},

Please verify your employer email to finish signing in:

${url}

This link expires in 24 hours. If you did not request this, you can ignore this email.

— Vacancy Chennai`;

  const html = `<p>Hi ${escapeHtml(input.fullName)},</p>
<p>Please verify your employer email to finish signing in:</p>
<p><a href="${escapeHtml(url)}">Verify email</a></p>
<p style="color:#64748b;font-size:14px">This link expires in 24 hours. If you did not request this, ignore this email.</p>
<p>— Vacancy Chennai</p>`;

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject,
    text,
    html,
  });

  if (error) {
    logger.warn({ err: error, to: input.to }, "Resend employer verification failed");
    throw new Error("Failed to send verification email");
  }
}

export async function sendCandidateMagicLinkEmail(input: {
  to: string;
  fullName: string;
  plaintextToken: string;
}): Promise<void> {
  const { resend, from } = requireResendClient();
  const url = buildVerifyUrl(input.plaintextToken, "candidate_magic");
  const subject = "Your Vacancy Chennai sign-in link";
  const text = `Hi ${input.fullName},

Use this link to sign in to your candidate account:

${url}

This link expires in 1 hour. If you did not request this, you can ignore this email.

— Vacancy Chennai`;

  const html = `<p>Hi ${escapeHtml(input.fullName)},</p>
<p>Use this link to sign in to your candidate account:</p>
<p><a href="${escapeHtml(url)}">Sign in</a></p>
<p style="color:#64748b;font-size:14px">This link expires in 1 hour. If you did not request this, ignore this email.</p>
<p>— Vacancy Chennai</p>`;

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject,
    text,
    html,
  });

  if (error) {
    logger.warn({ err: error, to: input.to }, "Resend candidate magic link failed");
    throw new Error("Failed to send sign-in email");
  }
}

export async function sendAdminPasswordResetEmail(input: {
  to: string;
  fullName: string;
  plaintextToken: string;
}): Promise<void> {
  const { resend, from } = requireResendClient();
  const url = buildAdminPasswordResetPageUrl(input.plaintextToken);
  const subject = "Reset your Vacancy Chennai admin password";
  const text = `Hi ${input.fullName},

Reset your admin password using this link (valid for 1 hour):

${url}

If you did not request this, ignore this email.

— Vacancy Chennai`;

  const html = `<p>Hi ${escapeHtml(input.fullName)},</p>
<p><a href="${escapeHtml(url)}">Choose a new admin password</a></p>
<p style="color:#64748b;font-size:14px">This link expires in 1 hour. If you did not request this, ignore this email.</p>
<p>— Vacancy Chennai</p>`;

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject,
    text,
    html,
  });

  if (error) {
    logger.warn({ err: error, to: input.to }, "Resend admin password reset failed");
    throw new Error("Failed to send admin password reset email");
  }
}

export async function sendEmployerPasswordResetEmail(input: {
  to: string;
  fullName: string;
  plaintextToken: string;
}): Promise<void> {
  const { resend, from } = requireResendClient();
  const url = buildPasswordResetPageUrl(input.plaintextToken);
  const subject = "Reset your Vacancy Chennai password";
  const text = `Hi ${input.fullName},

Reset your employer account password using this link (valid for 1 hour):

${url}

If you did not request this, ignore this email.

— Vacancy Chennai`;

  const html = `<p>Hi ${escapeHtml(input.fullName)},</p>
<p><a href="${escapeHtml(url)}">Choose a new password</a></p>
<p style="color:#64748b;font-size:14px">This link expires in 1 hour. If you did not request this, ignore this email.</p>
<p>— Vacancy Chennai</p>`;

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject,
    text,
    html,
  });

  if (error) {
    logger.warn({ err: error, to: input.to }, "Resend employer password reset failed");
    throw new Error("Failed to send password reset email");
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
