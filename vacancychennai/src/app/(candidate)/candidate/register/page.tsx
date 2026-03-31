import type { Metadata } from "next";
import Link from "next/link";
import { PendingSubmitButton } from "@/components/auth/pending-submit-button";
import AuthPageShell from "@/components/layout/auth-page-shell";
import { registerCandidateAction } from "@/features/auth/account-actions";
import { loginQueryErrorMessage } from "@/lib/auth-login-errors";
import { hasDatabase } from "@/lib/db";

export const metadata: Metadata = {
  title: "Create candidate account | Vacancy Chennai",
  description: "Free account — we’ll email you a secure link to sign in and track applications.",
  robots: { index: false, follow: true },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CandidateRegisterPage({ searchParams }: Props) {
  const q = await searchParams;
  const errorMessage = loginQueryErrorMessage(q.error);
  const db = hasDatabase();

  return (
    <AuthPageShell>
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create free account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Use the same email you’ll use when you apply to jobs. We’ll send a one-time sign-in link — no
          password to remember.
        </p>

        {!db ? (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
            Registration needs a connected database and email. Try demo mode without <code className="text-xs">DATABASE_URL</code>{" "}
            or contact us.
          </p>
        ) : null}

        {errorMessage ? (
          <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            {errorMessage}
          </p>
        ) : null}

        {db ? (
          <form action={registerCandidateAction} className="mt-6 space-y-4">
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
            <PendingSubmitButton label="Create account & email me a link" pendingLabel="Creating…" />
          </form>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/candidate/login" className="font-medium text-blue-600 hover:text-blue-800">
            Candidate login
          </Link>
        </p>
      </section>
    </AuthPageShell>
  );
}
