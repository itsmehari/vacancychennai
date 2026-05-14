import DashboardWelcome from "@/components/layout/dashboard-welcome";
import { auditLogs } from "@/features/core/mock-db";
import { countApplications, listAllJobs } from "@/features/core/repository";
import { grantEmployerPostCreditFromJobAction } from "@/features/billing/admin-grant-action";
import { markSuperProfileOrderPaidAction } from "@/features/billing/mark-superprofile-paid-action";
import { listPendingSuperProfileOrders } from "@/features/billing/payment-order-queries";
import { updateJobStatusAction } from "@/features/jobs/actions";
import { requireRole } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { btnDenseDanger, btnDenseNeutral, btnDenseSuccess, sectionCard } from "@/lib/ui";

type Props = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: Props) {
  await requireRole("admin", "/admin/login");
  const query = await searchParams;

  const allJobs = await listAllJobs();
  const appCount = await countApplications();
  const pendingPayments = hasDatabase() ? await listPendingSuperProfileOrders(30) : [];

  const pendingJobs = allJobs.filter((job) => job.status === "review");
  const publishedJobs = allJobs.filter((job) => job.status === "published");

  return (
    <div className="space-y-6">
      <DashboardWelcome title="Admin dashboard">
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/60 p-4">
            <p className="text-sm font-medium text-slate-600">Published jobs</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{publishedJobs.length}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-slate-200/90 bg-amber-50/50 p-4">
            <p className="text-sm font-medium text-slate-600">Pending moderation</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{pendingJobs.length}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/60 p-4">
            <p className="text-sm font-medium text-slate-600">Applications</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{appCount}</p>
          </div>
        </div>
        {query.success === "grant-credit" ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
            Granted one free publish credit to the employer for that job.
          </p>
        ) : query.success === "payment-marked-paid" ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
            SuperProfile order marked paid — entitlements granted.
          </p>
        ) : query.success ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
            Job status updated.
          </p>
        ) : null}
        {query.error === "no-entitlement" ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            This employer has no publish credits or active pass (when <code className="text-xs">BILLING_ENFORCED</code>{" "}
            is on). Grant a credit or ask them to buy a plan.
          </p>
        ) : query.error?.startsWith("fulfill-") ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            Could not mark that payment (already paid, missing SKU, or invalid order).
          </p>
        ) : query.error === "invalid-order" ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            Invalid payment order id.
          </p>
        ) : query.error === "no-db" ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            Database not configured for this action.
          </p>
        ) : query.error ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-100">
            Could not complete that action.
          </p>
        ) : null}
      </DashboardWelcome>

      {hasDatabase() && pendingPayments.length > 0 ? (
        <section className={sectionCard}>
          <h2 className="text-xl font-semibold text-slate-900">SuperProfile — pending checkouts</h2>
          <p className="mt-2 text-sm text-slate-600">
            Employers opened a SuperProfile link but payment is not recorded yet. After you confirm payment in
            SuperProfile (same email as Vacancy Chennai), mark paid to grant credits.
          </p>
          <div className="mt-3 space-y-3">
            {pendingPayments.map((row) => {
              let skuLabel = "—";
              try {
                const ref = JSON.parse(row.entitlement_ref ?? "{}") as { skuId?: string };
                skuLabel = ref.skuId ?? "—";
              } catch {
                /* ignore */
              }
              const rupees = (Number(row.amount_paise) / 100).toFixed(0);
              return (
                <div
                  key={row.id}
                  className="rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/40 p-4 text-sm"
                >
                  <p className="font-mono text-xs text-slate-700">Order id: {row.id}</p>
                  <p className="mt-1 text-slate-800">
                    SKU: <strong>{skuLabel}</strong> · ₹{rupees} · {row.employer_email ?? "—"} (
                    {row.employer_name ?? "—"})
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Created {row.created_at}</p>
                  <form action={markSuperProfileOrderPaidAction} className="mt-2">
                    <input type="hidden" name="orderId" value={row.id} />
                    <button type="submit" className={btnDenseSuccess}>
                      Mark paid &amp; grant
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className={sectionCard}>
        <h2 className="text-xl font-semibold text-slate-900">Moderation queue</h2>
        {pendingJobs.length === 0 && (
          <p className="mt-2 text-sm text-slate-600">No jobs in review queue.</p>
        )}
        <div className="mt-3 space-y-3">
          {pendingJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/40 p-4"
            >
              <p className="font-semibold text-slate-900">{job.title}</p>
              <p className="text-sm text-slate-600">{job.category}</p>
              <form action={updateJobStatusAction} className="mt-3 flex flex-wrap gap-2">
                <input type="hidden" name="jobId" value={job.id} />
                <button className={btnDenseSuccess} name="status" value="published" type="submit">
                  Publish
                </button>
                <button className={btnDenseNeutral} name="status" value="paused" type="submit">
                  Pause
                </button>
                <button className={btnDenseDanger} name="status" value="closed" type="submit">
                  Close
                </button>
              </form>
              {hasDatabase() ? (
                <form action={grantEmployerPostCreditFromJobAction} className="mt-2">
                  <input type="hidden" name="jobId" value={job.id} />
                  <button
                    type="submit"
                    className="text-xs font-semibold text-blue-700 underline-offset-2 hover:underline"
                  >
                    Grant 1 free publish credit (employer)
                  </button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {!hasDatabase() ? (
        <section className={sectionCard}>
          <h2 className="text-xl font-semibold text-slate-900">Audit logs</h2>
          {auditLogs.length === 0 && (
            <p className="mt-2 text-sm text-slate-600">No audit logs yet.</p>
          )}
          <div className="mt-3 space-y-2">
            {auditLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="rounded-[var(--radius-md)] border border-slate-200/80 bg-white p-3 text-sm"
              >
                <p className="text-slate-800">
                  {log.action} {log.entityType} {log.entityId}
                </p>
                <p className="text-slate-500">
                  {log.actorRole} · {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className={sectionCard}>
          <h2 className="text-xl font-semibold text-slate-900">Audit logs</h2>
          <p className="mt-2 text-sm text-slate-600">
            Audit entries are stored in the database; a read UI can query `audit_logs` in a follow-up.
          </p>
        </section>
      )}
    </div>
  );
}
