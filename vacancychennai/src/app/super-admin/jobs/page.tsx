import { listAllJobs, listLocations } from "@/features/core/repository";
import { curatedPublishedJobs } from "@/features/core/static-curated-jobs";
import { isSuperAdmin } from "@/lib/super-admin-session";
import { sectionCard } from "@/lib/ui";
import type { Job } from "@/types/domain";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jobs | Super admin",
  robots: { index: false, follow: false },
};

export default async function SuperAdminJobsPage() {
  if (!(await isSuperAdmin())) redirect("/super-admin/login");
  const [dbJobs, locations] = await Promise.all([listAllJobs(), listLocations()]);
  const areaById = new Map(locations.map((location) => [location.id, location.area]));
  const seen = new Set(dbJobs.map((job) => job.id));
  const rows: { job: Job; source: string }[] = [
    ...dbJobs.map((job) => ({ job, source: "Record" })),
    ...curatedPublishedJobs
      .filter((job) => !seen.has(job.id))
      .map((job) => ({ job, source: "Catalog" })),
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Jobs</h1>
        <p className="mt-1 text-sm text-slate-600">
          {rows.length} listings. Publish and pause stay on the moderation dashboard at /admin. This list is
          for review.
        </p>
      </div>
      <div className={`${sectionCard} overflow-x-auto`}>
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="py-2 pr-3 font-medium">Title</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Area</th>
              <th className="py-2 pr-3 font-medium">Type</th>
              <th className="py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ job, source }) => (
              <tr key={`${source}-${job.id}`} className="border-t border-slate-100">
                <td className="py-2 pr-3">
                  <Link href={`/jobs/${job.id}`} className="font-medium text-blue-700 hover:text-blue-900">
                    {job.title}
                  </Link>
                  <p className="text-xs text-slate-500">{job.category}</p>
                </td>
                <td className="py-2 pr-3">{job.status}</td>
                <td className="py-2 pr-3">{areaById.get(job.locationId) ?? job.locationId}</td>
                <td className="py-2 pr-3">{job.jobType}</td>
                <td className="py-2">{source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
