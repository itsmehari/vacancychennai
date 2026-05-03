import Link from "next/link";
import { ChennaiHeroIllustration } from "@/components/home/chennai-hero-illustration";
import HomeBreakout from "@/components/home/home-breakout";
import HomeHeroFloatingSearch from "@/components/home/home-hero-floating-search";
import type { Location } from "@/types/domain";
import {
  homeHeroCtaBrowseJobs,
  homeHeroCtaCreateAccount,
  homeHeroCtaLearnMore,
  homeHeroEyebrow,
  homeHeroFootnoteTracked,
  homeHeroIndustryPills,
  homeHeroProfileTeaserLead,
  homeHeroProfileTeaserRest,
  homeHeroSocialProofLine,
  homeHeroStatsLabels,
  homeHeroSubcopy,
  homeHeroTitleAfter,
  homeHeroTitleBefore,
  homeHeroTitleHighlight,
} from "@/lib/home-marketing-copy";
import { focusRingOnDark, linkInline, transitionFast } from "@/lib/ui";

type Props = {
  jobCount: number;
  areaCount: number;
  categories: string[];
  locations: Location[];
  /** Live insight from listings, e.g. “Most openings right now: …”. */
  dynamicAreaInsight: string | null;
};

/** Deep navy + amber — distinct from inner pages; pairs with white floating search card. */
const heroBgClass =
  "relative overflow-hidden text-white [background:radial-gradient(ellipse_70%_50%_at_85%_20%,rgba(251,191,36,0.08),transparent),radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(37,99,235,0.12),transparent),linear-gradient(165deg,#060d18_0%,#0c1929_45%,#0a1628_100%)]";

const heroGridOverlay =
  "pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]";

const ovalRing =
  "pointer-events-none absolute rounded-full border border-white/[0.07]";

const primaryOutlineCta = `inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[var(--color-cta-amber)] bg-transparent px-7 py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--color-cta-amber)]/10 ${focusRingOnDark} ${transitionFast}`;

const learnMoreLink = `group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white ${focusRingOnDark} rounded-md ${transitionFast}`;

const secondarySolidCta = `inline-flex min-h-[44px] items-center justify-center rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 ${focusRingOnDark} ${transitionFast}`;

function formatStat(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    const s = k >= 10 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, "");
    return `${s}K`;
  }
  return String(n);
}

export default function HomeHero({
  jobCount,
  areaCount,
  categories,
  locations,
  dynamicAreaInsight,
}: Props) {
  const jobsDisplay = jobCount > 0 ? formatStat(jobCount) : "—";
  const areasDisplay = areaCount > 0 ? String(areaCount) : "—";

  return (
    <HomeBreakout className={heroBgClass}>
      <div className={heroGridOverlay} aria-hidden />
      <div
        className={`${ovalRing} -right-[20%] top-[10%] h-[min(90vw,420px)] w-[min(95vw,520px)] md:-right-[8%]`}
        aria-hidden
      />
      <div
        className={`${ovalRing} right-[5%] top-[18%] h-[min(75vw,340px)] w-[min(82vw,440px)] md:right-[12%]`}
        aria-hidden
      />
      <div
        className={`${ovalRing} -right-[10%] bottom-[8%] h-[min(70vw,300px)] w-[min(78vw,380px)] opacity-60 md:right-[2%]`}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-12 md:pb-32 md:pt-16 lg:pb-36 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:gap-12 xl:gap-16">
          <div className="relative z-10 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90 md:text-sm">
              {homeHeroEyebrow}
            </p>
            <h1 className="mt-4 max-w-2xl text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white md:text-4xl md:leading-[1.08] lg:text-[2.65rem] lg:leading-[1.06]">
              {homeHeroTitleBefore}
              <span className="relative inline-block align-baseline">
                <span
                  className="relative z-10 inline-block rounded-full bg-[var(--color-cta-amber)] px-3 py-0.5 text-slate-900 shadow-sm md:px-4 md:py-1"
                  style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}
                >
                  {homeHeroTitleHighlight}
                </span>
              </span>
              {homeHeroTitleAfter}
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg">{homeHeroSubcopy}</p>
            {dynamicAreaInsight ? (
              <p className="mt-3 max-w-lg border-l-2 border-amber-400/50 pl-3 text-sm font-medium leading-relaxed text-amber-100/90 md:text-base">
                {dynamicAreaInsight}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/jobs-in-chennai"
                className={primaryOutlineCta}
                data-cta="hero-browse-all-jobs"
              >
                {homeHeroCtaBrowseJobs}
              </Link>
              <Link href="/#home-hiw-heading" className={learnMoreLink} data-cta="hero-learn-more">
                {homeHeroCtaLearnMore}
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-cta-amber)]/80 text-[var(--color-cta-amber)] transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/candidate/login?new=1"
                className={secondarySolidCta}
                data-cta="hero-create-account"
              >
                {homeHeroCtaCreateAccount}
              </Link>
            </div>
            <p className="mt-3 max-w-lg text-sm text-slate-400">
              {homeHeroFootnoteTracked}{" "}
              <Link href="/candidate/login" className={`${linkInline} text-amber-200/90 hover:text-white`}>
                Sign in
              </Link>
            </p>
            <p className="mt-2 max-w-lg text-xs text-slate-500">
              <Link
                href="/job-seeker-profile"
                className={`${linkInline} font-medium text-amber-200/85 hover:text-white`}
                data-cta="hero-job-seeker-profile"
              >
                {homeHeroProfileTeaserLead}
              </Link>
              {homeHeroProfileTeaserRest}
            </p>

            <p className="mt-8 text-xs font-medium text-slate-500 md:text-sm">{homeHeroSocialProofLine}</p>
            <div className="mt-3 flex flex-wrap items-center gap-6 opacity-65 md:gap-8">
              {homeHeroIndustryPills.map((pill) => (
                <span
                  key={pill}
                  className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="mt-10 flex justify-center sm:hidden">
              <ChennaiHeroIllustration className="mx-auto h-auto w-[min(100%,280px)] opacity-90" />
            </div>
          </div>

          <div
            className="relative mx-auto hidden w-full max-w-[320px] justify-self-end sm:block lg:max-w-none"
            aria-hidden
          >
            <ChennaiHeroIllustration className="h-auto w-full max-h-[min(420px,52vh)] drop-shadow-2xl" />
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-4 z-30 md:bottom-8 md:left-6 md:right-6 lg:bottom-10 lg:left-8 lg:right-[8%] xl:right-[12%]">
          <HomeHeroFloatingSearch categories={categories} locations={locations} />
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-slate-800/90 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl divide-y divide-white/10 px-4 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:py-10">
          <div className="px-2 py-5 text-center sm:py-4 sm:pr-6">
            <p className="text-3xl font-bold tabular-nums tracking-tight text-white md:text-4xl">
              {jobsDisplay}
              {jobCount > 0 ? <span className="text-[var(--color-cta-amber)]">+</span> : null}
            </p>
            <p className="mt-1 text-sm text-slate-400">{homeHeroStatsLabels.listings}</p>
          </div>
          <div className="px-2 py-5 text-center sm:py-4 sm:px-6">
            <p className="text-3xl font-bold tabular-nums tracking-tight text-white md:text-4xl">
              {areasDisplay}
              {areaCount > 0 ? <span className="text-[var(--color-cta-amber)]">+</span> : null}
            </p>
            <p className="mt-1 text-sm text-slate-400">{homeHeroStatsLabels.areas}</p>
          </div>
          <div className="px-2 py-5 text-center sm:py-4 sm:pl-6">
            <p className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Free<span className="text-[var(--color-cta-amber)]">.</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">{homeHeroStatsLabels.free}</p>
          </div>
        </div>
      </div>
    </HomeBreakout>
  );
}
