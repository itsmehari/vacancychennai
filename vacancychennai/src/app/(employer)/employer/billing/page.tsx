import Link from "next/link";
import DashboardWelcome from "@/components/layout/dashboard-welcome";
import { SuperProfileSkuButton } from "@/components/billing/superprofile-sku-button";
import { getEmployerBillingSummary } from "@/features/billing/employer-summary";
import { requireRole } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { BILLING_SKUS, listPublicSkus } from "@/lib/billing/skus";
import { sectionCard } from "@/lib/ui";

type Props = {
  searchParams: Promise<{ success?: string }>;
};

export default async function EmployerBillingPage({ searchParams }: Props) {
  const session = await requireRole("employer", "/employer/login");
  const query = await searchParams;
  const summary = await getEmployerBillingSummary(session.actorId);
  const skus = hasDatabase()
    ? listPublicSkus()
    : listPublicSkus().filter((s) => s.id !== BILLING_SKUS.post_overage.id);

  return (
    <div className="space-y-6">
      <DashboardWelcome title="Billing & credits" subtitle={`Signed in as ${session.displayName}`}>
        {query.success === "paid" ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 ring-1 ring-emerald-100">
            If you just paid on SuperProfile, refresh this page in a moment — credits appear after payment is
            confirmed. Still missing? Contact support with your order reference from below.
          </p>
        ) : null}
      </DashboardWelcome>

      <section className={sectionCard}>
        <h2 className="text-lg font-semibold text-slate-900">Your balance</h2>
        {!hasDatabase() || !summary ? (
          <p className="mt-2 text-sm text-slate-600">
            Connect a Postgres database (<code className="rounded bg-slate-100 px-1">DATABASE_URL</code>) and set
            SuperProfile payment URL (<code className="rounded bg-slate-100 px-1">SUPERPROFILE_PAYMENT_URL</code>) to buy
            credits. In local mock mode, publishing stays free.
          </p>
        ) : (
          <ul className="mt-3 list-inside list-disc text-sm text-slate-700">
            <li>
              Prepaid publishes remaining:{" "}
              <strong className="tabular-nums">{summary.prepaidPublishesRemaining}</strong>
            </li>
            <li>
              Monthly pass:{" "}
              {summary.monthlyPassActive ? (
                <>
                  active — up to <strong>{summary.maxLivePosts}</strong> live listings at a time
                  {summary.monthlyPassEndsAt ? (
                    <>
                      {" "}
                      (ends <time dateTime={summary.monthlyPassEndsAt}>{summary.monthlyPassEndsAt}</time>)
                    </>
                  ) : null}
                </>
              ) : (
                "not active"
              )}
            </li>
            <li>
              Live listings now:{" "}
              <strong className="tabular-nums">{summary.publishedLiveCount}</strong>
            </li>
          </ul>
        )}
        <p className="mt-3 text-sm text-slate-600">
          <Link href="/pricing" className="font-semibold text-blue-700 underline-offset-2 hover:underline">
            View full pricing & FAQ
          </Link>{" "}
          ·{" "}
          <Link href="/employer/dashboard" className="font-semibold text-blue-700 underline-offset-2 hover:underline">
            Back to dashboard
          </Link>
        </p>
      </section>

      {hasDatabase() ? (
        <section className={sectionCard}>
          <h2 className="text-lg font-semibold text-slate-900">Buy credits or a plan</h2>
          <p className="mt-2 text-sm text-slate-600">
            You will open a <strong>SuperProfile</strong> payment page in a new tab. Use the{" "}
            <strong>same email</strong> as your Vacancy Chennai employer account so fulfillment can match you.
            Credits apply when we publish your job.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skus.map((sku) => (
              <li
                key={sku.id}
                className="flex flex-col rounded-[var(--radius-md)] border border-slate-200/90 bg-slate-50/40 p-4"
              >
                <p className="font-medium text-slate-900">{sku.label}</p>
                <p className="mt-1 text-sm text-slate-600">{sku.shortDescription}</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  ₹{(sku.amountPaise / 100).toFixed(sku.amountPaise % 100 === 0 ? 0 : 2)}
                </p>
                <div className="mt-3">
                  <SuperProfileSkuButton skuId={sku.id} label={`Pay ₹${(sku.amountPaise / 100).toFixed(0)}`} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
