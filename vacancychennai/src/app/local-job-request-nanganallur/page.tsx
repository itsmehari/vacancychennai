import type { Metadata } from "next";
import Link from "next/link";
import { PageAdSlot } from "@/components/ads/page-ad-slot";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { JobRequestAuthPanel } from "@/components/local-job-request/job-request-auth-panel";
import { JobRequestPostForm } from "@/components/local-job-request/job-request-post-form";
import { JobRequestPublicCard } from "@/components/local-job-request/job-request-public-card";
import {
  getLocalJobRequestByUserId,
  listLocalJobRequestsByArea,
} from "@/features/local-job-request/repository";
import { getSession } from "@/lib/auth";
import { jobRequestQueryError, jobRequestQueryInfo } from "@/lib/job-request-messages";
import {
  NANGANALLUR_AREA_LABEL,
  NANGANALLUR_AREA_SLUG,
  NANGANALLUR_PAGE_PATH,
} from "@/lib/local-job-request-constants";
import { baseMetadata } from "@/lib/seo";
import { btnSecondary, linkInline, sectionCard } from "@/lib/ui";
import { jobsInAreaPath } from "@/lib/area-job-path";

export const metadata: Metadata = baseMetadata(
  `Post your job need in ${NANGANALLUR_AREA_LABEL} | Vacancy Chennai`,
  `Need a job in ${NANGANALLUR_AREA_LABEL}, Chennai? Post your requirement free. Employers contact you on WhatsApp. Sign in with email or SMS.`,
  NANGANALLUR_PAGE_PATH,
);

type Props = {
  searchParams: Promise<{
    auth?: string;
    success?: string;
    error?: string;
    phone?: string;
    name?: string;
    email?: string;
  }>;
};

export default async function LocalJobRequestNanganallurPage({ searchParams }: Props) {
  const query = await searchParams;
  const session = await getSession();
  const isCandidate = session?.role === "candidate";
  const existing = isCandidate ? await getLocalJobRequestByUserId(session.actorId) : null;
  const publicRequests = await listLocalJobRequestsByArea(NANGANALLUR_AREA_SLUG);

  const errorMessage = jobRequestQueryError(query.error);
  const infoMessage = jobRequestQueryInfo(query);
  const otpStep = query.auth === "otp-sent";
  const otpPhone = query.phone ? decodeURIComponent(query.phone) : undefined;
  const otpName = query.name ? decodeURIComponent(query.name) : undefined;
  const otpEmail = query.email ? decodeURIComponent(query.email) : undefined;

  return (
    <>
      <InnerPageHero
        eyebrow={`${NANGANALLUR_AREA_LABEL} · Job seekers`}
        title="Post your local job request"
        description="Tell employers what you need. Sign in with email or mobile, submit once, and get contacted on WhatsApp."
        actions={
          <Link
            href={jobsInAreaPath(NANGANALLUR_AREA_LABEL)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-white/45 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/12"
          >
            Browse jobs in {NANGANALLUR_AREA_LABEL}
          </Link>
        }
      />

      <PageAdSlot shape="rectangle" placement="job_request_nanganallur" className="pt-8" />

      <div className="space-y-8 pb-10 pt-8">
        {errorMessage ? (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-100"
          >
            {errorMessage}
          </p>
        ) : null}
        {infoMessage ? (
          <p
            role="status"
            className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-950 ring-1 ring-blue-100"
          >
            {infoMessage}
          </p>
        ) : null}

        {!isCandidate ? (
          <section className={sectionCard} aria-labelledby="sign-in-heading">
            <h2 id="sign-in-heading" className="text-lg font-semibold text-slate-900">
              Sign in to post
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Enter your name, email, and mobile. Choose email link or SMS code.
            </p>
            <div className="mt-5">
              <JobRequestAuthPanel
                otpStep={otpStep}
                otpPhone={otpPhone}
                defaultName={otpName}
                defaultEmail={otpEmail}
              />
            </div>
          </section>
        ) : (
          <section className={sectionCard} aria-labelledby="post-heading">
            <h2 id="post-heading" className="text-lg font-semibold text-slate-900">
              {existing ? "Update your job request" : "Your job request"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              One active post per account. Goes live immediately — employers see it below.
            </p>
            <div className="mt-5">
              <JobRequestPostForm
                existing={existing}
                defaultName={session.displayName}
              />
            </div>
          </section>
        )}

        <section aria-labelledby="public-list-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="public-list-heading" className="text-lg font-semibold text-slate-900">
                Job seekers in {NANGANALLUR_AREA_LABEL}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Public listings — tap WhatsApp to contact directly.
              </p>
            </div>
            <Link href={jobsInAreaPath(NANGANALLUR_AREA_LABEL)} className={btnSecondary}>
              View open jobs
            </Link>
          </div>

          {publicRequests.length === 0 ? (
            <p className={`mt-6 ${sectionCard} text-sm text-slate-600`}>
              No job requests yet in {NANGANALLUR_AREA_LABEL}. Be the first to post above.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {publicRequests.map((request) => (
                <li key={request.id}>
                  <JobRequestPublicCard request={request} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="text-sm text-slate-600">
          Hiring in {NANGANALLUR_AREA_LABEL}?{" "}
          <Link href="/post-job" className={linkInline}>
            Post a job
          </Link>{" "}
          or browse{" "}
          <Link href={jobsInAreaPath(NANGANALLUR_AREA_LABEL)} className={linkInline}>
            jobs in {NANGANALLUR_AREA_LABEL}
          </Link>
          .
        </p>
      </div>
    </>
  );
}
