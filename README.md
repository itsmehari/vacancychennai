# Vacancy Chennai (MVP)

Hyperlocal, location-first hiring platform for Chennai and suburbs.

## Stack
- Next.js (App Router, full-stack)
- TypeScript + ESLint
- Tailwind CSS
- Neon PostgreSQL (schema in `../database/schema.sql`)
- Vercel deployment target

## Tech Stack Rationale
- **Next.js App Router**: Full-stack, edge-ready, better for location-based routing
- **PostgreSQL (Neon)**: Relational data model for users, jobs, and applications
- **In-memory MVP storage**: Fast iteration without database setup overhead

## Core Features

✅ Location-first job discovery by area (`/jobs-in-*`)  
✅ One-click quick apply (name + phone only)  
✅ Employer dashboard (post jobs, manage applicants)  
✅ Admin moderation queue (review & approve listings)  
✅ Candidate application tracking  
✅ SEO-optimized job listings with JobPosting JSON-LD  

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

## Quick Start

**Prerequisites**: Node.js 18+, npm/yarn

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo Logins & Test Flows

| Role | Email | Password | Can Do |
|------|-------|----------|---------|
| **Candidate** | `candidate@vacancychennai.in` | — | Browse jobs by location, quick apply, view applications |
| **Employer** | `employer@vacancychennai.in` | `demo123` | Post jobs, view applicants, manage listings |
| **Admin** | `admin@vacancychennai.in` | `admin123` | Review flagged listings, moderate content, manage users |

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

## Moving from MVP to Production

The in-memory store is designed for fast validation. When ready to scale:

1. Review schema in `../database/schema.sql`
2. Replace `src/features/core/mock-db.ts` with Neon queries
3. Update `.env.local` with `DATABASE_URL` from Neon
4. Run migrations and seed initial data

## API Endpoints
- `GET /api/v1/ai/match?jobId=...` - AI candidate matching
- `GET /api/v1/distribution/whatsapp?zone=omr` - WhatsApp distribution payload
- `POST /api/v1/employer/bulk-jobs` - Bulk job posting

## Deploy to Vercel

```bash
vercel
```

**Environment variables needed**:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `AUTH_SECRET` - Session encryption key

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Run `npm run dev -- -p 3001` |
| Database connection errors | Verify `DATABASE_URL` in `.env.local` |
| TypeScript errors | Run `npm run lint` and check `src/` for issues |

## Phase 2 Roadmap
- [ ] Candidate profile completion flow
- [ ] Advanced job filters (salary, experience, category)
- [ ] Employer shortlist/reject actions
- [ ] Featured listing upgrade options
- [ ] Bulk resume search (employer)
- [ ] City expansion (Bangalore, Hyderabad)

## Contributing

Found a bug or have a feature request? Open an [issue](https://github.com/itsmehari/vacancychennai/issues).

## License

MIT License - See LICENSE file for details

## Support

For questions or issues, reach out via [GitHub Issues](https://github.com/itsmehari/vacancychennai/issues) or contact the maintainer.
