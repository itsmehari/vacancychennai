import { AdminNav } from "@/components/admin/admin-nav";
import { grantEmployerPostCreditFromJobAction } from "@/features/billing/admin-grant-action";
import { listAllJobs, listLocations } from "@/features/core/repository";
import { curatedPublishedJobs } from "@/features/core/static-curated-jobs";
import { updateJobStatusAction } from "@/features/jobs/actions";
import { requireRole } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { isDatabaseUuid } from "@/lib/is-database-uuid";
import {
  btnDenseDanger,
  btnDenseNeutral,
  btnDenseSuccess,
  sectionCard,
} from "@/lib/ui";
import type { Job } from "@/types/domain";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jobs | Admin | Vacancy Chennai",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function AdminJobsPage({ searchParams }: Props) {
  await requireRole("admin", "/admin/login");
  const query = await searchParams;
  const [dbJobs, locations] = await Promise.all([listAllJobs(), listLocations()]);
  const areaById = new Map(locations.map((location) => [location.id, location.area]));
  const seen = new Set(dbJobs.map((job) => job.id));
  const rows: { job: Job; source: "Record" | "Catalog"; manageable: boolean }[] = [
    ...dbJobs.map((job) => ({
      job,
      source: "Record" as const,
      manageable: !hasDatabase() || isDatabaseUuid(job.id),
    })),
    ...curatedPublishedJobs
      .filter((job) => !seen.has(job.id))
      .map((job) => ({ job, source: "Catalog" as const, manageable: false })),
  ];

  return (
    <div className="space-y-4">
      <AdminNav />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Job posts</h1>
        <p className="mt-1 text-sm text-slate-600">
          {rows.length} listings. Publish, pause, or close database records from here.
        </p>
      </div>
      {query.success === "grant-credit" ? (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100"
        >
          Granted one free publish credit to the employer for that job.
        </p>
      ) : query.success ? (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100"
        >
          Job status updated.
        </p>
      ) : null}
      {query.error === "no-entitlement" ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
          This employer has no publish credits or active pass. Grant a credit or ask them to buy a plan.
        </p>
      ) : query.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
          Could not complete that action.
        </p>
      ) : null}
      <ul className="space-y-3">
        {rows.map(({ job, source, manageable }) => (
          <li key={`${source}-${job.id}`} className={sectionCard}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-base font-semibold text-blue-700 hover:text-blue-900"
                >
                  {job.title}
                </Link>
                <p className="text-sm text-slate-600">{job.category}</p>
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {job.status} · {source}
              </p>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {areaById.get(job.locationId) ?? job.locationId} · {job.jobType}
            </p>
            {manageable ? (
              <div className="mt-3 space-y-2">
                <form action={updateJobStatusAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="jobId" value={job.id} />
                  <input type="hidden" name="returnTo" value="/admin/jobs" />
                  {job.status !== "published" ? (
                    <button className={btnDenseSuccess} name="status" value="published" type="submit">
                      Publish
                    </button>
                  ) : null}
                  {job.status !== "paused" ? (
                    <button className={btnDenseNeutral} name="status" value="paused" type="submit">
                      Pause
                    </button>
                  ) : null}
                  {job.status !== "closed" ? (
                    <button className={btnDenseDanger} name="status" value="closed" type="submit">
                      Close
                    </button>
                  ) : null}
                  {job.status === "closed" || job.status === "paused" ? (
                    <button className={btnDenseNeutral} name="status" value="review" type="submit">
                      Back to review
                    </button>
                  ) : null}
                </form>
                {hasDatabase() ? (
                  <form action={grantEmployerPostCreditFromJobAction}>
                    <input type="hidden" name="jobId" value={job.id} />
                    <input type="hidden" name="returnTo" value="/admin/jobs" />
                    <button
                      type="submit"
                      className="text-xs font-semibold text-blue-700 underline-offset-2 hover:underline"
                    >
                      Grant 1 free publish credit (employer)
                    </button>
                  </form>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">Catalog-only listing — status is fixed in code.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
