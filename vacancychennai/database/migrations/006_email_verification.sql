-- Email verification (employer) and magic-link sign-in (candidate).
-- Demo accounts are marked verified so local/prod seed flows keep working.

alter table users add column if not exists email_verified_at timestamptz null;

create table if not exists email_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null,
  purpose varchar(40) not null,
  expires_at timestamptz not null,
  consumed_at timestamptz null,
  created_at timestamptz not null default now(),
  constraint email_verification_tokens_purpose_check check (
    purpose in ('employer_verify', 'candidate_magic')
  )
);

create unique index if not exists email_verification_tokens_token_hash_key
  on email_verification_tokens (token_hash);

create index if not exists email_verification_tokens_user_purpose_idx
  on email_verification_tokens (user_id, purpose);

update users
set email_verified_at = now()
where email in (
  'employer@vacancychennai.in',
  'candidate@vacancychennai.in',
  'admin@vacancychennai.in'
)
  and email_verified_at is null;
