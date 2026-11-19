"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  HeroSceneBoard,
  HeroSceneOffer,
  HeroSceneOrbit,
  HeroSceneWindow,
  type HeroSceneProps,
} from "@/components/home/home-hero-scenes";
import { focusRing } from "@/lib/ui";

const ROTATE_MS = 9000;

const scenes = [
  { id: "window", label: "Local jobs" },
  { id: "board", label: "Search" },
  { id: "orbit", label: "Apply free" },
  { id: "offer", label: "What we offer" },
] as const;

type Props = Omit<HeroSceneProps, "active">;

export default function HomeHeroRotator(props: Props) {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback((next: number) => {
    setIndex(((next % scenes.length) + scenes.length) % scenes.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion.current) return undefined;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % scenes.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setPaused(false);
      }}
    >
      <h2 id={labelId} className="sr-only">
        Vacancy Chennai hero, four slides
      </h2>
      <div className="grid">
        {scenes.map((scene, i) => {
          const active = i === index;
          const sceneProps = { ...props, active };
          return (
            <div
              key={scene.id}
              className="col-start-1 row-start-1 h-full"
              style={{ visibility: active ? "visible" : "hidden" }}
              aria-hidden={active ? undefined : true}
              {...(active ? {} : { inert: true })}
            >
              {scene.id === "window" ? <HeroSceneWindow {...sceneProps} /> : null}
              {scene.id === "board" ? <HeroSceneBoard {...sceneProps} /> : null}
              {scene.id === "orbit" ? <HeroSceneOrbit {...sceneProps} /> : null}
              {scene.id === "offer" ? <HeroSceneOffer {...sceneProps} /> : null}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-3">
        <button
          type="button"
          className={`grid h-8 w-8 place-items-center rounded-full bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 ${focusRing}`}
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
        >
          <span aria-hidden>‹</span>
        </button>
        {scenes.map((scene, i) => {
          const active = i === index;
          return (
            <button
              key={scene.id}
              type="button"
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${focusRing} ${
                active ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
              aria-current={active ? "true" : undefined}
              aria-label={`Show ${scene.label}`}
              onClick={() => go(i)}
            >
              {scene.label}
            </button>
          );
        })}
        <button
          type="button"
          className={`grid h-8 w-8 place-items-center rounded-full bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 ${focusRing}`}
          aria-label="Next slide"
          onClick={() => go(index + 1)}
        >
          <span aria-hidden>›</span>
        </button>
        <p className="sr-only" aria-live="polite">
          {scenes[index]?.label}, layout {index + 1} of {scenes.length}
        </p>
      </div>
    </section>
  );
}
