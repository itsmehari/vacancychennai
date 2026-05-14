import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { dbExecute, hasDatabase } from "@/lib/db";
import { getSku } from "@/lib/billing/skus";
import { buildSuperProfileCheckoutUrl, getSuperProfilePaymentTemplate } from "@/lib/billing/superprofile-links";
import { incrementMetric } from "@/lib/metrics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "db_required" }, { status: 503 });
  }
  const session = await getSession();
  if (!session || session.role !== "employer") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { skuId?: string } | null;
  const skuId = String(body?.skuId ?? "");
  const sku = getSku(skuId);
  if (!sku) {
    return NextResponse.json({ error: "invalid_sku" }, { status: 400 });
  }

  const template = getSuperProfilePaymentTemplate();
  if (!template) {
    return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
  }

  const orderId = randomUUID();
  const orderRef = JSON.stringify({ skuId: sku.id });
  await dbExecute(
    `insert into payment_orders (id, employer_id, provider, provider_order_id, amount_paise, currency, status, entitlement_type, entitlement_ref)
     values ($1::uuid, $2::uuid, 'superprofile', $1::uuid, $3, 'INR', 'created', $4, $5::text)`,
    [orderId, session.actorId, sku.amountPaise, sku.entitlementType, orderRef],
  );

  const paymentUrl = buildSuperProfileCheckoutUrl(template, orderId);
  incrementMetric("checkoutStarted");
  return NextResponse.json({
    paymentUrl,
    orderId,
    skuId: sku.id,
    amountPaise: sku.amountPaise,
    currency: "INR",
    instructions:
      "Pay on SuperProfile using the same email as your Vacancy Chennai employer account. Keep the order reference if support asks.",
  });
}
