import Link from "next/link";
import { btnNeutral, cardSurface } from "@/lib/ui";

export default function HomeBlogCta() {
  return (
    <section
      className={`flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center ${cardSurface} p-6 md:p-8`}
      aria-labelledby="home-blog-heading"
    >
      <div>
        <h2 id="home-blog-heading" className="text-xl font-semibold tracking-tight text-slate-900">
          Tips & local hiring updates
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Read short articles on job search and hiring in Chennai.
        </p>
      </div>
      <Link href="/blog" className={btnNeutral} data-cta="blog-cta">
        Visit the blog
      </Link>
    </section>
  );
}
