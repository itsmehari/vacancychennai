import Link from "next/link";
import { BILLING_SKUS } from "@/lib/billing/skus";
import { btnPrimary, focusRingOnDark, sectionCard, transitionFast } from "@/lib/ui";

const anchor = BILLING_SKUS.post_single;
const popular = BILLING_SKUS.employer_monthly_pass;
const volume = BILLING_SKUS.volume_5;

export default function HomeEmployerPricingStrip() {
  return (
    <section className="border-y border-slate-200/90 bg-slate-50/80 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Employers</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Register and submit roles for review for free. Pay only when you need a live Chennai listing — from{" "}
            <strong>₹{(anchor.amountPaise / 100).toFixed(0)}</strong> per post (120 days on the board) or a monthly
            pass for small teams.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className={`${sectionCard} flex flex-col`}>
            <h3 className="text-lg font-semibold text-slate-900">{anchor.label}</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">₹{anchor.amountPaise / 100}</p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{anchor.shortDescription}</p>
            <Link href="/employer/register" className={`mt-4 ${btnPrimary}`}>
              Get started
            </Link>
          </article>
          <article className={`${sectionCard} relative flex flex-col border-amber-300/80 ring-1 ring-amber-200/70`}>
            <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
              Most popular
            </span>
            <h3 className="text-lg font-semibold text-slate-900">{popular.label}</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">₹{popular.amountPaise / 100}/mo</p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{popular.shortDescription}</p>
            <Link
              href="/employer/billing"
              className={`mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800 ${transitionFast} ${focusRingOnDark}`}
            >
              Buy pass
            </Link>
          </article>
          <article className={`${sectionCard} flex flex-col`}>
            <h3 className="text-lg font-semibold text-slate-900">{volume.label}</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">₹{volume.amountPaise / 100}</p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{volume.shortDescription}</p>
            <p className="mt-2 text-xs font-medium text-amber-900/90">
              Effective ₹49/post on volume packs — see all tiers on pricing.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Full pricing →
            </Link>
          </article>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Checkout via SuperProfile payment links. GST-ready invoices. Renew when you choose — no surprise auto-debit on our site.
        </p>
      </div>
    </section>
  );
}
