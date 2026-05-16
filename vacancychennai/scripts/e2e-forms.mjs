/**
 * End-to-end checks for registration + form server actions and JSON API routes.
 * Requires: npm run start (or dev) on BASE_URL (default http://127.0.0.1:3000)
 *
 * Usage: node scripts/e2e-forms.mjs
 *        BASE_URL=http://localhost:3000 node scripts/e2e-forms.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const envPath = path.join(__dirname, "../.env.local");

function loadEnvLocal() {
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnvLocal();

const hasDb = Boolean(process.env.DATABASE_URL);
const hasResend = Boolean(process.env.RESEND_API_KEY);

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function skip(name, detail = "") {
  results.push({ name, ok: null, detail });
  console.log(`○ ${name} (skipped: ${detail})`);
}

/** Extract Next.js server action id from page HTML / flight payload. */
function extractActionId(html) {
  const patterns = [
    /\$ACTION_ID_([a-f0-9]{40,})/i,
    /"id":"([a-f0-9]{40,})"/,
    /Next-Action['"]\s*:\s*['"]([a-f0-9]+)['"]/i,
    /\$ACTION_([a-f0-9]{32,})/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1];
  }
  const hidden = html.match(/name="\$ACTION_[^"]*"\s+value="([^"]+)"/);
  if (hidden?.[1]) return hidden[1];
  return null;
}

async function fetchPage(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "text/html" },
    redirect: "manual",
  });
  const html = await res.text();
  return { res, html, actionId: extractActionId(html) };
}

async function submitServerAction(pagePath, actionId, fields) {
  const boundary = `----FormBoundary${Date.now()}`;
  const parts = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
    );
  }
  parts.push(`--${boundary}--\r\n`);
  const body = parts.join("");

  const res = await fetch(`${BASE}${pagePath}`, {
    method: "POST",
    headers: {
      Accept: "text/x-component",
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Next-Action": actionId,
      Origin: BASE,
      Referer: `${BASE}${pagePath}`,
    },
    body,
    redirect: "manual",
  });

  const location = res.headers.get("location") ?? res.headers.get("x-action-redirect");
  return { status: res.status, location, headers: Object.fromEntries(res.headers) };
}

async function postJson(path, payload) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function waitForServer(maxMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const r = await fetch(BASE, { redirect: "manual" });
      if (r.status < 500) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

async function testPageLoads() {
  const paths = [
    "/employer/register",
    "/employer/login",
    "/employer/forgot-password",
    "/candidate/register",
    "/candidate/login",
    "/admin/login",
    "/admin/forgot-password",
    "/subscribe",
    "/jobs/job-001",
  ];
  for (const p of paths) {
    const { res } = await fetchPage(p);
    if (res.status === 200) pass(`GET ${p}`, String(res.status));
    else fail(`GET ${p}`, `status ${res.status}`);
  }
}

async function testMockLogins() {
  if (hasDb) {
    skip("mock employer login", "DATABASE_URL set — use DB credentials");
    skip("mock candidate login", "DATABASE_URL set");
    skip("mock admin login", "DATABASE_URL set");
    return;
  }

  for (const [role, path, fields, expectPath] of [
    [
      "employer",
      "/employer/login",
      { email: "employer@vacancychennai.in", password: "demo123" },
      "/employer/dashboard",
    ],
    [
      "candidate",
      "/candidate/login",
      { email: "candidate@vacancychennai.in" },
      "/candidate/dashboard",
    ],
    [
      "admin",
      "/admin/login",
      { email: "admin@vacancychennai.in", password: "admin123" },
      "/admin/dashboard",
    ],
  ]) {
    const { html, actionId } = await fetchPage(path);
    if (!actionId) {
      fail(`${role} login action id`, "could not parse from HTML");
      continue;
    }
    const { status, location } = await submitServerAction(path, actionId, fields);
    const loc = location ?? "";
    if ((status === 303 || status === 302 || status === 307) && loc.includes(expectPath)) {
      pass(`${role} login redirect`, loc);
    } else {
      fail(`${role} login redirect`, `status=${status} location=${loc || "(none)"}`);
    }
  }
}

async function testValidationRedirects() {
  const cases = [
    {
      name: "employer register invalid (empty)",
      path: "/employer/register",
      fields: { companyName: "", fullName: "", email: "", phone: "", password: "", passwordConfirm: "" },
      expect: "error=invalid",
      needsDb: true,
    },
    {
      name: "employer register password mismatch",
      path: "/employer/register",
      fields: {
        companyName: "Test Co",
        fullName: "Test User",
        email: `e2e-${Date.now()}@example.com`,
        phone: "9876543210",
        password: "password123",
        passwordConfirm: "password456",
      },
      expect: "error=password-mismatch",
      needsDb: true,
    },
    {
      name: "candidate register invalid",
      path: "/candidate/register",
      fields: { fullName: "", email: "" },
      expect: "error=invalid",
      needsDb: true,
    },
    {
      name: "subscribe invalid email",
      path: "/subscribe",
      fields: { channel: "email_digest", address: "not-an-email" },
      expect: "error=invalid",
      needsDb: true,
    },
    {
      name: "employer login bad password (mock)",
      path: "/employer/login",
      fields: { email: "employer@vacancychennai.in", password: "wrong" },
      expect: "error=invalid",
      needsDb: false,
    },
  ];

  for (const c of cases) {
    if (c.needsDb && !hasDb) {
      skip(c.name, "no DATABASE_URL");
      continue;
    }
    if (!c.needsDb && hasDb) {
      skip(c.name, "mock-only case with DB configured");
      continue;
    }
    const { actionId } = await fetchPage(c.path);
    if (!actionId) {
      fail(c.name, "no action id");
      continue;
    }
    const { status, location } = await submitServerAction(c.path, actionId, c.fields);
    const loc = location ?? "";
    if ((status === 303 || status === 302 || status === 307) && loc.includes(c.expect)) {
      pass(c.name, loc);
    } else {
      fail(c.name, `status=${status} location=${loc || "(none)"}`);
    }
  }
}

async function testQuickApply() {
  const jobPath = "/jobs/job-001";
  const { actionId } = await fetchPage(jobPath);
  if (!actionId) {
    fail("quick apply action id", "not found on job-001");
    return;
  }
  const { status, location } = await submitServerAction(jobPath, actionId, {
    jobId: "job-001",
    applicantName: "E2E Tester",
    applicantPhone: "9000000099",
    applicantEmail: "e2e-tester@example.com",
    resumeLink: "",
  });
  const loc = location ?? "";
  if ((status === 303 || status === 302) && loc.includes("success=applied")) {
    pass("quick apply job-001", loc);
  } else {
    fail("quick apply job-001", `status=${status} location=${loc || "(none)"}`);
  }
}

async function testOtpApi() {
  const req = await postJson("/api/v1/auth/otp/request", { phone: "+919876543210" });
  if (req.status === 200 && req.json.message === "OTP sent") {
    pass("OTP request API", req.json.devOtp ? `devOtp present` : "production mode");
  } else {
    fail("OTP request API", `status ${req.status} ${JSON.stringify(req.json)}`);
  }

  const bad = await postJson("/api/v1/auth/otp/request", { phone: "x" });
  if (bad.status === 400) pass("OTP request validation", "400");
  else fail("OTP request validation", `status ${bad.status}`);

  const otp = req.json.devOtp ?? "123456";
  const verify = await postJson("/api/v1/auth/otp/verify", {
    phone: "+919876543210",
    otp,
  });
  if (verify.status === 200) pass("OTP verify API", verify.json.message);
  else fail("OTP verify API", `status ${verify.status} ${JSON.stringify(verify.json)}`);

  const badVerify = await postJson("/api/v1/auth/otp/verify", {
    phone: "+919876543210",
    otp: "000000",
  });
  if (badVerify.status === 400) pass("OTP verify invalid", "400");
  else fail("OTP verify invalid", `status ${badVerify.status}`);
}

async function testDbRegistrationDryRun() {
  if (!hasDb) {
    skip("DB employer register happy path", "no DATABASE_URL");
    skip("DB candidate register happy path", "no DATABASE_URL");
    return;
  }
  if (!hasResend) {
    skip("DB employer register happy path", "no RESEND_API_KEY (would fail email-config)");
    skip("DB candidate register happy path", "no RESEND_API_KEY");
    return;
  }

  const ts = Date.now();
  const empEmail = `e2e-employer-${ts}@vacancychennai.test`;
  const candEmail = `e2e-candidate-${ts}@vacancychennai.test`;

  const empPage = await fetchPage("/employer/register");
  if (!empPage.actionId) {
    fail("DB employer register", "no action id");
  } else {
    const emp = await submitServerAction("/employer/register", empPage.actionId, {
      companyName: "E2E Test Pvt Ltd",
      fullName: "E2E Employer",
      email: empEmail,
      phone: "9876543210",
      password: "testpass123",
      passwordConfirm: "testpass123",
    });
    const loc = emp.location ?? "";
    if ((emp.status === 303 || emp.status === 302) && loc.includes("registered=1")) {
      pass("DB employer register", loc);
    } else {
      fail("DB employer register", `status=${emp.status} location=${loc}`);
    }
  }

  const candPage = await fetchPage("/candidate/register");
  if (!candPage.actionId) {
    fail("DB candidate register", "no action id");
  } else {
    const cand = await submitServerAction("/candidate/register", candPage.actionId, {
      fullName: "E2E Candidate",
      email: candEmail,
    });
    const loc = cand.location ?? "";
    if ((cand.status === 303 || cand.status === 302) && loc.includes("sent=1")) {
      pass("DB candidate register", loc);
    } else {
      fail("DB candidate register", `status=${cand.status} location=${loc}`);
    }
  }

  const subPage = await fetchPage("/subscribe");
  if (subPage.actionId) {
    const sub = await submitServerAction("/subscribe", subPage.actionId, {
      channel: "email_digest",
      address: `e2e-digest-${ts}@vacancychennai.test`,
    });
    const loc = sub.location ?? "";
    if ((sub.status === 303 || sub.status === 302) && loc.includes("subscribed=1")) {
      pass("DB subscribe email_digest", loc);
    } else {
      fail("DB subscribe email_digest", `status=${sub.status} location=${loc}`);
    }
  }
}

async function main() {
  console.log(`E2E forms — ${BASE}`);
  console.log(`DATABASE_URL: ${hasDb ? "set" : "not set (mock mode)"}`);
  console.log(`RESEND_API_KEY: ${hasResend ? "set" : "not set"}`);
  console.log("");

  if (!(await waitForServer())) {
    console.error(`Server not reachable at ${BASE}. Run: npm run start`);
    process.exit(1);
  }

  await testPageLoads();
  await testOtpApi();
  await testValidationRedirects();
  await testMockLogins();
  await testQuickApply();
  await testDbRegistrationDryRun();

  console.log("");
  const failed = results.filter((r) => r.ok === false);
  const passed = results.filter((r) => r.ok === true);
  const skipped = results.filter((r) => r.ok === null);
  console.log(`Summary: ${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped`);
  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
