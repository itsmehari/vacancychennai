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

const selectClass = `min-h-[48px] w-full cursor-pointer appearance-none rounded-[var(--radius-md)] border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 outline-none hover:border-slate-300 hover:bg-white ${focusRing} ${transitionFast}`;

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
      className="rounded-[var(--radius-lg)] border border-slate-200/80 bg-white p-4 shadow-[0_20px_50px_-18px_rgb(15_23_42/0.28)] sm:p-5 md:p-5"
      data-hero-floating-search
    >
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 md:text-left">
        Find jobs in Chennai
      </p>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch lg:flex-nowrap lg:gap-3"
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
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
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
          className={`inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-slate-900 px-7 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 ${focusRing} ${transitionFast} md:px-8`}
          data-cta="hero-float-search-submit"
        >
          See matching jobs
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-cta-amber)] text-slate-950"
            aria-hidden
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </button>
      </form>
    </div>
  );
}
