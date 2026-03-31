import Image from "next/image";
import Link from "next/link";
import HomeBreakout from "@/components/home/home-breakout";
import HomeHeroFloatingSearch from "@/components/home/home-hero-floating-search";
import type { Location } from "@/types/domain";
import { focusRingOnDark, linkInline, transitionFast } from "@/lib/ui";

type Props = {
  jobCount: number;
  areaCount: number;
  categories: string[];
  locations: Location[];
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

const PORTRAITS: { src: string; alt: string; variant: "circle" | "pill"; className: string }[] = [
  {
    src: "https://i.pravatar.cc/480?img=32",
    alt: "",
    variant: "circle",
    className: "absolute right-[8%] top-[2%] h-[88px] w-[88px] sm:h-[100px] sm:w-[100px] md:right-[12%] md:h-[112px] md:w-[112px]",
  },
  {
    src: "https://i.pravatar.cc/480?img=45",
    alt: "",
    variant: "pill",
    className:
      "absolute left-[4%] top-[22%] h-[140px] w-[72px] sm:h-[168px] sm:w-[84px] md:left-[8%] md:h-[200px] md:w-[96px]",
  },
  {
    src: "https://i.pravatar.cc/480?img=12",
    alt: "",
    variant: "pill",
    className:
      "absolute right-0 top-[38%] h-[155px] w-[78px] sm:h-[184px] sm:w-[88px] md:right-[4%] md:h-[220px] md:w-[100px]",
  },
  {
    src: "https://i.pravatar.cc/480?img=68",
    alt: "",
    variant: "pill",
    className:
      "absolute bottom-[6%] left-[18%] h-[130px] w-[70px] sm:bottom-[8%] sm:h-[156px] sm:w-[80px] md:left-[22%] md:h-[176px] md:w-[88px]",
  },
];

function formatStat(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    const s = k >= 10 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, "");
    return `${s}K`;
  }
  return String(n);
}

export default function HomeHero({ jobCount, areaCount, categories, locations }: Props) {
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
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,400px)] lg:gap-12 xl:gap-16">
          <div className="relative z-10 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90 md:text-sm">
              Chennai · Hyperlocal hiring
            </p>
            <h1 className="mt-4 max-w-xl text-3xl font-bold leading-[1.12] tracking-tight text-white md:text-4xl md:leading-[1.08] lg:text-[2.75rem] lg:leading-[1.06]">
              The best jobsite for your{" "}
              <span className="relative inline-block align-baseline">
                <span
                  className="relative z-10 inline-block rounded-full bg-[var(--color-cta-amber)] px-3 py-0.5 text-slate-900 shadow-sm md:px-4 md:py-1"
                  style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}
                >
                  future
                </span>
              </span>{" "}
              in the city
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg">
              Browse by area, category, or role. Quick apply with name and phone — listings are moderated for
              safer local hiring across Chennai.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/jobs-in-chennai"
                className={primaryOutlineCta}
                data-cta="hero-browse-all-jobs"
              >
                Browse all jobs
              </Link>
              <Link href="/#home-hiw-heading" className={learnMoreLink} data-cta="hero-learn-more">
                How applying works
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
                Create free account
              </Link>
            </div>
            <p className="mt-3 max-w-lg text-sm text-slate-400">
              Track applications with the same email you use to quick-apply.{" "}
              <Link href="/candidate/login" className={`${linkInline} text-amber-200/90 hover:text-white`}>
                Sign in
              </Link>
            </p>

            <p className="mt-8 text-xs font-medium text-slate-500 md:text-sm">
              Trusted by job seekers across OMR, Tambaram, Porur &amp; more
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-6 opacity-60 md:gap-8">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Retail</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">IT &amp; BPO</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Logistics</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Hospitality</span>
            </div>

            <div className="mt-8 flex justify-center gap-3 sm:hidden" aria-hidden>
              {PORTRAITS.map((p) => (
                <div
                  key={`m-${p.src}`}
                  className={`h-14 w-14 shrink-0 overflow-hidden ring-2 ring-white/15 ${
                    p.variant === "circle" ? "rounded-full" : "rounded-2xl"
                  }`}
                >
                  <Image
                    src={p.src}
                    alt=""
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    sizes="56px"
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative mx-auto hidden h-[min(420px,55vh)] w-full max-w-[340px] sm:mx-0 sm:block lg:max-w-none lg:justify-self-end"
            aria-hidden
          >
            {PORTRAITS.map((p) => (
              <div
                key={p.src}
                className={`${p.className} overflow-hidden shadow-xl shadow-black/40 ring-2 ring-white/10 ${
                  p.variant === "circle" ? "rounded-full" : "rounded-[999px]"
                }`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={480}
                  height={480}
                  className="h-full w-full object-cover object-center"
                  sizes="(max-width: 1024px) 200px, 240px"
                />
              </div>
            ))}
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
            <p className="mt-1 text-sm text-slate-400">Live job listings</p>
          </div>
          <div className="px-2 py-5 text-center sm:py-4 sm:px-6">
            <p className="text-3xl font-bold tabular-nums tracking-tight text-white md:text-4xl">
              {areasDisplay}
              {areaCount > 0 ? <span className="text-[var(--color-cta-amber)]">+</span> : null}
            </p>
            <p className="mt-1 text-sm text-slate-400">Chennai areas covered</p>
          </div>
          <div className="px-2 py-5 text-center sm:py-4 sm:pl-6">
            <p className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Free<span className="text-[var(--color-cta-amber)]">.</span>
            </p>
            <p className="mt-1 text-sm text-slate-400">No fee for job seekers</p>
          </div>
        </div>
      </div>
    </HomeBreakout>
  );
}
