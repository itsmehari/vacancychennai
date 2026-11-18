import { DiscoverBreadcrumbs } from "@/components/discover/discover-breadcrumbs";
import { DiscoverFaqList } from "@/components/discover/discover-faq-list";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/discover/jsonld";
import { BILLING_SKUS } from "@/lib/billing/skus";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, btnSecondary, linkInline, sectionCard } from "@/lib/ui";
import type { DiscoverFaq } from "@/lib/discover/roles";
import Link from "next/link";

const local = BILLING_SKUS.local_5;
const price = local.amountPaise / 100;

const title = "Hire for a Chennai shop or startup";
const description = `A ₹${price} monthly plan for a shop, clinic, cafe, or startup with a street address. Five moderated job posts. Candidates are not charged.`;

const faqs: DiscoverFaq[] = [
  {
    question: "Who is the ₹199 plan for?",
    answer:
      "A business with one Chennai address: a shop, clinic, cafe, warehouse counter, tuition centre, or a startup office. You name the neighbourhood, the shift, and the pay, then paste the vacancy.",
  },
  {
    question: "What do I get for ₹199?",
    answer:
      "Five publishes in 30 days. A credit is used when a listing is set to Published after review, not when you paste the draft. Each live listing can stay up to 120 days.",
  },
  {
    question: "Do candidates pay?",
    answer:
      "No. People can read the job and apply with a name and phone at no charge. A separate ₹99 seeker pass is only for alerts and a saved profile.",
  },
  {
    question: "What comes after the local plan?",
    answer:
      "A mid-size IT office can move to the verified employer plan (10 posts). A larger office can use the corporate desk (20 posts). Both still go through the same review.",
  },
];

const pillars = [
  {
    href: "/areas",
    title: "Neighbourhood pages",
    body: "People search “jobs in Velachery” or “jobs in Tambaram” before they search a company name. Your listing sits on the area you choose.",
  },
  {
    href: "/roles",
    title: "Role pages",
    body: "Telecaller, delivery, accounts, retail, and the other role hubs collect the titles local businesses actually hire for.",
  },
  {
    href: "/post-job",
    title: "Paste the vacancy",
    body: "Phone, email, then the same text you would send on WhatsApp. Name the area, the shift or job type, and the pay before you send.",
  },
  {
    href: "/guides/how-to-write-a-chennai-job-post",
    title: "What a useful post includes",
    body: "Area, job type, shift, and an honest monthly range. That is the page candidates and Google can quote.",
  },
] as const;

export const metadata = baseMetadata(title, description, "/for-local-businesses");

export default function ForLocalBusinessesPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Local businesses", path: "/for-local-businesses" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(faqs)) }} />
      <InnerPageHero
        eyebrow="First audience"
        title="Hire next to your shop"
        description={`₹${price} a month, five job posts, for a Chennai business with its own address. People find the role on the neighbourhood page. You follow up from the dashboard.`}
        actions={
          <>
            <Link href="/post-job" className={btnPrimary}>
              Paste a vacancy
            </Link>
            <Link href="/employer/billing" className={btnSecondary}>
              Buy the ₹{price} plan
            </Link>
          </>
        }
      />
      <div className="space-y-8 py-8">
        <DiscoverBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/for-local-businesses", label: "Local businesses" },
          ]}
        />
        <div className={`${sectionCard} max-w-3xl`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Short answer</p>
          <p className="mt-2 text-base leading-relaxed text-slate-800">
            Small companies and local businesses show up when the job names a real area. Vacancy Chennai puts that
            listing on the neighbourhood hub, the matching role hub, and the main board. The first plan is ₹{price} for
            five posts in 30 days.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
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
          <Link href="/pricing" className={linkInline}>
            All employer levels
          </Link>
          {" · "}
          <Link href="/hire-in-chennai" className={linkInline}>
            Hiring steps
          </Link>
        </p>
      </div>
    </>
  );
}
