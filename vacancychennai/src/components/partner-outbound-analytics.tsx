"use client";

import { hostnameIsResumeDoctor } from "@/lib/partner-resumedoctor";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID =
  typeof process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID === "string"
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID.trim()
    : "";

/** GA4 — custom event when navigating to resumedoctor.in (`data-utm-content` optional dimension). */
export function PartnerOutboundAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return undefined;

    function onClick(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;
      const anchor = e.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const raw = anchor.href;
      if (!raw || /^javascript:/i.test(raw)) return;
      let url: URL;
      try {
        url = new URL(raw, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/i.test(url.protocol)) return;
      if (!hostnameIsResumeDoctor(url.hostname)) return;

      let utmContent = anchor.dataset.utmContent?.trim();
      if (!utmContent) {
        utmContent = url.searchParams.get("utm_content")?.trim() ?? "";
      }
      window.gtag?.("event", "partner_outbound_click", {
        link_url: url.origin + url.pathname + url.search,
        ...(utmContent ? { utm_content: utmContent } : {}),
      });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
