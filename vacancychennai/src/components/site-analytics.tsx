import Script from "next/script";

const gaIdRaw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const gaId = typeof gaIdRaw === "string" ? gaIdRaw.trim() : "";

/** GA4 — gated by `NEXT_PUBLIC_GA_MEASUREMENT_ID`. */
export function SiteAnalytics() {
  if (!gaId) return null;

  const escaped = gaId.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${escaped}');`}
      </Script>
    </>
  );
}
