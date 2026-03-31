import type { Job } from "@/types/domain";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in";
}

/** ItemList for job catalog pages (SEO / rich results). */
export function buildJobsItemListJsonLd(jobs: Pick<Job, "id" | "title">[], listName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: jobs.length,
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl()}/jobs/${job.id}`,
      name: job.title,
    })),
  };
}
