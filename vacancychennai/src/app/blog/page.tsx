import InnerPageHero from "@/components/marketing/inner-page-hero";
import { blogPosts } from "@/lib/blog-posts";
import { baseMetadata } from "@/lib/seo";
import { sectionCard } from "@/lib/ui";
import Link from "next/link";

export const metadata = baseMetadata(
  "Hiring insights — Vacancy Chennai",
  "Chennai hiring notes: first-time résumés, OMR IT hiring, walk-ins, salary trends — practical guides for local employers and job seekers.",
  "/blog",
);

export default function BlogIndexPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Blog"
        title="Hiring insights"
        description="Weekly hiring and career notes for Chennai — including first résumés for students and homemakers, plus local context for employers."
      />
      <ul className="space-y-4 pb-4 pt-8">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <article className={`${sectionCard} transition-shadow hover:shadow-md`}>
              <h2 className="text-lg font-semibold text-slate-900">
                <Link href={`/blog/${post.slug}`} className="text-inherit hover:text-blue-800">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-slate-600">{post.teaser}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                >
                  Read article
                </Link>
                <span className="text-xs text-slate-400">{post.readMinutes} min read</span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
