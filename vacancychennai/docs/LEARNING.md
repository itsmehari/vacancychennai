# Learning log — Vacancy Chennai

Engineering and design notes from implementation work (including the 2026 home/marketing/auth pass). Use this to avoid repeating mistakes and to onboard agents quickly.

| Doc | Role |
|-----|------|
| **This file** | Pitfalls, patterns, “why we did X” — living reference while building. |
| [`PROJECT_UPDATE.md`](./PROJECT_UPDATE.md) | Changelog: what shipped, in roughly reverse chronological order. |
| [`AGENTS.md`](../AGENTS.md) | Cursor/agent rules for this app (Next.js warning + project conventions). |
| [Cursor skill — Vacancy Chennai](../../.cursor/skills/vacancychennai-proj-skill/SKILL.md) | When the agent should load Vacancy Chennai context (triggers + file map). |
| [Cursor skill — Next 16 proxy](../../.cursor/skills/nextjs-16-proxy-migration/SKILL.md) | `middleware.ts` → `proxy.ts` migration and conventions. |
| [`job-seeker-profile-plan.md`](./job-seeker-profile-plan.md) | Job seeker profile PRD (Postgres, Server Actions, Vercel Blob when `BLOB_READ_WRITE_TOKEN` set). |
| [`candidate-identity-decision.md`](./candidate-identity-decision.md) | Login-first candidate identity (guest profile deferred). |

## Next.js App Router

- **Proxy (Next.js 16+):** The **`middleware.ts`** file convention is **deprecated**; use **`src/proxy.ts`** with **`export function proxy(request: NextRequest)`** (same `NextResponse.next` / headers pattern). The codemod is `npx @next/codemod@canary middleware-to-proxy .`. Build output still labels the layer “Proxy (Middleware)” in some versions.
- **Server vs client components:** A file with `"use client"` cannot import a Server Component. If a client page needs a shared marketing hero, render the hero from a **parent Server Component** (`page.tsx`) and keep the client bundle as a sibling (e.g. post-job form below the hero).
- **Async route segments:** `params` and `searchParams` are **Promises** in this codebase’s Next version — always `await` them in pages and `generateMetadata`.
- **Sitemap:** Use an **async** `sitemap()` when pulling live data (e.g. `listLocations()` for every `/jobs-in-*` area URL). Static entries + `blogPosts` can live in the same array; merge area URLs after awaiting the repo.
- **`robots.ts`:** `app/robots.ts` exports `MetadataRoute.Robots` — set `sitemap`, optional `host` via `new URL(siteUrl).host`, and `disallow` for `/api/`, dashboards, and sensitive employer tools. Login pages rely on `robots: { index: false }` in metadata rather than blanket disallow of `/candidate/login`.

## Images

- **`next/image` + remote URLs:** Add `images.remotePatterns` in `next.config.ts` for each hostname (e.g. `i.pravatar.cc`). Without it, builds or runtime will reject external images.

## Shell and tooling

- **Windows PowerShell:** Use `;` to chain commands, not `&&` (older PowerShell).
- **OneDrive / synced folders:** `next build` may hit `EPERM` when deleting `.next` — often sync locking, not application logic. Retry outside sync, exclude `.next`, or run build in CI.

## UI system (this project)

- **Tokens in `src/lib/ui.ts`:** Reuse `sectionCard`, `formInput`, `btnPrimary`, `btnDense*`, `focusRingOnDark`, etc., instead of one-off class strings on dashboards and forms.
- **Home hero (above the fold):** Split **light** layout — warm surface (`#faf7f2`), orange “Free for seekers” pill, Playfair italic for brand name, social proof + moderation card, **floating** job filter bar (`HomeHeroFloatingSearch`, client). Right column is CSS illustration, not a single hero asset. Stats strip below stays on a light band.
- **Marketing / job hubs (inner pages):** `InnerPageHero` + `HomeBreakout` give a **navy/amber** band — use for `/jobs-in-chennai`, freshers/part-time, area pages, about, etc. Do not assume the **home** hero matches that palette.
- **Auth surfaces:** `AuthPageShell` wraps the login card; opening tag and closing tag must both be `AuthPageShell` (a stray `</div>` breaks the build).
- **Dashboards:** `DashboardWelcome` + `sectionCard` keep employer/admin/candidate pages visually aligned.

## Navigation

- **Active states:** `usePathname()` lives in `SiteHeaderShell` (client). Pure helpers are in `src/lib/nav-active.ts` (`isNavHrefActive`, `isJobsExplorePath`, `isProfileHubPath`). Update those when adding new top-level flows so “Find jobs” / “Your Profile” stay correct.

## Candidate résumé files (Vercel Blob)

- **`BLOB_READ_WRITE_TOKEN`:** When set with `DATABASE_URL`, `updateCandidateProfileAction` uploads to **private** Vercel Blob under `vacancy-chennai/resumes/{userId}/…`; `candidate_profiles.resume_file_key` stores the **blob URL**. Replacing a file calls `del` on the previous URL only if it contains `/resumes/{userId}/` (tenant guard).
- **No token:** DB mode falls back to **`resume-memory-store`** and `memory:{userId}` in `resume_file_key` (OK for local dev; not durable on serverless).
- **Download:** `GET /api/candidate/resume` — candidate session; streams via `@vercel/blob` `get` for private URLs or memory buffer.
- **Helpers:** `src/lib/resume-blob.ts` (`uploadCandidateResumeBlob`, `deleteResumeBlobIfOwned`, `resumeFileKeyIndicatesUpload`).

## Repository vs mock DB (Postgres parity)

- **Single audit API:** Server actions and API routes should call **`addAudit`** from `src/features/core/repository.ts`, not `addAuditLog` from `mock-db` directly. The repository forwards to mock when `!hasDatabase()` and inserts `audit_logs` when Postgres is configured. After refactors, a leftover `addAuditLog({...})` without import breaks the build (`Cannot find name 'addAuditLog'`).
- **Gap-fix pattern:** When `DATABASE_URL` is set, prefer **`listPublishedJobs`**, **`listLocations`**, **`createJob`**, **`suggestCandidatesForJobMatches`**, and other exports from **`repository.ts`** in `app/api/**` and features — avoid reading `mock-db` for data that should come from Neon. Mock-only helpers remain acceptable behind `hasDatabase()` checks (e.g. demo auth users in `auth/actions.ts`).
- **Employer dashboard “AI match”:** Render suggestions via **`suggestCandidatesForJobMatches(jobId)`** from the repository so DB and mock paths stay aligned.

## Hyperlocal dynamic route (`[locationPage]`)

- **`filterPublishedJobList` zone fallback:** If `locationSlug` does not match any **area**, the filter falls back to `loc.zone.toLowerCase().includes(...)`. Short or random slugs (e.g. `e`) can match substrings inside real zone names and return the wrong job set.
- **Area pages must validate:** On `src/app/[locationPage]/page.tsx`, after parsing `jobs-in-*` into a slug, require **`getLocationByAreaSlug(slug, await listLocations())`** in both **`generateMetadata`** and the page; call **`notFound()`** (and not-found metadata) when there is no matching location. Legitimate links from **`jobsInAreaPath(area)`** always pass this check.

## SEO

- **Homepage copy single source:** `src/lib/home-seo-copy.ts` — `SITE_DEFAULT_DESCRIPTION` (root layout fallback), `HOME_SEO_TITLE` / `HOME_SEO_DESCRIPTION` / `HOME_SCHEMA_DESCRIPTION` for `/` metadata + JSON-LD. Edit here first, then sync visible hero copy if needed.
- **Home JSON-LD graph:** `src/lib/home-jsonld.ts` — `Organization` (with `areaServed` Chennai → TN → India), `WebSite` (`publisher`, `SearchAction` template), `WebPage`, `FAQPage`. Optional `primaryImageOfPage` when `NEXT_PUBLIC_SITE_LOGO_URL` is set.
- **Listing pages ItemList:** `src/lib/jobs-itemlist-jsonld.ts` (`buildJobsItemListJsonLd`) — emit only when `jobs.length > 0` on `/jobs-in-chennai`, freshers/part-time hubs, and area pages (avoid empty ItemList).
- **Hyperlocal path helper:** `src/lib/area-job-path.ts` (`jobsInAreaPath`) — same slug rules for sitemap, `nav-config` mega areas, and `home-location-grid`; never duplicate the string template.
- **Jobs hub bilingual hints:** `jobsInChennaiListingMetadata()` in `src/lib/seo.ts` adds `alternates.languages` for `en-IN`, `ta-IN` (`?lang=ta`), and `x-default`. Page uses `export const metadata = jobsInChennaiListingMetadata()`.
- **Job detail:** `generateMetadata` on `/jobs/[jobId]` uses `resolveEmployerDisplayNameForJob`; `JobPosting` JSON-LD `hiringOrganization.name` should match.
- **Candidate login:** `generateMetadata` reads `searchParams` for `?new=1` to vary title/description (signup from hero).
- **Blog articles:** Centralize copy in `src/lib/blog-posts.ts`. JSON-LD is built by `src/lib/blog-jsonld.ts` (`buildBlogPostingJsonLd`). Keep `publishedAt` ISO-shaped strings for sitemap `lastModified` and schema.
- **Canonical / OG:** `baseMetadata()` sets canonical, OG/Twitter, `siteName: "Vacancy Chennai"`, `locale: "en_IN"`, and optional `NEXT_PUBLIC_OG_IMAGE`. Article pages extend with `openGraph.type: "article"` and published/modified times.
- **Env for share cards:** Document `NEXT_PUBLIC_OG_IMAGE` and `NEXT_PUBLIC_SITE_LOGO_URL` in `.env.example`; production still needs real assets hosted at those URLs.

## Product copy / flows

- **Employer job create:** Server action redirects with `?success=job-created`. The dashboard should explain **moderation** explicitly so employers know the listing is not live until published.
- **Stats on home:** `HomeHero` receives `jobCount`, `areaCount`, `categories`, `locations`; floating search posts to `/jobs-in-chennai` with `category`, `jobType`, `location` query params. Hero also links **Create free account** → `/candidate/login?new=1`.
- **Employer login (DB mode):** Page must define `showVerificationResend = hasDatabase()`, `infoMessage = loginQueryInfoMessage({ resent })`, and pass `resent` in `searchParams` typing so `EmployerLoginForm` and info banners compile.

## Auth email — Resend, employer verification, candidate magic link

- **When `DATABASE_URL` is set:** Employer sign-in requires **`users.email_verified_at`** after a valid password. If null, the app sends a **verification email** (Resend) and redirects with `?error=unverified` — no session until the user opens the link.
- **Candidate sign-in (DB):** No instant session from the login form. Submitting a registered email sends a **magic link**; the user clicks `GET /api/auth/email/verify?token=…&purpose=candidate_magic` to consume the token, set `email_verified_at`, and **then** `createSession`. Redirect after send: `?sent=1` (info banner via `loginQueryInfoMessage`).
- **Mock mode (`!hasDatabase()`):** Employer and candidate flows stay **unchanged** (instant login for demos).
- **Tokens:** Stored only as **SHA-256 hashes** in `email_verification_tokens`; plaintext appears once in the email URL. Purposes: `employer_verify` (TTL ~24h), `candidate_magic` (~1h). New token for a user+purpose **deletes** prior unconsumed rows for that pair.
- **Rate limits:** `canSendVerificationEmail` / `recordVerificationEmailSent` in `src/lib/rate-limit.ts` (default **5 sends / hour / key**) back verification and magic-link sends; keys include the email address.
- **Env required for mail:** `RESEND_API_KEY`, `RESEND_FROM` (verified domain or Resend test sender), and **`NEXT_PUBLIC_SITE_URL`** (absolute base for links in emails). Missing config → `?error=email-config`; send failures → `email-failed`; rate cap → `email-rate-limited`.
- **Migration:** `database/migrations/006_email_verification.sql` adds `email_verified_at` + `email_verification_tokens` and backfills demo emails as verified so seeded accounts keep working after `npm run db:migrate`.
- **Vercel / Neon:** Set `DATABASE_URL` (pooled Neon URL) per environment; redeploy after env changes. **Never commit** connection strings or paste them into chat logs — rotate DB passwords if exposed.
- **Query UX:** Extend `loginQueryErrorMessage` / `loginQueryInfoMessage` in `src/lib/auth-login-errors.ts` when adding new `error=` or info params; keep employer **Resend verification** form using `resendEmployerVerificationAction`.

## Admin password reset (DB)

- **Purpose:** `admin_password_reset` in `email_verification_tokens` (separate from employer `password_reset`) so links route to `/admin/reset-password`. Migration **`008_admin_password_reset_purpose.sql`** extends the purpose check constraint.
- **Flow:** `requestAdminPasswordResetAction` / `resetAdminPasswordAction` in `src/features/auth/account-actions.ts`; email via **`sendAdminPasswordResetEmail`** in `send-auth-email.ts`; validate/finalize in **`verification-tokens.ts`** (`validateAdminPasswordResetToken`, `finalizeAdminPasswordReset`).
- **Pages:** `/admin/forgot-password`, `/admin/reset-password`; admin login links **Forgot password?** and accepts `?reset=1` / `?forgot=1` info banners (shared `loginQueryInfoMessage` copy; generic “If an account exists…” for `forgot=1`).

## Roles (admin / employer / candidate)

- **URLs:** `/admin/*`, `/employer/*`, `/candidate/*` — three **separate** login actions in `src/features/auth/actions.ts`, each enforcing **`users.role`** (DB) or mock fixtures.
- **Session:** `createSession({ role, actorId, displayName })`; DB sessions resolve **`users.role`** when reading the cookie.
- **Guards:** Dashboards call **`requireRole("admin" | "employer" | "candidate", loginPath)`** from `src/lib/auth.ts`. **No** path-level role enforcement in `proxy.ts` today (city headers only); do not assume middleware blocks cross-role URL guessing without adding checks.

## Scheduled job digests, alerts, SMS (cron)

- **Route:** `GET`/`POST` **`/api/cron/notifications`** (`src/app/api/cron/notifications/route.ts`, **`runtime: "nodejs"`**). Authorize with **`Authorization: Bearer <CRON_SECRET>`** or **`?secret=<CRON_SECRET>`**. Returns 401 if `CRON_SECRET` is unset or wrong.
- **Logic:** `runScheduledNotifications()` in `src/lib/notifications/run-scheduled-notifications.ts` loads **`email_subscriptions`** (`email_digest`, `job_alerts`, `sms_reminder`), loads new **published** jobs since a window via **`listPublishedJobsCreatedSince`** in `repository.ts` (default window **`NOTIFICATION_DIGEST_WINDOW_HOURS`**, fallback 24).
- **Email:** One digest per unique email when subscribed to digest and/or job alerts (deduped). Uses **`sendJobDigestEmail`** in `src/lib/email/send-digest-email.ts` (needs Resend + **`NEXT_PUBLIC_SITE_URL`**).
- **SMS:** **`sendTwilioSms`** in `src/lib/sms/twilio-sms.ts` when **`TWILIO_ACCOUNT_SID`**, **`TWILIO_AUTH_TOKEN`**, **`TWILIO_FROM_NUMBER`** are set. If Twilio is missing, optional **`ADMIN_SMS_DIGEST_EMAIL`** receives a **fallback** summary via Resend (`sendSmsFallbackDigestEmail`).
- **Vercel:** Root **`vacancychennai/vercel.json`** defines a daily cron hitting the notifications path; set **`CRON_SECRET`** in the project env (Vercel cron sends the Bearer token when configured).
- **Subscriptions storage:** Migration **`007_signup_password_reset_subscriptions.sql`** (and earlier schema) — `subscribeAlertsAction` in `account-actions.ts` upserts **`email_subscriptions`**.

## Employer billing (SuperProfile links)

- **Migrations:** **`010_billing_listing_usage.sql`** adds `jobs.published_at` / `expires_at` / `billing_source`, **`entitlement_usages`**, and **`payment_orders.provider_payment_id`**. Run **`npm run db:migrate`** before `next build` when **`DATABASE_URL`** is set — otherwise queries that reference `expires_at` will fail at prerender (e.g. sitemap).
- **SKU amounts:** [`src/lib/billing/skus.ts`](../src/lib/billing/skus.ts); policy copy in [`docs/EMPLOYER_BILLING_POLICY.md`](./EMPLOYER_BILLING_POLICY.md).
- **Publish gate:** Set **`BILLING_ENFORCED=true`** (with DB) so admin **`Publish`** requires credits or an active monthly pass (`resolvePublishBilling` in `src/features/billing/publish-and-fulfill.ts` + `updateJobStatusAction` in `src/features/jobs/actions.ts`). Default is off so dev/staging are not blocked.
- **Checkout:** `POST /api/billing/checkout` creates a **`payment_orders`** row (`provider = superprofile`) and returns a **SuperProfile URL** from env **`SUPERPROFILE_PAYMENT_URL`** (one HTTPS link for every SKU; see [`src/lib/billing/superprofile-links.ts`](../src/lib/billing/superprofile-links.ts)), with `vc_ref` = order id for reconciliation. Client **`SuperProfileSkuButton`** opens that URL. Optional webhook **`POST /api/billing/webhook/superprofile`** (`Authorization: Bearer <SUPERPROFILE_WEBHOOK_SECRET>`) or admin **Mark paid** on `/admin/dashboard` grants entitlements via **`fulfillPaymentOrderById`**. Cron **`/api/cron/billing`** (same **`CRON_SECRET`** as notifications) sends pass-expiry reminder emails when Resend is configured.
- **Promote tier:** `promoteJobAction` checks **`employerEligibleForPremiumTier`** when billing is enforced.

## References in repo

| Topic        | Location |
|-------------|----------|
| Home SEO strings | `src/lib/home-seo-copy.ts` |
| Home / FAQ JSON-LD | `src/lib/home-jsonld.ts` |
| Job list JSON-LD | `src/lib/jobs-itemlist-jsonld.ts` |
| Area URL helper | `src/lib/area-job-path.ts` |
| Metadata helpers | `src/lib/seo.ts` (`baseMetadata`, `homePageMetadata`, `jobsInChennaiListingMetadata`) |
| Blog content | `src/lib/blog-posts.ts` |
| Blog schema  | `src/lib/blog-jsonld.ts` |
| Footer config | `src/lib/footer-config.ts` |
| Nav mega / profile config | `src/lib/nav-config.ts` |
| Crawlers | `src/app/robots.ts`, `src/app/sitemap.ts` |
| Auth actions (login, resend, DB vs mock) | `src/features/auth/actions.ts` |
| Email verify route | `src/app/api/auth/email/verify/route.ts` |
| Resend + templates | `src/lib/email/resend-client.ts`, `send-auth-email.ts` |
| Verification tokens (DB) | `src/lib/email/verification-tokens.ts` |
| Admin / employer register & subscribe actions | `src/features/auth/account-actions.ts` |
| Job digest + SMS fallback email | `src/lib/email/send-digest-email.ts` |
| Twilio SMS | `src/lib/sms/twilio-sms.ts` |
| Employer billing + publish gate | `src/lib/billing/skus.ts`, `src/lib/billing/superprofile-links.ts`, `src/lib/billing/flags.ts`, `src/features/billing/publish-and-fulfill.ts`, `src/app/api/billing/*`, `/employer/billing` |
| Cron notification runner | `src/lib/notifications/run-scheduled-notifications.ts` |
| Cron HTTP entry | `src/app/api/cron/notifications/route.ts` |
| Next request proxy (city headers) | `src/proxy.ts` |
| Vercel cron schedule | `vacancychennai/vercel.json` |
| Login query copy | `src/lib/auth-login-errors.ts` |
| Email send rate limits | `src/lib/rate-limit.ts` |
| Email verification migration | `database/migrations/006_email_verification.sql` |
| Repository (DB + mock) | `src/features/core/repository.ts` — jobs, locations, audits, AI match suggestions |
| Area filter + slug resolve | `src/lib/job-filters.ts` — `filterPublishedJobList`, `getLocationByAreaSlug` |
| Dynamic area page | `src/app/[locationPage]/page.tsx` |
| Agent rules | `AGENTS.md` (repo: `vacancychennai/AGENTS.md`) |
| Cursor skills | `vacancychennai-proj-skill`, `nextjs-16-proxy-migration` under repo `.cursor/skills/` |
| Job seeker profile PRD (Vacancy Chennai stack) | [`docs/job-seeker-profile-plan.md`](./job-seeker-profile-plan.md) |
