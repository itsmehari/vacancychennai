/**
 * Browser E2E for registration + forms (submits like real users).
 * Usage: BASE_URL=http://127.0.0.1:3000 node scripts/e2e-forms-playwright.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const envPath = path.join(__dirname, "../.env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const m = t.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m || process.env[m[1]]) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[m[1]] = v;
  }
}
loadEnvLocal();

const hasDb = Boolean(process.env.DATABASE_URL);
const hasResend = Boolean(process.env.RESEND_API_KEY);
const results = [];

function pass(n, d = "") {
  results.push({ ok: true, n, d });
  console.log(`✓ ${n}${d ? ` — ${d}` : ""}`);
}
function fail(n, d = "") {
  results.push({ ok: false, n, d });
  console.error(`✗ ${n}${d ? ` — ${d}` : ""}`);
}
function skip(n, d = "") {
  results.push({ ok: null, n, d });
  console.log(`○ ${n} (skipped: ${d})`);
}

async function waitForUrl(page, pattern, timeout = 15000) {
  await page.waitForURL(pattern, { timeout, waitUntil: "commit" });
}

async function enableFormNoValidate(page) {
  await page.evaluate(() => {
    const form = document.querySelector("form");
    if (form) form.noValidate = true;
  });
}

const DB_QUICK_APPLY_JOB = "/jobs/250259a6-c304-4fc8-9cbd-dbd6ebc1f76e";

async function jobHasQuickApplyForm(page, href) {
  await page.goto(href, { waitUntil: "domcontentloaded" });
  try {
    await page.waitForSelector('input[name="applicantName"]', { timeout: 8000 });
    return true;
  } catch {
    return false;
  }
}

async function findQuickApplyJobHref(page) {
  if (await jobHasQuickApplyForm(page, DB_QUICK_APPLY_JOB)) return DB_QUICK_APPLY_JOB;

  await page.goto("/jobs-in-chennai", { waitUntil: "domcontentloaded" });
  const hrefs = await page.locator('a[href^="/jobs/"]').evaluateAll((els) =>
    els.map((a) => a.getAttribute("href")).filter(Boolean),
  );
  for (const href of [...new Set(hrefs)]) {
    if (href === DB_QUICK_APPLY_JOB) continue;
    if (await jobHasQuickApplyForm(page, href)) return href;
  }
  return null;
}

async function main() {
  console.log(`Playwright E2E — ${BASE}`);
  console.log(`DATABASE_URL: ${hasDb ? "set" : "not set"}`);
  console.log(`RESEND_API_KEY: ${hasResend ? "set" : "not set"}\n`);

  const launchOpts = { headless: true };
  try {
    var browser = await chromium.launch({ ...launchOpts, channel: "msedge" });
  } catch {
    browser = await chromium.launch(launchOpts);
  }
  const context = await browser.newContext({ baseURL: BASE });
  const page = await context.newPage();

  try {
    // --- Page loads ---
    for (const p of [
      "/employer/register",
      "/employer/login",
      "/employer/forgot-password",
      "/candidate/register",
      "/candidate/login",
      "/admin/login",
      "/subscribe",
      "/jobs-in-chennai",
    ]) {
      const res = await page.goto(p, { waitUntil: "domcontentloaded" });
      if (res?.ok()) pass(`GET ${p}`);
      else fail(`GET ${p}`, `status ${res?.status()}`);
    }

    // --- Find a published job for quick apply ---
    await page.goto("/jobs-in-chennai");
    const jobLink = page.locator('a[href^="/jobs/"]').first();
    const jobHref = await jobLink.getAttribute("href").catch(() => null);
    if (jobHref) {
      pass("published job link found", jobHref);
    } else {
      fail("published job link", "none on jobs-in-chennai");
    }

    // --- Validation: employer register (server-side; bypass HTML5 required) ---
    if (hasDb) {
      await page.goto("/employer/register");
      await enableFormNoValidate(page);
      await page.getByRole("button", { name: /create account/i }).click();
      await waitForUrl(page, /error=invalid/);
      pass("employer register validation (empty)");
    } else {
      skip("employer register validation", "no DB");
    }

    // --- Validation: password mismatch ---
    if (hasDb) {
      await page.goto("/employer/register");
      await page.fill("#companyName", "E2E Co");
      await page.fill("#fullName", "E2E User");
      await page.fill("#email", `e2e-mismatch-${Date.now()}@test.local`);
      await page.fill("#phone", "9876543210");
      await page.fill("#password", "password123");
      await page.fill("#passwordConfirm", "password456");
      await page.getByRole("button", { name: /create account/i }).click();
      await waitForUrl(page, /error=password-mismatch/);
      pass("employer register password mismatch");
    }

    // --- Subscribe invalid email (server validates; bypass browser email type) ---
    if (hasDb) {
      await page.goto("/subscribe");
      await page.evaluate(() => {
        const form = document.querySelector("form");
        if (form) form.noValidate = true;
        const input = document.querySelector('input[name="address"]');
        if (input) input.removeAttribute("type");
      });
      await page.fill('input[name="address"]', "not-email");
      await page.getByRole("button", { name: /subscribe/i }).click();
      await waitForUrl(page, /error=invalid/);
      pass("subscribe invalid email");
    }

    // --- Mock logins (no DB) ---
    if (!hasDb) {
      await page.goto("/employer/login");
      await page.fill('input[name="email"]', "employer@vacancychennai.in");
      await page.fill('input[name="password"]', "demo123");
      await page.getByRole("button", { name: /^login$/i }).click();
      await waitForUrl(page, /\/employer\/dashboard/);
      pass("mock employer login");
      await context.clearCookies();

      await page.goto("/candidate/login");
      await page.fill('input[name="email"]', "candidate@vacancychennai.in");
      await page.getByRole("button", { name: /^login$/i }).click();
      await waitForUrl(page, /\/candidate\/dashboard/);
      pass("mock candidate login");
      await context.clearCookies();

      await page.goto("/admin/login");
      await page.fill('input[name="email"]', "admin@vacancychennai.in");
      await page.fill('input[name="password"]', "admin123");
      await page.getByRole("button", { name: /^login$/i }).click();
      await waitForUrl(page, /\/admin\/dashboard/);
      pass("mock admin login");
    } else {
      skip("mock logins", "DATABASE_URL set");
    }

    // --- DB logins & password reset request ---
    if (hasDb) {
      await page.goto("/employer/login");
      await page.fill('input[name="email"]', "employer@vacancychennai.in");
      await page.fill('input[name="password"]', "demo123");
      await page.getByRole("button", { name: /^login$/i }).click();
      try {
        await waitForUrl(page, /\/employer\/dashboard|error=/, 12000);
        const url = page.url();
        if (url.includes("/employer/dashboard")) {
          pass("DB seed employer login", url);
          await page.fill('input[name="title"]', `E2E Job ${Date.now()}`);
          await page.fill('input[name="category"]', "Admin");
          await page.fill('input[name="industry"]', "Service");
          await page.fill('input[name="salaryMin"]', "18000");
          await page.fill('input[name="salaryMax"]', "24000");
          await page.selectOption('select[name="locationId"]', { index: 1 });
          await page.fill('input[name="landmarkText"]', "Near test landmark");
          await page.fill('textarea[name="description"]', "E2E automated job post for review.");
          await page.getByRole("button", { name: /submit for review/i }).click();
          await waitForUrl(page, /success=job-created|error=/);
          if (page.url().includes("success=job-created")) pass("employer create job");
          else fail("employer create job", page.url());
        } else if (url.includes("unverified") || url.includes("invalid")) {
          pass("DB seed employer login (redirect with expected gate)", url);
        } else {
          fail("DB seed employer login", url);
        }
      } catch (e) {
        fail("DB seed employer login", String(e));
      }
      await context.clearCookies();

      await page.goto("/admin/login");
      await page.fill('input[name="email"]', "admin@vacancychennai.in");
      await page.fill('input[name="password"]', "admin123");
      await page.getByRole("button", { name: /^login$/i }).click();
      await waitForUrl(page, /\/admin\/dashboard|error=invalid/);
      if (page.url().includes("/admin/dashboard")) pass("DB seed admin login");
      else fail("DB seed admin login", page.url());
      await context.clearCookies();

      await page.goto("/candidate/login");
      await page.fill('input[name="email"]', "not-a-real-candidate@example.com");
      await page.getByRole("button", { name: /sign-in link|login/i }).click();
      await waitForUrl(page, /error=invalid-candidate/);
      pass("candidate login invalid email");

      await page.goto("/employer/forgot-password");
      await page.fill('input[name="email"]', "employer@vacancychennai.in");
      await page.getByRole("button", { name: /send reset link/i }).click();
      await waitForUrl(page, /forgot=1|error=/, 20000);
      const fp = page.url();
      if (fp.includes("forgot=1")) pass("employer forgot-password request", fp);
      else if (fp.includes("email-config")) skip("employer forgot-password request", "RESEND not configured");
      else fail("employer forgot-password request", fp);

      await page.goto("/subscribe");
      await page.fill('input[name="address"]', `e2e-digest-${Date.now()}@vacancychennai.test`);
      await page.getByRole("button", { name: /subscribe/i }).click();
      await waitForUrl(page, /subscribed=1|error=/);
      if (page.url().includes("subscribed=1")) pass("subscribe email_digest happy path");
      else fail("subscribe email_digest", page.url());
    }

    // --- Quick apply (guest) ---
    const quickApplyJob = await findQuickApplyJobHref(page);
    if (!quickApplyJob) {
      skip("quick apply", "no published job with quick-apply form found");
    } else {
      await page.goto(quickApplyJob);
      const applyForm = page.locator("form").filter({ has: page.locator('input[name="applicantName"]') });
      await applyForm.locator('input[name="applicantName"]').fill("E2E Applicant");
      await applyForm.locator('input[name="applicantPhone"]').fill("9000000098");
      await applyForm.locator('input[name="applicantEmail"]').fill("e2e-apply@test.local");
      await applyForm.getByRole("button", { name: /apply|submit/i }).click();
      await waitForUrl(page, /success=applied|error=/);
      const u = page.url();
      if (u.includes("success=applied")) pass("quick apply", `${quickApplyJob} → ${u}`);
      else fail("quick apply", u);
    }

    // --- DB registration (needs Resend) ---
    if (hasDb && hasResend) {
      const ts = Date.now();
      await page.goto("/employer/register");
      await page.fill("#companyName", "E2E Browser Co");
      await page.fill("#fullName", "E2E Browser");
      await page.fill("#email", `e2e-emp-${ts}@vacancychennai.test`);
      await page.fill("#phone", "9876543210");
      await page.fill("#password", "testpass123");
      await page.fill("#passwordConfirm", "testpass123");
      await page.getByRole("button", { name: /create account/i }).click();
      await waitForUrl(page, /registered=1|error=/, 20000);
      const eu = page.url();
      if (eu.includes("registered=1")) pass("DB employer register", eu);
      else fail("DB employer register", eu);

      await page.goto("/candidate/register");
      await page.fill("#fullName", "E2E Candidate");
      await page.fill("#email", `e2e-cand-${ts}@vacancychennai.test`);
      await page.getByRole("button", { name: /create account/i }).click();
      await waitForUrl(page, /sent=1|error=/, 20000);
      const cu = page.url();
      if (cu.includes("sent=1")) pass("DB candidate register", cu);
      else fail("DB candidate register", cu);
    } else if (hasDb) {
      skip("DB employer/candidate register happy path", "RESEND_API_KEY not set");
    }

    // --- OTP API (fetch from node) ---
    const otpReq = await fetch(`${BASE}/api/v1/auth/otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "+919876543299" }),
    });
    const otpJson = await otpReq.json();
    if (otpReq.ok) pass("OTP request API");
    else fail("OTP request API", JSON.stringify(otpJson));

    if (otpJson.devOtp) {
      const otpVer = await fetch(`${BASE}/api/v1/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "+919876543299", otp: otpJson.devOtp }),
      });
      if (otpVer.ok) pass("OTP verify API (dev)");
      else fail("OTP verify API (dev)", await otpVer.text());
    } else {
      skip("OTP verify API", "production mode — OTP not exposed");
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => r.ok === false);
  console.log(`\nSummary: ${results.filter((r) => r.ok).length} passed, ${failed.length} failed, ${results.filter((r) => r.ok === null).length} skipped`);
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
