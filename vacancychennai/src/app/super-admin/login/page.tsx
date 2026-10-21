import AuthPageShell from "@/components/layout/auth-page-shell";
import { PendingSubmitButton } from "@/components/auth/pending-submit-button";
import { superAdminLoginAction } from "@/features/super-admin/actions";
import { formInput } from "@/lib/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/super-admin-session";

export const metadata: Metadata = {
  title: "Inbox login | Vacancy Chennai",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

function errorCopy(error?: string) {
  if (error === "invalid") return "Those details do not match.";
  if (error === "rate") return "Too many attempts. Wait 15 minutes and try again.";
  return null;
}

export default async function SuperAdminLoginPage({ searchParams }: Props) {
  if (await isSuperAdmin()) redirect("/super-admin");
  const query = await searchParams;
  const message = errorCopy(query.error);

  return (
    <AuthPageShell>
      <section className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Vacancy inbox</h1>
        <p className="mt-1 text-sm text-slate-600">Sign in to read pasted job posts.</p>
        {message ? (
          <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            {message}
          </p>
        ) : null}
        <form action={superAdminLoginAction} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className={`mt-1 ${formInput}`}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`mt-1 ${formInput}`}
            />
          </label>
          <PendingSubmitButton label="Sign in" pendingLabel="Signing in…" />
        </form>
      </section>
    </AuthPageShell>
  );
}
