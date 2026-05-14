-- Listing windows + entitlement consumption (Vacancy Chennai billing).
alter table jobs add column if not exists published_at timestamptz;
alter table jobs add column if not exists expires_at timestamptz;
alter table jobs add column if not exists billing_source varchar(32);

comment on column jobs.billing_source is 'First publish: post_credit | volume_pack | monthly_pass | waived | admin_grant';

create table if not exists entitlement_usages (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references entitlements(id) on delete restrict,
  job_id uuid not null references jobs(id) on delete cascade,
  owner_user_id uuid not null,
  consumed_at timestamptz not null default now(),
  constraint entitlement_usages_job_unique unique (job_id)
);

create index if not exists idx_entitlement_usages_owner on entitlement_usages(owner_user_id);
create index if not exists idx_entitlement_usages_entitlement on entitlement_usages(entitlement_id);

create index if not exists idx_entitlements_owner_status on entitlements(owner_user_id, status);

-- Idempotent payment application (external payment reference).
alter table payment_orders add column if not exists provider_payment_id varchar(150);
create unique index if not exists payment_orders_provider_payment_uidx
  on payment_orders(provider_payment_id)
  where provider_payment_id is not null;

comment on column payment_orders.employer_id is 'Employer users.id (session actorId), not employer_profiles.id';
