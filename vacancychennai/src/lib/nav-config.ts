import type { Location } from "@/types/domain";
import { jobsInAreaPath } from "@/lib/area-job-path";

export type MegaAreaLink = {
  href: string;
  area: string;
  zone: string;
};

export type MegaSegmentLink = {
  href: string;
  label: string;
  description: string;
};

export const megaSegmentLinks: MegaSegmentLink[] = [
  {
    href: "/jobs-in-chennai",
    label: "All Chennai jobs",
    description: "Filter by category, salary, and job type",
  },
  {
    href: "/freshers-jobs-chennai",
    label: "Freshers & entry-level",
    description: "First jobs and early-career roles",
  },
  {
    href: "/part-time-jobs-chennai",
    label: "Part-time & flexible",
    description: "Shifts and flexible hours",
  },
  {
    href: "/internships-chennai",
    label: "Internships",
    description: "Listings marked as internship",
  },
  {
    href: "/roles",
    label: "Jobs by role",
    description: "Telecaller, delivery, accounts, retail, and more",
  },
  {
    href: "/areas",
    label: "All neighbourhoods",
    description: "Every area hub, grouped by zone",
  },
  {
    href: "/salary-guide-chennai",
    label: "Salary snapshot",
    description: "Ranges on live listings, not a city survey",
  },
  {
    href: "/guides",
    label: "Hiring guides",
    description: "How to apply, commute, and write a local post",
  },
  {
    href: "/local-job-request-nanganallur",
    label: "Post a job need — Nanganallur",
    description: "Tell local employers what you are looking for",
  },
];

export function locationsToMegaAreas(locations: Location[]): MegaAreaLink[] {
  return locations.map((loc) => ({
    href: jobsInAreaPath(loc.area),
    area: loc.area,
    zone: loc.zone,
  }));
}

export type ProfileNavLink = {
  href: string;
  label: string;
  description: string;
};

/** Primary nav — employer job posting entry (not under Your Profile). */
export const listYourJobNavLink = {
  href: "/post-job",
  label: "List your job",
} as const;

/** Your Profile menu — seeker sign-in, profile, and employer billing. */
export const profileNavLinks: ProfileNavLink[] = [
  {
    href: "/job-seeker-profile",
    label: "Job seeker profile",
    description: "Résumé, skills, and area — optional; sign in to edit",
  },
  {
    href: "/candidate/login",
    label: "Candidate login",
    description: "Sign in to track applications and update your profile",
  },
  {
    href: "/employer/billing",
    label: "Employer billing",
    description: "Buy publish credits or a monthly pass",
  },
];
