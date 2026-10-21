import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { breadcrumbJsonLd, howToJsonLd } from "@/lib/discover/jsonld";
import { hireSteps } from "@/lib/discover/workflows";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, btnSecondary, linkInline, sectionCard } from "@/lib/ui";
import Link from "next/link";

const title = "Hire in Chennai";
const description =
  "Post a moderated job for one Chennai neighbourhood. Candidates apply free. You choose area, shift, range, and follow up from the employer dashboard.";

export const metadata = baseMetadata(title, description, "/hire-in-chennai");

export default function HireInChennaiPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Hire in Chennai", path: "/hire-in-chennai" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to hire on Vacancy Chennai",
              description,
              path: "/hire-in-chennai",
              steps: hireSteps.map((step) => ({ name: step.name, text: step.text })),
            }),
          ),
        }}
      />
      <InnerPageHero
        eyebrow="Employers"
        title="Hire in one Chennai neighbourhood"
        description="People filter by area before they filter by brand. A clear branch, shift, and range beats a louder title."
        actions={
          <>
            <Link href="/employer/register" className={btnPrimary}>
              Create employer account
            </Link>
            <Link href="/pricing" className={btnSecondary}>
              See pricing
            </Link>
          </>
        }
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/hire-in-chennai", label: "Hire in Chennai" },
          ]}
        />
        <p className={`${sectionCard} max-w-3xl text-base leading-relaxed text-slate-800`}>
          Vacancy Chennai publishes moderated listings for Greater Chennai. Candidates are not charged. You submit the
          role, we review it, and applicants reach you through the contact path on that job.
        </p>
        <ol className="grid gap-4 md:grid-cols-2">
          {hireSteps.map((step, index) => (
            <li key={step.name} className={sectionCard}>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Step {index + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{step.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/post-job" className={linkInline}>
            Post a job
          </Link>
          <Link href="/guides/how-to-write-a-chennai-job-post" className={linkInline}>
            How to write the post
          </Link>
          <Link href="/employer/login" className={linkInline}>
            Employer login
          </Link>
        </p>
      </div>
    </>
  );
}
