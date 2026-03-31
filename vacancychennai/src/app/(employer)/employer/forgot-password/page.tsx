import type { Metadata } from "next";
import Link from "next/link";
import { PendingSubmitButton } from "@/components/auth/pending-submit-button";
import AuthPageShell from "@/components/layout/auth-page-shell";
import { requestEmployerPasswordResetAction } from "@/features/auth/account-actions";
import { loginQueryErrorMessage, loginQueryInfoMessage } from "@/lib/auth-login-errors";
import { hasDatabase } from "@/lib/db";

export const metadata: Metadata = {
  title: "Forgot password | Vacancy Chennai",
  description: "Reset your employer account password via email.",
  robots: { index: false, follow: true },
};

type Props = {
  searchParams: Promise<{ error?: string; forgot?: string }>;
};

export default async function EmployerForgotPasswordPage({ searchParams }: Props) {
  const q = await searchParams;
  const errorMessage = loginQueryErrorMessage(q.error);
  const infoMessage = loginQueryInfoMessage({ forgot: q.forgot });
  const db = hasDatabase();

  return (
    <AuthPageShell>
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Reset employer password</h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter your work email. If we find an employer account, we’ll send a one-time link (valid about 1
          hour).
        </p>

        {!db ? (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
            Password reset requires the database and email to be configured.
          </p>
        ) : null}

        {errorMessage ? (
          <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            {errorMessage}
          </p>
        ) : null}
        {infoMessage ? (
          <p role="status" className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
            {infoMessage}
          </p>
        ) : null}

        {db ? (
          <form action={requestEmployerPasswordResetAction} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <PendingSubmitButton label="Send reset link" pendingLabel="Sending…" />
          </form>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/employer/login" className="font-medium text-blue-600 hover:text-blue-800">
            Back to login
          </Link>
        </p>
      </section>
    </AuthPageShell>
  );
}
