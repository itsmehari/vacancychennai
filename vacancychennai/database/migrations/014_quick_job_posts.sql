-- Quick job posts: phone, email, and pasted vacancy text. Reviewed in /super-admin.

create table if not exists quick_job_posts (
  id uuid primary key default gen_random_uuid(),
  phone varchar(20) not null,
  email varchar(320) not null,
  description text not null,
  content_hash varchar(64) not null,
  ip_hash varchar(64),
  status varchar(20) not null default 'new',
  created_at timestamptz not null default now(),
  constraint quick_job_posts_status_check check (status in ('new', 'reviewed', 'spam'))
);

create index if not exists idx_quick_job_posts_created
  on quick_job_posts (created_at desc);

create index if not exists idx_quick_job_posts_phone_hash
  on quick_job_posts (phone, content_hash, created_at desc);

create index if not exists idx_quick_job_posts_ip_created
  on quick_job_posts (ip_hash, created_at desc);
