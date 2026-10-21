-- Optional area and role on job alerts. Null means the existing city-wide digest.

alter table email_subscriptions
  add column if not exists interest_area varchar(80),
  add column if not exists interest_role varchar(40);
