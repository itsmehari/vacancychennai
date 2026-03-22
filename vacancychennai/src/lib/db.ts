import { Pool, QueryResultRow } from "pg";

let pool: Pool | null = null;

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
      max: 10,
    });
  }
  return pool;
}

export async function dbQuery<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<T[]> {
  const client = getPool();
  if (!client) return [];
  const result = await client.query<T>(text, values);
  return result.rows;
}

export async function dbExecute(text: string, values: unknown[] = []) {
  const client = getPool();
  if (!client) return { rowCount: 0 };
  const result = await client.query(text, values);
  return { rowCount: result.rowCount ?? 0 };
}

