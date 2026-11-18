import InnerPageHero from "@/components/marketing/inner-page-hero";
import Link from "next/link";
import { BILLING_SKUS } from "@/lib/billing/skus";
import { baseMetadata } from "@/lib/seo";
import {
  btnPrimary,
  focusRingOnDark,
  sectionCard,
  transitionFast,
} from "@/lib/ui";

export const metadata = baseMetadata(
  "Pricing — Vacancy Chennai",
  "Job seekers browse free. A ₹99 pass adds alerts. Local businesses post 5 jobs for ₹199 a month. Verified and corporate plans cover larger Chennai offices.",
  "/pricing",
);

const faqs = [
  {
    q: "What is free vs paid?",
    a: "Reading a job and applying with your name and phone is free. Job seekers can add a ₹99 pass for area and role alerts. Employers pay when a reviewed listing is published.",
  },
  {
    q: "Who is the ₹199 plan for?",
    a: "A shop, clinic, cafe, startup, or any Chennai business with its own street address. It includes five publishes in 30 days.",
  },
  {
    q: "When are credits used?",
    a: "A prepaid credit is consumed when our team first sets your job to Published — not when you paste a draft. If we reject a listing before publish, that job does not consume a credit.",
  },
  {
    q: "What are the later employer levels?",
    a: "Verified employer is 10 posts in 30 days for a mid-size IT team, after the company name and office address match. Corporate desk is 20 posts for a larger office. The same review applies.",
  },
  {
    q: "How do I pay?",
    a: "Sign in, then open billing. Checkout uses a SuperProfile payment page. Use the same email as your Vacancy Chennai account. Credits appear after payment is confirmed.",
  },
  {
    q: "Refunds?",
    a: "If a role never reaches Published, you have not used a publish credit for that job. For payment issues, email support@vacancychennai.in with your SuperProfile receipt and Vacancy Chennai order id within 14 days.",
  },
] as const;

export default function PricingPage() {
  const tiers = [
    BILLING_SKUS.local_5,
    BILLING_SKUS.volume_10,
    BILLING_SKUS.volume_20,
    BILLING_SKUS.post_single,
  ];
  const seeker = BILLING_SKUS.seeker_pass;
  const monthlyIds = new Set(["local_5", "volume_10", "volume_20", "seeker_pass"]);

  return (
    <>
      <InnerPageHero
        eyebrow="Pricing"
        title="Cheap for a shop. Clear for a larger office."
        description="First we serve Chennai businesses with their own address. Job seekers can read and apply without paying. A ₹99 pass is only for alerts and a saved profile."
        actions={
          <>
            <Link href="/for-local-businesses" className={btnPrimary}>
              For local businesses
            </Link>
            <Link
              href="/for-job-seekers"
              className={`inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-white/45 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/12 ${focusRingOnDark} ${transitionFast}`}
            >
              For job seekers
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <article className={`${sectionCard} mb-5 max-w-xl`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Job seekers</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{seeker.label}</h2>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            ₹{seeker.amountPaise / 100}
            <span className="text-base font-semibold text-slate-600"> / month</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{seeker.shortDescription}</p>
          <Link href="/candidate/billing" className={`mt-6 inline-flex ${btnPrimary}`}>
            Get the seeker pass
          </Link>
        </article>

        <h2 className="mb-4 text-xl font-semibold text-slate-900">Employers</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((plan) => {
            const popular = plan.id === "local_5";
            return (
              <article
                key={plan.id}
                className={`${sectionCard} relative flex flex-col ${
                  popular ? "border-amber-300/90 shadow-md ring-1 ring-amber-200/70 md:-mt-1 md:py-7" : ""
                }`}
              >
                {popular ? (
                  <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
                    Most popular
                  </span>
                ) : null}
                <h2 className="text-lg font-semibold text-slate-900">{plan.label}</h2>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  ₹{(plan.amountPaise / 100).toFixed(plan.amountPaise % 100 === 0 ? 0 : 2)}
                  {monthlyIds.has(plan.id) ? (
                    <span className="text-base font-semibold text-slate-600"> / month</span>
                  ) : null}
                </p>
                <ul className="mt-4 flex-1 list-inside list-disc space-y-1.5 text-sm text-slate-700">
                  <li>Chennai hyperlocal areas on every listing</li>
                  <li>Employer dashboard + applicant inbox</li>
                  <li>Human moderation before roles go public</li>
                  <li>{plan.shortDescription}</li>
                </ul>
                <Link
                  href="/employer/billing"
                  className={`mt-6 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-center text-sm font-semibold ${
                    popular
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                  } ${transitionFast}`}
                >
                  Buy on billing
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-6 rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/60 p-4 text-center text-sm text-slate-700">
          <strong className="text-slate-900">Also on billing:</strong> a two-listing monthly pass, 3-post and 5-post packs, and a single extra post at ₹
          {BILLING_SKUS.post_overage.amountPaise / 100}. The first plan to buy is local business, five posts for ₹
          {BILLING_SKUS.local_5.amountPaise / 100}.
        </div>

        <p className="mt-4 text-center text-sm leading-relaxed text-slate-600">
          <strong className="text-slate-800">Trust:</strong> SuperProfile checkout · GST-ready invoicing path · No
          surprise auto-debit on our checkout · Moderation typically within 1–2 business days (set your own SLA in
          ops docs).
        </p>

        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold text-slate-900">Pricing questions, cleared up</h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-4">
            {faqs.map((item) => (
              <article
                key={item.q}
                className="rounded-[var(--radius-md)] border border-slate-200/90 bg-white p-4 shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-slate-600">
          Billing questions?{" "}
          <Link href="/contact" className="font-semibold text-blue-700 hover:text-blue-900 hover:underline">
            Contact us
          </Link>{" "}
          or email{" "}
          <a
            href="mailto:support@vacancychennai.in"
            className="font-semibold text-blue-700 hover:text-blue-900 hover:underline"
          >
            support@vacancychennai.in
          </a>
          .
        </p>
      </div>
    </>
  );
}
