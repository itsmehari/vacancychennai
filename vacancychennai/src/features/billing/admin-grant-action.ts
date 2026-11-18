"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { addAudit } from "@/features/core/repository";
import { getJobOwnerUserId } from "@/features/billing/publish-and-fulfill";
import { dbExecute, hasDatabase } from "@/lib/db";
import { isDatabaseUuid } from "@/lib/is-database-uuid";

const ADMIN_RETURN_PATHS = new Set(["/admin/dashboard", "/admin/jobs"]);

function adminReturnPath(formData: FormData) {
  const raw = String(formData.get("returnTo") ?? "").trim();
  return ADMIN_RETURN_PATHS.has(raw) ? raw : "/admin/dashboard";
}

export async function grantEmployerPostCreditFromJobAction(formData: FormData) {
  const admin = await requireRole("admin", "/admin/login");
  const returnTo = adminReturnPath(formData);
  if (!hasDatabase()) {
    redirect(`${returnTo}?error=no-db`);
  }
  const jobId = String(formData.get("jobId") ?? "").trim();
  if (!jobId || !isDatabaseUuid(jobId)) {
    redirect(`${returnTo}?error=invalid-grant`);
  }
  const userId = await getJobOwnerUserId(jobId);
  if (!userId) {
    redirect(`${returnTo}?error=no-owner`);
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
  revalidatePath("/admin/jobs");
  revalidatePath("/employer/billing");
  redirect(`${returnTo}?success=grant-credit`);
}
