"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { addAudit } from "@/features/core/repository";
import { getJobOwnerUserId } from "@/features/billing/publish-and-fulfill";
import { dbExecute, hasDatabase } from "@/lib/db";
import { isDatabaseUuid } from "@/lib/is-database-uuid";

export async function grantEmployerPostCreditFromJobAction(formData: FormData) {
  const admin = await requireRole("admin", "/admin/login");
  if (!hasDatabase()) {
    redirect("/admin/dashboard?error=no-db");
  }
  const jobId = String(formData.get("jobId") ?? "").trim();
  if (!jobId || !isDatabaseUuid(jobId)) {
    redirect("/admin/dashboard?error=invalid-grant");
  }
  const userId = await getJobOwnerUserId(jobId);
  if (!userId) {
    redirect("/admin/dashboard?error=no-owner");
  }

  await dbExecute(
    `insert into entitlements (owner_user_id, entitlement_type, entitlement_ref, source_order_id, status, starts_at, ends_at)
     values ($1::uuid, 'post_credit', $2::text, null, 'active', now(), null)`,
    [userId, JSON.stringify({ sku: "admin_grant", credits: 1 })],
  );

  await addAudit({
    actorRole: "admin",
    actorId: admin.actorId,
    action: "grant",
    entityType: "employer_post_credit",
    entityId: userId,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/employer/billing");
  redirect("/admin/dashboard?success=grant-credit");
}
