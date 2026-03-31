import JobCard from "@/components/job-card";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import {
  getEmployerCompanyNameMap,
  listLocations,
  listPublishedJobs,
} from "@/features/core/repository";
import { filterPublishedJobList, getLocationByAreaSlug } from "@/lib/job-filters";
import { buildJobsItemListJsonLd } from "@/lib/jobs-itemlist-jsonld";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, sectionCard } from "@/lib/ui";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ locationPage: string }>;
};

function getSlugFromPath(path: string) {
  if (!path.startsWith("jobs-in-")) return null;
  return path.replace("jobs-in-", "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locationPage } = await params;
  const slug = getSlugFromPath(locationPage);
  if (!slug) {
    return baseMetadata("Page not found", "Invalid route", `/${locationPage}`);
  }
  const locations = await listLocations();
  if (!getLocationByAreaSlug(slug, locations)) {
    return baseMetadata(
      "Page not found",
      "This area is not listed on Vacancy Chennai.",
      `/${locationPage}`,
    );
  }
  const pretty = slug.replaceAll("-", " ");
  return baseMetadata(
    `Jobs in ${pretty} — Vacancy Chennai`,
    `Moderated hyperlocal listings in ${pretty}, Chennai — full-time, part-time, and internships. Quick apply; filter on Vacancy Chennai.`,
    `/${locationPage}`,
  );
}

export default async function AreaPage({ params }: Props) {
  const { locationPage } = await params;
  const slug = getSlugFromPath(locationPage);
  if (!slug) notFound();

  const [published, locations, employerNames] = await Promise.all([
    listPublishedJobs(),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);

  if (!getLocationByAreaSlug(slug, locations)) {
    notFound();
  }

  const locationsById = new Map(locations.map((l) => [l.id, l]));

  const jobs = filterPublishedJobList(published, locations, { locationSlug: slug });
  const readable = slug.replaceAll("-", " ");
  const title = `Jobs in ${readable}`;

  if (jobs.length === 0) {
    return (
      <>
        <InnerPageHero
          eyebrow="Chennai · Area"
          title={title}
          description="No live listings in this area right now. New jobs are posted regularly — browse all Chennai roles or try another neighbourhood."
          actions={
            <Link href="/jobs-in-chennai" className={btnPrimary}>
              All Chennai jobs
            </Link>
          }
        />
        <div className="pb-4 pt-8">
          <div className={`${sectionCard} text-center`}>
            <p className="text-sm text-slate-600">Check back soon or expand your search on the main jobs board.</p>
          </div>
        </div>
      </>
    );
  }

  const jsonLd = buildJobsItemListJsonLd(jobs, title);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InnerPageHero
        eyebrow="Chennai · Area"
        title={title}
        description="Moderated, location-first listings — quick apply with name and phone."
        actions={
          <Link href="/jobs-in-chennai" className={btnPrimary}>
            All areas
          </Link>
        }
      />
      <section className="grid gap-4 pb-4 pt-8 md:grid-cols-2">
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
      </section>
    </>
  );
}
