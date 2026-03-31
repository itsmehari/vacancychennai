"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Location } from "@/types/domain";
import { focusRing, transitionFast } from "@/lib/ui";

type Props = {
  categories: string[];
  locations: Location[];
};

function areaSlug(area: string) {
  return area.toLowerCase().replaceAll(" ", "-");
}

const selectClass = `min-h-[48px] w-full cursor-pointer appearance-none rounded-2xl border border-slate-200/80 bg-slate-100/90 px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 outline-none hover:border-slate-300 hover:bg-slate-100 ${focusRing} ${transitionFast}`;

const chevronWrap = "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500";

export default function HomeHeroFloatingSearch({ categories, locations }: Props) {
  const router = useRouter();
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [locationKey, setLocationKey] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (jobType) params.set("jobType", jobType);
    if (locationKey) params.set("location", locationKey);
    const qs = params.toString();
    router.push(`/jobs-in-chennai${qs ? `?${qs}` : ""}`);
  }

  return (
    <div
      className="rounded-[2rem] border border-slate-200/60 bg-white p-4 shadow-[0_24px_60px_-12px_rgb(15_23_42/0.12)] sm:p-5 md:rounded-[2.25rem] md:p-6"
      data-hero-floating-search
    >
      <p className="mb-3 text-center text-xs font-medium text-slate-500 md:text-left">
        Jump to the full catalog — same filters as the jobs page.
      </p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch lg:flex-nowrap lg:gap-4"
      >
        <div className="relative min-w-0 flex-1 md:min-w-[140px]">
          <label htmlFor="hero-find-job-type" className="sr-only">
            Job type
          </label>
          <select
            id="hero-find-job-type"
            value={jobType}
            onChange={(ev) => setJobType(ev.target.value)}
            className={selectClass}
            data-cta="hero-float-job-type"
          >
            <option value="">Job type — any</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>
          <span className={chevronWrap} aria-hidden>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>

        <div className="relative min-w-0 flex-1 md:min-w-[160px]">
          <label htmlFor="hero-industry" className="sr-only">
            Industry or category
          </label>
          <select
            id="hero-industry"
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
            className={selectClass}
            data-cta="hero-float-category"
          >
            <option value="">Category — all</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className={chevronWrap} aria-hidden>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>

        <div className="relative min-w-0 flex-1 md:min-w-[160px]">
          <label htmlFor="hero-location" className="sr-only">
            Location
          </label>
          <select
            id="hero-location"
            value={locationKey}
            onChange={(ev) => setLocationKey(ev.target.value)}
            className={selectClass}
            data-cta="hero-float-location"
          >
            <option value="">Area — all Chennai</option>
            {locations.map((loc) => (
              <option key={loc.id} value={areaSlug(loc.area)}>
                {loc.area}
              </option>
            ))}
          </select>
          <span className={chevronWrap} aria-hidden>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>

        <button
          type="submit"
          className={`inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 ${focusRing} ${transitionFast} md:px-10`}
          data-cta="hero-float-search-submit"
        >
          See matching jobs
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900"
            aria-hidden
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </button>
      </form>
    </div>
  );
}
