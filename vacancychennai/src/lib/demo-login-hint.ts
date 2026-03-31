/**
 * Demo credential hints must never appear in production by default.
 * Enable locally via NODE_ENV=development, or explicitly via NEXT_PUBLIC_SHOW_DEMO_LOGIN=1.
 */
export function shouldShowDemoLoginHint(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "1";
}
