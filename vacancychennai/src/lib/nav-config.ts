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

/** Your Profile menu — resume (candidate) vs job listing (employer). */
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
    href: "/employer/login",
    label: "List Your Job",
    description: "Post a role and reach nearby candidates",
  },
];
