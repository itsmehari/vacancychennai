import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobCard from "@/components/job-card";
import JobSeekerProfileCta from "@/components/marketing/job-seeker-profile-cta";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { quickApplyAction } from "@/features/applications/actions";
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
  curatedAdvocateWhatsAppDigits,
  getCuratedDirectEmployerContact,
  isCuratedDirectEmployerContactJob,
  isCuratedWhatsAppOnlyJob,
} from "@/features/core/static-curated-jobs";
import { getSession } from "@/lib/auth";
import { jobsInAreaPath } from "@/lib/area-job-path";
import {
  buildJobBreadcrumbListJsonLd,
  buildJobPostingJsonLd,
  type JobApplyMode,
} from "@/lib/job-posting-jsonld";
import { jobDetailPageMetadata } from "@/lib/seo";
import { btnPrimary, formInput, linkInline, pillMeta, sectionCard } from "@/lib/ui";
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
  const area = location?.area ?? "Chennai";
  const typeLabel = job.jobType.replace("-", " ");
  const salaryBit = `₹${job.salaryMin.toLocaleString("en-IN")}–₹${job.salaryMax.toLocaleString("en-IN")}/month`;
  const applyHint = isCuratedExternalApplyUrlJob(jobId)
    ? "Apply via the employer careers page linked on Vacancy Chennai."
    : isCuratedDirectEmployerContactJob(jobId)
      ? "Contact the employer using email or phone on Vacancy Chennai."
      : isCuratedWhatsAppOnlyJob(job.id)
        ? "Apply through WhatsApp using the details on Vacancy Chennai."
        : "Quick apply on Vacancy Chennai — moderated Chennai listings.";
  const description = truncateMetaDescription(
    `${job.title}: ${job.category} · ${job.industry}. ${typeLabel} in ${area}, Chennai. ${salaryBit}. ${employerName}. ${applyHint}`,
  );
  const titleBase = `${job.title} · ${area}`;
  const metaTitle =
    titleBase.length > 52 ? `${titleBase.slice(0, 49)}… | Vacancy Chennai` : `${titleBase} | Vacancy Chennai`;
  const keywords = Array.from(
    new Set(
      [
        `${job.title} jobs Chennai`,
        `${area} jobs Chennai`,
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
  const waHref = `https://wa.me/${curatedAdvocateWhatsAppDigits}`;

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

  const metaLine = [
    location?.area,
    location?.zone,
    job.jobType.replace("-", " "),
  ]
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
        description={`${metaLine} — INR ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()} / month`}
        actions={
          <Link href="/jobs-in-chennai" className="text-sm font-semibold text-amber-200/95 underline-offset-4 hover:text-white hover:underline">
            ← Back to all jobs
          </Link>
        }
      />

      <nav aria-label="Breadcrumb" className={`${sectionCard} mt-6 text-sm text-slate-600`}>
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
          <li className="font-medium text-slate-800">{job.title}</li>
        </ol>
      </nav>

      <div className="grid gap-6 pb-6 pt-8 lg:grid-cols-[1fr_min(340px,100%)] lg:items-start lg:gap-8">
        <div className="space-y-4">
          <section className={sectionCard}>
            <h2 className="text-lg font-semibold text-slate-900">Location &amp; details</h2>
            <p className="mt-2 text-slate-700">{job.landmarkText}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={pillMeta}>{location?.area}</span>
              <span className={pillMeta}>{location?.zone}</span>
              <span className={pillMeta}>{job.jobType}</span>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-semibold text-slate-900">Description</h3>
              <div className="mt-2 whitespace-pre-wrap text-slate-800 leading-relaxed">{job.description}</div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className={sectionCard}>
            {whatsappOnly ? (
              <>
                <h2 className="text-lg font-semibold text-slate-900">How to apply</h2>
                <p className="mt-1 text-sm text-slate-600">
                  The employer asked for applications on WhatsApp only. Send your résumé in chat; avoid phone
                  calls unless they request a call back.
                </p>
                <a
                  href={waHref}
                  className={`${btnPrimary} mt-4 inline-flex w-full justify-center`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="job-whatsapp-apply"
                >
                  Open WhatsApp
                </a>
                <p className="mt-3 text-xs text-slate-500">
                  The same number is listed in the description if you prefer to copy it.
                </p>
              </>
            ) : externalApplyUrl ? (
              <>
                {query.error === "external-apply-url" ? (
                  <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
                    Vacancy Chennai quick apply is off for this listing — use the employer careers link below.
                  </p>
                ) : null}
                <h2 className="text-lg font-semibold text-slate-900">How to apply</h2>
                <p className="mt-1 text-sm text-slate-600">
                  This job is aggregated from an external careers source. Continue on the employer site to submit
                  your application.
                </p>
                <a
                  href={externalApplyUrl}
                  className={`${btnPrimary} mt-4 inline-flex w-full justify-center`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="job-external-careers-apply"
                >
                  Open employer careers page
                </a>
                <p className="mt-3 text-xs text-slate-500">
                  Vacancy Chennai does not receive applications for this role — always verify details on the live
                  posting.
                </p>
              </>
            ) : directEmployerContact && directContact ? (
              <>
                {query.error === "direct-employer-contact" ? (
                  <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
                    Quick apply is turned off for this listing — use email or phone below.
                  </p>
                ) : null}
                <h2 className="text-lg font-semibold text-slate-900">How to apply</h2>
                <p className="mt-1 text-sm text-slate-600">
                  This role is listed for direct contact with the employer. Use email or phone below (Vacancy
                  Chennai quick apply is not used for this posting).
                </p>
                <a
                  href={`mailto:${directContact.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                  className={`${btnPrimary} mt-4 inline-flex w-full justify-center`}
                  data-cta="job-direct-email-apply"
                >
                  Email {directContact.email}
                </a>
                <a
                  href={`tel:${directContact.phoneE164.replace(/\s/g, "")}`}
                  className={`${btnPrimary} mt-3 inline-flex w-full justify-center bg-slate-800 ring-slate-800 hover:bg-slate-900`}
                  data-cta="job-direct-phone-apply"
                >
                  Call {directContact.phoneLabel}
                </a>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-slate-900">Quick apply</h2>
                <p className="mt-1 text-sm text-slate-600">
                  No heavy resume required. Name + phone is enough. Signed-in candidates can pre-fill from their
                  profile.
                </p>
                {prefill && (prefill.profileHeadline || prefill.skillsPreview) ? (
                  <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 ring-1 ring-slate-100">
                    <p className="font-semibold text-slate-800">From your profile</p>
                    {prefill.profileHeadline ? (
                      <p className="mt-1">
                        <span className="text-slate-500">Headline: </span>
                        {prefill.profileHeadline}
                      </p>
                    ) : null}
                    {prefill.skillsPreview ? (
                      <p className="mt-1">
                        <span className="text-slate-500">Skills: </span>
                        {prefill.skillsPreview}
                      </p>
                    ) : null}
                  </div>
                ) : null}
                {query.success === "applied" && (
                  <div className="mt-4 space-y-3">
                    <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
                      Application submitted successfully.
                    </p>
                    <JobSeekerProfileCta variant="inline" dataCta="job-detail-post-apply" />
                  </div>
                )}
                {query.error === "whatsapp-only" && (
                  <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
                    This role is WhatsApp-only — use the button above or the number in the description.
                  </p>
                )}
                {query.error &&
                  query.error !== "whatsapp-only" &&
                  query.error !== "direct-employer-contact" &&
                  query.error !== "external-apply-url" && (
                    <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
                      Could not submit application. Please check your details.
                    </p>
                  )}
                <form action={quickApplyAction} className="mt-4 grid gap-3">
                  <input type="hidden" name="jobId" value={job.id} />
                  <input
                    className={formInput}
                    name="applicantName"
                    placeholder="Your full name"
                    required
                    defaultValue={prefill?.applicantName}
                    autoComplete="name"
                  />
                  <input
                    className={formInput}
                    name="applicantPhone"
                    placeholder="Phone number"
                    required
                    defaultValue={prefill?.applicantPhone}
                    autoComplete="tel"
                  />
                  <input
                    className={formInput}
                    name="applicantEmail"
                    type="email"
                    placeholder="Email (optional)"
                    defaultValue={prefill?.applicantEmail}
                    autoComplete="email"
                  />
                  <input
                    className={formInput}
                    name="resumeLink"
                    placeholder="Resume link (optional)"
                    defaultValue={prefill?.resumeLink}
                  />
                  <button type="submit" className={btnPrimary}>
                    Apply now
                  </button>
                </form>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <JobSeekerProfileCta variant="inline" dataCta="job-detail-profile-hint" />
                </div>
              </>
            )}
          </section>
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
