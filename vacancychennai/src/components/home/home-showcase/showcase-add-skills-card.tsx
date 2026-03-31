"use client";

import Link from "next/link";
import { useState } from "react";
import { focusRing, transitionFast } from "@/lib/ui";
import { SHOWCASE_HREF } from "./showcase-ctas";

export default function ShowcaseAddSkillsCard() {
  const [skill, setSkill] = useState("UI design");
  const [years, setYears] = useState("3 years");

  return (
    <div className="home-showcase relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-teal-50/90 to-white p-5 shadow-[var(--shadow-card)] motion-reduce:transition-none md:p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c2 8 8 14 16 16-8 2-14 8-16 16-2-8-8-14-16-16 8-2 14-8 16-16z' fill='%23059669' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-emerald-900/80">
          Add skills
        </p>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-emerald-200/90 bg-white text-emerald-700 shadow-sm"
          aria-hidden
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </div>
      <div className="relative mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-900">
        <label className="sr-only" htmlFor="showcase-skill">
          Skill
        </label>
        <input
          id="showcase-skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className={`min-h-[44px] max-w-[9rem] rounded-full border border-emerald-200/90 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 ${focusRing} ${transitionFast}`}
        />
        <span className="text-sm font-medium text-slate-600">with</span>
        <label className="sr-only" htmlFor="showcase-years">
          Experience
        </label>
        <input
          id="showcase-years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className={`min-h-[44px] max-w-[6.5rem] rounded-full border border-emerald-200/90 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm ${focusRing} ${transitionFast}`}
        />
      </div>
      <p className="relative mt-4">
        <Link
          href={SHOWCASE_HREF.candidateLogin}
          className={`text-sm font-semibold text-emerald-800 underline-offset-4 hover:underline ${focusRing} rounded-sm`}
          data-cta="showcase-ask-endorsement"
        >
          Ask for endorsement
        </Link>
      </p>
    </div>
  );
}
