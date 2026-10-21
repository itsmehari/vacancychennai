import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { DiscoverFaqList } from "@/components/discover/discover-faq-list";
import { PublishedJobGrid } from "@/components/discover/published-job-grid";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/discover/jsonld";
import { getJobTypeHub } from "@/lib/discover/hubs";
import { buildJobsItemListJsonLd } from "@/lib/jobs-itemlist-jsonld";
import { btnSecondary, linkInline, sectionCard } from "@/lib/ui";
import type { JobType } from "@/types/domain";
import {
  getEmployerCompanyNameMap,
  listLocations,
  listPublishedJobs,
} from "@/features/core/repository";
import Link from "next/link";

export async function JobTypeHubView({ jobType }: { jobType: JobType }) {
  const hub = getJobTypeHub(jobType);
  if (!hub) return null;

  const [published, locations, employerNames] = await Promise.all([
    listPublishedJobs(),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);
  const jobs = published.filter((job) => job.jobType === hub.jobType);
  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Jobs in Chennai", path: "/jobs-in-chennai" },
    { name: hub.title, path: hub.path },
  ];
  const listJsonLd = jobs.length > 0 ? buildJobsItemListJsonLd(jobs.slice(0, 24), hub.title) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(hub.faqs)) }} />
      {listJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      ) : null}
      <InnerPageHero
        eyebrow={hub.eyebrow}
        title={hub.title}
        description={hub.teaser}
        actions={
          <Link href="/jobs-in-chennai" className={btnSecondary}>
            All Chennai jobs
          </Link>
        }
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/jobs-in-chennai", label: "Jobs in Chennai" },
            { href: hub.path, label: hub.title },
          ]}
        />
        <div className={`${sectionCard} max-w-3xl`}>
          <p className="text-base leading-relaxed text-slate-700">{hub.intro}</p>
          <p className="mt-3 text-sm text-slate-600">
            Filter the same type on the{" "}
            <Link href={`/jobs-in-chennai?jobType=${hub.jobType}`} className={linkInline}>
              full board
            </Link>
            .
          </p>
        </div>
        <PublishedJobGrid
          jobs={jobs}
          locationsById={locationsById}
          employerNames={employerNames}
          listLabel={hub.title}
        />
        <DiscoverFaqList items={hub.faqs} />
      </div>
    </>
  );
}
