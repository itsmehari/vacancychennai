import { cardSurface } from "@/lib/ui";

type Props = {
  jobCount: number;
  areaCount: number;
};

export default function HomeStatsStrip({ jobCount, areaCount }: Props) {
  return (
    <section
      className={`${cardSurface} px-4 py-6 md:px-6`}
      aria-labelledby="home-stats-heading"
    >
      <h2 id="home-stats-heading" className="sr-only">
        Platform snapshot
      </h2>
      <dl className="grid gap-8 sm:grid-cols-3 sm:gap-6">
        <div>
          <dt className="text-sm font-medium text-slate-500">Live roles</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {jobCount}+
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Chennai areas</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {areaCount}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-500">Apply in seconds</dt>
          <dd className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Name + phone</dd>
        </div>
      </dl>
    </section>
  );
}
