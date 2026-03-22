import Link from "next/link";
import { cardSurface, linkButton, transitionFast } from "@/lib/ui";

const candidateSteps = [
  { n: 1, text: "Browse by area, category, or segment (freshers / part-time)." },
  { n: 2, text: "Open a job and read location, salary range, and landmark." },
  {
    n: 3,
    text: "Apply with quick apply (name + phone) or sign in to track applications.",
  },
];

const employerSteps = [
  { n: 1, text: "Create an employer account and sign in." },
  { n: 2, text: "Post a job with area, role, and salary — listings are moderated." },
  { n: 3, text: "Review applicants from your dashboard and shortlist or reject." },
];

function StepList({ steps }: { steps: { n: number; text: string }[] }) {
  return (
    <ol className="mt-5 space-y-4">
      {steps.map((s) => (
        <li key={s.n} className="flex gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800 ${transitionFast}`}
            aria-hidden
          >
            {s.n}
          </span>
          <span className="pt-1 text-sm leading-relaxed text-slate-700">{s.text}</span>
        </li>
      ))}
    </ol>
  );
}

const panelClass = `${cardSurface} p-6 md:p-8`;

export default function HomeHowItWorks() {
  return (
    <section className="space-y-6" aria-labelledby="home-hiw-heading">
      <div>
        <h2
          id="home-hiw-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          How it works
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Two simple paths — whether you are hiring or looking for work in Chennai.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div className={panelClass}>
          <h3 className="text-lg font-semibold text-slate-900">For job seekers</h3>
          <StepList steps={candidateSteps} />
          <div className="mt-8 flex flex-wrap gap-2">
            <Link href="/candidate/login" className={linkButton} data-cta="hiw-candidate-login">
              Candidate login
            </Link>
            <Link href="/jobs-in-chennai" className={linkButton} data-cta="hiw-browse-jobs">
              Browse jobs
            </Link>
          </div>
        </div>
        <div className={panelClass}>
          <h3 className="text-lg font-semibold text-slate-900">For employers</h3>
          <StepList steps={employerSteps} />
          <div className="mt-8 flex flex-wrap gap-2">
            <Link href="/employer/login" className={linkButton} data-cta="hiw-employer-login">
              Employer login
            </Link>
            <Link href="/pricing" className={linkButton} data-cta="hiw-pricing">
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
