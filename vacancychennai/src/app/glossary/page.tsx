import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { glossaryTerms } from "@/lib/discover/hubs";
import { breadcrumbJsonLd, definedTermSetJsonLd } from "@/lib/discover/jsonld";
import { baseMetadata } from "@/lib/seo";
import { sectionCard } from "@/lib/ui";

const title = "Chennai hiring glossary";
const description =
  "Plain definitions for area hubs, quick apply, moderation, indicative salary, job types, and walk-ins on Vacancy Chennai.";

export const metadata = baseMetadata(title, description, "/glossary");

export default function GlossaryPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Glossary", path: "/glossary" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            definedTermSetJsonLd(
              glossaryTerms.map((item) => ({ name: item.term, description: item.definition })),
              "/glossary",
            ),
          ),
        }}
      />
      <InnerPageHero
        eyebrow="Definitions"
        title="Hiring glossary"
        description="Short definitions so listings, hubs, and guides use the same words."
      />
      <div className="space-y-6 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/glossary", label: "Glossary" },
          ]}
        />
        <dl className="grid gap-4">
          {glossaryTerms.map((item) => (
            <div key={item.term} className={sectionCard}>
              <dt className="text-base font-semibold text-slate-900">{item.term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-700">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
