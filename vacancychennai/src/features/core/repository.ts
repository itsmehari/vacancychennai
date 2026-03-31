import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";
import { resumeFileKeyIndicatesUpload } from "@/lib/resume-blob";
import {
  addApplication,
  addAuditLog,
  addJob,
  applications,
  candidates,
  employers,
  getCandidateById,
  getEmployerById as getMockEmployerById,
  getJobById,
  getLocationById as getMockLocationById,
  jobs,
  locations,
  setJobFeatured,
  suggestCandidatesForJob as mockSuggestCandidatesForJob,
  updateApplicationStage,
  updateCandidateProfile,
  updateJobStatus,
} from "@/features/core/mock-db";
import type { CandidateProfile, Job, JobApplication, JobStatus } from "@/types/domain";

type DbJobRow = {
  id: string;
  employer_id: string;
  title: string;
  category: string;
  industry: string | null;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  location_id: string;
  landmark_text: string | null;
  description: string;
  status: string;
  is_featured: boolean;
  listing_tier: "free" | "featured" | "urgent";
  created_at: string;
};

function mapDbJobRow(row: DbJobRow): Job {
  return {
    id: row.id,
    employerId: row.employer_id,
    title: row.title,
    category: row.category,
    industry: row.industry ?? "",
    jobType: row.job_type.replace("_", "-") as Job["jobType"],
    salaryMin: row.salary_min ?? 0,
    salaryMax: row.salary_max ?? 0,
    locationId: row.location_id,
    landmarkText: row.landmark_text ?? "",
    description: row.description,
    status: row.status as JobStatus,
    featured: row.is_featured,
    listingTier: row.listing_tier,
    createdAt: row.created_at,
  };
}

export async function listLocations() {
  if (!hasDatabase()) return locations;
  const rows = await dbQuery<{
    id: string;
    zone: string;
    area: string;
    pincode: string;
    lat: number;
    lng: number;
  }>(`select id, zone, area, pincode, lat, lng from locations where is_active = true`);
  return rows.map((row) => ({
    id: row.id,
    zone: row.zone,
    area: row.area,
    pincode: row.pincode,
    lat: Number(row.lat),
    lng: Number(row.lng),
  }));
}

export async function listPublishedJobs(): Promise<Job[]> {
  if (!hasDatabase()) return jobs.filter((job) => job.status === "published");
  const rows = await dbQuery<DbJobRow>(
    `select * from jobs where status = 'published' order by created_at desc`,
  );
  return rows.map(mapDbJobRow);
}

/** Published jobs whose `created_at` is at or after `sinceIso` (inclusive), newest first. */
export async function listPublishedJobsCreatedSince(sinceIso: string): Promise<Job[]> {
  if (!hasDatabase()) {
    const sinceMs = new Date(sinceIso).getTime();
    return jobs
      .filter((job) => job.status === "published" && new Date(job.createdAt).getTime() >= sinceMs)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  const rows = await dbQuery<DbJobRow>(
    `select * from jobs
     where status = 'published' and created_at >= $1::timestamptz
     order by created_at desc`,
    [sinceIso],
  );
  return rows.map(mapDbJobRow);
}

export async function createJob(input: {
  employerId: string;
  title: string;
  category: string;
  industry: string;
  jobType: "full-time" | "part-time" | "internship" | "contract" | "temporary";
  salaryMin: number;
  salaryMax: number;
  locationId: string;
  landmarkText: string;
  description: string;
}) {
  if (!hasDatabase()) {
    return addJob(input);
  }
  const epRows = await dbQuery<{ id: string }>(
    `select id from employer_profiles where user_id = $1 limit 1`,
    [input.employerId],
  );
  const employerProfileId = epRows[0]?.id;
  if (!employerProfileId) {
    throw new Error("employer_profiles row missing for user; run db seed or create profile");
  }
  const rows = await dbQuery<{ id: string }>(
    `insert into jobs (
      employer_id, location_id, landmark_text, title, category, industry,
      job_type, salary_min, salary_max, description, status, listing_tier
    )
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'review','free')
    returning id`,
    [
      employerProfileId,
      input.locationId,
      input.landmarkText,
      input.title,
      input.category,
      input.industry,
      input.jobType.replace("-", "_"),
      input.salaryMin,
      input.salaryMax,
      input.description,
    ],
  );
  return { id: rows[0].id };
}

export async function setJobStatus(jobId: string, status: JobStatus) {
  if (!hasDatabase()) return updateJobStatus(jobId, status);
  await dbExecute(`update jobs set status = $2 where id = $1`, [jobId, status]);
  return { id: jobId, status };
}

export async function createApplication(input: {
  jobId: string;
  candidateId?: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  resumeLink?: string;
}) {
  if (!hasDatabase()) return addApplication(input);
  let candidateProfileId: string | null = null;
  if (input.candidateId) {
    const cp = await dbQuery<{ id: string }>(
      `select id from candidate_profiles where user_id = $1 limit 1`,
      [input.candidateId],
    );
    candidateProfileId = cp[0]?.id ?? null;
  }
  const rows = await dbQuery<{ id: string }>(
    `insert into applications (
      job_id, candidate_id, applicant_name, applicant_phone, applicant_email, resume_url
    ) values ($1,$2,$3,$4,$5,$6)
    returning id`,
    [
      input.jobId,
      candidateProfileId,
      input.applicantName,
      input.applicantPhone,
      input.applicantEmail ?? null,
      input.resumeLink ?? null,
    ],
  );
  return { id: rows[0].id };
}

export async function addAudit(input: {
  actorRole: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
}) {
  if (!hasDatabase()) {
    addAuditLog({
      actorRole: input.actorRole as "candidate" | "employer" | "admin",
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
    });
    return;
  }
  await dbExecute(
    `insert into audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
     values ($1, $2, $3, $4, '{}'::jsonb)`,
    [input.actorId, input.action, input.entityType, input.entityId],
  );
}

export async function listEmployerApplications(employerId: string) {
  if (!hasDatabase()) {
    const employerJobIds = new Set(
      jobs.filter((job) => job.employerId === employerId).map((job) => job.id),
    );
    return applications.filter((application) => employerJobIds.has(application.jobId));
  }
  const rows = await dbQuery<{
    id: string;
    job_id: string;
    applicant_name: string;
    applicant_phone: string;
    stage: "applied" | "screening" | "interview" | "offer" | "rejected";
    created_at: string;
  }>(
    `select a.id, a.job_id, a.applicant_name, a.applicant_phone, a.stage, a.created_at
     from applications a
     join jobs j on j.id = a.job_id
     where j.employer_id = (select id from employer_profiles where user_id = $1 limit 1)
     order by a.created_at desc`,
    [employerId],
  );
  return rows.map((row) => ({
    id: row.id,
    jobId: row.job_id,
    applicantName: row.applicant_name,
    applicantPhone: row.applicant_phone,
    stage: row.stage,
    createdAt: row.created_at,
  }));
}

export async function setApplicationStage(
  applicationId: string,
  stage: "applied" | "screening" | "interview" | "offer" | "rejected",
) {
  if (!hasDatabase()) return updateApplicationStage(applicationId, stage);
  await dbExecute(`update applications set stage = $2 where id = $1`, [
    applicationId,
    stage,
  ]);
  return { id: applicationId, stage };
}

export type CandidateMatchResult = {
  candidate: CandidateProfile;
  score: number;
};

/** Heuristic skill/location overlap vs job category (mock parity; works with Postgres candidates). */
export async function suggestCandidatesForJobMatches(
  jobId: string,
): Promise<CandidateMatchResult[]> {
  if (!hasDatabase()) {
    return mockSuggestCandidatesForJob(jobId);
  }
  const job = await findJob(jobId);
  if (!job) return [];
  const pool = await listCandidatesForResumeDb();
  const categoryTerms = job.category.toLowerCase().split(/\s+|\/|,/).filter(Boolean);
  return pool
    .map((candidate) => {
      const skillScore = candidate.skills.reduce((score, skill) => {
        const lower = skill.toLowerCase();
        return categoryTerms.some((term) => lower.includes(term)) ? score + 1 : score;
      }, 0);
      const locationScore = candidate.locationId && candidate.locationId === job.locationId ? 2 : 0;
      return { candidate, score: skillScore + locationScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export async function listCandidatesForResumeDb(): Promise<CandidateProfile[]> {
  if (!hasDatabase()) return candidates;
  const rows = await dbQuery<{
    profile_id: string;
    user_id: string;
    full_name: string;
    phone: string;
    email: string;
    skills: string[];
    location_id: string | null;
    bio: string | null;
    experience_level: string | null;
    resume_url: string | null;
    resume_file_key: string | null;
    profile_completed: boolean;
    resume_contacts_unlocked: boolean;
  }>(
    `select cp.id as profile_id, u.id as user_id, u.full_name, coalesce(u.phone, '') as phone, u.email,
            coalesce(cp.skills, '{}') as skills, cp.location_id, cp.bio, cp.experience_level,
            cp.resume_url, cp.resume_file_key,
            coalesce(cp.profile_completed, false) as profile_completed,
            coalesce(cp.resume_contacts_unlocked, false) as resume_contacts_unlocked
     from candidate_profiles cp
     join users u on u.id = cp.user_id
     where u.role = 'candidate' and u.status = 'active'
     order by cp.updated_at desc`,
  );
  return rows.map((row) => mapDbRowToCandidateProfile(row));
}

function mapDbRowToCandidateProfile(row: {
  profile_id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  skills: string[];
  location_id: string | null;
  bio: string | null;
  experience_level: string | null;
  resume_url: string | null;
  resume_file_key: string | null;
  profile_completed: boolean;
  resume_contacts_unlocked: boolean;
}): CandidateProfile {
  return {
    id: row.profile_id,
    userId: row.user_id,
    name: row.full_name,
    phone: row.phone,
    email: row.email,
    skills: row.skills ?? [],
    locationId: row.location_id ?? "",
    resumeUnlocked: row.resume_contacts_unlocked,
    profileCompleted: row.profile_completed,
    headline: row.bio ?? "",
    experienceLevel: row.experience_level ?? "",
    resumeUrl: row.resume_url ?? "",
    hasUploadedResumeFile: resumeFileKeyIndicatesUpload(row.resume_file_key),
  };
}

export async function getCandidateDashboardProfile(
  sessionActorId: string,
): Promise<CandidateProfile | null> {
  if (!hasDatabase()) {
    return getCandidateById(sessionActorId) ?? null;
  }
  const rows = await dbQuery<{
    user_id: string;
    profile_id: string | null;
    full_name: string;
    phone: string;
    email: string;
    skills: string[];
    location_id: string | null;
    bio: string | null;
    experience_level: string | null;
    resume_url: string | null;
    resume_file_key: string | null;
    profile_completed: boolean;
    resume_contacts_unlocked: boolean;
  }>(
    `select u.id as user_id, cp.id as profile_id, u.full_name, coalesce(u.phone, '') as phone, u.email,
            coalesce(cp.skills, '{}') as skills, cp.location_id, cp.bio, cp.experience_level,
            cp.resume_url, cp.resume_file_key,
            coalesce(cp.profile_completed, false) as profile_completed,
            coalesce(cp.resume_contacts_unlocked, false) as resume_contacts_unlocked
     from users u
     left join candidate_profiles cp on cp.user_id = u.id
     where u.id = $1
     limit 1`,
    [sessionActorId],
  );
  const row = rows[0];
  if (!row) return null;
  if (!row.profile_id) {
    return {
      id: "",
      userId: row.user_id,
      name: row.full_name,
      phone: row.phone,
      email: row.email,
      skills: [],
      locationId: "",
      resumeUnlocked: false,
      profileCompleted: false,
      headline: "",
      experienceLevel: "",
      resumeUrl: "",
      hasUploadedResumeFile: false,
    };
  }
  return mapDbRowToCandidateProfile({
    profile_id: row.profile_id,
    user_id: row.user_id,
    full_name: row.full_name,
    phone: row.phone,
    email: row.email,
    skills: row.skills,
    location_id: row.location_id,
    bio: row.bio,
    experience_level: row.experience_level,
    resume_url: row.resume_url,
    resume_file_key: row.resume_file_key,
    profile_completed: row.profile_completed,
    resume_contacts_unlocked: row.resume_contacts_unlocked,
  });
}

export async function getCandidateResumeFileKey(userId: string): Promise<string | null> {
  if (!hasDatabase()) return null;
  const rows = await dbQuery<{ resume_file_key: string | null }>(
    `select resume_file_key from candidate_profiles where user_id = $1 limit 1`,
    [userId],
  );
  return rows[0]?.resume_file_key ?? null;
}

export async function upsertCandidateProfileAfterEdit(input: {
  userId: string;
  name: string;
  skills: string[];
  locationId: string;
  headline: string;
  experienceLevel: string;
  resumeUrl: string;
  newResumeUploaded: boolean;
  /** When `newResumeUploaded`, set to blob URL or `memory:${userId}` (DB mode). Ignored for mock. */
  resumeFileStorageKey?: string | null;
}): Promise<void> {
  if (!hasDatabase()) {
    const existing = getCandidateById(input.userId);
    const hasUploadedResumeFile = input.newResumeUploaded || (existing?.hasUploadedResumeFile ?? false);
    updateCandidateProfile(input.userId, {
      name: input.name,
      skills: input.skills,
      locationId: input.locationId,
      headline: input.headline,
      experienceLevel: input.experienceLevel,
      resumeUrl: input.resumeUrl,
      hasUploadedResumeFile,
    });
    return;
  }

  const prevRows = await dbQuery<{ resume_file_key: string | null }>(
    `select resume_file_key from candidate_profiles where user_id = $1 limit 1`,
    [input.userId],
  );
  let resumeFileKey = prevRows[0]?.resume_file_key ?? null;
  if (input.newResumeUploaded) {
    resumeFileKey =
      input.resumeFileStorageKey !== undefined && input.resumeFileStorageKey !== null
        ? input.resumeFileStorageKey
        : `memory:${input.userId}`;
  }

  await dbExecute(`update users set full_name = $2, updated_at = now() where id = $1`, [
    input.userId,
    input.name,
  ]);

  await dbExecute(
    `insert into candidate_profiles (user_id, location_id, skills, bio, experience_level, resume_url, resume_file_key, profile_completed)
     values ($1, $2, $3, $4, $5, $6, $7, true)
     on conflict (user_id) do update set
       location_id = excluded.location_id,
       skills = excluded.skills,
       bio = excluded.bio,
       experience_level = excluded.experience_level,
       resume_url = excluded.resume_url,
       resume_file_key = excluded.resume_file_key,
       profile_completed = true,
       updated_at = now()`,
    [
      input.userId,
      input.locationId || null,
      input.skills,
      input.headline || null,
      input.experienceLevel || null,
      input.resumeUrl || null,
      resumeFileKey,
    ],
  );
}

export async function unlockCandidateResumeInDb(profileId: string) {
  await dbExecute(
    `update candidate_profiles set resume_contacts_unlocked = true, updated_at = now() where id = $1`,
    [profileId],
  );
}

export async function getApplyPrefillForActor(actorId: string): Promise<{
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  resumeLink: string;
  profileHeadline: string;
  skillsPreview: string;
} | null> {
  const profile = await getCandidateDashboardProfile(actorId);
  if (!profile) return null;
  const resumeLink =
    profile.resumeUrl.trim() ||
    (profile.hasUploadedResumeFile ? "/api/candidate/resume" : "");
  const skillsPreview = profile.skills.length ? profile.skills.join(", ") : "";
  return {
    applicantName: profile.name,
    applicantPhone: profile.phone,
    applicantEmail: profile.email,
    resumeLink,
    profileHeadline: profile.headline.trim(),
    skillsPreview,
  };
}

export async function findJob(jobId: string): Promise<Job | null> {
  if (!hasDatabase()) return getJobById(jobId) ?? null;
  const rows = await dbQuery<DbJobRow>(`select * from jobs where id = $1 limit 1`, [jobId]);
  const row = rows[0];
  if (!row) return null;
  return mapDbJobRow(row);
}

/** Jobs owned by employer user (`users.id` session actor). */
export async function listJobsForEmployerUser(userId: string): Promise<Job[]> {
  if (!hasDatabase()) return jobs.filter((job) => job.employerId === userId);
  const rows = await dbQuery<DbJobRow>(
    `select j.* from jobs j
     inner join employer_profiles ep on ep.id = j.employer_id
     where ep.user_id = $1
     order by j.created_at desc`,
    [userId],
  );
  return rows.map(mapDbJobRow);
}

export async function listAllJobs(): Promise<Job[]> {
  if (!hasDatabase()) return jobs;
  const rows = await dbQuery<DbJobRow>(`select * from jobs order by created_at desc`);
  return rows.map(mapDbJobRow);
}

export async function countApplications(): Promise<number> {
  if (!hasDatabase()) return applications.length;
  const rows = await dbQuery<{ c: string }>(`select count(*)::text as c from applications`);
  return Number(rows[0]?.c ?? 0);
}

export async function listApplicationsForCandidateUser(userId: string): Promise<JobApplication[]> {
  if (!hasDatabase()) {
    return applications.filter((a) => a.candidateId === userId);
  }
  const rows = await dbQuery<{
    id: string;
    job_id: string;
    applicant_name: string;
    applicant_phone: string;
    stage: JobApplication["stage"];
    created_at: string;
  }>(
    `select a.id, a.job_id, a.applicant_name, a.applicant_phone, a.stage, a.created_at
     from applications a
     inner join candidate_profiles cp on cp.id = a.candidate_id
     where cp.user_id = $1
     order by a.created_at desc`,
    [userId],
  );
  return rows.map((row) => ({
    id: row.id,
    jobId: row.job_id,
    candidateId: userId,
    applicantName: row.applicant_name,
    applicantPhone: row.applicant_phone,
    stage: row.stage,
    createdAt: row.created_at,
  }));
}

export async function promoteOwnedJob(
  jobId: string,
  employerUserId: string,
  tier: "featured" | "urgent",
): Promise<boolean> {
  if (!hasDatabase()) {
    const updated = setJobFeatured(jobId, tier);
    return Boolean(updated && updated.employerId === employerUserId);
  }
  const r = await dbExecute(
    `update jobs set is_featured = true, listing_tier = $3::listing_tier, updated_at = now()
     where id = $1 and employer_id = (select id from employer_profiles where user_id = $2 limit 1)`,
    [jobId, employerUserId, tier],
  );
  return (r.rowCount ?? 0) > 0;
}

/** Company name by `employer_profiles.id` (DB) or mock employer id. */
export async function getEmployerCompanyNameMap(): Promise<Map<string, string>> {
  if (!hasDatabase()) {
    return new Map(employers.map((e) => [e.id, e.companyName]));
  }
  const rows = await dbQuery<{ id: string; company_name: string }>(
    `select id, company_name from employer_profiles`,
  );
  return new Map(rows.map((r) => [r.id, r.company_name]));
}

export async function resolveEmployerDisplayNameForJob(job: Job): Promise<string> {
  if (!hasDatabase()) {
    return getMockEmployerById(job.employerId)?.companyName ?? "Local employer";
  }
  const rows = await dbQuery<{ company_name: string }>(
    `select company_name from employer_profiles where id = $1 limit 1`,
    [job.employerId],
  );
  return rows[0]?.company_name ?? "Local employer";
}

export async function findLocationById(locationId: string) {
  if (!hasDatabase()) return getMockLocationById(locationId);
  const rows = await dbQuery<{
    id: string;
    zone: string;
    area: string;
    pincode: string;
    lat: number;
    lng: number;
  }>(
    `select id, zone, area, pincode, lat, lng from locations where id = $1 and is_active = true limit 1`,
    [locationId],
  );
  const row = rows[0];
  if (!row) return undefined;
  return {
    id: row.id,
    zone: row.zone,
    area: row.area,
    pincode: row.pincode,
    lat: Number(row.lat),
    lng: Number(row.lng),
  };
}

