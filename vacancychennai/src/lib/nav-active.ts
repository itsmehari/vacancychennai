/** Primary nav: home is exact; other roots match prefix (e.g. /blog, /blog/foo). */
export function isNavHrefActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isJobsExplorePath(pathname: string): boolean {
  if (pathname.startsWith("/jobs-in-")) return true;
  if (pathname === "/freshers-jobs-chennai" || pathname === "/part-time-jobs-chennai") return true;
  if (pathname.startsWith("/local-job-request-")) return true;
  if (/^\/jobs\/[^/]+$/.test(pathname)) return true;
  return false;
}

/** “Your Profile” menu — seeker sign-in, profile, employer billing (not /post-job; see main nav). */
export function isProfileHubPath(pathname: string): boolean {
  if (pathname === "/job-seeker-profile") return true;
  if (pathname.startsWith("/candidate/") || pathname.startsWith("/employer/")) return true;
  return false;
}
