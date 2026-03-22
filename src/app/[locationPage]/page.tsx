import { Metadata } from "next";
import { notFound } from "next/navigation";
import JobCard from "@/components/job-card";
import { getPublishedJobsByLocationSlug } from "@/features/core/mock-db";
import { baseMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locationPage: string }>;
};

function getSlugFromPath(path: string) {
  if (!path.startsWith("jobs-in-")) return null;
  return path.replace("jobs-in-", "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locationPage } = await params;
  const slug = getSlugFromPath(locationPage);
  if (!slug) {
    return baseMetadata("Page not found", "Invalid route", `/${locationPage}`);
  }
  const pretty = slug.replaceAll("-", " ");
  return baseMetadata(
    `Jobs in ${pretty} - Vacancy Chennai`,
    `Find latest full-time, part-time, and fresher jobs in ${pretty}, Chennai.`,
    `/${locationPage}`,
  );
}

export default async function AreaPage({ params }: Props) {
  const { locationPage } = await params;
  const slug = getSlugFromPath(locationPage);
  if (!slug) notFound();

  const jobs = getPublishedJobsByLocationSlug(slug);
  const readable = slug.replaceAll("-", " ");

  if (jobs.length === 0) {
    return (
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold capitalize">Jobs in {readable}</h1>
        <p className="mt-2 text-slate-700">
          No live listings right now. New jobs are posted daily on Vacancy Chennai.
        </p>
      </section>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Jobs in ${readable}`,
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in"}/jobs/${job.id}`,
      name: job.title,
    })),
  };

  return (
    <div className="space-y-5">
      <script
        type="application/ld+json"
        // Safe because the payload is internally generated and serialized.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold capitalize">Jobs in {readable}</h1>
        <p className="mt-2 text-slate-700">
          Explore location-first hiring in Chennai with quick apply.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </section>
    </div>
  );
}

