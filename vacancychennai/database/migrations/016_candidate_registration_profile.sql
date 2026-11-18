-- Seeker registration profile: qualification, job preferences, and admin phone check.
-- Idempotent. Contact on a job is shown after these fields are saved; phone check is separate.

alter table candidate_profiles add column if not exists education varchar(40);

alter table candidate_profiles add column if not exists job_preferences text[] not null default '{}';

alter table candidate_profiles add column if not exists phone_verification_status varchar(20) not null default 'pending';

alter table candidate_profiles drop constraint if exists candidate_profiles_phone_verification_status_check;

alter table candidate_profiles
  add constraint candidate_profiles_phone_verification_status_check
  check (phone_verification_status in ('pending', 'verified', 'rejected'));
