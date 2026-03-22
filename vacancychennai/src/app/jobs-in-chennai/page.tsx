import JobCard from "@/components/job-card";
import { filterPublishedJobs } from "@/features/core/mock-db";
import { baseMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = baseMetadata(
  "Jobs in Chennai",
  "Latest jobs across Chennai and suburbs.",
  "/jobs-in-chennai",
);

type Props = {
  searchParams: Promise<{
    category?: string;
    jobType?: string;
    salaryMin?: string;
    salaryMax?: string;
    lang?: string;
  }>;
};

export default async function JobsInChennaiPage({ searchParams }: Props) {
  const query = await searchParams;
  const language = query.lang === "ta" ? "ta" : "en";
  const jobs = filterPublishedJobs({
    category: query.category,
    jobType: query.jobType,
    salaryMin: query.salaryMin ? Number(query.salaryMin) : undefined,
    salaryMax: query.salaryMax ? Number(query.salaryMax) : undefined,
  });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">
        {language === "ta" ? "சென்னையில் வேலைகள்" : "Jobs in Chennai"}
      </h1>
      <p className="text-slate-700">
        {language === "ta"
          ? "OMR, Velachery, Tambaram, Porur, Ambattur பகுதிகளில் வேலைகளை பார்க்கவும்."
          : "Browse hyperlocal jobs across OMR, Velachery, Tambaram, Porur, and Ambattur."}
      </p>
      <div className="flex gap-2 text-sm">
        <Link href="/jobs-in-chennai?lang=en" className="rounded border px-2 py-1">
          English
        </Link>
        <Link href="/jobs-in-chennai?lang=ta" className="rounded border px-2 py-1">
          Tamil
        </Link>
      </div>
      <form className="grid gap-2 rounded-lg border bg-white p-3 md:grid-cols-4">
        <input
          name="category"
          defaultValue={query.category}
          placeholder="Industry / category"
          className="rounded border px-3 py-2"
        />
        <select name="jobType" defaultValue={query.jobType ?? ""} className="rounded border px-3 py-2">
          <option value="">Any type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
        </select>
        <input
          name="salaryMin"
          defaultValue={query.salaryMin}
          type="number"
          placeholder="Min salary"
          className="rounded border px-3 py-2"
        />
        <input
          name="salaryMax"
          defaultValue={query.salaryMax}
          type="number"
          placeholder="Max salary"
          className="rounded border px-3 py-2"
        />
        <input type="hidden" name="lang" value={language} />
        <button className="rounded bg-blue-600 px-3 py-2 text-white md:col-span-4">
          Apply filters
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}

