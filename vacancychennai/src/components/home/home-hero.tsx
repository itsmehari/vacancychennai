import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import HomeBreakout from "@/components/home/home-breakout";
import HomeHeroFloatingSearch from "@/components/home/home-hero-floating-search";
import type { Location } from "@/types/domain";
import { focusRing, linkInline, transitionFast } from "@/lib/ui";

const accentSerif = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
});

type Props = {
  jobCount: number;
  areaCount: number;
  categories: string[];
  locations: Location[];
};

const heroSurface =
  "relative overflow-hidden bg-[#faf7f2] text-slate-900 [background-image:radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(251,191,36,0.14),transparent),radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(14,165,233,0.08),transparent)]";

const AVATAR_STACK = [
  "https://i.pravatar.cc/200?img=32",
  "https://i.pravatar.cc/200?img=45",
  "https://i.pravatar.cc/200?img=12",
] as const;

function formatStat(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    const s = k >= 10 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, "");
    return `${s}K`;
  }
  return String(n);
}

const browseOutlineCta = `inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-slate-900 bg-transparent px-7 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white ${focusRing} ${transitionFast}`;

const learnMoreLink = `group inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 ${focusRing} rounded-md ${transitionFast}`;

const industryStrip = [
  "BPO & telecalling",
  "Retail & sales",
  "Delivery & logistics",
  "IT & admin support",
  "Hospitality",
] as const;

export default function HomeHero({ jobCount, areaCount, categories, locations }: Props) {
  const jobsDisplay = jobCount > 0 ? formatStat(jobCount) : "—";

  return (
    <HomeBreakout className={heroSurface}>
      <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-12 md:pb-32 md:pt-16 lg:pb-36 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,1fr)] lg:gap-10 xl:gap-14">
          {/* Left: copy + social proof */}
          <div className="relative z-10 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#ea580c] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Free for seekers
              </span>
              <p className="text-sm text-slate-600">
                Hyperlocal listings — OMR, Velachery, Tambaram, Porur, Ambattur &amp; more.
              </p>
            </div>

            <h1 className="mt-5 max-w-xl text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 md:text-4xl md:leading-[1.1] lg:text-[2.5rem] lg:leading-[1.08]">
              Work closer to home in Chennai —{" "}
              <span className={`${accentSerif.className} font-normal text-slate-800`}>Vacancy Chennai</span>{" "}
              lists moderated roles you can actually apply to
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 md:text-[1.05rem]">
              <span className="font-medium text-slate-400" aria-hidden>
                {"//"}
              </span>{" "}
              See area, job type, and salary band up front. Quick apply with name and phone, or sign in to track
              applications — the same flow we describe step-by-step below.
            </p>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-8 lg:mt-12">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3" aria-hidden>
                  {AVATAR_STACK.map((src, i) => (
                    <div
                      key={src}
                      className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#faf7f2] bg-slate-200 shadow-sm ring-1 ring-slate-200/80"
                      style={{ zIndex: AVATAR_STACK.length - i }}
                    >
                      <Image src={src} alt="" width={96} height={96} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums tracking-tight text-slate-900 md:text-3xl">
                    &gt;{jobsDisplay}
                    {jobCount > 0 ? <span className="text-[#ea580c]">+</span> : null}
                  </p>
                  <p className="text-sm text-slate-500">live listings on the board right now</p>
                </div>
              </div>

              <div
                className="flex max-w-[240px] flex-col gap-1.5 rounded-2xl border border-slate-200/90 bg-white/80 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-sm"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Why it feels safer
                </p>
                <p className="text-sm font-semibold leading-snug text-slate-800">
                  Moderated posts — we review listings before they go live.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/jobs-in-chennai" className={browseOutlineCta} data-cta="hero-browse-all-jobs">
                Browse all jobs
              </Link>
              <Link href="/#home-hiw-heading" className={learnMoreLink} data-cta="hero-learn-more">
                How applying works
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:border-slate-400"
                  aria-hidden
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/candidate/login?new=1"
                className={`inline-flex min-h-[44px] items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 ${focusRing} ${transitionFast}`}
                data-cta="hero-create-account"
              >
                Create free account
              </Link>
            </div>
            <p className="mt-3 max-w-lg text-sm text-slate-600">
              Save applications and pick up where you left off — use the same email you quick-apply with.{" "}
              <Link href="/candidate/login?new=1" className={linkInline} data-cta="hero-account-inline">
                Candidate sign-in
              </Link>
            </p>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Popular categories on the board
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
              {industryStrip.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          {/* Right: illustrative workspace (CSS + small card, mockup-inspired) */}
          <div className="relative z-[1] mx-auto w-full max-w-[400px] lg:mx-0 lg:max-w-none">
            <div
              className="relative aspect-[4/3] w-full overflow-visible rounded-[2rem] bg-gradient-to-br from-amber-100/80 via-orange-50/50 to-teal-100/40 p-6 shadow-inner ring-1 ring-slate-200/60 md:aspect-[5/4] md:rounded-[2.25rem] md:p-8"
              aria-hidden
            >
              {/* Floating insight card */}
              <div className="absolute left-4 top-4 z-20 flex max-w-[200px] items-start gap-3 rounded-2xl border border-white/90 bg-white p-3 shadow-lg shadow-slate-900/10 md:left-6 md:top-6">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
                  <Image
                    src="https://i.pravatar.cc/120?img=68"
                    alt=""
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <span className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </span>
                  <p className="text-xs font-semibold leading-snug text-slate-800">
                    Filter by area, category &amp; job type
                  </p>
                </div>
              </div>

              {/* Laptop silhouette */}
              <div className="absolute bottom-[12%] left-1/2 w-[88%] max-w-[340px] -translate-x-1/2 md:bottom-[10%]">
                <div className="relative mx-auto rounded-t-2xl bg-gradient-to-b from-teal-400/90 to-teal-600/95 p-[10px] shadow-xl shadow-teal-900/20 ring-2 ring-teal-700/30 md:rounded-t-3xl md:p-3">
                  <div className="overflow-hidden rounded-lg bg-gradient-to-br from-amber-200 via-orange-300 to-rose-200 md:rounded-xl">
                    <div className="aspect-[16/10] w-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22100%22%20height=%2260%22%3E%3Cdefs%3E%3ClinearGradient%20id=%22g%22%20x1=%220%25%22%20y1=%220%25%22%20x2=%22100%25%22%20y2=%22100%25%22%3E%3Cstop%20offset=%220%25%22%20stop-color=%22%23fcd34d%22/%3E%3Cstop%20offset=%22100%25%22%20stop-color=%22%23fb923c%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%22100%22%20height=%2260%22%20fill=%22url(%23g)%22/%3E%3C/svg%3E')] opacity-90" />
                  </div>
                </div>
                <div className="mx-auto -mt-1 h-3 w-[108%] max-w-[380px] -translate-x-[3.7%] rounded-b-xl bg-gradient-to-b from-slate-700 to-slate-900 shadow-lg" />
              </div>

              {/* Desk accents */}
              <div className="absolute bottom-[6%] right-[10%] h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-md ring-2 ring-white/50 md:right-[12%]" />
              <div className="absolute bottom-[5%] right-[6%] h-3 w-14 rounded-full bg-white/60 shadow-sm ring-1 ring-orange-200/80 md:right-[8%]" />
            </div>
          </div>
        </div>

        {/* Overlapping search bar — mockup-style bridge between columns */}
        <div className="absolute bottom-6 left-4 right-4 z-30 md:bottom-8 md:left-6 md:right-6 lg:bottom-10 lg:left-8 lg:right-[8%] xl:right-[12%]">
          <HomeHeroFloatingSearch categories={categories} locations={locations} />
        </div>
      </div>

      {/* Light stats strip — continuity with rest of home */}
      <div className="relative z-10 border-t border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl divide-y divide-slate-200/80 px-4 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:py-10">
          <div className="px-2 py-5 text-center sm:py-4 sm:pr-6">
            <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900 md:text-4xl">
              {jobsDisplay}
              {jobCount > 0 ? <span className="text-[#ea580c]">+</span> : null}
            </p>
            <p className="mt-1 text-sm text-slate-500">Roles live on the site now</p>
          </div>
          <div className="px-2 py-5 text-center sm:py-4 sm:px-6">
            <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900 md:text-4xl">
              {areaCount > 0 ? String(areaCount) : "—"}
              {areaCount > 0 ? <span className="text-[#ea580c]">+</span> : null}
            </p>
            <p className="mt-1 text-sm text-slate-500">Neighbourhoods &amp; zones on the map</p>
          </div>
          <div className="px-2 py-5 text-center sm:py-4 sm:pl-6">
            <p className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Free<span className="text-[#ea580c]">.</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">₹0 to browse and quick-apply</p>
          </div>
        </div>
      </div>
    </HomeBreakout>
  );
}
