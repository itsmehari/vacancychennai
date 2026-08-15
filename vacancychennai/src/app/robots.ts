import type { MetadataRoute } from "next";
import { absoluteUrl, getCanonicalSiteBase } from "@/lib/site-base-url";

const PRIVATE_PATHS = [
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
];

/** Answer / generative engines — same public allow list as Googlebot; private paths stay closed. */
const AI_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "GoogleOther",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
  "Amazonbot",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  const base = getCanonicalSiteBase();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_USER_AGENTS,
        allow: ["/", "/llms.txt", "/llm.txt", "/llms-full.txt"],
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(base).host,
  };
}
