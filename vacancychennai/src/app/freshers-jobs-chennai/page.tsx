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
  "Freshers & entry-level jobs in Chennai",
  "Entry-level and fresher-friendly roles across OMR, Tambaram, Velachery, Porur, and Ambattur — moderated listings, quick apply, free for job seekers.",
  "/freshers-jobs-chennai",
);

export default async function FreshersJobsPage() {
  const [published, locations, employerNames] = await Promise.all([
    listPublishedJobs(),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);
  const locationsById = new Map(locations.map((l) => [l.id, l]));
  const jobs = published.filter((job) => job.salaryMin <= 25000);
  const listJsonLd =
    jobs.length > 0 ? buildJobsItemListJsonLd(jobs, "Freshers & entry-level jobs in Chennai") : null;

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
        title="Freshers & entry-level jobs"
        description="Roles with starting salary up to ₹25,000/month — great for first jobs and early-career moves in Chennai."
        actions={
          <Link href="/jobs-in-chennai" className={btnPrimary}>
            All Chennai jobs
          </Link>
        }
      />
      <div className="pb-4 pt-8">
        {jobs.length === 0 ? (
          <div className={`${sectionCard} text-center`}>
            <p className="font-medium text-slate-900">No entry-level listings right now</p>
            <p className="mt-2 text-sm text-slate-600">Browse the full board — new roles are added regularly.</p>
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
