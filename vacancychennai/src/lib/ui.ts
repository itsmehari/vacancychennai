/**
 * Vacancy Chennai UI primitives — class bundles aligned with design tokens in globals.css.
 * Use these to keep elevation, focus, and motion consistent (Gingersnap-style single system).
 */

/** Visible focus for keyboard users; ring uses vc-accent token via blue-600 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

export const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

/** Focus on footer tier 3 — ring offset matches `globals.css` `--footer-accent` */
export const focusRingOnAccent =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-accent)]";

/** Standard transition (respects reduced motion via --duration-fast in globals) */
export const transitionFast = "transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-[var(--duration-fast,150ms)] ease-[var(--ease-standard,cubic-bezier(0.4,0,0.2,1))]";

/** Primary button — light pages (blue) */
export const btnPrimary =
  `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 ${focusRing} ${transitionFast}`;

/** Secondary / outline on light */
export const btnSecondary =
  `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50 ${focusRing} ${transitionFast}`;

/** Ghost / text link styled as button */
export const linkButton =
  `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 hover:underline ${focusRing} ${transitionFast}`;

/** Dark CTA on light sections (blog strip, etc.) */
export const btnNeutral =
  `inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 ${focusRing} ${transitionFast}`;

/** Inline text link */
export const linkInline = `font-semibold text-blue-700 hover:text-blue-900 hover:underline ${focusRing} rounded-sm`;

/** Footer / dense nav links — 44px min touch height */
export const footerLink =
  `inline-flex min-h-[44px] w-full max-w-full items-center rounded-md px-1 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-800 ${focusRing} ${transitionFast}`;

/** Footer tier 1 — dark background */
export const footerLinkDark =
  `inline-flex min-h-[44px] w-full max-w-full items-center rounded-md px-1 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white ${focusRingOnDark} ${transitionFast}`;

/** Card surface — single elevation system: border + soft shadow */
export const cardSurface =
  `rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)] ${transitionFast}`;

/** Card interactive hover */
export const cardInteractive =
  `hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-[var(--shadow-card)]`;

/** Chip / pill */
export const chipBase =
  `inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-blue-300 hover:bg-blue-50 ${focusRing} ${transitionFast}`;

/** Small category / meta pill on job cards */
export const pillMeta =
  `inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200/80`;

/** Inner pages / dashboards — white surface, single shadow tier */
export const sectionCard =
  `rounded-[var(--radius-lg)] border border-slate-200/90 bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)] md:p-6`;

/** Form controls on light surfaces */
export const formInput =
  `min-h-[44px] w-full rounded-[var(--radius-md)] border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 ${focusRing} ${transitionFast}`;

/** Compact primary actions in dense tables (dashboards) */
export const btnDensePrimary =
  `inline-flex min-h-[36px] items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 ${focusRing} ${transitionFast}`;

export const btnDenseNeutral =
  `inline-flex min-h-[36px] items-center justify-center rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 ${focusRing} ${transitionFast}`;

export const btnDenseDanger =
  `inline-flex min-h-[36px] items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 ${focusRing} ${transitionFast}`;

export const btnDenseSuccess =
  `inline-flex min-h-[36px] items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 ${focusRing} ${transitionFast}`;

export const btnDenseWarning =
  `inline-flex min-h-[36px] items-center justify-center rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 ${focusRing} ${transitionFast}`;
