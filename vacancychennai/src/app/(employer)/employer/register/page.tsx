import type { Metadata } from "next";
import Link from "next/link";
import { PendingSubmitButton } from "@/components/auth/pending-submit-button";
import AuthPageShell from "@/components/layout/auth-page-shell";
import { registerEmployerAction } from "@/features/auth/account-actions";
import { loginQueryErrorMessage } from "@/lib/auth-login-errors";
import { hasDatabase } from "@/lib/db";

export const metadata: Metadata = {
  title: "Create employer account | Vacancy Chennai",
  description: "Register to post hyperlocal jobs in Chennai and manage applicants.",
  robots: { index: false, follow: true },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function EmployerRegisterPage({ searchParams }: Props) {
  const q = await searchParams;
  const errorMessage = loginQueryErrorMessage(q.error);
  const db = hasDatabase();

  return (
    <AuthPageShell>
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:max-w-lg md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create employer account</h1>
        <p className="mt-1 text-sm text-slate-600">
          We’ll email you a link to verify your address before you can use the dashboard.
        </p>

        {!db ? (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
            Registration needs a connected database. See{" "}
            <Link href="/contact" className="font-medium text-blue-800 underline">
              Contact
            </Link>{" "}
            or try the demo without <code className="text-xs">DATABASE_URL</code>.
          </p>
        ) : null}

        {errorMessage ? (
          <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            {errorMessage}
          </p>
        ) : null}

        {db ? (
          <form action={registerEmployerAction} className="mt-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="companyName" className="text-sm font-medium text-slate-700">
                Company name
              </label>
              <input
                id="companyName"
                name="companyName"
                required
                autoComplete="organization"
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                Your name
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                autoComplete="name"
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Work email
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
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone (with country code)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+919876543210 or 9876543210"
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password (min 8 characters)
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
            <PendingSubmitButton label="Create account" pendingLabel="Creating…" />
          </form>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/employer/login" className="font-medium text-blue-600 hover:text-blue-800">
            Employer login
          </Link>
        </p>
      </section>
    </AuthPageShell>
  );
}
