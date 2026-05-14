# Employer billing policy (Vacancy Chennai)

This document freezes commercial rules referenced by the product and [`src/lib/billing/skus.ts`](../src/lib/billing/skus.ts).

## SKUs

| SKU | Price (INR) | What you get |
|-----|---------------|----------------|
| Single post | **75** | One **published** listing, visible up to **120 days** from first publish (or until you close it). |
| Employer monthly pass | **120** | **30 days** from purchase; up to **2 concurrent published** jobs at a time. Moderation still applies. |
| Volume 3 / 5 / 10 / 20 | **147 / 245 / 490 / 980** | **3 / 5 / 10 / 20** publishes within **30 days** of purchase (effective **Rs 49** per post on those packs). |

## When you are charged

- **Credits** (single + volume) are consumed when our team **first sets your job to Published**, not when you save a draft or submit for review.
- **Monthly pass** gates how many jobs can be **live (published)** at once (`max_live_posts: 2`).

## Overage

If you exhaust a volume pack and need more posts in the same period, buy another pack or a **single post**. Overage single posts outside a pack are billed at **Rs 55** when sold as a dedicated overage SKU in checkout (see code); otherwise use the standard **Rs 75** single post.

## Refunds

If we **reject** a listing **before** it has been published, you have not consumed a publish credit for that job. Paid orders that never resulted in a publish may be refunded on request within **14 days** — email the contact on the site with your SuperProfile receipt and the **order id** shown on Vacancy Chennai (or in your confirmation email from us).

## Checkout

Payments are taken on **SuperProfile** via one HTTPS payment page configured in **`SUPERPROFILE_PAYMENT_URL`**. Each checkout creates an order id on Vacancy Chennai; keep it for support and refunds.

Tax invoices are issued per Indian rules where applicable; keep **GSTIN** on file in billing settings when you add that field to employer profiles.

## Enforcement

Production can require payment before publish by setting `BILLING_ENFORCED=true` with `DATABASE_URL` set. Demo / mock mode without a database does not enforce billing.
