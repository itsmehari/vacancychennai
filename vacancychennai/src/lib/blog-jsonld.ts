import { getBlogPostArticleBody, type BlogPost } from "@/lib/blog-posts";

/** Breadcrumbs for article pages (`BreadcrumbList` JSON-LD). */
export function buildBlogBreadcrumbListJsonLd(
  post: BlogPost,
  siteUrl: string,
): Record<string, unknown> {
  const root = siteUrl.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${root}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${root}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${root}/blog/${post.slug}` },
    ],
  };
}

/** Single BlogPosting node for JSON-LD (schema.org). */
export function buildBlogPostingJsonLd(post: BlogPost, siteUrl: string): Record<string, unknown> {
  const pageUrl = `${siteUrl.replace(/\/$/, "")}/blog/${post.slug}`;
  const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE;
  const imageUrl =
    ogImage && (ogImage.startsWith("http://") || ogImage.startsWith("https://"))
      ? ogImage
      : ogImage
        ? `${siteUrl.replace(/\/$/, "")}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
        : null;

  const articleBody = getBlogPostArticleBody(post);
  const wordCount = articleBody.trim().split(/\s+/).filter(Boolean).length;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.teaser,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Vacancy Chennai",
      url: siteUrl.replace(/\/$/, ""),
    },
    publisher: {
      "@type": "Organization",
      name: "Vacancy Chennai",
      url: siteUrl.replace(/\/$/, ""),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    url: pageUrl,
    articleBody,
    wordCount,
    timeRequired: `PT${post.readMinutes}M`,
    inLanguage: "en-IN",
  };

  if (imageUrl) {
    jsonLd.image = [imageUrl];
  }

  return jsonLd;
}
