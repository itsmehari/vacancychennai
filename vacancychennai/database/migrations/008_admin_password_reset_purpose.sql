-- Admin password reset tokens (same mechanics as employer password_reset, separate purpose for routing).

alter table email_verification_tokens drop constraint if exists email_verification_tokens_purpose_check;

alter table email_verification_tokens add constraint email_verification_tokens_purpose_check check (
  purpose in (
    'employer_verify',
    'candidate_magic',
    'password_reset',
    'admin_password_reset'
  )
);
