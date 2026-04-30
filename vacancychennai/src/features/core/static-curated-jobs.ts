import type { EmployerProfile, Job, Location } from "@/types/domain";

/**
 * Curated listings baked into the app (merged with DB jobs in production).
 * Update here to change copy; no DB migration required for these rows.
 */
const LISTING_CREATED_AT = "2026-04-30T00:00:00.000Z";

export const curatedEmployer: EmployerProfile = {
  id: "emp-advocate-cn",
  companyName: "Advocate Office",
  email: "external.advocate.office@vacancychennai.in",
  password: "nologin",
};

export const curatedLocations: Location[] = [
  {
    id: "loc-parrys",
    zone: "Chennai Central",
    area: "Parrys",
    pincode: "600001",
    lat: 13.0891,
    lng: 80.2925,
  },
  {
    id: "loc-kilpauk",
    zone: "Chennai Central",
    area: "Kilpauk",
    pincode: "600010",
    lat: 13.0838,
    lng: 80.2413,
  },
];

const officeManagerDescription = [
  "Vacancy: Office Manager — 2 positions (one at Parrys, one at Kilpauk).",
  "",
  "Gender: Open to all (male / female).",
  "Salary: ₹30,000 per month.",
  "Timings: 9:00 AM – 6:00 PM.",
  "Age: Up to 45 years.",
  "",
  "Requirements:",
  "• Minimum relevant work experience is mandatory.",
  "• Preference for candidates residing nearby.",
  "• Position is for an advocate office.",
  "",
  "How to apply:",
  "Send your resume via WhatsApp to 8248622449.",
  "Kindly avoid unnecessary phone calls — WhatsApp only.",
].join("\n");

export const curatedPublishedJobs: Job[] = [
  {
    id: "job-office-mgr-advocate-parrys",
    employerId: curatedEmployer.id,
    title: "Office Manager",
    category: "Admin",
    industry: "Legal",
    jobType: "full-time",
    salaryMin: 30000,
    salaryMax: 30000,
    locationId: "loc-parrys",
    landmarkText:
      "Advocate offices at Parrys and Kilpauk, Chennai — 2 positions (one per location).",
    description: officeManagerDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: LISTING_CREATED_AT,
  },
  {
    id: "job-office-mgr-advocate-kilpauk",
    employerId: curatedEmployer.id,
    title: "Office Manager",
    category: "Admin",
    industry: "Legal",
    jobType: "full-time",
    salaryMin: 30000,
    salaryMax: 30000,
    locationId: "loc-kilpauk",
    landmarkText:
      "Advocate offices at Parrys and Kilpauk, Chennai — 2 positions (one per location).",
    description: officeManagerDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: LISTING_CREATED_AT,
  },
];

const whatsappOnlyJobIds = new Set(curatedPublishedJobs.map((j) => j.id));

export function isCuratedWhatsAppOnlyJob(jobId: string): boolean {
  return whatsappOnlyJobIds.has(jobId);
}

/** E.164 without + for wa.me */
export const curatedAdvocateWhatsAppDigits = "918248622449";

export function curatedEmployerCompanyNameMap(): Map<string, string> {
  return new Map([[curatedEmployer.id, curatedEmployer.companyName]]);
}
