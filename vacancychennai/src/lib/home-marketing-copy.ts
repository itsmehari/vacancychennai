/**
 * Homepage marketing strings (Indian English). SEO titles/meta stay in `home-seo-copy.ts`.
 */

export type HomeStepIcon = "search" | "doc" | "user" | "building" | "clipboard" | "users";

export const homeHeroEyebrow = "Chennai · Jobs by locality";

export const homeHeroTitleBefore = "Jobs along ";
export const homeHeroTitleHighlight = "OMR, Tambaram radial, Porur & Velachery";
export const homeHeroTitleAfter =
  " — browse Chennai micro-areas employers actually spell out in postings.";

export const homeHeroSubcopy =
  "Filter by corridor, suburb, salary, and shift. Quick apply with name and mobile — listings are moderated so you spend less time on junk ads and ghost venues.";

export const homeHeroCtaBrowseJobs = "See all Chennai listings";
export const homeHeroCtaLearnMore = "How applying works";
export const homeHeroCtaCreateAccount = "Create free account";

export const homeHeroFootnoteTracked =
  "Track applications with the same email you use to quick apply.";

export const homeHeroProfileTeaserLead = "Job seeker profile";
export const homeHeroProfileTeaserRest =
  " — save headline, skills, and a résumé for faster applies locally.";

export const homeHeroSocialProofLine =
  "Seekers and teams hiring across Chennai — retail, GCC & tech services, logistics, hospitality & clinics";

export const homeHeroIndustryPills = [
  "Retail & services",
  "IT & GCC",
  "Logistics",
  "Hospitality & clinics",
] as const;

export const homeHeroStatsLabels = {
  listings: "Open roles on the board",
  areas: "Chennai micro-areas we cover",
  free: "No charge for candidates",
} as const;

export const homeHowItWorksHeader = {
  eyebrow: "Simple paths",
  title: "How it works here",
  description: "Whether you walk in near newer Metro corridors or shuttle down OMR — two clear paths.",
} as const;

export const homeHowItWorksCandidateSteps: readonly { n: number; text: string; icon: HomeStepIcon }[] = [
  {
    n: 1,
    text: "Start from your commute — neighbourhood, category, freshers hub, or part-time board.",
    icon: "search",
  },
  {
    n: 2,
    text: "Open each card: locality, landmark, salary band, and shifts should be spelled out.",
    icon: "doc",
  },
  {
    n: 3,
    text: "Apply with quick apply (name + mobile) or sign in to save progress on Chennai listings.",
    icon: "user",
  },
];

export const homeHowItWorksEmployerSteps: readonly { n: number; text: string; icon: HomeStepIcon }[] = [
  { n: 1, text: "Create an employer account and sign in.", icon: "building" },
  {
    n: 2,
    text: "Post with real micro-area and salary — we moderate so Chennai seekers see trustworthy copy.",
    icon: "clipboard",
  },
  { n: 3, text: "Review applicants from your dashboard and shortlist or reject.", icon: "users" },
];

export const homeSegmentsHeader = {
  eyebrow: "Start here",
  title: "Find jobs the way Chennai people search",
  description: "Corridor boards, fresher hubs, shift-friendly lists — tap what matches how you commute.",
} as const;

export const homeSegmentCards = [
  {
    title: "Freshers & entry-level",
    description: "First jobs and stepping-stone roles around Chennai neighbourhoods you can actually commute to.",
    href: "/freshers-jobs-chennai",
    cta: "See freshers listings",
    dataCta: "segment-freshers",
    icon: "graduation" as const,
    accent: "blue" as const,
    badge: null as string | null,
  },
  {
    title: "Part-time & flexible",
    description: "Shift-friendly gigs from Velachery to Ambattur — filter further on the main Chennai board.",
    href: "/part-time-jobs-chennai",
    cta: "See part-time listings",
    dataCta: "segment-part-time",
    icon: "clock" as const,
    accent: "amber" as const,
    badge: null as string | null,
  },
  {
    title: "All Chennai jobs",
    description: "Full moderated catalogue — category, corridor, salary, and job type in one grid.",
    href: "/jobs-in-chennai",
    cta: "Open Chennai board",
    dataCta: "segment-all-jobs",
    icon: "briefcase" as const,
    accent: "slate" as const,
    badge: "Most popular" as string | null,
  },
] as const;

export const homeTrustPillarsCopy = [
  {
    title: "Locality first",
    body: "Zones, areas, and landmark hints so OMR hires do not confuse Porur commuters — less wasted screening.",
    icon: "map" as const,
  },
  {
    title: "Moderated postings",
    body: "We review employer posts so spam and dubious copy do not choke up your neighbourhood feed.",
    icon: "shield" as const,
  },
  {
    title: "Fast apply",
    body: "Name + essentials for volume roles across Chennai suburbs — optimised for Tamil Nadu hiring pace.",
    icon: "bolt" as const,
  },
] as const;

export const homeTrustHeader = {
  eyebrow: "Why Chennai teams use us",
  title: "Why Vacancy Chennai",
  description:
    "Signals tuned to Chennai hiring — moderated feeds, blunt about locality, respectful of commuter time.",
} as const;

export const homeLocationSection = {
  eyebrow: "Hyperlocal",
  title: "Browse by Chennai micro-area",
  description:
    "Pages for Tambaram radial, Porur clusters, Velachery, Ambattur, OMR corridors, and more — every tile maps to moderated listings.",
} as const;

export const homeEmployersBullets = [
  "Reach candidates who already map your workplace to their bus route or Metro walk — fewer no-shows on day one.",
  "Listings and featured slots stay affordable for Chennai SMEs, storefronts, and satellite offices.",
  "Moderation keeps spam and phantom venues out of suburb feeds seekers actually filter.",
] as const;
