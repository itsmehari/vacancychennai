import Image from "next/image";
import Link from "next/link";
import { focusRing, transitionFast } from "@/lib/ui";
import { SHOWCASE_HREF } from "./showcase-ctas";

export default function ShowcaseTestimonialCard() {
  return (
    <article className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl border border-orange-200/60 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50/90 shadow-[var(--shadow-card)] md:min-h-[320px]">
      <div className="flex flex-1 flex-col p-5 pb-0 md:p-6 md:pb-0">
        <div className="flex items-start justify-between gap-3 pr-24 md:pr-28">
          <div>
            <p className="text-sm font-semibold text-slate-900">Reference for Priya</p>
            <p
              className="mt-1 text-sm font-medium text-slate-800"
              aria-label="Rated 5 out of 5 stars"
            >
              <span className="text-amber-700" aria-hidden>
                ★★★★★
              </span>{" "}
              <span className="tabular-nums">5.0</span>
            </p>
          </div>
        </div>
        <blockquote className="mt-4 max-w-md text-sm leading-relaxed text-slate-800">
          “We hired two support leads through Vacancy Chennai in Velachery—clear listings and
          faster shortlists than our usual channels.”
        </blockquote>
        <div className="mt-auto flex flex-wrap items-center gap-3 pb-5 pt-6 md:pb-6">
          <Link
            href={SHOWCASE_HREF.employerLogin}
            className={`inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 ${focusRing} ${transitionFast}`}
            data-cta="showcase-testimonial-submit"
          >
            Submit
          </Link>
          <Link
            href={SHOWCASE_HREF.candidateLogin}
            className={`text-sm font-semibold text-slate-800 underline-offset-4 hover:underline ${focusRing} rounded-sm`}
            data-cta="showcase-testimonial-edit"
          >
            Edit
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-2 top-4 w-[42%] max-w-[200px] md:right-2 md:top-6">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-white shadow-lg ring-1 ring-orange-200/50">
          <Image
            src="https://i.pravatar.cc/320?img=47"
            alt=""
            width={320}
            height={427}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </article>
  );
}
