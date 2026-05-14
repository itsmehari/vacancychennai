import { NextResponse } from "next/server";
import { dbExecute, hasDatabase } from "@/lib/db";
import { fulfillPaymentOrderById } from "@/features/billing/publish-and-fulfill";
import { incrementMetric } from "@/lib/metrics";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * Optional automation when SuperProfile (or a proxy) can POST here after payment.
 * Body: `{ "orderId": "<payment_orders.id uuid>", "paymentRef"?: string, "event"?: "paid" }`
 * Header: `Authorization: Bearer <SUPERPROFILE_WEBHOOK_SECRET>`
 */
export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const secret = process.env.SUPERPROFILE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    logger.warn("SUPERPROFILE_WEBHOOK_SECRET missing — rejecting webhook");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: { orderId?: string; vc_ref?: string; paymentRef?: string; event?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const orderId = String(body.orderId ?? body.vc_ref ?? "").trim();
  if (!orderId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventId = `${orderId}:${body.event ?? "paid"}`;
  const inserted = await dbExecute(
    `insert into payment_webhook_events (provider, event_id, event_type, payload)
     values ('superprofile', $1, $2, $3::jsonb)
     on conflict (provider, event_id) do nothing`,
    [eventId, body.event ?? "paid", JSON.stringify(body)],
  );
  if ((inserted.rowCount ?? 0) === 0) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const r = await fulfillPaymentOrderById(orderId, body.paymentRef ?? "webhook");
  if (r.ok) {
    incrementMetric("paymentSucceeded");
  }

  await dbExecute(
    `update payment_webhook_events set processed_at = now() where provider = 'superprofile' and event_id = $1`,
    [eventId],
  );

  return NextResponse.json({ ok: r.ok, error: r.error });
}
