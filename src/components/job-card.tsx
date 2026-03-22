import Link from "next/link";
import { getLocationById } from "@/features/core/mock-db";
import { Job } from "@/types/domain";
import { btnPrimary, cardInteractive, cardSurface } from "@/lib/ui";

type Props = {
  job: Job;
};

export default function JobCard({ job }: Props) {
  const location = getLocationById(job.locationId);

  return (
    <article
      className={`${cardSurface} p-4 md:p-5 ${cardInteractive} motion-reduce:hover:translate-y-0`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
          <p className="text-sm text-slate-600">
            {job.category} · {job.industry}
          </p>
        </div>
        {job.featured && (
          <span className="rounded-[var(--radius-sm)] bg-[var(--color-warning-bg)] px-2 py-1 text-xs font-semibold text-[var(--color-warning-text)] ring-1 ring-amber-200/80">
            Featured
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-slate-700">
        {location?.area}, {location?.zone}
      </p>
      <p className="text-sm text-slate-700">{job.landmarkText}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">
        INR {job.salaryMin.toLocaleString()} - INR {job.salaryMax.toLocaleString()} ·{" "}
        {job.jobType}
      </p>
      <div className="mt-4">
        <Link href={`/jobs/${job.id}`} className={`${btnPrimary} text-sm`} data-cta={`job-view-${job.id}`}>
          View job
        </Link>
      </div>
    </article>
  );
}
