create table if not exists payment_orders (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid,
  provider varchar(30) not null,
  provider_order_id varchar(120) unique,
  amount_paise bigint not null,
  currency varchar(10) not null default 'INR',
  status varchar(30) not null default 'created',
  entitlement_type varchar(40),
  entitlement_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider varchar(30) not null,
  event_id varchar(150) not null,
  event_type varchar(120) not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint payment_webhook_events_unique unique(provider, event_id)
);

create table if not exists payment_invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references payment_orders(id),
  invoice_number varchar(50) unique,
  taxable_amount numeric(12,2) not null,
  gst_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  status varchar(30) not null default 'issued',
  created_at timestamptz not null default now()
);

create table if not exists payment_refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references payment_orders(id),
  provider_refund_id varchar(120),
  amount_paise bigint not null,
  reason text,
  status varchar(30) not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists entitlements (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid,
  entitlement_type varchar(40) not null,
  entitlement_ref text,
  source_order_id uuid references payment_orders(id),
  status varchar(30) not null default 'active',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists moderation_cases (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  employer_id uuid references employer_profiles(id),
  risk_score int not null default 0,
  priority varchar(20) not null default 'normal',
  reason_codes text[] not null default '{}',
  status varchar(20) not null default 'open',
  assigned_to uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  consent_type varchar(50) not null,
  consent_version varchar(20) not null,
  accepted boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists privacy_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  request_type varchar(20) not null,
  status varchar(20) not null default 'open',
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

