import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import { homeSegmentCards, homeSegmentsHeader } from "@/lib/home-marketing-copy";
import { btnPrimary, cardInteractive, transitionFast } from "@/lib/ui";

type SegmentIconName = (typeof homeSegmentCards)[number]["icon"];

const accentStyles = {
  blue: {
    bar: "border-l-blue-500",
    iconWrap: "bg-blue-50 ring-1 ring-blue-100",
    icon: "text-blue-600",
    top: "from-blue-500/90 to-blue-600/40",
  },
  amber: {
    bar: "border-l-amber-500",
    iconWrap: "bg-amber-50 ring-1 ring-amber-100",
    icon: "text-amber-700",
    top: "from-amber-400/90 to-amber-600/35",
  },
  slate: {
    bar: "border-l-slate-600",
    iconWrap: "bg-slate-100 ring-1 ring-slate-200",
    icon: "text-slate-700",
    top: "from-slate-500/80 to-slate-700/35",
  },
} as const;

function SegmentIcon({ name, className }: { name: SegmentIconName; className: string }) {
  if (name === "graduation") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
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
      <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
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
    <HomeSectionShell variant="elevated" fullBleed>
      <section className="space-y-8" aria-labelledby="home-segments-heading">
        <SectionHeader
          id="home-segments-heading"
          eyebrow={homeSegmentsHeader.eyebrow}
          title={homeSegmentsHeader.title}
          description={homeSegmentsHeader.description}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {homeSegmentCards.map((item) => {
            const a = accentStyles[item.accent];
            return (
              <article
                key={item.href}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] border-l-4 bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)] ${a.bar} ${cardInteractive} motion-reduce:hover:translate-y-0`}
              >
                <div className={`h-1 w-full bg-gradient-to-r ${a.top}`} aria-hidden />
                <div className="flex flex-1 flex-col p-6 pt-5">
                  {item.badge ? (
                    <span className="mb-3 inline-flex w-fit rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {item.badge}
                    </span>
                  ) : null}
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${a.iconWrap} ${transitionFast} group-hover:scale-105 motion-reduce:group-hover:scale-100`}
                    >
                      <SegmentIcon name={item.icon} className={`h-7 w-7 ${a.icon}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    </div>
                  </div>
                  <Link href={item.href} className={`${btnPrimary} mt-6 w-full`} data-cta={item.dataCta}>
                    {item.cta}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </HomeSectionShell>
  );
}
