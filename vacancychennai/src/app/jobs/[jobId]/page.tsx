import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobCard from "@/components/job-card";
import { JobApplyPanel } from "@/components/jobs/job-apply-panel";
import { JobAtAGlance } from "@/components/jobs/job-at-a-glance";
import { JobRotatingAdPanel } from "@/components/jobs/job-rotating-ad-panel";
import { JobSafetyAside } from "@/components/jobs/job-safety-aside";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import {
  findJob,
  findLocationById,
  getApplyPrefillForActor,
  getEmployerCompanyNameMap,
  listLocations,
  listRelatedPublishedJobs,
  resolveEmployerDisplayNameForJob,
} from "@/features/core/repository";
import {
  getCuratedExternalApplyUrl,
  isCuratedExternalApplyUrlJob,
} from "@/features/core/curated-external-job-postings";
import {
  getCuratedDirectEmployerContact,
  getCuratedWhatsAppApplyDigits,
  isCuratedDirectEmployerContactJob,
  isCuratedWhatsAppOnlyJob,
} from "@/features/core/static-curated-jobs";
import { getSession } from "@/lib/auth";
import { jobsInAreaPath } from "@/lib/area-job-path";
import { jobSidebarAds } from "@/lib/job-sidebar-ads";
import {
  buildJobBreadcrumbListJsonLd,
  buildJobPostingJsonLd,
  type JobApplyMode,
} from "@/lib/job-posting-jsonld";
import { buildFactualJobSummary } from "@/lib/job-seo-intro";
import { jobDetailPageMetadata } from "@/lib/seo";
import { linkInline, pillMeta, sectionCard } from "@/lib/ui";
import Link from "next/link";

type Props = {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
};

function truncateMetaDescription(raw: string, max = 158): string {
  const t = raw.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 3).trimEnd()}...`;
}

export async function generateMetadata({ params }: { params: Promise<{ jobId: string }> }): Promise<Metadata> {
  const { jobId } = await params;
  const job = await findJob(jobId);
  if (!job || job.status !== "published") {
    return { title: "Job not found | Vacancy Chennai", robots: { index: false, follow: false } };
  }
  const [location, employerName] = await Promise.all([
    findLocationById(job.locationId),
    resolveEmployerDisplayNameForJob(job),
  ]);
  const areaLabel = location?.area ?? "Chennai";
  const salaryBit =
    job.salaryMin != null && job.salaryMax != null
      ? `₹${job.salaryMin.toLocaleString("en-IN")}–₹${job.salaryMax.toLocaleString("en-IN")}/month`
      : "Salary to be discussed";
  const applyHint = isCuratedExternalApplyUrlJob(jobId)
    ? "Apply via the employer careers page linked on Vacancy Chennai."
    : isCuratedDirectEmployerContactJob(jobId)
      ? "Contact the employer using email or phone on Vacancy Chennai."
      : isCuratedWhatsAppOnlyJob(job.id)
        ? "Apply through WhatsApp using the details on Vacancy Chennai."
        : "Quick apply on Vacancy Chennai — moderated Chennai listings.";
  const description = truncateMetaDescription(
    `${job.title}: ${job.category} · ${job.industry}. ${job.jobType.replace("-", " ")} in ${location?.area ?? "Chennai"}, Chennai. ${salaryBit}. ${employerName}. ${applyHint}`,
  );
  const titleBase = `${job.title} · ${location?.area ?? "Chennai"}`;
  const metaTitle =
    titleBase.length > 52 ? `${titleBase.slice(0, 49)}… | Vacancy Chennai` : `${titleBase} | Vacancy Chennai`;
  const keywords = Array.from(
    new Set(
      [
        `${job.title} jobs Chennai`,
        `${areaLabel} jobs Chennai`,
        `${job.category} jobs Chennai`,
        `${job.industry} jobs Chennai`,
        "Chennai jobs",
        "Vacancy Chennai",
      ].filter(Boolean),
    ),
  );
  return jobDetailPageMetadata({
    title: metaTitle,
    description,
    path: `/jobs/${jobId}`,
    keywords: [...keywords],
    publishedTime: job.createdAt,
    modifiedTime: job.updatedAt,
  });
}

export default async function JobDetailPage({ params, searchParams }: Props) {
  const { jobId } = await params;
  const query = await searchParams;
  const job = await findJob(jobId);
  if (!job || job.status !== "published") notFound();

  const [location, employerName, relatedJobs, locations, employerNames] = await Promise.all([
    findLocationById(job.locationId),
    resolveEmployerDisplayNameForJob(job),
    listRelatedPublishedJobs(job.id, job.locationId, 6),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);
  const locationsById = new Map(locations.map((l) => [l.id, l]));
  const session = await getSession();
  const prefill =
    session?.role === "candidate" ? await getApplyPrefillForActor(session.actorId) : null;
  const whatsappOnly = isCuratedWhatsAppOnlyJob(job.id);
  const externalApplyUrl = isCuratedExternalApplyUrlJob(job.id)
    ? getCuratedExternalApplyUrl(job.id)
    : undefined;
  const directEmployerContact = isCuratedDirectEmployerContactJob(job.id);
  const directContact = directEmployerContact ? getCuratedDirectEmployerContact(job.id) : null;
  const waDigits = getCuratedWhatsAppApplyDigits(job.id);

  const applyMode: JobApplyMode = whatsappOnly
    ? "whatsapp-only"
    : externalApplyUrl
      ? "external-url"
      : directEmployerContact
        ? "direct-contact"
        : "quick-apply";

  const jobPostingLd = buildJobPostingJsonLd({
    job,
    employerName,
    location: location ?? null,
    canonicalPath: `/jobs/${job.id}`,
    applyMode,
    externalApplyUrl,
  });

  const areaLabel = location?.area ?? "Chennai";
  const breadcrumbLd = buildJobBreadcrumbListJsonLd({
    jobTitle: job.title,
    jobPath: `/jobs/${job.id}`,
    areaLabel,
  });

  const visibleSummary = buildFactualJobSummary({
    job,
    location: location ?? null,
    employerName,
  });

  const metaLine = [location?.area, location?.zone, job.jobType.replace("-", " ")]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }}
      />
      <InnerPageHero
        eyebrow="Chennai · Job listing"
        title={job.title}
        description={`${metaLine} — ${
          job.salaryMin != null && job.salaryMax != null
            ? `INR ${job.salaryMin.toLocaleString("en-IN")} – ${job.salaryMax.toLocaleString("en-IN")} / month`
            : "Salary to be discussed"
        }`}
        actions={
          <Link
            href="/jobs-in-chennai"
            className="text-sm font-semibold text-amber-200/95 underline-offset-4 hover:text-white hover:underline"
          >
            ← Back to all jobs
          </Link>
        }
      />

      <nav aria-label="Breadcrumb" className="mt-5 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className={linkInline}>
              Home
            </Link>
          </li>
          <li aria-hidden className="text-slate-300">
            /
          </li>
          <li>
            <Link href="/jobs-in-chennai" className={linkInline}>
              Jobs in Chennai
            </Link>
          </li>
          <li aria-hidden className="text-slate-300">
            /
          </li>
          <li>
            <Link href={jobsInAreaPath(areaLabel)} className={linkInline}>
              {areaLabel} jobs
            </Link>
          </li>
          <li aria-hidden className="text-slate-300">
            /
          </li>
          <li className="font-medium text-slate-800">{employerName}</li>
        </ol>
      </nav>

      <div className="grid gap-6 pb-6 pt-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
        <div className="space-y-4">
          <section className={sectionCard}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
              {employerName}
            </p>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{visibleSummary}</p>
            <p className="mt-3 text-sm text-slate-600">{job.landmarkText}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={pillMeta}>{location?.area}</span>
              <span className={pillMeta}>{location?.zone}</span>
              <span className={pillMeta}>{job.jobType}</span>
              <span className={pillMeta}>{job.category}</span>
            </div>
          </section>

          <section className={sectionCard} aria-labelledby="job-role-heading">
            <h2 id="job-role-heading" className="text-lg font-semibold tracking-tight text-slate-900">
              Role details
            </h2>
            <div className="mt-4 whitespace-pre-wrap text-[0.95rem] leading-[1.7] text-slate-800">
              {job.description}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <JobApplyPanel
            jobId={job.id}
            jobTitle={job.title}
            whatsappOnly={whatsappOnly}
            waDigits={waDigits}
            externalApplyUrl={externalApplyUrl}
            directContact={directContact ?? null}
            query={query}
            prefill={prefill}
          />
          <JobSafetyAside />
          <JobRotatingAdPanel ads={jobSidebarAds()} />
          <JobAtAGlance job={job} location={location ?? null} employerName={employerName} />
        </aside>
      </div>

      {relatedJobs.length > 0 ? (
        <section className="pb-10 pt-2" aria-labelledby="related-jobs-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="related-jobs-heading" className="text-lg font-semibold text-slate-900">
                More jobs in {areaLabel}
              </h2>
              <p className="mt-1 text-sm text-slate-600">Other moderated openings in the same area.</p>
            </div>
            <Link href={jobsInAreaPath(areaLabel)} className={`${linkInline} text-sm font-semibold`}>
              All {areaLabel} jobs →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedJobs.map((rj) => {
              const loc = locationsById.get(rj.locationId);
              return (
                <JobCard
                  key={rj.id}
                  job={rj}
                  employerCompanyName={employerNames.get(rj.employerId)}
                  locationArea={loc?.area}
                  locationZone={loc?.zone}
                />
              );
            })}
          </div>
        </section>
      ) : (
        <section className="pb-10 pt-2">
          <p className="text-sm text-slate-600">
            Looking for more roles?{" "}
            <Link href={jobsInAreaPath(areaLabel)} className={linkInline}>
              Browse {areaLabel} jobs
            </Link>{" "}
            or{" "}
            <Link href="/jobs-in-chennai" className={linkInline}>
              the full Chennai board
            </Link>
            .
          </p>
        </section>
      )}
    </>
  );
}
