import Link from "next/link";
import HomeSectionShell from "@/components/home/home-section-shell";
import { btnNeutral } from "@/lib/ui";

export default function HomeBlogCta() {
  return (
    <HomeSectionShell variant="default" fullBleed>
      <section
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-slate-200/90 bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)]"
        aria-labelledby="home-blog-heading"
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[42%] opacity-[0.35] [background-image:linear-gradient(135deg,rgba(37,99,235,0.12)_0%,transparent_50%),repeating-linear-gradient(-12deg,rgba(37,99,235,0.06)_0_1px,transparent_1px_14px)] md:w-[45%]"
          aria-hidden
        />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-blue-100/85 via-blue-50/35 to-transparent md:w-2/5" aria-hidden />
        <div
          className="absolute -right-8 top-0 h-32 w-32 rounded-full bg-blue-200/25 blur-2xl md:h-48 md:w-48"
          aria-hidden
        />
        <div className="relative flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10">
          <div className="max-w-xl md:flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">From the blog</p>
            <h2
              id="home-blog-heading"
              className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl md:leading-tight"
            >
              Tips & local hiring updates
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 md:text-base">
              Read short articles on job search and hiring in Chennai.
            </p>
          </div>
          <Link href="/blog" className={`${btnNeutral} w-full shrink-0 md:w-auto md:self-center`} data-cta="blog-cta">
            Visit the blog
          </Link>
        </div>
      </section>
    </HomeSectionShell>
  );
}
