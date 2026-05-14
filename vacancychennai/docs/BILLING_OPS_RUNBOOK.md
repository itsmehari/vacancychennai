# Billing & moderation ops runbook

## Moderation SLA

- Target: **1–2 business days** from `review` → `published` or rejected message to employer (set your own SLA; surface in `/pricing` trust copy).
- Daily: clear admin queue oldest-first.

## When `BILLING_ENFORCED=true`

- Admin **Publish** requires an active **monthly pass** (under live cap) or **prepaid credit**.
- Use **Grant 1 free publish credit** on `/admin/dashboard` for goodwill / disputes (audited).

## SuperProfile checkouts

- All SKUs share one **SuperProfile** payment URL from **`SUPERPROFILE_PAYMENT_URL`**. Each employer checkout creates a **`payment_orders`** row (`provider = superprofile`, status `created`) and opens that URL with our order id (`vc_ref` or `{{VC_REF}}`). The chosen plan/amount is still stored on our side in `payment_orders` / `entitlement_ref`.
- After you confirm payment in SuperProfile (ideally **same email** as the Vacancy Chennai employer account), either:
  - **Automation:** `POST /api/billing/webhook/superprofile` with `Authorization: Bearer <SUPERPROFILE_WEBHOOK_SECRET>` and JSON `{ "orderId": "<uuid>", "paymentRef": "optional" }`, or
  - **Manual:** use **Mark paid & grant** on `/admin/dashboard` in **SuperProfile — pending checkouts**.

## Refunds

- Policy lives in `docs/EMPLOYER_BILLING_POLICY.md`.
- Process refunds in **SuperProfile** (or your payment processor there); adjust entitlements manually if you already granted (rare — coordinate with engineering).

## GST / invoices

- `payment_invoices` table exists for future automation; align taxable totals with settlements and your accountant’s HSN/SAC mapping.

## Weekly KPIs (suggested)

- Pending SuperProfile rows aged > 24h (stuck checkouts).
- `publishBlockedNoPay` count (metrics snapshot if exposed).
- Webhook failures (5xx on `/api/billing/webhook/superprofile`).

## Cron

- `/api/cron/billing` — same `CRON_SECRET` as notifications; sends pass-expiry reminder emails when Resend is configured.

## Support macros

- **No credits:** “Buy a plan at [site]/employer/billing — open SuperProfile, pay with the same email as your employer login.”
- **Rejected listing:** “No publish credit was used for that submission; you can edit and resubmit.”
