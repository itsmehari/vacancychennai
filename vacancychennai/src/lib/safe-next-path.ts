/** Internal return path after candidate register or password sign-in. */
export function safeCandidateNextPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let value = raw.trim();
  if (!value || value.length > 300) return null;
  try {
    value = decodeURIComponent(value);
  } catch {
    return null;
  }
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return null;
  }
  if (value.includes("\0")) return null;
  const pathOnly = value.split("?")[0] ?? "";
  if (
    pathOnly.startsWith("/super-admin") ||
    pathOnly.startsWith("/admin") ||
    pathOnly.startsWith("/api") ||
    pathOnly.startsWith("/employer")
  ) {
    return null;
  }
  return value;
}
