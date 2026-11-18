import { normalizePhone } from "@/lib/phone";

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

export const EDUCATION_OPTIONS = [
  { value: "10th", label: "10th" },
  { value: "12th", label: "12th / HSC" },
  { value: "diploma", label: "Diploma" },
  { value: "iti", label: "ITI" },
  { value: "graduate", label: "Graduate" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "other", label: "Other" },
] as const;

export type EducationValue = (typeof EDUCATION_OPTIONS)[number]["value"];

export function isAllowedEducation(value: string): value is EducationValue {
  return EDUCATION_OPTIONS.some((option) => option.value === value);
}

export function educationLabel(value: string): string {
  return EDUCATION_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

/** Role and work-style choices stored on the seeker profile. */
export const JOB_PREFERENCE_OPTIONS = [
  { value: "bpo", label: "BPO / Telecaller" },
  { value: "retail", label: "Retail" },
  { value: "delivery", label: "Delivery / Logistics" },
  { value: "admin", label: "Admin / Office" },
  { value: "accounts", label: "Accounts" },
  { value: "it", label: "IT / Software" },
  { value: "teaching", label: "Teaching / Training" },
  { value: "security", label: "Security" },
  { value: "hospitality", label: "Hospitality" },
  { value: "sales", label: "Sales" },
  { value: "warehouse", label: "Warehouse" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract / Temporary" },
  { value: "fresher", label: "Fresher — open to suitable roles" },
] as const;

export type JobPreferenceValue = (typeof JOB_PREFERENCE_OPTIONS)[number]["value"];

export function isAllowedJobPreference(value: string): value is JobPreferenceValue {
  return JOB_PREFERENCE_OPTIONS.some((option) => option.value === value);
}

export function jobPreferenceLabel(value: string): string {
  return JOB_PREFERENCE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export const PHONE_VERIFICATION_STATUSES = ["pending", "verified", "rejected"] as const;

export type PhoneVerificationStatus = (typeof PHONE_VERIFICATION_STATUSES)[number];

export function isPhoneVerificationStatus(value: string): value is PhoneVerificationStatus {
  return (PHONE_VERIFICATION_STATUSES as readonly string[]).includes(value);
}

export function phoneVerificationLabel(value: string): string {
  if (value === "verified") return "Verified";
  if (value === "rejected") return "Needs correction";
  return "Pending review";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Profile fields required before employer phone, email, or WhatsApp is shown. */
export function candidateCanViewEmployerContact(profile: {
  name: string;
  email: string;
  phone: string;
  locationId: string;
  education: string;
  jobPreferences: string[];
} | null): boolean {
  if (!profile) return false;
  if (profile.name.trim().length < 2) return false;
  if (!EMAIL_RE.test(profile.email.trim())) return false;
  if (!normalizePhone(profile.phone)) return false;
  if (!profile.locationId.trim()) return false;
  if (!isAllowedEducation(profile.education)) return false;
  return profile.jobPreferences.some((value) => isAllowedJobPreference(value));
}
