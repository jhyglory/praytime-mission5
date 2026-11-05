BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Nullable, without defaults/backfill: legacy rows and the existing Lovable form stay compatible.
ALTER TABLE public.beta_signups
  ADD COLUMN privacy_consent_at timestamptz,
  ADD COLUMN privacy_policy_version text,
  ADD COLUMN signup_source text;

-- No RLS, privilege, UNIQUE constraint or existing row changes.
NOTIFY pgrst, 'reload schema';
COMMIT;
