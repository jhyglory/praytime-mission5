# Vercel deployment checklist

Current project: glorifier1/praytime-mission5, linked to jhyglory/praytime-mission5.
Public URL: https://praytime-mission5.vercel.app/.

**GitHub publication approved on2026-11-09.** Commit/push the verified refactor on the existing branch. Vercel Git integration may deploy automatically; no separate manual deployment or domain/DNS/branch/environment change is requested.

## When publication is authorized

- Preserve feature/mission-5-landing and existing PR #1 ([정하영]-미션5). Do not merge or change main.
- Root Directory: repository root containing package.json (not the outer local outputs folder).
- Framework: Next.js; Node24; install npm ci; build npm run build; default Next.js output, no static export because the API is required.
- Existing Git integration handles deployment after an authorized push; avoid duplicate manual releases. Confirm the Ready deployment SHA and canonical alias before reporting success.
- Check public Desktop/Mobile appearance, assets, controls, console and overflow with read-only requests. Do not submit production test applicants during visual QA.

## Environment safety

Production signup was activated in the approved earlier release. Preserve its existing settings. Preview/default local/automated browser tests remain disabled or mocked.

Names: BETA_SIGNUP_PERSISTENCE, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (legacy SUPABASE_ANON_KEY fallback), PRIVACY_COLLECTION_APPROVED, SITE_URL. The current policy identifier is defined by server consent code and the approved snapshot; do not invent a new env value or legal version during deployment. Never expose credentials via NEXT_PUBLIC_ variables or client code. Do not use secret/service-role keys.

See docs/BACKEND_ARCHITECTURE.md, docs/BACKEND_ACTIVATION.md and config/environment.example for the existing integration. No new database, migration, RLS changes, applicant queries or real INSERT belong to this refactor.

## Local verification

npm run lint; npm run typecheck; npm run test; npm run build -- --webpack; npm run test:e2e.

The webpack option is the established local workaround for the historical Turbopack worker-port restriction. Keep production project/build configuration unchanged. If the browser-test port is occupied, choose another free port in an ignored temporary config and retain persistence-disabled environment overrides. Do not reuse a user's live server or stop unrelated services.
