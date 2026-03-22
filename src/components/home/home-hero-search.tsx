"use client";

import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useState } from "react";
import { focusRingOnDark, transitionFast } from "@/lib/ui";

export default function HomeHeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function navigateToJobs() {
    const trimmed = query.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("category", trimmed);
    const qs = params.toString();
    router.push(`/jobs-in-chennai${qs ? `?${qs}` : ""}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigateToJobs();
  }

  function onSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      navigateToJobs();
    }
  }

  const inputClass = `min-h-[44px] w-full flex-1 rounded-[var(--radius-md)] border border-white/25 bg-white/10 px-4 py-2 text-white placeholder:text-blue-100/75 outline-none ring-offset-2 ring-offset-slate-900 focus-visible:ring-2 focus-visible:ring-amber-300/90 ${transitionFast}`;

  const buttonClass = `min-h-[44px] shrink-0 rounded-[var(--radius-md)] bg-amber-400 px-6 py-2 text-sm font-semibold text-slate-900 shadow-md hover:bg-amber-300 active:bg-amber-500 ${focusRingOnDark} ${transitionFast}`;

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <label htmlFor="home-job-search" className="sr-only">
        Search by role or category
      </label>
      <input
        id="home-job-search"
        name="category"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onSearchKeyDown}
        placeholder="e.g. BPO, delivery, admin"
        className={inputClass}
        autoComplete="off"
        data-cta="hero-search-input"
      />
      <button type="submit" className={buttonClass} data-cta="hero-search-submit">
        Search jobs
      </button>
    </form>
  );
}
