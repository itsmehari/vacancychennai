import { homeFaqItems } from "@/lib/home-content";
import { cardSurface } from "@/lib/ui";

export default function HomeFaq() {
  return (
    <section className="space-y-6" aria-labelledby="home-faq-heading">
      <div>
        <h2
          id="home-faq-heading"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          Frequently asked questions
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Straight answers about applying, privacy, and posting jobs in Chennai.
        </p>
      </div>
      <dl className={`${cardSurface} divide-y divide-slate-200 overflow-hidden p-0`}>
        {homeFaqItems.map((item) => (
          <div key={item.question} className="px-5 py-5 md:px-6 md:py-5">
            <dt className="text-base font-semibold text-slate-900">{item.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-700">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
