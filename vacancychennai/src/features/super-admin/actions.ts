"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearFailedAttempts,
  getRateLimitState,
  registerFailedAttempt,
} from "@/lib/rate-limit";
import {
  createSuperAdminSession,
  destroySuperAdminSession,
  secretsMatch,
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

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const usernameOk = secretsMatch(username, superAdminUsername());
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
