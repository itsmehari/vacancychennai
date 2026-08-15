import Link from "next/link";
import { baseMetadata } from "@/lib/seo";
import { linkInline } from "@/lib/ui";

export const metadata = baseMetadata(
  "Terms of use — Vacancy Chennai",
  "Terms for using Vacancy Chennai as a job seeker, employer, or visitor — listings, applications, and fair use.",
  "/terms",
);

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <p className="text-slate-700">
        By using Vacancy Chennai you agree to browse, apply, and post in good faith. Listings are
        moderated. We may remove roles that look unsafe, misleading, or that ask candidates to pay for a
        job.
      </p>
      <ul className="list-inside list-disc space-y-2 text-slate-700">
        <li>Job seekers may apply with name and phone; creating an account is optional.</li>
        <li>Employers must submit accurate location, pay, and contact details before a listing can go live.</li>
        <li>Do not share login details, pay anyone to “confirm” a vacancy, or scrape the board.</li>
      </ul>
      <p className="text-slate-700">
        How we handle profile and application data is in the{" "}
        <Link href="/privacy" className={linkInline}>
          privacy policy
        </Link>
        . Employer plans are on{" "}
        <Link href="/pricing" className={linkInline}>
          pricing
        </Link>
        . To report a listing or ask a question, use{" "}
        <Link href="/contact" className={linkInline}>
          contact
        </Link>{" "}
        or email{" "}
        <a href="mailto:support@vacancychennai.in" className={linkInline}>
          support@vacancychennai.in
        </a>
        .
      </p>
      <p className="text-sm text-slate-600">
        <Link href="/jobs-in-chennai" className={linkInline}>
          Browse jobs
        </Link>
        {" · "}
        <Link href="/post-job" className={linkInline}>
          Post a job
        </Link>
      </p>
    </section>
  );
}
