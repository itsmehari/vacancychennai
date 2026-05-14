/** When true and DATABASE_URL is set, admin cannot publish without a valid entitlement (or waiver). */
export function isBillingEnforced(): boolean {
  const v = process.env.BILLING_ENFORCED?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}
