import type { Job, Location } from "@/types/domain";
import { pillMeta, sectionCard } from "@/lib/ui";

type Props = {
  job: Job;
  location: Location | null;
  employerName: string;
};

function postedLabel(iso: string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function JobAtAGlance({ job, location, employerName }: Props) {
  const pay =
    job.salaryMin != null && job.salaryMax != null
      ? `₹${job.salaryMin.toLocaleString("en-IN")}–₹${job.salaryMax.toLocaleString("en-IN")}`
      : "Ask the employer";

  const rows: { label: string; value: string }[] = [
    { label: "Employer", value: employerName },
    { label: "Type", value: job.jobType.replace("-", " ") },
    { label: "Location", value: location?.area ?? "Chennai" },
    { label: "Pay", value: pay },
    { label: "Listed", value: postedLabel(job.createdAt) },
  ];
  if (job.expiresAt) {
    rows.push({
      label: "Apply by",
      value: new Date(job.expiresAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
  }

  return (
    <section className={sectionCard} aria-labelledby="job-glance-heading">
      <h2 id="job-glance-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
        At a glance
      </h2>
      <dl className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-slate-500">{row.label}</dt>
            <dd className="text-right font-medium text-slate-900">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className={pillMeta}>{job.category}</span>
        {job.industry ? <span className={pillMeta}>{job.industry}</span> : null}
        {job.listingTier === "urgent" ? <span className={pillMeta}>Urgent</span> : null}
      </div>
    </section>
  );
}
