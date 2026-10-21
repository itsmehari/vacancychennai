import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { DiscoverFaqList } from "@/components/discover/discover-faq-list";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/discover/jsonld";
import { baseMetadata } from "@/lib/seo";
import { linkInline, sectionCard } from "@/lib/ui";
import Link from "next/link";

const title = "Job safety on Vacancy Chennai";
const description =
  "Never pay a third party to confirm a Chennai job. Apply on the listing, keep the URL, and report fee demands to support.";

const rules = [
  "Do not pay for job confirmation, a form, a kit, or a “slot”.",
  "Apply only through the path on the job page: quick apply, the printed external URL, or the contact the employer published.",
  "Your phone is shared with the employer for jobs you apply to. It is not a public field.",
  "A walk-in exists only when that listing states the time and place.",
  "Moderation is a review of the posting, not a promise that you should join.",
  "Report problems with the job URL to support@vacancychennai.in.",
];

const faqs = [
  {
    question: "Who do I pay to get hired?",
    answer: "Nobody on this board. Employers may pay Vacancy Chennai for listing options. Candidates do not.",
  },
  {
    question: "What if someone WhatsApps me from a different company name?",
    answer:
      "Stop and compare it with the employer on the job URL. If it does not match, do not send documents or money. Report the URL.",
  },
];

export const metadata = baseMetadata(title, description, "/job-safety");

export default function JobSafetyPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Job safety", path: "/job-safety" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs)) }} />
      <InnerPageHero
        eyebrow="Trust"
        title="Job safety"
        description="The rule that matters: never pay a third party for job confirmation."
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/job-safety", label: "Job safety" },
          ]}
        />
        <ul className="grid gap-3">
          {rules.map((rule) => (
            <li key={rule} className={`${sectionCard} text-base leading-relaxed text-slate-800`}>
              {rule}
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-600">
          <Link href="/contact" className={linkInline}>
            Contact support
          </Link>
          {" · "}
          <Link href="/guides/spot-a-fake-job-in-chennai" className={linkInline}>
            Fake-job patterns
          </Link>
          {" · "}
          <Link href="/guides/walk-in-jobs-chennai" className={linkInline}>
            Walk-in checks
          </Link>
        </p>
        <DiscoverFaqList items={faqs} />
      </div>
    </>
  );
}
