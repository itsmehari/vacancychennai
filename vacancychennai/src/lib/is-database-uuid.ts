/**
 * Neon/Postgres tables use `uuid` primary keys. Bundled curated rows use string ids
 * (`job-ext-*`, `job-office-*`, `emp-ext-*`, `loc-*`, `emp-001`, …). Never pass the
 * latter into queries that bind to `uuid` columns — Postgres raises 22P02.
 */
export function isDatabaseUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
