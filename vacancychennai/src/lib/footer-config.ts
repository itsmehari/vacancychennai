/**
 * Fat footer content (3 tiers):
 * 1. Site link columns (dark band)
 * 2. Optional hiring-partner logos (`footerLogos`)
 * 3. Utility bar: brand, social, newsletter CTAs, contact
 */

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
      { href: "/job-seeker-profile", label: "Job seeker profile" },
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

/** Tier 2: add `{ name, imgSrc?, href? }` to show the hiring partners strip */
export const footerLogos: FooterLogo[] = [];



export const footerNewsletter = {
  headline: "Receive the latest jobs and offers by:",
  textLabel: "Text",
  emailLabel: "Email",
  textHref: "/subscribe?ch=sms",
  emailHref: "/subscribe?ch=email",
};

export const footerContact = {
  lines: ["Chennai, Tamil Nadu, India"],
  phoneDisplay: "+91 — — — — —",
  /** Set when you publish a support number, e.g. tel:+914412345678 */
  phoneHref: "" as string,
};

export const footerBrand = {
  name: "Vacancy Chennai",
  tagline: "Hyperlocal hiring for Chennai and suburbs.",
};
