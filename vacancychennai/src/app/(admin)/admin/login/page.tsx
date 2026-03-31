import type { Metadata } from "next";
import AuthPageShell from "@/components/layout/auth-page-shell";
import Link from "next/link";
import { loginQueryErrorMessage, loginQueryInfoMessage } from "@/lib/auth-login-errors";
import { shouldShowDemoLoginHint } from "@/lib/demo-login-hint";
import { AdminLoginForm } from "./admin-login-form";

type Props = {
  searchParams: Promise<{ error?: string; reset?: string; forgot?: string }>;
};

export const metadata: Metadata = {
  title: "Admin login | Vacancy Chennai",
  description: "Authorized staff sign-in for Vacancy Chennai administration.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const errorMessage = loginQueryErrorMessage(query.error);
  const infoMessage = loginQueryInfoMessage({ reset: query.reset, forgot: query.forgot });
  const showDemoHint = shouldShowDemoLoginHint();

  return (
    <AuthPageShell>
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Admin login</h1>
        {showDemoHint ? (
          <p className="mt-1 text-sm text-slate-600">
            Demo: admin@vacancychennai.in / admin123
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-600">Authorized personnel only.</p>
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
        <AdminLoginForm />
        <p className="mt-3 text-center text-sm">
          <Link href="/admin/forgot-password" className="font-medium text-blue-600 hover:text-blue-800">
            Forgot password?
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-slate-600">
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-800">
            Home
          </Link>
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <Link href="/employer/login" className="font-medium text-blue-600 hover:text-blue-800">
            Employer login
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-slate-600">
          <Link href="/contact" className="text-blue-600 hover:text-blue-800">
            Need access?
          </Link>{" "}
          <span className="text-slate-500">Contact the team via our contact page.</span>
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
