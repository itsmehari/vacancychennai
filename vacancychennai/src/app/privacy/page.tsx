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
          résumé file. Uploaded files are stored as{" "}
          <strong>private objects</strong> in Vercel Blob when the site operator configures object storage;
          otherwise, in <strong>server memory</strong> (typical for local development only — files do not
          survive restarts). A résumé URL you paste yourself is not uploaded to our storage unless you also
          attach a file.
        </p>
        <p>
          Browsing and quick apply do not require a profile. <strong>Employers who post a job</strong> receive
          the name, phone, and optional email and résumé link you submit on that application. They do{" "}
          <strong>not</strong> automatically receive uploaded résumé files or full profile fields unless we
          say so in product copy (see the{" "}
          <Link href="/employer/resume-database" className={linkInline}>
            resume database
          </Link>{" "}
          and{" "}
          <Link href="/pricing" className={linkInline}>
            pricing
          </Link>{" "}
          pages). Retention periods should be defined by the operator and added here when finalized.
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
