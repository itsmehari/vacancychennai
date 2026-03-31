-- Vacancy Chennai core database schema (Neon PostgreSQL)
-- Phase 1 focused, with phase-ready monetization tables.

create extension if not exists "pgcrypto";

-- ========= Enums =========
create type user_role as enum ('candidate', 'employer', 'admin');
create type account_status as enum ('active', 'suspended', 'deleted');
create type auth_provider as enum ('email_password', 'phone_otp', 'google', 'linkedin');
create type job_status as enum ('draft', 'review', 'published', 'paused', 'closed');
create type job_type as enum ('full_time', 'part_time', 'internship', 'contract', 'temporary');
create type application_stage as enum ('applied', 'screening', 'interview', 'offer', 'rejected');
create type audit_action as enum ('create', 'update', 'delete', 'moderate', 'status_change', 'login', 'logout');
create type listing_tier as enum ('free', 'featured', 'urgent');

-- ========= Timestamps helper =========
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ========= Auth / Users =========
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role user_role not null,
  full_name varchar(120) not null,
  email varchar(255) unique,
  phone varchar(20) unique not null,
  password_hash text,
  auth_method auth_provider not null default 'email_password',
  is_phone_verified boolean not null default false,
  is_email_verified boolean not null default false,
  status account_status not null default 'active',
  last_login_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_email_or_phone_check check (email is not null or phone is not null)
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

-- ========= Profile tables =========
create table if not exists candidate_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id),
  location_id uuid,
  skills text[] not null default '{}',
  years_experience numeric(4,1),
  resume_url text,
  resume_file_key text,
  preferred_job_types job_type[] not null default '{}',
  bio text,
  experience_level varchar(40),
  resume_contacts_unlocked boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists employer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id),
  company_name varchar(180) not null,
  company_slug varchar(200) unique,
  industry varchar(100),
  company_size varchar(50),
  website_url text,
  logo_url text,
  contact_name varchar(120),
  contact_phone varchar(20),
  address_line text,
  is_verified boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========= Location intelligence =========
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  zone varchar(80) not null,
  area varchar(120) not null,
  pincode varchar(10),
  lat numeric(10,7),
  lng numeric(10,7),
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_zone_area_unique unique(zone, area)
);

-- ========= Jobs =========
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
  currency varchar(10) not null default 'INR',
  is_salary_visible boolean not null default true,
  openings integer,
  min_experience_years numeric(4,1),
  max_experience_years numeric(4,1),
  description text not null,
  requirements text,
  benefits text,
  status job_status not null default 'draft',
  listing_tier listing_tier not null default 'free',
  is_featured boolean not null default false,
  featured_until timestamptz,
  expires_at timestamptz,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_salary_check check (
    salary_min is null or salary_max is null or salary_min <= salary_max
  )
);

-- ========= Applications =========
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  candidate_id uuid references candidate_profiles(id),
  applicant_name varchar(120) not null,
  applicant_phone varchar(20) not null,
  applicant_email varchar(255),
  resume_url text,
  cover_note text,
  stage application_stage not null default 'applied',
  source_channel varchar(50) not null default 'platform',
  is_contact_unlocked boolean not null default false,
  viewed_by_employer_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========= Marketplace analytics =========
create table if not exists job_views (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id),
  visitor_id varchar(120),
  source varchar(60),
  viewed_at timestamptz not null default now()
);

create table if not exists abuse_reports (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  reporter_user_id uuid references users(id),
  reason varchar(80) not null,
  details text,
  status varchar(30) not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========= Monetization (phase-ready) =========
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  code varchar(40) unique not null,
  name varchar(100) not null,
  monthly_price_inr integer not null,
  listing_quota integer,
  featured_quota integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists employer_subscriptions (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references employer_profiles(id),
  plan_id uuid not null references plans(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status varchar(30) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========= Audit logging =========
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id),
  action audit_action not null,
  entity_type varchar(60) not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- ========= Foreign keys depending on prior tables =========
alter table candidate_profiles
  add constraint candidate_profiles_location_id_fk
  foreign key (location_id) references locations(id);

-- ========= Triggers =========
create trigger users_set_updated_at
before update on users
for each row execute function set_updated_at();

create trigger candidate_profiles_set_updated_at
before update on candidate_profiles
for each row execute function set_updated_at();

create trigger employer_profiles_set_updated_at
before update on employer_profiles
for each row execute function set_updated_at();

create trigger locations_set_updated_at
before update on locations
for each row execute function set_updated_at();

create trigger jobs_set_updated_at
before update on jobs
for each row execute function set_updated_at();

create trigger applications_set_updated_at
before update on applications
for each row execute function set_updated_at();

create trigger abuse_reports_set_updated_at
before update on abuse_reports
for each row execute function set_updated_at();

create trigger plans_set_updated_at
before update on plans
for each row execute function set_updated_at();

create trigger employer_subscriptions_set_updated_at
before update on employer_subscriptions
for each row execute function set_updated_at();

-- ========= Indexes (critical) =========
create index if not exists idx_users_role_status on users(role, status);
create index if not exists idx_users_deleted_at on users(deleted_at);
create index if not exists idx_locations_zone_area on locations(zone, area);
create index if not exists idx_locations_pincode on locations(pincode);
create index if not exists idx_jobs_location_status_created on jobs(location_id, status, created_at desc);
create index if not exists idx_jobs_category_type_status on jobs(category, job_type, status);
create index if not exists idx_jobs_salary_range on jobs(salary_min, salary_max);
create index if not exists idx_jobs_employer_status on jobs(employer_id, status);
create index if not exists idx_jobs_deleted_at on jobs(deleted_at);
create index if not exists idx_jobs_fulltext on jobs using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,'')));
create index if not exists idx_applications_job_stage_created on applications(job_id, stage, created_at desc);
create index if not exists idx_applications_candidate_created on applications(candidate_id, created_at desc);
create index if not exists idx_audit_logs_actor_created on audit_logs(actor_user_id, created_at desc);
create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_job_views_job_date on job_views(job_id, viewed_at desc);

