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
          If you register as a candidate, we store your name, email, mobile number, area, educational
          qualification, and job preferences, plus any headline, skills, experience band, résumé link, or
          résumé file you add later. Your mobile stays marked pending until an administrator marks it
          verified or asks for a correction. Employer phone, email, and WhatsApp on a listing are shown
          only after that profile is complete. Uploaded files are stored as{" "}
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
        <h2 className="text-xl font-semibold text-slate-900">Cookies and website analytics</h2>
        <p>
          We partner with Microsoft Clarity and Microsoft Advertising to capture how you use and interact
          with our website through behavioral metrics, heatmaps, and session replay to improve Vacancy
          Chennai (job search, listings, and employer tools). Website usage data is captured using first-
          and third-party cookies and other tracking technologies to determine the popularity of pages and
          online activity. We also use this information for site optimization and fraud/security purposes.
          For more information about how Microsoft collects and uses your data, visit the{" "}
          <a
            href="https://www.microsoft.com/privacy/privacystatement"
            className={linkInline}
            rel="noopener noreferrer"
            target="_blank"
          >
            Microsoft Privacy Statement
          </a>
          .
        </p>
        <p>
          We also use Google Analytics (GA4) to measure traffic and how visitors navigate the site. Google
          may use cookies and similar technologies; see{" "}
          <a
            href="https://policies.google.com/privacy"
            className={linkInline}
            rel="noopener noreferrer"
            target="_blank"
          >
            Google&apos;s Privacy Policy
          </a>{" "}
          for details. Essential cookies for sign-in and security are separate from these analytics tools.
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
