# PrayTime · Codex Project Instructions

## Current task and precedence

Latest follow-up: animate ONLY the Prayer01 PAUSE→02 PRAY→03 CHOOSE row on entry. Initially hide its lights and text in normal JS; a horizontal light draws/sweeps across01 while copy fades in, then fades out before02 and03 in order. Revealed copy remains, no loop, preserve layout/copy and original static20/50/80 light profiles for reduced-motion/no-JS. Shared3900ms WAAPI clock,1300ms per step; first step35% visible triggers, entire list visibility/background pause and cleanup. Verify then commit/push same feature/PR1 and deploy existing URL. All other interactions/backend/env/DB/DNS/main remain unchanged.

Latest follow-up: reduce ONLY the SNS card-first lead-in3000→1700ms. Preserve the400ms simultaneous black-field/text fade, existing stream/particle clocks and all other approved behavior. Existing feature/PR1/deployment authorization continues; verify the targeted SNS tests and public Desktop/Mobile timing. Old3000ms evidence below is historical.

Latest release authorization: the user asks to finish ALL pending local corrections and deploy to the existing landing URL. Connect the approved7s ivory light with2000ms entrywait to GapSection (variant=preview, visibilityThreshold=.2), preserving its current top/base anchors and CTA layout. Include stats500ms, clean-intro600ms hold/4600ms timeline, SNS1700ms+400ms fade, deleted BEFORE YOU OPEN and800ms scroll-gated question fade. Verify then commit/push on existing feature/mission-5-landing, update existing PR #1 and deploy the existing Vercel project. Prior local-only holds below are historical and superseded for this release. No merge/main/DNS/backend/env/realDB/signupPOST changes. Keep developer preview controls production404. Record current checks and limitations in docs/FINAL_INTERACTION_RELEASE.md; previous PASS records are historical.

## Historical: local correction stages

Latest SNS timing override: increase the card-only lead-in900→3000ms before revealing the black field and text together. Keep the400ms fade, all other choreography/copy/layout and current local-only release hold. Historical900ms evidence remains a previous stage.

Latest question reveal: keep the question wording and geometry but hide it initially in normal-motion JS browsers. Reveal with an800ms opacity-only fade once the user has scrolled and at least15% of the heading is visible; avoid Desktop's already-visible-on-load auto-reveal. Keep the shown state on reentry, reduced/no-JS readable immediately, and clean up observer/scroll/media listeners. Preserve the deleted eyebrow and all pending local changes. No commit/push/deploy/PR/DB change is requested.

Latest copy removal: omit the BEFORE YOU OPEN eyebrow from OneQuestionSection on both Desktop and Mobile. Keep its question heading, artwork and all pending local changes. Do not restore the label from older Figma exports; no commit/push/deploy is requested.

Latest clean-intro timing correction: reduce the common full-word/white-paper pause from1500ms to600ms at533.2ms. Shift all subsequent frames900ms earlier and total5500→4600ms, preserving original fade/light/logo durations, order and layout. The logo itself still follows the light transition (starts2010ms/full2303.2ms); do not claim its first appearance is exactly600ms after the word. Keep all other pending local corrections and no commit/push/deploy/PR changes.

Latest SNS copy follow-up: on scene entry show the existing card streams first; after3000ms reveal .card-intro__declaration and its .card-intro__quiet black reading field together with a400ms opacity fade. Preserve copy, geometry, streams/particles/clocks and the independent clean intro. Keep this reveal separate from the existing WAAPI stream inventory; cancel a pending wait offscreen/background, finish an already-started fade safely, retain shown state on reentry, and keep reduced/no-JS copy readable immediately. Preserve the other pending local changes; no commit/push/deploy/PR/DB changes in this stage. See docs/SNS_COPY_REVEAL.md.

Latest light follow-up: use2000ms entry/replay wait ONLY in the local preview instance (startDelayMs=2000), replacing700ms. Keep the active choreography7000ms, its slider/phase boundaries and all light styling unchanged; total visible-entry-to-completion is about9000ms. Waiting is separately labeled and cancellable by pause/seek/replay/final/reduced/offscreen/cleanup. Default landing delay remains0. Keep the previous500ms statistics correction and all pending local work; do not commit/push/deploy/modify PR.

Latest follow-up: start the WHY NOW numbers and red fills200ms earlier by reducing the per-card startup wait700→500ms. Preserve40% visibility,1400ms progression, values/styles and cancellation/resume/reduced-motion. This is a local timing correction alongside the pending7s preview; no commit/push/deploy/PR/DB changes are authorized in this stage.

Latest task: local-only seven-second GapLightMotion refinement in /dev/gap-light. The new preview variant has exact boundaries400/1300/2000/2300/4500/6500/7000ms: centered accelerating short dash → impact/spread →300ms hold → ascent/trail → opening → settle. Keep the short dash length, fixed final center/height/width, seamless single-core ascent; enlarge floor fields1.4×, use subtle borderless face gradient/micro-softness, narrow bright near glow and very faint far glow. Preserve all preview controls and show the actual phase/time. The existing landing must keep its approved default4521.43ms variant; opt into7s only in the development preview. No landing integration, commit/push, deploy, PR update/merge, DB/env/DNS changes in this stage. This explicitly overrides the former release authorization below. Run lint/typecheck/unit/build and scoped actual Desktop/Mobile preview + unchanged-landing checks; record screenshots/video and limits in docs/GAP_LIGHT_SEVEN_SECOND_STUDY.md.

## Historical: completed landing release

The latest user has approved connecting the completed GapLightMotion to the landing and deploying it. Replace only THE GAP's static artwork, preserving headings, body, choice anchors, section dimensions and the existing light top/ground anchors. Trigger once at20% canvas visibility; pause offscreen/background; retain the final state on re-entry and reduced-motion/no-JS fallback. Commit/push on the existing feature branch and deploy to the existing Vercel project after checks. Do not merge, change main/DNS/backend/env or perform a real signup POST. See docs/GAP_LIGHT_LANDING_RELEASE.md for current validation/release evidence.

The approved GapLightMotion uses the NEW ivory PNG in docs/design-assets/gap-light-ivory/reference.png. Its proportions, borderless filled face and clean ivory light override the old ZIP,14/24-unit widths and previous8px choice. Latestfall-speedoverride: use0.7×priorfallspeed, so750/0.7=1071.428571msfall after200msdark. Contact/instantreturn1271.428571, groundspreadends1771.428571, riseends3121.428571, openingends4221.428571, settleends4521.428571. All postcontact durations remain unchanged; only shift them by321.428571ms. Movinglight remains7.2% of finalheight and has no permanent trail on descent. No stroke, edge pair, caps, ring, emptyneonframe or capsule in the final face. Floor and ambient are separate soft ivory fields.

The earlier timing correction still applies: smooth eased descent with a subtle12-unit lateral arc, returning tocenter oncontact. Rise begins immediatelyoncontact togetherwithfilledgroundspread, without a stationary ground hold. The finalivoryface remains unchanged. UI timing labels derive from the timeline; sliderstepany plus explicit10ms/Home/End keyboard actions supports the exact fractional endpoint.

Latestjoinfix: no visible divider between the moving short light and its trail. Use one opaque3.8-unit #FFFFF6 core from the movingheadtop to the ground during ascent; hide the separate shortcore only aftercontact, while keeping its movinghalo/kinematics. Handoff is identicalgeometry atcontact. Do not overlap two translucent cores, which double-composite antialiasededges; feather only the separate trailglow. Opening starts fromthe same3.8width; finalface/length/speed/timing stay unchanged.

Keep the reusable component and development-only /dev/gap-light preview with replay, pause/resume, keyboard-accessible timeline seek and final-still controls. ReferencePNG1139×1381 maps to SVG1200×1454.960; facewidth48.464,center600,top198.068,base1220.018 (~15.87pxwideat393). The former preview-only release hold is satisfied by the user's latest approval. Keep backend and unrelated landing/user changes untouched. Earlier3.2s/ZIPpixel-equality records are historical. See docs/GAP_LIGHT_MOTION_PREVIEW.md for the preview-stage history.

The previous landing baseline below remains unchanged:

Apply all four current interaction changes on Desktop and Mobile: paper-plane shares, slower alternating SNS columns, per-step light centers, and the restored white-to-navy intro. Preserve the rest of the approved landing. The earlier whole-page task remains the baseline, not permission to redesign unrelated sections.

1. Latest user's explicit requirements
2. Final Figma Desktop1209:514 / Mobile1209:1051
3. Existing implementation and documentation

Figma file: J8iLsfruyMwVCakXsSJPq4. Motion reference boards:1265:8215 /1265:11339, with restored clean-intro layouts1265:8075 /1265:8099 and their latest1339 layers; preview scenes1265:8216 /1265:11340. Never edit Figma. Older1088/933/913 and conflicting motion rules are historical. Do not redesign or invent copy/features. Regress the whole landing at1440/393/360px while editing only the four requested areas. Details and current verification: docs/FOUR_INTERACTIONS_PATCH.md.

Before implementation read docs/PRAYTIME_PRODUCT.md, docs/PRAYTIME_DESIGN.md, docs/MISSION5_LANDING.md in order. Current whole-page findings and final verification belong in docs/WHOLE_PAGE_FINAL.md.

## Current motion/statistic requirements

- WHY NOW:0.0→34.3% /25.3%, one decimal; each card waits500ms after reaching40% actual visibility, then uses1400ms smooth progression shared by number and fill. Cancel a pending wait when offscreen/background and restart it on re-entry; an already-started count resumes without another delay.
- Latest visual override: both bars are Signal Red #FF4438 decorative accents, final visible widths80% /70%, with transparent/invisible tracks. Actual statistics remain34.3% /25.3%; keep accents aria-hidden and remove the obsolete data-max scale. Do not restore gray tracks or proportional34.3%/25.3% visual widths.
- Once per card per page load; reopening/reloading replays. Never use sessionStorage/localStorage as a completion latch.
- Reduced motion/no-JS shows readable final values. Pause or finish offscreen/background safely, and clean up observers/RAF/listeners.
- Independent card-free intro: black whole-word그래서 on the white/light area → actual thin slit/light spread and white-to-navy transition → actual Figma red Pause Mark/wordmark plus은 on navy. No three dots or행동하기 전에, 잠깐의 틈을 만듭니다. copy. Latest user timing override uses600ms at the first full-word/paper state (533.2ms), extending the restored4s source to4600ms while keeping the entrance and all fade lengths unchanged. Play once on entry, pause offscreen/background, and keep a readable reduced-motion/no-JS state. Never place SNS cards/photos/hearts/planes inside the intro or duplicate그래서/logo in the following card scene.
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

Latest user hover correction: keep the Hero glass artwork static on all pointer types and motion preferences. The former2.5px whole-image pointer parallax is removed; do not move or separate the glass bars on hover. Preserve the original image geometry/crop and CTA hover/focus behavior.

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
