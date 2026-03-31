export default function ShowcaseInsightsCard() {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)] md:p-6">
      <p className="text-xs font-medium text-slate-600 md:text-sm">
        3 connections with careers similar to yours
      </p>
      <div
        className="relative mx-auto my-4 aspect-square w-full max-w-[220px]"
        role="img"
        aria-label="Illustration: local employers hiring near you, with sample connection and role counts"
      >
        <svg className="size-full text-slate-300" viewBox="0 0 200 200" aria-hidden>
          <circle
            cx="100"
            cy="100"
            r="78"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
        </svg>
        <div className="absolute left-1/2 top-[8%] -translate-x-1/2 rounded-full bg-slate-100 px-3 py-1.5 text-center text-xs font-semibold text-slate-800 ring-1 ring-slate-200">
          28 connections
        </div>
        <div className="absolute left-[6%] top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800 ring-2 ring-blue-200/80">
          IT
        </div>
        <div
          className="absolute right-[6%] top-1/2 size-12 -translate-y-1/2 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-rose-200 to-amber-100 shadow-md ring-1 ring-slate-200"
          aria-hidden
        />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 rounded-full bg-slate-100 px-3 py-1.5 text-center text-xs font-semibold text-slate-800 ring-1 ring-slate-200">
          4 positions
        </div>
        <p className="absolute left-1/2 top-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 text-center text-sm font-semibold leading-snug text-slate-900">
          Local employers are actively hiring.
        </p>
      </div>
      <p className="text-center text-xs text-slate-600">
        Example: roles open on-site and hybrid across OMR, Tambaram, and Velachery.
      </p>
    </div>
  );
}
