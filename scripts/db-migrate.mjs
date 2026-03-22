import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "../database/migrations");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for migrations");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

async function run() {
  await client.connect();
  await client.query(`
    create table if not exists schema_migrations (
      id serial primary key,
      filename varchar(255) unique not null,
      applied_at timestamptz not null default now()
    )
  `);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const existing = await client.query(
      "select 1 from schema_migrations where filename = $1 limit 1",
      [file],
    );
    if (existing.rowCount) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Applying migration: ${file}`);
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into schema_migrations (filename) values ($1)", [file]);
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    }
  }

  await client.end();
  console.log("Migrations completed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

