import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/candidate/dashboard",
        "/employer/dashboard",
        "/employer/resume-database",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: new URL(base).host,
  };
}
