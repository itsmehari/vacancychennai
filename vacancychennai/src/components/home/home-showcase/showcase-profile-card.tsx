export default function ShowcaseProfileCard() {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/90 bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)]">
      <div
        className="relative h-24 bg-gradient-to-br from-violet-200 via-fuchsia-100 to-amber-100 md:h-28"
        aria-hidden
      />
      <div className="relative px-5 pb-5 pt-0 md:px-6 md:pb-6">
        <div className="-mt-10 flex justify-center md:-mt-11">
          <div
            className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-teal-600 to-emerald-700 text-xl font-bold text-white shadow-md ring-1 ring-slate-200/80 md:size-[5.5rem]"
            aria-hidden
          >
            KV
          </div>
        </div>
        <div className="mt-3 text-center">
          <h3 className="text-base font-semibold text-slate-900">Karthik Venkat</h3>
          <p className="text-sm text-slate-600">Senior product designer · OMR corridor</p>
        </div>
        <div className="mt-3 flex justify-center gap-3" aria-label="Social links (sample)">
          {[
            { label: "LinkedIn", d: "M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.8 2.67 4.8 6.14V24h-4v-6.7c0-1.6-.03-3.65-2.22-3.65-2.22 0-2.56 1.73-2.56 3.52V24h-4V8z" },
            { label: "Portfolio", d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
            { label: "Photos", d: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" },
          ].map((icon) => (
            <span
              key={icon.label}
              className="inline-flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200/80"
              title={icon.label}
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d={icon.d} />
              </svg>
              <span className="sr-only">{icon.label} (sample)</span>
            </span>
          ))}
        </div>
        <p className="mt-4 text-center text-xs leading-relaxed text-slate-600">
          Build a profile candidates trust—skills, headline, and work samples in one place.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-[9/16] rounded-xl bg-gradient-to-b from-slate-200 to-slate-100 ring-1 ring-slate-200/80"
              aria-hidden
            />
          ))}
        </div>
      </div>
    </article>
  );
}
