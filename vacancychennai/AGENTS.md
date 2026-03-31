<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing new code. Heed deprecation notices.

- **Proxy vs middleware (v16+):** Request interception lives in **`src/proxy.ts`** with **`export function proxy`**, not `middleware.ts` / `export function middleware`. Same `NextResponse.next` + `config.matcher` pattern.
<!-- END:nextjs-agent-rules -->

# Agent notes — Vacancy Chennai

Conventions learned from shipping the marketing shell, auth/dashboard polish, blog, and SEO in this repo. Follow these when editing UI, nav, or content-driven pages.

## Layout and components

- **Inner marketing / job hubs:** Use `InnerPageHero` from `src/components/marketing/inner-page-hero.tsx` for the navy + amber full-bleed header. It wraps `HomeBreakout`; do not nest a second full-bleed wrapper unless intentional.
- **Client + hero:** Never import `InnerPageHero` (server) inside a `"use client"` module. Put the hero on `page.tsx` and render the client child below it (pattern: `post-job/page.tsx` + `PostJobLanding`).
- **Surfaces:** Prefer `sectionCard`, `formInput`, `btnPrimary`, `btnDense*` from `src/lib/ui.ts` over ad hoc Tailwind on dashboards and dense forms.
- **Login pages:** Wrap the card with `AuthPageShell` from `src/components/layout/auth-page-shell.tsx`.
- **Dashboard intros:** Use `DashboardWelcome` from `src/components/layout/dashboard-welcome.tsx` for the top welcome block.

## Navigation

- Header active states depend on `usePathname()` in `site-header-shell.tsx` and helpers in `src/lib/nav-active.ts`. If you add routes that should light up **Find jobs** or **Your Profile**, update `isJobsExplorePath` / `isProfileHubPath` (or `isNavHrefActive` usage) accordingly.
- Mega menu and profile dropdown links should stay in sync with `src/lib/nav-config.ts`.

## Blog and SEO

- **Posts:** Add or edit entries only in `src/lib/blog-posts.ts` (slug, title, teaser, `publishedAt`, `readMinutes`, `paragraphs`).
- **Article page SEO:** `src/app/blog/[slug]/page.tsx` uses `buildBlogPostingJsonLd` from `src/lib/blog-jsonld.ts` and extends Open Graph with `type: "article"`. New fields on `BlogPost` may require updates in both places.
- **Home + hubs:** Homepage strings live in `src/lib/home-seo-copy.ts`; graph in `src/lib/home-jsonld.ts`. Listing pages use `buildJobsItemListJsonLd` from `src/lib/jobs-itemlist-jsonld.ts`. Jobs hub metadata + `hreflang`: `jobsInChennaiListingMetadata()` in `src/lib/seo.ts`.
- **Hyperlocal paths:** Use `jobsInAreaPath` from `src/lib/area-job-path.ts` for any `/jobs-in-*` link or sitemap line — never duplicate slug logic.
- **Dynamic area page (`app/[locationPage]/page.tsx`):** After parsing the `jobs-in-*` segment into a slug, require a real location with `getLocationByAreaSlug(slug, locations)` from `src/lib/job-filters.ts` (using `listLocations()` from the repository). Call `notFound()` and align `generateMetadata` when the slug is unknown. Do not rely on `filterPublishedJobList`’s zone substring fallback alone for public area URLs — short slugs can falsely match zone text.
- **Sitemap / robots:** `src/app/sitemap.ts` is **async** (includes area URLs via `listLocations()`). `src/app/robots.ts` exposes sitemap URL and disallows private routes.
- **Sitemap:** Still imports `blogPosts` for `/blog/*` URLs. After adding posts, sitemap updates automatically.

## Images

- New remote hosts for `next/image` require `images.remotePatterns` in `next.config.ts`.

## Data layer — repository vs mock-db

- **Audits:** Use **`addAudit`** from `src/features/core/repository.ts` in server actions and API routes. It writes to Postgres when `DATABASE_URL` is set and delegates to mock `addAuditLog` otherwise. Do not call **`addAuditLog`** from `mock-db` directly unless you are inside the repository or a mock-only code path — easy to leave a broken reference after refactors.
- **Jobs, locations, employer tooling:** When the app is DB-backed, read/write through **`repository.ts`** (`listPublishedJobs`, `listLocations`, `createJob`, `suggestCandidatesForJobMatches`, etc.) instead of importing job/location arrays from `mock-db` in `app/api` or features. Keep mock-only usage behind explicit `hasDatabase()` checks where the product still expects in-memory demos (e.g. auth user lookup in mock mode).

## Employer flow

- `createJobAction` redirects to `?success=job-created`. Dashboard copy for that query param should stay aligned with the real moderation lifecycle (see `docs/PROJECT_UPDATE.md`).

## Auth email (Resend) — employer + candidate + admin reset

- **DB mode only:** When `DATABASE_URL` is set, **employers** need `users.email_verified_at` after a valid password; otherwise send verification email and redirect with `?error=unverified` (no session). **Candidates** use a **magic link** from the login form — no session until `GET /api/auth/email/verify` consumes the token.
- **Admin password reset:** Separate token purpose **`admin_password_reset`** (migration `008_*`). **`requestAdminPasswordResetAction` / `resetAdminPasswordAction`** in `account-actions.ts`; **`sendAdminPasswordResetEmail`**; pages **`/admin/forgot-password`**, **`/admin/reset-password`**. Employer reset stays on **`password_reset`** + `/employer/reset-password`.
- **Mock mode:** `!hasDatabase()` keeps instant employer/candidate login; do not require Resend.
- **Files:** `src/features/auth/actions.ts`, `src/features/auth/account-actions.ts` (register, subscribe, password resets), `src/app/api/auth/email/verify/route.ts`, `src/lib/email/*`, `src/lib/auth-login-errors.ts`, `src/lib/rate-limit.ts` (verification send caps), migrations `006_email_verification.sql`, `007_signup_password_reset_subscriptions.sql`, `008_admin_password_reset_purpose.sql`.
- **Env:** `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_SITE_URL` (link base in emails). Never log plaintext tokens or full API keys; never commit `.env.local`.
- **UI:** Employer login uses `showVerificationResend`, `loginQueryInfoMessage({ resent })`, and `EmployerLoginForm` resend action. Candidate login uses `magicLinkMode={hasDatabase()}` and `?sent=1` info copy. Admin login: forgot link + `loginQueryInfoMessage` for `reset` / `forgot`.

## Roles and route guards

- **Three roles:** `admin`, `employer`, `candidate` — separate login URLs and **`login*Action`** handlers; session stores **`role`** + **`actorId`**. Dashboards use **`requireRole(...)`** from `src/lib/auth.ts`.
- **Proxy (`src/proxy.ts`):** Only sets **`x-city-key`**, **`x-zone-hint`**, **`x-request-id`** — it does **not** enforce role-by-path. Adding `/admin` global auth belongs in layouts or shared helpers, not assumed from proxy.

## Cron — job digests and SMS

- **Endpoint:** `src/app/api/cron/notifications/route.ts` — **`CRON_SECRET`** required (`Bearer` or `?secret=`). **`runtime: "nodejs"`**.
- **Runner:** `src/lib/notifications/run-scheduled-notifications.ts` + **`listPublishedJobsCreatedSince`** in `repository.ts`; subscribers from **`email_subscriptions`**.
- **Integrations:** Resend (`send-digest-email.ts`), optional Twilio (`twilio-sms.ts`), optional **`ADMIN_SMS_DIGEST_EMAIL`** fallback. **`vercel.json`** cron schedule in app root.
- **Env:** See `.env.example` (`CRON_SECRET`, `NOTIFICATION_DIGEST_WINDOW_HOURS`, Twilio vars). Do not expose `CRON_SECRET` in client bundles.

## Documentation

- **Session learnings / pitfalls:** `docs/LEARNING.md`
- **Shipped feature changelog:** `docs/PROJECT_UPDATE.md`
- **Cursor project skill (orchestration, file map, rules):** `.cursor/skills/vacancychennai-proj-skill/SKILL.md` at the **repo root** (same folder as `vacancychennai/` app directory). Use when touching home hero, SEO, sitemap/robots, job hubs, or auth shells.
- **Next.js 16 proxy rename:** `.cursor/skills/nextjs-16-proxy-migration/SKILL.md` — use when editing request interception or fixing middleware deprecation warnings.
