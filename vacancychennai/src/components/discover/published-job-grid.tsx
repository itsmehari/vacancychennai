import JobCard from "@/components/job-card";
import type { Job, Location } from "@/types/domain";
import Link from "next/link";
import { btnPrimary, sectionCard } from "@/lib/ui";

const VISIBLE_CAP = 24;

export function PublishedJobGrid({
  jobs,
  locationsById,
  employerNames,
  listLabel,
  listingSource,
}: {
  jobs: Job[];
  locationsById: Map<string, Location>;
  employerNames: Map<string, string>;
  listLabel: string;
  listingSource?: string;
}) {
  if (jobs.length === 0) {
    return (
      <div className={`${sectionCard} text-center`}>
        <p className="font-medium text-slate-900">No matching listings right now</p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
          {listLabel} updates when a moderated job is published. The full board still has other roles.
        </p>
        <Link href="/jobs-in-chennai" className={`mt-5 inline-flex ${btnPrimary}`}>
          Browse all Chennai jobs
        </Link>
      </div>
    );
  }

  const visible = jobs.slice(0, VISIBLE_CAP);
  return (
    <div>
      <p className="mb-4 text-sm text-slate-600">
        Showing {visible.length} of {jobs.length} published {jobs.length === 1 ? "listing" : "listings"}.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((job) => {
          const loc = locationsById.get(job.locationId);
          return (
            <JobCard
              key={job.id}
              job={job}
              employerCompanyName={employerNames.get(job.employerId)}
              locationArea={loc?.area}
              locationZone={loc?.zone}
              listingSource={listingSource}
            />
          );
        })}
      </div>
      {jobs.length > VISIBLE_CAP ? (
        <p className="mt-4 text-sm text-slate-600">
          <Link href="/jobs-in-chennai" className="font-semibold text-blue-700 hover:underline">
            Search the full board
          </Link>{" "}
          for more than these {VISIBLE_CAP}.
        </p>
      ) : null}
    </div>
  );
}
