import Link from "next/link";
import { btnPrimary, cardInteractive, transitionFast } from "@/lib/ui";

const segments = [
  {
    title: "Freshers & entry-level",
    description: "Roles suited for early-career and first-job seekers in Chennai.",
    href: "/freshers-jobs-chennai",
    cta: "See freshers jobs",
    dataCta: "segment-freshers",
    icon: "graduation",
  },
  {
    title: "Part-time & flexible",
    description: "Shift-friendly and flexible listings across the city.",
    href: "/part-time-jobs-chennai",
    cta: "See part-time jobs",
    dataCta: "segment-part-time",
    icon: "clock",
  },
  {
    title: "All Chennai jobs",
    description: "Full catalog with filters for category, type, and salary.",
    href: "/jobs-in-chennai",
    cta: "Browse all jobs",
    dataCta: "segment-all-jobs",
    icon: "briefcase",
  },
] as const;

function SegmentIcon({ name }: { name: (typeof segments)[number]["icon"] }) {
  const common = "h-7 w-7 text-blue-600";
  if (name === "graduation") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.01 50.01 0 0 1 12 2.25c2.407 0 4.722.402 6.863 1.14"
        />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25M20.25 6.75H3.75A2.25 2.25 0 0 0 1.5 9v.243c0 1.283.78 2.43 1.969 2.89l.582.226M20.25 6.75a2.25 2.25 0 0 1 2.25 2.25v.243c0 1.283-.78 2.43-1.969 2.89l-.582.226"
      />
    </svg>
  );
}

export default function HomeSegmentCards() {
  return (
    <section className="space-y-6" aria-labelledby="home-segments-heading">
      <div>
        <h2
          id="home-segments-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          Find jobs by situation
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Jump straight into the list that matches how you want to work.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {segments.map((item) => (
          <article
            key={item.href}
            className={`flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-card)] ${cardInteractive} motion-reduce:hover:translate-y-0`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-blue-50 ${transitionFast}`}
              >
                <SegmentIcon name={item.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            </div>
            <Link href={item.href} className={`${btnPrimary} mt-6 w-full`} data-cta={item.dataCta}>
              {item.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
