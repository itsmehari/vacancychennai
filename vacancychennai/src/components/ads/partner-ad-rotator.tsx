"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { PartnerAd, PartnerAdShape } from "@/lib/partner-ads";
import { focusRing, transitionFast } from "@/lib/ui";

const ROTATE_MS = 6500;

const themeClass: Record<PartnerAd["theme"], string> = {
  amber:
    "bg-[linear-gradient(165deg,#fbbf24_0%,#f59e0b_58%,#d97706_100%)] text-slate-950",
  navy: "bg-[linear-gradient(165deg,#060d18_0%,#0c1929_55%,#12263a_100%)] text-white",
  civic:
    "bg-[linear-gradient(165deg,#ecfdf5_0%,#d1fae5_42%,#a7f3d0_100%)] text-slate-950",
};

const ctaClass: Record<PartnerAd["theme"], string> = {
  amber: "bg-slate-950 text-amber-50 hover:bg-slate-800",
  navy: "bg-amber-400 text-slate-950 hover:bg-amber-300",
  civic: "bg-emerald-900 text-emerald-50 hover:bg-emerald-800",
};

type Props = {
  ads: PartnerAd[];
  shape: PartnerAdShape;
  placement: string;
};

export function PartnerAdRotator({ ads, shape, placement }: Props) {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);
  const square = shape === "square";

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback(
    (next: number) => {
      if (ads.length === 0) return;
      setIndex(((next % ads.length) + ads.length) % ads.length);
    },
    [ads.length],
  );

  useEffect(() => {
    if (ads.length < 2 || paused || reduceMotion.current) return undefined;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % ads.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [ads.length, paused]);

  const ad = ads[index];
  if (!ad) return null;

  return (
    <aside
      className="overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] ring-1 ring-slate-900/10"
      aria-labelledby={labelId}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        const next = e.relatedTarget;
        if (!(next instanceof Node) || !e.currentTarget.contains(next)) setPaused(false);
      }}
    >
      <p id={labelId} className="sr-only">
        Partner advertisements
      </p>
      <p className="bg-slate-950 px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        Advertisement
      </p>
      <div className={square ? "relative aspect-square w-full" : "grid w-full"}>
        {ads.map((slide, i) => {
          const active = i === index;
          const layout = square
            ? "absolute inset-0 flex flex-col justify-between p-5 md:p-6"
            : "relative col-start-1 row-start-1 flex min-h-[10.5rem] flex-col justify-between gap-5 overflow-hidden p-5 sm:min-h-[8.75rem] sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-6";
          return (
            <a
              key={slide.id}
              href={slide.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={active ? 0 : -1}
              aria-hidden={!active}
              aria-label={`${slide.headline} — ${slide.cta}`}
              data-partner-link={slide.partner}
              data-utm-content={placement}
              data-cta={`partner-ad-${placement}-${slide.id}`}
              className={`${layout} ${themeClass[slide.theme]} ${focusRing} ${transitionFast} ${
                active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
            >
              {slide.theme === "navy" ? (
                <span
                  className="pointer-events-none absolute inset-0 font-mono text-[10px] leading-4 tracking-[0.35em] text-amber-200/15"
                  aria-hidden
                >
                  01001001 01010011 01001111 00110001 00110000 00110000 00110001
                </span>
              ) : null}
              <div className="relative min-w-0 max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80">
                  {slide.eyebrow} · {slide.kicker}
                </p>
                <p
                  className={
                    square
                      ? "mt-4 text-2xl font-bold leading-tight tracking-tight md:text-[1.65rem]"
                      : "mt-2 text-xl font-bold leading-tight tracking-tight sm:text-2xl"
                  }
                >
                  {slide.headline}
                </p>
                <p
                  className={
                    square
                      ? "mt-0 hidden"
                      : "mt-2 max-w-xl text-sm leading-relaxed opacity-90"
                  }
                >
                  {slide.body}
                </p>
              </div>
              <div className={`relative ${square ? "" : "shrink-0 sm:max-w-xs"}`}>
                {square ? <p className="text-sm leading-relaxed opacity-90">{slide.body}</p> : null}
                <span
                  className={`${square ? "mt-5 w-full" : "mt-1 sm:mt-0"} inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] px-5 text-sm font-semibold ${ctaClass[slide.theme]}`}
                >
                  {slide.cta}
                </span>
              </div>
            </a>
          );
        })}
      </div>
      {ads.length > 1 ? (
        <div className="flex items-center justify-center gap-2 bg-slate-950/90 px-3 py-2.5">
          {ads.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show ${slide.kicker} advert`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2.5 rounded-full ${focusRing} ${transitionFast} ${
                i === index ? "w-6 bg-amber-400" : "w-2.5 bg-white/35 hover:bg-white/70"
              }`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : null}
    </aside>
  );
}
