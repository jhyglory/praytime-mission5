# PrayTime · Codex Project Instructions

## Current task and precedence

Apply all four current interaction changes on Desktop and Mobile: paper-plane shares, slower alternating SNS columns, per-step light centers, and the restored white-to-navy intro. Preserve the rest of the approved landing. The earlier whole-page task remains the baseline, not permission to redesign unrelated sections.

1. Latest user's explicit requirements
2. Final Figma Desktop1209:514 / Mobile1209:1051
3. Existing implementation and documentation

Figma file: J8iLsfruyMwVCakXsSJPq4. Motion reference boards:1265:8215 /1265:11339, with restored clean-intro layouts1265:8075 /1265:8099 and their latest1339 layers; preview scenes1265:8216 /1265:11340. Never edit Figma. Older1088/933/913 and conflicting motion rules are historical. Do not redesign or invent copy/features. Regress the whole landing at1440/393/360px while editing only the four requested areas. Details and current verification: docs/FOUR_INTERACTIONS_PATCH.md.

Before implementation read docs/PRAYTIME_PRODUCT.md, docs/PRAYTIME_DESIGN.md, docs/MISSION5_LANDING.md in order. Current whole-page findings and final verification belong in docs/WHOLE_PAGE_FINAL.md.

## Current motion/statistic requirements

- WHY NOW:0.0→34.3% /25.3%, one decimal; each card waits700ms after reaching40% actual visibility, then uses1400ms smooth progression shared by number and fill. Cancel a pending wait when offscreen/background and restart it on re-entry; an already-started count resumes without another delay.
- Latest visual override: both bars are Signal Red #FF4438 decorative accents, final visible widths80% /70%, with transparent/invisible tracks. Actual statistics remain34.3% /25.3%; keep accents aria-hidden and remove the obsolete data-max scale. Do not restore gray tracks or proportional34.3%/25.3% visual widths.
- Once per card per page load; reopening/reloading replays. Never use sessionStorage/localStorage as a completion latch.
- Reduced motion/no-JS shows readable final values. Pause or finish offscreen/background safely, and clean up observers/RAF/listeners.
- Independent card-free intro: black whole-word그래서 on the white/light area → actual thin slit/light spread and white-to-navy transition → actual Figma red Pause Mark/wordmark plus은 on navy. No three dots or행동하기 전에, 잠깐의 틈을 만듭니다. copy. Latest user timing override adds1500ms at the first full-word/paper state (533.2ms), extending the restored4s source to5500ms while keeping the entrance and all fade lengths unchanged. Play once on entry, pause offscreen/background, and keep a readable reduced-motion/no-JS state. Never place SNS cards/photos/hearts/planes inside the intro or duplicate그래서/logo in the following card scene.
- Next SNS scene: keep its fixed declaration/support. Slow the current15s card motion to70% speed:15000÷0.7=21428.571428571428ms. Alternate whole columns Desktop↑↓↑↓↑↓ / Mobile↑↓↑. Preserve independent phases,80 unique original photos per base cycle, two seamless track copies and no duplicate photo visible at once.16hearts/4paper-planes retain the original12s UPWARD timing; do not reverse particles with the columns.
- All active SNS card shares and floating shares use the reusable outline PaperPlaneIcon, preserving icon slots, color/opacity and particle motion. Do not restore the box-and-arrow share glyph.
- Prayer stage light centers are relative to each stage:01 PAUSE20%,02 PRAY its existing50%,03 CHOOSE80%, including stacked Mobile. Move only the highlight/glow center; keep the long divider, text, stage positions and light height/color/intensity unchanged.
- Respect final frame geometry, clipping and stacking; no auto-scroll, scroll hijacking or new motion dependency.
- Mobile WHY title32/48 and description26/44; preserve intended three-line composition with a safe narrower-width adaptation, no overlap.
- GAP condition, CTA and arrow group share the panel center. Remove the sentence열기 전, 무엇 때문에 열었는지 떠올려 보세요. with no replacement.

## Product truth and scope

PAUSE → PRAY → CHOOSE → USE → RETURN.

Prayer does not automatically unlock SNS. Both RETURN and intentional5/10/15-minute use are valid; access is restricted again when time expires, and additional use needs Prayer/Choice again. No AI prayer, STT analysis, faith scoring, streaks, badges, rankings, community, paywall or unverified effect claims. Preserve approved branding, exact assets, product flow and existing keyboard/ARIA behavior. Light/dark section rhythm follows actual Figma fills.

Use the existing Next.js App Router / React / TypeScript / Tailwind / shadcn/ui project. Keep actual Radix-backed shadcn Button/Accordion and PrayTime styling, never reset to the stock theme. Keep meaningful role-based section components and reusable UI.

Latest user correction: remove the signup CTA from the header on Desktop and Mobile. Keep the Hero CTA and form submit; preserve the existing logo/navigation positions.

Latest user artwork override: use the two supplied high-resolution PNG originals in public/assets/high-resolution for the Hero/Question plane and GAP slit. Preserve original PNG bytes, aspect ratio, existing glass/slit placement and all interactions. Do not restore the older Hero raster or GAP SVGs as active artwork.

Latest GAP background override: THE GAP alone uses #080E26 on Desktop/Mobile. Keep its artwork and geometry unchanged. The four current interaction edits do not authorize changes to other section backgrounds.

Latest FAQ override: question/answer text and list spacing are85% of the previous size: questions17/25.5px, answers15.3/25.5px, row padding20.4px, region/divider gap13.6px, paragraph gap25.5px. Keep the original24px chevron. Keep the section heading, outer grid/padding, seven answers and Accordion behavior unchanged.

Latest form spacing override: remove the empty nickname helper reservation. The default nickname input-to-email-label gap is32px instead of62px; keep all other32px form-group gaps and real validation errors.

Recent user copy CTA무료로 신청하기 and transparent red Pause Mark favicon / selected sharing image remain approved corrections. Keep the FAQ's approved seven product-compatible answers. Do not restore obsolete product logic.

## Backend/security and release

Existing live Production uses the approved Lovable/Supabase public.beta_signups adapter, UNIQUE(email), INSERT-only RLS and server consent metadata. Keep it unchanged for this visual task. Preview/tests/default local persistence are disabled. Never expose secrets, weaken RLS, create another DB, query/modify existing applicants or perform a real INSERT. Automated submission tests must use mock/disabled persistence, and public visual QA blocks the signup endpoint. Success/alert requires actual server201 + status=success + receipt=true; retain duplicate/error handling and existing published Privacy URL.

All .env*, node_modules, .next and test output remain ignored. Root project is the directory containing package.json. Deployment is the existing Vercel project, not a replacement host.

Preserve feature/mission-5-landing and PR #1 ([정하영]-미션5). The repository is public. User authorizes commit/push/deploy after verification. No new PR, main changes, merge, reset, rebase, force-push or DNS cutover. Existing Lovable custom-domain service remains untouched.

## Completion evidence

Run lint, typecheck, unit, npm run build -- --webpack and browser tests. Inspect actual Desktop/Mobile screenshots for all four edits. Verify at least two new SNS cycles (over42.857s), alternating directions at70% prior speed, seams/no blank ends/unique visible photos, paper-plane shares and upward particles. Verify stage centers20/50/80, white그래서→light transition→actual red-logo+은→separateSNS order, entry triggering, removed dots/copy, offscreen/background pause, cleanup and reduced motion. Regress navigation/CTA/wheel/FAQ/form, repeated navigation/reload, overflow/overlap and console errors without live signup POSTs.

Deploy verified code, then repeat GET-only verification on https://praytime-mission5.vercel.app/. Report every section's checked/fixed status, real screenshots, reproduced motion results, unverified/residual differences, commit and deployment URL. Do not label historical PASS as current.
