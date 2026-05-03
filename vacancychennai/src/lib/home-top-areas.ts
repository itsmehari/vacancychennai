import type { Job, Location } from "@/types/domain";

/** Returns a Chennai-specific insight line like “Most openings now: Tambaram · OMR corridor · Porur.” */
export function formatTopChennaiAreasLine(
  jobs: Job[],
  locations: Location[],
  maxAreas = 3,
): string | null {
  if (jobs.length === 0 || locations.length === 0) return null;
  const byId = new Map(locations.map((l) => [l.id, l]));
  const counts = new Map<string, number>();
  for (const j of jobs) {
    const loc = byId.get(j.locationId);
    if (!loc?.area?.trim()) continue;
    const a = loc.area.trim();
    counts.set(a, (counts.get(a) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  const top = [...counts.entries()]
    .sort((x, y) => y[1] - x[1])
    .slice(0, maxAreas)
    .map(([name]) => name);
  if (top.length === 0) return null;
  return `Most openings right now: ${top.join(" · ")}.`;
}
