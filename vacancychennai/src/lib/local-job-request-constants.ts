import { EXPERIENCE_LEVEL_OPTIONS } from "@/lib/candidate-profile-constants";

export const NANGANALLUR_AREA_SLUG = "nanganallur";
export const NANGANALLUR_PAGE_PATH = "/local-job-request-nanganallur";
export const NANGANALLUR_AREA_LABEL = "Nanganallur";

export const JOB_NEEDS_MAX_LENGTH = 1000;

export const EDUCATION_VALUES = [
  "below_10",
  "10th",
  "12th",
  "diploma",
  "graduate",
  "post_graduate",
  "other",
] as const;

export type EducationValue = (typeof EDUCATION_VALUES)[number];

export const EDUCATION_OPTIONS: { value: EducationValue; label: string }[] = [
  { value: "below_10", label: "Below 10th" },
  { value: "10th", label: "10th pass" },
  { value: "12th", label: "12th pass / HSC" },
  { value: "diploma", label: "Diploma / ITI" },
  { value: "graduate", label: "Graduate" },
  { value: "post_graduate", label: "Post graduate" },
  { value: "other", label: "Other" },
];

export function isAllowedEducation(value: string): value is EducationValue {
  return (EDUCATION_VALUES as readonly string[]).includes(value);
}

export function educationLabel(value: string): string {
  return EDUCATION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function experienceLabel(value: string): string {
  return EXPERIENCE_LEVEL_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function ageFromDateOfBirth(isoDate: string): number {
  const dob = new Date(`${isoDate}T12:00:00`);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

export function isValidJobSeekerDateOfBirth(isoDate: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return false;
  const age = ageFromDateOfBirth(isoDate);
  return age >= 16 && age <= 70;
}
