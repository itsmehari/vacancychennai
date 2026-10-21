import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { listLocations } from "@/features/core/repository";
import { jobsInAreaPath } from "@/lib/area-job-path";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/discover/jsonld";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, cardInteractive, sectionCard } from "@/lib/ui";
import Link from "next/link";

const title = "Chennai neighbourhood job hubs";
const description =
  "Every Vacancy Chennai area page, grouped by zone. Use the hub you can commute to, then open live listings.";

export const metadata = baseMetadata(title, description, "/areas");

export default async function AreasIndexPage() {
  const locations = await listLocations();
  const zones = [...new Set(locations.map((location) => location.zone))].sort((a, b) => a.localeCompare(b));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd({ name: title, description, path: "/areas" })),
        }}
      />
      <InnerPageHero
        eyebrow="Areas"
        title="Neighbourhood hubs"
        description="Each link is a real location in the directory. Pick the one you can reach before the shift starts."
        actions={
          <Link href="/share-areas" className={btnPrimary}>
            Share a hub
          </Link>
        }
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/areas", label: "Areas" },
          ]}
        />
        {zones.map((zone) => {
          const zoneId = `zone-${zone.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          return (
          <section key={zone} aria-labelledby={zoneId}>
            <h2 id={zoneId} className="text-lg font-semibold text-slate-900">
              {zone}
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {locations
                .filter((location) => location.zone === zone)
                .sort((a, b) => a.area.localeCompare(b.area))
                .map((location) => (
                  <li key={location.id}>
                    <Link href={jobsInAreaPath(location.area)} className={`block ${sectionCard} ${cardInteractive}`}>
                      <span className="font-semibold text-slate-900">{location.area}</span>
                      <span className="mt-1 block text-sm text-slate-500">Pincode {location.pincode}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
          );
        })}
      </div>
    </>
  );
}
