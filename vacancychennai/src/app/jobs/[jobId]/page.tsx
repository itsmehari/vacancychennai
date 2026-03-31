import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobSeekerProfileCta from "@/components/marketing/job-seeker-profile-cta";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { quickApplyAction } from "@/features/applications/actions";
import {
  findJob,
  findLocationById,
  getApplyPrefillForActor,
  resolveEmployerDisplayNameForJob,
} from "@/features/core/repository";
import { getSession } from "@/lib/auth";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, formInput, pillMeta, sectionCard } from "@/lib/ui";
import Link from "next/link";

type Props = {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
};

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
  const description = `${typeLabel} in ${area}. ₹${job.salaryMin.toLocaleString("en-IN")}–₹${job.salaryMax.toLocaleString("en-IN")}/mo · ${employerName}. Quick apply on Vacancy Chennai.`;
  return baseMetadata(`${job.title} | Vacancy Chennai`, description.slice(0, 160), `/jobs/${jobId}`);
}

export default async function JobDetailPage({ params, searchParams }: Props) {
  const { jobId } = await params;
  const query = await searchParams;
  const job = await findJob(jobId);
  if (!job || job.status !== "published") notFound();

  const [location, employerName] = await Promise.all([
    findLocationById(job.locationId),
    resolveEmployerDisplayNameForJob(job),
  ]);
  const session = await getSession();
  const prefill =
    session?.role === "candidate" ? await getApplyPrefillForActor(session.actorId) : null;

  const jobPostingLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    employmentType: job.jobType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: employerName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location?.area,
        addressRegion: "Chennai",
        postalCode: location?.pincode,
        addressCountry: "IN",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: "MONTH",
      },
    },
  };

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
            {query.error && (
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
          </section>
        </aside>
      </div>
    </>
  );
}
