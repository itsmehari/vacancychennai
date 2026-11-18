/**
 * Frozen employer billing SKUs (amounts in INR / paise).
 * @see docs/EMPLOYER_BILLING_POLICY.md
 */

export type BillingSkuId =
  | "seeker_pass"
  | "local_5"
  | "post_single"
  | "post_overage"
  | "employer_monthly_pass"
  | "volume_3"
  | "volume_5"
  | "volume_10"
  | "volume_20";

export type BillingSku = {
  id: BillingSkuId;
  /** Order amount in paise (checkout / display) */
  amountPaise: number;
  label: string;
  shortDescription: string;
  /** Stored on payment_orders.entitlement_type */
  entitlementType: "post_credit" | "monthly_pass" | "volume_pack" | "seeker_pass";
  /** JSON stored on entitlements.entitlement_ref after payment */
  buildEntitlementRef: () => Record<string, unknown>;
  /** Calendar days listing stays live after first publish (single + volume). */
  listingDays: number;
};

const LISTING_DAYS = 120;

export const OVERAGE_PER_POST_PAISE = 5500; /** Rs 55 — volume pack overage */

export const BILLING_SKUS: Record<BillingSkuId, BillingSku> = {
  seeker_pass: {
    id: "seeker_pass",
    amountPaise: 9900,
    label: "Job seeker pass",
    shortDescription: "30 days of area and role alerts, plus your profile kept ready. Reading jobs and applying stay free.",
    entitlementType: "seeker_pass",
    buildEntitlementRef: () => ({ sku: "seeker_pass" }),
    listingDays: 30,
  },
  local_5: {
    id: "local_5",
    amountPaise: 19900,
    label: "Local business — 5 posts",
    shortDescription: "Five publishes in 30 days for a shop, startup, or office with a street address.",
    entitlementType: "volume_pack",
    buildEntitlementRef: () => ({ sku: "local_5", credits: 5 }),
    listingDays: LISTING_DAYS,
  },
  post_overage: {
    id: "post_overage",
    amountPaise: OVERAGE_PER_POST_PAISE,
    label: "Extra post (overage)",
    shortDescription: "One publish after your volume pack is used — Rs 55.",
    entitlementType: "post_credit",
    buildEntitlementRef: () => ({ sku: "post_overage", credits: 1 }),
    listingDays: LISTING_DAYS,
  },
  post_single: {
    id: "post_single",
    amountPaise: 7500,
    label: "Single job post",
    shortDescription: "One listing, live up to 120 days after we publish it.",
    entitlementType: "post_credit",
    buildEntitlementRef: () => ({ sku: "post_single", credits: 1 }),
    listingDays: LISTING_DAYS,
  },
  employer_monthly_pass: {
    id: "employer_monthly_pass",
    amountPaise: 12000,
    label: "Employer monthly pass",
    shortDescription: "Up to 2 live listings at a time for 30 days — human moderation still applies.",
    entitlementType: "monthly_pass",
    buildEntitlementRef: () => ({ sku: "employer_monthly_pass", max_live_posts: 2 }),
    listingDays: LISTING_DAYS,
  },
  volume_3: {
    id: "volume_3",
    amountPaise: 14700,
    label: "Volume — 3 posts / month",
    shortDescription: "3 prepaid publishes within 30 days of purchase (Rs 49 each).",
    entitlementType: "volume_pack",
    buildEntitlementRef: () => ({ sku: "volume_3", credits: 3 }),
    listingDays: LISTING_DAYS,
  },
  volume_5: {
    id: "volume_5",
    amountPaise: 24500,
    label: "Volume — 5 posts / month",
    shortDescription: "5 prepaid publishes within 30 days (Rs 49 each).",
    entitlementType: "volume_pack",
    buildEntitlementRef: () => ({ sku: "volume_5", credits: 5 }),
    listingDays: LISTING_DAYS,
  },
  volume_10: {
    id: "volume_10",
    amountPaise: 49000,
    label: "Verified employer — 10 posts",
    shortDescription: "For a mid-size Chennai IT team. 10 publishes in 30 days. Verified badge after the company name and office address match.",
    entitlementType: "volume_pack",
    buildEntitlementRef: () => ({ sku: "volume_10", credits: 10, verified: true }),
    listingDays: LISTING_DAYS,
  },
  volume_20: {
    id: "volume_20",
    amountPaise: 98000,
    label: "Corporate desk — 20 posts",
    shortDescription: "20 publishes in 30 days for a larger Chennai office. Same review rules. Verified badge after the office address matches.",
    entitlementType: "volume_pack",
    buildEntitlementRef: () => ({ sku: "volume_20", credits: 20, verified: true }),
    listingDays: LISTING_DAYS,
  },
};

export function getSku(id: string): BillingSku | null {
  if (id in BILLING_SKUS) return BILLING_SKUS[id as BillingSkuId];
  return null;
}

export function listPublicSkus(): BillingSku[] {
  return [
    BILLING_SKUS.local_5,
    BILLING_SKUS.post_single,
    BILLING_SKUS.employer_monthly_pass,
    BILLING_SKUS.volume_3,
    BILLING_SKUS.volume_5,
    BILLING_SKUS.volume_10,
    BILLING_SKUS.volume_20,
    BILLING_SKUS.post_overage,
  ];
}

/** Employer checkout only. The seeker pass is sold to candidate accounts. */
export function listEmployerSkus(): BillingSku[] {
  return listPublicSkus();
}
