import { dbQuery, hasDatabase } from "@/lib/db";
import { getResendClient } from "@/lib/email/resend-client";
import { logger } from "@/lib/logger";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://vacancychennai.in";

/**
 * Email employers whose monthly pass ends within ~72 hours (dedupe per run by query window).
 */
export async function runBillingReminders(): Promise<{ ok: boolean; sent: number; skipped: string }> {
  if (!hasDatabase()) {
    return { ok: true, sent: 0, skipped: "no_database" };
  }
  const resendReady = getResendClient();
  if (!resendReady) {
    return { ok: true, sent: 0, skipped: "resend_unconfigured" };
  }

  const rows = await dbQuery<{ email: string; ends_at: string; full_name: string }>(
    `select u.email, e.ends_at::text as ends_at, u.full_name
     from entitlements e
     inner join users u on u.id = e.owner_user_id
     where e.status = 'active'
       and e.entitlement_type = 'monthly_pass'
       and e.ends_at is not null
       and e.ends_at > now()
       and e.ends_at <= now() + interval '3 days'
       and u.email is not null`,
  );

  let sent = 0;
  for (const row of rows) {
    const { error } = await resendReady.resend.emails.send({
      from: resendReady.from,
      to: row.email,
      subject: "Your Vacancy Chennai employer pass is ending soon",
      text: `Hi ${row.full_name},

Your employer monthly pass on Vacancy Chennai ends around ${row.ends_at}.
Renew from your billing page to keep up to two concurrent live listings: ${siteUrl}/employer/billing

— Vacancy Chennai`,
    });
    if (error) {
      logger.warn({ err: error, to: row.email }, "billing reminder email failed");
    } else {
      sent += 1;
    }
  }

  return { ok: true, sent, skipped: "none" };
}
