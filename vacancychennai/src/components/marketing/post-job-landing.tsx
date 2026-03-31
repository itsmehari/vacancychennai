"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

function appendPreservedQuery(href: string, search: string): string {
  if (!search) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}${search}`;
}

export default function PostJobLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preserved = searchParams.toString();
  const dialogTitleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [choiceOpen, setChoiceOpen] = useState(true);
  const [experience, setExperience] = useState<"any" | "fresher" | "experienced">(
    "any",
  );

  function closeChoice() {
    setChoiceOpen(false);
  }

  useEffect(() => {
    if (!choiceOpen) {
      firstFieldRef.current?.focus();
    }
  }, [choiceOpen]);

  useEffect(() => {
    if (!choiceOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [choiceOpen]);

  useEffect(() => {
    if (!choiceOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setChoiceOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [choiceOpen]);

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const href = appendPreservedQuery("/employer/login", preserved);
    router.push(href);
  }

  const employerLogin = appendPreservedQuery("/employer/login", preserved);
  const jobsBrowse = appendPreservedQuery("/jobs-in-chennai", preserved);

  return (
    <div className="text-slate-900">
      <div className="mx-auto max-w-3xl px-0 pb-16 pt-4">
        <p className="text-center text-sm text-slate-600 md:text-base">
          Fill the basics below, then continue to your employer account to publish.
        </p>

        <form
          onSubmit={onFormSubmit}
          className="mt-8 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
        >
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-slate-900">
              Basic job details
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Job title
                <input
                  ref={firstFieldRef}
                  name="jobTitle"
                  type="text"
                  required
                  autoComplete="organization-title"
                  placeholder="e.g. Sales executive, OMR"
                  className="mt-1.5 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-600/0 transition-[box-shadow] focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                No. of openings
                <input
                  name="openings"
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="mt-1.5 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Job city / area
              <input
                name="city"
                type="text"
                required
                placeholder="e.g. Velachery, Chennai"
                className="mt-1.5 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </label>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-slate-900">
              Candidate requirements
            </legend>
            <div>
              <p className="text-sm font-medium text-slate-700">Total experience</p>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="group"
                aria-label="Experience filter"
              >
                {(
                  [
                    { id: "any" as const, label: "Any" },
                    { id: "fresher" as const, label: "Fresher only" },
                    { id: "experienced" as const, label: "Experienced only" },
                  ] as const
                ).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setExperience(id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      experience === id
                        ? "border-blue-700 bg-blue-700 text-white"
                        : "border-slate-300 bg-slate-50 text-slate-800 hover:border-slate-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input type="hidden" name="experience" value={experience} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Monthly in-hand salary (INR)
              </p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-slate-600">
                  From
                  <input
                    name="salaryFrom"
                    type="number"
                    min={0}
                    placeholder="e.g. 15000"
                    className="mt-1 w-full rounded-[var(--radius-md)] border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </label>
                <label className="text-xs text-slate-600">
                  To
                  <input
                    name="salaryTo"
                    type="number"
                    min={0}
                    placeholder="e.g. 25000"
                    className="mt-1 w-full rounded-[var(--radius-md)] border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </label>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">
                Do you offer bonus in addition to monthly salary?
              </p>
              <div className="mt-2 flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="bonus"
                    value="yes"
                    className="size-4 accent-blue-700"
                  />
                  Yes
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="bonus"
                    value="no"
                    defaultChecked
                    className="size-4 accent-blue-700"
                  />
                  No
                </label>
              </div>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Key skills (comma-separated)
              <input
                name="skills"
                type="text"
                placeholder="e.g. Tamil, Excel, two-wheeler"
                className="mt-1.5 w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </label>
          </fieldset>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              By continuing you agree to our{" "}
              <Link href="/terms" className="text-blue-700 underline-offset-2 hover:underline">
                terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-700 underline-offset-2 hover:underline">
                privacy policy
              </Link>
              .
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Continue to post job
            </button>
          </div>
        </form>
      </div>

      {/* Entry modal */}
      {choiceOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeChoice();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:max-w-2xl md:p-8"
          >
            <h2
              id={dialogTitleId}
              className="text-center text-lg font-semibold text-slate-800 md:text-xl"
            >
              What do you want to do?
            </h2>
            <p className="mt-1 text-center text-sm text-slate-500">
              Choose one path — you can always switch from the main menu.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href={jobsBrowse}
                onClick={() => setChoiceOpen(false)}
                className="group relative flex min-h-[160px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <div className="relative flex flex-1 flex-col justify-end bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-4 text-white">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 45%), radial-gradient(circle at 80% 80%, #06b6d4 0%, transparent 40%)",
                    }}
                  />
                  <span className="relative text-sm font-bold uppercase tracking-wide text-blue-100">
                    I want a job
                  </span>
                  <span className="relative mt-1 text-xs text-slate-300">
                    தமிழ்: எனக்கு வேலை வேண்டும்
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeChoice}
                className="group relative flex min-h-[160px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left shadow-sm transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <div className="relative flex flex-1 flex-col justify-end bg-gradient-to-br from-[#1e3a8a] via-blue-800 to-indigo-900 p-4 text-white">
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 70% 30%, #fbbf24 0%, transparent 35%), radial-gradient(circle at 30% 70%, #fff 0%, transparent 25%)",
                    }}
                  />
                  <span className="relative text-sm font-bold uppercase tracking-wide">
                    I want to hire
                  </span>
                  <span className="relative mt-1 text-xs text-blue-100/90">
                    தமிழ்: எனக்கு பணியாளர் தேவை
                  </span>
                </div>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
              <Link
                href={employerLogin}
                className="font-medium text-blue-700 underline-offset-2 hover:underline"
                onClick={() => setChoiceOpen(false)}
              >
                Already an employer? Sign in
              </Link>
              <span className="hidden text-slate-300 sm:inline" aria-hidden>
                |
              </span>
              <Link
                href="/contact"
                className="text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
                onClick={() => setChoiceOpen(false)}
              >
                Help / contact
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
