import { SuperProfileSkuButton } from "@/components/billing/superprofile-sku-button";
import DashboardWelcome from "@/components/layout/dashboard-welcome";
import { getActiveSeekerPass } from "@/features/billing/seeker-pass";
import { requireRole } from "@/lib/auth";
import { BILLING_SKUS } from "@/lib/billing/skus";
import { hasDatabase } from "@/lib/db";
import { btnSecondary, sectionCard } from "@/lib/ui";
import Link from "next/link";

const pass = BILLING_SKUS.seeker_pass;

export default async function CandidateBillingPage() {
  const session = await requireRole("candidate", "/candidate/login");
  const active = await getActiveSeekerPass(session.actorId);

  return (
    <div className="space-y-6">
      <DashboardWelcome title="Seeker pass" subtitle={`Signed in as ${session.displayName}`}>
        <p className="mt-2 text-sm text-slate-600">
          Reading listings and applying stay free. This pass turns on area and role alerts for 30 days.
        </p>
      </DashboardWelcome>
      <section className={sectionCard}>
        <h2 className="text-lg font-semibold text-slate-900">{pass.label}</h2>
        <p className="mt-2 text-3xl font-bold text-slate-900">₹{pass.amountPaise / 100}<span className="text-base font-semibold text-slate-600"> / month</span></p>
        <p className="mt-2 text-sm text-slate-600">{pass.shortDescription}</p>
        {active ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-950 ring-1 ring-emerald-100">
            Pass active{active.endsAt ? ` until ${active.endsAt}` : ""}.
          </p>
        ) : null}
        {hasDatabase() ? (
          <div className="mt-4">
            <SuperProfileSkuButton skuId={pass.id} label={`Pay ₹${pass.amountPaise / 100}`} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            Payments need the live database and SuperProfile checkout. Browsing stays available either way.
          </p>
        )}
        <p className="mt-4">
          <Link href="/candidate/dashboard" className={btnSecondary}>
            Back to dashboard
          </Link>
        </p>
      </section>
    </div>
  );
}
