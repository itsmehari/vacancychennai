import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { DiscoverFaqList } from "@/components/discover/discover-faq-list";
import { PublishedJobGrid } from "@/components/discover/published-job-grid";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import {
  getEmployerCompanyNameMap,
  listLocations,
  listPublishedJobs,
} from "@/features/core/repository";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/discover/jsonld";
import { jobMatchesRole } from "@/lib/discover/match";
import { getRoleHub, roleHubs } from "@/lib/discover/roles";
import { buildJobsItemListJsonLd } from "@/lib/jobs-itemlist-jsonld";
import { baseMetadata } from "@/lib/seo";
import { linkInline, sectionCard } from "@/lib/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return roleHubs.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const role = getRoleHub(slug);
  if (!role) return baseMetadata("Role not found", "This role hub does not exist.", `/roles/${slug}`);
  return {
    ...baseMetadata(role.title, role.teaser, `/roles/${role.slug}`),
    keywords: [role.title, `${role.label} jobs Chennai`, "Vacancy Chennai"],
  };
}

export default async function RoleHubPage({ params }: Props) {
  const { slug } = await params;
  const role = getRoleHub(slug);
  if (!role) notFound();

  const [published, locations, employerNames] = await Promise.all([
    listPublishedJobs(),
    listLocations(),
    getEmployerCompanyNameMap(),
  ]);
  const jobs = published
    .filter((job) => jobMatchesRole(job, role))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const path = `/roles/${role.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Roles", path: "/roles" },
    { name: role.label, path },
  ];
  const listJsonLd = jobs.length > 0 ? buildJobsItemListJsonLd(jobs.slice(0, 24), role.title) : null;
  const others = roleHubs.filter((item) => item.slug !== role.slug).slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(role.faqs)) }} />
      {listJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      ) : null}
      <InnerPageHero eyebrow="Role" title={role.title} description={role.teaser} />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/roles", label: "Roles" },
            { href: path, label: role.label },
          ]}
        />
        <div className={`${sectionCard} max-w-3xl space-y-3`}>
          <p className="text-base leading-relaxed text-slate-700">{role.intro}</p>
          <p className="text-base leading-relaxed text-slate-700">{role.where}</p>
        </div>
        <section className="max-w-3xl" aria-labelledby="apply-tips-heading">
          <h2 id="apply-tips-heading" className="text-xl font-semibold text-slate-900">
            Before you apply
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-700">
            {role.applyTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          {role.categoryQuery ? (
            <p className="mt-3 text-sm text-slate-600">
              <Link
                href={`/jobs-in-chennai?category=${encodeURIComponent(role.categoryQuery)}`}
                className={linkInline}
              >
                Category filter: {role.categoryQuery}
              </Link>
            </p>
          ) : null}
        </section>
        <PublishedJobGrid
          jobs={jobs}
          locationsById={locationsById}
          employerNames={employerNames}
          listLabel={role.title}
          listingSource={`role-${role.slug}`}
        />
        <DiscoverFaqList items={role.faqs} />
        <nav aria-label="Other roles">
          <h2 className="text-xl font-semibold text-slate-900">Other role hubs</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={`/roles/${item.slug}`} className={linkInline}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
