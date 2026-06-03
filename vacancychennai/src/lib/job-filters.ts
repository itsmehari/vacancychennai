import type { Job, Location } from "@/types/domain";

export type PublishedJobFilter = {
  locationSlug?: string;
  category?: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
};

export function getLocationByAreaSlug(slug: string, locations: Location[]) {
  const normalized = slug.replaceAll("-", " ").toLowerCase();
  return locations.find((location) => location.area.toLowerCase() === normalized);
}

/** Filter already-published jobs (caller passes published list only or full list). */
export function filterPublishedJobList(
  jobs: Job[],
  locations: Location[],
  filters: PublishedJobFilter,
) {
  let filtered = jobs.filter((job) => job.status === "published");
  if (filters.locationSlug) {
    const location = getLocationByAreaSlug(filters.locationSlug, locations);
    if (location) {
      filtered = filtered.filter((job) => job.locationId === location.id);
    } else {
      const zoneSlug = filters.locationSlug.toLowerCase();
      filtered = filtered.filter((job) => {
        const loc = locations.find((l) => l.id === job.locationId);
        if (!loc) return false;
        return loc.zone.toLowerCase().includes(zoneSlug.replaceAll("-", " "));
      });
    }
  }
  if (filters.category) {
    filtered = filtered.filter((job) =>
      job.category.toLowerCase().includes(filters.category!.toLowerCase()),
    );
  }
  if (filters.jobType) {
    filtered = filtered.filter((job) => job.jobType === filters.jobType);
  }
  if (typeof filters.salaryMin === "number" && !Number.isNaN(filters.salaryMin)) {
    filtered = filtered.filter(
      (job) => job.salaryMax != null && job.salaryMax >= filters.salaryMin!,
    );
  }
  if (typeof filters.salaryMax === "number" && !Number.isNaN(filters.salaryMax)) {
    filtered = filtered.filter(
      (job) => job.salaryMin != null && job.salaryMin <= filters.salaryMax!,
    );
  }
  return filtered;
}

export function uniqueCategoriesFromJobs(jobs: Job[]): string[] {
  const set = new Set<string>();
  for (const job of jobs) {
    if (job.status === "published") set.add(job.category);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}
