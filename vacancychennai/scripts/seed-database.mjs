/**
 * Load demo data into Postgres (Neon). Requires DATABASE_URL.
 * Usage: node scripts/seed-database.mjs
 *    or:  npm run db:seed
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { splitSqlStatements } from "./split-sql-statements.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Add it to .env.local or the environment.");
  process.exit(1);
}

const ssl =
  process.env.NODE_ENV === "production" || connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined;

const client = new pg.Client({ connectionString, ssl });

const sqlPath = path.join(__dirname, "../database/migrations/005_seed_demo.sql");

async function main() {
  await client.connect();
  const sql = readFileSync(sqlPath, "utf8");
  const statements = splitSqlStatements(sql);
  for (const stmt of statements) {
    await client.query(stmt);
  }
  console.log("Seed applied:", sqlPath);
  console.log("Employer: employer@vacancychennai.in / demo123");
  console.log("Admin:    admin@vacancychennai.in / admin123");
  console.log("Candidate: candidate@vacancychennai.in (email only on candidate login)");
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
