import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import type { Location } from "@/types/domain";
import { jobsInAreaPath } from "@/lib/area-job-path";
import { homeLocationSection } from "@/lib/home-marketing-copy";
import { cardInteractive, focusRing, transitionFast } from "@/lib/ui";

type Props = {
  locations: Location[];
};

const zoneDotClass = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-cyan-600",
] as const;

function tileClass(featured: boolean) {
  const base = `group flex min-h-[52px] items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-left shadow-[var(--shadow-card)] hover:border-blue-300 hover:bg-blue-50/40 ${cardInteractive} motion-reduce:hover:translate-y-0 ${focusRing} ${transitionFast}`;
  const pad = featured ? "min-h-[4.5rem] px-5 py-4 md:min-h-[5.25rem] md:px-6 md:py-5" : "px-4 py-3.5";
  return `${base} ${pad}`;
}

export default function HomeLocationGrid({ locations }: Props) {
  const uniqueZones = [...new Map(locations.map((l) => [l.zone, l.zone])).keys()];
  const zoneStyles = Object.fromEntries(
    uniqueZones.map((z, i) => [z, zoneDotClass[i % zoneDotClass.length]]),
  ) as Record<string, string>;

  return (
    <HomeSectionShell variant="default" fullBleed>
      <section className="space-y-8" aria-labelledby="home-locations-heading">
        <SectionHeader
          id="home-locations-heading"
          eyebrow={homeLocationSection.eyebrow}
          title={homeLocationSection.title}
          description={homeLocationSection.description}
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200/80 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Zones</p>
          <ul className="flex flex-wrap gap-3 text-xs text-slate-600" aria-label="Area zone legend">
            {uniqueZones.map((zone) => (
              <li key={zone} className="inline-flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${zoneStyles[zone] ?? "bg-slate-400"}`}
                  aria-hidden
                />
                {zone}
              </li>
            ))}
          </ul>
        </div>
        <p className="-mt-2 text-xs font-medium text-slate-500">
          <span className="font-semibold text-slate-600">Tip:</span> each link opens jobs filtered by that area.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {locations.map((location, index) => {
            const featured = index === 0;
            const dot = zoneStyles[location.zone] ?? "bg-slate-400";
            return (
              <Link
                key={location.id}
                href={jobsInAreaPath(location.area)}
                className={`${tileClass(featured)} ${featured ? "md:col-span-2" : ""}`}
                data-cta={`area-${location.area.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white ${dot}`} aria-hidden />
                  <span className="min-w-0">
                    <span
                      className={`block font-semibold text-slate-900 ${featured ? "text-lg md:text-xl" : ""}`}
                    >
                      {location.area}
                    </span>
                    <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/80">
                      {location.zone}
                    </span>
                  </span>
                </span>
                <svg
                  className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            );
          })}
        </div>
      </section>
    </HomeSectionShell>
  );
}
