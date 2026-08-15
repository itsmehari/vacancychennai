# Work log — Vacancy Chennai

Session-style record of what shipped (and why). For a compact product changelog see [`PROJECT_UPDATE.md`](./PROJECT_UPDATE.md). For engineering pitfalls see [`LEARNING.md`](./LEARNING.md).

---

## 2026-08-15 — Listings, job-page layout, LLM/SEO, ads, links, Nanganallur requests

**Branch:** `main` → `origin/main` (Vercel production: https://vacancychennai.in)  
**Chat:** [Aug 15 Vacancy Chennai ship](6ad90bbf-e95d-4296-9d2c-3b2a8a15f502)

### Commits (newest first)

| SHA | Summary |
|-----|---------|
| `60cb04b` | Partner ad banners, dead-link fixes, Nanganallur local job requests |
| `5e75019` | Fix duplicated free-for-seekers line in `llms.txt` summary |
| `2de873b` | `llms.txt` / AEO–GEO + job-page layout ship |
| `77b9c58` | MP Developers Pallavaram walk-in as urgent featured curated listing |

### 1. MP Developers mega walk-in (urgent featured)

- **Source:** https://mychennaicity.in/chennai-jobs/mp-developers-mega-walk-in-pallavaram-guindy  
- **Live:** https://vacancychennai.in/jobs/job-mp-developers-mega-walk-in-pallavaram-guindy  
- Curated in `src/features/core/static-curated-jobs.ts` — employer `emp-mp-developers`, location Guindy (`loc-guindy`), urgent + featured so it leads homepage Spotlight.  
- Apply: email `careers@mpdevelopers.com`, call/WhatsApp `+91 78457 58753`, walk-in Pallavaram.  
- **Ops note:** First live 404 was local-only code; then a corrupt `.git/index` (`bad signature 0x00000000`) blocked commit — fixed with `Remove-Item .git\index; git reset`, then commit + push.

### 2. Job detail page redesign (AEO / GEO friendly sidebar)

- Main column: employer kicker + short factual summary (no safety sermon) + role body.  
- Sidebar order: How to apply → Before you apply → **square rotating partner ads** → At a glance.  
- New components: `job-apply-panel.tsx`, `job-safety-aside.tsx`, `job-at-a-glance.tsx`, `job-rotating-ad-panel.tsx`.  
- Copy helpers: `src/lib/job-seo-intro.ts` (`buildFactualJobSummary`, `JOB_SAFETY_NOTICES`).  
- JSON-LD still uses fuller intro where needed; partner outbound analytics covers ResumeDoctor / BSERI / MyChennaiCity.

### 3. LLM discovery + SEO / AEO / GEO

- Live: `/llms.txt`, `/llm.txt` (alias), `/llms-full.txt` — builders in `src/lib/llm-site-index.ts`, routes under `src/app/llms.txt/`, `llm.txt/`, `llms-full.txt/`.  
- `robots.ts` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. (private paths still disallowed).  
- Homepage FAQs expanded; Organization schema as `Organization` + `EmploymentAgency` with Chennai address; JobPosting `geo` + `applicantLocationRequirements`; root `lang="en-IN"`.  
- **Do not** put `llms.txt` in robots `sitemap:` (XML sitemaps only); list `llms.txt` as a URL in `sitemap.ts`.

### 4. Site-wide partner ad banners

- Shared catalog: `src/lib/partner-ads.ts` (ResumeDoctor, BSERI, MyChennaiCity) with placement → `utm_content`.  
- UI: `src/components/ads/partner-ad-rotator.tsx`, `page-ad-slot.tsx`, `home-ad-band.tsx`, `site-wide-ad-band.tsx`.  
- **Square:** job detail sidebar.  
- **Rectangle:** home (after areas / after how-it-works), jobs hub, freshers, part-time, area hubs, blog index/article, Nanganallur request page; site-wide band above footer on other public pages.  
- **Skipped:** admin, dashboards, billing, resume-db, subscribe, password reset, privacy, terms (and pages that already have an inline slot, to avoid double ads).

### 5. Missing / broken links fixed

| Problem | Fix |
|---------|-----|
| Footer → `/local-job-request-nanganallur` 404 (WIP not live) | Shipped the page; footer also links Jobs in Nanganallur + job-request |
| Footer “Social profile links coming soon” | Contact + `mailto:support@vacancychennai.in` when env social URLs empty |
| Footer phone `+91 — — — — —` | Replaced with support email |
| Contact fake WhatsApp `+91-90000-00000` | Removed; email + subscribe links |
| Empty `footerLogos` | ResumeDoctor / BSERI / MyChennaiCity with UTM |
| Pricing pointed at repo markdown | Contact / support email |
| Terms placeholder | Real short terms + privacy / pricing / contact links |
| About weak CTAs | Browse jobs / Post a job / Contact |

### 6. Nanganallur local job requests (seeker → employer WhatsApp)

- **Live:** https://vacancychennai.in/local-job-request-nanganallur  
- Migration: `database/migrations/013_local_job_requests.sql` (applied via `npm run db:migrate` against Neon).  
- Feature: `src/features/local-job-request/*`, UI under `src/components/local-job-request/*`.  
- Auth: candidate magic link (Resend) with `next` back to this page, or SMS OTP via `src/lib/otp-send.ts` + Twilio when configured.  
- One public post per candidate; employers WhatsApp from public cards.  
- Wired into footer, Find-jobs mega menu, sitemap, `llms.txt`, area hub CTA on `/jobs-in-nanganallur`.  
- **Env:** Resend for email; Twilio (`TWILIO_*`) required for SMS OTP in production.

### 7. Deploy / verify

- Working tree clean; `main` == `origin/main` at `60cb04b`.  
- Spot-checked live: job-request page, `/jobs-in-nanganallur`, `/contact`, `/terms`.

### Follow-ups (not done this session)

- Publish real social profile URLs via `NEXT_PUBLIC_SOCIAL_*` / `NEXT_PUBLIC_ORG_SAME_AS`.  
- Confirm Twilio is set on Vercel if SMS OTP should work in prod.  
- Expand local job-request to more areas beyond Nanganallur when ready.  
- Counsel-reviewed full Privacy/Terms if needed beyond MVP copy.
