-- Office Manager (advocate office): Parrys & Kilpauk — 2 positions. Idempotent.

INSERT INTO locations (zone, area, pincode, lat, lng) VALUES
('Chennai Central', 'Parrys', '600001', 13.0891, 80.2925),
('Chennai Central', 'Kilpauk', '600010', 13.0838, 80.2413)
ON CONFLICT (zone, area) DO NOTHING;

INSERT INTO users (id, role, full_name, email, phone, password_hash, status) VALUES
(
  'e0000000-0000-4000-8000-0000000000e3'::uuid,
  'employer',
  'Advocate Office HR',
  'external.advocate.office@vacancychennai.in',
  '8248622449',
  '$2b$10$8IoUtOgfdCYhnyR5aw0lkek4Q2EX9hpJZX9q1Or9kIefIZlBYNqla',
  'active'
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  updated_at = now();

INSERT INTO employer_profiles (user_id, company_name)
SELECT id, 'Advocate Office' FROM users WHERE email = 'external.advocate.office@vacancychennai.in'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO jobs (
  employer_id, location_id, landmark_text, title, category, industry,
  job_type, salary_min, salary_max, description, status, listing_tier, is_featured
)
SELECT ep.id, loc.id,
  'Advocate offices at Parrys and Kilpauk — 2 positions (one per location).',
  'Office Manager',
  'Admin',
  'Legal',
  'full_time',
  30000,
  30000,
  'Vacancy: Office Manager — 2 positions (one at Parrys, one at Kilpauk).

Gender: Open to all (male / female).
Salary: ₹30,000 per month.
Timings: 9:00 AM – 6:00 PM.
Age: Up to 45 years.

Requirements:
• Minimum relevant work experience is mandatory.
• Preference for candidates residing nearby.
• Position is for an advocate office.

How to apply:
Send your resume via WhatsApp to 8248622449.
Kindly avoid unnecessary phone calls — WhatsApp only.',
  'published',
  'free',
  false
FROM employer_profiles ep
JOIN users eu ON eu.id = ep.user_id AND eu.email = 'external.advocate.office@vacancychennai.in'
JOIN locations loc ON loc.area = 'Parrys' AND loc.zone = 'Chennai Central'
WHERE NOT EXISTS (
  SELECT 1 FROM jobs j
  JOIN employer_profiles ep2 ON ep2.id = j.employer_id
  JOIN users u2 ON u2.id = ep2.user_id AND u2.email = 'external.advocate.office@vacancychennai.in'
  JOIN locations lj ON lj.id = j.location_id
  WHERE j.title = 'Office Manager' AND lj.area = 'Parrys' AND lj.zone = 'Chennai Central'
);

INSERT INTO jobs (
  employer_id, location_id, landmark_text, title, category, industry,
  job_type, salary_min, salary_max, description, status, listing_tier, is_featured
)
SELECT ep.id, loc.id,
  'Advocate offices at Parrys and Kilpauk — 2 positions (one per location).',
  'Office Manager',
  'Admin',
  'Legal',
  'full_time',
  30000,
  30000,
  'Vacancy: Office Manager — 2 positions (one at Parrys, one at Kilpauk).

Gender: Open to all (male / female).
Salary: ₹30,000 per month.
Timings: 9:00 AM – 6:00 PM.
Age: Up to 45 years.

Requirements:
• Minimum relevant work experience is mandatory.
• Preference for candidates residing nearby.
• Position is for an advocate office.

How to apply:
Send your resume via WhatsApp to 8248622449.
Kindly avoid unnecessary phone calls — WhatsApp only.',
  'published',
  'free',
  false
FROM employer_profiles ep
JOIN users eu ON eu.id = ep.user_id AND eu.email = 'external.advocate.office@vacancychennai.in'
JOIN locations loc ON loc.area = 'Kilpauk' AND loc.zone = 'Chennai Central'
WHERE NOT EXISTS (
  SELECT 1 FROM jobs j
  JOIN employer_profiles ep2 ON ep2.id = j.employer_id
  JOIN users u2 ON u2.id = ep2.user_id AND u2.email = 'external.advocate.office@vacancychennai.in'
  JOIN locations lj ON lj.id = j.location_id
  WHERE j.title = 'Office Manager' AND lj.area = 'Kilpauk' AND lj.zone = 'Chennai Central'
);
