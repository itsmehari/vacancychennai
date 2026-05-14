/**
 * Canonical origin for sitemap, robots, and absolute URLs (Google Search Console).
 * No trailing slash; ensures a scheme is present.
 */
export function getCanonicalSiteBase(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vacancychennai.in").trim();
  let base = raw.replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base.replace(/^\/+/, "")}`;
  }
  return base.replace(/\/+$/, "");
}

/** Absolute URL for a path starting with `/`. */
export function absoluteUrl(path: string): string {
  const base = getCanonicalSiteBase();
  if (!path || path === "/") {
    return `${base}/`;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
