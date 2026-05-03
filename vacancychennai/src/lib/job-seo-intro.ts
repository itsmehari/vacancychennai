import type { Job, Location } from "@/types/domain";

/**
 * Factual, unique-by-fields intro shown above the employer-written body.
 * Keeps claims hedged (advertised pay, verify with employer) — no invented duties.
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
  const salaryOk = opts.job.salaryMin > 0 && opts.job.salaryMax > 0;
  const salary =
    salaryOk &&
    !(
      opts.job.salaryMin === 25_000 &&
      opts.job.salaryMax === 120_000 &&
      opts.job.description.includes("Not stated on the indexed listing")
    )
      ? `Advertised monthly band on Vacancy Chennai is roughly ₹${opts.job.salaryMin.toLocaleString("en-IN")}–₹${opts.job.salaryMax.toLocaleString("en-IN")} before statutory deductions—confirm what is offered in writing.`
      : "Compensation may not be stated on this listing; confirm pay, incentives, and probation terms directly with the employer.";

  const landmark = opts.job.landmarkText?.trim();
  const landmarkBit = landmark ? ` Context on place: ${landmark}` : "";

  return (
    `Vacancy Chennai lists this moderated ${typeLabel} role—“${opts.job.title.trim()}”—under ${opts.job.category}${industryBit}. ` +
      `${opts.employerName.trim()} is recruiting around ${geo}, Tamil Nadu.${landmarkBit} ${salary} ` +
      `Use the apply path on this page; always verify responsibilities, timing, and legitimacy before you share personal documents or pay any deposit.`
  );
}
