import Link from "next/link";
import type { Job, Location } from "@/types/domain";
import { focusRing, transitionFast } from "@/lib/ui";
import { SHOWCASE_HREF } from "./showcase-ctas";

type Props = {
  job: Job;
  employerName: string;
  location: Location;
  postedLabel: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ShowcaseJobCard({
  job,
  employerName,
  location,
  postedLabel,
}: Props) {
  const aboutSnippet =
    job.description.length > 160 ? `${job.description.slice(0, 157)}…` : job.description;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)] motion-reduce:transition-none">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-5 pb-4 md:p-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
            {job.title}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={SHOWCASE_HREF.applyJob(job.id)}
            className={`inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 ${focusRing} ${transitionFast}`}
            data-cta="showcase-apply"
          >
            Apply
          </Link>
          <Link
            href={SHOWCASE_HREF.postRole}
            className={`inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-amber-500 bg-white px-5 py-2 text-sm font-semibold text-amber-800 shadow-sm hover:bg-amber-50 ${focusRing} ${transitionFast}`}
            data-cta="showcase-post-role"
          >
            Post a role
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 px-5 pt-4 md:px-6">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 ring-1 ring-slate-200/80"
          aria-hidden
        >
          {initials(employerName)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{employerName}</p>
          <p className="text-sm text-slate-600">
            {location.area}, Chennai · {postedLabel}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 pt-4 md:p-6 md:pt-5">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
            About the job
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{aboutSnippet}</p>
        </div>
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Highlights
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
            <li>
              {job.category} · {job.industry}
            </li>
            <li className="mt-1">
              INR {job.salaryMin.toLocaleString("en-IN")} –{" "}
              {job.salaryMax.toLocaleString("en-IN")} · {job.jobType.replace("-", " ")}
            </li>
            <li className="mt-1">{job.landmarkText}</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
