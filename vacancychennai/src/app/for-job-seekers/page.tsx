import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { DiscoverFaqList } from "@/components/discover/discover-faq-list";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/discover/jsonld";
import { BILLING_SKUS } from "@/lib/billing/skus";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, btnSecondary, linkInline, sectionCard } from "@/lib/ui";
import type { DiscoverFaq } from "@/lib/discover/roles";
import Link from "next/link";

const pass = BILLING_SKUS.seeker_pass;
const price = pass.amountPaise / 100;

const title = "Find a Chennai job by neighbourhood";
const description = `Read moderated Chennai listings and apply free. A ₹${price} monthly pass adds area and role alerts and keeps your profile ready.`;

const faqs: DiscoverFaq[] = [
  {
    question: "Do I have to pay to see jobs?",
    answer:
      "No. Area pages, role pages, and each job page stay public so you can open them from search. Applying with your name and phone on the job page is free.",
  },
  {
    question: "What is the ₹99 pass?",
    answer:
      "Thirty days of job alerts for one area and one role, and a profile you can reuse. It does not guarantee a hire, and it is not a fee to an employer.",
  },
  {
    question: "Where should I start?",
    answer:
      "Open the neighbourhood you can commute to, then a role hub if you have a title in mind. The salary page only shows ranges employers typed on live listings.",
  },
];

const pillars = [
  {
    href: "/areas",
    title: "Jobs by neighbourhood",
    body: "Start with the area you can reach before the shift. Each hub lists only published roles for that place.",
  },
  {
    href: "/roles",
    title: "Jobs by role",
    body: "Telecaller, delivery, accounts, retail, nursing, and the other titles people type into search.",
  },
  {
    href: "/salary-guide-chennai",
    title: "Pay on live listings",
    body: "A snapshot of minimum and maximum amounts employers entered. It is this board, not a city wage survey.",
  },
  {
    href: "/jobs-this-week",
    title: "Posted this week",
    body: "A count of moderated listings from the last seven days, grouped by area.",
  },
  {
    href: "/how-to-apply",
    title: "How to apply",
    body: "Name and phone on the job page. Keep the job link. Do not pay a third party to confirm a seat.",
  },
  {
    href: "/job-safety",
    title: "Job safety",
    body: "If someone asks for a fee, stop and send the job URL to support@vacancychennai.in.",
  },
] as const;

export const metadata = baseMetadata(title, description, "/for-job-seekers");

export default function ForJobSeekersPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Job seekers", path: "/for-job-seekers" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs)) }} />
      <InnerPageHero
        eyebrow="Job seekers"
        title="Look by area, then by role"
        description={`Listings stay free to read and apply. ₹${price} a month adds alerts for the neighbourhood and role you care about.`}
        actions={
          <>
            <Link href="/jobs-in-chennai" className={btnPrimary}>
              Browse jobs
            </Link>
            <Link href="/candidate/billing" className={btnSecondary}>
              Seeker pass ₹{price}
            </Link>
          </>
        }
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/for-job-seekers", label: "Job seekers" },
          ]}
        />
        <div className={`${sectionCard} max-w-3xl`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Short answer</p>
          <p className="mt-2 text-base leading-relaxed text-slate-800">
            Search still starts on the public pages: neighbourhood, role, this week, and the salary snapshot. The ₹
            {price} pass is for alerts and a saved profile, not for unlocking the job list.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <li key={pillar.href}>
              <Link href={pillar.href} className={`block h-full ${sectionCard}`}>
                <h2 className="text-lg font-semibold text-slate-900">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.body}</p>
              </Link>
            </li>
          ))}
        </ul>
        <DiscoverFaqList items={faqs} />
        <p className="text-sm text-slate-600">
          <Link href="/subscribe" className={linkInline}>
            Job alerts
          </Link>
          {" · "}
          <Link href="/job-seeker-profile" className={linkInline}>
            Profile
          </Link>
          {" · "}
          <Link href="/pricing" className={linkInline}>
            Pricing
          </Link>
        </p>
      </div>
    </>
  );
}
