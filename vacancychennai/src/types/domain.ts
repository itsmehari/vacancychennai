export type UserRole = "candidate" | "employer" | "admin";

export type Location = {
  id: string;
  zone: string;
  area: string;
  pincode: string;
  lat: number;
  lng: number;
};

export type JobStatus = "draft" | "review" | "published" | "paused" | "closed";

export type JobType =
  | "full-time"
  | "part-time"
  | "internship"
  | "contract"
  | "temporary";

export type Job = {
  id: string;
  employerId: string;
  title: string;
  category: string;
  industry: string;
  jobType: JobType;
  salaryMin: number;
  salaryMax: number;
  locationId: string;
  landmarkText: string;
  description: string;
  status: JobStatus;
  featured: boolean;
  listingTier: "free" | "featured" | "urgent";
  createdAt: string;
};

export type ApplicationStage =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected";

export type JobApplication = {
  id: string;
  jobId: string;
  candidateId?: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  resumeLink?: string;
  stage: ApplicationStage;
  createdAt: string;
};

export type EmployerProfile = {
  id: string;
  companyName: string;
  email: string;
  password: string;
};

export type CandidateProfile = {
  /** Employer “unlock” target: mock candidate id or DB `candidate_profiles.id`. */
  id: string;
  /** Present when using Postgres: `users.id` (session `actorId`). */
  userId?: string;
  name: string;
  phone: string;
  email: string;
  skills: string[];
  locationId: string;
  resumeUnlocked: boolean;
  profileCompleted: boolean;
  /** Short professional headline (manual entry; no CV parsing). */
  headline: string;
  experienceLevel: string;
  /** External résumé URL (Drive, portfolio, etc.). */
  resumeUrl: string;
  /** True when a résumé file is available (MVP: in-memory store; see `/api/candidate/resume`). */
  hasUploadedResumeFile: boolean;
};

export type AuditLog = {
  id: string;
  actorRole: UserRole;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

export type LanguageCode = "en" | "ta";

