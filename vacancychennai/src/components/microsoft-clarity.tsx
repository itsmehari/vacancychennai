import Script from "next/script";

/** Production Clarity project; override with `NEXT_PUBLIC_MICROSOFT_CLARITY_ID`. */
const DEFAULT_CLARITY_PROJECT_ID = "ws0s6y88o0";

function resolveClarityProjectId(): string {
  const fromEnv = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID?.trim();
  if (fromEnv && /^[a-zA-Z0-9_-]+$/.test(fromEnv)) return fromEnv;
  return DEFAULT_CLARITY_PROJECT_ID;
}

/**
 * Microsoft Clarity session replay & heatmaps — root layout, all public pages.
 * @see https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup
 */
export function MicrosoftClarity() {
  const projectId = resolveClarityProjectId();

  const escaped = projectId.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","${escaped}");`}
    </Script>
  );
}
