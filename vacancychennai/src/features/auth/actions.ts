"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";
import { candidates, employers } from "@/features/core/mock-db";
import { dbQuery, hasDatabase } from "@/lib/db";
import { logger } from "@/lib/logger";
import { incrementMetric } from "@/lib/metrics";
import {
  clearFailedAttempts,
  getRateLimitState,
  registerFailedAttempt,
} from "@/lib/rate-limit";

async function findDbUserByEmail(email: string) {
  const rows = await dbQuery<{
    id: string;
    role: "candidate" | "employer" | "admin";
    full_name: string;
    email: string;
    password_hash: string | null;
  }>(
    `select id, role, full_name, email, password_hash
     from users
     where lower(email) = $1
     limit 1`,
    [email.toLowerCase()],
  );
  return rows[0];
}

export async function loginCandidateAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const limiterKey = `candidate:${email}`;
  const rate = getRateLimitState(limiterKey);
  if (rate.blocked) {
    redirect("/candidate/login?error=rate-limited");
  }

  if (hasDatabase()) {
    const user = await findDbUserByEmail(email);
    if (!user || user.role !== "candidate") {
      registerFailedAttempt(limiterKey);
      incrementMetric("authFailure");
      redirect("/candidate/login?error=invalid");
    }
    clearFailedAttempts(limiterKey);
    incrementMetric("authSuccess");
    await createSession({
      role: "candidate",
      actorId: user.id,
      displayName: user.full_name,
    });
    redirect("/candidate/dashboard");
  }

  const candidate = candidates.find((item) => item.email.toLowerCase() === email);
  if (!candidate) {
    registerFailedAttempt(limiterKey);
    incrementMetric("authFailure");
    redirect("/candidate/login?error=invalid");
  }
  clearFailedAttempts(limiterKey);
  incrementMetric("authSuccess");
  await createSession({
    role: "candidate",
    actorId: candidate.id,
    displayName: candidate.name,
  });
  redirect("/candidate/dashboard");
}

export async function loginEmployerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const limiterKey = `employer:${email}`;
  const rate = getRateLimitState(limiterKey);
  if (rate.blocked) {
    redirect("/employer/login?error=rate-limited");
  }

  if (hasDatabase()) {
    const user = await findDbUserByEmail(email);
    const isValid =
      !!user &&
      user.role === "employer" &&
      !!user.password_hash &&
      bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      registerFailedAttempt(limiterKey);
      incrementMetric("authFailure");
      redirect("/employer/login?error=invalid");
    }
    clearFailedAttempts(limiterKey);
    incrementMetric("authSuccess");
    await createSession({
      role: "employer",
      actorId: user.id,
      displayName: user.full_name,
    });
    redirect("/employer/dashboard");
  }

  const employer = employers.find(
    (item) =>
      item.email.toLowerCase() === email && item.password === password,
  );
  if (!employer) {
    registerFailedAttempt(limiterKey);
    incrementMetric("authFailure");
    redirect("/employer/login?error=invalid");
  }
  clearFailedAttempts(limiterKey);
  incrementMetric("authSuccess");
  await createSession({
    role: "employer",
    actorId: employer.id,
    displayName: employer.companyName,
  });
  redirect("/employer/dashboard");
}

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const limiterKey = `admin:${email}`;
  const rate = getRateLimitState(limiterKey);
  if (rate.blocked) {
    redirect("/admin/login?error=rate-limited");
  }

  if (hasDatabase()) {
    const user = await findDbUserByEmail(email);
    const isValid =
      !!user &&
      user.role === "admin" &&
      !!user.password_hash &&
      bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      registerFailedAttempt(limiterKey);
      incrementMetric("authFailure");
      redirect("/admin/login?error=invalid");
    }
    clearFailedAttempts(limiterKey);
    incrementMetric("authSuccess");
    await createSession({
      role: "admin",
      actorId: user.id,
      displayName: user.full_name,
    });
    redirect("/admin/dashboard");
  }

  if (email !== "admin@vacancychennai.in" || password !== "admin123") {
    registerFailedAttempt(limiterKey);
    incrementMetric("authFailure");
    redirect("/admin/login?error=invalid");
  }
  clearFailedAttempts(limiterKey);
  incrementMetric("authSuccess");
  await createSession({
    role: "admin",
    actorId: "admin-001",
    displayName: "Vacancy Chennai Admin",
  });
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await destroySession();
  logger.info({ event: "logout" }, "user session destroyed");
  redirect("/");
}

