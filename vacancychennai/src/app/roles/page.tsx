import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/discover/jsonld";
import { roleHubs } from "@/lib/discover/roles";
import { baseMetadata } from "@/lib/seo";
import { cardInteractive, sectionCard } from "@/lib/ui";
import Link from "next/link";

const title = "Jobs in Chennai by role";
const description =
  "Role hubs for Chennai listings — telecaller, delivery, accounts, retail, nursing, software, and more. Each page shows live moderated matches.";

export const metadata = baseMetadata(title, description, "/roles");

export default function RolesIndexPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Roles", path: "/roles" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd({ name: title, description, path: "/roles" })),
        }}
      />
      <InnerPageHero
        eyebrow="Roles"
        title="Chennai jobs by role"
        description="Each hub matches published titles, categories, and industries. If nothing is live, the page says so instead of inventing openings."
      />
      <div className="space-y-6 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/roles", label: "Roles" },
          ]}
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {roleHubs.map((role) => (
            <li key={role.slug}>
              <Link href={`/roles/${role.slug}`} className={`block h-full ${sectionCard} ${cardInteractive}`}>
                <h2 className="text-lg font-semibold text-slate-900">{role.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{role.teaser}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
