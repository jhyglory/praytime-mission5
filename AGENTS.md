# PrayTime · Codex Project Instructions

## Latest design refresh · 2026-11-06

The user requested the current design on canvas `933:2` in the same Figma file. This is a page, not an older Landing frame: MCP confirmed its visible children remain Desktop `1088:916` and Mobile `1088:1251`, now with updated contents. Use the freshly read design/motion context. Hero and ONE QUESTION share the new continuous dark artwork, mobile Hero is932px, ONE QUESTION uses80/112 desktop and44/66 mobile type. Restore the exact architectural GAP SVG and the new choice/prayer light-divider layers. The current design also restores five transition light layers, including the source scaleX aperture tracks; this supersedes the earlier slit-only/omitted-light instructions below. Preserve the user's subsequent explicit6s reading pace and Lovable-reference3s/no-gray100%red/70%lavender statistic presentation, the existing functioning interactions/shadcn, selected OG image/favicon, API/privacy guard and disabled persistence. Continue the already authorized feature/PR #1/Vercel workflow after checks; no merge/main/DB/DNS changes. See docs/LATEST_DESIGN_REFRESH.md. Older stage notes below are historical where this update differs.

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

- Desktop: node `1088:916`
- Mobile: node `1088:1251`
- Desktop THE GAP: node `1088:986`
- Mobile THE GAP: node `1088:1319` (child of the final Mobile frame)

Important supporting visual sources:

- Final Brand System v2.0: node `882:3`
- Final brand/object evaluation: node `882:263`
- Offset Interval B Refinement v1.1: node `896:14`
- Adopted Pause Mark UI patterns board: node `906:3`
- Puzz Dark Spatial Render v1.0: node `834:48`

Use the final Desktop/Mobile frame for its matching viewport and the specified THE GAP nodes for that section. These replace Desktop `933:3`, Mobile `933:4`, and `913:13` / `913:14`; Handoff `933:5` is historical reference only. The approved FAQ remains Light Background + seven questions. The user's explicit slit-only lighting instruction overrides exported floor reflection, ambient bloom and horizontal glow layers that remain in Figma.

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

## Current release authorization · 2026-11-06

**Latest sharing image request:** the user replaced the prior share artwork with “기도의 문, PrayTime.png” and explicitly requested it for KakaoTalk link previews. Copy the original PNG unchanged to public/og/praytime-share-8b6783f5.png (1711×919), set Open Graph/Twitter metadata to that versioned asset and deploy through the existing feature/PR/Vercel workflow. This is share metadata only: preserve Landing artwork/layout, favicon, current interactions, API and DB/privacy restrictions. Verify public raw crawler HTML and image GET/hash; do not claim Kakao cache refresh unless actually verified.

**Latest WHY NOW reference correction:** the user rejected the previous gauge approximation and explicitly asked to copy https://praytime.glorifier.kr/. Actual Lovable StatMetric.tsx and rendered page were read:3000ms cubic ease-out, first bar100%/#FF4438, second70%/#C4C0F0,7px square ends, no gray. Each card starts at50% visibility with rootMargin0px0px-15%0px. Copy these gauge/timing details only; keep Mission5 Ink numbers, exact34.3%/25.3%, source, typography/layout, accessibility and session-once/reduced/no-JS fallbacks. This supersedes the earlier750ms/two-red-full-bars presentation. Keep the6s “그래서” transition, other interactions, API/privacy guard and DB OFF unchanged; use the existing feature/PR/Vercel workflow.

**Latest user timing correction:** after reviewing the deployed site, the user reported that the “그래서” transition is too fast. This explicitly supersedes the prior keep-transition-timing restriction for reading pace only. Keep the Figma opacity values, easing, layout, assets and sequence; use a shared6000ms loop with a1050ms full-opacity word hold and1550ms overlap of the two fully visible bridge lines. Verify and deliver this narrow correction through the existing authorized feature/PR/Vercel workflow. No other interaction, API, privacy guard, DB or DNS change.

**Latest authorization — micro-interaction release:** after receiving the diff and passing checks, the user explicitly instructed “재배포해” on 2026-11-06. Commit/push the verified micro-interaction patch on feature/mission-5-landing, update existing PR #1 and redeploy the existing Vercel project. This supersedes the local-only hold for this patch; do not ask for approval again. Preserve the approved design, existing transition, shadcn, wheel, form/API/privacy guard and disabled persistence. Keep main untouched. No new PR, merge, real DB INSERT, persistence activation, new DB or DNS cutover is authorized. The prior visual/favicon release at 7c77356 remains the preceding baseline. Confirmed GAP destinations: RETURN → #hero; time choice → #how-it-works.

The user has explicitly approved committing and pushing the final design, shadcn adoption and favicon on feature/mission-5-landing, updating existing PR #1, and redeploying the existing Vercel project. This satisfies the review-approval conditions below. Proceed with the authorized release after validation; do not request the same permission again. Merge, actual DB INSERT/persistence activation and custom-domain DNS cutover remain forbidden. Keep main untouched, preserve the existing PR and privacy guard.

## Current stage · Final implementation / submission

Latest authorized scope: apply only the final visual differences from Desktop1088:916 / Mobile1088:1251 on top of the existing local section extraction, approved seven-item FAQ and real shadcn/ui adoption. Preserve the current structure, interactions, anchors and backend. `page.tsx` composes the original eight sections, skip link, signature transition and footer. Keep feature/mission-5-landing and PR #1. Do not commit/push, create another PR, merge, reset, rebase, force-push, change the Vercel branch or deploy before the user's approval of the final diff/check results.

shadcn/ui Button and Accordion are manually adopted from the official Radix new-york registry and used in the actual Landing. Button uses CVA appearance (primary/secondary) and state (default/disabled/submitting), Slot/asChild in Hero/Header anchors, and native submit in the form. FAQ imports Accordion/Item/Trigger/Content with controlled type=multiple; first item open, seven copies, existing IDs/ARIA and Figma chevron are preserved. forceMount + explicit hidden keeps closed answers' ARIA targets in the DOM. Preserve approved PrayTime styling, native selection controls and the form state machine; the form only passes its existing submitting state to Button. Do not apply a generic shadcn theme or overwrite globals.css through CLI init. See docs/SHADCN_ADOPTION.md for source, license and checks.

WHY NOW → THE GAP is now final and implemented; the PENDING DESIGN restriction has ended. The Figma motion context defines looping opacity timelines, Desktop2800ms / Mobile2410ms, not a scroll-progress or sticky transition. The small SignatureTransition client component uses native Web Animations API with IntersectionObserver activation, offscreen/background pause and prefers-reduced-motion/static fallback. Twelve rendered tracks per viewport retain Figma values/timing; five reflection/ambient/aperture tracks per viewport are omitted to satisfy the user's explicit slit-only lighting removal. No scroll hijacking, WebGL or motion dependency. See docs/MOTION_PLAN.md for the exact implemented scope.

The user delivered FINAL Figma Desktop1088:916 / Mobile1088:1251 / Desktop THE GAP1088:986. These supersede all earlier Landing frames. The visual freeze is lifted for these exact changes only; design exploration is closed. Do not redesign or edit Figma.

- Reuse the existing code, form and backend. Final IA: Hero → One Question → Why Now → The Gap → Time Select → Prayer Before Choice → FAQ → Beta Signup; Footer follows.
- Hero full bleed, transparent overlay nav, warm-white text / red mark; all Light section backgrounds Soft Paper #F5F2F7; Ink percentages and proportional red gauges. THE GAP is dark with slit-only emission and equal choice outcomes. Time Select is Light with the exact supplied mockup clipped to its Figma phone silhouette; Prayer is Dark; FAQ7 and form are Light. Preserve viewport typography, line-height and spacing from the new frames.
- Feature branch feature/mission-5-landing; private remote jhyglory/praytime-mission5; existing PR #1 titled [하영]-미션5. Commit/push/deploy remains deferred until the user approves the final local diff and validation results. Never merge the PR or modify main.
- Reuse existing public.beta_signups; keep UNIQUE(email) and INSERT-only RLS. No public SELECT/UPDATE/DELETE, no service-role key or client env exposure.
- Recheck schema before changes: the prior approved nullable consent columns already exist, so do not rerun migration. The latest user instruction defers actual INSERT QA until privacy notice alignment; do not submit the prepared identity now. Never read/modify existing users.
- Automated tests always mock/disable persistence. Production uses the existing public insert binding through the server adapter.
- All .env* files are ignored; safe template config/environment.example. Final deployment is Vercel with GitHub connection; do not replace this requested platform with Sites hosting.
- Run npm run lint / npm run typecheck / npm run test / npm run build -- --webpack / npm run test:e2e against the final local patch. Browser tests use the production artifact with persistence disabled. Do not relabel past results as current results; docs/FINAL_VISUAL_PATCH.md records the final check status. Production/real-DB QA is outside this local-only patch. Keep documentation candid about privacy discrepancies and external browser-extension interference.

## Latest release constraint

The user deferred ALL actual INSERT QA until privacy notice alignment. Do not create the prepared final QA applicant now. Keep Production/Preview persistence disabled; do not register Supabase credentials in Vercel. PRIVACY_COLLECTION_APPROVED=false blocks VERCEL_ENV=production even if persistence is accidentally configured. Report LEGAL REVIEW REQUIRED. Keep the existing Privacy URL; do not invent Terms or legal copy. The approved release may now be committed/pushed/deployed with writes off; merge and actual storage remain deferred. Domain/DNS cutover to Vercel is separately on hold; preserve the existing Lovable service.
