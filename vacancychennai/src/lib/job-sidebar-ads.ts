export type { PartnerAd as JobSidebarAd, PartnerAdTheme as JobSidebarAdTheme } from "@/lib/partner-ads";

import { partnerAds } from "@/lib/partner-ads";

/** Square sidebar posters that rotate on job detail pages. */
export function jobSidebarAds() {
  return partnerAds("job_detail_square");
}
