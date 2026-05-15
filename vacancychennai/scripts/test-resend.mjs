/**
 * Diagnose Resend config. Loads vacancychennai/.env.local then .cursor/project-secrets/resend.env
 * Usage: node scripts/test-resend.mjs [test-to@email.com]
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const repoRoot = path.join(root, "..");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
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

loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(repoRoot, ".cursor", "project-secrets", "resend.env"));

const key = process.env.RESEND_API_KEY?.trim();
const from = process.env.RESEND_FROM?.trim();
const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();

console.log("RESEND_API_KEY:", key ? `set (${key.slice(0, 6)}…)` : "MISSING");
console.log("RESEND_FROM:", from || "MISSING");
console.log("NEXT_PUBLIC_SITE_URL:", site || "MISSING");

if (!key || !from) {
  console.error("\nFix: set RESEND_API_KEY and RESEND_FROM in Vercel and .env.local");
  process.exit(1);
}

const to = process.argv[2]?.trim();
if (!to) {
  console.log("\nNo test recipient. Add: node scripts/test-resend.mjs you@example.com");
  process.exit(0);
}

const resend = new Resend(key);
const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "Vacancy Chennai — Resend test",
  text: "If you received this, Resend is configured correctly.",
});

if (error) {
  console.error("\nResend API error:", JSON.stringify(error, null, 2));
  process.exit(1);
}
console.log("\nOK — email accepted by Resend. id:", data?.id);
