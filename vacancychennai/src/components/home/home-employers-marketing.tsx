import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import { btnPrimary, btnSecondary } from "@/lib/ui";

const bullets = [
  "Reach candidates who actually live near your workplace — less no-show, faster joins.",
  "Affordable listings and featured options for urgent or high-visibility roles.",
  "Moderation helps keep spam and fake listings off the platform.",
];

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    </span>
  );
}

export default function HomeEmployersMarketing() {
  return (
    <HomeSectionShell variant="plain" fullBleed>
      <section
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-blue-200/90 bg-gradient-to-br from-blue-50 via-white to-slate-50 px-6 py-10 shadow-[var(--shadow-card)] md:px-10 md:py-14"
        aria-labelledby="home-employers-heading"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-amber-200/15 blur-3xl"
          aria-hidden
        />
        <div className="relative grid gap-10 lg:grid-cols-3 lg:gap-12 lg:items-start">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700/90">For employers</p>
            <h2
              id="home-employers-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl md:leading-[1.15]"
            >
              Hiring in Chennai? Post where locals are already looking
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700 md:text-[1.05rem]">
              Vacancy Chennai is built for SMEs, shops, clinics, logistics, and offices that need nearby talent —
              not a nationwide flood of irrelevant resumes.
            </p>
            <ul className="mt-8 space-y-4">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm leading-relaxed text-slate-800 md:text-base">
                  <CheckIcon />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-slate-200/80 bg-white/95 p-6 shadow-sm lg:sticky lg:top-28">
            <p className="text-sm font-medium text-slate-500">Next step</p>
            <Link href="/pricing" className={btnPrimary} data-cta="employers-pricing">
              See employer pricing
            </Link>
            <Link href="/employer/login" className={btnSecondary} data-cta="employers-login">
              Employer login
            </Link>
          </div>
        </div>
      </section>
    </HomeSectionShell>
  );
}
