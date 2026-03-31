/** Product decision: profiles are tied to a signed-in candidate account (user id), not email-only guest submissions. */

export const HEADLINE_MAX_LENGTH = 200;

export const MAX_RESUME_BYTES = 2 * 1024 * 1024;

/** Allowed upload MIME types (aligned with typical job-application rules). */
export const RESUME_ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const EXPERIENCE_LEVEL_VALUES = [
  "",
  "fresher",
  "lt1",
  "y1_3",
  "y3_5",
  "y5_10",
  "gt10",
] as const;

export type ExperienceLevelValue = (typeof EXPERIENCE_LEVEL_VALUES)[number];

export const EXPERIENCE_LEVEL_OPTIONS: { value: ExperienceLevelValue; label: string }[] = [
  { value: "", label: "Prefer not to say" },
  { value: "fresher", label: "Fresher / first job" },
  { value: "lt1", label: "Under 1 year" },
  { value: "y1_3", label: "1–3 years" },
  { value: "y3_5", label: "3–5 years" },
  { value: "y5_10", label: "5–10 years" },
  { value: "gt10", label: "10+ years" },
];

export function isAllowedExperienceLevel(value: string): value is ExperienceLevelValue {
  return (EXPERIENCE_LEVEL_VALUES as readonly string[]).includes(value);
}
