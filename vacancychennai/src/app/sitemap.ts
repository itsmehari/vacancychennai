import type { MetadataRoute } from "next";
import { listLocations, listPublishedJobs } from "@/features/core/repository";
import { jobsInAreaPath } from "@/lib/area-job-path";
import { blogPosts } from "@/lib/blog-posts";
import { absoluteUrl } from "@/lib/site-base-url";

/** Google allows up to 50,000 URLs per sitemap file. */
const JOB_DETAIL_SITEMAP_CAP = 50_000;

type Freq = NonNullable<MetadataRoute.Sitemap[0]["changeFrequency"]>;

type StaticEntry = { path: string; changeFrequency: Freq; priority: number; lastModified?: Date };

/**
 * Indexable marketing and funnel pages (no `/admin/*`, dashboards, APIs, or auth recovery).
 * Paths are relative, starting with `/`.
 */
const STATIC_SITEMAP_PAGES: StaticEntry[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/jobs-in-chennai", changeFrequency: "daily", priority: 0.95 },
  { path: "/freshers-jobs-chennai", changeFrequency: "daily", priority: 0.88 },
  { path: "/part-time-jobs-chennai", changeFrequency: "daily", priority: 0.88 },
  { path: "/post-job", changeFrequency: "weekly", priority: 0.85 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.82 },
  { path: "/job-seeker-profile", changeFrequency: "weekly", priority: 0.78 },
  { path: "/local-job-request-nanganallur", changeFrequency: "daily", priority: 0.74 },
  { path: "/subscribe", changeFrequency: "weekly", priority: 0.72 },
  { path: "/employer/login", changeFrequency: "monthly", priority: 0.7 },
  { path: "/employer/register", changeFrequency: "monthly", priority: 0.7 },
  { path: "/candidate/login", changeFrequency: "monthly", priority: 0.68 },
  { path: "/candidate/register", changeFrequency: "monthly", priority: 0.68 },
  { path: "/about", changeFrequency: "monthly", priority: 0.62 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.62 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.58 },
  { path: "/jobs.xml", changeFrequency: "hourly", priority: 0.55 },
  { path: "/rss.xml", changeFrequency: "hourly", priority: 0.52 },
  { path: "/llms.txt", changeFrequency: "daily", priority: 0.45 },
  { path: "/llms-full.txt", changeFrequency: "daily", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.35 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.35 },
];

function mergeSitemapEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const byUrl = new Map<string, MetadataRoute.Sitemap[0]>();
  for (const e of entries) {
    if (!e.url || byUrl.has(e.url)) continue;
    byUrl.set(e.url, e);
  }
  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_SITEMAP_PAGES.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: p.lastModified ?? now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const locations = await listLocations();
  const areaEntries: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: absoluteUrl(jobsInAreaPath(loc.area)),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.86,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.52,
  }));

  const publishedJobs = await listPublishedJobs();
  const jobEntries: MetadataRoute.Sitemap = publishedJobs.slice(0, JOB_DETAIL_SITEMAP_CAP).map((job) => ({
    url: absoluteUrl(`/jobs/${job.id}`),
    lastModified: new Date(Math.max(new Date(job.createdAt).getTime(), new Date(job.updatedAt).getTime())),
    changeFrequency: "weekly" as const,
    priority: 0.56,
  }));

  return mergeSitemapEntries([...staticEntries, ...areaEntries, ...blogEntries, ...jobEntries]);
}
