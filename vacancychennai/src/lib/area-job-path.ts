/** Canonical path for hyperlocal job routes (`/jobs-in-velachery`, etc.). */
export function jobsInAreaPath(area: string): string {
  return `/jobs-in-${area.toLowerCase().replaceAll(" ", "-")}`;
}
