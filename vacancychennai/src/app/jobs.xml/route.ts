import { NextResponse } from "next/server";
import { listPublishedJobs } from "@/features/core/repository";

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** Newest listings first; keeps feed fast for crawlers and aggregators. */
const FEED_CAP = 200;

export async function GET() {
  const site =
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL.trim()
      ? process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/$/, "")
      : "https://vacancychennai.in";

  const jobs = (await listPublishedJobs()).slice(0, FEED_CAP);

  const items = jobs
    .map((job) => {
      const url = `${site}/jobs/${job.id}`;
      const pub = new Date(job.createdAt);
      const pubDate = Number.isNaN(pub.getTime()) ? new Date().toUTCString() : pub.toUTCString();
      const title = `${job.title} — Chennai`;
      const desc = `${job.category} · ${job.industry}. INR ${job.salaryMin.toLocaleString("en-IN")}–${job.salaryMax.toLocaleString("en-IN")}/month.`;
      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(desc)}</description>
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vacancy Chennai — Latest job listings</title>
    <link>${escapeXml(site)}/jobs-in-chennai</link>
    <description>Moderated Chennai job postings — hyperlocal hiring board.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(site)}/jobs.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
