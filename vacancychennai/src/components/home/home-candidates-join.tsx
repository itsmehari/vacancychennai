import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import JobSeekerProfileCta from "@/components/marketing/job-seeker-profile-cta";
import { btnPrimary, btnSecondary, cardSurface, transitionFast } from "@/lib/ui";

const steps = [
  {
    title: "Browse hyperlocal listings",
    body: "Filter by area and category, or start from the Freshers or Part-time Chennai hubs.",
    icon: (
      <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437a.75.75 0 0 0 .503-.723v-9.75a.75.75 0 0 0-.503-.723l-4.875-2.437a.75.75 0 0 0-.752 0l-4.875 2.437a.75.75 0 0 0-.503.723v9.75c0 .316.2.597.503.723l4.875 2.437a.75.75 0 0 0 .752 0l4.875-2.437a.75.75 0 0 0 .503-.723v-9.75a.75.75 0 0 0-.503-.723l-4.875-2.437a.75.75 0 0 0-.752 0l-4.875 2.437a.75.75 0 0 0-.503.723V15" />
      </svg>
    ),
  },
  {
    title: "Apply in one step",
    body: "Use quick apply with your name and phone — no long forms for every role.",
    icon: (
      <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5 10.5 6.75 14.25 10.5 20.25 4.5" />
      </svg>
    ),
  },
  {
    title: "Optional account",
    body: "Sign in as a candidate to track applications and update your profile over time.",
    icon: (
      <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
];

export default function HomeCandidatesJoin() {
  return (
    <HomeSectionShell variant="tint" fullBleed>
      <section className="space-y-8" aria-labelledby="home-join-heading">
        <SectionHeader
          id="home-join-heading"
          eyebrow="Job seekers"
          title="How to join as a job seeker"
          description="Getting started is free. We focus on speed and clarity for Chennai workers."
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`relative flex flex-col ${cardSurface} p-6 ${transitionFast} hover:border-blue-200`}
            >
              <span className="absolute -left-1 -top-1 flex h-8 w-8 items-center justify-center rounded-br-[var(--radius-md)] bg-slate-900 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-blue-50 ring-1 ring-blue-100">
                {step.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <Link href="/jobs-in-chennai" className={btnPrimary} data-cta="candidates-browse">
            Start browsing jobs
          </Link>
          <Link href="/candidate/login" className={btnSecondary} data-cta="candidates-login">
            Candidate login
          </Link>
        </div>
        <div className="pt-4">
          <JobSeekerProfileCta variant="inline" dataCta="home-candidates-profile" />
        </div>
      </section>
    </HomeSectionShell>
  );
}
