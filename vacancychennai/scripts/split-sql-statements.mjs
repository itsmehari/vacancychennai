/**
 * Split SQL files into statements for node-pg (one query() per statement).
 * Conventions: each statement ends with ";" at end-of-line; no EOL ";" inside
 * dollar-quoted bodies in files that use this splitter (true for repo migrations).
 */
export function splitSqlStatements(sql) {
  const lines = sql.split(/\r?\n/);
  const out = [];
  let buf = [];
  for (const line of lines) {
    buf.push(line);
    const t = line.trim();
    if (t.startsWith("--") || t === "") {
      continue;
    }
    if (/;\s*$/.test(line)) {
      const stmt = buf.join("\n").trim();
      buf = [];
      if (
        stmt.split("\n").some((l) => {
          const x = l.trim();
          return x !== "" && !x.startsWith("--");
        })
      ) {
        out.push(stmt);
      }
    }
  }
  const tail = buf.join("\n").trim();
  if (
    tail &&
    tail.split("\n").some((l) => {
      const x = l.trim();
      return x !== "" && !x.startsWith("--");
    })
  ) {
    out.push(tail);
  }
  return out;
}
