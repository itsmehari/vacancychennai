/**
 * Homepage + JSON-LD messaging (`/`). Root layout uses `SITE_DEFAULT_DESCRIPTION` so other routes are not forced into home-only copy.
 */

/** Fallback `description` for `layout.tsx` when a route does not export its own metadata. */
export const SITE_DEFAULT_DESCRIPTION =
  "Hyperlocal job board for Chennai — moderated listings, quick apply for job seekers, and posting tools for local employers.";

export const HOME_SEO_TITLE = "Vacancy Chennai — Hyperlocal jobs in OMR, Tambaram, Porur & more";

export const HOME_SEO_DESCRIPTION =
  "Browse moderated Chennai jobs by area, category, and job type. Free for job seekers — quick apply with name and phone, or sign in to track applications. Freshers and part-time listings.";

/** Slightly tighter for schema.org `description` fields */
export const HOME_SCHEMA_DESCRIPTION =
  "Moderated hyperlocal job listings for Chennai — OMR, Velachery, Tambaram, Porur, Ambattur and more. Quick apply; free for job seekers.";
