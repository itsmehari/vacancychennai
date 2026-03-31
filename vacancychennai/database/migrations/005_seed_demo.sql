-- Demo seed for Vacancy Chennai (Neon / Postgres). Run after 001–004.
-- Idempotent: safe to re-run; refreshes demo users by email.
--
-- Logins:
--   employer@vacancychennai.in  / demo123
--   admin@vacancychennai.in     / admin123
--   candidate@vacancychennai.in (email only on /candidate/login — no password)
--
-- Bcrypt hashes generated with bcryptjs cost 10 (employer/admin passwords).

INSERT INTO users (id, role, full_name, email, phone, password_hash, status) VALUES
(
  'e0000000-0000-4000-8000-0000000000e1'::uuid,
  'employer',
  'OMR Tech HR',
  'employer@vacancychennai.in',
  '9000000000',
  '$2b$10$y/W/D/iOQwFOV.Mz8wvwJeW9c.L03DKe0VJfA9oLQ8CXrfRCw3sVq',
  'active'
),
(
  'c0000000-0000-4000-8000-0000000000c1'::uuid,
  'candidate',
  'Demo Candidate',
  'candidate@vacancychennai.in',
  '9000000001',
  NULL,
  'active'
),
(
  'a0000000-0000-4000-8000-0000000000a1'::uuid,
  'admin',
  'Vacancy Chennai Admin',
  'admin@vacancychennai.in',
  '9000000099',
  '$2b$10$a4GFEqyVJ6lllMoO4ZU1W.oxdqoxxfw8M/rhwWCM1kytij5f7Z98i',
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  password_hash = EXCLUDED.password_hash,
  updated_at = now();

INSERT INTO locations (zone, area, pincode, lat, lng) VALUES
('OMR / ECR', 'Sholinganallur', '600119', 12.901, 80.2279),
('OMR / ECR', 'Velachery', '600042', 12.9759, 80.2212),
('Tambaram / Chromepet', 'Tambaram', '600045', 12.9249, 80.1000),
('Porur / Poonamallee', 'Porur', '600116', 13.038, 80.1565),
('Ambattur / Avadi', 'Ambattur', '600053', 13.1143, 80.1565)
ON CONFLICT (zone, area) DO NOTHING;

INSERT INTO employer_profiles (user_id, company_name)
SELECT id, 'OMR Tech Solutions' FROM users WHERE email = 'employer@vacancychennai.in'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO candidate_profiles (user_id, location_id, skills, profile_completed)
SELECT u.id, loc.id, ARRAY['MS Office', 'Telecalling']::text[], false
FROM users u
JOIN locations loc ON loc.area = 'Velachery' AND loc.zone = 'OMR / ECR'
WHERE u.email = 'candidate@vacancychennai.in'
ON CONFLICT (user_id) DO NOTHING;

-- Published jobs (skip if this employer already has a job with the same title)
INSERT INTO jobs (
  employer_id, location_id, landmark_text, title, category, industry,
  job_type, salary_min, salary_max, description, status, listing_tier, is_featured
)
SELECT ep.id, loc.id, 'Near Velachery Bus Stand', 'Customer Support Executive', 'BPO / Telecaller', 'Service',
  'full_time', 18000, 24000,
  'Handle inbound customer calls and update CRM entries.',
  'published', 'featured', true
FROM employer_profiles ep
JOIN users eu ON eu.id = ep.user_id AND eu.email = 'employer@vacancychennai.in'
JOIN locations loc ON loc.area = 'Velachery' AND loc.zone = 'OMR / ECR'
WHERE NOT EXISTS (
  SELECT 1 FROM jobs j
  JOIN employer_profiles ep2 ON ep2.id = j.employer_id
  JOIN users u2 ON u2.id = ep2.user_id AND u2.email = 'employer@vacancychennai.in'
  WHERE j.title = 'Customer Support Executive'
);

INSERT INTO jobs (
  employer_id, location_id, landmark_text, title, category, industry,
  job_type, salary_min, salary_max, description, status, listing_tier, is_featured
)
SELECT ep.id, loc.id, 'Near Railway Station', 'Delivery Associate', 'Logistics', 'E-commerce',
  'part_time', 15000, 22000,
  'Handle last-mile deliveries for local order clusters.',
  'published', 'free', false
FROM employer_profiles ep
JOIN users eu ON eu.id = ep.user_id AND eu.email = 'employer@vacancychennai.in'
JOIN locations loc ON loc.area = 'Tambaram' AND loc.zone = 'Tambaram / Chromepet'
WHERE NOT EXISTS (
  SELECT 1 FROM jobs j
  JOIN employer_profiles ep2 ON ep2.id = j.employer_id
  JOIN users u2 ON u2.id = ep2.user_id AND u2.email = 'employer@vacancychennai.in'
  WHERE j.title = 'Delivery Associate'
);

-- One job in moderation queue for admin UI
INSERT INTO jobs (
  employer_id, location_id, landmark_text, title, category, industry,
  job_type, salary_min, salary_max, description, status, listing_tier, is_featured
)
SELECT ep.id, loc.id, 'Near SIPCOT', 'Junior IT Support', 'IT Support', 'IT',
  'full_time', 20000, 30000,
  'Troubleshoot laptops and internal software tickets.',
  'review', 'free', false
FROM employer_profiles ep
JOIN users eu ON eu.id = ep.user_id AND eu.email = 'employer@vacancychennai.in'
JOIN locations loc ON loc.area = 'Sholinganallur' AND loc.zone = 'OMR / ECR'
WHERE NOT EXISTS (
  SELECT 1 FROM jobs j
  JOIN employer_profiles ep2 ON ep2.id = j.employer_id
  JOIN users u2 ON u2.id = ep2.user_id AND u2.email = 'employer@vacancychennai.in'
  WHERE j.title = 'Junior IT Support'
);
