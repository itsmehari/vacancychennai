import { hasDatabase } from "@/lib/db";

/**
 * Demo credential hints only when the app is actually using the in-memory mock auth path.
 * With DATABASE_URL set (magic link + Postgres), we show production-style copy even on localhost.
 *
 * Force hints in dev anyway: set NEXT_PUBLIC_SHOW_DEMO_LOGIN=1 (e.g. mock-only troubleshooting).
 */
export function shouldShowDemoLoginHint(): boolean {
  if (hasDatabase()) {
    return process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "1";
  }
  if (process.env.NODE_ENV === "development") return true;
  return process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "1";
}
