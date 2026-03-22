import JobCard from "@/components/job-card";
import { getPublishedJobs } from "@/features/core/mock-db";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata(
  "Part-time Jobs Chennai",
  "Find part-time and flexible jobs in Chennai.",
  "/part-time-jobs-chennai",
);

export default function PartTimeJobsChennaiPage() {
  const jobs = getPublishedJobs().filter((job) => job.jobType === "part-time");

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Part-time Jobs in Chennai</h1>
      <p className="text-slate-700">
        Local part-time hiring opportunities for students and flexible workers.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}

