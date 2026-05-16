import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env.local");
if (existsSync(envPath) && !process.env.DATABASE_URL) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.trim().match(/^DATABASE_URL\s*=\s*(.*)$/);
    if (m) process.env.DATABASE_URL = m[1].replace(/^["']|["']$/g, "");
  }
}

const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await c.connect();
const { rows } = await c.query(
  `select id::text, title, status from jobs where status = 'published' order by created_at desc limit 15`,
);
console.log(rows);
await c.end();
