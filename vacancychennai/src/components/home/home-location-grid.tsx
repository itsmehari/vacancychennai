import Link from "next/link";
import type { Location } from "@/types/domain";
import { cardInteractive, focusRing, transitionFast } from "@/lib/ui";

type Props = {
  locations: Location[];
};

function areaHref(area: string) {
  return `/jobs-in-${area.toLowerCase().replaceAll(" ", "-")}`;
}

function PinIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
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
  );
}

const tileClass = `flex min-h-[44px] items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-left shadow-[var(--shadow-card)] hover:border-blue-300 hover:bg-blue-50/50 ${cardInteractive} motion-reduce:hover:translate-y-0 ${focusRing} ${transitionFast}`;

export default function HomeLocationGrid({ locations }: Props) {
  return (
    <section className="space-y-6" aria-labelledby="home-locations-heading">
      <div>
        <h2
          id="home-locations-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          Browse by area
        </h2>
        <p className="mt-2 text-slate-600">
          Hyperlocal pages for major Chennai zones — OMR, Tambaram, Porur, Ambattur, and
          more.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {locations.map((location) => (
          <Link
            key={location.id}
            href={areaHref(location.area)}
            className={tileClass}
            data-cta={`area-${location.area.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <PinIcon />
            <span className="min-w-0">
              <span className="block font-semibold text-slate-900">{location.area}</span>
              <span className="mt-0.5 block text-xs font-normal text-slate-600">
                {location.zone}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
