-- DRAFT ONLY. Not executed during the design-independent preparation stage.
-- Historical equivalent was already applied under prior authorization.
-- See docs/CONSENT_MIGRATION_RUNBOOK.md before considering execution.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE public.beta_signups
  ADD COLUMN IF NOT EXISTS privacy_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS privacy_policy_version text,
  ADD COLUMN IF NOT EXISTS signup_source text;

-- No defaults, backfill, NOT NULL, RLS, grants, UNIQUE or row changes.
NOTIFY pgrst, 'reload schema';
COMMIT;
