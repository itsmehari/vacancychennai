import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import { btnPrimary, btnSecondary, transitionFast } from "@/lib/ui";

type IconKind = "search" | "doc" | "user" | "building" | "clipboard" | "users";

const candidateSteps: { n: number; text: string; icon: IconKind }[] = [
  { n: 1, text: "Browse by area, category, or segment (freshers / part-time).", icon: "search" },
  { n: 2, text: "Open a job and read location, salary range, and landmark.", icon: "doc" },
  {
    n: 3,
    text: "Apply with quick apply (name + phone) or sign in to track applications.",
    icon: "user",
  },
];

const employerSteps: { n: number; text: string; icon: IconKind }[] = [
  { n: 1, text: "Create an employer account and sign in.", icon: "building" },
  { n: 2, text: "Post a job with area, role, and salary — listings are moderated.", icon: "clipboard" },
  { n: 3, text: "Review applicants from your dashboard and shortlist or reject.", icon: "users" },
];

function StepIcon({ kind }: { kind: IconKind }) {
  const c = "h-5 w-5 text-slate-600";
  if (kind === "search") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    );
  }
  if (kind === "doc") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 2.25H4.5" />
      </svg>
    );
  }
  if (kind === "user") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    );
  }
  if (kind === "building") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12v18H3V3Z" />
      </svg>
    );
  }
  if (kind === "clipboard") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    );
  }
  return (
    <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.75 3.75 0 1 1-6.75 0 3.75 3.75 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

function StepList({
  steps,
  lineClass,
}: {
  steps: { n: number; text: string; icon: IconKind }[];
  lineClass: string;
}) {
  return (
    <ol className="relative mt-6">
      {steps.map((s, i) => (
        <li key={s.n} className="relative flex gap-4 pb-8 last:pb-0">
          {i < steps.length - 1 ? (
            <span className={`absolute left-[15px] top-9 bottom-0 w-0.5 ${lineClass}`} aria-hidden />
          ) : null}
          <span
            className={`relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm ring-2 ring-slate-200/90 ${transitionFast}`}
            aria-hidden
          >
            {s.n}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <StepIcon kind={s.icon} />
              Step {s.n}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function HomeHowItWorks() {
  return (
    <HomeSectionShell variant="default" fullBleed>
      <section className="space-y-8" aria-labelledby="home-hiw-heading">
        <SectionHeader
          id="home-hiw-heading"
          eyebrow="Simple paths"
          title="How it works"
          description="Two simple paths — whether you are hiring or looking for work in Chennai."
        />
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-[var(--radius-lg)] border border-blue-200/80 bg-gradient-to-b from-blue-50/80 to-white p-6 md:p-8">
          <h3 className="text-lg font-semibold text-slate-900">For job seekers</h3>
          <StepList steps={candidateSteps} lineClass="bg-blue-200" />
          <div className="mt-8 flex flex-col gap-2 border-t border-blue-100/80 pt-6 sm:flex-row sm:flex-wrap">
            <Link href="/candidate/login" className={btnSecondary} data-cta="hiw-candidate-login">
              Candidate login
            </Link>
            <Link href="/jobs-in-chennai" className={btnPrimary} data-cta="hiw-browse-jobs">
              Browse jobs
            </Link>
          </div>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-amber-200/80 bg-gradient-to-b from-amber-50/60 to-white p-6 md:p-8">
          <h3 className="text-lg font-semibold text-slate-900">For employers</h3>
          <StepList steps={employerSteps} lineClass="bg-amber-200/90" />
          <div className="mt-8 flex flex-col gap-2 border-t border-amber-100/90 pt-6 sm:flex-row sm:flex-wrap">
            <Link href="/employer/login" className={btnSecondary} data-cta="hiw-employer-login">
              Employer login
            </Link>
            <Link href="/pricing" className={btnPrimary} data-cta="hiw-pricing">
              View pricing
            </Link>
          </div>
        </div>
        </div>
      </section>
    </HomeSectionShell>
  );
}
