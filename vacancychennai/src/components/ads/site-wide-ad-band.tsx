"use client";

import { usePathname } from "next/navigation";
import { PageAdSlot } from "@/components/ads/page-ad-slot";
import { shouldShowSiteWideAd } from "@/lib/partner-ads";

export function SiteWideAdBand() {
  const pathname = usePathname() ?? "/";
  if (!shouldShowSiteWideAd(pathname)) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-2">
      <PageAdSlot shape="rectangle" placement="site_band" />
    </div>
  );
}
