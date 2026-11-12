# PrayTime project instructions

## Current task · 2026-11-12

Implement prayer CMS (Mission6) on feature/mission-6-prayer-cms, preserving Mission5 landing, original nativeJSON files and live beta-signup DB. User authorizes isolated demo DB/Storage, generic public prayer seed, QA-only CRUD, GitHub publication and Preview deployment, not Production replacement. Free dedicated Supabase project creation approved at quoted monthly0; projectref cibcyeyznfmywacfiokh. Auth/roles/user-RLS deferred toMission7; demo admin must clearly state no authentication. No existing operational data changes, production env/DNS changes, main/merge or paid resource creation. Server-only SUPABASE_SECRET_KEY, private bucket with no anonymous policies; no secrets in logs/client/Git. Earlier style-only publishing restrictions are historical.

## Read first

- README.md: setup, commands and documentation map.
- docs/PRAYTIME_PRODUCT.md: product boundaries.
- docs/PRAYTIME_DESIGN.md: visual tokens, responsive/motion contracts.
- docs/MISSION5_LANDING.md: implementation and QA requirements.

Use the existing Next.js App Router / React / TypeScript / Tailwind v4 / shadcn project. Preserve the existing Mission5 branch and PR #1 ([정하영]-미션5). No reset, rebase, force-push, main changes, new PR, DNS cutover or merge.

## Implementation rules

- Current user instructions override Figma and older documents. Do not invent copy, features or redesign.
- Use Tailwind utilities for ordinary layout, spacing, color, type and responsive rules. Theme lives in src/app/globals.css; md=768px, lg=1200px preserve the original breakpoints. Keep custom CSS for intricate artwork/motion and contextual styling not yet migrated.
- Preserve DOM order, selector hooks, anchors, keyboard/ARIA behavior and shadcn Button/Accordion; no stock-theme reset or unnecessary abstraction/dependency.
- Preserve original assets, all 80 SNS photos, existing animation clocks and reduced-motion/no-JS fallbacks. No per-frame React state.
- Keep approved A copy as implemented and tested in tests/fixtures/copy-a.json.
- Existing Production signup is live. Do not alter API, consent/privacy, schema, credentials, RLS or environment. No signup POST or access to existing production data. CMS CRUD and source seeding are authorized only on the dedicated demo project. Tests use disabled persistence or explicit mocks.
- Never expose or commit .env*, credentials, node_modules, .next or test output.

## Verification

Run npm run lint, npm run typecheck, npm run test, npm run build -- --webpack and browser tests against a separate disabled-persistence server. Preserve unrelated running services. Compare real Desktop/Mobile layouts, CTA/FAQ/wheel/form, motion and console/overflow. Report actual checks and limitations; do not replace fresh results with historical PASS.

## Documentation policy

Maintain a small set of current documents. Historical task notes are preserved in docs/archive/history-before-tailwind-2026-11-09.tar.gz; they are evidence, not current instructions. Keep docs/evidence, licenses, privacy snapshots and design source assets intact. Update current documents instead of adding another report for every small tweak.
