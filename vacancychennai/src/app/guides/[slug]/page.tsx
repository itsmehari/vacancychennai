import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { DiscoverFaqList } from "@/components/discover/discover-faq-list";
import { RelatedLinkList } from "@/components/discover/related-link-list";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { getGuidePage, guidePages } from "@/lib/discover/guides";
import { getGuideTamil } from "@/lib/discover/guide-tamil";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/discover/jsonld";
import { baseMetadata } from "@/lib/seo";
import { sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guidePages.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuidePage(slug);
  if (!guide) return baseMetadata("Guide not found", "This guide does not exist.", `/guides/${slug}`);
  const base = baseMetadata(guide.title, guide.teaser, `/guides/${guide.slug}`);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: guide.updated,
      modifiedTime: guide.updated,
    },
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuidePage(slug);
  if (!guide) notFound();
  const tamil = getGuideTamil(guide.slug);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ];
  const updatedLabel = new Date(`${guide.updated}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      {guide.faqs.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(guide.faqs)) }}
        />
      ) : null}
      <InnerPageHero eyebrow={guide.audience} title={guide.title} description={guide.teaser} />
      <article className="py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/guides", label: "Guides" },
            { href: `/guides/${guide.slug}`, label: guide.title },
          ]}
        />
        <p className="mt-4 text-sm text-slate-500">
          Updated {updatedLabel} · {guide.readMinutes} min read · Vacancy Chennai
        </p>
        <div className={`${sectionCard} mt-6 max-w-3xl`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Short answer</p>
          <p className="mt-2 text-base leading-relaxed text-slate-800">{guide.directAnswer}</p>
        </div>
        {tamil ? (
          <section className={`${sectionCard} mt-4 max-w-3xl`} lang="ta" aria-labelledby="guide-tamil">
            <h2 id="guide-tamil" className="font-[family-name:var(--font-noto-tamil)] text-lg font-semibold text-slate-900">
              {tamil.title}
            </h2>
            <p className="mt-2 font-[family-name:var(--font-noto-tamil)] text-base leading-relaxed text-slate-800">
              {tamil.answer}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 font-[family-name:var(--font-noto-tamil)] text-base leading-relaxed text-slate-700">
              {tamil.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <div className="mt-8 max-w-3xl space-y-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-3 text-base leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-700">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
        <DiscoverFaqList items={guide.faqs} />
        <RelatedLinkList links={guide.related} />
        <p className="mt-8 text-sm text-slate-600">
          <Link href="/guides" className="font-semibold text-blue-700 hover:underline">
            All guides
          </Link>
        </p>
      </article>
    </>
  );
}
