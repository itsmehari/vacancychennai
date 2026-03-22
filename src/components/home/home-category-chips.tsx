import Link from "next/link";
import { chipBase } from "@/lib/ui";

type Props = {
  categories: string[];
};

export default function HomeCategoryChips({ categories }: Props) {
  return (
    <section className="space-y-6" aria-labelledby="home-categories-heading">
      <div>
        <h2
          id="home-categories-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          Popular categories
        </h2>
        <p className="mt-2 text-slate-600">
          Tap a category to open filtered listings on Jobs in Chennai.
        </p>
      </div>
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-slate-50 to-transparent md:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-slate-50 to-transparent md:hidden"
          aria-hidden
        />
        <div
          className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-2 pt-1 md:flex-wrap md:overflow-visible md:pb-0"
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
                className={`${chipBase} snap-start`}
                data-cta={`category-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
