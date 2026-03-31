import JobCard from "@/components/job-card";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import {
  getEmployerCompanyNameMap,
  listLocations,
  listPublishedJobs,
} from "@/features/core/repository";
import { buildJobsItemListJsonLd } from "@/lib/jobs-itemlist-jsonld";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, sectionCard } from "@/lib/ui";
import Link from "next/link";

export const metadata = baseMetadata(
  "Part-time jobs in Chennai",
  "Flexible shifts across Chennai.",
  "/part-time-jobs-chennai",
);

export default async function PartTimeJobsPage() {
  const [published, locations, employerNames] = await Promise.all([
    listPublishedJobs(),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);
  const locationsById = new Map(locations.map((l) => [l.id, l]));
  const jobs = published.filter((job) => job.jobType === "part-time");
  const listJsonLd =
    jobs.length > 0 ? buildJobsItemListJsonLd(jobs, "Part-time jobs in Chennai") : null;

  return (
    <>
      {listJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
        />
      ) : null}
      <InnerPageHero
        eyebrow="Job seekers"
        title="Part-time jobs in Chennai"
        description="Flexible shifts and hourly-friendly roles across the city — filter further on the main jobs board."
        actions={
          <Link href="/jobs-in-chennai?jobType=part-time" className={btnPrimary}>
            Filter part-time only
          </Link>
        }
      />
      <div className="pb-4 pt-8">
        {jobs.length === 0 ? (
          <div className={`${sectionCard} text-center`}>
            <p className="font-medium text-slate-900">No part-time listings right now</p>
            <p className="mt-2 text-sm text-slate-600">Check the full board or try again soon.</p>
            <Link href="/jobs-in-chennai" className={`mt-5 inline-flex ${btnPrimary}`}>
              Browse all jobs
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
    </>
  );
}
