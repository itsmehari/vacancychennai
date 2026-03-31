import JobCard from "@/components/job-card";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import JobSeekerProfileCta from "@/components/marketing/job-seeker-profile-cta";
import {
  getEmployerCompanyNameMap,
  listLocations,
  listPublishedJobs,
} from "@/features/core/repository";
import { filterPublishedJobList, getLocationByAreaSlug } from "@/lib/job-filters";
import { buildJobsItemListJsonLd } from "@/lib/jobs-itemlist-jsonld";
import { jobsInChennaiListingMetadata } from "@/lib/seo";
import { btnPrimary, btnSecondary, formInput, sectionCard, transitionFast } from "@/lib/ui";
import Link from "next/link";

export const metadata = jobsInChennaiListingMetadata();

type Props = {
  searchParams: Promise<{
    category?: string;
    jobType?: string;
    location?: string;
    salaryMin?: string;
    salaryMax?: string;
    lang?: string;
  }>;
};

const langLinkBase =
  "inline-flex min-h-[40px] items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors";

export default async function JobsInChennaiPage({ searchParams }: Props) {
  const query = await searchParams;
  const language = query.lang === "ta" ? "ta" : "en";

  const [published, locations, employerNames] = await Promise.all([
    listPublishedJobs(),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);
  const locationsById = new Map(locations.map((l) => [l.id, l]));

  const locationSlug =
    query.location && getLocationByAreaSlug(query.location, locations)
      ? query.location
      : undefined;

  const jobs = filterPublishedJobList(published, locations, {
    locationSlug,
    category: query.category,
    jobType: query.jobType,
    salaryMin: query.salaryMin ? Number(query.salaryMin) : undefined,
    salaryMax: query.salaryMax ? Number(query.salaryMax) : undefined,
  });

  const title = language === "ta" ? "சென்னையில் வேலைகள்" : "Jobs in Chennai";
  const desc =
    language === "ta"
      ? "OMR, Velachery, Tambaram, Porur, Ambattur பகுதிகளில் வேலைகளை பார்க்கவும்."
      : "Browse moderated, hyperlocal roles across OMR, Velachery, Tambaram, Porur, and Ambattur — filter by area, type, and salary.";

  const listJsonLd =
    jobs.length > 0 ? buildJobsItemListJsonLd(jobs, "Jobs in Chennai — Vacancy Chennai") : null;

  return (
    <>
      {listJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
        />
      ) : null}
      <InnerPageHero eyebrow="Vacancy Chennai" title={title} description={desc} />
      <div className="space-y-6 pb-4 pt-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/jobs-in-chennai?lang=en"
            className={`${langLinkBase} ${language === "en" ? "border-amber-400/90 bg-amber-50 text-amber-950" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"} ${transitionFast}`}
            aria-current={language === "en" ? "true" : undefined}
          >
            English
          </Link>
          <Link
            href="/jobs-in-chennai?lang=ta"
            className={`${langLinkBase} ${language === "ta" ? "border-amber-400/90 bg-amber-50 text-amber-950" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"} ${transitionFast}`}
            aria-current={language === "ta" ? "true" : undefined}
          >
            Tamil
          </Link>
        </div>

        <section className={sectionCard}>
          <h2 className="sr-only">Filter jobs</h2>
          <form method="get" className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1.5 text-sm font-medium text-slate-700 lg:col-span-1">
              Category
              <input
                name="category"
                defaultValue={query.category}
                placeholder="Industry / category"
                className={formInput}
                autoComplete="off"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Job type
              <select name="jobType" defaultValue={query.jobType ?? ""} className={formInput}>
                <option value="">Any type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Area
              <select name="location" defaultValue={query.location ?? ""} className={formInput}>
                <option value="">All Chennai</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.area.toLowerCase().replaceAll(" ", "-")}>
                    {loc.area}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Min salary (INR)
              <input
                name="salaryMin"
                defaultValue={query.salaryMin}
                type="number"
                min={0}
                placeholder="e.g. 15000"
                className={formInput}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700 md:col-span-2">
              Max salary (INR)
              <input
                name="salaryMax"
                defaultValue={query.salaryMax}
                type="number"
                min={0}
                placeholder="e.g. 40000"
                className={formInput}
              />
            </label>
            <input type="hidden" name="lang" value={language} />
            <div className="flex items-end md:col-span-2 lg:col-span-4">
              <button type="submit" className={btnPrimary}>
                Apply filters
              </button>
            </div>
          </form>
        </section>

        {jobs.length === 0 ? (
          <div className={`${sectionCard} text-center`}>
            <p className="font-medium text-slate-900">No jobs match these filters</p>
            <p className="mt-2 text-sm text-slate-600">Try clearing salary or area, or browse all listings.</p>
            <Link href="/jobs-in-chennai" className={`mt-5 inline-flex ${btnSecondary}`}>
              Reset filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => {
              const loc = locationsById.get(job.locationId);
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  employerCompanyName={employerNames.get(job.employerId)}
                  locationArea={loc?.area}
                  locationZone={loc?.zone}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="pb-8 pt-2">
        <JobSeekerProfileCta variant="inline" dataCta="jobs-hub-profile" />
      </div>
    </>
  );
}
