import type { MetadataRoute } from "next";
import { absoluteUrl, getCanonicalSiteBase } from "@/lib/site-base-url";

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteBase();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/candidate/dashboard",
        "/employer/dashboard",
        "/employer/billing",
        "/employer/resume-database",
        "/employer/forgot-password",
        "/employer/reset-password",
        "/admin/forgot-password",
        "/admin/reset-password",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(base).host,
  };
}
