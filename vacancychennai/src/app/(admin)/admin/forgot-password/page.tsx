import type { Metadata } from "next";
import Link from "next/link";
import AuthPageShell from "@/components/layout/auth-page-shell";

export const metadata: Metadata = {
  title: "Admin forgot password | Vacancy Chennai",
  description: "Admin password help without an email reset link.",
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordPage() {
  return (
    <AuthPageShell>
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Reset admin password</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Password reset by email is off. Sign in with the admin password already on the account. If
          that password is lost, set a new hash in the database or write to{" "}
          <a href="mailto:support@vacancychennai.in" className="font-medium text-blue-700 underline">
            support@vacancychennai.in
          </a>
          .
        </p>
        <p className="mt-6 text-center text-sm">
          <Link href="/admin/login" className="font-medium text-blue-600 hover:text-blue-800">
            Back to admin login
          </Link>
        </p>
      </section>
    </AuthPageShell>
  );
}
