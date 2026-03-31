import JobSeekerProfileCta from "@/components/marketing/job-seeker-profile-cta";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, btnSecondary, focusRingOnDark, linkInline, sectionCard, transitionFast } from "@/lib/ui";
import Link from "next/link";

export const metadata = baseMetadata(
  "Job seeker profile — upload résumé & skills | Vacancy Chennai",
  "Optional profile for Chennai job seekers: headline, area, experience, skills, résumé (PDF/DOC/DOCX). Sign in to create or update. Browse and apply stay free.",
  "/job-seeker-profile",
);

export default function JobSeekerProfilePage() {
  return (
    <>
      <InnerPageHero
        eyebrow="For job seekers"
        title="Your job seeker profile"
        description="Sign in as a candidate to add headline, area, experience, skills, and résumé — same fields as your dashboard. Browsing and quick apply stay free."
        actions={
          <>
            <Link href="/candidate/login" className={btnPrimary}>
              Sign in to edit profile
            </Link>
            <Link
              href="/jobs-in-chennai"
              className={`inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-white/45 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/12 ${focusRingOnDark} ${transitionFast}`}
            >
              Browse jobs
            </Link>
          </>
        }
      />

      <div className="space-y-6 pb-4 pt-8">
        <section className={sectionCard} aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-lg font-semibold text-slate-900">
            What you can add
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
            <li>Résumé file: PDF, DOC, or DOCX, up to 2MB (demo storage on this MVP).</li>
            <li>Or paste a link to your résumé (Drive, portfolio, etc.).</li>
            <li>Short headline and optional experience band — we do not auto-parse CVs.</li>
            <li>Your Chennai / suburb area and skills tags.</li>
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            <strong className="text-slate-800">Transparency:</strong> employer visibility of contacts and résumés
            follows the rules on the resume database and pricing pages — we do not promise recruiter browsing
            until that product surface ships.
          </p>
        </section>

        <JobSeekerProfileCta variant="card" dataCta="job-seeker-landing" />

        <p className="text-sm text-slate-600">
          Questions about data use? See our{" "}
          <Link href="/privacy" className={linkInline}>
            privacy policy
          </Link>
          .
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/candidate/login" className={btnPrimary} data-cta="job-seeker-start-profile">
            Sign in to edit profile
          </Link>
          <Link href="/jobs-in-chennai" className={btnSecondary} data-cta="job-seeker-browse">
            Browse jobs
          </Link>
        </div>
      </div>
    </>
  );
}
