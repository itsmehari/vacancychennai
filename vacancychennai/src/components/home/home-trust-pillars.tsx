import { cardSurface, transitionFast } from "@/lib/ui";

const pillars = [
  {
    title: "Hyperlocal first",
    body: "Zones, areas, and landmarks so you know if a job is near home or your commute.",
    icon: "map",
  },
  {
    title: "Moderated listings",
    body: "We review employer posts to reduce spam and misleading ads.",
    icon: "shield",
  },
  {
    title: "Fast apply",
    body: "Quick apply with essentials — optimised for high-volume local roles.",
    icon: "bolt",
  },
] as const;

function PillarIcon({ name }: { name: (typeof pillars)[number]["icon"] }) {
  const c = "h-8 w-8 text-blue-600";
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 2 3 14h8l-1 8 10-12h-8l1-8z"
      />
    </svg>
  );
}

export default function HomeTrustPillars() {
  return (
    <section className="space-y-6" aria-labelledby="home-trust-heading">
      <h2
        id="home-trust-heading"
        className="text-2xl font-semibold tracking-tight text-slate-900"
      >
        Why use Vacancy Chennai
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((p) => (
          <div
            key={p.title}
            className={`${cardSurface} p-6 ${transitionFast} hover:border-blue-200`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-blue-50">
              <PillarIcon name={p.icon} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
