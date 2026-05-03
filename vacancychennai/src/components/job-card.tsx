import Link from "next/link";
import { getEmployerById, getLocationById } from "@/features/core/mock-db";
import { Job } from "@/types/domain";
import { btnPrimary, cardInteractive, cardSurface, focusRing, pillMeta, transitionFast } from "@/lib/ui";

type Props = {
  job: Job;
  variant?: "default" | "spotlight";
  /** When jobs come from Postgres, pass labels — mock IDs won’t resolve in mock-db helpers. */
  employerCompanyName?: string;
  locationArea?: string;
  locationZone?: string;
};

export default function JobCard({
  job,
  variant = "default",
  employerCompanyName,
  locationArea,
  locationZone,
}: Props) {
  const location =
    locationArea != null
      ? { area: locationArea, zone: locationZone ?? "" }
      : getLocationById(job.locationId);
  const employerName =
    employerCompanyName ?? getEmployerById(job.employerId)?.companyName ?? "Local employer";
  const spotlight = variant === "spotlight";

  const surface = spotlight
    ? `${cardSurface} border-amber-200/90 bg-white ring-1 ring-amber-100/80 ${cardInteractive} border-l-4 border-l-amber-400 motion-reduce:hover:translate-y-0`
    : `${cardSurface} ${cardInteractive} motion-reduce:hover:translate-y-0`;

  return (
    <article className={surface}>
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">{employerName}</p>
            <h3 className="mt-0.5 text-lg font-semibold text-slate-900">
              <Link
                href={`/jobs/${job.id}`}
                className={`text-inherit hover:underline ${focusRing} rounded-sm`}
                data-cta={`job-title-${job.id}`}
              >
                {job.title}
              </Link>
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={pillMeta}>{job.category}</span>
              <span className={pillMeta}>{job.industry}</span>
            </div>
          </div>
          {job.featured && (
            <span className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-warning-bg)] px-2 py-1 text-xs font-semibold text-[var(--color-warning-text)] ring-1 ring-amber-200/80">
              Featured
            </span>
          )}
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-700">
            {location ? `${location.area}, ${location.zone}` : "Chennai"}
          </p>
          <p className="text-sm text-slate-600">{job.landmarkText}</p>
          <p className="mt-2 font-medium tabular-nums text-slate-900">
            <span className="text-slate-500">INR </span>
            {job.salaryMin.toLocaleString("en-IN")} – {job.salaryMax.toLocaleString("en-IN")}
            <span className="text-slate-500"> · {job.jobType}</span>
          </p>
        </div>
        <div className="mt-4">
          <Link
            href={`/jobs/${job.id}`}
            className={`${btnPrimary} text-sm ${transitionFast}`}
            data-cta={`job-view-${job.id}`}
          >
            View job
          </Link>
        </div>
      </div>
    </article>
  );
}
