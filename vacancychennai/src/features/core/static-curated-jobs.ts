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

/** External listing — HL & LAP sales roles; apply via Kamalakannan (see curated direct-contact map). */
export const curatedEmployerMoneyBoxxFinance: EmployerProfile = {
  id: "emp-money-boxx-finance",
  companyName: "Money Boxx Finance Ltd",
  email: "Kamalakannang@moneyboxxfinance.com",
  password: "nologin",
};

/** External listing — Viyani Builder Private Limited hiring staff across Tamil Nadu. */
export const curatedEmployerViyaniBuilder: EmployerProfile = {
  id: "emp-viyani-builder",
  companyName: "Viyani Builder Private Limited",
  email: "external.viyani.builder@vacancychennai.in",
  password: "nologin",
};

/** External listing — security staff near DLF Ramapuram, Porur (see curated direct-contact map). */
export const curatedEmployerEliteExpress: EmployerProfile = {
  id: "emp-elite-express-enterprises",
  companyName: "Elite Express Enterprises",
  email: "external.eliteexpress@vacancychennai.in",
  password: "nologin",
};

/** External listing — software testing training coordination; contact Babu (see curated WhatsApp map). */
export const curatedEmployerBabuTestingTraining: EmployerProfile = {
  id: "emp-babu-software-testing-training",
  companyName: "Software Testing Training Program",
  email: "external.babu.testing-training@vacancychennai.in",
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
  {
    id: "loc-porur",
    zone: "Porur / Poonamallee",
    area: "Porur",
    pincode: "600116",
    lat: 13.0381,
    lng: 80.1565,
  },
  {
    id: "loc-tirunelveli",
    zone: "Tirunelveli / Tenkasi",
    area: "Tirunelveli",
    pincode: "627001",
    lat: 8.714,
    lng: 77.7567,
  },
  {
    id: "loc-tenkasi",
    zone: "Tirunelveli / Tenkasi",
    area: "Tenkasi",
    pincode: "627401",
    lat: 8.9613,
    lng: 77.3149,
  },
  {
    id: "loc-virudhunagar",
    zone: "Madurai / Virudhunagar",
    area: "Virudhunagar",
    pincode: "626001",
    lat: 9.5372,
    lng: 77.9574,
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
const MONEY_BOXX_LISTING_AT = "2026-05-17T00:00:00.000Z";
const VIYANI_BUILDER_LISTING_AT = "2026-05-22T00:00:00.000Z";
const ELITE_EXPRESS_LISTING_AT = "2026-06-03T00:00:00.000Z";
const ELITE_EXPRESS_OPERATIONS_LISTING_AT = "2026-06-15T00:00:00.000Z";
const BABU_TESTING_TRAINING_LISTING_AT = "2026-06-06T00:00:00.000Z";

const babuTestingTrainingAssistantDescription = [
  "We are looking for a male assistant to help with software testing training coordination and seminar activities.",
  "",
  "This role can also suit someone looking for a part-time opportunity alongside their current job, as the workload is not very frequent.",
  "",
  "After 6 months, there may be an opportunity for referral to the IT sector, and you will also receive software testing training in parallel.",
  "",
  "Gender: Male candidates only.",
  "Work type: Part-time (flexible alongside another job).",
  "",
  "How to apply:",
  "Contact Babu via WhatsApp call on 8220933002.",
  "The hiring contact is currently in the UK — WhatsApp is the preferred channel.",
  "",
  "Salary was not stated on the original notice; discuss with Babu when you connect.",
].join("\n");

const moneyBoxxHlLapDescription = [
  "Urgent requirement — Money Boxx Finance Ltd (HL & LAP).",
  "",
  "Open positions:",
  "• Branch Manager",
  "• Senior Relationship Manager",
  "• Relationship Manager",
  "",
  "Product: Home Loan (HL) and Loan Against Property (LAP).",
  "",
  "Locations:",
  "Chennai Poonamallee, Kanchipuram, Vellore, Ambur, Coimbatore, Salem, Hosur, Kumbakonam, Trichy, Madurai, Theni.",
  "",
  "Qualification: 12th pass and degree.",
  "Gender: Male candidates only.",
  "Experience: Minimum 6 months in the same field (HL/LAP/NBFC sales).",
  "Joining: Immediate joiners preferred.",
  "",
  "How to apply:",
  "Send your résumé to Kamalakannang@moneyboxxfinance.com or call +91 95142 82152.",
  "",
  "Salary and CTC were not stated on the original notice; confirm with the employer when you apply.",
].join("\n");

const viyaniBuilderHindiStaffDescription = [
  "Viyani Builder Private Limited is hiring Hindi Staff for multiple locations.",
  "",
  "Position: Hindi Staff (Female Only)",
  "",
  "Qualifications:",
  "• Any Degree (General / Commerce / Science).",
  "• Must speak Hindi fluently.",
  "",
  "Age Limit:",
  "• 20 - 30 Years.",
  "",
  "Who can apply:",
  "• Freshers and experienced candidates can apply.",
  "• Good communication skills required.",
  "",
  "Locations:",
  "• Tirunelveli",
  "• Tenkasi",
  "• Virudhunagar",
  "",
  "How to apply:",
  "• Phone: 89259 04590 / 91500 83515",
  "",
  "\"Build Your Career With Us!\"",
].join("\n");

const eliteExpressSecurityStaffDescription = [
  "Elite Express Enterprises is hiring security staff for sites near DLF Ramapuram, Porur, Chennai.",
  "",
  "Open positions and monthly salary:",
  "• ASO (Assistant Security Officer) — ₹28,000",
  "• SG (Security Guard) — ₹25,000",
  "• Lady Guard — ₹22,000",
  "• Bouncers — ₹30,000",
  "• Ex-servicemen — ₹30,000",
  "",
  "Location: Nearby DLF Ramapuram, Porur.",
  "",
  "How to apply:",
  "• Call +91 99402 07385",
  "• Website: https://eliteexpressenterprises.in",
].join("\n");

const eliteExpressOperationsSupportDescription = [
  "Elite Express Enterprises is hiring for manpower coordination and operations support.",
  "",
  "Salary: ₹20,000 per month + incentives (confirm the incentive structure when you apply).",
  "",
  "Locations:",
  "• Tambaram",
  "• Perungudi",
  "• Mambakkam",
  "• OMR",
  "• ECR",
  "",
  "Requirements:",
  "• Good communication skills",
  "• Manpower coordination & operations support",
  "",
  "Who can apply:",
  "• Freshers and experienced candidates can apply.",
  "",
  "How to apply:",
  "• Call +91 99402 07385",
  "• Website: https://eliteexpressenterprises.in",
].join("\n");

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
  {
    id: "job-elite-express-security-porur-ramapuram",
    employerId: curatedEmployerEliteExpress.id,
    title: "Security staff — ASO, SG, Lady Guard, Bouncer, Ex-servicemen",
    category: "Security",
    industry: "Security Services",
    jobType: "full-time",
    salaryMin: 22000,
    salaryMax: 30000,
    locationId: "loc-porur",
    landmarkText: "Elite Express Enterprises — near DLF Ramapuram, Porur, Chennai.",
    description: eliteExpressSecurityStaffDescription,
    status: "published",
    featured: true,
    listingTier: "urgent",
    createdAt: ELITE_EXPRESS_LISTING_AT,
    updatedAt: ELITE_EXPRESS_LISTING_AT,
  },
  {
    id: "job-elite-express-operations-manpower-tambaram-omr",
    employerId: curatedEmployerEliteExpress.id,
    title: "Manpower Coordination & Operations Support",
    category: "Admin",
    industry: "Manpower / Staffing",
    jobType: "full-time",
    salaryMin: 20000,
    salaryMax: 20000,
    locationId: "loc-tambaram",
    landmarkText:
      "Elite Express Enterprises — Tambaram, Perungudi, Mambakkam, OMR & ECR corridors.",
    description: eliteExpressOperationsSupportDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: ELITE_EXPRESS_OPERATIONS_LISTING_AT,
    updatedAt: ELITE_EXPRESS_OPERATIONS_LISTING_AT,
  },
  {
    id: "job-money-boxx-hl-lap-tamil-nadu-urgent",
    employerId: curatedEmployerMoneyBoxxFinance.id,
    title:
      "Branch Manager / Senior Relationship Manager / Relationship Manager — HL & LAP",
    category: "Finance",
    industry: "NBFC",
    jobType: "full-time",
    salaryMin: 25000,
    salaryMax: 120000,
    locationId: "loc-porur",
    landmarkText:
      "Chennai Poonamallee hub plus Kanchipuram, Vellore, Ambur, Coimbatore, Salem, Hosur, Kumbakonam, Trichy, Madurai, Theni.",
    description: moneyBoxxHlLapDescription,
    status: "published",
    featured: true,
    listingTier: "urgent",
    createdAt: MONEY_BOXX_LISTING_AT,
    updatedAt: MONEY_BOXX_LISTING_AT,
  },
  {
    id: "job-viyani-builder-hindi-staff-tirunelveli",
    employerId: curatedEmployerViyaniBuilder.id,
    title: "Hindi Staff (Female Only)",
    category: "Admin",
    industry: "Real Estate",
    jobType: "full-time",
    salaryMin: null,
    salaryMax: null,
    locationId: "loc-tirunelveli",
    landmarkText: "Tirunelveli — join our growing team.",
    description: viyaniBuilderHindiStaffDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: VIYANI_BUILDER_LISTING_AT,
    updatedAt: VIYANI_BUILDER_LISTING_AT,
  },
  {
    id: "job-viyani-builder-hindi-staff-tenkasi",
    employerId: curatedEmployerViyaniBuilder.id,
    title: "Hindi Staff (Female Only)",
    category: "Admin",
    industry: "Real Estate",
    jobType: "full-time",
    salaryMin: null,
    salaryMax: null,
    locationId: "loc-tenkasi",
    landmarkText: "Tenkasi — join our growing team.",
    description: viyaniBuilderHindiStaffDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: VIYANI_BUILDER_LISTING_AT,
    updatedAt: VIYANI_BUILDER_LISTING_AT,
  },
  {
    id: "job-viyani-builder-hindi-staff-virudhunagar",
    employerId: curatedEmployerViyaniBuilder.id,
    title: "Hindi Staff (Female Only)",
    category: "Admin",
    industry: "Real Estate",
    jobType: "full-time",
    salaryMin: null,
    salaryMax: null,
    locationId: "loc-virudhunagar",
    landmarkText: "Virudhunagar — join our growing team.",
    description: viyaniBuilderHindiStaffDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: VIYANI_BUILDER_LISTING_AT,
    updatedAt: VIYANI_BUILDER_LISTING_AT,
  },
  {
    id: "job-assistant-software-testing-training-babu",
    employerId: curatedEmployerBabuTestingTraining.id,
    title: "Assistant — Software Testing Training & Seminars (Male)",
    category: "Testing / QA",
    industry: "Education & IT Training",
    jobType: "part-time",
    salaryMin: null,
    salaryMax: null,
    locationId: "loc-nungambakkam",
    landmarkText:
      "Chennai — training coordination and seminar support (city-wide; hiring contact based in the UK).",
    description: babuTestingTrainingAssistantDescription,
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: BABU_TESTING_TRAINING_LISTING_AT,
    updatedAt: BABU_TESTING_TRAINING_LISTING_AT,
  },
];

/** E.164 country code + national number, no + prefix — for `https://wa.me/`. */
const curatedWhatsAppApplyDigitsByJobId: Record<string, string> = {
  "job-office-mgr-advocate-parrys": "918248622449",
  "job-office-mgr-advocate-kilpauk": "918248622449",
  "job-skb-principal-playschool-madipakkam": "916380383563",
  "job-skb-teacher-parttime-playschool-madipakkam": "916380383563",
  "job-assistant-software-testing-training-babu": "918220933002",
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
  "job-elite-express-security-porur-ramapuram": {
    email: "external.eliteexpress@vacancychennai.in",
    phoneE164: "+919940207385",
    phoneLabel: "+91 99402 07385",
  },
  "job-elite-express-operations-manpower-tambaram-omr": {
    email: "external.eliteexpress@vacancychennai.in",
    phoneE164: "+919940207385",
    phoneLabel: "+91 99402 07385",
  },
  "job-money-boxx-hl-lap-tamil-nadu-urgent": {
    email: "Kamalakannang@moneyboxxfinance.com",
    phoneE164: "+919514282152",
    phoneLabel: "+91 95142 82152",
  },
  "job-viyani-builder-hindi-staff-tirunelveli": {
    email: "external.viyani.builder@vacancychennai.in",
    phoneE164: "+918925904590",
    phoneLabel: "+91 89259 04590",
  },
  "job-viyani-builder-hindi-staff-tenkasi": {
    email: "external.viyani.builder@vacancychennai.in",
    phoneE164: "+918925904590",
    phoneLabel: "+91 89259 04590",
  },
  "job-viyani-builder-hindi-staff-virudhunagar": {
    email: "external.viyani.builder@vacancychennai.in",
    phoneE164: "+918925904590",
    phoneLabel: "+91 89259 04590",
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
    [curatedEmployerMoneyBoxxFinance.id, curatedEmployerMoneyBoxxFinance.companyName],
    [curatedEmployerViyaniBuilder.id, curatedEmployerViyaniBuilder.companyName],
    [curatedEmployerEliteExpress.id, curatedEmployerEliteExpress.companyName],
    [curatedEmployerBabuTestingTraining.id, curatedEmployerBabuTestingTraining.companyName],
  ]);
  for (const [id, name] of curatedExternalEmployerCompanyNameMap()) {
    m.set(id, name);
  }
  return m;
}
