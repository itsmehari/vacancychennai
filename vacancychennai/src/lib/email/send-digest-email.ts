import { logger } from "@/lib/logger";
import { requireResendClient } from "@/lib/email/resend-client";
import type { Job } from "@/types/domain";

function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not set");
  }
  return raw.replace(/\/$/, "");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendJobDigestEmail(input: { to: string; jobs: Job[] }): Promise<void> {
  const { resend, from } = requireResendClient();
  const base = getSiteBaseUrl();
  const n = input.jobs.length;
  const subject =
    n === 1 ? "1 new job on Vacancy Chennai" : `${n} new jobs on Vacancy Chennai`;

  const lines = input.jobs.map((j) => {
    const url = `${base}/jobs/${j.id}`;
    return `• ${j.title} — ${url}`;
  });
  const text = `Hi,

Here are the latest listings from Vacancy Chennai:

${lines.join("\n")}

Browse all jobs: ${base}/jobs-in-chennai

— Vacancy Chennai`;

  const listHtml = input.jobs
    .map((j) => {
      const url = `${base}/jobs/${j.id}`;
      return `<li><a href="${escapeHtml(url)}">${escapeHtml(j.title)}</a></li>`;
    })
    .join("");

  const html = `<p>Here are the latest listings:</p><ul>${listHtml}</ul>
<p><a href="${escapeHtml(`${base}/jobs-in-chennai`)}">Browse all jobs</a></p>
<p style="color:#64748b;font-size:14px">— Vacancy Chennai</p>`;

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject,
    text,
    html,
  });

  if (error) {
    logger.warn({ err: error, to: input.to }, "Resend job digest failed");
    throw new Error("Failed to send digest email");
  }
}

export async function sendSmsFallbackDigestEmail(input: {
  to: string;
  jobCount: number;
  smsRecipients: string[];
}): Promise<void> {
  const { resend, from } = requireResendClient();
  const base = getSiteBaseUrl();
  const subject = `[Vacancy Chennai] SMS digest fallback — ${input.jobCount} new job(s)`;
  const body = `Twilio is not configured or SMS failed. New jobs in the digest window: ${input.jobCount}.

SMS reminder subscribers (${input.smsRecipients.length}):
${input.smsRecipients.join("\n")}

Site: ${base}/jobs-in-chennai`;

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject,
    text: body,
  });

  if (error) {
    logger.warn({ err: error, to: input.to }, "Resend SMS fallback digest failed");
    throw new Error("Failed to send SMS fallback email");
  }
}
