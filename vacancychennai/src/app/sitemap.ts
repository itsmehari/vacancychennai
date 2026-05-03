import type { MetadataRoute } from "next";
import { listLocations, listPublishedJobs } from "@/features/core/repository";
import { jobsInAreaPath } from "@/lib/area-job-path";
import { blogPosts } from "@/lib/blog-posts";

/** Google allows up to 50,000 URLs per sitemap file — include all published listings. */
const JOB_DETAIL_SITEMAP_CAP = 50_000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
  const now = new Date();

  const locations = await listLocations();
  const areaJobUrls: MetadataRoute.Sitemap = locations.map((loc) => ({
    url: `${base}${jobsInAreaPath(loc.area)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const publishedJobs = await listPublishedJobs();
  const jobDetailUrls: MetadataRoute.Sitemap = publishedJobs.slice(0, JOB_DETAIL_SITEMAP_CAP).map((job) => ({
    url: `${base}/jobs/${job.id}`,
    lastModified: new Date(
      Math.max(new Date(job.createdAt).getTime(), new Date(job.updatedAt).getTime()),
    ),
    changeFrequency: "weekly",
    priority: 0.55,
  }));

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/jobs-in-chennai`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...areaJobUrls,
    { url: `${base}/job-seeker-profile`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/freshers-jobs-chennai`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/part-time-jobs-chennai`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/post-job`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.55 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.55 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.55 },
    ...blogEntries,
    {
      url: `${base}/jobs.xml`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.65,
    },
    ...jobDetailUrls,
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
