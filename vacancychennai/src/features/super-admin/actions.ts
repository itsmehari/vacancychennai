"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearFailedAttempts,
  getRateLimitState,
  registerFailedAttempt,
} from "@/lib/rate-limit";
import { addAudit, setSeekerPhoneVerificationStatus } from "@/features/core/repository";
import { isPhoneVerificationStatus } from "@/lib/candidate-profile-constants";
import {
  createSuperAdminSession,
  destroySuperAdminSession,
  isSuperAdmin,
  secretsMatch,
  superAdminEmail,
  superAdminPassword,
  superAdminUsername,
} from "@/lib/super-admin-session";

async function requestIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return (first || h.get("x-real-ip") || "unknown").slice(0, 80);
}

export async function superAdminLoginAction(formData: FormData) {
  const ip = await requestIp();
  const key = `super-admin:${ip}`;
  if (getRateLimitState(key).blocked) {
    redirect("/super-admin/login?error=rate");
  }

  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const legacyName = superAdminUsername();
  const usernameOk =
    secretsMatch(username, superAdminEmail()) ||
    (legacyName.length > 0 && secretsMatch(username, legacyName));
  const passwordOk = secretsMatch(password, superAdminPassword());
  if (!usernameOk || !passwordOk) {
    registerFailedAttempt(key, { maxAttempts: 8, blockMs: 15 * 60 * 1000 });
    redirect("/super-admin/login?error=invalid");
  }

  clearFailedAttempts(key);
  await createSuperAdminSession();
  redirect("/super-admin");
}

export async function superAdminLogoutAction() {
  await destroySuperAdminSession();
  redirect("/super-admin/login");
}

export async function setSeekerPhoneVerificationAction(formData: FormData) {
  if (!(await isSuperAdmin())) redirect("/super-admin/login");
  const userId = String(formData.get("userId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  if (!userId || !isPhoneVerificationStatus(status)) {
    redirect("/super-admin/candidates?error=invalid");
  }
  const updated = await setSeekerPhoneVerificationStatus(userId, status);
  if (!updated) redirect("/super-admin/candidates?error=invalid");
  await addAudit({
    actorRole: "admin",
    actorId: "super-admin",
    action: "update",
    entityType: "candidate_phone_verification",
    entityId: userId,
  });
  redirect("/super-admin/candidates?updated=1");
}
