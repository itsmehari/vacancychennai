import {
  isAllowedEducation,
  isAllowedJobPreference,
} from "@/lib/candidate-profile-constants";
import { normalizePhone } from "@/lib/phone";

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
