import { createHash } from "crypto";
import type { EmployerProfile, Job } from "@/types/domain";
import externalJobRows from "@/features/core/data/external-job-rows.json";

type ExternalJobRow = {
  title: string;
  category: string;
  industry: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  locationArea: string;
  landmarkText: string;
  description: string;
  sourceUrl: string;
  companyName: string;
  postedOrVerifiedDate: string;
};

const rows = externalJobRows as ExternalJobRow[];

const DEFAULT_CREATED_AT = "2026-05-03T12:00:00.000Z";
const SALARY_PLACEHOLDER_MIN = 25_000;
const SALARY_PLACEHOLDER_MAX = 120_000;
const SALARY_NOTE =
  "\n\nSalary: Not stated on the indexed listing — confirm on the employer careers page.";

const AREA_TO_LOCATION_ID: Record<string, string> = {
  Sholinganallur: "loc-omr-sholinganallur",
  Parrys: "loc-parrys",
  Tambaram: "loc-tambaram",
  Velachery: "loc-velachery",
  Kilpauk: "loc-kilpauk",
  Porur: "loc-porur",
};

function employerSlug(companyName: string) {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 56);
}

export function stableExternalJobId(sourceUrl: string) {
  return `job-ext-${createHash("sha256").update(sourceUrl).digest("hex").slice(0, 14)}`;
}

function parsePostedAt(postedOrVerifiedDate: string): string {
  if (!postedOrVerifiedDate || postedOrVerifiedDate === "unknown") return DEFAULT_CREATED_AT;
  const d = new Date(`${postedOrVerifiedDate}T12:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? DEFAULT_CREATED_AT : d.toISOString();
}

const employerByCompanyName = new Map<string, EmployerProfile>();
for (const row of rows) {
  if (employerByCompanyName.has(row.companyName)) continue;
  const slug = employerSlug(row.companyName);
  employerByCompanyName.set(row.companyName, {
    id: `emp-ext-${slug}`,
    companyName: row.companyName,
    email: `external.${slug}@vacancychennai.in`,
    password: "nologin",
  });
}

export const curatedExternalEmployers: EmployerProfile[] = [...employerByCompanyName.values()];

/** Published curated jobs sourced from external career pages (apply via outbound URL). */
export const curatedExternalPublishedJobs: Job[] = rows.map((row) => {
  const id = stableExternalJobId(row.sourceUrl);
  const employer = employerByCompanyName.get(row.companyName)!;
  const undisclosed = row.salaryMin <= 0 || row.salaryMax <= 0;
  const description = undisclosed ? `${row.description}${SALARY_NOTE}` : row.description;
  const salaryMin = row.salaryMin > 0 ? row.salaryMin : SALARY_PLACEHOLDER_MIN;
  const salaryMax = row.salaryMax > 0 ? row.salaryMax : SALARY_PLACEHOLDER_MAX;

  return {
    id,
    employerId: employer.id,
    title: row.title,
    category: row.category,
    industry: row.industry,
    jobType: row.jobType.replace("_", "-") as Job["jobType"],
    salaryMin,
    salaryMax,
    locationId: AREA_TO_LOCATION_ID[row.locationArea] ?? "loc-omr-sholinganallur",
    landmarkText: row.landmarkText,
    description,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: parsePostedAt(row.postedOrVerifiedDate),
  };
});

export const curatedExternalApplyUrlByJobId: Record<string, string> = Object.fromEntries(
  rows.map((row) => [stableExternalJobId(row.sourceUrl), row.sourceUrl]),
);

export function curatedExternalEmployerCompanyNameMap(): Map<string, string> {
  return new Map(curatedExternalEmployers.map((e) => [e.id, e.companyName]));
}

export function isCuratedExternalApplyUrlJob(jobId: string): boolean {
  return Boolean(curatedExternalApplyUrlByJobId[jobId]);
}

export function getCuratedExternalApplyUrl(jobId: string): string | undefined {
  return curatedExternalApplyUrlByJobId[jobId];
}
