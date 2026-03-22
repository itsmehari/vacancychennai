# Vacancy Chennai (MVP)

Hyperlocal, location-first hiring platform for Chennai and suburbs.

## Stack
- Next.js (App Router, full-stack)
- TypeScript + ESLint
- Tailwind CSS
- Neon PostgreSQL (schema in `../database/schema.sql`)
- Vercel deployment target

## Implemented MVP Flows
- Location-first job discovery (`/jobs-in-*`)
- Job detail + quick apply (name + phone first)
- Employer login + post job form + applicant list
- Admin login + moderation queue + status updates
- Candidate login + application dashboard
- SEO pages and JobPosting JSON-LD

## Additional Phase 2 / 3 Features
- Candidate profile completion flow
- Advanced filters on `jobs-in-chennai`
- Employer shortlist/reject pipeline actions
- Featured/urgent listing upgrade actions
- Resume database unlock flow (employer)
- AI candidate match suggestions (heuristic MVP)
- Bulk posting API endpoint
- WhatsApp distribution payload API
- Subdomain/city expansion middleware foundation

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

