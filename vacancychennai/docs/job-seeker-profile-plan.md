# Job seeker profile — PRD adapted for Vacancy Chennai

This document replaces MyOMR PHP/MySQL/cPanel assumptions with **Vacancy Chennai’s actual stack**: Next.js App Router (TypeScript), Server Actions, Neon PostgreSQL, `vacancychennai/database/migrations/`, and optional Vercel Blob for files.

**Related:** [`LEARNING.md`](./LEARNING.md), [`PROJECT_UPDATE.md`](./PROJECT_UPDATE.md), [`AGENTS.md`](../AGENTS.md).

---

## 1. Stack mapping (MyOMR PRD → Vacancy Chennai)

| Dimension | MyOMR (source PRD) | Vacancy Chennai (this repo) |
|-----------|-------------------|------------------------------|
| Runtime | PHP 8+, mysqli | Node.js, Next.js Server Actions |
| Database | MySQL (phpMyAdmin) | **Neon Postgres** — `vacancychennai/database/migrations/*.sql` (apply with `npm run db:migrate` from `vacancychennai/`) |
| Hosting | cPanel shared | **Vercel** (typical); env in Vercel + `.env.local` |
| Candidate identity | Email natural key, no session | **`requireRole("candidate")`** — `users` + `candidate_profiles` keyed by `user_id` |
| Profile upsert | INSERT/UPDATE by email | **`upsertCandidateProfileAfterEdit`** in `src/features/core/repository.ts` (by `user_id`) |
| File uploads | Disk under `uploads/resumes/` | **MVP:** in-memory buffer via `src/lib/resume-memory-store.ts` after multipart parse in `updateCandidateProfileAction`. **Target:** Vercel Blob / S3 + `resume_file_key` column (already in schema). |
| Validation | PHP validators | **`src/lib/candidate-profile-constants.ts`** + checks in `src/features/candidate/actions.ts` |
| Rate limiting | (PRD NFR) | **`allowProfileSubmit`** in `src/lib/profile-submit-rate.ts` (used in `updateCandidateProfileAction`) |
| SEO | `generate-sitemap.php` | **`src/app/sitemap.ts`** — static routes include `/job-seeker-profile`; blog + area URLs merged async where implemented |
| Marketing CTAs | Include snippets | **`JobSeekerProfileCta`** — `src/components/marketing/job-seeker-profile-cta.tsx` |

---

## 2. Current implementation snapshot (as of this doc)

**Already shipped (no need to re-spec as greenfield):**

- **Dashboard form** — `src/app/(candidate)/candidate/dashboard/page.tsx`: name, location, **headline** (stored as `candidate_profiles.bio`), **experience band**, skills, résumé URL, résumé file (validated size/MIME).
- **Server Action** — `src/features/candidate/actions.ts` → `updateCandidateProfileAction` → `upsertCandidateProfileAfterEdit`.
- **Mock path** — `hasDatabase() === false` uses mock DB patterns; parity goals in `mock-db` / types.
- **Public explainer** — `/job-seeker-profile` with `InnerPageHero` + CTAs.
- **Post-apply hint** — `JobSeekerProfileCta` on job detail (e.g. after apply success).
- **Footer** — `src/lib/footer-config.ts` “Job seekers” column includes “Job seeker profile” and “Candidate login”.
- **Nav** — `src/lib/nav-config.ts` profile menu links to `/job-seeker-profile` and logins.

**Gaps vs full PRD (intentional backlog):**

| Gap | Target implementation |
|-----|------------------------|
| Résumé binary persistence | **Done when `BLOB_READ_WRITE_TOKEN` is set:** `@vercel/blob` private upload, `resume_file_key` stores blob URL; replace deletes prior blob if owned. **Fallback:** in-memory store + `memory:userId` key when Blob token unset (local dev). |
| `resume_file_key` unused in DB mode for file body | **Done:** `GET /api/candidate/resume` streams from Blob (private) or memory. |
| Apply pre-fill from profile | **Done:** `getApplyPrefillForActor` includes headline + skills preview; job detail shows “From your profile” + existing field defaults. |
| Guest / email-only profile (MyOMR parity) | **Deferred** — see [`candidate-identity-decision.md`](./candidate-identity-decision.md) (login-first only). |
| Admin CSV export / employer talent pool | Phase 2 — `README.md` backlog; resume DB copy aligned with current unlock rules. |
| GA4 + honeypot on profile POST | Phase 2 — PRD §6. |
| Privacy / retention copy | **Updated:** `privacy/page.tsx` + resume database copy describe storage and employer visibility. |

---

## 3. Data model (Postgres)

**Table:** `candidate_profiles` (see `001_foundation.sql`, `004_candidate_profile_job_seeker.sql`, and root `database/schema.sql` as reference — **migrations are authoritative for deploy**).

| Column | Use in app |
|--------|-------------|
| `user_id` | Unique FK to `users`; profile row is 1:1 with candidate user. |
| `location_id` | Chennai area; required for “complete” profile in action validation. |
| `skills` | `text[]` |
| `bio` | **Headline** in UI (`headline` in `CandidateProfile` type maps from `bio`). |
| `experience_level` | Enum string; `EXPERIENCE_LEVEL_OPTIONS` in `src/lib/candidate-profile-constants.ts`. |
| `resume_url` | Optional URL string. |
| `resume_file_key` | For object storage key when Blob/S3 is wired. |
| `profile_completed` | Set true on successful upsert in repository. |
| `resume_contacts_unlocked` | Employer unlock flow (see resume DB). |

No `SHOW TABLES` at runtime — use migrations + `hasDatabase()`.

---

## 4. Functional requirements (PRD §3 → technical)

| ID | Requirement | Vacancy Chennai |
|----|--------------|-----------------|
| FR-1 | Upsert profile | ✅ By `user_id` in `upsertCandidateProfileAfterEdit`. |
| FR-2 | Validators | ✅ Zod-style inline checks + shared constants; extend as needed. |
| FR-3 | File rules | ✅ `MAX_RESUME_BYTES`, `RESUME_ALLOWED_MIME`; server-side only. |
| FR-4 | Degraded / missing table | Prefer migrations required; optional friendly error if query throws. |
| FR-5 | Success redirect | ✅ `redirect("/candidate/dashboard?success=…")` — align query keys with dashboard messaging. |

---

## 5. Non-functional (PRD §4)

- **Security:** Server Actions POST; rate limit profile updates; validate MIME/size; store files only via official SDK; when replacing blob, delete old key **only if** it matches your tenant prefix.
- **Privacy:** Keep employer/resume DB messaging honest; update `/privacy` when access model changes.
- **Performance:** No per-request schema discovery; use connection pooling (Neon).
- **SEO:** `/job-seeker-profile` is in **`sitemap.ts`**; metadata via `baseMetadata` on that page. Optional: richer `openGraph` for share cards.

---

## 6. WBS (execution order for remaining work)

### Phase 0 — Verification (quick)

- [x] Trace CTAs: home hero link, `home-candidates-join`, jobs hub + freshers + part-time segment pages, job detail, footer, nav — `JobSeekerProfileCta` / links added where gaps existed.
- [x] `/employer/resume-database` copy vs unlock rules and résumé file visibility.
- [ ] Confirm `upsertCandidateProfileAfterEdit` and mock path both set fields you expect in E2E tests (manual / CI).

### Phase 1 — Durable résumé storage (PRD launch gap)

- [x] Vercel Blob via `BLOB_READ_WRITE_TOKEN`; upload in `updateCandidateProfileAction`; `resume_file_key`; in-memory fallback when token unset with `hasDatabase()`.
- [x] `GET /api/candidate/resume` — session + DB key; private blob stream or memory.
- [x] On replace: delete previous blob if URL is owned path for that `user_id`.

### Phase 2 — Product backlog (prioritize with stakeholders)

- Admin CSV export vs employer talent pool search (`(admin)` / `(employer)` routes).
- GA4 events on profile save; honeypot/CAPTCHA on profile POST (see `README.md` backlog).
- Optional: magic-link-only profile edit (aligns with OTP tables if passwordless expands).

### Phase 3 — Governance

- [x] Privacy + resume DB copy updated; DSR/delete runbook and fixed retention dates still TBD by operator.

---

## 7. Open decisions

1. **Login-first vs guest profile:** **Resolved — login-first only** for saved profiles. See [`candidate-identity-decision.md`](./candidate-identity-decision.md). Guest email-keyed profile remains deferred.
2. **Consent checkbox** before employer outreach using résumé — product/legal.
3. **Copy strictness** on resume DB until export/talent pool ships.

---

## 8. File index (implementers)

| Purpose | Path |
|---------|------|
| Profile POST | `src/features/candidate/actions.ts` |
| DB upsert | `src/features/core/repository.ts` (`upsertCandidateProfileAfterEdit`, `getCandidateDashboardProfile`, …) |
| Constants | `src/lib/candidate-profile-constants.ts` |
| Rate limit | `src/lib/profile-submit-rate.ts` |
| MVP file RAM | `src/lib/resume-memory-store.ts` |
| Dashboard UI | `src/app/(candidate)/candidate/dashboard/page.tsx` |
| Marketing page | `src/app/job-seeker-profile/page.tsx` |
| CTA component | `src/components/marketing/job-seeker-profile-cta.tsx` |
| Job detail apply + CTA | `src/app/jobs/[jobId]/page.tsx` |
| Migrations | `vacancychennai/database/migrations/` |
| Sitemap | `src/app/sitemap.ts` |
| Footer links | `src/lib/footer-config.ts` |

---

*This plan supersedes generic MyOMR file paths. For Cursor automation, see also `.cursor/skills/vacancychennai-proj-skill/SKILL.md`.*
