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
  "Employer pricing — Vacancy Chennai",
  "Pay-per-post, monthly pass, and volume packs for Chennai employers. Hyperlocal listings, moderation, and checkout via SuperProfile payment links.",
  "/pricing",
);

const faqs = [
  {
    q: "What is free vs paid?",
    a: "Registering and submitting a job for review is free. You pay when you need publish credits or a monthly pass so listings can go live on the board (after moderation).",
  },
  {
    q: "When are credits used?",
    a: "A prepaid credit is consumed when our team first sets your job to Published — not when you save a draft. If we reject a listing before publish, that job does not consume a credit.",
  },
  {
    q: "What is the monthly pass?",
    a: `For ₹${BILLING_SKUS.employer_monthly_pass.amountPaise / 100}/month you can keep up to ${(BILLING_SKUS.employer_monthly_pass.buildEntitlementRef() as { max_live_posts?: number }).max_live_posts ?? 2} job(s) live at the same time for 30 days, subject to the same review rules.`,
  },
  {
    q: "How do volume packs work?",
    a: "Volume packs bundle publishes at an effective ₹49 each (3, 5, 10, or 20 posts). They expire 30 days after purchase. If you need more in the same window, buy another pack or use a single post / overage post.",
  },
  {
    q: "How do I pay?",
    a: "Signed-in employers open a SuperProfile payment page (links are configured per plan in production). Use the same email on SuperProfile as on Vacancy Chennai. Credits appear after payment is confirmed — via automation webhook or our team marking the order paid.",
  },
  {
    q: "Refunds?",
    a: "If a role never reaches Published, you have not used a publish credit for that job. For payment issues, email us with your SuperProfile receipt and Vacancy Chennai order id within 14 days — see our billing policy doc in the repository docs folder.",
  },
] as const;

export default function PricingPage() {
  const tiers = [
    BILLING_SKUS.post_single,
    BILLING_SKUS.employer_monthly_pass,
    BILLING_SKUS.volume_3,
    BILLING_SKUS.volume_5,
    BILLING_SKUS.volume_10,
    BILLING_SKUS.volume_20,
  ];

  return (
    <>
      <InnerPageHero
        eyebrow="Employers"
        title="Choose how you want to hire in Chennai"
        description="Start free: create an account and send roles to our moderation queue. When you are ready for live visibility, buy a single post (120 days on the board), a monthly pass for up to two concurrent listings, or a volume pack for HR teams."
        actions={
          <>
            <Link href="/employer/register" className={btnPrimary}>
              Create employer account
            </Link>
            <Link
              href="/employer/login"
              className={`inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-white/45 bg-white/5 px-5 py-2 text-sm font-semibold text-white hover:bg-white/12 ${focusRingOnDark} ${transitionFast}`}
            >
              Already registered? Sign in
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((plan) => {
            const popular = plan.id === "employer_monthly_pass";
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
                  {plan.id === "employer_monthly_pass" ? (
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
          <strong className="text-slate-900">India anchor:</strong> single post ₹
          {BILLING_SKUS.post_single.amountPaise / 100} · volume from ₹
          {BILLING_SKUS.volume_3.amountPaise / 100} (3 posts). Overage single post ₹
          {BILLING_SKUS.post_overage.amountPaise / 100} when offered in billing.
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
          Full policy: see <code className="rounded bg-slate-100 px-1">docs/EMPLOYER_BILLING_POLICY.md</code> in the
          repo.
        </p>
      </div>
    </>
  );
}
