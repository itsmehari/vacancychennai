import Link from "next/link";
import HomeBreakout from "@/components/home/home-breakout";
import HomeHeroSearch from "@/components/home/home-hero-search";
import { focusRingOnDark, transitionFast } from "@/lib/ui";

/** Layered mesh + gradient — CSS-only, no LCP image. */
const heroBgClass =
  "text-white [background:radial-gradient(ellipse_80%_55%_at_50%_-25%,rgba(37,99,235,0.38),transparent),radial-gradient(ellipse_55%_45%_at_100%_100%,rgba(30,64,175,0.45),transparent),linear-gradient(to_bottom_right,#0f172a,#172554,#0c1929)]";

const heroPrimaryCta = `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-white px-5 py-2 text-center text-sm font-semibold text-slate-900 shadow-md hover:bg-blue-50 ${focusRingOnDark} ${transitionFast}`;

const heroSecondaryCta = `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-white/40 bg-white/5 px-5 py-2 text-center text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 ${focusRingOnDark} ${transitionFast}`;

const heroLink = `min-h-[44px] inline-flex items-center text-center text-sm font-medium text-blue-200 underline-offset-4 hover:text-white hover:underline sm:ml-1 ${focusRingOnDark} rounded-md ${transitionFast}`;

export default function HomeHero() {
  return (
    <HomeBreakout className={heroBgClass}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200/95 md:text-sm">
          Chennai · Hyperlocal hiring
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl md:leading-[1.1]">
          Jobs near your home in Chennai — fast apply, local employers
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-blue-100/95">
          Browse by area, category, or role type. Quick apply with name and phone; listings
          are moderated for safer local hiring.
        </p>
        <HomeHeroSearch />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/jobs-in-chennai"
            className={heroPrimaryCta}
            data-cta="hero-browse-all-jobs"
          >
            Browse all Chennai jobs
          </Link>
          <Link href="/employer/login" className={heroSecondaryCta} data-cta="hero-post-job">
            Post a job (employer)
          </Link>
          <Link href="/jobs-in-chennai" className={heroLink} data-cta="hero-advanced-filters">
            Advanced filters (salary, job type)
          </Link>
        </div>
      </div>
    </HomeBreakout>
  );
}
