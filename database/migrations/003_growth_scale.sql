create table if not exists saved_jobs (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id),
  job_id uuid references jobs(id),
  created_at timestamptz not null default now(),
  constraint saved_jobs_candidate_job_unique unique(candidate_id, job_id)
);

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidate_profiles(id),
  query jsonb not null,
  channel varchar(20) not null default 'email',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists interview_slots (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  meeting_link text,
  status varchar(20) not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table if not exists applicant_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id),
  employer_id uuid references employer_profiles(id),
  note_text text not null,
  created_at timestamptz not null default now()
);

create table if not exists distribution_campaigns (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  zone varchar(80),
  category varchar(100),
  channel varchar(30) not null,
  schedule_at timestamptz,
  status varchar(20) not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists distribution_messages (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references distribution_campaigns(id),
  destination varchar(160) not null,
  payload text not null,
  status varchar(20) not null default 'queued',
  retries int not null default 0,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists distribution_dead_letters (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references distribution_messages(id),
  reason text not null,
  payload text not null,
  created_at timestamptz not null default now()
);

create table if not exists city_configs (
  id uuid primary key default gen_random_uuid(),
  city_key varchar(40) not null unique,
  domain varchar(150) not null,
  is_enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

