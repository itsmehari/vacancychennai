/**
 * Vacancy Chennai UI primitives — class bundles aligned with design tokens in globals.css.
 * Use these to keep elevation, focus, and motion consistent (Gingersnap-style single system).
 */

/** Visible focus for keyboard users; ring uses vc-accent token via blue-600 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

export const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

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

/** Card surface — single elevation system: border + soft shadow */
export const cardSurface =
  `rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)] ${transitionFast}`;

/** Card interactive hover */
export const cardInteractive =
  `hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-[var(--shadow-card)]`;

/** Chip / pill */
export const chipBase =
  `inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-blue-300 hover:bg-blue-50 ${focusRing} ${transitionFast}`;
