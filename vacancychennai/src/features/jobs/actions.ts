"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { incrementMetric } from "@/lib/metrics";
import {
  listLocations,
  addAudit,
  createJob,
  promoteOwnedJob,
  setJobStatus,
} from "@/features/core/repository";
import { JobStatus } from "@/types/domain";

export async function createJobAction(formData: FormData) {
  const employer = await requireRole("employer", "/employer/login");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const jobType = String(formData.get("jobType") ?? "full-time");
  const salaryMin = Number(formData.get("salaryMin") ?? 0);
  const salaryMax = Number(formData.get("salaryMax") ?? 0);
  const locationId = String(formData.get("locationId") ?? "").trim();
  const landmarkText = String(formData.get("landmarkText") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const availableLocations = await listLocations();
  if (
    !title ||
    !category ||
    !industry ||
    !locationId ||
    !description ||
    !availableLocations.some((location) => location.id === locationId)
  ) {
    redirect("/employer/dashboard?error=invalid-job");
  }

  let created: { id: string };
  try {
    created = await createJob({
      employerId: employer.actorId,
      title,
      category,
      industry,
      jobType: jobType as
        | "full-time"
        | "part-time"
        | "internship"
        | "contract"
        | "temporary",
      salaryMin,
      salaryMax,
      locationId,
      landmarkText,
      description,
    });
  } catch {
    redirect("/employer/dashboard?error=invalid-job");
  }

  await addAudit({
    actorRole: "employer",
    actorId: employer.actorId,
    action: "create",
    entityType: "job",
    entityId: created.id,
  });

  revalidatePath("/");
  revalidatePath("/employer/dashboard");
  logger.info({ event: "job.created", jobId: created.id }, "job created");
  redirect("/employer/dashboard?success=job-created");
}

export async function updateJobStatusAction(formData: FormData) {
  const admin = await requireRole("admin", "/admin/login");
  const jobId = String(formData.get("jobId") ?? "");
  const status = String(formData.get("status") ?? "") as JobStatus;
  const allowed: JobStatus[] = ["draft", "review", "published", "paused", "closed"];

  if (!jobId || !allowed.includes(status)) {
    redirect("/admin/dashboard?error=invalid-status");
  }

  const updated = await setJobStatus(jobId, status);
  if (!updated) {
    incrementMetric("moderationUpdates", 0);
    redirect("/admin/dashboard?error=job-not-found");
  }

  await addAudit({
    actorRole: "admin",
    actorId: admin.actorId,
    action: "status_change",
    entityType: "job",
    entityId: jobId,
  });

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  incrementMetric("moderationUpdates");
  redirect("/admin/dashboard?success=updated");
}

export async function promoteJobAction(formData: FormData) {
  const employer = await requireRole("employer", "/employer/login");
  const jobId = String(formData.get("jobId") ?? "");
  const tier = String(formData.get("tier") ?? "featured");
  const mappedTier = tier === "urgent" ? "urgent" : "featured";

  const ok = await promoteOwnedJob(jobId, employer.actorId, mappedTier);
  if (!ok) {
    redirect("/employer/dashboard?error=promotion-failed");
  }

  await addAudit({
    actorRole: "employer",
    actorId: employer.actorId,
    action: "update",
    entityType: "job_promotion",
    entityId: jobId,
  });

  revalidatePath("/");
  revalidatePath("/employer/dashboard");
  redirect("/employer/dashboard?success=promoted");
}

