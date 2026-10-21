import { focusRing } from "@/lib/ui";
import type { DiscoverFaq } from "@/lib/discover/roles";

export function DiscoverFaqList({
  items,
  heading = "Questions people ask",
}: {
  items: DiscoverFaq[];
  heading?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10" aria-labelledby="discover-faq-heading">
      <h2 id="discover-faq-heading" className="text-xl font-semibold tracking-tight text-slate-900">
        {heading}
      </h2>
      <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-[var(--radius-lg)] border border-slate-200/90 bg-white shadow-[var(--shadow-card)]">
        {items.map((item, index) => (
          <details key={item.question} className="group px-5 py-4" open={index === 0}>
            <summary
              className={`cursor-pointer list-none font-semibold text-slate-900 [&::-webkit-details-marker]:hidden ${focusRing} rounded-sm`}
            >
              {item.question}
            </summary>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
