import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { PublishedJobGrid } from "@/components/discover/published-job-grid";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import {
  getEmployerCompanyNameMap,
  listLocations,
  listPublishedJobs,
} from "@/features/core/repository";
import { jobsInAreaPath } from "@/lib/area-job-path";
import { breadcrumbJsonLd } from "@/lib/discover/jsonld";
import { buildJobsItemListJsonLd } from "@/lib/jobs-itemlist-jsonld";
import { baseMetadata } from "@/lib/seo";
import { linkInline, sectionCard } from "@/lib/ui";
import Link from "next/link";

const title = "Chennai jobs posted this week";
const description =
  "Moderated Vacancy Chennai listings first published in the last seven days, with a count by neighbourhood.";

export const metadata = baseMetadata(title, description, "/jobs-this-week");

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default async function JobsThisWeekPage() {
  const [published, locations, employerNames] = await Promise.all([
    listPublishedJobs(),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);
  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const cutoff = Date.now() - WEEK_MS;
  const recent = published
    .filter((job) => new Date(job.createdAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const counts = new Map<string, number>();
  for (const job of recent) {
    const area = locationsById.get(job.locationId)?.area ?? "Chennai";
    counts.set(area, (counts.get(area) ?? 0) + 1);
  }
  const areaRows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const asOf = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const listJsonLd = recent.length > 0 ? buildJobsItemListJsonLd(recent.slice(0, 24), title) : null;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "This week", path: "/jobs-this-week" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      {listJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      ) : null}
      <InnerPageHero
        eyebrow="This week"
        title="Posted in the last 7 days"
        description={`${recent.length} published ${recent.length === 1 ? "listing" : "listings"} first appeared in the last seven days. Counts come from the live board.`}
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/jobs-this-week", label: "This week" },
          ]}
        />
        <div className={`${sectionCard} max-w-3xl`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Short answer</p>
          <p className="mt-2 text-base leading-relaxed text-slate-800">
            As of {asOf}, Vacancy Chennai has {recent.length} moderated{" "}
            {recent.length === 1 ? "job" : "jobs"} whose publish time is inside the last seven days, out of{" "}
            {published.length} live listings.
          </p>
        </div>
        {areaRows.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {areaRows.map(([area, count]) => (
              <li key={area}>
                <Link href={jobsInAreaPath(area)} className={`block ${sectionCard}`}>
                  <span className="font-semibold text-slate-900">{area}</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {count} new {count === 1 ? "listing" : "listings"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <PublishedJobGrid
          jobs={recent}
          locationsById={locationsById}
          employerNames={employerNames}
          listLabel="This week’s jobs"
        />
        <p className="text-sm text-slate-600">
          <Link href="/jobs.xml" className={linkInline}>
            Jobs feed for partners
          </Link>
        </p>
      </div>
    </>
  );
}
