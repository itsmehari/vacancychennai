# Vacancy Chennai MVP PRD

## 1. Product Summary
Vacancy Chennai is a hyperlocal hiring platform for Chennai and suburbs. The core value is location-first discovery: users should find jobs near their home quickly, and employers should fill local roles faster at low cost.

## 2. Objectives (First 90 Days)
- Build initial marketplace liquidity with 300-500 active jobs.
- Deliver fast apply flow with minimal friction (name + phone).
- Enable SMEs to post jobs in under 3 minutes.
- Establish area-based SEO pages and WhatsApp distribution.
- Validate paid demand through featured listings in month 3.

## 3. User Segments
- Employers: SMEs, startups, clinics, shops, logistics operators, small offices.
- Candidates: freshers, non-IT and IT support workers, part-time seekers, women returnees, blue/grey-collar workforce.

## 4. Positioning
- Hyperlocal hiring for Chennai.
- Jobs near your house, not across the city.
- Faster than resume-heavy portals.

## 5. Scope

### In Scope (Phase 1 MVP)
- Public job browse with zone -> area filters.
- Area landing pages with SEO metadata and JobPosting schema.
- Job details page with quick apply.
- Candidate quick apply (name, phone, optional email/resume link).
- Employer signup/login and one-page post-job form.
- Employer dashboard (active jobs + applications).
- Admin moderation (review/publish/pause/close jobs).
- Basic audit trail for critical actions.

### Out of Scope (Post-MVP)
- AI job matching
- Bulk posting API
- Advanced recruiter team structures
- Full automation of WhatsApp distribution

## 6. Geographic Model
All jobs must map to structured location entities:
- Zone (OMR, Tambaram, Porur, Ambattur, Central Chennai, etc.)
- Area (Sholinganallur, Velachery, Chromepet, etc.)
- Landmark (free text, optional)

## 7. Functional Requirements

### Candidate
- Browse jobs by zone and area.
- Filter by job type, salary range, industry.
- Open job detail and apply in one click.
- View submitted applications (if logged in).

### Employer
- Register and login.
- Create jobs with location mapping and moderation status.
- View applications with stage updates.
- Shortlist or reject applicants.

### Admin
- Review pending jobs.
- Approve/reject/close/pause jobs.
- Manage abuse flags and audits.
- View aggregate dashboard KPIs.

## 8. Non-Functional Requirements
- Stack: Next.js full-stack on Vercel.
- Database: Neon PostgreSQL.
- Performance target: support ~1,000 daily users at launch.
- Security: server-side validation, RBAC, rate limit on forms.
- Quality: strict TypeScript + ESLint baseline.

## 9. Monetization Path
- Month 1-2: free listings.
- Month 3: featured jobs (INR 199-499).
- Month 4-6: employer subscription (INR 999/month baseline).
- Month 6+: resume database unlock + assisted hiring service.

## 10. KPIs
- Active jobs by zone.
- Applications per published job.
- Time-to-first-applicant.
- Employer repeat posting rate.
- Featured listing adoption (from month 3).

## 11. Risks and Mitigations
- Empty marketplace risk -> aggressive manual seeding and outreach.
- Low quality listings -> moderation queue and audit logs.
- Candidate drop-off -> quick apply without mandatory resume.

## 12. Acceptance Criteria

### Public Site Acceptance
- Users can access zone and area pages with live jobs.
- `/jobs-in-[zone]` and `/jobs-in-[area]` pages include canonical and JSON-LD.
- Job detail pages show complete role metadata and apply actions.

### Candidate Acceptance
- Guest can quick apply with required fields (name, phone).
- Logged-in candidates can apply and view application history.
- Validation errors are clear on both client and server.

### Employer Acceptance
- Employer can sign up, sign in, and create jobs.
- Created jobs enter review state until moderation.
- Employer can view active jobs and applicants.

### Admin Acceptance
- Admin can list pending jobs and change status.
- Admin actions are captured in audit logs.
- Admin dashboard shows jobs/applications summary.

### Distribution Acceptance
- Team can export or copy published jobs for WhatsApp/Telegram posting.
- Daily quota checklist exists and can be updated.

### Security Acceptance
- Role-based guards block unauthorized route access.
- Sensitive actions verify server session and role.
- No client-only trust for job status updates or moderation.

