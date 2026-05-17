/**
 * Smoke-test every published job detail URL (local or production).
 * Usage: node --env-file=.env.local scripts/verify-job-detail-urls.mjs
 *        BASE_URL=https://vacancychennai.in node scripts/verify-job-detail-urls.mjs
 */
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(root, "../.env.local");
if (existsSync(envPath) && !process.env.DATABASE_URL) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.trim().match(/^DATABASE_URL\s*=\s*(.*)$/);
    if (m) process.env.DATABASE_URL = m[1].replace(/^["']|["']$/g, "");
  }
}

const base = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

function stableExternalJobId(sourceUrl) {
  return `job-ext-${createHash("sha256").update(sourceUrl).digest("hex").slice(0, 14)}`;
}

/** Static curated job ids (keep in sync with static-curated-jobs.ts published rows). */
const STATIC_CURATED_JOB_IDS = [
  "job-office-mgr-advocate-parrys",
  "job-office-mgr-advocate-kilpauk",
  "job-dugout-photographer-videographer",
  "job-accounts-gst-tds-manoharan",
  "job-skb-principal-playschool-madipakkam",
  "job-skb-teacher-parttime-playschool-madipakkam",
  "job-south-indian-restaurant-navalur-urgent",
  "job-money-boxx-hl-lap-tamil-nadu-urgent",
];

function loadCuratedIds() {
  const rows = JSON.parse(
    readFileSync(path.join(root, "../src/features/core/data/external-job-rows.json"), "utf8"),
  );
  const externalIds = rows.map((r) => stableExternalJobId(r.sourceUrl));
  return [...new Set([...STATIC_CURATED_JOB_IDS, ...externalIds])];
}

async function loadDbIds() {
  if (!process.env.DATABASE_URL) return [];
  const c = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await c.connect();
  const { rows } = await c.query(
    `select id::text from jobs
     where status = 'published' and (expires_at is null or expires_at > now())`,
  );
  await c.end();
  return rows.map((r) => r.id);
}

const ids = [...new Set([...loadCuratedIds(), ...(await loadDbIds())])];
console.log(`Checking ${ids.length} job URLs at ${base} …`);

let failed = 0;
for (const id of ids) {
  const url = `${base}/jobs/${encodeURIComponent(id)}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (res.status !== 200) {
      failed += 1;
      console.log(`FAIL ${res.status} ${id}`);
    }
  } catch (e) {
    failed += 1;
    console.log(`FAIL ${e.message} ${id}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} of ${ids.length} job detail URLs failed.`);
  process.exit(1);
}
console.log(`All ${ids.length} job detail URLs returned OK.`);
