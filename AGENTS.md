# PrayTime · Codex Project Instructions

Before modifying code, read these documents in order:

1. `docs/PRAYTIME_PRODUCT.md`
2. `docs/PRAYTIME_DESIGN.md`
3. `docs/MISSION5_LANDING.md`

## Mission

Implement the approved PrayTime Mission 5 landing page from Figma.

Do not redesign the product, reopen branding decisions, add new features, or change approved copy unless explicitly instructed.

## Product Truth

Core loop:

`PAUSE → PRAY → CHOOSE → USE → RETURN`

Prayer completion does **not** automatically unlock SNS.

If SNS is still needed, the user chooses **5 / 10 / 15 minutes**.

When the selected time ends, access is restricted again.

Additional use requires Prayer / Choice again.

## Figma Source of Truth

File key:

`J8iLsfruyMwVCakXsSJPq4`

Approved implementation frames:

- Desktop: node `933:3`
- Mobile: node `933:4`
- Developer Handoff: node `933:5`

Important supporting visual sources:

- Final Brand System v2.0: node `882:3`
- Final brand/object evaluation: node `882:263`
- Offset Interval B Refinement v1.1: node `896:14`
- Adopted Pause Mark UI patterns board: node `906:3`
- Puzz Dark Spatial Render v1.0: node `834:48`

Use the final Desktop, Mobile, and Handoff frames as the implementation authority.

## Technical Direction

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- semantic HTML
- accessible interactions

shadcn/ui is a component implementation aid, not the visual design authority.

## Critical Rules

- Do not change the landing section order.
- Do not invent new product features.
- Do not add AI Prayer.
- Do not add Streak, Level, Badge, XP, Ranking, Community, Pricing, Paywall, or gamification.
- Do not make prayer an unlock task.
- Do not claim prayer completion automatically unlocks SNS.
- Do not replace approved brand assets with newly generated substitutes.
- Do not turn the site into generic dark SaaS, gaming UI, neon cyberpunk, or a character-heavy mascot site.
- Do not fake form submission with toast-only success.
- Preserve responsive behavior and accessibility.
- Run lint and production build before declaring completion.

## Implementation Workflow

1. Inspect the existing repository first.
2. Reuse existing code, components, form backend, and assets where reasonable.
3. Confirm the Figma source nodes before implementing.
4. Implement the static landing structure.
5. Implement interactions.
6. Implement real form submission.
7. Verify desktop and mobile.
8. Run lint/build/tests.
9. Report remaining issues honestly.

## Design Rule of Thumb

PrayTime should feel:

`Quiet Edit structure + calm spatial light + restrained dimensional material + clear product UI`

The signature object belongs primarily to brand moments. Product UI should remain clear and restrained.

## Current stage · Final implementation / submission

The user delivered FINAL Figma Desktop 933:3 / Mobile 933:4. These supersede 913:13 / 913:14. Visual freeze is lifted for those exact approved changes; design exploration is closed. Do not redesign.

- Reuse the existing code, form and backend. Final IA: Hero → One Question → Why Now → The Gap → Time Select → Prayer Before Choice → FAQ → Beta Signup; Footer follows.
- Hero full bleed, transparent overlay nav, warm-white text / red mark; Paper White + Lavender Mist light areas; Ink percentages and proportional red gauges; exact supplied Time Select mockup.
- Feature branch feature/mission-5-landing; private remote jhyglory/praytime-mission5. Create final commit/push and PR titled [하영]-미션5. Never merge the PR. main receives only a minimal baseline, final implementation goes through feature PR.
- Reuse existing public.beta_signups; keep UNIQUE(email) and INSERT-only RLS. No public SELECT/UPDATE/DELETE, no service-role key or client env exposure.
- Recheck schema before changes: the prior approved nullable consent columns already exist, so do not rerun migration. Final QA authorizes exactly one new synthetic applicant, duplicate requests using that same identity, and scoped verification of that QA row only. Never read/modify existing users.
- Automated tests always mock/disable persistence. Production uses the existing public insert binding through the server adapter.
- All .env* files are ignored; safe template config/environment.example. Final deployment is Vercel with GitHub connection; do not replace this requested platform with Sites hosting.
- Check lint / typecheck / unit / browser / build and smoke-test production, mobile and incognito. Keep documentation candid about privacy copy discrepancies and external browser-extension interference.

## Latest release constraint

The user deferred ALL actual INSERT QA until privacy notice alignment. Do not create the prepared final QA applicant now. Keep Production/Preview persistence disabled; do not register Supabase credentials in Vercel. PRIVACY_COLLECTION_APPROVED=false blocks VERCEL_ENV=production even if persistence is accidentally configured. Report LEGAL REVIEW REQUIRED. Keep the existing Privacy URL; do not invent Terms or legal copy. Deployment and PR may proceed with writes off; verify real503 and no receipt.
