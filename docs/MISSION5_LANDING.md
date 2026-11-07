# PrayTime · Mission 5 Landing Implementation Specification

## Latest intro clarification · 2026-11-08

The latest user correction restores the original STATIC upper-light→lower-navy intro gradient. The upper 그래서 area stays Soft Paper even after the word disappears, the actual logo appears and playback completes. Paper opacity stays1; no temporal background/handoff fade. Restore the original blurred paper geometry and keep4600ms/600ms word/light/logo timing, reduced/no-JS readability and the separate SNS scene. Other sections, including bright WHY NOW, are unchanged. See [INTRO_BACKGROUND_HANDOFF.md](INTRO_BACKGROUND_HANDOFF.md); the1fceb61 full-scene timed fade is superseded.

## Latest four-interaction patch authority · 2026-11-06

The latest explicit four-item request overrides conflicting rules below: outline paper-plane shares everywhere in SNS; cards at70% of the prior15s speed (15000÷0.7=21428.571428571428ms), alternating Desktop↑↓↑↓↑↓ / Mobile↑↓↑; unchanged12s upward hearts/planes; Prayer highlights at each stage's20% /existing50% /80%; restored white-area black그래서 → thin light/background transition → actual red Pause Mark/wordmark+은 on navy, using the4s entry timeline. No dots, obsolete bridge sentence or SNS decorations in the intro. Preserve80 unique photos, separate SNS copy, reduced-motion/entry/pause behavior and all unrelated product/legal/backend constraints. Current sources and new verification belong in [FOUR_INTERACTIONS_PATCH.md](FOUR_INTERACTIONS_PATCH.md). Earlier all-UP15s/all-navy or centered-light rules and their PASS/release records are historical, not current authority.

## Historical: Whole-page final correction · 2026-11-06

This task covers every Desktop/Mobile landing section. Latest explicit user requirements override final1209:514/1051 Figma, which overrides older repository restrictions. Remove narrow “other sections unchanged” scope,100%/70% transparent/lavender gauges,3000ms/50% trigger/sessionStorage latch, and alternating-column behavior. Stats now1400ms/40% independent visibility, both red34.3%/25.3% of a gray100% track, once per page load and replay on reload. SNS columns all rise; independent intro gets sufficient viewport height. Audit every section at1440/393/360 and publish real24s+/reload/interaction evidence. Product/security/approved original assets and existing live backend remain unchanged. See AGENTS.md and docs/WHOLE_PAGE_FINAL.md. Earlier stage records below are historical where they conflict.


## Historical: Previous intro/SNS-only specification · superseded

Use full Desktop1209:514 / Mobile1209:1051 for layout and previews1265:8215 /1265:11339 for the clean intro's entrance values. The user explicitly requires two independent sections: animate the WHOLE “그래서” word, then the actual exported Figma wordmark plus “은”, once on intro entry; hold the readable result without scene crossfade or auto-scroll. Entrance milestones are150.4–649.6ms /1350.4–1950.4ms with source easing, within the preview's4s clean window. Do not restore letter-by-letter text or a text/CSS substitute logo. The SNS scene stays separate with fixed copy,12s linear columns,16hearts/4shares and original80 ZIP Photos assigned once per base cycle. The supplied ZIP matches all existing80 photo bytes. Use an equivalent full-cycle translation and duplicate tile rather than interpolate the export's1.2ms internal column teleport. Reduced motion now retains static cards and readable text; no-JS keeps readable copy. Mobile WHY uses32/48 and26/44 even below393px. Center each GAP condition, actual light and CTA/arrow flex group on one panel axis. Preserve all other interactions, live backend/privacy guard, favicon/OG and source photos. No DB operation, Figma mutation, dependency, main/merge or DNS change. Existing authorized feature/PR1/Vercel workflow continues after checks. See docs/FINAL_SNS_PATCH.md. Earlier static-intro notes below are historical.


## Historical: Prototype correction · superseded

The user's latest prototype is Desktop1214:651 on page1209:513, starting at full Landing1209:514. Its companion Mobile preview is1214:830 (full Landing1209:1051). These supersede the previous combined16s board1265:8215 for this intro/card patch. The full Landing has a separate clean text-only intro (Desktop1265:8075, Mobile1265:8099), followed by a separate card-declaration scene. Both clean roots return an empty motion inventory; do not invent an auto-fade between the two scroll sections. Each section is760px Desktop /680px Mobile. Card scenes loop continuously every12000ms while declaration/anchor copy stays visible. Desktop six24-card cycles and Mobile three36-card cycles each duplicate once for seamless stream resets;20 decorative particles per viewport. All80 original photo assets are verified against their Figma image hashes. Use the actual Mobile geometry, not a scaled/cropped Desktop scene. Preserve all other sections and explicit CTA/GAP-label/favicon overrides, shadcn, live backend/privacy guard and success alert. No DB operations, Figma edits, dependency, merge/main or DNS changes. Continue the existing authorized feature/PR1/Vercel workflow after checks. See docs/PROTOTYPE_CORRECTION.md. Historical notes below are superseded where they conflict.


## Historical: Previous intro design

The user supplied full-motion1265:8215 and clean-intro1265:8081. These replace ONLY the WHY NOW→THE GAP transition with a16-second loop: clean “그래서” then PRAYTIME은,4-second card-free intro, followed by six moving SNS card columns,20 decorative heart/share streams and the approved declaration. New source timing supersedes the old6-second/three-letter transition. Use native WAAPI with exact exported tracks, offscreen/background pause, and readable reduced/no-JS fallback. Preserve all other sections, anchors, shadcn, favicon/OG, live backend and success alert. Mobile follow-up1209:1073 is WHY NOW, not an intro: follow that frame's32/48 headline,26/44 support, dark lower threshold, and gray6px proportional red gauges on mobile. Desktop gauges retain the existing reference treatment. Mobile intro is responsive adaptation of the supplied Desktop scene, not a claimed Mobile Figma match. No Figma edits, new dependency, DB operations, merge/main or DNS changes. See docs/CARD_INTRO_PATCH.md.

## 실제 접수 활성화 승인 · 2026-11-06

사용자가 실제 저장을 요청했고, 수집 항목 정정안 게시를 승인했다. 기존 Privacy URL에 정정안을 게시한 뒤 HTTP 200 및 본문을 확인했다. 새 snapshot/version과 `PRIVACY_COLLECTION_APPROVED=true`를 사용한다. Production에서 기존 Supabase 연결과 `BETA_SIGNUP_PERSISTENCE=supabase`를 설정하는 release를 진행한다. Preview·자동 테스트·기본 로컬 설정은 disabled다. 기존 beta_signups/UNIQUE(email)/INSERT 전용 RLS를 유지하며, 새 DB·migration·공개 SELECT/UPDATE/DELETE·service-role key는 없다. 사용자가 승인한 QA 신청 1건만 생성·검증하고 기존 신청자 행은 조회·수정하지 않는다. merge·main 변경·DNS 전환은 계속 금지다. 아래 이전 저장 OFF/법률 문구 작성 금지 기록은 이 승인 이전의 이력이다. 실제 배포/QA 결과는 docs/BACKEND_ACTIVATION.md에 기록한다.

## Latest design authority · 2026-11-06

The user selected the current Figma page933:2. MCP verified the visible Desktop1088:916 / Mobile1088:1251 and reread their updated contents. The continuous Dark Hero/ONE QUESTION, architectural GAP and full choice/prayer/transition light layers now supersede the earlier slit-only/omitted-light instructions in historical notes below. Keep the user-approved6s reading pace, the later Lovable-reference3s/no-gray100%red/70%lavender statistics, existing interactions/shadcn, selected sharing image/favicon and disabled backend/privacy guard. See [LATEST_DESIGN_REFRESH.md](LATEST_DESIGN_REFRESH.md) for exact scope and current checks. The previously authorized existing feature/PR/Vercel workflow continues; no merge/main/DB/DNS change.

## 1. Figma Authority

File key:

`J8iLsfruyMwVCakXsSJPq4`

Final implementation nodes:

- Desktop: `1088:916`
- Mobile: `1088:1251`
- Desktop THE GAP: `1088:986`
- Mobile THE GAP: `1088:1319` (child of Mobile)

Desktop and Mobile govern their corresponding viewports; use the specified THE GAP nodes for that section. These final1088 frames supersede933/913 Landing frames. Handoff `933:5` is historical reference only and its Dark FAQ / five questions is obsolete. FAQ remains Light Background + seven questions. The user's explicit slit-only lighting/removal instruction overrides residual floor/ambient/bloom layers in exports. Do not modify Figma itself.

Supporting sources:

- Final Brand System: `882:3`
- Signature Object B Refinement: `896:14`
- Pause Mark UI patterns: `906:3`
- Puzz Dark Spatial Render: `834:48`

## 2. Required Final Section Order

Final1088:916 /1088:1251 preserve the existing eight-section composition. Do not invent or reorder sections.

1. HERO — full bleed artwork / transparent overlay header
2. ONE QUESTION
3. WHY NOW — 34.3% / 25.3%, Ink + proportional red gauges
4. THE GAP
5. TIME SELECT — exact supplied 10-minute mockup
6. PRAYER BEFORE CHOICE — PAUSE / PRAY / CHOOSE, one Puzz
7. FAQ — approved seven answers, Light background / Ink text / chevrons, first item open
8. BETA SIGNUP — unchanged eight form groups, Light

Footer follows. SignatureTransition is a layout div between WHY NOW and THE GAP, not an extra semantic section; it preserves the eight-section structure. Copy and Desktop/Mobile line breaks come from final design context.

All Light section backgrounds use Soft Paper #F5F2F7. THE GAP is Dark, Time Select Light, Prayer Before Choice Dark, FAQ Light and form Light. Keep the two Equal Choice outcomes visually equal. Time Select retains the supplied10-minute image and existing interactive wheel, with the Figma phone silhouette mask removing the outer image background. Apply final viewport typography, line-height and section spacing only.

## 3. Anchors

- `#how-it-works`
- `#the-gap`
- `#faq`
- `#beta-signup`

Hero primary CTA:

**무료로 신청하기** → `#beta-signup`

Hero secondary CTA:

**작동 방식 보기** → `#the-gap`

Header의 **작동 방식** 메뉴는 `#how-it-works`로 이동합니다. 기존 링크·heading focus 동작을 유지합니다.

## 4. Hero Copy

Eyebrow:

**기독교 기반 디지털 웰니스**

Headline:

**무심코 SNS를 여는 순간,<br />
기도로 멈추고 다시 선택하세요.**

Description:

**SNS를 열기 전 잠깐 기도하고,<br />
지금도 필요한지 돌아보세요.**

Microcopy:

**기도를 마쳐도 SNS가 자동으로 열리지는 않습니다.**

## 5. Hero Visual

Use the approved Offset Interval · B Refinement v1.1 atmospheric artwork full bleed, with transparent overlay Header and the final copy/CTA slots. The product preview appears separately in Time Select; do not add a phone composition inside the final Hero.

## 6. App Preview Theme Toggle

Historical Hero preview toggle code may remain reusable but is not mounted in the final1088 Landing. Do not add a site-wide or Hero theme toggle. The actual visible product interaction is the5/10/15 Time Select wheel.

## 7. Problem Section

WHY NOW uses the final Quiet Edit evidence layout:34.3% /25.3% Ink statistics, white evidence cards and proportional red gauges on the Soft Paper section. Desktop uses two columns; Mobile stacks the two cards. Use final heading/supporting typography and spacing. The older four-behavior composition is superseded.

## 8. The Gap

Primary idea:

**충동과 행동 사이, 기도가 머물 작은 틈을 만듭니다.**

Use the final narrow Vertical Slit as the threshold identity. The user's slit-only lighting instruction removes floor reflection, surrounding bloom and horizontal glow. Use the matching Desktop/Mobile THE GAP node without adding new decorative systems.

Show two valid outcomes equally:

- return
- intentional use

## 9. How It Works

Anchor: `#how-it-works`

Required story:

### Step 01 · PAUSE
Use approved Threshold pattern.

### Step 02 · PRAY
Use quiet typography and low Prayer Light.

### Step 03 · CHOOSE
Use approved Clear Choice pattern.

Question:

**지금 이 앱이 꼭 필요한가요?**

Choices:

**필요하지 않아요**<br />
지금은 돌아가기

**필요해요**<br />
5 · 10 · 15분 선택

### Step 04 · USE / RETURN
Use 5 / 10 / 15 minutes if needed.
At time end, restriction returns.
Additional use requires Prayer / Choice again.

The steps above describe the product model. They do not authorize a four-phone layout. The final Landing uses one supplied TIME SELECT product preview and the separate PAUSE / PRAY / CHOOSE prayer editorial row.

## 10. Expected Outcome & Feedback

The point is intentional choice, not prayer quantity.

Allowed examples:

- 오늘 다시 선택한 횟수
- 기도
- 돌아가기
- 필요한 시간만 사용

No streak, badge, XP, ranking, level, score, or competition.

## 11. Voluntary Prayer

Explain that users may also enter prayer voluntarily.

Keep this concise.

Puzz may appear as a small companion.

## 12. FAQ

Anchor: `#faq`

Use the approved seven FAQ questions and stored expanded answers from the final Desktop/Mobile frames. Preserve independent toggles, keyboard controls, anchor and ARIA associations. Use 5 / 10 / 15 minutes, no automatic SNS unlock, RETURN or deliberate time choice, the basic direction of not collecting prayer originals, and no payment for beta signup. The beta-target question is removed from FAQ; the existing form audience/participation notice remains unchanged.

The actual FAQ uses shadcn/ui Accordion / Item / Trigger / Content customized to the existing Figma CSS and chevron. Root is controlled type=multiple; first item opens initially and the rest stay closed. Explicit question/answer IDs and ARIA associations remain, and forceMount + hidden keeps all association targets in the DOM. Do not add the stock theme or accordion height animations.

## 13. Beta Signup

Anchor: `#beta-signup`

Preserve the existing **8 form groups**:

- nickname
- email
- OS
- signup reason
- age range
- target apps
- reduction methods
- required consent

Do not remove groups for implementation convenience.

## 14. Form States

Implement:

- default
- focus
- error
- disabled
- loading
- success
- server error
- duplicate

Client-side success without a server response is not acceptable.

## 15. Real Submission

Before creating a new backend, inspect the repo for:

- existing API endpoint
- database
- Supabase
- Firebase
- Google Sheets / Apps Script
- webhook
- form service

Reuse existing infrastructure where reasonable.

If none exists, implement a clear route-handler / adapter architecture.

Do not fake persistence.

## 16. Privacy

Use the approved consent UI and Privacy link.

Do not invent legal language.

If no real privacy URL exists, report it as an implementation issue.

## 17. Responsive Authority

Desktop: 1440px

Mobile: 393px

Validate at least:

- 1440
- 1280
- 1024
- 768
- 430
- 393
- 375
- 320

No horizontal page overflow.

## 18. Required Interactions

- anchor navigation
- beta CTA scroll
- how-it-works scroll
- FAQ interaction
- Time Select5/10/15 wheel tap / keyboard / swipe
- final WHY NOW → THE GAP opacity-loop transition with offscreen/background pause and reduced-motion fallback
- form validation
- loading/result states

Respect `prefers-reduced-motion`.

## 19. Accessibility

Minimum:

- one H1
- logical heading hierarchy
- semantic sections
- accessible buttons/links
- visible focus state
- proper form labels
- error association
- keyboard navigation
- sufficient contrast
- ~44px+ touch targets
- `aria-live` for form result

## 20. Suggested Technical Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui where useful

Current actual adoption: official shadcn/ui Radix Accordion and Button, manually customized to the existing CSS. FAQ uses Accordion primitives, Hero/Header use Button asChild + AnchorLink, and the signup form uses native Button submit. Button separates primary/secondary appearance from default/disabled/submitting state. The form adds only its existing submitting state prop; validation/handlers/API remain unchanged. See SHADCN_ADOPTION.md. Do not replace approved styling with the default shadcn theme or replace native form controls unnecessarily.

## 21. Definition of Done

1. Desktop visually matches Figma closely.
2. Mobile visually matches Figma closely.
3. CTA anchors work.
4. FAQ works.
5. Time Select wheel works; final motion and reduced-motion/static behavior match their specifications.
6. Form validation works.
7. Form sends a real local POST to the disabled Route Handler during automated QA; production persistence remains OFF and no real INSERT is allowed.
8. Success/error states depend on server result.
9. No horizontal overflow.
10. Keyboard focus works.
11. `npm run lint` passes.
12. `npm run build` passes.
13. Deployment is production-ready.

## Final submission stage

Visual freeze and PENDING DESIGN ended with final Desktop1088:916 / Mobile1088:1251 / Desktop THE GAP1088:986. The final frames override earlier933/913 frames and Hero / app-theme / four-phone composition instructions above. Do not mount the previous Hero Light/Dark toggle or repeated phone previews: final Hero is full-bleed artwork and product behavior is the supplied Time Select mockup. Keep existing interaction code reusable, not visible additions to the final design.

Recheck existing schema; nullable consent fields are already applied. Reuse the adapter and existing DB, no RLS or constraint change. Actual INSERT QA is deferred until privacy notice alignment. Keep Production/Preview persistence off; production server returns503 PRIVACY_REVIEW_REQUIRED before accessing the store. Automated tests stay mocked/disabled.

Current work is local only: apply the final visual differences on top of the existing role-based section components while preserving the original eight sections, approved copy, behavior and anchors. page.tsx composes sections, skip link, SignatureTransition and footer. Keep feature/mission-5-landing and PR #1; no commit/push, new PR, merge, reset, rebase, force push, main changes or Vercel redeployment before the user's final approval.

The already adopted Radix-backed shadcn Accordion remains in FAQ; Button + CVA + Radix Slot remains in the existing CTAs and submit path with primary/secondary appearance and disabled/submitting states. Keep PrayTime styling; do not restore the stock shadcn appearance, replace the form system or add unrelated components. The final visual/motion authorization does not authorize backend changes or publishing.

WHY NOW → THE GAP now uses the actual final Figma opacity-loop timeline: Desktop2800ms, Mobile2410ms. Native Web Animations API coordinates twelve retained tracks, with IntersectionObserver/offscreen/background pause and a prefers-reduced-motion/static fallback. Five reflection/ambient/aperture tracks per viewport are omitted under the user's explicit no-floor-reflection/no-bloom/no-horizontal-glow instruction. The transition has no sticky stage, scroll-progress animation, scroll hijacking, WebGL or added motion dependency. See MOTION_PLAN.md for node mapping and the superseded proposal.

Run npm run lint, npm run typecheck, npm run test, npm run build -- --webpack and npm run test:e2e against this final local patch; browser tests use the completed production artifact with persistence disabled. Record fresh outcomes in FINAL_VISUAL_PATCH.md, keeping historical PASS evidence distinct and noting any environment-limited attempt honestly. Report results and diff before asking for publishing approval. Actual DB INSERT remains forbidden until privacy alignment. Keep current policy text until the user supplies approved legal copy; report discrepancies rather than writing it. Domain/DNS cutover is separately on hold, so preserve the existing Lovable service.

## Release authorization update · 2026-11-06

The user has now approved committing/pushing this final visual + favicon implementation, updating the existing PR #1 and redeploying the existing Vercel project. Earlier pre-approval publishing holds in this stage are satisfied. Keep feature/mission-5-landing, PR #1, main, the privacy guard and disabled persistence. No merge, actual DB INSERT, new DB or custom-domain DNS cutover is authorized.

## Current micro-interaction release scope · 2026-11-06

The final visual/favicon release is complete at `7c77356`. The subsequent micro-interaction patch includes: Hero pointer response, equal GAP anchor interactions (`#hero` / `#how-it-works`, confirmed by the user), active navigation and one-time WHY NOW count-up. Preserve the approved Figma layout/copy, existing transition, shadcn, wheel, form/API and privacy guard. No new dependency. After the diff and passing checks were reported, the user explicitly instructed “재배포해” on 2026-11-06. Commit/push on the existing feature branch, update PR #1 and redeploy the existing Vercel project are now authorized; the earlier local-only hold is satisfied. Merge, main changes, real DB storage and DNS cutover remain forbidden. See [MICRO_INTERACTIONS.md](MICRO_INTERACTIONS.md) for current implementation and fresh checks.

Latest user timing correction: after the deployed-site review, “그래서” was reported too fast. Only the transition reading pace is now overridden:6000ms loop for both viewports, word1050ms full hold, both bridge lines1550ms simultaneous full hold. Original Figma opacity/easing/sequence/layout are preserved. This later feedback supersedes the earlier keep-transition-timing instruction; see MOTION_PLAN.md. Other micro-interactions and release/privacy restrictions remain unchanged.

Earlier user-approved WHY NOW presentation (superseded by the reference correction below): the gray track is removed and each red accent fills to its own displayed maximum34.3 /25.3. Exact visible/accessible percentages and cited source stay unchanged. These decorative count-completion accents do not encode a shared0–100 statistical scale. This explicit approval supersedes the original proportional-gauge styling; other layout/copy/interaction/backend constraints remain intact.

Current WHY NOW reference correction: the user explicitly selected https://praytime.glorifier.kr/ for the gauge and speed. Verified StatMetric source/rendering:3000ms cubic ease-out,7px square bars,no gray,first100% red#FF4438/second70% lavender#C4C0F0,each card triggers at50% with bottom-15% rootMargin. Copy these details only. Mission5 Ink numbers/exact34.3%/25.3%/source/copy/type/layout/accessibility remain, with session-once and reduced/no-JS final fallback. This overrides the earlier750ms/equal-width gauge treatment;6s transition and backend/privacy remain unchanged.
