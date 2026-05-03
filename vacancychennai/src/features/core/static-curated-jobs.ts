import type { EmployerProfile, Job, Location } from "@/types/domain";
import { curatedExternalEmployerCompanyNameMap } from "@/features/core/curated-external-job-postings";

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

/** External listing — applications go to employer email/phone (see curated direct-contact map). */
export const curatedEmployerDugout: EmployerProfile = {
  id: "emp-dugout-sports",
  companyName: "Dugout Sports and Entertainment",
  email: "reachdugout@gmail.com",
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
  {
    id: "loc-nungambakkam",
    zone: "Chennai Central",
    area: "Nungambakkam",
    pincode: "600034",
    lat: 13.0604,
    lng: 80.2496,
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

const dugoutPhotographerDescription = [
  "We're looking for a creative professional who can capture and produce high-quality visual content for our brand. If you have a strong eye for detail and a passion for storytelling through visuals, we'd like to hear from you.",
  "",
  "Key responsibilities:",
  "• Plan and execute photo and video shoots.",
  "• Ability to manage shoots independently.",
  "• Handle lighting, framing, and composition.",
  "• Edit and deliver polished photo and video content.",
  "• Maintain and manage equipment and media files.",
  "",
  "Preferred:",
  "• Experience working with brands or commercial projects.",
  "• Familiarity with social media content formats.",
  "",
  "Freshers can also apply.",
  "",
  "Apply directly with Dugout:",
  "• Phone: +91 99620 02234",
  "• Email: reachdugout@gmail.com",
  "",
  "Salary was not stated on the original listing; discuss with the employer.",
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
  {
    id: "job-dugout-photographer-videographer",
    employerId: curatedEmployerDugout.id,
    title: "Photographer / Videographer",
    category: "Media / Creative",
    industry: "Sports & Entertainment",
    jobType: "full-time",
    salaryMin: 18000,
    salaryMax: 45000,
    locationId: "loc-nungambakkam",
    landmarkText:
      "Dugout Sports and Entertainment — Chennai-based role (city-wide shoots as needed).",
    description: dugoutPhotographerDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: LISTING_CREATED_AT,
  },
];

const whatsappOnlyJobIds = new Set(
  curatedPublishedJobs.filter((j) => j.id.startsWith("job-office-mgr-advocate")).map((j) => j.id),
);

/** Apply via employer email / phone only — not Vacancy Chennai quick apply. */
const curatedDirectEmployerContact: Record<
  string,
  { email: string; phoneE164: string; phoneLabel: string }
> = {
  "job-dugout-photographer-videographer": {
    email: "reachdugout@gmail.com",
    phoneE164: "+919962002234",
    phoneLabel: "+91 99620 02234",
  },
};

export function isCuratedWhatsAppOnlyJob(jobId: string): boolean {
  return whatsappOnlyJobIds.has(jobId);
}

export function isCuratedDirectEmployerContactJob(jobId: string): boolean {
  return jobId in curatedDirectEmployerContact;
}

export function getCuratedDirectEmployerContact(jobId: string) {
  return curatedDirectEmployerContact[jobId];
}

/** E.164 without + for wa.me */
export const curatedAdvocateWhatsAppDigits = "918248622449";

export function curatedEmployerCompanyNameMap(): Map<string, string> {
  const m = new Map([
    [curatedEmployer.id, curatedEmployer.companyName],
    [curatedEmployerDugout.id, curatedEmployerDugout.companyName],
  ]);
  for (const [id, name] of curatedExternalEmployerCompanyNameMap()) {
    m.set(id, name);
  }
  return m;
}
