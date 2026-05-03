/** Sister product outbound links — UTM conventions per visibility plan. */

const DEFAULT_DOMAIN = "resumedoctor.in";

/** Parsed host from NEXT_PUBLIC_RESUMEDOCTOR_SITE_URL or default domain. */
function resumeDoctorConfiguredHost(): string {
  const raw = process.env.NEXT_PUBLIC_RESUMEDOCTOR_SITE_URL;
  if (typeof raw !== "string" || !raw.trim()) return DEFAULT_DOMAIN;
  try {
    const u = raw.includes("://") ? new URL(raw) : new URL(`https://${raw}`);
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return DEFAULT_DOMAIN;
  }
}

/** Host-only check (matches configured domain and www subdomain). */
export function hostnameIsResumeDoctor(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^www\./, "");
  const root = resumeDoctorConfiguredHost();
  return h === root || h.endsWith(`.${root}`);
}

export function resumeDoctorReferralUrl(utm_content: string, path?: `/${string}`): string {
  const rawEnv = process.env.NEXT_PUBLIC_RESUMEDOCTOR_SITE_URL;
  const baseUrl =
    typeof rawEnv === "string" && rawEnv.trim().length > 0
      ? rawEnv.trim().replace(/\/$/, "")
      : `https://${DEFAULT_DOMAIN}`;
  const normalizedBase = baseUrl.includes("://") ? baseUrl : `https://${baseUrl}`;
  const pathNorm = path?.startsWith("/") ? path : "";
  const u = new URL(`${normalizedBase}${pathNorm}`);
  u.searchParams.set("utm_source", "vacancy_chennai");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", "partner_crosslink");
  u.searchParams.set("utm_content", utm_content);
  return u.toString();
}
