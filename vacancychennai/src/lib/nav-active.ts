/** Primary nav: home is exact; other roots match prefix (e.g. /blog, /blog/foo). */
export function isNavHrefActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isJobsExplorePath(pathname: string): boolean {
  if (pathname.startsWith("/jobs-in-")) return true;
  if (pathname === "/freshers-jobs-chennai" || pathname === "/part-time-jobs-chennai") return true;
  if (pathname === "/internships-chennai" || pathname === "/contract-jobs-chennai") return true;
  if (pathname === "/temporary-jobs-chennai" || pathname === "/areas") return true;
  if (pathname === "/salary-guide-chennai" || pathname === "/jobs-this-week" || pathname === "/share-areas") return true;
  if (pathname === "/roles" || pathname.startsWith("/roles/")) return true;
  if (pathname.startsWith("/local-job-request-")) return true;
  if (/^\/jobs\/[^/]+$/.test(pathname)) return true;
  return false;
}

/** Guides, glossary, FAQ, safety, and the salary snapshot. */
export function isGuidesNavPath(pathname: string): boolean {
  if (pathname === "/guides" || pathname.startsWith("/guides/")) return true;
  if (pathname === "/faq" || pathname === "/glossary") return true;
  if (pathname === "/how-to-apply" || pathname === "/job-safety") return true;
  return false;
}

/** “Your Profile” menu — seeker sign-in, profile, employer billing (not /post-job; see main nav). */
export function isProfileHubPath(pathname: string): boolean {
  if (pathname === "/job-seeker-profile") return true;
  if (pathname.startsWith("/candidate/") || pathname.startsWith("/employer/")) return true;
  return false;
}
