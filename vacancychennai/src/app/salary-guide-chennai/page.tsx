import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { DiscoverFaqList } from "@/components/discover/discover-faq-list";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { listPublishedJobs } from "@/features/core/repository";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/discover/jsonld";
import { buildSalarySnapshot, formatInrMonthly } from "@/lib/salary-snapshot";
import { baseMetadata } from "@/lib/seo";
import { linkInline, sectionCard } from "@/lib/ui";
import Link from "next/link";
import type { SalaryRow } from "@/lib/salary-snapshot";

const title = "Chennai salary snapshot from live listings";
const description =
  "Monthly salary ranges currently published on Vacancy Chennai. Figures come from employer-entered min and max values, not a city wage survey.";

const faqs = [
  {
    question: "Is this the average salary in Chennai?",
    answer:
      "No. It is the spread of monthly ranges on listings that included both a minimum and a maximum. Roles without a range are excluded. Final pay is set by the employer.",
  },
  {
    question: "Why might a category look high or low?",
    answer:
      "A handful of listings can move the low, the high, and the midpoint. Read the count beside each row before you treat it as a market.",
  },
];

function SalaryTable({ caption, rows }: { caption: string; rows: SalaryRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <caption className="border-b border-slate-100 px-4 py-3 text-left text-base font-semibold text-slate-900">
          {caption}
        </caption>
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
              Group
            </th>
            <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
              Listings
            </th>
            <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
              Lowest min
            </th>
            <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
              Highest max
            </th>
            <th scope="col" className="whitespace-nowrap px-4 py-2 font-medium">
              Midpoint median
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-slate-100">
              <th scope="row" className="px-4 py-3 font-medium text-slate-900">
                {row.label}
              </th>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{row.count}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatInrMonthly(row.low)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatInrMonthly(row.high)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatInrMonthly(row.midpointMedian)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const metadata = baseMetadata(title, description, "/salary-guide-chennai");

export default async function SalaryGuidePage() {
  const jobs = await listPublishedJobs();
  const snapshot = buildSalarySnapshot(jobs);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Salary snapshot", path: "/salary-guide-chennai" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs)) }} />
      <InnerPageHero
        eyebrow="Pay"
        title="Salary snapshot"
        description="Live monthly ranges from moderated listings that included both a minimum and a maximum. Indicative only."
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/salary-guide-chennai", label: "Salary snapshot" },
          ]}
        />
        {snapshot ? (
          <>
            <div className={`${sectionCard} max-w-3xl`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Short answer</p>
          <p className="mt-2 text-base leading-relaxed text-slate-800">
              As of{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Kolkata",
              })}
              , {snapshot.count} published {snapshot.count === 1 ? "listing has" : "listings have"} a monthly range.
              The lowest minimum is {formatInrMonthly(snapshot.low)} and the highest maximum is{" "}
              {formatInrMonthly(snapshot.high)}. The median of range midpoints is{" "}
              {formatInrMonthly(snapshot.midpointMedian)}. This describes the board, not every job in Chennai.
            </p>
            </div>
            <SalaryTable caption="By job type" rows={snapshot.byJobType} />
            <SalaryTable caption="By category" rows={snapshot.byCategory} />
          </>
        ) : (
          <div className={`${sectionCard} max-w-3xl`}>
            <p className="font-medium text-slate-900">No salary ranges on live listings yet</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              When employers publish a minimum and a maximum, this page will summarise them. Browse the board in the
              meantime.
            </p>
          </div>
        )}
        <p className="text-sm text-slate-600">
          <Link href="/jobs-in-chennai" className={linkInline}>
            Filter jobs by salary
          </Link>
          {" · "}
          <Link href="/roles" className={linkInline}>
            Browse by role
          </Link>
        </p>
        <DiscoverFaqList items={faqs} />
      </div>
    </>
  );
}
