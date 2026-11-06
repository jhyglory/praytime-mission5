# PrayTime · Codex Project Instructions

## Current task and precedence

Complete and verify the WHOLE Desktop and Mobile landing, not only the intro/SNS scene.

1. Latest user's explicit requirements
2. Final Figma Desktop1209:514 / Mobile1209:1051
3. Existing implementation and documentation

Figma file: J8iLsfruyMwVCakXsSJPq4. Motion references:1265:8215 /1265:11339. Never edit Figma. Older1088/933/913 and narrow-scope release notes are historical when they conflict. Do not redesign or invent copy/features. Audit Header/Nav, Hero, Question, WHY NOW, clean intro, SNS declaration, GAP choices, Time Select, Prayer, FAQ, form and Footer at1440/393/360px.

Before implementation read docs/PRAYTIME_PRODUCT.md, docs/PRAYTIME_DESIGN.md, docs/MISSION5_LANDING.md in order. Current whole-page findings and final verification belong in docs/WHOLE_PAGE_FINAL.md.

## Current motion/statistic requirements

- WHY NOW:0.0→34.3% /25.3%, one decimal; each card triggers independently at40% actual visibility;1400ms smooth progression shared by number and fill.
- Both bars Signal Red #FF4438;100% track is light gray, final fills exactly34.3% /25.3%. No transparent track,100%/70% accent lengths or lavender second fill.
- Once per card per page load; reopening/reloading replays. Never use sessionStorage/localStorage as a completion latch.
- Reduced motion/no-JS shows readable final values. Pause or finish offscreen/background safely, and clean up observers/RAF/listeners.
- Independent card-free intro: whole word그래서, then actual Figma logo plus은. Enough viewport height to avoid premature SNS bleed. No letter splitting or text/CSS substitute logo.
- Next SNS scene: approved fixed declaration/support, all columns continuously UP, approximately12s cycles with independent phases.80 original user photos once per base cycle; duplicate tiles may not expose the same photo twice at once.16hearts/4shares repeatedly rise.
- Respect final frame geometry, clipping and stacking; no auto-scroll, scroll hijacking or new motion dependency.
- Mobile WHY title32/48 and description26/44; preserve intended three-line composition with a safe narrower-width adaptation, no overlap.
- GAP condition, CTA and arrow group share the panel center. Remove the sentence열기 전, 무엇 때문에 열었는지 떠올려 보세요. with no replacement.

## Product truth and scope

PAUSE → PRAY → CHOOSE → USE → RETURN.

Prayer does not automatically unlock SNS. Both RETURN and intentional5/10/15-minute use are valid; access is restricted again when time expires, and additional use needs Prayer/Choice again. No AI prayer, STT analysis, faith scoring, streaks, badges, rankings, community, paywall or unverified effect claims. Preserve approved branding, exact assets, product flow and existing keyboard/ARIA behavior. Light/dark section rhythm follows actual Figma fills.

Use the existing Next.js App Router / React / TypeScript / Tailwind / shadcn/ui project. Keep actual Radix-backed shadcn Button/Accordion and PrayTime styling, never reset to the stock theme. Keep meaningful role-based section components and reusable UI.

Recent user copy CTA무료로 신청하기 and transparent red Pause Mark favicon / selected sharing image remain approved corrections. Keep the FAQ's approved seven product-compatible answers. Do not restore obsolete product logic.

## Backend/security and release

Existing live Production uses the approved Lovable/Supabase public.beta_signups adapter, UNIQUE(email), INSERT-only RLS and server consent metadata. Keep it unchanged for this visual task. Preview/tests/default local persistence are disabled. Never expose secrets, weaken RLS, create another DB, query/modify existing applicants or perform a real INSERT. Automated submission tests must use mock/disabled persistence, and public visual QA blocks the signup endpoint. Success/alert requires actual server201 + status=success + receipt=true; retain duplicate/error handling and existing published Privacy URL.

All .env*, node_modules, .next and test output remain ignored. Root project is the directory containing package.json. Deployment is the existing Vercel project, not a replacement host.

Preserve feature/mission-5-landing and PR #1 ([하영]-미션5). User authorizes commit/push/deploy after verification. No new PR, main changes, merge, reset, rebase, force-push or DNS cutover. Existing Lovable custom-domain service remains untouched.

## Completion evidence

Run lint, typecheck, unit, npm run build -- --webpack and browser tests. Inspect whole-page actual screenshots at1440/393/360px, not build output alone. Verify24s+ SNS playback, seams/unique visible photos/particles, stat numeric+gauge synchronization and reload replay, navigation/CTA/wheel/FAQ/form, repeated navigation/reload, overflow/overlap and console errors. Test cancellation/cleanup and reduced motion.

Deploy verified code, then repeat GET-only verification on https://praytime-mission5.vercel.app/. Report every section's checked/fixed status, real screenshots, reproduced motion results, unverified/residual differences, commit and deployment URL. Do not label historical PASS as current.
