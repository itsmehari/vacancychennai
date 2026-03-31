-- Self-serve signup (nullable phone for email-first candidates), password reset tokens, email/SMS/job-alert subscriptions.

alter table users alter column phone drop not null;

alter table email_verification_tokens drop constraint if exists email_verification_tokens_purpose_check;

alter table email_verification_tokens add constraint email_verification_tokens_purpose_check check (
  purpose in ('employer_verify', 'candidate_magic', 'password_reset')
);

create table if not exists email_subscriptions (
  id uuid primary key default gen_random_uuid(),
  channel varchar(20) not null check (channel in ('email_digest', 'sms_reminder', 'job_alerts')),
  address varchar(255) not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists email_subscriptions_address_channel_key
  on email_subscriptions (address, channel);

create index if not exists email_subscriptions_channel_idx on email_subscriptions (channel);
