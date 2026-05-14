import Script from "next/script";

/** Production GA4 property; override with `NEXT_PUBLIC_GA_MEASUREMENT_ID`. */
const DEFAULT_MEASUREMENT_ID = "G-H7ZM5XNME5";

function resolveMeasurementId(): string {
  const fromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (fromEnv) return fromEnv;
  return DEFAULT_MEASUREMENT_ID;
}

/**
 * Google tag (gtag.js) for GA4 — included from root layout so it runs on every page.
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */
export function GoogleAnalytics() {
  const measurementId = resolveMeasurementId();
  const escaped = measurementId.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-gtag" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${escaped}');`}
      </Script>
    </>
  );
}
