"use client";

import { useId, useMemo, useState } from "react";
import { btnSecondary, focusRing } from "@/lib/ui";

type CheckItem = { id: string; label: string };

const checklistItems: CheckItem[] = [
  { id: "area", label: "Named a micro-area (e.g. Sholinganallur, Perungudi), not only “Chennai”." },
  { id: "salary", label: "Published a realistic in-hand or CTC band (min–max)." },
  { id: "shift", label: "Stated shift, hybrid/on-site expectations, and week-off pattern." },
  { id: "stack", label: "Listed tools, stack, or process (L1/L2, SDET, .NET, etc.)." },
  { id: "contact", label: "Single clear apply path and response timeline." },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function OmrHiringPlaybookWidgets() {
  const baseId = useId();
  const [locationScore, setLocationScore] = useState(60);
  const [salaryScore, setSalaryScore] = useState(50);
  const [clarityScore, setClarityScore] = useState(55);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const listingStrength = useMemo(() => {
    const raw = (locationScore + salaryScore + clarityScore) / 3;
    return Math.round(clamp(raw, 0, 100));
  }, [locationScore, salaryScore, clarityScore]);

  const checkedCount = checklistItems.filter((c) => checked[c.id]).length;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-6" aria-label="Interactive hiring tools">
      <div
        className="rounded-[var(--radius-md)] border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white p-5 shadow-sm"
        role="region"
        aria-labelledby={`${baseId}-strength-heading`}
      >
        <h3 id={`${baseId}-strength-heading`} className="text-base font-semibold text-slate-900">
          Listing strength estimator
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Slide to reflect how you usually post roles on OMR. This is a coaching aid, not a prediction — it helps
          your team see where transparency matters most.
        </p>
        <div className="mt-5 space-y-5">
          <div>
            <label className="flex justify-between text-sm font-medium text-slate-800" htmlFor={`${baseId}-loc`}>
              Location specificity
              <span className="tabular-nums text-slate-600">{locationScore}%</span>
            </label>
            <input
              id={`${baseId}-loc`}
              type="range"
              min={0}
              max={100}
              value={locationScore}
              onChange={(e) => setLocationScore(Number(e.target.value))}
              className={`mt-2 h-2 w-full cursor-pointer accent-blue-600 ${focusRing} rounded-full`}
            />
            <p className="mt-1 text-xs text-slate-500">Higher = campus, micro-area, or landmark named in the title or first line.</p>
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium text-slate-800" htmlFor={`${baseId}-sal`}>
              Salary transparency
              <span className="tabular-nums text-slate-600">{salaryScore}%</span>
            </label>
            <input
              id={`${baseId}-sal`}
              type="range"
              min={0}
              max={100}
              value={salaryScore}
              onChange={(e) => setSalaryScore(Number(e.target.value))}
              className={`mt-2 h-2 w-full cursor-pointer accent-blue-600 ${focusRing} rounded-full`}
            />
            <p className="mt-1 text-xs text-slate-500">Higher = clear band visible before apply, not “competitive” only.</p>
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium text-slate-800" htmlFor={`${baseId}-clr`}>
              Role &amp; shift clarity
              <span className="tabular-nums text-slate-600">{clarityScore}%</span>
            </label>
            <input
              id={`${baseId}-clr`}
              type="range"
              min={0}
              max={100}
              value={clarityScore}
              onChange={(e) => setClarityScore(Number(e.target.value))}
              className={`mt-2 h-2 w-full cursor-pointer accent-blue-600 ${focusRing} rounded-full`}
            />
            <p className="mt-1 text-xs text-slate-500">Higher = level, stack/support scope, and shift stated up front.</p>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white/80 px-4 py-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800">Composite listing strength</span>
            <span className="text-2xl font-bold tabular-nums text-blue-800" aria-live="polite">
              {listingStrength}
              <span className="text-base font-semibold text-slate-600">/100</span>
            </span>
          </div>
          <div
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={listingStrength}
            aria-label="Composite listing strength"
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-[width] duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${listingStrength}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Push any slider — small improvements in all three areas usually beat a perfect salary line with a vague
            location.
          </p>
        </div>
      </div>

      <div
        className="rounded-[var(--radius-md)] border border-slate-200 bg-[var(--color-surface-elevated)] p-5 shadow-sm"
        role="region"
        aria-labelledby={`${baseId}-check-heading`}
      >
        <h3 id={`${baseId}-check-heading`} className="text-base font-semibold text-slate-900">
          Pre-publish checklist
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Tick items as you review the draft with your hiring manager. {checkedCount}/{checklistItems.length} complete.
        </p>
        <ul className="mt-4 space-y-3">
          {checklistItems.map((item) => (
            <li key={item.id}>
              <label className={`flex cursor-pointer gap-3 rounded-md p-2 hover:bg-slate-50 ${focusRing}`}>
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm leading-snug text-slate-800">{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
        {checkedCount === checklistItems.length ? (
          <p className="mt-4 text-sm font-medium text-emerald-800" aria-live="polite">
            Ready to publish — you are aligned with hyperlocal best practice on the corridor.
          </p>
        ) : null}
        <button
          type="button"
          className={`${btnSecondary} mt-4 text-xs`}
          onClick={() => setChecked({})}
        >
          Reset checklist
        </button>
      </div>
    </div>
  );
}
