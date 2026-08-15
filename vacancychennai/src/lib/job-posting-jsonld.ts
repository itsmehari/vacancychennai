import { jobsInAreaPath } from "@/lib/area-job-path";
import { resolveOnetOccupationalCategoryUrl } from "@/lib/job-occupational-category";
import { buildFactualJobIntro } from "@/lib/job-seo-intro";
import type { Job, Location } from "@/types/domain";

export type JobApplyMode = "quick-apply" | "external-url" | "direct-contact" | "whatsapp-only";

export function siteUrlRoot(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in").replace(/\/$/, "");
}

/** Google-supported values for schema.org JobPosting `employmentType`. */
export function mapJobTypeToGoogleEmploymentType(jobType: Job["jobType"]): string {
  switch (jobType) {
    case "full-time":
      return "FULL_TIME";
    case "part-time":
      return "PART_TIME";
    case "internship":
      return "INTERN";
    case "contract":
      return "CONTRACTOR";
    case "temporary":
      return "TEMPORARY";
    default:
      return "OTHER";
  }
}

function stripUndefinedDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripUndefinedDeep).filter((v) => v !== undefined);
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined) continue;
      const next = stripUndefinedDeep(v);
      if (next !== undefined) out[k] = next;
    }
    return out;
  }
  return value;
}

function isoDatePosted(createdAt: string): string {
  const d = new Date(createdAt);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/** Listing freshness signal for Google JobPosting (`validThrough`). */
function validThroughIso(datePostedIso: string): string {
  const posted = new Date(datePostedIso);
  const end = Number.isNaN(posted.getTime()) ? new Date() : new Date(posted);
  end.setUTCDate(end.getUTCDate() + 180);
  return end.toISOString();
}

function truncateDescription(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
}

/**
 * JobPosting JSON-LD aligned with Google structured-data guidance:
 * https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */
export function buildJobPostingJsonLd(opts: {
  job: Job;
  employerName: string;
  location: Location | null;
  canonicalPath: string;
  applyMode: JobApplyMode;
  externalApplyUrl?: string;
}): Record<string, unknown> {
  const root = siteUrlRoot();
  const pageUrl = `${root}${opts.canonicalPath}`;
  const datePosted = isoDatePosted(opts.job.createdAt);
  const validThrough = opts.job.expiresAt
    ? isoDatePosted(opts.job.expiresAt)
    : validThroughIso(datePosted);

  const loc = opts.location;
  const addressLocality = loc?.area?.trim() || "Chennai";
  const postalCode = loc?.pincode?.trim();
  const landmark = opts.job.landmarkText?.trim();

  const postalAddress: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressLocality,
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  };
  if (postalCode) postalAddress.postalCode = postalCode;
  if (landmark) postalAddress.streetAddress = truncateDescription(landmark, 500);

  const intro = buildFactualJobIntro({
    job: opts.job,
    location: opts.location,
    employerName: opts.employerName,
  });
  const description = truncateDescription(`${intro}\n\n${opts.job.description}`, 50000);

  const dateModifiedRaw = isoDatePosted(opts.job.updatedAt);
  const postedMs = new Date(datePosted).getTime();
  const modifiedMs = new Date(dateModifiedRaw).getTime();
  const dateModified =
    Number.isNaN(modifiedMs) || modifiedMs < postedMs ? datePosted : dateModifiedRaw;

  const occupationalCategory = resolveOnetOccupationalCategoryUrl(opts.job);

  const hiringOrganization: Record<string, unknown> = {
    "@type": "Organization",
    name: opts.employerName.trim() || "Employer",
  };

  const salaryDisclosed =
    opts.job.salaryMin != null &&
    opts.job.salaryMax != null &&
    opts.job.salaryMin > 0 &&
    opts.job.salaryMax > 0;

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: opts.job.title.trim(),
    description,
    datePosted,
    dateModified,
    validThrough,
    employmentType: mapJobTypeToGoogleEmploymentType(opts.job.jobType),
    hiringOrganization,
    jobLocation: {
      "@type": "Place",
      address: postalAddress,
      ...(typeof loc?.lat === "number" && typeof loc?.lng === "number"
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: loc.lat,
              longitude: loc.lng,
            },
          }
        : {}),
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "India",
    },
    ...(salaryDisclosed
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              minValue: opts.job.salaryMin,
              maxValue: opts.job.salaryMax,
              unitText: "MONTH",
            },
          },
        }
      : {}),
    url: pageUrl,
    identifier: {
      "@type": "PropertyValue",
      name: "vacancychennai_job_id",
      value: opts.job.id,
    },
    industry: opts.job.industry?.trim() || undefined,
    directApply: opts.applyMode === "quick-apply",
    ...(occupationalCategory ? { occupationalCategory } : {}),
  };

  if (opts.applyMode === "external-url" && opts.externalApplyUrl?.trim()) {
    ld.applicationUrl = opts.externalApplyUrl.trim();
  }

  return stripUndefinedDeep(ld) as Record<string, unknown>;
}

export function buildJobBreadcrumbListJsonLd(opts: {
  jobTitle: string;
  jobPath: string;
  areaLabel: string;
}): Record<string, unknown> {
  const root = siteUrlRoot();
  const areaPath = jobsInAreaPath(opts.areaLabel);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${root}/` },
      { "@type": "ListItem", position: 2, name: "Jobs in Chennai", item: `${root}/jobs-in-chennai` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${opts.areaLabel} jobs`,
        item: `${root}${areaPath}`,
      },
      { "@type": "ListItem", position: 4, name: opts.jobTitle, item: `${root}${opts.jobPath}` },
    ],
  };
}
