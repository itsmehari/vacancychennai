"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { addAudit } from "@/features/core/repository";
import { fulfillPaymentOrderById } from "@/features/billing/publish-and-fulfill";
import { isDatabaseUuid } from "@/lib/is-database-uuid";

export async function markSuperProfileOrderPaidAction(formData: FormData) {
  const admin = await requireRole("admin", "/admin/login");
  const orderId = String(formData.get("orderId") ?? "").trim();
  if (!orderId || !isDatabaseUuid(orderId)) {
    redirect("/admin/dashboard?error=invalid-order");
  }

  const r = await fulfillPaymentOrderById(orderId, `admin_${admin.actorId}`);
  if (!r.ok) {
    redirect(`/admin/dashboard?error=fulfill-${encodeURIComponent(r.error ?? "failed")}`);
  }

  await addAudit({
    actorRole: "admin",
    actorId: admin.actorId,
    action: "mark_paid",
    entityType: "payment_order",
    entityId: orderId,
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/employer/billing");
  redirect("/admin/dashboard?success=payment-marked-paid");
}
