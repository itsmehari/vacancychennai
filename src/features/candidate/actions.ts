"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import {
  addAuditLog,
  locations,
  unlockCandidateResume,
  updateCandidateProfile,
} from "@/features/core/mock-db";

export async function updateCandidateProfileAction(formData: FormData) {
  const candidate = await requireRole("candidate", "/candidate/login");
  const name = String(formData.get("name") ?? "").trim();
  const skills = String(formData.get("skills") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const locationId = String(formData.get("locationId") ?? "");

  if (!name || !locationId || !locations.some((location) => location.id === locationId)) {
    redirect("/candidate/dashboard?error=invalid-profile");
  }

  const updated = updateCandidateProfile(candidate.actorId, { name, skills, locationId });
  if (!updated) {
    redirect("/candidate/dashboard?error=invalid-profile");
  }

  addAuditLog({
    actorRole: "candidate",
    actorId: candidate.actorId,
    action: "update",
    entityType: "candidate_profile",
    entityId: candidate.actorId,
  });

  revalidatePath("/candidate/dashboard");
  redirect("/candidate/dashboard?success=profile-updated");
}

export async function unlockResumeAction(formData: FormData) {
  const employer = await requireRole("employer", "/employer/login");
  const candidateId = String(formData.get("candidateId") ?? "");
  const unlocked = unlockCandidateResume(candidateId);
  if (!unlocked) {
    redirect("/employer/resume-database?error=unlock-failed");
  }

  addAuditLog({
    actorRole: "employer",
    actorId: employer.actorId,
    action: "update",
    entityType: "resume_unlock",
    entityId: candidateId,
  });

  revalidatePath("/employer/resume-database");
  redirect("/employer/resume-database?success=unlocked");
}

