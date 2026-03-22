import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";
import {
  addApplication,
  addAuditLog,
  addJob,
  applications,
  candidates,
  getJobById,
  jobs,
  locations,
  updateApplicationStage,
  updateJobStatus,
} from "@/features/core/mock-db";
import { JobStatus } from "@/types/domain";

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

export async function listPublishedJobs() {
  if (!hasDatabase()) return jobs.filter((job) => job.status === "published");
  const rows = await dbQuery<{
    id: string;
    employer_id: string;
    title: string;
    category: string;
    industry: string;
    job_type: string;
    salary_min: number;
    salary_max: number;
    location_id: string;
    landmark_text: string;
    description: string;
    status: string;
    is_featured: boolean;
    listing_tier: "free" | "featured" | "urgent";
    created_at: string;
  }>(`select * from jobs where status = 'published' and deleted_at is null`);
  return rows.map((row) => ({
    id: row.id,
    employerId: row.employer_id,
    title: row.title,
    category: row.category,
    industry: row.industry ?? "",
    jobType: row.job_type.replace("_", "-") as
      | "full-time"
      | "part-time"
      | "internship"
      | "contract"
      | "temporary",
    salaryMin: row.salary_min ?? 0,
    salaryMax: row.salary_max ?? 0,
    locationId: row.location_id,
    landmarkText: row.landmark_text ?? "",
    description: row.description,
    status: row.status as JobStatus,
    featured: row.is_featured,
    listingTier: row.listing_tier,
    createdAt: row.created_at,
  }));
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
  const rows = await dbQuery<{ id: string }>(
    `insert into jobs (
      employer_id, location_id, landmark_text, title, category, industry,
      job_type, salary_min, salary_max, description, status, listing_tier
    )
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'review','free')
    returning id`,
    [
      input.employerId,
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
  const rows = await dbQuery<{ id: string }>(
    `insert into applications (
      job_id, candidate_id, applicant_name, applicant_phone, applicant_email, resume_url
    ) values ($1,$2,$3,$4,$5,$6)
    returning id`,
    [
      input.jobId,
      input.candidateId ?? null,
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
  return dbQuery<{
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
     where j.employer_id = $1
     order by a.created_at desc`,
    [employerId],
  );
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

export async function listCandidatesForResumeDb() {
  if (!hasDatabase()) return candidates;
  const rows = await dbQuery<{
    id: string;
    full_name: string;
    phone: string;
    email: string;
  }>(
    `select u.id, u.full_name, u.phone, u.email
     from users u
     where u.role = 'candidate' and u.status = 'active'
     order by u.created_at desc`,
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.full_name,
    phone: row.phone,
    email: row.email,
    skills: [],
    locationId: "",
    resumeUnlocked: false,
    profileCompleted: true,
  }));
}

export async function findJob(jobId: string) {
  if (!hasDatabase()) return getJobById(jobId);
  const rows = await dbQuery<{
    id: string;
    employer_id: string;
    title: string;
    category: string;
    industry: string;
    job_type: string;
    salary_min: number;
    salary_max: number;
    location_id: string;
    landmark_text: string;
    description: string;
    status: string;
    is_featured: boolean;
    listing_tier: "free" | "featured" | "urgent";
    created_at: string;
  }>(`select * from jobs where id = $1 limit 1`, [jobId]);
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    employerId: row.employer_id,
    title: row.title,
    category: row.category,
    industry: row.industry ?? "",
    jobType: row.job_type.replace("_", "-") as
      | "full-time"
      | "part-time"
      | "internship"
      | "contract"
      | "temporary",
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

