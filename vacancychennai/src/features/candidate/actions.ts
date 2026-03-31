"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlockCandidateResume } from "@/features/core/mock-db";
import {
  addAudit,
  listLocations,
  unlockCandidateResumeInDb,
  upsertCandidateProfileAfterEdit,
} from "@/features/core/repository";
import { requireRole } from "@/lib/auth";
import {
  HEADLINE_MAX_LENGTH,
  MAX_RESUME_BYTES,
  RESUME_ALLOWED_MIME,
  isAllowedExperienceLevel,
} from "@/lib/candidate-profile-constants";
import { hasDatabase } from "@/lib/db";
import { incrementMetric } from "@/lib/metrics";
import { allowProfileSubmit } from "@/lib/profile-submit-rate";
import { deleteResumeBuffer, setResumeBuffer } from "@/lib/resume-memory-store";

export async function updateCandidateProfileAction(formData: FormData) {
  const candidate = await requireRole("candidate", "/candidate/login");

  if (!allowProfileSubmit(`profile:${candidate.actorId}`, 20, 60_000)) {
    redirect("/candidate/dashboard?error=rate-limited");
  }

  const name = String(formData.get("name") ?? "").trim();
  const skills = String(formData.get("skills") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const locationId = String(formData.get("locationId") ?? "");
  const headline = String(formData.get("headline") ?? "").trim().slice(0, HEADLINE_MAX_LENGTH);
  const experienceLevel = String(formData.get("experienceLevel") ?? "").trim();
  const resumeUrl = String(formData.get("resumeUrl") ?? "").trim();
  const resumeFile = formData.get("resumeFile");

  const locs = await listLocations();
  if (!name || !locationId || !locs.some((location) => location.id === locationId)) {
    redirect("/candidate/dashboard?error=invalid-profile");
  }
  if (!isAllowedExperienceLevel(experienceLevel)) {
    redirect("/candidate/dashboard?error=invalid-profile");
  }

  let newResumeUploaded = false;
  if (resumeFile instanceof File && resumeFile.size > 0) {
    if (resumeFile.size > MAX_RESUME_BYTES) {
      redirect("/candidate/dashboard?error=resume-too-large");
    }
    if (!RESUME_ALLOWED_MIME.has(resumeFile.type)) {
      redirect("/candidate/dashboard?error=resume-bad-type");
    }
    const buf = Buffer.from(await resumeFile.arrayBuffer());
    deleteResumeBuffer(candidate.actorId);
    setResumeBuffer(candidate.actorId, {
      buffer: buf,
      mime: resumeFile.type,
      filename: resumeFile.name || "resume",
    });
    newResumeUploaded = true;
  }

  await upsertCandidateProfileAfterEdit({
    userId: candidate.actorId,
    name,
    skills,
    locationId,
    headline,
    experienceLevel,
    resumeUrl,
    newResumeUploaded,
  });

  await addAudit({
    actorRole: "candidate",
    actorId: candidate.actorId,
    action: "update",
    entityType: "candidate_profile",
    entityId: candidate.actorId,
  });

  revalidatePath("/candidate/dashboard");
  incrementMetric("candidateProfileUpdate");
  redirect("/candidate/dashboard?success=profile-updated");
}

export async function unlockResumeAction(formData: FormData) {
  const employer = await requireRole("employer", "/employer/login");
  const candidateId = String(formData.get("candidateId") ?? "");

  if (hasDatabase()) {
    try {
      await unlockCandidateResumeInDb(candidateId);
    } catch {
      redirect("/employer/resume-database?error=unlock-failed");
    }
  } else {
    const unlocked = unlockCandidateResume(candidateId);
    if (!unlocked) {
      redirect("/employer/resume-database?error=unlock-failed");
    }
  }

  await addAudit({
    actorRole: "employer",
    actorId: employer.actorId,
    action: "update",
    entityType: "resume_unlock",
    entityId: candidateId,
  });

  revalidatePath("/employer/resume-database");
  redirect("/employer/resume-database?success=unlocked");
}
