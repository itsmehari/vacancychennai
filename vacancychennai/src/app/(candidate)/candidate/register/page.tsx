import type { Metadata } from "next";
import Link from "next/link";
import { PendingSubmitButton } from "@/components/auth/pending-submit-button";
import AuthPageShell from "@/components/layout/auth-page-shell";
import { registerCandidateAction } from "@/features/auth/account-actions";
import { listLocations } from "@/features/core/repository";
import { loginQueryErrorMessage } from "@/lib/auth-login-errors";
import { EDUCATION_OPTIONS, JOB_PREFERENCE_OPTIONS } from "@/lib/candidate-profile-constants";
import { hasDatabase } from "@/lib/db";
import { safeCandidateNextPath } from "@/lib/safe-next-path";
import { formInput, linkInline } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Create candidate profile | Vacancy Chennai",
  description:
    "Free job seeker profile — name, email, mobile, area, qualification, and the work you want. Required before employer contact is shown.",
  robots: { index: false, follow: true },
};

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function CandidateRegisterPage({ searchParams }: Props) {
  const q = await searchParams;
  const nextPath = safeCandidateNextPath(q.next);
  const errorMessage = loginQueryErrorMessage(q.error);
  const db = hasDatabase();
  const locations = db ? await listLocations() : [];
  const loginHref = nextPath ? `/candidate/login?next=${encodeURIComponent(nextPath)}` : "/candidate/login";

  return (
    <AuthPageShell wide>
      <section className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create your profile</h1>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          One short form. You are signed in as soon as the profile is saved, so employer contact on a job
          is available without waiting for email. Your mobile is reviewed by our team later.
        </p>

        {!db ? (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
            Registration needs a connected database. Try demo mode without{" "}
            <code className="text-xs">DATABASE_URL</code> or contact us.
          </p>
        ) : null}

        {errorMessage ? (
          <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            {errorMessage}
          </p>
        ) : null}

        {db ? (
          <form action={registerCandidateAction} className="mt-6 space-y-4">
            {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
            <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
              <label>
                Company website
                <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="space-y-1">
              <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                className={formInput}
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
                className={formInput}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={formInput}
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
                className={formInput}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Mobile number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="10-digit mobile"
                className={formInput}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="locationId" className="text-sm font-medium text-slate-700">
                Area
              </label>
              <select id="locationId" name="locationId" required defaultValue="" className={formInput}>
                <option value="" disabled>
                  Select your area
                </option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.area} ({location.zone})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label htmlFor="education" className="text-sm font-medium text-slate-700">
                Educational qualification
              </label>
              <select id="education" name="education" required defaultValue="" className={formInput}>
                <option value="" disabled>
                  Select qualification
                </option>
                {EDUCATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-700">Job preferences</legend>
              <p className="text-xs text-slate-500">Choose every kind of work you want. At least one.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {JOB_PREFERENCE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800"
                  >
                    <input type="checkbox" name="jobPreferences" value={option.value} className="size-4" />
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <PendingSubmitButton label="Create profile and sign in" pendingLabel="Creating…" />
          </form>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link href={loginHref} className={linkInline}>
            Candidate login
          </Link>
        </p>
      </section>
    </AuthPageShell>
  );
}
