import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import { cardInteractive, linkInline } from "@/lib/ui";

const cards = [
  {
    href: "/roles",
    title: "Jobs by role",
    body: "Telecaller, delivery, accounts, retail, nursing, and other Chennai role hubs with live listings.",
  },
  {
    href: "/areas",
    title: "Neighbourhood hubs",
    body: "Every area page in one index so you can match a commute before a job title.",
  },
  {
    href: "/salary-guide-chennai",
    title: "Salary snapshot",
    body: "Ranges employers typed on current listings. Not a city-wide pay survey.",
  },
  {
    href: "/internships-chennai",
    title: "Internships",
    body: "Listings marked internship, with area and the same apply path as other jobs.",
  },
  {
    href: "/guides",
    title: "Guides and ideas",
    body: "How to apply, how to read a corridor, and how employers should write a local post.",
  },
  {
    href: "/hire-in-chennai",
    title: "Hire in Chennai",
    body: "The employer path from account to a moderated listing people can filter by area.",
  },
  {
    href: "/jobs-this-week",
    title: "Posted this week",
    body: "A count of moderated listings from the last seven days, grouped by neighbourhood.",
  },
] as const;

export default function HomeDiscoverStrip() {
  return (
    <HomeSectionShell variant="tint" fullBleed>
      <section className="space-y-8" aria-labelledby="home-discover-heading">
        <SectionHeader
          id="home-discover-heading"
          eyebrow="Find it faster"
          title="Roles, areas, pay, and guides"
          description="Pages built so you — and search — can answer a Chennai hiring question without guessing."
          action={
            <Link href="/guides" className={linkInline}>
              All guides
            </Link>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className={`flex h-full flex-col rounded-[var(--radius-lg)] border border-slate-200/90 bg-white p-5 shadow-[var(--shadow-card)] ${cardInteractive}`}
              >
                <span className="text-base font-semibold text-slate-900">{card.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-slate-600">{card.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </HomeSectionShell>
  );
}
