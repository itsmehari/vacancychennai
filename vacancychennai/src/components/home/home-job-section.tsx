import Link from "next/link";
import JobCard from "@/components/job-card";
import type { Job } from "@/types/domain";
import { linkInline } from "@/lib/ui";

type Props = {
  sectionId: string;
  title: string;
  description?: string;
  jobs: Job[];
  viewAllHref: string;
  dataCtaViewAll: string;
};

export default function HomeJobSection({
  sectionId,
  title,
  description,
  jobs,
  viewAllHref,
  dataCtaViewAll,
}: Props) {
  if (jobs.length === 0) return null;

  const headingId = `home-jobs-${sectionId}`;

  return (
    <section className="space-y-6" aria-labelledby={headingId}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id={headingId}
            className="text-2xl font-semibold tracking-tight text-slate-900"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
          ) : null}
        </div>
        <Link
          href={viewAllHref}
          className={`${linkInline} min-h-[44px] shrink-0 self-start py-2 text-sm sm:self-auto`}
          data-cta={dataCtaViewAll}
        >
          View all jobs
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
