import { updateJobStatusAction } from "@/features/jobs/actions";
import { applications, auditLogs, jobs } from "@/features/core/mock-db";
import { requireRole } from "@/lib/auth";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: Props) {
  await requireRole("admin", "/admin/login");
  const query = await searchParams;

  const pendingJobs = jobs.filter((job) => job.status === "review");
  const publishedJobs = jobs.filter((job) => job.status === "published");

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded border p-3">
            <p className="text-sm text-slate-600">Published jobs</p>
            <p className="text-2xl font-bold">{publishedJobs.length}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-sm text-slate-600">Pending moderation</p>
            <p className="text-2xl font-bold">{pendingJobs.length}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-sm text-slate-600">Applications</p>
            <p className="text-2xl font-bold">{applications.length}</p>
          </div>
        </div>
        {query.success && (
          <p className="mt-3 rounded bg-green-100 px-3 py-2 text-sm text-green-800">
            Job status updated.
          </p>
        )}
        {query.error && (
          <p className="mt-3 rounded bg-red-100 px-3 py-2 text-sm text-red-800">
            Could not update job status.
          </p>
        )}
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Moderation queue</h2>
        {pendingJobs.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">No jobs in review queue.</p>
        )}
        <div className="mt-3 space-y-3">
          {pendingJobs.map((job) => (
            <div key={job.id} className="rounded border p-3">
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-slate-600">{job.category}</p>
              <form action={updateJobStatusAction} className="mt-2 flex gap-2">
                <input type="hidden" name="jobId" value={job.id} />
                <button
                  className="rounded bg-green-600 px-3 py-1 text-sm text-white"
                  name="status"
                  value="published"
                  type="submit"
                >
                  Publish
                </button>
                <button
                  className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
                  name="status"
                  value="paused"
                  type="submit"
                >
                  Pause
                </button>
                <button
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                  name="status"
                  value="closed"
                  type="submit"
                >
                  Close
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Audit logs</h2>
        {auditLogs.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">No audit logs yet.</p>
        )}
        <div className="mt-3 space-y-2">
          {auditLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="rounded border p-2 text-sm">
              <p>
                {log.action} {log.entityType} {log.entityId}
              </p>
              <p className="text-slate-500">
                {log.actorRole} · {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

