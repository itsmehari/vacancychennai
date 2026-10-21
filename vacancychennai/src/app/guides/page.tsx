import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { collectionPageJsonLd, breadcrumbJsonLd } from "@/lib/discover/jsonld";
import { guidePages, hiringIdeas } from "@/lib/discover/guides";
import { baseMetadata } from "@/lib/seo";
import { cardInteractive, linkInline, sectionCard } from "@/lib/ui";
import Link from "next/link";

const title = "Chennai hiring guides and ideas";
const description =
  "Practical guides for finding a Chennai job, reading area hubs, applying safely, and writing a local job post.";

export const metadata = baseMetadata(title, description, "/guides");

export default function GuidesIndexPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageJsonLd({ name: title, description, path: "/guides" }),
          ),
        }}
      />
      <InnerPageHero
        eyebrow="Ideas"
        title="Guides for Chennai hiring"
        description="Short answers first, then the detail. Written for job seekers and employers on Vacancy Chennai — not for a national job portal."
      />
      <div className="space-y-10 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/guides", label: "Guides" },
          ]}
        />
        <section aria-labelledby="ideas-heading">
          <h2 id="ideas-heading" className="text-xl font-semibold tracking-tight text-slate-900">
            Ideas you can use this week
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {hiringIdeas.map((idea) => (
              <li key={idea.href} className={sectionCard}>
                <h3 className="text-base font-semibold text-slate-900">{idea.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{idea.body}</p>
                <Link href={idea.href} className={`mt-3 inline-flex ${linkInline}`}>
                  {idea.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="text-xl font-semibold tracking-tight text-slate-900">
            Full guides
          </h2>
          <ul className="mt-4 grid gap-4">
            {guidePages.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className={`block ${sectionCard} ${cardInteractive}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {guide.audience} · {guide.readMinutes} min
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">{guide.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.teaser}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
