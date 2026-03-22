import type { Location } from "@/types/domain";

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
    href: `/jobs-in-${loc.area.toLowerCase().replaceAll(" ", "-")}`,
    area: loc.area,
    zone: loc.zone,
  }));
}
