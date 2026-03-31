import InnerPageHero from "@/components/marketing/inner-page-hero";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-posts";
import { buildBlogPostingJsonLd } from "@/lib/blog-jsonld";
import { baseMetadata } from "@/lib/seo";
import { sectionCard } from "@/lib/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return baseMetadata("Article not found", "This article does not exist.", `/blog/${slug}`);
  }
  const base = baseMetadata(`${post.title} | Vacancy Chennai`, post.teaser, `/blog/${slug}`);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: ["Vacancy Chennai"],
    },
    twitter: base.twitter,
    alternates: base.alternates,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
  const blogPostingLd = buildBlogPostingJsonLd(post, siteUrl);

  const dateLabel = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <InnerPageHero
        eyebrow="Blog"
        title={post.title}
        description={post.teaser}
        actions={
          <Link
            href="/blog"
            className="text-sm font-semibold text-amber-200/95 underline-offset-4 hover:text-white hover:underline"
          >
            ← All articles
          </Link>
        }
      />
      <article className="pb-8 pt-8">
        <div className={`${sectionCard} mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600`}>
          <time dateTime={post.publishedAt}>{dateLabel}</time>
          <span aria-hidden className="text-slate-300">
            ·
          </span>
          <span>{post.readMinutes} min read</span>
        </div>
        <div className={`${sectionCard} space-y-4`}>
          {post.paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed text-slate-800">
              {p}
            </p>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/blog" className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline">
            Back to hiring insights
          </Link>
        </p>
      </article>
    </>
  );
}
