import { homeFaqItems } from "@/lib/home-content";
import HomeSectionShell from "@/components/home/home-section-shell";
import SectionHeader from "@/components/home/section-header";
import { cardSurface, focusRing } from "@/lib/ui";

export default function HomeFaq() {
  return (
    <HomeSectionShell variant="elevated" fullBleed>
      <section className="space-y-8" aria-labelledby="home-faq-heading">
        <SectionHeader
          id="home-faq-heading"
          eyebrow="Help"
          title="Frequently asked questions"
          description="Straight answers about applying, privacy, and posting jobs in Chennai."
        />
        <div className={`${cardSurface} overflow-hidden p-0`}>
          {homeFaqItems.map((item, index) => (
            <details
              key={item.question}
              className="home-faq-details group border-b border-slate-200 last:border-b-0 open:bg-slate-50/60"
              open={index === 0}
            >
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-slate-900 hover:bg-slate-50/50 md:px-6 md:py-5 ${focusRing} rounded-none`}
              >
                <span>{item.question}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-slate-100 px-5 pb-5 pt-0 text-sm leading-relaxed text-slate-700 md:px-6 md:pb-6">
                <p className="pt-4">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </HomeSectionShell>
  );
}
