# Vacancy Chennai (MVP)

Hyperlocal, location-first hiring platform for Chennai and suburbs.

## Stack
- Next.js (App Router, full-stack)
- TypeScript + ESLint
- Tailwind CSS
- Neon PostgreSQL (schema in `../database/schema.sql`)
- Vercel deployment target

## Documentation (humans + agents)

- **`docs/LEARNING.md`** — engineering pitfalls, SEO/UI patterns, tooling notes.
- **`docs/PROJECT_UPDATE.md`** — changelog of shipped features (latest first).
- **`AGENTS.md`** — Cursor/agent conventions for this Next.js app.
- **Cursor project skill:** `../.cursor/skills/vacancychennai-proj-skill/SKILL.md` (from repo root).

## Implemented MVP Flows
- Location-first job discovery (`/jobs-in-*`)
- Job detail + quick apply (name + phone first)
- Employer login + post job form + applicant list
- Admin login + moderation queue + status updates
- Candidate login + application dashboard
- SEO pages and JobPosting JSON-LD

## Additional Phase 2 / 3 Features
- **Backlog priority (job seeker PRD):** (1) Admin CSV export of candidate profiles vs (2) employer “talent pool” search, (3) GA4 events on profile save, (4) honeypot/CAPTCHA on profile POST. **Résumé files:** with `DATABASE_URL`, set **`BLOB_READ_WRITE_TOKEN`** (Vercel Blob) for durable private storage; without it, uploads use in-memory buffers (local dev only).
- Candidate profile completion flow (headline, experience, résumé link/file — see `/job-seeker-profile`, `/candidate/dashboard`)
- Advanced filters on `jobs-in-chennai`
- Employer shortlist/reject pipeline actions
- Featured/urgent listing upgrade actions
- Resume database unlock flow (employer)
- AI candidate match suggestions (heuristic MVP)
- Bulk posting API endpoint
- WhatsApp distribution payload API
- Subdomain/city expansion proxy (`src/proxy.ts`) foundation

## Demo Logins
- Candidate: `candidate@vacancychennai.in`
- Employer: `employer@vacancychennai.in` / `demo123`
- Admin: `admin@vacancychennai.in` / `admin123`

## Run Locally
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database (Neon / Postgres)

When `DATABASE_URL` is set, the app reads jobs, locations, and profiles from Postgres instead of the in-memory mock.

### Neon + Vercel + local (sync)

1. In [Neon](https://neon.tech), create a project/branch and copy the **pooled** (serverless-friendly) connection string.
2. In Vercel → your project → **Settings → Environment Variables**, add `DATABASE_URL` for **Production** (and **Preview** if preview deploys should use a DB). Use the same Neon URL, or a separate branch URL for previews.
3. Add the same line to local `.env.local` (never commit it):

   ```bash
   DATABASE_URL=postgresql://...
   ```

4. Set `NEXT_PUBLIC_SITE_URL` on Vercel to your production URL (see `.env.example`).
5. **Redeploy** on Vercel after adding variables so the runtime picks them up.

### Migrations and seed (from this repo)

All SQL files under `database/migrations/` run in filename order via `schema_migrations`. That includes `005_seed_demo.sql`, so the **first** migrate applies schema plus demo data in one go. **`007_signup_password_reset_subscriptions.sql`** adds nullable `users.phone` (for email-first candidates), `password_reset` email tokens, and `email_subscriptions` for footer digests/alerts — run **`npm run db:migrate`** after pulling if you use self-serve registration or `/subscribe`. **`008_admin_password_reset_purpose.sql`** allows `admin_password_reset` tokens for `/admin/forgot-password`. Scheduled digests: set **`CRON_SECRET`** (and Resend/Twilio as needed); Vercel **`vercel.json`** runs `/api/cron/notifications` daily — see `.env.example`.

```bash
npm run db:migrate
```

Re-apply or refresh demo data only (idempotent):

```bash
npm run db:seed
```

Verify connectivity and row counts (prints DB host only, not the password):

```bash
npm run db:check
```

Commands use `DATABASE_URL` from `.env.local` via Node `--env-file` (same pattern for all three).

Logins after seed:

- Employer: `employer@vacancychennai.in` / `demo123`
- Admin: `admin@vacancychennai.in` / `admin123`
- Candidate: `candidate@vacancychennai.in` (email-only on `/candidate/login`)

Re-running the seed updates the three users by email and skips duplicate jobs (by title + employer).

### Smoke test after deploy

- Open the live site and confirm listings match what you see in Neon (not only mock data).
- Sign in as employer/admin only if you intentionally kept demo accounts on production; otherwise create real users and rotate passwords.

### Email (Resend) — required for DB auth email flows

When `DATABASE_URL` is set, **employer** sign-in expects a verified email (`users.email_verified_at`): after a correct password, the app emails a verification link via Resend if needed. **Candidates** sign in with a **magic link** to their email (no password on the form).

1. Set **`RESEND_API_KEY`**, **`RESEND_FROM`** (verified domain sender), and **`NEXT_PUBLIC_SITE_URL`** (exact site origin for links, e.g. `https://vacancychennai.in`) on Vercel and locally.
2. **Vercel integration:** [Resend on the Vercel Marketplace](https://vercel.com/marketplace/resend) can create `RESEND_API_KEY`.
3. In Resend → **Domains**, verify your domain, then use e.g. `Vacancy Chennai <notifications@your-domain>` as `RESEND_FROM`.

If Resend env vars are missing while using Postgres, employers hit `email-config` and candidates cannot receive magic links. **Password reset** and **job alert** emails are not implemented yet — still backlog.

See `docs/PROJECT_UPDATE.md` and `AGENTS.md` for behaviour details. `.env.example` lists variable names.

## Project Structure (Feature-first)
- `src/features/auth` - login/logout actions
- `src/features/jobs` - job creation and moderation actions
- `src/features/applications` - quick apply flow
- `src/features/core/mock-db.ts` - MVP in-memory storage
- `src/lib` - auth/session and SEO helpers
- `src/app` - route pages (public, candidate, employer, admin)

## Important Notes
- This MVP uses in-memory data for fast validation of product flows.
- Production migration path is already defined in `../database/schema.sql`.
- Distribution and seeding playbooks are in `docs/`.

## API Endpoints
- `GET /api/v1/ai/match?jobId=...`
- `GET /api/v1/distribution/whatsapp?zone=omr`
- `POST /api/v1/employer/bulk-jobs`

