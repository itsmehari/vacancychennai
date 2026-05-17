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

INSERT INTO jobs (
  id,
  employer_id, location_id, landmark_text, title, category, industry,
  job_type, salary_min, salary_max, description, status, listing_tier, is_featured,
  published_at
)
SELECT
  'f0000000-0000-4000-8000-0000000000b1'::uuid,
  ep.id,
  loc.id,
  'Chennai Poonamallee hub plus Kanchipuram, Vellore, Ambur, Coimbatore, Salem, Hosur, Kumbakonam, Trichy, Madurai, Theni.',
  'Branch Manager / Senior Relationship Manager / Relationship Manager — HL & LAP',
  'Finance',
  'NBFC',
  'full_time',
  25000,
  120000,
  'Urgent requirement — Money Boxx Finance Ltd (HL & LAP).

Open positions:
• Branch Manager
• Senior Relationship Manager
• Relationship Manager

Product: Home Loan (HL) and Loan Against Property (LAP).

Locations:
Chennai Poonamallee, Kanchipuram, Vellore, Ambur, Coimbatore, Salem, Hosur, Kumbakonam, Trichy, Madurai, Theni.

Qualification: 12th pass and degree.
Gender: Male candidates only.
Experience: Minimum 6 months in the same field (HL/LAP/NBFC sales).
Joining: Immediate joiners preferred.

How to apply:
Send your résumé to Kamalakannang@moneyboxxfinance.com or call +91 95142 82152.

Salary and CTC were not stated on the original notice; confirm with the employer when you apply.',
  'published',
  'urgent',
  true,
  now()
FROM employer_profiles ep
JOIN users eu ON eu.id = ep.user_id AND eu.email = 'Kamalakannang@moneyboxxfinance.com'
CROSS JOIN locations loc
WHERE loc.zone = 'Porur / Poonamallee' AND loc.area = 'Porur'
  AND NOT EXISTS (
    SELECT 1 FROM jobs j
    WHERE j.title = 'Branch Manager / Senior Relationship Manager / Relationship Manager — HL & LAP'
      AND j.employer_id = ep.id
  );
