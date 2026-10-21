import { AreaShareActions } from "@/components/discover/area-share-actions";
import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { listLocations } from "@/features/core/repository";
import { jobsInAreaPath } from "@/lib/area-job-path";
import { baseMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-base-url";
import { linkInline, sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Share a neighbourhood job hub";
const description =
  "Open WhatsApp or Telegram with a ready post for each Vacancy Chennai area page, or copy an email asking a college or association to link that hub.";

export const metadata: Metadata = {
  ...baseMetadata(title, description, "/share-areas"),
  robots: { index: false, follow: true },
};

export default async function ShareAreasPage() {
  const locations = await listLocations();
  const zones = [...new Set(locations.map((location) => location.zone))].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <InnerPageHero
        eyebrow="Share"
        title="Posts for neighbourhood groups"
        description="Each card opens WhatsApp or Telegram with the hub link filled in, in English and Tamil. The college button opens your mail app with the ask written. You choose the group or the address."
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/areas", label: "Areas" },
            { href: "/share-areas", label: "Share" },
          ]}
        />
        <p className={`${sectionCard} max-w-3xl text-sm leading-relaxed text-slate-700`}>
          Paste the copied post into a residents’ group, a shop notice group, or an alumni chat for that
          area. For a college or association, use Email a college and put their placement address in the To
          line.{" "}
          <Link href="/areas" className={linkInline}>
            Browse the hubs
          </Link>
          .
        </p>
        {zones.map((zone) => {
          const zoneId = `share-${zone.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          return (
          <section key={zone} aria-labelledby={zoneId}>
            <h2 id={zoneId} className="text-lg font-semibold text-slate-900">
              {zone}
            </h2>
            <ul className="mt-3 space-y-3">
              {locations
                .filter((location) => location.zone === zone)
                .sort((a, b) => a.area.localeCompare(b.area))
                .map((location) => {
                  const path = jobsInAreaPath(location.area);
                  return (
                    <li key={location.id} className={sectionCard}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-semibold text-slate-900">{location.area}</h3>
                        <Link href={path} className={`${linkInline} text-sm`}>
                          {path}
                        </Link>
                      </div>
                      <div className="mt-3">
                        <AreaShareActions area={location.area} pageUrl={absoluteUrl(path)} />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </section>
          );
        })}
      </div>
    </>
  );
}
