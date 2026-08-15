import { PageAdSlot } from "@/components/ads/page-ad-slot";
import JobCard from "@/components/job-card";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import {
  getEmployerCompanyNameMap,
  listLocations,
  listPublishedJobs,
} from "@/features/core/repository";
import { filterPublishedJobList, getLocationByAreaSlug } from "@/lib/job-filters";
import { buildJobsItemListJsonLd } from "@/lib/jobs-itemlist-jsonld";
import { NANGANALLUR_AREA_SLUG, NANGANALLUR_PAGE_PATH } from "@/lib/local-job-request-constants";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, linkInline, sectionCard } from "@/lib/ui";
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

function AreaSeekerRequestCta({ slug }: { slug: string }) {
  if (slug !== NANGANALLUR_AREA_SLUG) return null;
  return (
    <p className={`${sectionCard} mt-8 text-sm leading-relaxed text-slate-700`}>
      Looking for work in this area?{" "}
      <Link href={NANGANALLUR_PAGE_PATH} className={linkInline}>
        Post your job need
      </Link>{" "}
      — local employers can reach you on WhatsApp.
    </p>
  );
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
        <PageAdSlot shape="rectangle" placement="area_hub" className="pt-8" />
        <AreaSeekerRequestCta slug={slug} />
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
      <PageAdSlot shape="rectangle" placement="area_hub" className="pt-8" />
      <AreaSeekerRequestCta slug={slug} />
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
