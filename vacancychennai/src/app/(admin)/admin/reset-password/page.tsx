import type { Metadata } from "next";
import Link from "next/link";
import { PendingSubmitButton } from "@/components/auth/pending-submit-button";
import AuthPageShell from "@/components/layout/auth-page-shell";
import { resetAdminPasswordAction } from "@/features/auth/account-actions";
import { loginQueryErrorMessage } from "@/lib/auth-login-errors";
import { hasDatabase } from "@/lib/db";
import { validateAdminPasswordResetToken } from "@/lib/email/verification-tokens";

export const metadata: Metadata = {
  title: "Admin new password | Vacancy Chennai",
  description: "Set a new password for your Vacancy Chennai admin account.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export default async function AdminResetPasswordPage({ searchParams }: Props) {
  const q = await searchParams;
  const token = (q.token ?? "").trim();
  const errorMessage = loginQueryErrorMessage(q.error);
  const db = hasDatabase();
  const tokenOk = db && token ? await validateAdminPasswordResetToken(token) : false;

  return (
    <AuthPageShell>
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">New admin password</h1>

        {!db ? (
          <p className="mt-2 text-sm text-amber-800">Password reset is unavailable without a database.</p>
        ) : !token ? (
          <p className="mt-2 text-sm text-slate-600">
            Open the link from your reset email, or{" "}
            <Link href="/admin/forgot-password" className="font-medium text-blue-600 hover:text-blue-800">
              request a new one
            </Link>
            .
          </p>
        ) : !tokenOk ? (
          <p className="mt-2 text-sm text-slate-600">
            This link is invalid or has expired.{" "}
            <Link href="/admin/forgot-password" className="font-medium text-blue-600 hover:text-blue-800">
              Request a new reset link
            </Link>
            .
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-600">Choose a strong password (at least 8 characters).</p>
        )}

        {errorMessage ? (
          <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            {errorMessage}
          </p>
        ) : null}

        {db && token && tokenOk ? (
          <form action={resetAdminPasswordAction} className="mt-6 space-y-4">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="passwordConfirm" className="text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <PendingSubmitButton label="Update password" pendingLabel="Saving…" />
          </form>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/admin/login" className="font-medium text-blue-600 hover:text-blue-800">
            Back to admin login
          </Link>
        </p>
      </section>
    </AuthPageShell>
  );
}
