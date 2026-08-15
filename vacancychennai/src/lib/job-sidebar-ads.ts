import { resumeDoctorReferralUrl } from "@/lib/partner-resumedoctor";

export type JobSidebarAdTheme = "amber" | "navy" | "civic";

export type JobSidebarAd = {
  id: string;
  partner: "resume-doctor" | "bseri" | "mychennaicity";
  eyebrow: string;
  kicker: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
  theme: JobSidebarAdTheme;
};

function partnerUrl(raw: string, utmContent: string): string {
  const u = new URL(raw);
  u.searchParams.set("utm_source", "vacancy_chennai");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", "job_detail_ad");
  u.searchParams.set("utm_content", utmContent);
  return u.toString();
}

/** Square sidebar posters that rotate on job detail pages. */
export function jobSidebarAds(): JobSidebarAd[] {
  return [
    {
      id: "resume-doctor",
      partner: "resume-doctor",
      eyebrow: "Partner",
      kicker: "resumedoctor.in",
      headline: "Don’t send a bad photo of your résumé",
      body: "Make a neat one in five minutes. Download PDF or Word — or share a link the recruiter can open on their phone.",
      cta: "Make my resume — ₹49",
      href: resumeDoctorReferralUrl("job_detail_square_ad"),
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
      href: partnerUrl("https://bseri.net/", "job_detail_square_ad"),
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
      href: partnerUrl("https://mychennaicity.in/chennai-jobs", "job_detail_square_ad"),
      theme: "civic",
    },
  ];
}

