import { applications, candidates, employers, jobs, locations } from "@/features/core/mock-db";
import { dbQuery, hasDatabase } from "@/lib/db";
import {
  candidateCanViewEmployerContact,
  type PhoneVerificationStatus,
} from "@/lib/candidate-profile-constants";

export type SeekerAdminRow = {
  userId: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  education: string;
  jobPreferences: string[];
  phoneVerificationStatus: PhoneVerificationStatus;
  contactReady: boolean;
  applicationCount: number;
  createdAt: string;
};

export type EmployerAdminRow = {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
  verificationStatus: string;
};

export type ApplicationAdminRow = {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  accountName: string;
  accountEmail: string;
  stage: string;
  createdAt: string;
};

export type LocalRequestAdminRow = {
  id: string;
  fullName: string;
  areaSlug: string;
  education: string;
  contactPhone: string;
  jobNeeds: string;
  createdAt: string;
};

export function formatAdminWhen(iso: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function verificationStatus(value: string | null): PhoneVerificationStatus {
  if (value === "verified" || value === "rejected") return value;
  return "pending";
}

export async function listSeekersForAdmin(): Promise<SeekerAdminRow[]> {
  if (!hasDatabase()) {
    return candidates.map((candidate) => ({
      userId: candidate.userId ?? candidate.id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      area: locations.find((location) => location.id === candidate.locationId)?.area ?? "",
      education: candidate.education,
      jobPreferences: candidate.jobPreferences,
      phoneVerificationStatus: candidate.phoneVerificationStatus,
      contactReady: candidateCanViewEmployerContact(candidate),
      applicationCount: applications.filter((application) => application.candidateId === candidate.id).length,
      createdAt: "",
    }));
  }

  const rows = await dbQuery<{
    user_id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    area: string | null;
    education: string | null;
    job_preferences: string[] | null;
    phone_verification_status: string | null;
    location_id: string | null;
    application_count: string;
    created_at: string;
  }>(
    `select u.id as user_id, u.full_name, u.email, u.phone, u.created_at,
            l.area, cp.location_id, cp.education,
            coalesce(cp.job_preferences, '{}') as job_preferences,
            coalesce(cp.phone_verification_status, 'pending') as phone_verification_status,
            (select count(*)::text from applications a where a.candidate_id = cp.id) as application_count
     from users u
     left join candidate_profiles cp on cp.user_id = u.id
     left join locations l on l.id = cp.location_id
     where u.role = 'candidate' and u.status <> 'deleted'
     order by u.created_at desc
     limit 500`,
  );

  return rows.map((row) => {
    const profile = {
      name: row.full_name,
      email: row.email ?? "",
      phone: row.phone ?? "",
      locationId: row.location_id ?? "",
      education: row.education ?? "",
      jobPreferences: row.job_preferences ?? [],
    };
    return {
      userId: row.user_id,
      name: row.full_name,
      email: row.email ?? "",
      phone: row.phone ?? "",
      area: row.area ?? "",
      education: row.education ?? "",
      jobPreferences: row.job_preferences ?? [],
      phoneVerificationStatus: verificationStatus(row.phone_verification_status),
      contactReady: candidateCanViewEmployerContact(profile),
      applicationCount: Number(row.application_count ?? 0),
      createdAt: row.created_at,
    };
  });
}

export async function listEmployersForAdmin(): Promise<EmployerAdminRow[]> {
  if (!hasDatabase()) {
    return employers.map((employer) => ({
      id: employer.id,
      companyName: employer.companyName,
      contactName: "",
      email: employer.email,
      phone: "",
      status: "catalog",
      verificationStatus: "",
    }));
  }

  const rows = await dbQuery<{
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    status: string;
    company_name: string;
    verification_status: string;
  }>(
    `select u.id, u.full_name, u.email, u.phone, u.status::text as status,
            ep.company_name, ep.verification_status
     from users u
     join employer_profiles ep on ep.user_id = u.id
     where u.role = 'employer'
     order by u.created_at desc
     limit 500`,
  );
  return rows.map((row) => ({
    id: row.id,
    companyName: row.company_name,
    contactName: row.full_name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    status: row.status,
    verificationStatus: row.verification_status,
  }));
}

export async function listApplicationsForAdmin(): Promise<ApplicationAdminRow[]> {
  if (!hasDatabase()) {
    return applications.map((application) => {
      const account = candidates.find((candidate) => candidate.id === application.candidateId);
      return {
        id: application.id,
        jobId: application.jobId,
        jobTitle: jobs.find((job) => job.id === application.jobId)?.title ?? application.jobId,
        applicantName: application.applicantName,
        applicantPhone: application.applicantPhone,
        applicantEmail: application.applicantEmail ?? "",
        accountName: account?.name ?? "",
        accountEmail: account?.email ?? "",
        stage: application.stage,
        createdAt: application.createdAt,
      };
    });
  }

  const rows = await dbQuery<{
    id: string;
    job_id: string;
    title: string | null;
    applicant_name: string;
    applicant_phone: string;
    applicant_email: string | null;
    account_name: string | null;
    account_email: string | null;
    stage: string;
    created_at: string;
  }>(
    `select a.id, a.job_id, j.title, a.applicant_name, a.applicant_phone, a.applicant_email,
            u.full_name as account_name, u.email as account_email,
            a.stage::text as stage, a.created_at
     from applications a
     left join jobs j on j.id = a.job_id
     left join candidate_profiles cp on cp.id = a.candidate_id
     left join users u on u.id = cp.user_id
     order by a.created_at desc
     limit 300`,
  );
  return rows.map((row) => ({
    id: row.id,
    jobId: row.job_id,
    jobTitle: row.title ?? "Job",
    applicantName: row.applicant_name,
    applicantPhone: row.applicant_phone,
    applicantEmail: row.applicant_email ?? "",
    accountName: row.account_name ?? "",
    accountEmail: row.account_email ?? "",
    stage: row.stage,
    createdAt: row.created_at,
  }));
}

export async function listLocalRequestsForAdmin(): Promise<LocalRequestAdminRow[]> {
  if (!hasDatabase()) return [];
  const rows = await dbQuery<{
    id: string;
    full_name: string;
    area_slug: string;
    education: string;
    contact_phone: string;
    job_needs: string;
    created_at: string;
  }>(
    `select id, full_name, area_slug, education, contact_phone, job_needs, created_at
     from local_job_requests
     order by created_at desc
     limit 200`,
  );
  return rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    areaSlug: row.area_slug,
    education: row.education,
    contactPhone: row.contact_phone,
    jobNeeds: row.job_needs,
    createdAt: row.created_at,
  }));
}
