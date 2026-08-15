-- Local job requests: one public post per candidate (hyperlocal pages).

create table if not exists local_job_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  area_slug varchar(80) not null,
  full_name varchar(200) not null,
  date_of_birth date not null,
  education varchar(80) not null,
  location_text varchar(200) not null,
  experience_level varchar(20) not null,
  job_needs text not null,
  contact_phone varchar(20) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_local_job_requests_area_created
  on local_job_requests (area_slug, created_at desc);
