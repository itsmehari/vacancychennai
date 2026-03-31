import Link from "next/link";
import { baseMetadata } from "@/lib/seo";
import { linkInline } from "@/lib/ui";

export const metadata = baseMetadata(
  "Privacy policy — Vacancy Chennai",
  "How we handle candidate profiles, quick-apply data, employer accounts, and cookies on Vacancy Chennai.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-slate-700">
        This is a working summary for the MVP. Replace with counsel-reviewed legal text before production.
      </p>

      <div className="space-y-3 text-slate-700">
        <h2 className="text-xl font-semibold text-slate-900">Job seeker profiles</h2>
        <p>
          If you sign in as a candidate and save a profile, we may store your name, phone, email, preferred
          area, skills, a short headline, experience band, an optional résumé link, and (if you upload) a
          résumé file. Résumé uploads on the current demo use server memory and do not persist across
          restarts — prefer a stable résumé URL for production use until object storage is configured.
        </p>
        <p>
          Browsing and applying to jobs does not require a profile. Employer access to contact details or
          résumés is described on the{" "}
          <Link href="/employer/resume-database" className={linkInline}>
            resume database
          </Link>{" "}
          and{" "}
          <Link href="/pricing" className={linkInline}>
            pricing
          </Link>{" "}
          pages and should match what we promise in product copy.
        </p>
      </div>

      <div className="space-y-3 text-slate-700">
        <h2 className="text-xl font-semibold text-slate-900">Applications</h2>
        <p>
          Quick apply collects at least your name and phone, and optionally email and a résumé link. Employers
          who own the job listing receive application data for their roles.
        </p>
      </div>

      <div className="space-y-3 text-slate-700">
        <h2 className="text-xl font-semibold text-slate-900">Your rights</h2>
        <p>
          To request correction or deletion of your data, contact us via the{" "}
          <Link href="/contact" className={linkInline}>
            contact
          </Link>{" "}
          page. Retention periods should be defined by the product owner and added here.
        </p>
      </div>
    </section>
  );
}
