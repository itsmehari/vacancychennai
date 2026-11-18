/**
 * Employer pass reminders used to go out by email. That mail is off.
 * The cron route still calls this so the schedule does not fail.
 */
export async function runBillingReminders(): Promise<{ ok: boolean; sent: number; skipped: string }> {
  return { ok: true, sent: 0, skipped: "email_disabled" };
}
