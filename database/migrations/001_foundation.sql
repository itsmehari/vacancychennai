create extension if not exists "pgcrypto";

create type if not exists user_role as enum ('candidate', 'employer', 'admin');
create type if not exists account_status as enum ('active', 'suspended', 'deleted');
create type if not exists job_status as enum ('draft', 'review', 'published', 'paused', 'closed');
create type if not exists job_type as enum ('full_time', 'part_time', 'internship', 'contract', 'temporary');
create type if not exists application_stage as enum ('applied', 'screening', 'interview', 'offer', 'rejected');
create type if not exists listing_tier as enum ('free', 'featured', 'urgent');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role user_role not null,
  full_name varchar(120) not null,
  email varchar(255) unique,
  phone varchar(20) unique not null,
  password_hash text,
  status account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  session_token text not null unique,
  user_agent text,
  ip_address inet,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists otp_challenges (
  id uuid primary key default gen_random_uuid(),
  phone varchar(20) not null,
  otp_code varchar(10) not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists login_attempts (
  id uuid primary key default gen_random_uuid(),
  principal varchar(255) not null,
  failed_count int not null default 0,
  blocked_until timestamptz,
  updated_at timestamptz not null default now(),
  constraint login_attempts_principal_unique unique(principal)
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  zone varchar(80) not null,
  area varchar(120) not null,
  pincode varchar(10),
  lat numeric(10,7),
  lng numeric(10,7),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_zone_area_unique unique(zone, area)
);

create table if not exists employer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id),
  company_name varchar(180) not null,
  verification_tier varchar(40) not null default 'basic',
  verification_status varchar(30) not null default 'pending',
  risk_score int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists candidate_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id),
  location_id uuid references locations(id),
  skills text[] not null default '{}',
  profile_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references employer_profiles(id),
  location_id uuid not null references locations(id),
  landmark_text varchar(180),
  title varchar(180) not null,
  category varchar(100) not null,
  industry varchar(100),
  job_type job_type not null,
  salary_min integer,
  salary_max integer,
  description text not null,
  status job_status not null default 'draft',
  listing_tier listing_tier not null default 'free',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  candidate_id uuid references candidate_profiles(id),
  applicant_name varchar(120) not null,
  applicant_phone varchar(20) not null,
  applicant_email varchar(255),
  resume_url text,
  stage application_stage not null default 'applied',
  source_channel varchar(50) not null default 'platform',
  viewed_by_employer_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action varchar(60) not null,
  entity_type varchar(60) not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_jobs_location_status_created on jobs(location_id, status, created_at desc);
create index if not exists idx_jobs_category_type_status on jobs(category, job_type, status);
create index if not exists idx_applications_job_stage_created on applications(job_id, stage, created_at desc);
create index if not exists idx_sessions_token on sessions(session_token);
create index if not exists idx_otp_challenges_phone_created on otp_challenges(phone, created_at desc);

