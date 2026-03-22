import { Metadata } from "next";

export function baseMetadata(
  title: string,
  description: string,
  path = "",
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
  const absolute = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: absolute },
    openGraph: {
      title,
      description,
      url: absolute,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Home page (`/`) — SEO-optimized title/description, OG, Twitter, optional share image. */
export function homePageMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
  const title = "Vacancy Chennai — Hyperlocal jobs near you in Chennai";
  const description =
    "Find Chennai jobs by area, category, and fresher or part-time tracks. Quick apply with name and phone. Employers: post local roles with moderation.";
  const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/`,
      type: "website",
      locale: "en_IN",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

