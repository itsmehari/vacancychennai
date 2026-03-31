import { listPublishedJobsCreatedSince } from "@/features/core/repository";
import { sendJobDigestEmail, sendSmsFallbackDigestEmail } from "@/lib/email/send-digest-email";
import { getResendClient } from "@/lib/email/resend-client";
import { logger } from "@/lib/logger";
import { dbQuery, hasDatabase } from "@/lib/db";
import { isTwilioConfigured, sendTwilioSms } from "@/lib/sms/twilio-sms";

type SubRow = { channel: string; address: string };

function digestWindowHours(): number {
  const raw = process.env.NOTIFICATION_DIGEST_WINDOW_HOURS?.trim();
  const n = raw ? Number(raw) : 24;
  return Number.isFinite(n) && n > 0 && n <= 168 ? n : 24;
}

function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "";
  return raw.replace(/\/$/, "");
}

async function loadActiveSubscriptions(): Promise<SubRow[]> {
  if (!hasDatabase()) return [];
  return dbQuery<SubRow>(
    `select channel, address from email_subscriptions where active = true`,
  );
}

export type ScheduledNotificationResult = {
  ok: true;
  summary: string;
  newJobs: number;
  emailsSent: number;
  emailsFailed: number;
  smsSent: number;
  smsFailed: number;
  smsFallbackEmailSent: boolean;
};

export async function runScheduledNotifications(): Promise<ScheduledNotificationResult> {
  if (!hasDatabase()) {
    return {
      ok: true,
      summary: "skipped: database not configured",
      newJobs: 0,
      emailsSent: 0,
      emailsFailed: 0,
      smsSent: 0,
      smsFailed: 0,
      smsFallbackEmailSent: false,
    };
  }

  const hours = digestWindowHours();
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  const published = await listPublishedJobsCreatedSince(since);

  if (published.length === 0) {
    return {
      ok: true,
      summary: `no published jobs created in the last ${hours}h`,
      newJobs: 0,
      emailsSent: 0,
      emailsFailed: 0,
      smsSent: 0,
      smsFailed: 0,
      smsFallbackEmailSent: false,
    };
  }

  const rows = await loadActiveSubscriptions();
  const emailSet = new Set<string>();
  for (const r of rows) {
    if (r.channel === "email_digest" || r.channel === "job_alerts") {
      emailSet.add(r.address.trim().toLowerCase());
    }
  }
  const smsNumbers = rows.filter((r) => r.channel === "sms_reminder").map((r) => r.address.trim());

  const base = getSiteBaseUrl();
  const jobWord = published.length === 1 ? "job" : "jobs";
  const smsBody = `Vacancy Chennai: ${published.length} new ${jobWord}. Browse: ${base || "(set NEXT_PUBLIC_SITE_URL)"}/jobs-in-chennai`;

  let emailsSent = 0;
  let emailsFailed = 0;
  const resendReady = getResendClient();
  if (emailSet.size > 0 && !resendReady) {
    logger.warn("scheduled notifications: Resend not configured; skipping digest emails");
    emailsFailed = emailSet.size;
  } else if (emailSet.size > 0 && resendReady) {
    for (const to of emailSet) {
      try {
        await sendJobDigestEmail({ to, jobs: published });
        emailsSent += 1;
      } catch (e) {
        logger.warn({ err: e, to }, "digest email send failed");
        emailsFailed += 1;
      }
    }
  }

  let smsSent = 0;
  let smsFailed = 0;
  let smsFallbackEmailSent = false;
  const fallbackTo = process.env.ADMIN_SMS_DIGEST_EMAIL?.trim();

  if (smsNumbers.length > 0) {
    if (isTwilioConfigured()) {
      for (const to of smsNumbers) {
        try {
          await sendTwilioSms(to, smsBody);
          smsSent += 1;
        } catch (e) {
          logger.warn({ err: e, to }, "Twilio SMS failed");
          smsFailed += 1;
        }
      }
    } else {
      smsFailed = smsNumbers.length;
      logger.warn("scheduled notifications: Twilio not configured; SMS reminders skipped");
      if (fallbackTo && getResendClient()) {
        try {
          await sendSmsFallbackDigestEmail({
            to: fallbackTo,
            jobCount: published.length,
            smsRecipients: smsNumbers,
          });
          smsFallbackEmailSent = true;
        } catch (e) {
          logger.warn({ err: e }, "SMS fallback email failed");
        }
      }
    }
  }

  const summary = [
    `${published.length} new job(s) in window`,
    `${emailsSent} digest email(s) sent`,
    emailsFailed ? `${emailsFailed} email(s) failed` : null,
    `${smsSent} SMS sent`,
    smsFailed ? `${smsFailed} SMS skipped/failed` : null,
    smsFallbackEmailSent ? "admin SMS fallback email sent" : null,
  ]
    .filter(Boolean)
    .join("; ");

  return {
    ok: true,
    summary,
    newJobs: published.length,
    emailsSent,
    emailsFailed,
    smsSent,
    smsFailed,
    smsFallbackEmailSent,
  };
}
