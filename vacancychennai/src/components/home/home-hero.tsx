import Link from "next/link";
import { ChennaiHeroIllustration } from "@/components/home/chennai-hero-illustration";
import HomeBreakout from "@/components/home/home-breakout";
import HomeHeroFloatingSearch from "@/components/home/home-hero-floating-search";
import type { Location } from "@/types/domain";
import {
  homeHeroBrand,
  homeHeroCorridors,
  homeHeroCtaBrowseJobs,
  homeHeroCtaCreateAccount,
  homeHeroCtaLearnMore,
  homeHeroEyebrow,
  homeHeroFootnote,
  homeHeroStatsLabels,
  homeHeroSubcopy,
  homeHeroTitle,
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

/** Deep navy + amber — brand-led first viewport; search card sits as the interaction layer. */
const heroBgClass =
  "relative overflow-hidden text-white [background:radial-gradient(ellipse_65%_45%_at_88%_12%,rgba(251,191,36,0.1),transparent_55%),radial-gradient(ellipse_45%_50%_at_8%_88%,rgba(37,99,235,0.14),transparent_50%),linear-gradient(168deg,#050b14_0%,#0b1626_42%,#0a1422_100%)]";

const heroGrain =
  "pointer-events-none absolute inset-0 opacity-[0.035] [background-image:url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")]";

const primaryCta = `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-cta-amber)] px-7 py-2.5 text-center text-sm font-semibold text-slate-950 shadow-sm hover:bg-[var(--color-cta-amber-hover)] ${focusRingOnDark} ${transitionFast}`;

const secondaryCta = `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10 ${focusRingOnDark} ${transitionFast}`;

const learnMoreLink = `inline-flex min-h-[44px] items-center text-sm font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline ${focusRingOnDark} rounded-sm ${transitionFast}`;

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
      <div className={heroGrain} aria-hidden />
      <div
        className="pointer-events-none absolute -right-[18%] top-[6%] h-[min(88vw,400px)] w-[min(92vw,480px)] rounded-full border border-white/[0.06] md:-right-[6%]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[8%] top-[22%] h-[min(62vw,280px)] w-[min(70vw,360px)] rounded-full border border-amber-200/10 md:right-[14%]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-32 pt-10 md:pb-36 md:pt-14 lg:pb-40 lg:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(240px,340px)] lg:gap-10 xl:gap-14">
          <div className="relative z-10 min-w-0">
            <p
              className="home-hero-reveal font-[family-name:var(--font-playfair)] text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-[2.75rem]"
              style={{ animationDelay: "40ms" }}
            >
              {homeHeroBrand}
            </p>
            <p
              className="home-hero-reveal mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-amber-200/90 md:text-xs"
              style={{ animationDelay: "120ms" }}
            >
              {homeHeroEyebrow}
            </p>

            <h1
              className="home-hero-reveal mt-4 max-w-xl text-balance text-2xl font-bold leading-[1.15] tracking-tight text-white md:text-3xl md:leading-[1.12] lg:text-[2.15rem] lg:leading-[1.1]"
              style={{ animationDelay: "180ms" }}
            >
              {homeHeroTitle}
            </h1>
            <p
              className="home-hero-reveal mt-3 max-w-lg text-sm font-medium text-amber-100/95 md:text-base"
              style={{ animationDelay: "240ms" }}
            >
              <span className="border-b border-amber-400/55 pb-0.5">{homeHeroCorridors}</span>
            </p>
            <p
              className="home-hero-reveal mt-4 max-w-lg text-base leading-relaxed text-slate-300 md:text-[1.05rem]"
              style={{ animationDelay: "300ms" }}
            >
              {homeHeroSubcopy}
            </p>

            {dynamicAreaInsight ? (
              <p
                className="home-hero-reveal mt-4 max-w-lg border-l-2 border-amber-400/55 pl-3 text-sm font-medium leading-relaxed text-amber-50/95"
                style={{ animationDelay: "360ms" }}
              >
                {dynamicAreaInsight}
              </p>
            ) : null}

            <div
              className="home-hero-reveal mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
              style={{ animationDelay: "420ms" }}
            >
              <Link href="/jobs-in-chennai" className={primaryCta} data-cta="hero-browse-all-jobs">
                {homeHeroCtaBrowseJobs}
              </Link>
              <Link
                href="/candidate/login?new=1"
                className={secondaryCta}
                data-cta="hero-create-account"
              >
                {homeHeroCtaCreateAccount}
              </Link>
              <Link href="/#home-hiw-heading" className={learnMoreLink} data-cta="hero-learn-more">
                {homeHeroCtaLearnMore}
              </Link>
            </div>

            <p
              className="home-hero-reveal mt-4 max-w-lg text-sm text-slate-400"
              style={{ animationDelay: "480ms" }}
            >
              {homeHeroFootnote}{" "}
              <Link
                href="/job-seeker-profile"
                className={`${linkInline} font-medium text-amber-200/90 hover:text-white`}
                data-cta="hero-job-seeker-profile"
              >
                Job seeker profile
              </Link>
            </p>
          </div>

          <div
            className="home-hero-reveal relative mx-auto hidden w-full max-w-[300px] justify-self-end sm:block lg:max-w-none"
            style={{ animationDelay: "280ms" }}
            aria-hidden
          >
            <ChennaiHeroIllustration className="h-auto w-full max-h-[min(380px,48vh)] opacity-80 drop-shadow-2xl" />
          </div>
        </div>

        <div
          className="home-hero-reveal absolute bottom-6 left-4 right-4 z-30 md:bottom-8 md:left-6 md:right-6 lg:bottom-10 lg:left-8 lg:right-[8%] xl:right-[12%]"
          style={{ animationDelay: "520ms" }}
        >
          <HomeHeroFloatingSearch categories={categories} locations={locations} />
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-slate-900/85 backdrop-blur-sm">
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
