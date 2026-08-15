/**
 * Fat footer content (3 tiers):
 * 1. Site link columns (dark band)
 * 2. Optional hiring-partner logos (`footerLogos`)
 * 3. Utility bar: brand, social, newsletter CTAs, contact
 */

import { jobsInAreaPath } from "@/lib/area-job-path";
import { footerPartnerLogoHref } from "@/lib/partner-ads";

export type FooterNavLink = {
  href: string;
  label: string;
};

export type FooterSiteColumn = {
  title: string;
  links: FooterNavLink[];
};

export type FooterLogo = {
  name: string;
  href?: string;
  /** Optional image under /public; if missing, name is shown as text */
  imgSrc?: string;
};

export type FooterSocialId = "linkedin" | "twitter" | "facebook";

export type FooterSocialLink = {
  id: FooterSocialId;
  /** Empty string hides the icon until you add a real profile URL */
  href: string;
  label: string;
};

export const footerSiteLinkColumns: FooterSiteColumn[] = [
  {
    title: "Job seekers",
    links: [
      { href: "/jobs-in-chennai", label: "All jobs in Chennai" },
      { href: "/freshers-jobs-chennai", label: "Freshers jobs" },
      { href: "/part-time-jobs-chennai", label: "Part-time jobs" },
      { href: jobsInAreaPath("Nanganallur"), label: "Jobs in Nanganallur" },
      { href: "/local-job-request-nanganallur", label: "Post job need — Nanganallur" },
      { href: "/job-seeker-profile", label: "Job seeker profile" },
      { href: "/subscribe", label: "Job alerts" },
      { href: "/candidate/login", label: "Candidate login" },
      { href: "/candidate/register", label: "Create candidate account" },
    ],
  },
  {
    title: "Employers & hiring",
    links: [
      { href: "/employer/login", label: "Employer login" },
      { href: "/employer/register", label: "Create employer account" },
      { href: "/pricing", label: "Pricing" },
      { href: "/post-job", label: "Post a job" },
    ],
  },
  {
    title: "Company & legal",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

/** Tier 2: partner sites with live URLs */
export const footerLogos: FooterLogo[] = [
  { name: "ResumeDoctor", href: footerPartnerLogoHref("resume-doctor") },
  { name: "BSERI", href: footerPartnerLogoHref("bseri") },
  { name: "MyChennaiCity", href: footerPartnerLogoHref("mychennaicity") },
];

export const footerNewsletter = {
  headline: "Receive the latest jobs and offers by:",
  textLabel: "Text",
  emailLabel: "Email",
  textHref: "/subscribe?ch=sms",
  emailHref: "/subscribe?ch=email",
};

export const footerContact = {
  lines: ["Chennai, Tamil Nadu, India"],
  emailDisplay: "support@vacancychennai.in",
  emailHref: "mailto:support@vacancychennai.in",
};

export const footerBrand = {
  name: "Vacancy Chennai",
  tagline: "Hyperlocal hiring for Chennai and suburbs.",
};
