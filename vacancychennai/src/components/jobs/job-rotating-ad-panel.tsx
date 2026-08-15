"use client";

import { PartnerAdRotator } from "@/components/ads/partner-ad-rotator";
import type { JobSidebarAd } from "@/lib/job-sidebar-ads";

type Props = {
  ads: JobSidebarAd[];
};

export function JobRotatingAdPanel({ ads }: Props) {
  return <PartnerAdRotator shape="square" ads={ads} placement="job_detail_square" />;
}
