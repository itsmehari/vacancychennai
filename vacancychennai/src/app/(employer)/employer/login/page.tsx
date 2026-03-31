import type { Metadata } from "next";
import AuthPageShell from "@/components/layout/auth-page-shell";
import Link from "next/link";
import { loginQueryErrorMessage, loginQueryInfoMessage } from "@/lib/auth-login-errors";
import { hasDatabase } from "@/lib/db";
import { shouldShowDemoLoginHint } from "@/lib/demo-login-hint";
import { EmployerLoginForm } from "./employer-login-form";

type Props = {
  searchParams: Promise<{ error?: string; resent?: string; registered?: string; reset?: string }>;
};

export const metadata: Metadata = {
  title: "Employer login | Vacancy Chennai",
  description:
    "Sign in to post jobs, manage listings, and reach candidates in Chennai and suburbs.",
  robots: { index: false, follow: true },
};

export default async function EmployerLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const errorMessage = loginQueryErrorMessage(query.error);
  const infoMessage = loginQueryInfoMessage({
    resent: query.resent,
    registered: query.registered,
    reset: query.reset,
  });
  const showDemoHint = shouldShowDemoLoginHint();
  const showVerificationResend = hasDatabase();

  return (
    <AuthPageShell>
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Employer login</h1>
        {showDemoHint ? (
          <p className="mt-1 text-sm text-slate-600">
            Demo: employer@vacancychennai.in / demo123
          </p>
        ) : showVerificationResend ? (
          <p className="mt-1 text-sm text-slate-600">
            Sign in with email and password. If your account is new or unverified, we email you a link to
            confirm your address before opening the dashboard. Wrong account?{" "}
            <Link
              href="/candidate/login"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Candidate login
            </Link>
            .
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-600">
            Employers only — hiring for Chennai and suburbs. Wrong account?{" "}
            <Link
              href="/candidate/login"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Use candidate login
            </Link>
            .
          </p>
        )}
        {errorMessage ? (
          <p
            role="alert"
            className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100"
          >
            {errorMessage}
          </p>
        ) : null}
        {infoMessage ? (
          <p
            role="status"
            className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100"
          >
            {infoMessage}
          </p>
        ) : null}
        <EmployerLoginForm showVerificationResend={showVerificationResend} />
        <p className="mt-4 text-center text-sm text-slate-600">
          <Link href="/candidate/login" className="font-medium text-blue-600 hover:text-blue-800">
            Candidate login
          </Link>
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <Link href="/pricing" className="font-medium text-blue-600 hover:text-blue-800">
            Pricing
          </Link>
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <Link href="/post-job" className="font-medium text-blue-600 hover:text-blue-800">
            Post a job
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-slate-600">
          <Link href="/employer/forgot-password" className="text-blue-600 hover:text-blue-800">
            Forgot password?
          </Link>
          <span className="mx-2 text-slate-400" aria-hidden>
            ·
          </span>
          <span>
            New employer?{" "}
            <Link href="/employer/register" className="text-blue-600 hover:text-blue-800">
              Create account
            </Link>{" "}
            ·{" "}
            <Link href="/pricing" className="text-blue-600 hover:text-blue-800">
              Pricing
            </Link>
          </span>
        </p>
        <p className="mt-4 text-center text-xs text-slate-500">
          By signing in you agree to our{" "}
          <Link href="/terms" className="text-blue-600 hover:text-blue-800">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
            Privacy
          </Link>
          .
        </p>
      </section>
    </AuthPageShell>
  );
}
