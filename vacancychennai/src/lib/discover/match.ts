import type { RoleHub } from "@/lib/discover/roles";
import type { Job } from "@/types/domain";

function textHasTerm(hay: string, term: string): boolean {
  const escaped = term
    .trim()
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "\\s+");
  if (!escaped) return false;
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, "i").test(hay);
}

export function jobMatchesRole(
  job: Pick<Job, "title" | "category" | "industry" | "status">,
  role: RoleHub,
): boolean {
  if (job.status !== "published") return false;
  const hay = `${job.title} ${job.category} ${job.industry}`.toLowerCase();
  return role.keywords.some((term) => textHasTerm(hay, term));
}
