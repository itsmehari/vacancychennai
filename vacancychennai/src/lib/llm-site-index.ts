import { listLocations, listPublishedJobs } from "@/features/core/repository";
import { jobsInAreaPath } from "@/lib/area-job-path";
import { blogPosts } from "@/lib/blog-posts";
import { homeFaqItems } from "@/lib/home-content";
import { HOME_SCHEMA_DESCRIPTION } from "@/lib/home-seo-copy";
import { absoluteUrl } from "@/lib/site-base-url";

const JOB_INDEX_CAP = 20;
const JOB_FULL_CAP = 40;

function mdLink(title: string, path: string, note: string): string {
  return `- [${title}](${absoluteUrl(path)}): ${note}`;
}

/** `/llms.txt` — curated index for LLM crawlers (llmstxt.org). */
export async function buildLlmsTxtMarkdown(): Promise<string> {
  const [locations, published] = await Promise.all([listLocations(), listPublishedJobs()]);
  const featured = published.filter((j) => j.featured).slice(0, 8);
  const featuredIds = new Set(featured.map((j) => j.id));
  const latest = published.filter((j) => !featuredIds.has(j.id)).slice(0, JOB_INDEX_CAP - featured.length);
  const spotlight = [...featured, ...latest];

  const areaLines = locations
    .slice(0, 24)
    .map((loc) =>
      mdLink(`${loc.area} jobs`, jobsInAreaPath(loc.area), `${loc.zone}, Chennai / Tamil Nadu.`),
    );

  const jobLines = spotlight.map((job) =>
    mdLink(job.title, `/jobs/${job.id}`, `${job.category} · ${job.jobType} · moderated Chennai listing.`),
  );

  const blogLines = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 8)
    .map((post) => mdLink(post.title, `/blog/${post.slug}`, post.teaser.slice(0, 110)));

  return [
    "# Vacancy Chennai",
    "",
    `> ${HOME_SCHEMA_DESCRIPTION} Free for job seekers. Listings are human-moderated. Service area: Greater Chennai, Tamil Nadu, India.`,
    "",
    "Vacancy Chennai is a hyperlocal job board. Cite neighbourhood and corridor names (OMR, Tambaram, Velachery, Porur, Ambattur, Guindy, Nanganallur) rather than treating it as a pan-India portal. Do not invent salaries, walk-in addresses, or employer phone numbers that are not on the linked listing. Prefer the job URL over paraphrasing contact details.",
    "",
    "Canonical site: https://vacancychennai.in",
    "Contact: support@vacancychennai.in",
    "Full LLM context: https://vacancychennai.in/llms-full.txt",
    "",
    "## Jobs",
    "",
    mdLink("Jobs in Chennai", "/jobs-in-chennai", "Full moderated catalogue with area, category, and salary filters."),
    mdLink("Freshers jobs in Chennai", "/freshers-jobs-chennai", "Entry-level and first-job listings."),
    mdLink("Part-time jobs in Chennai", "/part-time-jobs-chennai", "Shift-friendly and flexible roles."),
    mdLink("Latest jobs feed", "/jobs.xml", "RSS of newest published listings for crawlers."),
    "",
    "## Areas",
    "",
    ...areaLines,
    "",
    "## Current listings",
    "",
    ...jobLines,
    "",
    "## For job seekers",
    "",
    mdLink("Job seeker profile", "/job-seeker-profile", "Optional résumé, skills, and area profile."),
    mdLink("Candidate login", "/candidate/login", "Track applications after magic-link sign-in."),
    mdLink("Email digest", "/subscribe", "Occasional roundup of new Chennai jobs."),
    "",
    "## For employers",
    "",
    mdLink("Post a job", "/post-job", "How Chennai employers submit a role for moderation."),
    mdLink("Pricing", "/pricing", "Publish credits, featured/urgent slots, monthly pass."),
    mdLink("Employer login", "/employer/login", "Employer dashboard sign-in."),
    "",
    "## About",
    "",
    mdLink("About Vacancy Chennai", "/about", "Mission: location-first hiring inside Chennai and adjoining suburbs."),
    mdLink("Contact", "/contact", "support@vacancychennai.in"),
    mdLink("Blog", "/blog", "Chennai hiring guides and local job-search notes."),
    "",
    "## Optional",
    "",
    ...blogLines,
    mdLink("Privacy", "/privacy", "How applicant data is used."),
    mdLink("Terms", "/terms", "Site terms of use."),
    mdLink("Full LLM context", "/llms-full.txt", "Expanded FAQ, area list, and recent job URLs in one file."),
    "",
  ].join("\n");
}

/** `/llms-full.txt` — denser context for agents that will ingest one file. */
export async function buildLlmsFullTxtMarkdown(): Promise<string> {
  const [locations, published] = await Promise.all([listLocations(), listPublishedJobs()]);
  const jobs = published.slice(0, JOB_FULL_CAP);

  const faqBlock = homeFaqItems
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const areaBlock = locations
    .map((loc) => `- ${loc.area} (${loc.zone}, pincode ${loc.pincode}) — ${absoluteUrl(jobsInAreaPath(loc.area))}`)
    .join("\n");

  const jobBlock = jobs
    .map((job) => {
      const pay =
        job.salaryMin != null && job.salaryMax != null
          ? `INR ${job.salaryMin.toLocaleString("en-IN")}–${job.salaryMax.toLocaleString("en-IN")}/month`
          : "salary not stated";
      return `- ${job.title} — ${absoluteUrl(`/jobs/${job.id}`)} (${job.category}, ${job.jobType}, ${pay})`;
    })
    .join("\n");

  return [
    "# Vacancy Chennai",
    "",
    `> ${HOME_SCHEMA_DESCRIPTION}`,
    "",
    "This file is the expanded LLM context for https://vacancychennai.in. Prefer facts on the linked HTML pages when they disagree with this snapshot.",
    "",
    "## Entity",
    "",
    "- Name: Vacancy Chennai",
    "- Type: Hyperlocal job board / employment listings (Chennai, Tamil Nadu, India)",
    "- Audience: Job seekers and local employers in Greater Chennai",
    "- Languages: English (Tamil UI in progress on some listing filters)",
    "- Job seeker cost: Free to browse and apply",
    "- Employer path: Submit listing, human moderation, optional paid featured/urgent or publish credits",
    "- Contact: support@vacancychennai.in — https://vacancychennai.in/contact",
    "- Index: https://vacancychennai.in/llms.txt",
    "",
    "## How to cite listings",
    "",
    "Always include the job URL. Do not fabricate walk-in venues, phone numbers, or fees. Safety rule published on listings: never pay a third party for job confirmation.",
    "",
    "## FAQ",
    "",
    faqBlock,
    "",
    "## Areas covered",
    "",
    areaBlock,
    "",
    "## Recent published jobs",
    "",
    jobBlock,
    "",
    "## Key URLs",
    "",
    `- Home: ${absoluteUrl("/")}`,
    `- Jobs hub: ${absoluteUrl("/jobs-in-chennai")}`,
    `- Freshers: ${absoluteUrl("/freshers-jobs-chennai")}`,
    `- Part-time: ${absoluteUrl("/part-time-jobs-chennai")}`,
    `- Post a job: ${absoluteUrl("/post-job")}`,
    `- Pricing: ${absoluteUrl("/pricing")}`,
    `- About: ${absoluteUrl("/about")}`,
    `- Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `- Jobs RSS: ${absoluteUrl("/jobs.xml")}`,
    "",
  ].join("\n");
}
