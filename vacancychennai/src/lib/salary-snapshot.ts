import type { Job, JobType } from "@/types/domain";

export type SalaryRow = {
  label: string;
  count: number;
  low: number;
  high: number;
  midpointMedian: number;
};

export type SalarySnapshot = {
  count: number;
  low: number;
  high: number;
  midpointMedian: number;
  byJobType: SalaryRow[];
  byCategory: SalaryRow[];
};

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid] ?? 0;
  return Math.round(((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2);
}

function rowFor(label: string, jobs: Job[]): SalaryRow | null {
  const ranged = jobs.filter(
    (job) => job.salaryMin != null && job.salaryMax != null && job.salaryMin > 0 && job.salaryMax > 0,
  );
  if (ranged.length === 0) return null;
  const lows = ranged.map((job) => job.salaryMin as number);
  const highs = ranged.map((job) => job.salaryMax as number);
  const mids = ranged.map((job) => Math.round(((job.salaryMin as number) + (job.salaryMax as number)) / 2));
  return {
    label,
    count: ranged.length,
    low: Math.min(...lows),
    high: Math.max(...highs),
    midpointMedian: median(mids),
  };
}

const JOB_TYPE_LABEL: Record<JobType, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  internship: "Internship",
  contract: "Contract",
  temporary: "Temporary",
};

/** Ranges typed on published listings. Not a city-wide wage survey. */
export function buildSalarySnapshot(jobs: Job[]): SalarySnapshot | null {
  const published = jobs.filter((job) => job.status === "published");
  const overall = rowFor("All listings with a range", published);
  if (!overall) return null;

  const byJobType = (Object.keys(JOB_TYPE_LABEL) as JobType[])
    .map((jobType) => rowFor(JOB_TYPE_LABEL[jobType], published.filter((job) => job.jobType === jobType)))
    .filter((row): row is SalaryRow => row !== null);

  const categories = [...new Set(published.map((job) => job.category.trim()).filter(Boolean))];
  const byCategory = categories
    .map((category) => rowFor(category, published.filter((job) => job.category === category)))
    .filter((row): row is SalaryRow => row !== null)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 12);

  return {
    count: overall.count,
    low: overall.low,
    high: overall.high,
    midpointMedian: overall.midpointMedian,
    byJobType,
    byCategory,
  };
}

export function formatInrMonthly(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
