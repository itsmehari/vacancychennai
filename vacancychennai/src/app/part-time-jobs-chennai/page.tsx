import JobCard from "@/components/job-card";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import JobSeekerProfileCta from "@/components/marketing/job-seeker-profile-cta";
import { PartnerResumeDoctorAside } from "@/components/partner/partner-resume-doctor-aside";
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
  "Flexible shifts from OMR to Tambaram, Porur, Velachery, Ambattur, and neighbouring pockets — moderated listings, quick apply, free for job seekers.",
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
        description="Flexible shifts and hourly-friendly roles along Chennai corridors — pick an area match on this hub, then sharpen filters on the main jobs board."
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
      <div className="mx-auto mt-10 max-w-2xl pb-6">
        <PartnerResumeDoctorAside
          utmContent="hub_part_time"
          headline="Side-gig readability"
          body="Flexible roles still need ATS-safe CV layouts so hiring managers skim shift fit without parsing chaos."
          linkLabel="Format via ResumeDoctor"
        />
      </div>
      <div className="pb-8 pt-4">
        <JobSeekerProfileCta variant="inline" dataCta="part-time-hub-profile" />
      </div>
    </>
  );
}
