import { resumeDoctorReferralUrl } from "@/lib/partner-resumedoctor";

export type PartnerAdTheme = "amber" | "navy" | "civic";
export type PartnerAdShape = "square" | "rectangle";

export type PartnerAd = {
  id: string;
  partner: "resume-doctor" | "bseri" | "mychennaicity";
  eyebrow: string;
  kicker: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
  theme: PartnerAdTheme;
};

function partnerUrl(raw: string, utmContent: string): string {
  const u = new URL(raw);
  u.searchParams.set("utm_source", "vacancy_chennai");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", "partner_ad");
  u.searchParams.set("utm_content", utmContent);
  return u.toString();
}

/** Rotating partner creatives — `placement` is stored as `utm_content`. */
export function partnerAds(placement: string): PartnerAd[] {
  return [
    {
      id: "resume-doctor",
      partner: "resume-doctor",
      eyebrow: "Partner",
      kicker: "resumedoctor.in",
      headline: "Don’t send a bad photo of your résumé",
      body: "Make a neat one in five minutes. Download PDF or Word — or share a link the recruiter can open on their phone.",
      cta: "Make my resume — ₹49",
      href: resumeDoctorReferralUrl(placement),
      theme: "amber",
    },
    {
      id: "bseri",
      partner: "bseri",
      eyebrow: "Partner",
      kicker: "bseri.net",
      headline: "ISO skills that hold up in an audit",
      body: "Practitioner courses for people who implement management systems — not just collect certificates.",
      cta: "Explore BSERI courses",
      href: partnerUrl("https://bseri.net/", placement),
      theme: "navy",
    },
    {
      id: "mychennaicity",
      partner: "mychennaicity",
      eyebrow: "Partner",
      kicker: "mychennaicity.in",
      headline: "Chennai jobs, civic news, local events",
      body: "The city desk for Greater Chennai — neighbourhood hubs, walk-in notices, and what is on this weekend.",
      cta: "Open MyChennaiCity",
      href: partnerUrl("https://mychennaicity.in/chennai-jobs", placement),
      theme: "civic",
    },
  ];
}

export function footerPartnerLogoHref(partner: "resume-doctor" | "bseri" | "mychennaicity"): string {
  if (partner === "resume-doctor") return resumeDoctorReferralUrl("footer_logo");
  if (partner === "bseri") return partnerUrl("https://bseri.net/", "footer_logo");
  return partnerUrl("https://mychennaicity.in/", "footer_logo");
}

/** Paths that already have an in-page ad slot, plus private / auth surfaces. */
export function shouldShowSiteWideAd(pathname: string): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/employer/dashboard")) return false;
  if (pathname.startsWith("/employer/billing")) return false;
  if (pathname.startsWith("/employer/resume-database")) return false;
  if (pathname.startsWith("/candidate/dashboard")) return false;
  if (/\/(forgot-password|reset-password)$/.test(pathname)) return false;
  if (pathname.startsWith("/subscribe")) return false;
  if (pathname === "/") return false;
  if (pathname.startsWith("/jobs-in-")) return false;
  if (pathname === "/freshers-jobs-chennai") return false;
  if (pathname === "/part-time-jobs-chennai") return false;
  if (pathname.startsWith("/jobs/")) return false;
  if (pathname.startsWith("/local-job-request-")) return false;
  if (pathname === "/blog" || pathname.startsWith("/blog/")) return false;
  if (pathname === "/privacy" || pathname === "/terms") return false;
  return true;
}
