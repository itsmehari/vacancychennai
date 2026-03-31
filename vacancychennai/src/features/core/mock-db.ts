import {
  AuditLog,
  CandidateProfile,
  EmployerProfile,
  Job,
  JobApplication,
  JobStatus,
  Location,
} from "@/types/domain";

const now = () => new Date().toISOString();

export const locations: Location[] = [
  {
    id: "loc-omr-sholinganallur",
    zone: "OMR / ECR",
    area: "Sholinganallur",
    pincode: "600119",
    lat: 12.901,
    lng: 80.2279,
  },
  {
    id: "loc-velachery",
    zone: "OMR / ECR",
    area: "Velachery",
    pincode: "600042",
    lat: 12.9759,
    lng: 80.2212,
  },
  {
    id: "loc-tambaram",
    zone: "Tambaram / Chromepet",
    area: "Tambaram",
    pincode: "600045",
    lat: 12.9249,
    lng: 80.1000,
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
    id: "loc-ambattur",
    zone: "Ambattur / Avadi",
    area: "Ambattur",
    pincode: "600053",
    lat: 13.1143,
    lng: 80.1548,
  },
];

export const employers: EmployerProfile[] = [
  {
    id: "emp-001",
    companyName: "OMR Tech Solutions",
    email: "employer@vacancychennai.in",
    password: "demo123",
  },
];

export const candidates: CandidateProfile[] = [
  {
    id: "cand-001",
    name: "Demo Candidate",
    phone: "9000000001",
    email: "candidate@vacancychennai.in",
    skills: ["MS Office", "Telecalling"],
    locationId: "loc-velachery",
    resumeUnlocked: false,
    profileCompleted: false,
    headline: "",
    experienceLevel: "",
    resumeUrl: "",
    hasUploadedResumeFile: false,
  },
  {
    id: "cand-002",
    name: "Aishwarya S",
    phone: "9000000002",
    email: "aish@candidate.in",
    skills: ["Excel", "Sales"],
    locationId: "loc-tambaram",
    resumeUnlocked: false,
    profileCompleted: true,
    headline: "Sales & retail — Tambaram",
    experienceLevel: "y1_3",
    resumeUrl: "",
    hasUploadedResumeFile: false,
  },
];

export const jobs: Job[] = [
  {
    id: "job-001",
    employerId: "emp-001",
    title: "Customer Support Executive",
    category: "BPO / Telecaller",
    industry: "Service",
    jobType: "full-time",
    salaryMin: 18000,
    salaryMax: 24000,
    locationId: "loc-velachery",
    landmarkText: "Near Velachery Bus Stand",
    description: "Handle inbound customer calls and update CRM entries.",
    status: "published",
    featured: true,
    listingTier: "featured",
    createdAt: now(),
  },
  {
    id: "job-002",
    employerId: "emp-001",
    title: "Delivery Associate",
    category: "Logistics",
    industry: "E-commerce",
    jobType: "part-time",
    salaryMin: 15000,
    salaryMax: 22000,
    locationId: "loc-tambaram",
    landmarkText: "Near Railway Station",
    description: "Handle last-mile deliveries for local order clusters.",
    status: "published",
    featured: false,
    listingTier: "free",
    createdAt: now(),
  },
  {
    id: "job-003",
    employerId: "emp-001",
    title: "Junior IT Support",
    category: "IT Support",
    industry: "IT",
    jobType: "full-time",
    salaryMin: 20000,
    salaryMax: 30000,
    locationId: "loc-omr-sholinganallur",
    landmarkText: "Near SIPCOT",
    description: "Troubleshoot laptops and internal software tickets.",
    status: "review",
    featured: false,
    listingTier: "free",
    createdAt: now(),
  },
];

export const applications: JobApplication[] = [
  {
    id: "app-001",
    jobId: "job-001",
    candidateId: "cand-001",
    applicantName: "Demo Candidate",
    applicantPhone: "9000000001",
    applicantEmail: "candidate@vacancychennai.in",
    stage: "screening",
    createdAt: now(),
  },
];

export const auditLogs: AuditLog[] = [];

export function getLocationById(id: string) {
  return locations.find((location) => location.id === id);
}

export function getLocationByAreaSlug(slug: string) {
  const normalized = slug.replaceAll("-", " ").toLowerCase();
  return locations.find((location) => location.area.toLowerCase() === normalized);
}

export function getEmployerById(id: string) {
  return employers.find((e) => e.id === id);
}

export function getPublishedJobs() {
  return jobs.filter((job) => job.status === "published");
}

/** When no published jobs exist, category chips still show common Chennai market labels. */
export const FALLBACK_CATEGORY_LABELS = [
  "BPO / Telecaller",
  "Retail",
  "Delivery / Logistics",
  "Admin",
  "IT Support",
] as const;

export function getPublishedJobsCount(): number {
  return getPublishedJobs().length;
}

export function getFeaturedPublishedJobs(limit = 6): Job[] {
  const featured = getPublishedJobs()
    .filter((job) => job.featured)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return featured.slice(0, limit);
}

export function getUniqueCategoriesFromPublished(): string[] {
  const published = getPublishedJobs();
  const set = new Set<string>();
  for (const job of published) {
    set.add(job.category);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * Categories for homepage chips: from published jobs, or fallback when empty (e.g. dev seed).
 */
export function getCategoriesForHomeChips(): string[] {
  const unique = getUniqueCategoriesFromPublished();
  if (unique.length > 0) return unique;
  return [...FALLBACK_CATEGORY_LABELS];
}

type JobFilter = {
  locationSlug?: string;
  category?: string;
  jobType?: string;
  salaryMin?: number;
  salaryMax?: number;
};

export function filterPublishedJobs(filters: JobFilter) {
  let filtered = getPublishedJobs();
  if (filters.locationSlug) {
    filtered = getPublishedJobsByLocationSlug(filters.locationSlug);
  }
  if (filters.category) {
    filtered = filtered.filter((job) =>
      job.category.toLowerCase().includes(filters.category!.toLowerCase()),
    );
  }
  if (filters.jobType) {
    filtered = filtered.filter((job) => job.jobType === filters.jobType);
  }
  if (typeof filters.salaryMin === "number" && !Number.isNaN(filters.salaryMin)) {
    filtered = filtered.filter((job) => job.salaryMax >= filters.salaryMin!);
  }
  if (typeof filters.salaryMax === "number" && !Number.isNaN(filters.salaryMax)) {
    filtered = filtered.filter((job) => job.salaryMin <= filters.salaryMax!);
  }
  return filtered;
}

export function getPublishedJobsByLocationSlug(slug: string) {
  const location = getLocationByAreaSlug(slug);
  if (location) {
    return jobs.filter(
      (job) => job.status === "published" && job.locationId === location.id,
    );
  }

  const zoneSlug = slug.toLowerCase();
  return jobs.filter((job) => {
    const loc = getLocationById(job.locationId);
    if (!loc || job.status !== "published") return false;
    return loc.zone.toLowerCase().includes(zoneSlug.replaceAll("-", " "));
  });
}

export function getJobById(id: string) {
  return jobs.find((job) => job.id === id);
}

export function addJob(
  job: Omit<Job, "id" | "status" | "featured" | "listingTier" | "createdAt">,
): Job {
  const created: Job = {
    ...job,
    id: `job-${String(jobs.length + 1).padStart(3, "0")}`,
    status: "review",
    featured: false,
    listingTier: "free",
    createdAt: now(),
  };
  jobs.unshift(created);
  return created;
}

export function updateJobStatus(jobId: string, status: JobStatus) {
  const target = jobs.find((job) => job.id === jobId);
  if (!target) return undefined;
  target.status = status;
  return target;
}

export function addApplication(
  payload: Omit<JobApplication, "id" | "stage" | "createdAt">,
) {
  const created: JobApplication = {
    ...payload,
    id: `app-${String(applications.length + 1).padStart(3, "0")}`,
    stage: "applied",
    createdAt: now(),
  };
  applications.unshift(created);
  return created;
}

export function updateApplicationStage(
  applicationId: string,
  stage: "applied" | "screening" | "interview" | "offer" | "rejected",
) {
  const application = applications.find((item) => item.id === applicationId);
  if (!application) return undefined;
  application.stage = stage;
  return application;
}

export function setJobFeatured(jobId: string, tier: "featured" | "urgent") {
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return undefined;
  job.featured = true;
  job.listingTier = tier;
  return job;
}

export type CandidateProfileUpdatePayload = {
  name: string;
  skills: string[];
  locationId: string;
  headline: string;
  experienceLevel: string;
  resumeUrl: string;
  hasUploadedResumeFile?: boolean;
};

export function updateCandidateProfile(
  candidateId: string,
  payload: CandidateProfileUpdatePayload,
) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return undefined;
  candidate.name = payload.name;
  candidate.skills = payload.skills;
  candidate.locationId = payload.locationId;
  candidate.headline = payload.headline;
  candidate.experienceLevel = payload.experienceLevel;
  candidate.resumeUrl = payload.resumeUrl;
  if (typeof payload.hasUploadedResumeFile === "boolean") {
    candidate.hasUploadedResumeFile = payload.hasUploadedResumeFile;
  }
  candidate.profileCompleted = true;
  return candidate;
}

export function getCandidateById(candidateId: string) {
  return candidates.find((candidate) => candidate.id === candidateId);
}

export function unlockCandidateResume(candidateId: string) {
  const candidate = candidates.find((item) => item.id === candidateId);
  if (!candidate) return undefined;
  candidate.resumeUnlocked = true;
  return candidate;
}

export function getApplicationsForEmployer(employerId: string) {
  const employerJobIds = new Set(
    jobs.filter((job) => job.employerId === employerId).map((job) => job.id),
  );
  return applications.filter((application) => employerJobIds.has(application.jobId));
}

export function suggestCandidatesForJob(jobId: string) {
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return [];
  const categoryTerms = job.category.toLowerCase().split(/\s+|\/|,/).filter(Boolean);
  return candidates
    .map((candidate) => {
      const skillScore = candidate.skills.reduce((score, skill) => {
        const lower = skill.toLowerCase();
        return categoryTerms.some((term) => lower.includes(term)) ? score + 1 : score;
      }, 0);
      const locationScore = candidate.locationId === job.locationId ? 2 : 0;
      return {
        candidate,
        score: skillScore + locationScore,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function addAuditLog(log: Omit<AuditLog, "id" | "createdAt">) {
  auditLogs.unshift({
    ...log,
    id: `log-${String(auditLogs.length + 1).padStart(4, "0")}`,
    createdAt: now(),
  });
}

