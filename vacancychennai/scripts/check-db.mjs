/**
 * Verify Postgres connectivity and summarize public schema / migrations.
 * Loads DATABASE_URL from .env.local if not already set. Does not print the URL.
 * Usage: node scripts/check-db.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../.env.local");

function loadDatabaseUrlFromEnvLocal() {
  if (process.env.DATABASE_URL) return;
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^DATABASE_URL\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[1].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    process.env.DATABASE_URL = v;
    return;
  }
}

loadDatabaseUrlFromEnvLocal();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("No DATABASE_URL: set env or add DATABASE_URL to .env.local");
  process.exit(1);
}

const hostHint = (() => {
  try {
    const u = new URL(connectionString.replace(/^postgresql:/, "http:"));
    return `${u.hostname}${u.pathname ? " (db path set)" : ""}`;
  } catch {
    return "(could not parse host)";
  }
})();

const ssl =
  process.env.NODE_ENV === "production" || connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined;

const client = new pg.Client({ connectionString, ssl });

async function main() {
  console.log("Connecting to:", hostHint);
  await client.connect();

  const {
    rows: [ping],
  } = await client.query(
    "select now() as server_time, current_database() as database, current_user as db_user",
  );
  console.log("Server time (UTC):", ping.server_time?.toISOString?.() ?? ping.server_time);
  console.log("Database:", ping.database);
  console.log("DB user:", ping.db_user);

  const { rows: tables } = await client.query(`
    select tablename
    from pg_tables
    where schemaname = 'public'
    order by tablename
  `);
  console.log("Public tables:", tables.length ? tables.map((r) => r.tablename).join(", ") : "(none)");

  const migTable = await client.query(`
    select exists (
      select 1 from information_schema.tables
      where table_schema = 'public' and table_name = 'schema_migrations'
    ) as exists
  `);
  if (migTable.rows[0]?.exists) {
    const { rows: migs } = await client.query(
      "select filename, applied_at from schema_migrations order by applied_at, filename",
    );
    console.log("Applied migrations:", migs.length);
    migs.forEach((r) => console.log(`  - ${r.filename} @ ${r.applied_at}`));
  } else {
    console.log("schema_migrations: (table not found — migrations may not have been run)");
  }

  async function countIfTable(name) {
    const exists = await client.query(
      `select exists (
        select 1 from information_schema.tables
        where table_schema = 'public' and table_name = $1
      ) as exists`,
      [name],
    );
    if (!exists.rows[0]?.exists) return null;
    const { rows } = await client.query(`select count(*)::int as c from ${name}`);
    return rows[0]?.c ?? 0;
  }

  for (const t of ["users", "jobs", "locations", "candidate_profiles"]) {
    const c = await countIfTable(t);
    if (c !== null) console.log(`Row count ${t}:`, c);
  }

  await client.end();
  console.log("OK — database reachable.");
}

main().catch((err) => {
  console.error("DB check failed:", err.message || err);
  process.exit(1);
});
