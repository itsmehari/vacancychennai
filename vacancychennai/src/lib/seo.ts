import { Metadata } from "next";
import { HOME_SEO_DESCRIPTION, HOME_SEO_TITLE } from "@/lib/home-seo-copy";

export function baseMetadata(
  title: string,
  description: string,
  path = "",
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
  const absolute = `${siteUrl}${path}`;
  const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: absolute },
    openGraph: {
      title,
      description,
      url: absolute,
      type: "website",
      siteName: "Vacancy Chennai",
      locale: "en_IN",
      ...(ogImage ? { images: [{ url: ogImage, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

const JOBS_IN_CHENNAI_DESCRIPTION =
  "Filter moderated Vacancy Chennai listings by area, category, job type, and salary. OMR, Velachery, Tambaram, Porur, Ambattur — free to browse and quick-apply.";

/** `/jobs-in-chennai` — bilingual hints for search (English default + Tamil UI). */
export function jobsInChennaiListingMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
  const path = "/jobs-in-chennai";
  const base = baseMetadata("Jobs in Chennai", JOBS_IN_CHENNAI_DESCRIPTION, path);
  return {
    ...base,
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        "en-IN": `${siteUrl}${path}`,
        "ta-IN": `${siteUrl}${path}?lang=ta`,
        "x-default": `${siteUrl}${path}`,
      },
    },
  };
}

/** `/jobs/[jobId]` — rich title/description + keyword hints for hyperlocal queries. */
export function jobDetailPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Listing first seen — maps to `openGraph.publishedTime` when article OG is used. */
  publishedTime?: string;
  /** Last update — `openGraph.modifiedTime` (requires `type: "article"` in Next metadata). */
  modifiedTime?: string;
}): Metadata {
  const base = baseMetadata(opts.title, opts.description, opts.path);
  let meta: Metadata = base;
  if (opts.keywords?.length) meta = { ...meta, keywords: opts.keywords };
  const modified = opts.modifiedTime?.trim();
  const published = (opts.publishedTime ?? opts.modifiedTime)?.trim();
  if (modified && published && meta.openGraph) {
    meta = {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        type: "article",
        publishedTime: published,
        modifiedTime: modified,
      },
    };
  }
  return meta;
}

/** Home page (`/`) — SEO-optimized title/description, OG, Twitter, optional share image. */
export function homePageMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
  const title = HOME_SEO_TITLE;
  const description = HOME_SEO_DESCRIPTION;
  const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE;
  return {
    title,
    description,
    keywords: [
      "Chennai jobs",
      "jobs in Chennai",
      "OMR jobs",
      "Tambaram jobs",
      "Velachery jobs",
      "Porur jobs",
      "hyperlocal jobs Chennai",
      "freshers jobs Chennai",
      "part time jobs Chennai",
      "Vacancy Chennai",
    ],
    alternates: { canonical: `${siteUrl}/` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/`,
      type: "website",
      locale: "en_IN",
      siteName: "Vacancy Chennai",
      ...(ogImage ? { images: [{ url: ogImage, alt: "Vacancy Chennai — hyperlocal jobs" }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

