import Link from "next/link";
import { cardSurface, linkButton, transitionFast } from "@/lib/ui";

const steps = [
  {
    title: "Browse hyperlocal listings",
    body: "Filter by area and category, or start from Freshers or Part-time hubs.",
  },
  {
    title: "Apply in one step",
    body: "Use quick apply with your name and phone — no long forms for every role.",
  },
  {
    title: "Optional account",
    body: "Sign in as a candidate to track applications and update your profile over time.",
  },
];

export default function HomeCandidatesJoin() {
  return (
    <section className="space-y-6" aria-labelledby="home-join-heading">
      <div>
        <h2
          id="home-join-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          How to join as a job seeker
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Getting started is free. We focus on speed and clarity for Chennai workers.
        </p>
      </div>
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className={`${cardSurface} flex flex-col p-6 ${transitionFast} hover:border-blue-200`}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2 pt-2">
        <Link href="/candidate/login" className={linkButton} data-cta="candidates-login">
          Candidate login
        </Link>
        <Link href="/jobs-in-chennai" className={linkButton} data-cta="candidates-browse">
          Start browsing jobs
        </Link>
      </div>
    </section>
  );
}
