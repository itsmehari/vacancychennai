/**
 * Single SuperProfile payment page for all employer SKUs.
 * Set `SUPERPROFILE_PAYMENT_URL` (HTTPS). Use `{{VC_REF}}` in the URL to inject our
 * `payment_orders.id` (UUID); if missing, `vc_ref` is appended as a query parameter.
 */
export function getSuperProfilePaymentTemplate(): string | null {
  const raw = process.env.SUPERPROFILE_PAYMENT_URL?.trim();
  return raw && raw.startsWith("http") ? raw : null;
}

export function buildSuperProfileCheckoutUrl(template: string, orderId: string): string {
  if (template.includes("{{VC_REF}}")) {
    return template.replaceAll("{{VC_REF}}", encodeURIComponent(orderId));
  }
  try {
    const u = new URL(template);
    u.searchParams.set("vc_ref", orderId);
    return u.toString();
  } catch {
    return `${template}${template.includes("?") ? "&" : "?"}vc_ref=${encodeURIComponent(orderId)}`;
  }
}
