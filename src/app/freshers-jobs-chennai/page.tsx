import JobCard from "@/components/job-card";
import { getPublishedJobs } from "@/features/core/mock-db";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "Freshers Jobs Chennai",
  "Entry-level and fresher jobs in Chennai.",
  "/freshers-jobs-chennai",
);

export default function FreshersJobsChennaiPage() {
  const jobs = getPublishedJobs().filter((job) => job.salaryMin <= 25000);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Freshers Jobs in Chennai</h1>
      <p className="text-slate-700">
        Beginner-friendly roles for freshers and early-career candidates.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}

