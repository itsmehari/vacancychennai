import { createHash } from "node:crypto";
import { normalizePhone } from "@/lib/phone";

export const QUICK_JOB_STATUSES = ["new", "reviewed", "spam"] as const;
export type QuickJobStatus = (typeof QUICK_JOB_STATUSES)[number];

export const QUICK_JOB_TEXT_MIN = 20;
export const QUICK_JOB_TEXT_MAX = 8000;

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

export function isQuickJobStatus(value: string): value is QuickJobStatus {
  return (QUICK_JOB_STATUSES as readonly string[]).includes(value);
}

export function normalizeQuickJobEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) return null;
  return email;
}

export function normalizeQuickJobPhone(raw: string): string | null {
  return normalizePhone(raw);
}

export function normalizeQuickJobText(raw: string): string | null {
  const text = raw.replace(/\0/g, "").trim();
  if (text.length < QUICK_JOB_TEXT_MIN || text.length > QUICK_JOB_TEXT_MAX) return null;
  return text;
}

export function quickJobContentHash(text: string): string {
  return createHash("sha256").update(text.toLowerCase()).digest("hex");
}

export function hashQuickJobIp(ip: string): string {
  return createHash("sha256").update(`vc-quick-post|${ip}`).digest("hex");
}

/** Many links in one paste is stored for review, marked spam, and not treated as a normal lead. */
export function looksLikeLinkSpam(text: string): boolean {
  const links = text.match(/https?:\/\/|www\./gi);
  return (links?.length ?? 0) >= 5;
}

/**
 * Human submissions include a page-load timestamp. Missing, future, or instant
 * submits are treated as bots. Callers should pretend the post succeeded.
 */
export function isTooFastOrForged(startedAtRaw: string, now = Date.now()): boolean {
  const started = Number(startedAtRaw);
  if (!Number.isFinite(started) || started < 1_000_000_000_000) return true;
  if (started > now + 2 * 60 * 1000) return true;
  return now - started < 1200;
}
