import type { EmployerProfile, Job, Location } from "@/types/domain";
import { curatedExternalEmployerCompanyNameMap } from "@/features/core/curated-external-job-postings";

/**
 * Curated listings baked into the app (merged with DB jobs in production).
 * Update here to change copy; no DB migration required for these rows.
 */
const LISTING_CREATED_AT = "2026-04-30T00:00:00.000Z";
const LISTING_UPDATED_AT = "2026-05-03T00:00:00.000Z";

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

/** External listing — applications go to employer phone (see curated direct-contact map). */
export const curatedEmployerManoharan: EmployerProfile = {
  id: "emp-manoharan-accounts",
  companyName: "S Manoharan (Hiring Contact)",
  email: "external.manoharan.accounts@vacancychennai.in",
  password: "nologin",
};

/** External listing — Madipakkam campus; city hub listing uses Nanganallur (see landmark). */
export const curatedEmployerSkbVidhyashram: EmployerProfile = {
  id: "emp-skb-vidhyashram-madipakkam",
  companyName: "SKB Vidhyashram Playschool",
  email: "skbmadipakkam@gmail.com",
  password: "nologin",
};

/** External listing — apply by phone (see curated direct-contact map). */
export const curatedEmployerSouthIndianRestaurantNavalur: EmployerProfile = {
  id: "emp-south-indian-restaurant-navalur",
  companyName: "South Indian Restaurant (Navalur)",
  email: "external.south-indian-restaurant.navalur@vacancychennai.in",
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
  {
    id: "loc-nanganallur",
    zone: "South Chennai",
    area: "Nanganallur",
    pincode: "600091",
    lat: 12.9821,
    lng: 80.1881,
  },
  {
    id: "loc-navalur",
    zone: "OMR / ECR",
    area: "Navalur",
    pincode: "603103",
    lat: 12.849,
    lng: 80.227,
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

const accountsExecutiveDescription = [
  "Urgent opening for Accounts role in Chennai.",
  "",
  "Experience required:",
  "• 3 to 4 years in GST and TDS filing.",
  "• Working knowledge of ZOHO is an added advantage.",
  "",
  "Salary and perks:",
  "• As per market standards.",
  "• CTC range: ₹4.80 to ₹5.50 lakhs per annum.",
  "",
  "Notice period:",
  "• Immediate joiners are preferred.",
  "",
  "Apply directly:",
  "• Contact person: S Manoharan",
  "• Phone: +91 63803 51319",
].join("\n");

const skbPitch = [
  "School focus (from the employer’s campus hiring post):",
  "• Passion for education and new perspectives.",
  "• Hands-on learning, art-integrated education, and safe spaces for children.",
  "",
  "Requirements:",
  "• Strong communication and teaching skills.",
  "• Activity-based teaching experience.",
  "• Confidence, initiative, and creativity.",
].join("\n");

const skbPrincipalDescription = [
  "SKB Vidhyashram Playschool — Madipakkam, Chennai is hiring a Principal.",
  "",
  "Location note: Vacancy Chennai lists this under the Nanganallur city hub; the campus is in Madipakkam.",
  "",
  skbPitch,
  "",
  "Apply by: 30 May 2026.",
  "",
  "How to apply:",
  "• Use the Open WhatsApp button on this page (primary channel).",
  "• You may also email skbmadipakkam@gmail.com with your CV and the role title in the subject line.",
  "",
  "Campus enquiries: tel:+919962187719",
  "",
  "Salary was not stated on the original posting; confirm with the school directly.",
].join("\n");

const skbTeacherDescription = [
  "SKB Vidhyashram Playschool — Madipakkam, Chennai is hiring a Teacher on a part-time basis.",
  "",
  "Location note: Vacancy Chennai lists this under the Nanganallur city hub; the campus is in Madipakkam.",
  "",
  skbPitch,
  "",
  "Apply by: 30 May 2026.",
  "",
  "How to apply:",
  "• Use the Open WhatsApp button on this page (primary channel).",
  "• You may also email skbmadipakkam@gmail.com with your CV and the role title in the subject line.",
  "",
  "Campus enquiries: tel:+919962187719",
  "",
  "Salary was not stated on the original posting; confirm with the school directly.",
].join("\n");

const NAVALUR_RESTAURANT_LISTING_AT = "2026-05-15T00:00:00.000Z";

const southIndianRestaurantNavalurDescription = [
  "Urgent recruitment — South Indian restaurant in Navalur, Chennai. Immediate joining is preferred.",
  "",
  "Open positions:",
  "• Executive Chef",
  "• Kitchen Assistant",
  "• Kitchen Trainee",
  "• Barista (experienced)",
  "• Cashier",
  "",
  "Benefits:",
  "• Staff meals provided.",
  "",
  "How to apply:",
  "Call +91 81245 37432 to discuss the role and next steps.",
  "",
  "Salary was not stated on the original notice; confirm with the restaurant when you call.",
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
    updatedAt: LISTING_UPDATED_AT,
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
    updatedAt: LISTING_UPDATED_AT,
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
    updatedAt: LISTING_UPDATED_AT,
  },
  {
    id: "job-accounts-gst-tds-manoharan",
    employerId: curatedEmployerManoharan.id,
    title: "Accounts Executive (GST / TDS)",
    category: "Finance",
    industry: "Accounting",
    jobType: "full-time",
    salaryMin: 40000,
    salaryMax: 46000,
    locationId: "loc-nungambakkam",
    landmarkText: "Chennai — immediate joiner preferred.",
    description: accountsExecutiveDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: LISTING_CREATED_AT,
    updatedAt: LISTING_UPDATED_AT,
  },
  {
    id: "job-skb-principal-playschool-madipakkam",
    employerId: curatedEmployerSkbVidhyashram.id,
    title: "Principal",
    category: "Education",
    industry: "Education",
    jobType: "full-time",
    salaryMin: 35000,
    salaryMax: 70000,
    locationId: "loc-nanganallur",
    landmarkText: "SKB Vidhyashram Playschool — Madipakkam, Chennai (city hub: Nanganallur).",
    description: skbPrincipalDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: LISTING_CREATED_AT,
    updatedAt: LISTING_UPDATED_AT,
  },
  {
    id: "job-skb-teacher-parttime-playschool-madipakkam",
    employerId: curatedEmployerSkbVidhyashram.id,
    title: "Teacher (part-time)",
    category: "Education",
    industry: "Education",
    jobType: "part-time",
    salaryMin: 12000,
    salaryMax: 28000,
    locationId: "loc-nanganallur",
    landmarkText: "SKB Vidhyashram Playschool — Madipakkam, Chennai (city hub: Nanganallur).",
    description: skbTeacherDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: LISTING_CREATED_AT,
    updatedAt: LISTING_UPDATED_AT,
  },
  {
    id: "job-south-indian-restaurant-navalur-urgent",
    employerId: curatedEmployerSouthIndianRestaurantNavalur.id,
    title: "Multiple openings — South Indian Restaurant (Navalur)",
    category: "Hospitality",
    industry: "Food & Beverage",
    jobType: "full-time",
    salaryMin: 15000,
    salaryMax: 65000,
    locationId: "loc-navalur",
    landmarkText: "South Indian restaurant — Navalur, Chennai (OMR belt).",
    description: southIndianRestaurantNavalurDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: NAVALUR_RESTAURANT_LISTING_AT,
    updatedAt: NAVALUR_RESTAURANT_LISTING_AT,
  },
];

/** E.164 country code + national number, no + prefix — for `https://wa.me/`. */
const curatedWhatsAppApplyDigitsByJobId: Record<string, string> = {
  "job-office-mgr-advocate-parrys": "918248622449",
  "job-office-mgr-advocate-kilpauk": "918248622449",
  "job-skb-principal-playschool-madipakkam": "916380383563",
  "job-skb-teacher-parttime-playschool-madipakkam": "916380383563",
};

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
  "job-accounts-gst-tds-manoharan": {
    email: "external.manoharan.accounts@vacancychennai.in",
    phoneE164: "+916380351319",
    phoneLabel: "+91 63803 51319",
  },
  "job-south-indian-restaurant-navalur-urgent": {
    email: "external.south-indian-restaurant.navalur@vacancychennai.in",
    phoneE164: "+918124537432",
    phoneLabel: "+91 81245 37432",
  },
};

export function isCuratedWhatsAppOnlyJob(jobId: string): boolean {
  return jobId in curatedWhatsAppApplyDigitsByJobId;
}

export function getCuratedWhatsAppApplyDigits(jobId: string): string | undefined {
  return curatedWhatsAppApplyDigitsByJobId[jobId];
}

export function isCuratedDirectEmployerContactJob(jobId: string): boolean {
  return jobId in curatedDirectEmployerContact;
}

export function getCuratedDirectEmployerContact(jobId: string) {
  return curatedDirectEmployerContact[jobId];
}

/** E.164 without + for wa.me (advocate listings only — prefer `getCuratedWhatsAppApplyDigits`). */
export const curatedAdvocateWhatsAppDigits = "918248622449";

export function curatedEmployerCompanyNameMap(): Map<string, string> {
  const m = new Map([
    [curatedEmployer.id, curatedEmployer.companyName],
    [curatedEmployerDugout.id, curatedEmployerDugout.companyName],
    [curatedEmployerManoharan.id, curatedEmployerManoharan.companyName],
    [curatedEmployerSkbVidhyashram.id, curatedEmployerSkbVidhyashram.companyName],
    [
      curatedEmployerSouthIndianRestaurantNavalur.id,
      curatedEmployerSouthIndianRestaurantNavalur.companyName,
    ],
  ]);
  for (const [id, name] of curatedExternalEmployerCompanyNameMap()) {
    m.set(id, name);
  }
  return m;
}
