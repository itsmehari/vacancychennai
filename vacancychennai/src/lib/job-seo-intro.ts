import type { Job, Location } from "@/types/domain";

/**
 * Factual, unique-by-fields intro for JobPosting JSON-LD.
 * Visible page copy uses `buildFactualJobSummary` plus sidebar safety notices.
 */
export function buildFactualJobIntro(opts: {
  job: Job;
  location: Location | null;
  employerName: string;
}): string {
  const area = opts.location?.area?.trim() || "Chennai";
  const zone = opts.location?.zone?.trim();
  const geo = zone && zone.toLowerCase() !== area.toLowerCase() ? `${area} (${zone})` : area;
  const typeLabel = opts.job.jobType.replace("-", " ");
  const industryBit = opts.job.industry?.trim() ? ` in ${opts.job.industry.trim()}` : "";
  const salaryOk =
    opts.job.salaryMin != null &&
    opts.job.salaryMax != null &&
    opts.job.salaryMin > 0 &&
    opts.job.salaryMax > 0;
  const minPay = opts.job.salaryMin;
  const maxPay = opts.job.salaryMax;
  const salary =
    salaryOk &&
    minPay != null &&
    maxPay != null &&
    !(
      minPay === 25_000 &&
      maxPay === 120_000 &&
      opts.job.description.includes("Not stated on the indexed listing")
    )
      ? `Advertised monthly band on Vacancy Chennai is roughly ₹${minPay.toLocaleString("en-IN")}–₹${maxPay.toLocaleString("en-IN")} before statutory deductions—confirm what is offered in writing.`
      : "Compensation may not be stated on this listing; confirm pay, incentives, and probation terms directly with the employer.";

  const landmark = opts.job.landmarkText?.trim();
  const landmarkBit = landmark ? ` Context on place: ${landmark}` : "";

  return (
    `Vacancy Chennai lists this moderated ${typeLabel} role—“${opts.job.title.trim()}”—under ${opts.job.category}${industryBit}. ` +
      `${opts.employerName.trim()} is recruiting around ${geo}, Tamil Nadu.${landmarkBit} ${salary} ` +
      `Use the apply path on this page; always verify responsibilities, timing, and legitimacy before you share personal documents or pay any deposit.`
  );
}

/** Visible summary on the job page — safety copy lives in the sidebar, not above the role. */
export function buildFactualJobSummary(opts: {
  job: Job;
  location: Location | null;
  employerName: string;
}): string {
  const area = opts.location?.area?.trim() || "Chennai";
  const zone = opts.location?.zone?.trim();
  const geo = zone && zone.toLowerCase() !== area.toLowerCase() ? `${area} (${zone})` : area;
  const typeLabel = opts.job.jobType.replace("-", " ");
  return `${opts.employerName.trim()} is hiring for this ${typeLabel} ${opts.job.category.toLowerCase()} role around ${geo}.`;
}

/** Sidebar “Before you apply” — same safety bar as a city-desk job page. */
export const JOB_SAFETY_NOTICES = [
  "Verify the employer before you share documents or payment details.",
  "Do not pay anyone for job confirmation or a “registration” fee.",
  "Check location, salary, hours, and role fit before you travel or join.",
] as const;
