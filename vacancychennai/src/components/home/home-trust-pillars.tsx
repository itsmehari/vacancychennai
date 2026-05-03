import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import { homeTrustHeader, homeTrustPillarsCopy } from "@/lib/home-marketing-copy";
import { transitionFast } from "@/lib/ui";

type PillarIcon = (typeof homeTrustPillarsCopy)[number]["icon"];

function PillarIcon({ name }: { name: PillarIcon }) {
  const c = "h-7 w-7 text-blue-700";
  if (name === "map") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437a.75.75 0 0 0 .503-.723v-9.75a.75.75 0 0 0-.503-.723l-4.875-2.437a.75.75 0 0 0-.752 0l-4.875 2.437a.75.75 0 0 0-.503.723v9.75c0 .316.2.597.503.723l4.875 2.437a.75.75 0 0 0 .752 0l4.875-2.437a.75.75 0 0 0 .503-.723v-9.75a.75.75 0 0 0-.503-.723l-4.875-2.437a.75.75 0 0 0-.752 0l-4.875 2.437a.75.75 0 0 0-.503.723V15" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    );
  }
  return (
    <svg className={c} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

export default function HomeTrustPillars() {
  return (
    <HomeSectionShell variant="trust" fullBleed>
      <section className="space-y-8" aria-labelledby="home-trust-heading">
        <SectionHeader
          id="home-trust-heading"
          eyebrow={homeTrustHeader.eyebrow}
          title={homeTrustHeader.title}
          description={homeTrustHeader.description}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {homeTrustPillarsCopy.map((p) => (
            <div
              key={p.title}
              className={`rounded-[var(--radius-lg)] border border-slate-200/80 bg-transparent p-6 ${transitionFast} hover:border-blue-300 hover:bg-white/50`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-white shadow-[var(--shadow-card)] ring-1 ring-slate-200/80">
                  <PillarIcon name={p.icon} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </HomeSectionShell>
  );
}
