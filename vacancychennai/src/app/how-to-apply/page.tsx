import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { breadcrumbJsonLd, howToJsonLd } from "@/lib/discover/jsonld";
import { applySteps } from "@/lib/discover/workflows";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, linkInline, sectionCard } from "@/lib/ui";
import Link from "next/link";

const title = "How to apply for jobs in Chennai";
const description =
  "Apply on the Vacancy Chennai listing with your name and phone. No candidate fee. An account is only for tracking applications.";

export const metadata = baseMetadata(title, description, "/how-to-apply");

export default function HowToApplyPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "How to apply", path: "/how-to-apply" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: title,
              description,
              path: "/how-to-apply",
              steps: applySteps.map((step) => ({ name: step.name, text: step.text })),
            }),
          ),
        }}
      />
      <InnerPageHero
        eyebrow="Job seekers"
        title="How to apply"
        description="Four steps. The application happens on the job page, not through a paid forwarder."
        actions={
          <Link href="/jobs-in-chennai" className={btnPrimary}>
            Browse jobs
          </Link>
        }
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/how-to-apply", label: "How to apply" },
          ]}
        />
        <p className={`${sectionCard} max-w-3xl text-base leading-relaxed text-slate-800`}>
          Open a listing you can commute to, read the employer and the area, then submit your name and phone if the job
          uses quick apply. Your number is shared with that employer. It is not printed on the public page.
        </p>
        <ol className="grid gap-4 md:grid-cols-2">
          {applySteps.map((step, index) => (
            <li key={step.name} className={sectionCard}>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Step {index + 1}</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{step.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="text-sm text-slate-600">
          <Link href="/guides/phone-only-applications" className={linkInline}>
            Phone-only applications
          </Link>
          {" · "}
          <Link href="/job-safety" className={linkInline}>
            Safety rules
          </Link>
          {" · "}
          <Link href="/candidate/register" className={linkInline}>
            Create a candidate account
          </Link>
        </p>
      </div>
    </>
  );
}
