import { PageAdSlot } from "@/components/ads/page-ad-slot";
import { BlogArticleBody } from "@/components/blog/blog-article-body";
import { BlogArticleShareStrip } from "@/components/blog/first-resume-playbook-widgets";
import { BlogReadingProgress } from "@/components/blog/blog-reading-progress";
import InnerPageHero from "@/components/marketing/inner-page-hero";
import { PartnerResumeDoctorAside } from "@/components/partner/partner-resume-doctor-aside";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog-posts";
import { buildBlogBreadcrumbListJsonLd, buildBlogPostingJsonLd } from "@/lib/blog-jsonld";
import { baseMetadata } from "@/lib/seo";
import { linkInline, sectionCard } from "@/lib/ui";
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
  const breadcrumbLd = buildBlogBreadcrumbListJsonLd(post, siteUrl);

  const dateLabel = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const rd = post.resumeDoctorRetrofitAside;

  return (
    <>
      {post.interactive === "first-resume-playbook" ? <BlogReadingProgress /> : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
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
      >
        {post.interactive === "first-resume-playbook" ? (
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Article highlights">
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-amber-100/95">
              16 sections
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-amber-100/95">
              Path picker + headline lab
            </span>
            <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-amber-100/95">
              Checklist & quick scan
            </span>
          </div>
        ) : null}
      </InnerPageHero>
      <article className="pb-8 pt-8">
        <nav aria-label="Breadcrumb" className={`${sectionCard} mb-6 text-sm text-slate-600`}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className={linkInline}>
                Home
              </Link>
            </li>
            <li aria-hidden className="text-slate-300">
              /
            </li>
            <li>
              <Link href="/blog" className={linkInline}>
                Blog
              </Link>
            </li>
            <li aria-hidden className="text-slate-300">
              /
            </li>
            <li className="font-medium text-slate-800" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>
        <div className={`${sectionCard} mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600`}>
          <time dateTime={post.publishedAt}>{dateLabel}</time>
          <span aria-hidden className="text-slate-300">
            ·
          </span>
          <span>{post.readMinutes} min read</span>
        </div>
        <BlogArticleBody post={post} />
        {post.interactive === "first-resume-playbook" ? <BlogArticleShareStrip title={post.title} /> : null}
        <PageAdSlot shape="rectangle" placement="blog_article" className="mt-10" />
        {rd ? (
          <div className="mt-10 max-w-2xl">
            <PartnerResumeDoctorAside
              utmContent={rd.utmContent}
              headline={rd.headline}
              body={rd.body}
              linkLabel={rd.linkLabel}
              disclosure={rd.disclosure}
            />
          </div>
        ) : null}
        <p className="mt-8 text-center">
          <Link href="/blog" className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline">
            Back to hiring insights
          </Link>
        </p>
      </article>
    </>
  );
}
