import Link from "next/link";
import { BILLING_SKUS } from "@/lib/billing/skus";
import { btnPrimary, focusRingOnDark, sectionCard, transitionFast } from "@/lib/ui";

const seeker = BILLING_SKUS.seeker_pass;
const local = BILLING_SKUS.local_5;
const verified = BILLING_SKUS.volume_10;

export default function HomeEmployerPricingStrip() {
  return (
    <section className="border-y border-slate-200/90 bg-slate-50/80 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Who we serve first</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Shops and small offices, then larger teams
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            A business with its own Chennai address can publish five jobs for ₹{local.amountPaise / 100} a month.
            People can read and apply without paying. Alerts are ₹{seeker.amountPaise / 100}.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className={`${sectionCard} flex flex-col`}>
            <h3 className="text-lg font-semibold text-slate-900">{seeker.label}</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">₹{seeker.amountPaise / 100}/mo</p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{seeker.shortDescription}</p>
            <Link href="/for-job-seekers" className={`mt-4 ${btnPrimary}`}>
              See seeker tools
            </Link>
          </article>
          <article className={`${sectionCard} relative flex flex-col border-amber-300/80 ring-1 ring-amber-200/70`}>
            <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
              First plan
            </span>
            <h3 className="text-lg font-semibold text-slate-900">{local.label}</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">₹{local.amountPaise / 100}/mo</p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{local.shortDescription}</p>
            <Link
              href="/for-local-businesses"
              className={`mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-800 ${transitionFast} ${focusRingOnDark}`}
            >
              Hire for your shop
            </Link>
          </article>
          <article className={`${sectionCard} flex flex-col`}>
            <h3 className="text-lg font-semibold text-slate-900">{verified.label}</h3>
            <p className="mt-2 text-3xl font-bold text-slate-900">₹{verified.amountPaise / 100}/mo</p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{verified.shortDescription}</p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              All levels →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
