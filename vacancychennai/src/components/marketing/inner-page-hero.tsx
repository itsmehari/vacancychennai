import type { ReactNode } from "react";
import HomeBreakout from "@/components/home/home-breakout";

const shellWithGradient =
  "relative overflow-hidden text-white [background:radial-gradient(ellipse_55%_42%_at_92%_-5%,rgba(251,191,36,0.11),transparent),radial-gradient(ellipse_42%_32%_at_4%_105%,rgba(37,99,235,0.13),transparent),linear-gradient(165deg,#060d18_0%,#0c1929_50%,#0a1628_100%)]";

const shellPlain = "relative overflow-hidden text-white";

const grid =
  "pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px]";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Rich block between description and actions (e.g. bullet list) */
  children?: ReactNode;
  actions?: ReactNode;
  /** Optional cover photo behind gradients (e.g. marketing about hero). */
  backdropPhotoUrl?: string;
};

/** Full-bleed navy hero aligned with home page — use on marketing + job hub pages. */
export default function InnerPageHero({
  eyebrow,
  title,
  description,
  children,
  actions,
  backdropPhotoUrl,
}: Props) {
  return (
    <HomeBreakout className={backdropPhotoUrl ? shellPlain : shellWithGradient}>
      {backdropPhotoUrl ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backdropPhotoUrl})` }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060d18]/88 via-[#0c1929]/82 to-[#0a1628]/90"
            aria-hidden
          />
        </>
      ) : null}
      <div className={grid} aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-9 md:py-12">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
            {description}
          </p>
        ) : null}
        {children}
        {actions ? <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </HomeBreakout>
  );
}
