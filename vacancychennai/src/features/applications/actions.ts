"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession, requireRole } from "@/lib/auth";
import {
  addAudit,
  createApplication,
  findJob,
  listEmployerApplications,
  setApplicationStage,
} from "@/features/core/repository";
import { isCuratedExternalApplyUrlJob } from "@/features/core/curated-external-job-postings";
import {
  isCuratedDirectEmployerContactJob,
  isCuratedWhatsAppOnlyJob,
} from "@/features/core/static-curated-jobs";
import { incrementMetric } from "@/lib/metrics";

export async function quickApplyAction(formData: FormData) {
  const jobId = String(formData.get("jobId") ?? "").trim();
  const applicantName = String(formData.get("applicantName") ?? "").trim();
  const applicantPhone = String(formData.get("applicantPhone") ?? "").trim();
  const applicantEmail = String(formData.get("applicantEmail") ?? "").trim();
  const resumeLink = String(formData.get("resumeLink") ?? "").trim();

  const job = await findJob(jobId);
  if (!job || job.status !== "published" || !applicantName || !applicantPhone) {
    incrementMetric("applyFailure");
    redirect(`/jobs/${jobId}?error=invalid-application`);
  }

  if (isCuratedWhatsAppOnlyJob(jobId)) {
    incrementMetric("applyFailure");
    redirect(`/jobs/${jobId}?error=whatsapp-only`);
  }

  if (isCuratedDirectEmployerContactJob(jobId)) {
    incrementMetric("applyFailure");
    redirect(`/jobs/${jobId}?error=direct-employer-contact`);
  }

  if (isCuratedExternalApplyUrlJob(jobId)) {
    incrementMetric("applyFailure");
    redirect(`/jobs/${jobId}?error=external-apply-url`);
  }

  const session = await getSession();
  const created = await createApplication({
    jobId,
    candidateId: session?.role === "candidate" ? session.actorId : undefined,
    applicantName,
    applicantPhone,
    applicantEmail: applicantEmail || undefined,
    resumeLink: resumeLink || undefined,
  });

  await addAudit({
    actorRole: session?.role ?? "candidate",
    actorId: session?.actorId ?? "guest",
    action: "create",
    entityType: "application",
    entityId: created.id,
  });

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/candidate/dashboard");
  incrementMetric("applySuccess");
  redirect(`/jobs/${jobId}?success=applied`);
}

export async function updateApplicationStageAction(formData: FormData) {
  const employer = await requireRole("employer", "/employer/login");
  const applicationId = String(formData.get("applicationId") ?? "");
  const stage = String(formData.get("stage") ?? "");
  const allowed = ["applied", "screening", "interview", "offer", "rejected"];
  if (!allowed.includes(stage)) {
    redirect("/employer/dashboard?error=invalid-stage");
  }

  const employerApplications = await listEmployerApplications(employer.actorId);
  if (!employerApplications.some((item) => item.id === applicationId)) {
    redirect("/employer/dashboard?error=invalid-application");
  }

  const updated = await setApplicationStage(
    applicationId,
    stage as "applied" | "screening" | "interview" | "offer" | "rejected",
  );
  if (!updated) {
    redirect("/employer/dashboard?error=invalid-application");
  }

  const auditId =
    typeof updated === "object" && updated !== null && "id" in updated
      ? String((updated as { id: string }).id)
      : applicationId;
  await addAudit({
    actorRole: "employer",
    actorId: employer.actorId,
    action: "update",
    entityType: "application",
    entityId: auditId,
  });

  revalidatePath("/employer/dashboard");
  redirect("/employer/dashboard?success=app-updated");
}

