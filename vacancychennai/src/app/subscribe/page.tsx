import type { Metadata } from "next";
import Link from "next/link";
import AuthPageShell from "@/components/layout/auth-page-shell";
import { loginQueryErrorMessage, loginQueryInfoMessage } from "@/lib/auth-login-errors";
import { hasDatabase } from "@/lib/db";
import { subscribeAlertsAction, type SubscriptionChannel } from "@/features/auth/account-actions";
import { btnPrimary, focusRing, linkInline, transitionFast } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Subscribe to updates | Vacancy Chennai",
  description: "Get job digests, SMS reminders, or job alerts for Chennai listings.",
  robots: { index: true, follow: true },
};

function parseChannel(ch: string | undefined): SubscriptionChannel | null {
  if (ch === "email" || ch === "email_digest") return "email_digest";
  if (ch === "sms" || ch === "sms_reminder" || ch === "text") return "sms_reminder";
  if (ch === "jobs" || ch === "job_alerts") return "job_alerts";
  return null;
}

const labels: Record<SubscriptionChannel, { title: string; hint: string; input: string; type: string }> = {
  email_digest: {
    title: "Email digest",
    hint: "Occasional roundups of new and featured Chennai jobs.",
    input: "Email address",
    type: "email",
  },
  sms_reminder: {
    title: "Text (SMS) reminders",
    hint: "We’ll text time-sensitive hiring tips or alerts when you opt in. Standard rates may apply.",
    input: "Mobile number (with country code)",
    type: "tel",
  },
  job_alerts: {
    title: "Job alerts",
    hint: "Email when we publish roles that match your interests (MVP: all new listings in your areas).",
    input: "Email address",
    type: "email",
  },
};

type Props = {
  searchParams: Promise<{ ch?: string; error?: string; subscribed?: string }>;
};

export default async function SubscribePage({ searchParams }: Props) {
  const q = await searchParams;
  const channel = parseChannel(q.ch) ?? "email_digest";
  const meta = labels[channel];
  const errorMessage = loginQueryErrorMessage(q.error);
  const infoMessage = loginQueryInfoMessage({ subscribed: q.subscribed });
  const db = hasDatabase();

  return (
    <AuthPageShell>
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">{meta.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{meta.hint}</p>

        {!db ? (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
            Subscriptions are not available while the database is offline. Please try again later or{" "}
            <Link href="/contact" className="font-medium text-blue-700 underline">
              contact us
            </Link>
            .
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Link
            href="/subscribe?ch=email"
            className={`rounded-full px-3 py-1 ${channel === "email_digest" ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-700"} ${focusRing} ${transitionFast}`}
          >
            Email digest
          </Link>
          <Link
            href="/subscribe?ch=sms"
            className={`rounded-full px-3 py-1 ${channel === "sms_reminder" ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-700"} ${focusRing} ${transitionFast}`}
          >
            Text
          </Link>
          <Link
            href="/subscribe?ch=jobs"
            className={`rounded-full px-3 py-1 ${channel === "job_alerts" ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-700"} ${focusRing} ${transitionFast}`}
          >
            Job alerts
          </Link>
        </div>

        {errorMessage ? (
          <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            {errorMessage}
          </p>
        ) : null}
        {infoMessage ? (
          <p role="status" className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
            {infoMessage}
          </p>
        ) : null}

        {db ? (
          <form action={subscribeAlertsAction} className="mt-6 space-y-4">
            <input type="hidden" name="channel" value={channel} />
            <div className="space-y-1">
              <label htmlFor="sub-address" className="text-sm font-medium text-slate-700">
                {meta.input}
              </label>
              <input
                id="sub-address"
                name="address"
                type={meta.type}
                required
                autoComplete={channel === "sms_reminder" ? "tel" : "email"}
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={channel === "sms_reminder" ? "+919876543210" : "you@example.com"}
              />
            </div>
            <button type="submit" className={`${btnPrimary} w-full`}>
              Subscribe
            </button>
          </form>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/" className={linkInline}>
            Back to home
          </Link>
        </p>
      </section>
    </AuthPageShell>
  );
}
