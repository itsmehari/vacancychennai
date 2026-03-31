import { createHash, randomBytes } from "crypto";
import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";

export type EmailVerificationPurpose =
  | "employer_verify"
  | "candidate_magic"
  | "password_reset"
  | "admin_password_reset";

const TTL_MS: Record<EmailVerificationPurpose, number> = {
  employer_verify: 24 * 60 * 60 * 1000,
  candidate_magic: 60 * 60 * 1000,
  password_reset: 60 * 60 * 1000,
  admin_password_reset: 60 * 60 * 1000,
};

export function hashVerificationToken(plaintext: string): string {
  return createHash("sha256").update(plaintext, "utf8").digest("hex");
}

function generateTokenPlaintext(): string {
  return randomBytes(32).toString("base64url");
}

export async function createEmailVerificationToken(
  userId: string,
  purpose: EmailVerificationPurpose,
): Promise<string | null> {
  if (!hasDatabase()) return null;

  const plaintext = generateTokenPlaintext();
  const tokenHash = hashVerificationToken(plaintext);
  const expiresAt = new Date(Date.now() + TTL_MS[purpose]);

  await dbExecute(
    `delete from email_verification_tokens
     where user_id = $1 and purpose = $2 and consumed_at is null`,
    [userId, purpose],
  );

  await dbExecute(
    `insert into email_verification_tokens (user_id, token_hash, purpose, expires_at)
     values ($1, $2, $3, $4)`,
    [userId, tokenHash, purpose, expiresAt.toISOString()],
  );

  return plaintext;
}

export type ConsumedTokenUser = {
  id: string;
  role: "candidate" | "employer" | "admin";
  full_name: string;
  email: string;
};

export async function consumeEmailVerificationToken(
  plaintext: string,
  purpose: EmailVerificationPurpose,
): Promise<ConsumedTokenUser | null> {
  if (!hasDatabase()) return null;

  const tokenHash = hashVerificationToken(plaintext);

  const consumed = await dbQuery<{ user_id: string }>(
    `update email_verification_tokens t
     set consumed_at = now()
     where t.token_hash = $1
       and t.purpose = $2
       and t.consumed_at is null
       and t.expires_at > now()
     returning t.user_id`,
    [tokenHash, purpose],
  );

  const userId = consumed[0]?.user_id;
  if (!userId) {
    return null;
  }

  await dbExecute(
    `update users
     set email_verified_at = coalesce(email_verified_at, now()),
         updated_at = now()
     where id = $1`,
    [userId],
  );

  const users = await dbQuery<ConsumedTokenUser>(
    `select id, role, full_name, email from users where id = $1 limit 1`,
    [userId],
  );

  return users[0] ?? null;
}

/** True if token exists, is password_reset, unused, and belongs to an employer. */
export async function validatePasswordResetToken(plaintext: string): Promise<boolean> {
  if (!hasDatabase()) return false;
  const tokenHash = hashVerificationToken(plaintext);
  const rows = await dbQuery<{ one: number }>(
    `select 1 as one
     from email_verification_tokens t
     join users u on u.id = t.user_id
     where t.token_hash = $1
       and t.purpose = 'password_reset'
       and t.consumed_at is null
       and t.expires_at > now()
       and u.role = 'employer'
     limit 1`,
    [tokenHash],
  );
  return rows.length > 0;
}

/** Admin password reset link (separate from employer). */
export async function validateAdminPasswordResetToken(plaintext: string): Promise<boolean> {
  if (!hasDatabase()) return false;
  const tokenHash = hashVerificationToken(plaintext);
  const rows = await dbQuery<{ one: number }>(
    `select 1 as one
     from email_verification_tokens t
     join users u on u.id = t.user_id
     where t.token_hash = $1
       and t.purpose = 'admin_password_reset'
       and t.consumed_at is null
       and t.expires_at > now()
       and u.role = 'admin'
     limit 1`,
    [tokenHash],
  );
  return rows.length > 0;
}

export async function finalizeAdminPasswordReset(
  plaintext: string,
  passwordHash: string,
): Promise<boolean> {
  if (!hasDatabase()) return false;
  const tokenHash = hashVerificationToken(plaintext);
  const rows = await dbQuery<{ id: string }>(
    `with consumed as (
       update email_verification_tokens t
       set consumed_at = now()
       where t.token_hash = $1
         and t.purpose = 'admin_password_reset'
         and t.consumed_at is null
         and t.expires_at > now()
       returning t.user_id
     ),
     updated as (
       update users u
       set password_hash = $2, updated_at = now()
       from consumed c
       where u.id = c.user_id and u.role = 'admin'::user_role
       returning u.id
     )
     select id from updated`,
    [tokenHash, passwordHash],
  );
  return rows.length > 0;
}

/** Atomically consume token and set employer password. Returns false if token invalid or user not employer. */
export async function finalizeEmployerPasswordReset(
  plaintext: string,
  passwordHash: string,
): Promise<boolean> {
  if (!hasDatabase()) return false;
  const tokenHash = hashVerificationToken(plaintext);
  const rows = await dbQuery<{ id: string }>(
    `with consumed as (
       update email_verification_tokens t
       set consumed_at = now()
       where t.token_hash = $1
         and t.purpose = 'password_reset'
         and t.consumed_at is null
         and t.expires_at > now()
       returning t.user_id
     ),
     updated as (
       update users u
       set password_hash = $2, updated_at = now()
       from consumed c
       where u.id = c.user_id and u.role = 'employer'::user_role
       returning u.id
     )
     select id from updated`,
    [tokenHash, passwordHash],
  );
  return rows.length > 0;
}
