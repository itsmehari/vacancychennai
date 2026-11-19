import Link from "next/link";
import HomeHeroFloatingSearch from "@/components/home/home-hero-floating-search";
import {
  homeHeroCorridors,
  homeHeroCtaBrowseJobs,
  homeHeroCtaCreateAccount,
  homeHeroSlides,
} from "@/lib/home-marketing-copy";
import { focusRing, transitionFast } from "@/lib/ui";
import type { Location } from "@/types/domain";

export type HeroSceneProps = {
  active: boolean;
  jobCount: number;
  areaCount: number;
  categories: string[];
  locations: Location[];
  dynamicAreaInsight: string | null;
};

const pill =
  "hero-float pointer-events-none absolute z-20 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-md";

const chip =
  "hero-float absolute z-20 flex items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-[0_12px_28px_-12px_rgb(15_23_42/0.45)]";

function formatStat(n: number): string {
  if (n <= 0) return "—";
  if (n >= 1000) {
    const k = n / 1000;
    const s = k >= 10 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, "");
    return `${s}K`;
  }
  return String(n);
}

const ctaDark = `inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--color-cta-amber)] px-5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-[var(--color-cta-amber-hover)] ${focusRing} ${transitionFast}`;
const ctaGhost = `inline-flex min-h-[44px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 hover:border-slate-300 ${focusRing} ${transitionFast}`;

export function HeroSceneWindow({
  active,
  dynamicAreaInsight,
}: HeroSceneProps) {
  const Title = active ? "h1" : "p";
  return (
    <div className="bg-[radial-gradient(ellipse_at_90%_0%,rgba(251,191,36,0.18),transparent_42%),linear-gradient(165deg,#0b1220_0%,#152033_55%,#0f172a_100%)] px-3 py-5 sm:px-5 sm:py-7">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-24px_rgb(30_10_60/0.45)]">
        <div className="flex gap-1.5 px-5 pt-4" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="grid items-center gap-2 px-5 pb-8 pt-4 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:px-10 lg:pb-10">
          <div className="relative z-10 max-w-xl">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-slate-800">
              VACANCY CHENNAI
            </p>
            <Title className="mt-5 max-w-md text-balance text-4xl font-extrabold leading-[0.98] tracking-[-0.03em] text-slate-900 sm:text-5xl">
              {homeHeroSlides.local.title}
            </Title>
            <p className="mt-3 text-sm font-semibold text-slate-700">{homeHeroCorridors}</p>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-500">{homeHeroSlides.local.body}</p>
            {dynamicAreaInsight ? (
              <p className="mt-3 max-w-sm border-l-2 border-amber-400 pl-3 text-sm font-medium text-slate-700">
                {dynamicAreaInsight}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/jobs-in-chennai" className={ctaDark} data-cta="hero-browse-all-jobs">
                {homeHeroCtaBrowseJobs}
              </Link>
              <Link href="/candidate/login?new=1" className={ctaGhost} data-cta="hero-create-account">
                {homeHeroCtaCreateAccount}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[300px] w-full max-w-lg sm:h-[380px]">
            <span className="absolute -left-2 top-8 h-24 w-24 rounded-full bg-amber-200/80" aria-hidden />
            <span className="absolute bottom-6 right-0 h-28 w-28 rounded-full bg-sky-100" aria-hidden />
            <img
              src="/images/home/candidates-group.jpg"
              alt="Indian colleagues looking at a tablet together"
              className="absolute inset-x-6 bottom-4 top-8 z-10 rounded-3xl object-cover shadow-[0_18px_40px_-24px_rgb(15_23_42/0.45)]"
            />
            <div className={`${chip} left-[0%] top-[34%] max-w-[180px]`} style={{ animationDelay: "-1.2s" }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-700">VC</span>
              <span className="min-w-0 pr-1">
                <span className="block h-1.5 w-14 rounded-full bg-slate-200" />
                <span className="mt-1 block h-1.5 w-9 rounded-full bg-slate-100" />
              </span>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>
            </div>
            <span className={`${pill} left-[8%] top-[46%] bg-slate-900 text-white`} style={{ animationDelay: "-2.4s" }}>
              Velachery
            </span>
            <div className={`${chip} right-[0%] top-[54%]`} style={{ animationDelay: "-3s" }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-100 text-[11px] font-bold text-sky-800">OM</span>
              <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full w-2/3 rounded-full bg-blue-500" />
              </span>
            </div>
            <span className={`${pill} bottom-[8%] right-[6%] bg-amber-400 text-slate-950`} style={{ animationDelay: "-0.6s" }}>
              Tambaram
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const categoryIcons = [
  "M4 10v4h4M6 14a6 6 0 1 0 1.2-3.6",
  "M5 19V5h9l5 5v9H5Zm9-14v5h5",
  "M12 19l7-7-4-4-7 7V19h4Z",
  "M8 8a4 4 0 1 1 8 0v2h2v8H6v-8h2V8Z",
  "M8 8h8v10H8V8Zm2 10v2m4-2v2M9 8V6h6v2",
];

export function HeroSceneBoard({
  active,
  jobCount,
  categories,
  locations,
}: HeroSceneProps) {
  const Title = active ? "h1" : "p";
  const band = categories.slice(0, 5);
  return (
    <div className="bg-slate-50">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-12">
        <div className="relative z-10">
          <Title className="max-w-md text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] text-slate-900 sm:text-5xl lg:text-6xl">
            {homeHeroSlides.search.title}
          </Title>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-500">{homeHeroSlides.search.body}</p>
          <div className="mt-6 max-w-xl">
            <HomeHeroFloatingSearch
              categories={categories}
              locations={locations}
              variant="inline"
              idPrefix="hero-board"
              submitLabel="Search"
            />
          </div>
          <p className="mt-8 text-2xl font-extrabold tracking-tight text-slate-900">
            Popular category
            <span className="ml-1 text-sky-400" aria-hidden>
              ✦
            </span>
          </p>
        </div>

        <div className="relative mx-auto h-[340px] w-full max-w-xl sm:h-[420px]">
          <span className="absolute left-[6%] top-[12%] h-24 w-24 rounded-full bg-amber-200" aria-hidden />
          <span className="absolute bottom-[10%] right-[4%] h-28 w-28 rounded-full bg-sky-100" aria-hidden />
          <img
            src="/images/home/job-search-desk.jpg"
            alt="An Indian professional working on a laptop"
            className="absolute inset-x-8 top-4 bottom-16 z-10 rounded-3xl object-cover shadow-[0_18px_40px_-24px_rgb(15_23_42/0.4)]"
          />
          <Link
            href="/jobs-in-chennai"
            className={`hero-float absolute left-[0%] top-[10%] z-20 w-[200px] rounded-2xl bg-white p-3 shadow-[0_16px_40px_-18px_rgb(15_23_42/0.4)] ${focusRing}`}
            style={{ animationDelay: "-1.5s" }}
            data-cta="hero-float-job-card"
          >
            <span className="flex items-start gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M8 7V6a4 4 0 0 1 8 0v1M6 7h12v11H6V7Z" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-900">Open roles</span>
                <span className="block text-xs text-slate-400">Across Chennai</span>
              </span>
              <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-slate-950">Apply</span>
            </span>
          </Link>
          <div className="hero-float absolute bottom-[18%] right-[0%] z-20 w-[148px] rounded-2xl bg-white p-3 shadow-[0_16px_40px_-18px_rgb(15_23_42/0.35)]" style={{ animationDelay: "-2.8s" }}>
            <p className="text-xl font-extrabold tracking-tight text-slate-900">
              {formatStat(jobCount)}
              {jobCount > 0 ? "+" : ""}
            </p>
            <div className="mt-2 flex h-10 items-end gap-1" aria-hidden>
              {[40, 70, 52, 90, 48].map((h, i) => (
                <span
                  key={h}
                  className="w-2.5 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: i % 2 === 0 ? "#fbbf24" : "#1e3a5f",
                  }}
                />
              ))}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Open roles on the board</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-[#0b1020] text-white sm:flex-row">
        {band.map((label, i) => (
          <Link
            key={label}
            href={`/jobs-in-chennai?category=${encodeURIComponent(label)}`}
            className={`flex flex-1 flex-col items-center gap-2 px-3 py-6 text-center hover:bg-white/5 ${focusRing}`}
            data-cta={`hero-category-${i}`}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d={categoryIcons[i] ?? categoryIcons[0]} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs text-slate-400">Chennai listings</span>
          </Link>
        ))}
        <Link
          href="/jobs-in-chennai"
          className="flex flex-col items-center justify-center gap-3 bg-amber-400 px-4 py-6 text-center font-bold tracking-[0.14em] text-slate-950 hover:bg-amber-300 sm:w-44 sm:shrink-0"
          data-cta="hero-explore-all"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-amber-300" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          EXPLORE ALL
        </Link>
      </div>
    </div>
  );
}

export function HeroSceneOrbit({
  active,
  jobCount,
  areaCount,
  categories,
  locations,
}: HeroSceneProps) {
  const Title = active ? "h1" : "p";
  const jobsDisplay = formatStat(jobCount);
  const areasDisplay = areaCount > 0 ? String(areaCount) : "—";
  return (
    <div className="bg-slate-100 px-3 py-5 sm:px-5 sm:py-7">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_-24px_rgb(15_23_42/0.35)]">
        <div className="m-3 rounded-3xl bg-[#f7f7f8] px-4 py-8 sm:m-4 sm:px-8 lg:px-10">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <Title className="max-w-md text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-5xl">
                {homeHeroSlides.apply.title}
              </Title>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-500">{homeHeroSlides.apply.body}</p>
              <div className="mt-6 max-w-xl">
                <HomeHeroFloatingSearch
                  categories={categories}
                  locations={locations}
                  variant="inline"
                  idPrefix="hero-orbit"
                  submitLabel="Explore"
                />
              </div>
              <svg className="mt-8 h-16 w-56 text-slate-300" viewBox="0 0 240 70" fill="none" aria-hidden>
                <path
                  d="M4 46c22 8 28-18 48-16 18 2 20 22 40 18 16-4 22-24 42-20 22 4 28 16 54 4"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeDasharray="4 7"
                  strokeLinecap="round"
                />
                <path d="M188 28l14 6-12 10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="relative mx-auto h-[340px] w-full max-w-lg sm:h-[380px]">
              <span className="absolute left-1/2 top-[14%] h-48 w-48 -translate-x-1/2 rounded-full bg-amber-100" aria-hidden />
              <img
                src="/images/home/hiring-team.jpg"
                alt="Two Indian colleagues reviewing work on a laptop"
                className="absolute left-1/2 top-8 z-10 h-[70%] w-[78%] -translate-x-1/2 rounded-full object-cover shadow-[0_18px_40px_-24px_rgb(15_23_42/0.45)] ring-8 ring-white"
              />
              <div className={`${chip} left-[4%] top-[8%]`} style={{ animationDelay: "-1s" }}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">A</span>
                <span className="pr-2 text-xs font-semibold text-slate-800">Applied</span>
                <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[9px] text-white">✓</span>
              </div>
              <div className={`${chip} right-[0%] top-[22%] max-w-[210px]`} style={{ animationDelay: "-2.2s" }}>
                <span className="pr-1 text-xs font-semibold text-slate-800">Role on your corridor</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-xs font-bold text-sky-800">C</span>
              </div>
              <div className="hero-float absolute right-[2%] top-[46%] z-20 max-w-[200px] rounded-xl bg-white px-3 py-2 shadow-[0_12px_28px_-12px_rgb(15_23_42/0.4)]" style={{ animationDelay: "-3.1s" }}>
                <p className="text-xs font-semibold leading-snug text-slate-900">Checked before it is published</p>
              </div>
              <div className={`${chip} bottom-[16%] right-[6%]`} style={{ animationDelay: "-0.4s" }}>
                <span className="text-xs font-semibold text-slate-800">Shortlisted</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">S</span>
              </div>
              <div className="hero-float absolute bottom-[12%] left-[0%] z-20 w-[180px] rounded-2xl bg-white p-3 shadow-[0_16px_36px_-16px_rgb(15_23_42/0.4)]" style={{ animationDelay: "-1.8s" }}>
                <p className="text-sm font-bold text-slate-900">New Chennai role</p>
                <p className="text-xs text-slate-400">{homeHeroCorridors.split("·")[0]?.trim()}</p>
                <p className="mt-1 text-xs font-semibold text-amber-700">You can apply</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-3 sm:px-10">
          <Stat tile="bg-amber-300" value={`${jobsDisplay}${jobCount > 0 ? "+" : ""}`} label="Open roles" icon="briefcase" />
          <Stat tile="bg-sky-100" value={`${areasDisplay}${areaCount > 0 ? "+" : ""}`} label="Micro-areas" icon="user" />
          <Stat tile="bg-slate-900" value="Free" label="For candidates" icon="building" lightIcon />
        </div>
      </div>
    </div>
  );
}

export function HeroSceneOffer({ active }: HeroSceneProps) {
  const Title = active ? "h1" : "p";
  return (
    <div className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-14">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700">Vacancy Chennai</p>
          <Title className="mt-3 max-w-lg text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-slate-900 sm:text-5xl">
            {homeHeroSlides.offer.title}
          </Title>
          <ul className="mt-6 space-y-3">
            {homeHeroSlides.offer.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-base text-slate-800">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-300 text-xs font-bold text-slate-950">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/jobs-in-chennai" className={ctaDark} data-cta="hero-offer-browse">
              {homeHeroCtaBrowseJobs}
            </Link>
            <Link href="/post-job" className={ctaGhost} data-cta="hero-offer-post">
              Post a job
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img
            src="/images/home/freshers.jpg"
            alt="Indian college students studying together"
            className="h-44 w-full rounded-2xl object-cover sm:h-56"
          />
          <img
            src="/images/home/shift-work.jpg"
            alt="A shopkeeper in a sari at a store counter"
            className="mt-6 h-44 w-full rounded-2xl object-cover sm:h-56"
          />
          <img
            src="/images/home/interview.jpg"
            alt="An Indian woman and man working together at a laptop"
            className="h-40 w-full rounded-2xl object-cover sm:col-span-2 sm:h-48"
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  tile,
  value,
  label,
  icon,
  lightIcon = false,
}: {
  tile: string;
  value: string;
  label: string;
  icon: "briefcase" | "user" | "building";
  lightIcon?: boolean;
}) {
  const path =
    icon === "briefcase"
      ? "M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M4 7h16v11H4V7Z"
      : icon === "user"
        ? "M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM6 19c1.2-2.4 3.2-3.4 6-3.4s4.8 1 6 3.4"
        : "M5 19V9l7-4 7 4v10M9 19v-5h6v5";
  return (
    <div className="flex items-center gap-3">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tile}`}>
        <svg viewBox="0 0 24 24" className={`h-5 w-5 ${lightIcon ? "text-white" : "text-slate-900"}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d={path} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </span>
      <span>
        <span className="block text-2xl font-extrabold tracking-tight text-slate-900">{value}</span>
        <span className="block text-sm text-slate-500">{label}</span>
      </span>
    </div>
  );
}
