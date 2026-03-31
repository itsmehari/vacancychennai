import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import { focusRing, transitionFast } from "@/lib/ui";

type Props = {
  categories: string[];
};

function categoryInitial(cat: string) {
  const alnum = cat.replace(/[^a-zA-Z0-9]/g, "");
  return (alnum.slice(0, 2) || "?").toUpperCase();
}

const chipClass = `inline-flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 pl-2 text-sm font-medium text-slate-800 shadow-sm hover:border-blue-300 hover:bg-blue-50/90 ${focusRing} ${transitionFast}`;

export default function HomeCategoryChips({ categories }: Props) {
  return (
    <HomeSectionShell variant="tint" fullBleed>
      <section className="space-y-8" aria-labelledby="home-categories-heading">
        <SectionHeader
          id="home-categories-heading"
          eyebrow="Filters"
          title="Popular categories"
          description="Tap a category to open filtered listings on Jobs in Chennai."
        />
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-50 via-white to-transparent md:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-blue-50/50 via-white to-transparent md:hidden"
            aria-hidden
          />
          <div
            className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2 pt-1 md:mx-auto md:max-w-4xl md:flex-wrap md:justify-center md:overflow-visible md:pb-0"
            role="list"
            aria-label="Job categories"
          >
            {categories.map((cat) => {
              const params = new URLSearchParams({ category: cat });
              return (
                <Link
                  key={cat}
                  href={`/jobs-in-chennai?${params.toString()}`}
                  role="listitem"
                  className={chipClass}
                  data-cta={`category-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 ring-1 ring-slate-200/80"
                    aria-hidden
                  >
                    {categoryInitial(cat)}
                  </span>
                  <span className="pr-1">{cat}</span>
                  <svg
                    className="h-4 w-4 shrink-0 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </HomeSectionShell>
  );
}
