import InnerPageHero from "@/components/marketing/inner-page-hero";
import Link from "next/link";
import { baseMetadata } from "@/lib/seo";
import { btnPrimary, focusRingOnDark, sectionCard, transitionFast } from "@/lib/ui";

export const metadata = baseMetadata(
  "Employer pricing — Vacancy Chennai",
  "Simple plans for Chennai employers to post moderated, hyperlocal job listings and reach nearby candidates.",
  "/pricing",
);

const plans = [
  {
    name: "Basic",
    price: "INR 99",
    blurb: "Single job posting — ideal for a one-off hire.",
    featured: false,
  },
  {
    name: "Featured",
    price: "INR 299",
    blurb: "Area-top featured listing — more visibility where it matters.",
    featured: true,
  },
  {
    name: "Urgent Pack",
    price: "INR 999",
    blurb: "Urgent posting plus assisted candidate outreach when you need speed.",
    featured: false,
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Employers"
        title="Simple pricing for Chennai hiring"
        description="Pick a tier that matches how quickly you need to fill the role. Upgrade anytime from your dashboard."
        actions={
          <>
            <Link href="/post-job" className={btnPrimary}>
              Post a job
            </Link>
            <Link
              href="/contact"
              className={`inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-white/45 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/12 ${focusRingOnDark} ${transitionFast}`}
            >
              Talk to us
            </Link>
          </>
        }
      />
      <div className="grid gap-5 pb-4 pt-8 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`${sectionCard} relative flex flex-col ${plan.featured ? "border-blue-300/80 shadow-md ring-1 ring-blue-200/60 md:-mt-1 md:py-7" : ""}`}
          >
            {plan.featured ? (
              <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                Popular
              </span>
            ) : null}
            <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{plan.price}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{plan.blurb}</p>
            <Link
              href="/employer/login"
              className={`mt-6 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-center text-sm font-semibold ${plan.featured ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50"} ${transitionFast}`}
            >
              Get started
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
