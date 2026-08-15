import Link from "next/link";
import { JOB_SAFETY_NOTICES } from "@/lib/job-seo-intro";
import { linkInline, sectionCard } from "@/lib/ui";

export function JobSafetyAside() {
  return (
    <section className={sectionCard} aria-labelledby="job-before-apply-heading">
      <h2 id="job-before-apply-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
        Before you apply
      </h2>
      <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-700">
        {JOB_SAFETY_NOTICES.map((line) => (
          <li key={line} className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        For corrections or fake-job reports, use the{" "}
        <Link href="/contact" className={linkInline}>
          contact page
        </Link>
        .
      </p>
    </section>
  );
}
