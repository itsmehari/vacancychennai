import HomeSectionShell from "@/components/home/home-section-shell";

type Props = {
  jobCount: number;
  areaCount: number;
};

function StatIconBriefcase() {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-blue-100 text-blue-700 ring-1 ring-blue-200/80">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25M20.25 6.75H3.75A2.25 2.25 0 0 0 1.5 9v.243c0 1.283.78 2.43 1.969 2.89l.582.226M20.25 6.75a2.25 2.25 0 0 1 2.25 2.25v.243c0 1.283-.78 2.43-1.969 2.89l-.582.226"
        />
      </svg>
    </span>
  );
}

function StatIconMap() {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
    </span>
  );
}

function StatIconBolt() {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-amber-100 text-amber-900 ring-1 ring-amber-200/80">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 2 3 14h8l-1 8 10-12h-8l1-8z"
        />
      </svg>
    </span>
  );
}

export default function HomeStatsStrip({ jobCount, areaCount }: Props) {
  return (
    <HomeSectionShell variant="muted" fullBleed>
      <section aria-labelledby="home-stats-heading">
        <h2 id="home-stats-heading" className="sr-only">
          Platform snapshot
        </h2>
        <div className="grid gap-0 divide-y divide-slate-200/90 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-start gap-4 px-2 py-4 sm:px-4 sm:py-2">
            <StatIconBriefcase />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live roles</p>
              <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-slate-900 md:text-4xl">
                {jobCount}+
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 px-2 py-4 sm:px-4 sm:py-2">
            <StatIconMap />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Chennai areas</p>
              <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-slate-900 md:text-4xl">
                {areaCount}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 px-2 py-4 sm:px-4 sm:py-2">
            <StatIconBolt />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Apply in seconds</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 md:text-xl">Name + phone</p>
            </div>
          </div>
        </div>
        <p className="mt-6 border-t border-slate-200/80 pt-4 text-center text-sm text-slate-600">
          Listings updated regularly — browse jobs near you across OMR, Tambaram, Porur, and more.
        </p>
      </section>
    </HomeSectionShell>
  );
}
