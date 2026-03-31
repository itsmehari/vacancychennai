# Candidate identity — product decision

**Status:** Accepted (2026-04).  
**Scope:** Vacancy Chennai job seeker profile and applications.

## Decision

We **keep login-first identity** as the default and only supported path for saved candidate profiles:

- Authentication ties to **`users`** rows and sessions (`requireRole("candidate")`).
- **`candidate_profiles`** is **1:1 with `user_id`**, updated via `upsertCandidateProfileAfterEdit`.

## Deferred (not in scope)

**Guest / email-only profile** (MyOMR-style natural key on email without a full account) is **not implemented**. It would need:

- A separate data model and/or guest rows, alignment with magic-link sessions, and UX for merging guest applications into an account.

## Implications

- Marketing and apply flows should continue to assume **optional account**: browsing and quick apply work without login; saving a durable profile requires sign-in.
- See [`job-seeker-profile-plan.md`](./job-seeker-profile-plan.md) for technical file index and backlog.
