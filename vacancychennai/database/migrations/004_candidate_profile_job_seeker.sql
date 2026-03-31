-- Job seeker profile (PRD): short headline in bio, experience band, résumé URLs, employer contact unlock.
-- Idempotent for Neon / Postgres.

alter table candidate_profiles add column if not exists bio text;
alter table candidate_profiles add column if not exists experience_level varchar(40);
alter table candidate_profiles add column if not exists resume_url text;
alter table candidate_profiles add column if not exists resume_file_key text;
alter table candidate_profiles add column if not exists resume_contacts_unlocked boolean not null default false;
