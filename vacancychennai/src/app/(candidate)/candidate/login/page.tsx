import type { Metadata } from "next";
import AuthPageShell from "@/components/layout/auth-page-shell";
import Link from "next/link";
import { loginQueryErrorMessage, loginQueryInfoMessage } from "@/lib/auth-login-errors";
import { hasDatabase } from "@/lib/db";
import { resumeDoctorReferralUrl } from "@/lib/partner-resumedoctor";
import { shouldShowDemoLoginHint } from "@/lib/demo-login-hint";
import { CandidateLoginForm } from "./candidate-login-form";

type Props = {
  searchParams: Promise<{ error?: string; new?: string; sent?: string }>;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}): Promise<Metadata> {
  const q = await searchParams;
  const signup = q.new === "1" || q.new === "true";
  return {
    title: signup ? "Create free account | Vacancy Chennai" : "Candidate login | Vacancy Chennai",
    description: signup
      ? "Free Vacancy Chennai candidate account — use the same email you quick-apply with to track applications and your profile."
      : "Sign in to track applications, update your profile, and browse moderated hyperlocal jobs in Chennai.",
    robots: { index: false, follow: true },
  };
}

export default async function CandidateLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const errorMessage = loginQueryErrorMessage(query.error);
  const infoMessage = loginQueryInfoMessage({ sent: query.sent });
  const showDemoHint = shouldShowDemoLoginHint();
  const magicLinkMode = hasDatabase();
  const fromHomeSignup = query.new === "1" || query.new === "true";
  const resumeDoctorUrl = resumeDoctorReferralUrl("auth_candidate_login");

  return (
    <AuthPageShell>
      <section className="w-full rounded-2xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/[0.06] md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Candidate login</h1>
        {fromHomeSignup ? (
          <p className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm leading-relaxed text-blue-950 ring-1 ring-blue-100">
            Free account — use the email you&apos;ll use when you quick-apply so your applications stay in one
            dashboard.
          </p>
        ) : null}
        {showDemoHint ? (
          <p className="mt-1 text-sm text-slate-600">
            Demo: sign in with <span className="font-medium">candidate@vacancychennai.in</span> (email
            only in mock mode).
          </p>
        ) : magicLinkMode ? (
          <p className="mt-1 text-sm text-slate-600">
            Enter the email you use for applications — we&apos;ll send a secure one-time link to sign in.
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-600">
            Use the email you applied with to access your dashboard and saved activity.
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
        <CandidateLoginForm
          showDevNote={showDemoHint}
          magicLinkMode={magicLinkMode}
        />
        <p className="mt-5 text-center text-xs leading-relaxed text-slate-500">
          Updating your résumé before uploads?{" "}
          <a
            href={resumeDoctorUrl}
            className="font-medium text-blue-600 underline-offset-2 hover:text-blue-800 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            data-partner-link="resume-doctor"
            data-utm-content="auth_candidate_login"
          >
            ResumeDoctor ATS builder
          </a>
          {" — "}
          <span className="text-slate-500">sister product.</span>
        </p>
        <p className="mt-4 text-center text-sm text-slate-600">
          <Link href="/employer/login" className="font-medium text-blue-600 hover:text-blue-800">
            Employer login
          </Link>
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <Link href="/jobs-in-chennai" className="font-medium text-blue-600 hover:text-blue-800">
            Browse jobs
          </Link>
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <Link href="/freshers-jobs-chennai" className="font-medium text-blue-600 hover:text-blue-800">
            Freshers
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-slate-600">
          <Link href="/candidate/register" className="font-medium text-blue-600 hover:text-blue-800">
            Create free account
          </Link>
          <span className="mx-2 text-slate-400" aria-hidden>
            ·
          </span>
          <Link href="/contact" className="text-blue-600 hover:text-blue-800">
            Need help?
          </Link>
          <span className="mx-2 text-slate-400" aria-hidden>
            ·
          </span>
          <Link href="/jobs-in-chennai" className="text-blue-600 hover:text-blue-800">
            Browse jobs
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-slate-500">
          By continuing you agree to our{" "}
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
