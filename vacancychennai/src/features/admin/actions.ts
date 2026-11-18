"use server";

import { addAudit, setSeekerPhoneVerificationStatus } from "@/features/core/repository";
import { requireRole } from "@/lib/auth";
import { isPhoneVerificationStatus } from "@/lib/candidate-profile-constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setAdminSeekerPhoneVerificationAction(formData: FormData) {
  const admin = await requireRole("admin", "/admin/login");
  const userId = String(formData.get("userId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  if (!userId || !isPhoneVerificationStatus(status)) {
    redirect("/admin/candidates?error=invalid");
  }
  const updated = await setSeekerPhoneVerificationStatus(userId, status);
  if (!updated) redirect("/admin/candidates?error=invalid");
  await addAudit({
    actorRole: "admin",
    actorId: admin.actorId,
    action: "update",
    entityType: "candidate_phone_verification",
    entityId: userId,
  });
  revalidatePath("/admin/candidates");
  revalidatePath("/admin/dashboard");
  redirect("/admin/candidates?updated=1");
}
