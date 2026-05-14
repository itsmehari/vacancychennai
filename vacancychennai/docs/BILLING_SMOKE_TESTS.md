# Billing smoke tests (manual)

Run after `npm run db:migrate` with `DATABASE_URL` and **`SUPERPROFILE_PAYMENT_URL`** set to your HTTPS SuperProfile payment page (one URL for all SKUs).

## Checkout link

1. Sign in as an employer (`DATABASE_URL` mode).
2. Open `/employer/billing`, click pay on **Single job post**.
3. Confirm a new browser tab opens your SuperProfile URL and includes `vc_ref=<uuid>` (or your `{{VC_REF}}` substitution).
4. Confirm a row appears under **Admin → SuperProfile — pending checkouts** with the same order id.

## Mark paid (admin)

1. On `/admin/dashboard`, use **Mark paid & grant** for that pending row.
2. Refresh `/employer/billing` — **Prepaid publishes remaining** (or pass) should reflect the SKU.

## Webhook (optional)

1. `POST /api/billing/webhook/superprofile` with header `Authorization: Bearer <SUPERPROFILE_WEBHOOK_SECRET>` and body:
   `{ "orderId": "<payment_orders.id>", "paymentRef": "test-1" }`
2. Replay the same `orderId` with a different `event` or rely on idempotent `payment_webhook_events` — second delivery should not double-grant if already paid.

## Admin publish gate

1. Set `BILLING_ENFORCED=true`, restart dev server.
2. New employer with **no** credits: submit job → admin tries **Publish** → expect `?error=no-entitlement`.
3. Admin **Mark paid** or grant credit → Publish succeeds.

## Listing expiry

1. Manually set a published job’s `expires_at` in the past → confirm it disappears from hub queries (`listPublishedJobs`).

## Mock mode

1. Unset `DATABASE_URL`: employer dashboard should not crash; billing section explains mock mode; admin publish should **not** block (waived).
