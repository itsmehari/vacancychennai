-- Money Boxx Finance Ltd — HL & LAP sales roles (Tamil Nadu). Idempotent.

INSERT INTO users (id, role, full_name, email, phone, password_hash, status) VALUES
(
  'e0000000-0000-4000-8000-0000000000e4'::uuid,
  'employer',
  'Money Boxx Finance HR',
  'Kamalakannang@moneyboxxfinance.com',
  '9514282152',
  '$2b$10$8IoUtOgfdCYhnyR5aw0lkek4Q2EX9hpJZX9q1Or9kIefIZlBYNqla',
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  updated_at = now();

INSERT INTO employer_profiles (user_id, company_name)
SELECT id, 'Money Boxx Finance Ltd' FROM users WHERE email = 'Kamalakannang@moneyboxxfinance.com'
ON CONFLICT (user_id) DO UPDATE SET company_name = EXCLUDED.company_name;

-- Job body is served from static curated listing (job-money-boxx-hl-lap-tamil-nadu-urgent).
