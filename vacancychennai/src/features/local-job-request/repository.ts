import { dbExecute, dbQuery, hasDatabase } from "@/lib/db";
import {
  mockGetLocalJobRequestByUserId,
  mockListLocalJobRequestsByArea,
  mockUpsertLocalJobRequest,
} from "@/features/local-job-request/mock-store";
import type { LocalJobRequest } from "@/types/domain";

type DbLocalJobRequestRow = {
  id: string;
  user_id: string;
  area_slug: string;
  full_name: string;
  date_of_birth: string;
  education: string;
  location_text: string;
  experience_level: string;
  job_needs: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
};

function mapRow(row: DbLocalJobRequestRow): LocalJobRequest {
  const dob = String(row.date_of_birth).slice(0, 10);
  return {
    id: row.id,
    userId: row.user_id,
    areaSlug: row.area_slug,
    fullName: row.full_name,
    dateOfBirth: dob,
    education: row.education,
    locationText: row.location_text,
    experienceLevel: row.experience_level,
    jobNeeds: row.job_needs,
    contactPhone: row.contact_phone,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function listLocalJobRequestsByArea(areaSlug: string): Promise<LocalJobRequest[]> {
  if (!hasDatabase()) return mockListLocalJobRequestsByArea(areaSlug);
  const rows = await dbQuery<DbLocalJobRequestRow>(
    `select id, user_id, area_slug, full_name, date_of_birth, education, location_text,
            experience_level, job_needs, contact_phone, created_at, updated_at
     from local_job_requests
     where area_slug = $1
     order by created_at desc`,
    [areaSlug],
  );
  return rows.map(mapRow);
}

export async function getLocalJobRequestByUserId(userId: string): Promise<LocalJobRequest | null> {
  if (!hasDatabase()) return mockGetLocalJobRequestByUserId(userId);
  const rows = await dbQuery<DbLocalJobRequestRow>(
    `select id, user_id, area_slug, full_name, date_of_birth, education, location_text,
            experience_level, job_needs, contact_phone, created_at, updated_at
     from local_job_requests
     where user_id = $1
     limit 1`,
    [userId],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export type UpsertLocalJobRequestInput = {
  userId: string;
  areaSlug: string;
  fullName: string;
  dateOfBirth: string;
  education: string;
  locationText: string;
  experienceLevel: string;
  jobNeeds: string;
  contactPhone: string;
};

export async function upsertLocalJobRequest(input: UpsertLocalJobRequestInput): Promise<LocalJobRequest> {
  if (!hasDatabase()) {
    return mockUpsertLocalJobRequest(input);
  }

  const rows = await dbQuery<DbLocalJobRequestRow>(
    `insert into local_job_requests (
       user_id, area_slug, full_name, date_of_birth, education, location_text,
       experience_level, job_needs, contact_phone
     ) values ($1, $2, $3, $4::date, $5, $6, $7, $8, $9)
     on conflict (user_id) do update set
       area_slug = excluded.area_slug,
       full_name = excluded.full_name,
       date_of_birth = excluded.date_of_birth,
       education = excluded.education,
       location_text = excluded.location_text,
       experience_level = excluded.experience_level,
       job_needs = excluded.job_needs,
       contact_phone = excluded.contact_phone,
       updated_at = now()
     returning id, user_id, area_slug, full_name, date_of_birth, education, location_text,
               experience_level, job_needs, contact_phone, created_at, updated_at`,
    [
      input.userId,
      input.areaSlug,
      input.fullName,
      input.dateOfBirth,
      input.education,
      input.locationText,
      input.experienceLevel,
      input.jobNeeds,
      input.contactPhone,
    ],
  );
  const row = rows[0];
  if (!row) throw new Error("Failed to save local job request");
  return mapRow(row);
}

export async function findCandidateUserByEmail(email: string) {
  if (!hasDatabase()) return null;
  const rows = await dbQuery<{
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    role: string;
  }>(
    `select id, full_name, email, phone, role::text as role
     from users where lower(email) = lower($1) limit 1`,
    [email],
  );
  return rows[0] ?? null;
}

export async function findCandidateUserByPhone(phone: string) {
  if (!hasDatabase()) return null;
  const rows = await dbQuery<{
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    role: string;
  }>(
    `select id, full_name, email, phone, role::text as role
     from users where phone = $1 limit 1`,
    [phone],
  );
  return rows[0] ?? null;
}

export async function createCandidateUserForJobRequest(input: {
  fullName: string;
  email: string;
  phone: string;
}): Promise<string> {
  const inserted = await dbQuery<{ id: string }>(
    `insert into users (role, full_name, email, phone, password_hash, status)
     values ('candidate'::user_role, $1, $2, $3, null, 'active'::account_status)
     returning id`,
    [input.fullName, input.email, input.phone],
  );
  const userId = inserted[0]?.id;
  if (!userId) throw new Error("Failed to create candidate user");
  await dbExecute(`insert into candidate_profiles (user_id) values ($1) on conflict do nothing`, [
    userId,
  ]);
  return userId;
}

export async function updateCandidateUserPhone(userId: string, phone: string) {
  await dbExecute(`update users set phone = $2 where id = $1`, [userId, phone]);
}

export async function updateCandidateUserName(userId: string, fullName: string) {
  await dbExecute(`update users set full_name = $2 where id = $1`, [userId, fullName]);
}
