"use client";

import { resumeDoctorReferralUrl } from "@/lib/partner-resumedoctor";
import { btnSecondary, chipBase, focusRing, sectionCard, transitionFast } from "@/lib/ui";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

const CHECKLIST_KEY = "vc-first-resume-checklist-v1";

type PathId = "student" | "homemaker" | "restarter";

const pathCopy: Record<
  PathId,
  { label: string; short: string; bullets: string[]; accent: string }
> = {
  student: {
    label: "Student / fresher",
    short: "Lead with education, then proof — projects, internships, anything with a verb and a result.",
    accent: "from-emerald-500/15 to-blue-500/10",
    bullets: [
      "Put degree, college, and year first; add coursework only if it matches the roles you want.",
      "Every bullet starts with an action verb and ends with an outcome, number, or scope.",
      "Mention Tamil + English comfort if the JD asks for voice or retail floor roles.",
    ],
  },
  homemaker: {
    label: "Homemaker / caregiver",
    short: "Name the gap in one line, then show transferable skills as neutral workplace bullets.",
    accent: "from-rose-500/15 to-amber-500/10",
    bullets: [
      "One professional gap line beats a paragraph — dates optional if you prefer privacy.",
      "Budgets, vendor coordination, events, tuition help → rewrite as admin, ops, or community skills.",
      "Part-time and flex listings are valid restart ramps; match commute before chasing salary alone.",
    ],
  },
  restarter: {
    label: "Career restarter",
    short: "Bridge old paid work to today: stack chronology, refresh tools, and explain pivot in the summary.",
    accent: "from-violet-500/15 to-blue-500/10",
    bullets: [
      "Reverse-chronological paid roles; label consulting or gig work honestly.",
      "Add a “Current focus” line if you are upskilling (course name + platform + month).",
      "Chennai employers respect clear pivot stories — avoid hiding years then correcting in interview.",
    ],
  },
};

const checklistItems: { id: string; label: string }[] = [
  { id: "contact", label: "Contact block: phone, email, city — all match your IDs and forms" },
  { id: "dates", label: "Education and job dates line up everywhere (no accidental year typos)" },
  { id: "headline", label: "One headline line states role or strength, not a life story" },
  { id: "verbs", label: "Every experience bullet starts with a verb and includes one fact or outcome" },
  { id: "ats", label: "Single-column layout; no text boxes, tables, or icon fonts as bullets" },
  { id: "pdf", label: "Exported as PDF (or Word only if the portal requires it)" },
  { id: "skills", label: "Skills list is short — only what you can explain in an interview" },
  { id: "proofread", label: "Read aloud once; fix spelling of names, colleges, and company titles" },
];

const quizItems: { id: string; q: string; best: "a" | "b"; a: string; b: string; why: string }[] = [
  {
    id: "q1",
    q: "Best file for most employer portals?",
    best: "a",
    a: "Simple one-column PDF with standard fonts",
    b: "Colourful Canva template with icons and side columns",
    why: "Parsers read plain structure best; fancy layouts often drop text or scramble order.",
  },
  {
    id: "q2",
    q: "How should you list a 4-year caregiving break?",
    best: "a",
    a: 'One line: “Career break — family responsibilities (20XX–20XX)” then skills below',
    b: "Leave a gap and explain only if they ask",
    why: "Short clarity avoids awkward guessing; Indian HR sees gaps often — confidence wins.",
  },
  {
    id: "q3",
    q: "Freshers: where do unpaid college projects go?",
    best: "a",
    a: "Projects / Experience with organisation or “Academic project” in the line",
    b: "Omit them — only paid work counts",
    why: "Verified projects are valid proof when you have no salary yet.",
  },
  {
    id: "q4",
    q: "Should your skills section repeat every acronym from the JD?",
    best: "b",
    a: "Yes — copy-paste maximises keyword hits",
    b: "No — only tools and tasks you have actually used",
    why: "Keyword stuffing fails human screens and interviews fast.",
  },
  {
    id: "q5",
    q: "Best Chennai-specific addition for shift or field roles?",
    best: "a",
    a: "Rough zone or corridor (e.g. South Chennai, OMR) plus shift availability",
    b: "Full residential address in the header",
    why: "Area-level commute honesty helps without oversharing; full address is rarely needed on page one.",
  },
];

function loadChecks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Record<string, boolean>;
    return typeof p === "object" && p ? p : {};
  } catch {
    return {};
  }
}

/** Path picker + headline helper — insert after “Mindset” section. */
export function FirstResumePlaybookEarlyInteractive() {
  const baseId = useId();
  const [path, setPath] = useState<PathId>("student");
  const [role, setRole] = useState("");
  const [strength, setStrength] = useState("");
  const [area, setArea] = useState("");
  const [copied, setCopied] = useState(false);

  const headline = useMemo(() => {
    const r = role.trim();
    const s = strength.trim();
    const a = area.trim();
    if (!r && !s) return "";
    const parts: string[] = [];
    if (r) parts.push(r);
    if (s) parts.push(s);
    let line = parts.join(" — ");
    if (a) line = `${line} · ${a}`;
    return line;
  }, [role, strength, area]);

  const copyHeadline = useCallback(async () => {
    if (!headline) return;
    try {
      await navigator.clipboard.writeText(headline);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [headline]);

  const p = pathCopy[path];

  return (
    <div
      className={`not-prose mt-8 space-y-8 rounded-2xl border border-slate-200/90 bg-gradient-to-br ${p.accent} p-5 shadow-lg shadow-slate-900/5 md:p-8`}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-900/80">Interactive</p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Pick your starting point</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            The résumé changes tone by life stage. Switch tabs — use the bullets as a rewrite checklist, not a script to
            copy verbatim.
          </p>
        </div>
        <Link
          href="/job-seeker-profile"
          className={`text-sm font-semibold text-blue-800 underline-offset-4 hover:underline ${focusRing} rounded-sm`}
        >
          Open job seeker profile →
        </Link>
      </div>

      <div role="tablist" aria-label="Resume audience" className="flex flex-wrap gap-2">
        {(Object.keys(pathCopy) as PathId[]).map((id) => {
          const active = path === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              id={`${baseId}-tab-${id}`}
              aria-controls={`${baseId}-panel-${id}`}
              className={`${chipBase} ${active ? "border-blue-400 bg-blue-50 text-blue-950" : "bg-white/80"} ${transitionFast}`}
              onClick={() => setPath(id)}
            >
              {pathCopy[id].label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${path}`}
        aria-labelledby={`${baseId}-tab-${path}`}
        className="rounded-xl border border-white/60 bg-white/90 p-4 shadow-sm md:p-5"
      >
        <p className="text-sm font-medium text-slate-800">{pathCopy[path].short}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {pathCopy[path].bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${sectionCard} border-indigo-100/80 bg-white/95`}>
        <h3 className="text-base font-bold text-slate-900">Headline lab</h3>
        <p className="mt-1 text-sm text-slate-600">
          Draft one line for the top of your CV. Tweak until it sounds like you — then paste into Word or a builder.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Target role or degree</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="e.g. B.Com graduate, Front desk"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Strength or proof</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="e.g. Tally + Excel, 6 mo internship"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Area (optional)</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder="e.g. Velachery, South Chennai"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              autoComplete="off"
            />
          </label>
        </div>
        {headline ? (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-900">{headline}</p>
            <button type="button" className={btnSecondary} onClick={copyHeadline}>
              {copied ? "Copied" : "Copy headline"}
            </button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Fill at least role or strength to preview your headline.</p>
        )}
      </div>

      <p className="mt-6 border-t border-white/35 pt-4 text-center text-xs text-slate-600">
        <span className="text-slate-500">Listing a role for your team?</span>{" "}
        <Link
          href="/pricing"
          className="font-medium text-slate-800 underline-offset-2 hover:text-blue-900 hover:underline"
        >
          Employer pricing
        </Link>
        <span className="mx-2 text-slate-400" aria-hidden>
          ·
        </span>
        <Link href="/post-job" className="font-medium text-slate-800 underline-offset-2 hover:text-blue-900 hover:underline">
          Post a job
        </Link>
      </p>
    </div>
  );
}

/** Checklist + ATS quick scan — insert after format / PDF section. */
export function FirstResumePlaybookLateInteractive() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, "a" | "b" | null>>({});

  useEffect(() => {
    setChecks(loadChecks());
  }, []);

  const persist = useCallback((next: Record<string, boolean>) => {
    setChecks(next);
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (id: string) => {
    const next = { ...checks, [id]: !checks[id] };
    persist(next);
  };

  const done = checklistItems.filter((i) => checks[i.id]).length;
  const pct = Math.round((done / checklistItems.length) * 100);

  const score = useMemo(() => {
    let n = 0;
    for (const q of quizItems) {
      if (answers[q.id] === q.best) n += 1;
    }
    return n;
  }, [answers]);

  const rdUrl = resumeDoctorReferralUrl("blog_first_resume_interactive");

  return (
    <div className="not-prose mt-8 space-y-8">
      <div className={`${sectionCard} border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900/80">Before you export</p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">Section checklist</h3>
            <p className="mt-1 text-sm text-slate-600">Tick items as you go — we save progress in this browser only.</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums text-emerald-800">{pct}%</p>
            <p className="text-xs text-slate-500">
              {done}/{checklistItems.length} done
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <ul className="mt-5 space-y-3">
          {checklistItems.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-1 py-1 hover:border-emerald-200/80 hover:bg-white/80">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600"
                  checked={!!checks[item.id]}
                  onChange={() => toggle(item.id)}
                />
                <span className="text-sm leading-relaxed text-slate-800">{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${sectionCard} border-indigo-200/70 bg-white`}>
        <h3 className="text-lg font-bold text-slate-900">ATS & honesty quick scan</h3>
        <p className="mt-1 text-sm text-slate-600">
          Five quick choices. This is a learning drill — not a score that blocks you from applying.
        </p>
        <ol className="mt-5 space-y-6">
          {quizItems.map((q, idx) => (
            <li key={q.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {idx + 1}. {q.q}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className={`rounded-lg border px-3 py-2 text-left text-sm ${
                    answers[q.id] === "a"
                      ? "border-blue-500 bg-blue-50 font-medium text-blue-950"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  } ${focusRing}`}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: "a" }))}
                >
                  A. {q.a}
                </button>
                <button
                  type="button"
                  className={`rounded-lg border px-3 py-2 text-left text-sm ${
                    answers[q.id] === "b"
                      ? "border-blue-500 bg-blue-50 font-medium text-blue-950"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  } ${focusRing}`}
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: "b" }))}
                >
                  B. {q.b}
                </button>
              </div>
              {answers[q.id] ? (
                <p
                  className={`mt-3 text-sm ${
                    answers[q.id] === q.best ? "text-emerald-800" : "text-amber-900"
                  }`}
                >
                  {answers[q.id] === q.best ? "Strong choice. " : "Learning moment. "}
                  {q.why}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
          <span className="font-semibold">Your drill score: {score}/{quizItems.length}</span>
          {score === quizItems.length ? (
            <>
              {" "}
              — Ready to export.{" "}
              <Link
                href="/jobs-in-chennai"
                className="font-semibold text-blue-800 underline decoration-blue-200 underline-offset-2 hover:text-blue-950"
              >
                Browse Chennai jobs
              </Link>{" "}
              with confidence.
            </>
          ) : (
            " — Re-read the sections on format and gaps; then iterate once more."
          )}
        </p>
        <p className="mt-4 text-sm text-slate-600">
          Want structured layouts and ATS checks?{" "}
          <a
            href={rdUrl}
            className="font-semibold text-blue-700 hover:text-blue-900 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            data-partner-link="resume-doctor"
            data-utm-content="blog_first_resume_interactive"
          >
            Try ResumeDoctor
          </a>{" "}
          before you upload to national portals.
        </p>
        <p className="mt-5 border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          Need candidates for Chennai roles?{" "}
          <Link href="/pricing" className="font-medium text-slate-700 underline-offset-2 hover:text-blue-800 hover:underline">
            View listing plans
          </Link>{" "}
          ·{" "}
          <Link href="/employer/login" className="font-medium text-slate-700 underline-offset-2 hover:text-blue-800 hover:underline">
            Employer login
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Copy + WhatsApp share — client-only for article URL. */
export function BlogArticleShareStrip({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(typeof window !== "undefined" ? window.location.href : "");
  }, []);

  const shareText = url ? `${title} — ${url}` : title;

  const copy = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div
      className={`${sectionCard} mt-10 flex flex-col gap-4 border-slate-200/90 bg-gradient-to-r from-slate-50 to-blue-50/40 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Share this guide</p>
        <p className="mt-1 text-sm text-slate-600">Send the link to friends building a first CV — works on mobile.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnSecondary} onClick={copy} disabled={!url}>
          {copied ? "Link copied" : "Copy link"}
        </button>
        {url ? (
          <a
            href={whatsappHref}
            className={`${btnSecondary} border-emerald-200/80 bg-emerald-50/80 text-emerald-950 hover:bg-emerald-100/80`}
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
        ) : (
          <span
            className={`${btnSecondary} cursor-wait border-slate-200/80 text-slate-500 opacity-80`}
            aria-hidden
          >
            WhatsApp
          </span>
        )}
      </div>
    </div>
  );
}
