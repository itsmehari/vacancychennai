import { listLocations, listPublishedJobsCreatedSince } from "@/features/core/repository";
import { sendJobDigestEmail, sendSmsFallbackDigestEmail } from "@/lib/email/send-digest-email";
import { getResendClient } from "@/lib/email/resend-client";
import { logger } from "@/lib/logger";
import { dbQuery, hasDatabase } from "@/lib/db";
import { jobMatchesRole } from "@/lib/discover/match";
import { getRoleHub } from "@/lib/discover/roles";
import { isTwilioConfigured, sendTwilioSms } from "@/lib/sms/twilio-sms";
import type { Job, Location } from "@/types/domain";

type SubRow = {
  channel: string;
  address: string;
  interest_area: string | null;
  interest_role: string | null;
};

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
  try {
    return await dbQuery<SubRow>(
      `select channel, address, interest_area, interest_role from email_subscriptions where active = true`,
    );
  } catch (error) {
    logger.warn({ err: error }, "subscription interest columns unavailable; sending unfiltered digests");
    const rows = await dbQuery<{ channel: string; address: string }>(
      `select channel, address from email_subscriptions where active = true`,
    );
    return rows.map((row) => ({ ...row, interest_area: null, interest_role: null }));
  }
}

function jobsForInterest(
  jobs: Job[],
  locationsById: Map<string, Location>,
  area: string | null,
  role: string | null,
): Job[] {
  return jobs.filter((job) => {
    if (area) {
      const loc = locationsById.get(job.locationId);
      const want = area.trim().toLowerCase();
      const areaName = loc?.area.toLowerCase() ?? "";
      const zone = loc?.zone.toLowerCase() ?? "";
      if (areaName !== want && !zone.includes(want)) return false;
    }
    if (role) {
      const hub = getRoleHub(role);
      if (hub) return jobMatchesRole(job, hub);
      const hay = `${job.title} ${job.category}`.toLowerCase();
      if (!hay.includes(role.toLowerCase())) return false;
    }
    return true;
  });
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
  const locations = await listLocations();
  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const emailRows = rows.filter((row) => row.channel === "email_digest" || row.channel === "job_alerts");
  const smsNumbers = rows.filter((row) => row.channel === "sms_reminder");

  const base = getSiteBaseUrl();

  let emailsSent = 0;
  let emailsFailed = 0;
  const resendReady = getResendClient();
  if (emailRows.length > 0 && !resendReady) {
    logger.warn("scheduled notifications: Resend not configured; skipping digest emails");
    emailsFailed = emailRows.length;
  } else if (emailRows.length > 0 && resendReady) {
    for (const row of emailRows) {
      const matched = jobsForInterest(published, locationsById, row.interest_area, row.interest_role);
      if (matched.length === 0) continue;
      try {
        await sendJobDigestEmail({ to: row.address.trim().toLowerCase(), jobs: matched });
        emailsSent += 1;
      } catch (e) {
        logger.warn({ err: e, to: row.address }, "digest email send failed");
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
      for (const row of smsNumbers) {
        const matched = jobsForInterest(published, locationsById, row.interest_area, row.interest_role);
        if (matched.length === 0) continue;
        const word = matched.length === 1 ? "job" : "jobs";
        const body = `Vacancy Chennai: ${matched.length} new ${word}. Browse: ${base || "(set NEXT_PUBLIC_SITE_URL)"}/jobs-in-chennai`;
        try {
          await sendTwilioSms(row.address.trim(), body);
          smsSent += 1;
        } catch (e) {
          logger.warn({ err: e, to: row.address }, "Twilio SMS failed");
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
            smsRecipients: smsNumbers.map((row) => row.address.trim()),
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
