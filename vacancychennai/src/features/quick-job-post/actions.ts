"use server";

import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { isDatabaseUuid } from "@/lib/is-database-uuid";
import { logger } from "@/lib/logger";
import {
  hashQuickJobIp,
  isQuickJobStatus,
  isTooFastOrForged,
  looksLikeLinkSpam,
  normalizeQuickJobEmail,
  normalizeQuickJobPhone,
  normalizeQuickJobText,
  quickJobContentHash,
} from "@/lib/quick-job-post";
import { consumeRateLimit } from "@/lib/rate-limit";
import { isSuperAdmin } from "@/lib/super-admin-session";
import {
  countRecentQuickPosts,
  hasRecentDuplicate,
  insertQuickJobPost,
  updateQuickJobPostStatus,
} from "@/features/quick-job-post/repository";

const PHONE_DAY_LIMIT = 3;
const IP_HOUR_LIMIT = 5;

function sentUrl() {
  return "/post-job?sent=1";
}

async function requestIp() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return (first || h.get("x-real-ip") || "unknown").slice(0, 80);
}

export async function submitQuickJobPostAction(formData: FormData) {
  const honeypot = String(formData.get("vc_leave_blank") ?? "").trim();
  const startedAt = String(formData.get("started_at") ?? "");
  const phoneRaw = String(formData.get("phone") ?? "").trim();
  const emailRaw = String(formData.get("email") ?? "").trim();
  const honeypotFilled =
    honeypot.length > 0 && honeypot !== phoneRaw && honeypot !== emailRaw;
  if (honeypotFilled || isTooFastOrForged(startedAt)) {
    redirect(sentUrl());
  }

  const phone = normalizeQuickJobPhone(String(formData.get("phone") ?? ""));
  const email = normalizeQuickJobEmail(String(formData.get("email") ?? ""));
  const description = normalizeQuickJobText(String(formData.get("description") ?? ""));
  if (!phone) redirect("/post-job?error=phone");
  if (!email) redirect("/post-job?error=email");
  if (!description) redirect("/post-job?error=text");

  const ipHash = hashQuickJobIp(await requestIp());
  const memoryOk =
    consumeRateLimit(`quickpost:phone:${phone}`, PHONE_DAY_LIMIT, 24 * 60 * 60 * 1000) &&
    consumeRateLimit(`quickpost:ip:${ipHash}`, IP_HOUR_LIMIT, 60 * 60 * 1000);
  if (!memoryOk) redirect("/post-job?error=rate");

  const contentHash = quickJobContentHash(description);
  try {
    const counts = await countRecentQuickPosts({ phone, ipHash });
    if (counts.byPhone >= PHONE_DAY_LIMIT || counts.byIp >= IP_HOUR_LIMIT) {
      redirect("/post-job?error=rate");
    }
    if (await hasRecentDuplicate(phone, contentHash)) {
      redirect(sentUrl());
    }
    await insertQuickJobPost({
      phone,
      email,
      description,
      contentHash,
      ipHash,
      status: looksLikeLinkSpam(description) ? "spam" : "new",
    });
  } catch (error) {
    unstable_rethrow(error);
    logger.warn({ err: error }, "quick job post save failed");
    redirect("/post-job?error=save");
  }

  redirect(sentUrl());
}

export async function updateQuickJobPostStatusAction(formData: FormData) {
  if (!(await isSuperAdmin())) redirect("/super-admin/login");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const filter = String(formData.get("filter") ?? "new");
  const back = `/super-admin?status=${encodeURIComponent(filter)}`;
  if (!isDatabaseUuid(id) || !isQuickJobStatus(status)) {
    redirect(`${back}&error=invalid`);
  }

  await updateQuickJobPostStatus(id, status);
  redirect(`${back}&updated=1`);
}
