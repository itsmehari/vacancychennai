import type { Location } from "@/types/domain";

type Props = {
  location: Location;
};

export default function ShowcaseLocationCard({ location }: Props) {
  const address = `${location.area}, Chennai ${location.pincode}`;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/90 bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)]">
      <div
        className="relative h-40 bg-slate-200 md:h-44"
        role="img"
        aria-label={`Stylized map area for ${location.area}, Chennai. Commute times below are examples only.`}
      >
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgb(148 163 184 / 0.35) 0%, rgb(241 245 249) 100%),
              linear-gradient(90deg, rgb(226 232 240) 1px, transparent 1px),
              linear-gradient(rgb(226 232 240) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 24px 24px, 24px 24px",
          }}
        />
        <div className="absolute right-3 top-3 flex gap-1.5">
          <span className="rounded-lg bg-white/95 p-2 text-slate-600 shadow-sm ring-1 ring-slate-200/80" aria-hidden>
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </span>
        </div>
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-lg ring-2 ring-white">
            {location.area}
          </span>
          <span className="mt-1 size-3 rounded-full bg-blue-600 ring-4 ring-white shadow-md" aria-hidden />
        </div>
      </div>
      <div className="p-5 md:p-6">
        <p className="text-sm font-semibold text-slate-900">{address}</p>
        <p className="mt-1 text-xs text-slate-500">Illustrative commute examples from a central Chennai point.</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-700 sm:grid-cols-4">
          <li className="flex items-center gap-2">
            <span className="text-slate-500" aria-hidden>
              🚗
            </span>
            <span>~18 min by car</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-500" aria-hidden>
              🚌
            </span>
            <span>~55 min transit</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-500" aria-hidden>
              🚲
            </span>
            <span>~1 hr by bike</span>
          </li>
          <li className="flex items-center gap-2 font-medium tabular-nums text-slate-900">
            <span className="text-slate-500" aria-hidden>
              ↗
            </span>
            <span>~16 km</span>
          </li>
        </ul>
      </div>
    </article>
  );
}
