import { logger } from "@/lib/logger";
import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";
import { isBillingEnforced } from "@/lib/billing/flags";
import { getSku } from "@/lib/billing/skus";

const LISTING_DAYS = 120;

export type PublishBillingResult =
  | { ok: true; billingSource: string }
  | { ok: false; reason: "no_entitlement" };

export async function getJobOwnerUserId(jobId: string): Promise<string | null> {
  const rows = await dbQuery<{ user_id: string }>(
    `select ep.user_id::text as user_id from jobs j
     inner join employer_profiles ep on ep.id = j.employer_id
     where j.id = $1::uuid limit 1`,
    [jobId],
  );
  return rows[0]?.user_id ?? null;
}

async function hasExistingUsage(jobId: string): Promise<boolean> {
  const rows = await dbQuery<{ one: number }>(
    `select 1 as one from entitlement_usages where job_id = $1::uuid limit 1`,
    [jobId],
  );
  return rows.length > 0;
}

async function countPublishedForUser(ownerUserId: string): Promise<number> {
  const rows = await dbQuery<{ c: string }>(
    `select count(*)::text as c from jobs j
     inner join employer_profiles ep on ep.id = j.employer_id
     where ep.user_id = $1::uuid and j.status = 'published'`,
    [ownerUserId],
  );
  return Number(rows[0]?.c ?? 0);
}

function parseRef(ref: string | null): Record<string, unknown> {
  if (!ref) return {};
  try {
    return JSON.parse(ref) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function getActiveMonthlyPass(ownerUserId: string) {
  const rows = await dbQuery<{
    id: string;
    entitlement_ref: string | null;
    ends_at: string | null;
  }>(
    `select id, entitlement_ref, ends_at::text as ends_at from entitlements
     where owner_user_id = $1::uuid and status = 'active' and entitlement_type = 'monthly_pass'
     and (ends_at is null or ends_at > now())
     order by coalesce(ends_at, 'infinity'::timestamptz) desc
     limit 1`,
    [ownerUserId],
  );
  return rows[0] ?? null;
}

async function nextCreditEntitlement(ownerUserId: string) {
  const rows = await dbQuery<{ id: string; entitlement_type: string; entitlement_ref: string | null }>(
    `select e.id, e.entitlement_type, e.entitlement_ref
     from entitlements e
     where e.owner_user_id = $1::uuid and e.status = 'active'
       and e.entitlement_type in ('post_credit', 'volume_pack')
       and (e.ends_at is null or e.ends_at > now())
       and coalesce((e.entitlement_ref::jsonb->>'credits')::int, 0) >
           (select count(*)::int from entitlement_usages eu where eu.entitlement_id = e.id)
     order by e.created_at asc
     limit 1`,
    [ownerUserId],
  );
  return rows[0] ?? null;
}

/**
 * When admin publishes: consume entitlement (if enforced) or mark waived.
 * Idempotent if entitlement_usages already has this job_id.
 */
export async function resolvePublishBilling(jobId: string): Promise<PublishBillingResult> {
  if (!hasDatabase()) {
    return { ok: true, billingSource: "waived" };
  }
  if (!isBillingEnforced()) {
    return { ok: true, billingSource: "waived" };
  }

  const ownerUserId = await getJobOwnerUserId(jobId);
  if (!ownerUserId) {
    return { ok: false, reason: "no_entitlement" };
  }

  if (await hasExistingUsage(jobId)) {
    return { ok: true, billingSource: "republish" };
  }

  const pass = await getActiveMonthlyPass(ownerUserId);
  if (pass) {
    const ref = parseRef(pass.entitlement_ref);
    const maxLive = typeof ref.max_live_posts === "number" ? ref.max_live_posts : 2;
    const live = await countPublishedForUser(ownerUserId);
    if (live < maxLive) {
      await dbExecute(
        `insert into entitlement_usages (entitlement_id, job_id, owner_user_id)
         values ($1::uuid, $2::uuid, $3::uuid)`,
        [pass.id, jobId, ownerUserId],
      );
      return { ok: true, billingSource: "monthly_pass" };
    }
  }

  const credit = await nextCreditEntitlement(ownerUserId);
  if (credit) {
    await dbExecute(
      `insert into entitlement_usages (entitlement_id, job_id, owner_user_id)
       values ($1::uuid, $2::uuid, $3::uuid)`,
      [credit.id, jobId, ownerUserId],
    );
    const src =
      credit.entitlement_type === "volume_pack" ? "volume_pack" : "post_credit";
    return { ok: true, billingSource: src };
  }

  return { ok: false, reason: "no_entitlement" };
}

/**
 * Grant entitlements for a paid `payment_orders` row (idempotent by `source_order_id`).
 */
export async function fulfillPaymentOrderById(
  orderId: string,
  providerPaymentId?: string | null,
): Promise<{ ok: boolean; error?: string }> {
  if (!hasDatabase()) return { ok: false, error: "no_database" };

  const orders = await dbQuery<{
    id: string;
    employer_id: string | null;
    status: string;
    entitlement_type: string | null;
    entitlement_ref: string | null;
    amount_paise: string;
  }>(
    `select id, employer_id::text, status, entitlement_type, entitlement_ref, amount_paise::text
     from payment_orders where id = $1::uuid limit 1`,
    [orderId],
  );
  const order = orders[0];
  if (!order) return { ok: false, error: "order_not_found" };
  if (order.status === "paid") return { ok: true };

  const ref = parseRef(order.entitlement_ref);
  const skuId = typeof ref.skuId === "string" ? ref.skuId : null;
  const sku = skuId ? getSku(skuId) : null;
  if (!sku || !order.employer_id) {
    logger.warn({ orderId }, "fulfill: missing sku or employer");
    return { ok: false, error: "invalid_order_metadata" };
  }

  const existingEnt = await dbQuery<{ id: string }>(
    `select id from entitlements where source_order_id = $1::uuid limit 1`,
    [order.id],
  );
  if (existingEnt.length === 0) {
    const refJson = JSON.stringify(sku.buildEntitlementRef());
    if (sku.entitlementType === "monthly_pass" || sku.entitlementType === "volume_pack") {
      await dbExecute(
        `insert into entitlements (owner_user_id, entitlement_type, entitlement_ref, source_order_id, status, starts_at, ends_at)
         values ($1::uuid, $2, $3::text, $4::uuid, 'active', now(), now() + interval '30 days')`,
        [order.employer_id, sku.entitlementType, refJson, order.id],
      );
    } else {
      await dbExecute(
        `insert into entitlements (owner_user_id, entitlement_type, entitlement_ref, source_order_id, status, starts_at, ends_at)
         values ($1::uuid, $2, $3::text, $4::uuid, 'active', now(), null)`,
        [order.employer_id, sku.entitlementType, refJson, order.id],
      );
    }
  }

  const payId = (providerPaymentId ?? `superprofile_${Date.now()}`).slice(0, 140);
  await dbExecute(
    `update payment_orders set status = 'paid', updated_at = now(), provider_payment_id = $2
     where id = $1::uuid`,
    [order.id, payId],
  );

  return { ok: true };
}

export async function employerEligibleForPremiumTier(employerUserId: string): Promise<boolean> {
  if (!hasDatabase() || !isBillingEnforced()) return true;
  const pass = await getActiveMonthlyPass(employerUserId);
  if (pass) return true;
  return !!(await nextCreditEntitlement(employerUserId));
}

export { LISTING_DAYS };
