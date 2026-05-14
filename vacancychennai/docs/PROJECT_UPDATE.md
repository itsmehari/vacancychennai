## 2026-05 — Employer billing (SuperProfile links), publish gate, pricing

- **`010_billing_listing_usage.sql`:** `jobs.published_at`, `expires_at`, `billing_source`; `entitlement_usages`; `payment_orders.provider_payment_id` unique for idempotency.
- **SKU catalog:** [`src/lib/billing/skus.ts`](../src/lib/billing/skus.ts); policy [`docs/EMPLOYER_BILLING_POLICY.md`](./EMPLOYER_BILLING_POLICY.md).
- **APIs:** `POST /api/billing/checkout` (single SuperProfile URL via `SUPERPROFILE_PAYMENT_URL`), optional `POST /api/billing/webhook/superprofile`; cron **`/api/cron/billing`** (pass expiry emails when Resend is set).
- **Gates:** `BILLING_ENFORCED` + `resolvePublishBilling` on admin publish; `employerEligibleForPremiumTier` before listing tier promote.
- **UI:** `/employer/billing`, homepage **`HomeEmployerPricingStrip`**, `/pricing` tier + FAQ refresh; admin **grant 1 credit** + **Mark paid** for SuperProfile pending orders; nav profile link to billing.
- **Docs:** [`BILLING_SMOKE_TESTS.md`](./BILLING_SMOKE_TESTS.md), [`MARKETING_90D_CHENNAI.md`](./MARKETING_90D_CHENNAI.md), [`BILLING_OPS_RUNBOOK.md`](./BILLING_OPS_RUNBOOK.md). **Env:** `SUPERPROFILE_PAYMENT_URL` (HTTPS), optional `SUPERPROFILE_WEBHOOK_SECRET`, `BILLING_ENFORCED`.

---

### Identity

- **`docs/candidate-identity-decision.md`:** Documents **login-first** default; guest email-keyed profile deferred. **`job-seeker-profile-plan.md`** section 7 updated.

### Résumé storage

- **`@vercel/blob`:** Private upload when **`BLOB_READ_WRITE_TOKEN`** + **`DATABASE_URL`**; **`resume_file_key`** holds blob URL; replace deletes prior blob if path contains `/resumes/{userId}/`.
- **Fallback:** In-memory **`resume-memory-store`** + `memory:{userId}` when Blob token unset (local dev).
- **`src/lib/resume-blob.ts`**, **`GET /api/candidate/resume`:** Stream private blob or memory; **`getCandidateResumeFileKey`**, **`upsertCandidateProfileAfterEdit(..., resumeFileStorageKey)`**.

### Apply + marketing

- **`getApplyPrefillForActor`:** Adds **`profileHeadline`** + **`skillsPreview`**; job detail shows “From your profile”.
- **`JobSeekerProfileCta` / link:** **`/jobs-in-chennai`**, **`/freshers-jobs-chennai`**, **`/part-time-jobs-chennai`**; home hero line to **`/job-seeker-profile`**.

### Copy / docs

- **`/privacy`**, **`/employer/resume-database`:** Align with who sees résumé links vs uploaded files.
- **`README.md`** Phase 2 backlog, **`.env.example`** `BLOB_READ_WRITE_TOKEN`, **`docs/LEARNING.md`**.

---

## 2026-03 — Admin password reset, scheduled digests/SMS, Next.js proxy

### Admin auth

- **`008_admin_password_reset_purpose.sql`:** `email_verification_tokens.purpose` may include **`admin_password_reset`**.
- **`verification-tokens.ts`:** `validateAdminPasswordResetToken`, `finalizeAdminPasswordReset`; **`send-auth-email.ts`:** `sendAdminPasswordResetEmail` → `/admin/reset-password?token=…`.
- **`account-actions.ts`:** `requestAdminPasswordResetAction`, `resetAdminPasswordAction` (rate limits + Resend parity with employer reset).
- **Pages:** `/admin/forgot-password`, `/admin/reset-password`; admin login **Forgot password?** plus `?reset=1` / `?forgot=1` info banners.
- **`auth-login-errors.ts`:** Generic success copy for password-reset email sent (`forgot=1`) so employer and admin share wording.

### Scheduled notifications (cron)

- **`/api/cron/notifications`:** Secured with **`CRON_SECRET`** (`Authorization: Bearer` or `?secret=`). Runs **`runScheduledNotifications`**: loads **`email_subscriptions`**, **`listPublishedJobsCreatedSince`** (window from **`NOTIFICATION_DIGEST_WINDOW_HOURS`**, default 24h).
- **Email:** `send-digest-email.ts` → Resend digest to deduped addresses (`email_digest` + `job_alerts`).
- **SMS:** `twilio-sms.ts` when Twilio env is set; else optional **`ADMIN_SMS_DIGEST_EMAIL`** fallback email listing SMS subscriber numbers.
- **`vercel.json`:** Daily cron path to the notifications API (UTC schedule in file).
- **`.env.example`:** Documents cron, Twilio, digest window, fallback email.

### Next.js 16 convention

- **`src/middleware.ts` removed; `src/proxy.ts` added** — `export function proxy` + same matcher (city / request-id headers). Removes build deprecation warning for the old middleware file name.

### Docs

- **`docs/LEARNING.md`**, **`docs/PROJECT_UPDATE.md`**, **`AGENTS.md`**, **vacancychennai-proj-skill**, root **`LEARNING.md` / `PROJECT_UPDATE.md` pointers**, and **`.cursor/skills/nextjs-16-proxy-migration/SKILL.md`** updated.

---

## 2026-04 — Postgres parity gaps, audits, hyperlocal route hardening

### Repository and APIs

- **`src/features/core/repository.ts`:** Added **`suggestCandidatesForJobMatches`** (DB path mirrors mock heuristics; mock still delegates to `mock-db` when no DB).
- **`GET /api/v1/distribution/whatsapp`:** Uses **`listPublishedJobs`** + **`listLocations`** from the repository (no direct mock job/location getters when wired for production).
- **`POST` (and related) `/api/v1/ai/match`:** Uses async repository matching instead of sync mock-only calls.
- **`/api/v1/employer/bulk-jobs`:** When **`hasDatabase()`**, validates location ids against **`listLocations()`**, uses **`createJob`** + **`addAudit`**; mock path unchanged.

### Server actions

- **`src/features/applications/actions.ts`:** Stage updates audit via **`addAudit`** only (removed stray mock **`addAuditLog`** usage).
- **`src/features/candidate/actions.ts`:** Profile updates use **`await addAudit`** for **`candidate_profile`**; resume unlock already used **`addAudit`**. Location validation uses **`listLocations()`** from the repository.

### Employer UI

- **`src/app/(employer)/employer/dashboard/page.tsx`:** “AI match” blocks always load via **`suggestCandidatesForJobMatches`** (no `hasDatabase()` gate that skipped suggestions when DB was on).

### Hyperlocal SEO / routing

- **`src/app/[locationPage]/page.tsx`:** **`getLocationByAreaSlug`** + **`listLocations()`** in **`generateMetadata`** and the page — unknown **`/jobs-in-*`** slugs return **404** with not-found metadata instead of abusing the zone substring fallback inside **`filterPublishedJobList`** (which could match trivial substrings like **`e`** inside zone names).

### Docs

- **`docs/LEARNING.md`**, **`docs/PROJECT_UPDATE.md`**, **`AGENTS.md`**, and **vacancychennai-proj-skill** updated for the above patterns.

---

## 2026-04 — Employer email verification + candidate magic link (Resend)

### Database

- **`006_email_verification.sql`:** `users.email_verified_at`; table **`email_verification_tokens`** (`employer_verify`, `candidate_magic`); demo emails backfilled as verified after migrate.

### Backend

- **`resend`** dependency; **`src/lib/email/`** — Resend client, SHA-256 hashed one-time tokens, transactional templates (employer verify vs candidate magic link).
- **`GET /api/auth/email/verify`:** Consumes token, sets `email_verified_at`, **`createSession`**, redirects to employer or candidate dashboard.
- **`src/features/auth/actions.ts`:** DB employer — password OK then require verified email or send link + `?error=unverified`. DB candidate — send magic link + `?sent=1` (no session from form). **`resendEmployerVerificationAction`** for the resend form. Mock paths unchanged.
- **`src/lib/rate-limit.ts`:** Hourly caps on verification / magic-link sends per key.

### UI

- Employer login: copy for DB mode, **`loginQueryInfoMessage` / `resent`**, **`EmployerLoginForm`** resend block. Candidate login: **magic-link** button copy when `hasDatabase()`, **`sent=1`** info banner.

### Ops / env

- Vercel (and local): **`DATABASE_URL`**, **`RESEND_API_KEY`**, **`RESEND_FROM`**, **`NEXT_PUBLIC_SITE_URL`** for email links. Run **`npm run db:migrate`** after pulling.

### Docs

- **`docs/LEARNING.md`** — Auth email section; **`AGENTS.md`** + **vacancychennai-proj-skill** — agent notes for this flow.

---

## 2026-04 (late) — Home hero refresh, content/SEO pass, crawlers, bilingual hints

### Home hero and job seeker CTAs

- **Split light hero** (warm surface, serif accent via Playfair for “Vacancy Chennai”), moderation/social proof, CSS workspace illustration, **overlapping** `HomeHeroFloatingSearch` (job type, category, area → `/jobs-in-chennai` query string).
- Copy aligned to product: hyperlocal areas, moderated listings, quick apply; **Browse all jobs**, **How applying works**, **Create free account** + inline sign-in (`/candidate/login?new=1`).
- **Stats strip** under hero (listings, areas, free seeker message) on a light band.

### SEO and structured data

- **`src/lib/home-seo-copy.ts`:** Site default description for root layout; home title/description/schema strings shared with metadata + JSON-LD.
- **`homePageMetadata`:** Keywords, `siteName`, OG image alt when `NEXT_PUBLIC_OG_IMAGE` is set.
- **`home-jsonld.ts`:** Richer `@graph` — `Organization` + `areaServed`, `WebSite` + `publisher` + `SearchAction`, `WebPage`, existing `FAQPage`.
- **`baseMetadata`:** All marketing pages get `siteName`, `en_IN` locale, optional OG/Twitter image.
- **`jobs-itemlist-jsonld.ts`:** `ItemList` on `/jobs-in-chennai` (when results exist), freshers/part-time hubs; area pages refactored to same helper.
- **Job detail:** `generateMetadata` + `JobPosting.hiringOrganization.name` from `resolveEmployerDisplayNameForJob`.
- **Candidate login:** `generateMetadata` varies for `?new=1` (hero signup).
- **Marketing routes:** Refreshed meta descriptions (about, contact, pricing, terms, privacy, blog, post-job, jobs hub, area `generateMetadata`).

### Crawlers and URLs

- **`app/robots.ts`:** `allow` /, `disallow` private/API/dashboard paths, `sitemap` + `host`.
- **`app/sitemap.ts`:** **Async**; merges **`/jobs-in-{area}`** from `listLocations()` with static routes and blog slugs.
- **`area-job-path.ts`:** Single slug rule used by sitemap, `nav-config` mega areas, `home-location-grid`.
- **`jobsInChennaiListingMetadata`:** `hreflang`-style `alternates.languages` (`en-IN`, `ta-IN` with `?lang=ta`, `x-default`).
- **`.env.example`:** Documents `NEXT_PUBLIC_OG_IMAGE` and `NEXT_PUBLIC_SITE_LOGO_URL`.

### Docs and agent skill

- **`docs/LEARNING.md`** and **`docs/PROJECT_UPDATE.md`** updated for the above.
- **Cursor skill:** `.cursor/skills/vacancychennai-proj-skill/SKILL.md` for orchestration triggers and file map.

---

## 2026-04 — Home hero, unified marketing UI, blog SEO, nav, employer UX

### Home

- Redesigned **home hero** (later **superseded** — see **2026-04 (late)** above): deep navy background, amber accents, headline pill on “future”, staggered portrait collage (remote placeholders via `next/image` + `i.pravatar.cc`), industry-style proof row.
- **Stats bar** merged into the hero (live listings, areas, “Free” seeker message); separate `HomeStatsStrip` removed from the home page to avoid duplication.
- `next.config.ts`: `images.remotePatterns` for portrait host.

### Marketing and job discovery pages

- Introduced **`InnerPageHero`** (`src/components/marketing/inner-page-hero.tsx`) — full-bleed navy band aligned with home — and applied across:
  - About, pricing, contact, blog index
  - Jobs hub (`/jobs-in-chennai`), freshers/part-time hubs, dynamic **area** routes (`jobs-in-*`)
  - Post-job: hero on **server** `post-job/page.tsx`; client `PostJobLanding` is form + modal only
- **Job detail** (`/jobs/[jobId]`): hero + two-column layout with **sticky quick apply** on large screens.
- **Pricing**: three-tier cards with featured tier styling and CTAs.

### Auth and dashboards

- **`AuthPageShell`**: candidate, employer, admin login pages use centered card + subtle background wash.
- **`DashboardWelcome`** + **`sectionCard`** / **`formInput`** / **`btnDense*`** on candidate, employer, and admin dashboards for consistent surfaces and forms.
- **Employer dashboard**: distinct success copy for **`job-created`** (moderation queue explained + link to browse jobs) vs **`promoted`** vs generic success.

### Blog

- **`src/lib/blog-posts.ts`**: single source for slugs, teasers, body paragraphs, dates.
- **`/blog/[slug]`**: static generation, metadata, **BlogPosting JSON-LD** via `src/lib/blog-jsonld.ts`.
- **`/blog`**: cards link to articles.
- **Sitemap**: includes each `/blog/{slug}` with `lastModified` from `publishedAt`.

### Navigation

- **Active route styling** on desktop and mobile: Home, Pricing, Blog, Find jobs (hub + area + job detail), Your Profile (seeker/employer flows), session links, mega menu rows.
- Helpers: **`src/lib/nav-active.ts`**.

### Job seeker landing

- **`/job-seeker-profile`**: `InnerPageHero` + existing CTA blocks and content sections.

### Follow-ups (still optional)

- Individual **`/jobs/[id]`** URLs in sitemap (large/dynamic; policy + freshness tradeoff).

---

## Earlier MVP (baseline)

See `README.md` for stack, demo logins, DB setup, and Phase 2/3 backlog. Core flows: location-first jobs, job detail + quick apply, employer/admin/candidate auth and dashboards, moderation, JSON-LD for job postings.
