import InnerPageHero from "@/components/marketing/inner-page-hero";
import PostJobLanding from "@/components/marketing/post-job-landing";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, focusRingOnDark, transitionFast } from "@/lib/ui";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = baseMetadata(
  "Post a job in Chennai — Vacancy Chennai",
  "Reach Chennai candidates with a moderated, hyperlocal listing — area, salary, and role details. Continue to employer sign-in to publish.",
  "/post-job",
);

function PostJobLandingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-slate-600">
      Loading…
    </div>
  );
}

const heroSecondaryCta = `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-white/45 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/12 ${focusRingOnDark} ${transitionFast}`;

export default function PostJobMarketingPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Employers"
        title="Post your Chennai job in just 2 minutes"
        description="Reach candidates who already filter by area and role. Continue below, then sign in to publish from your dashboard."
        actions={
          <>
            <Link href="/employer/login" className={btnPrimary}>
              Employer sign in
            </Link>
            <Link href="/pricing" className={heroSecondaryCta}>
              View pricing
            </Link>
          </>
        }
      >
        <ul className="mt-5 max-w-lg space-y-2 text-sm text-slate-400 md:text-base">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
            Listings are moderated for quality and safety.
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
            Simple flow: draft here, then publish after employer login.
          </li>
        </ul>
      </InnerPageHero>
      <Suspense fallback={<PostJobLandingFallback />}>
        <PostJobLanding />
      </Suspense>
    </>
  );
}
