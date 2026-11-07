# Final visual patch · 2026-11-06 KST

Release update: the user has approved commit/push, existing PR #1 update and Vercel redeployment including the favicon. The local-only statements below record the pre-release validation snapshot. Merge, actual DB storage and DNS cutover remain deferred. Latest release validation is recorded in RELEASE_VALIDATION.md; the PR contains the actual release commit/deployment result.

Status: implemented and verified in the existing local working tree. Branch `feature/mission-5-landing`, unchanged HEAD `529bdd8094ac45c8c20dd9ef04ee9a486500c70d`. Not committed, pushed or deployed. Existing PR #1 is unchanged. This report supersedes the earlier PENDING DESIGN / section-FAQ / shadcn stage results for the current visual implementation.

## Source of truth

- [Desktop1088:916](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-916)
- [Mobile1088:1251](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-1251)
- [Desktop THE GAP1088:986](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-986); corresponding Mobile GAP1088:1319

Figma MCP session `56c86201-321a-4413-bdb3-c90ca90445af`. Design context and screenshots were obtained for all three requested nodes; authoritative recursive motion context was obtained for both complete frames. Old933:3/933:4 and913:13/913:14 are historical. Figma was read only; no design exploration or Figma write was performed.

## Differences applied

| Area | Final local change |
| --- | --- |
| Light surfaces | One Question, Why Now, Time Select, FAQ, Form and Footer use Soft Paper `#F5F2F7`; form fields/stat cards retain their separate approved control surfaces |
| Typography / rhythm | Approved Desktop/Mobile line-height, supporting text size, paragraph breaks and section/content gaps; no section reordering |
| Why Now | Neutral Ink percentages/common proportional red gauges retained; exact supporting-type and whitespace updated; former static gradient/bridge replaced by the approved transition |
| THE GAP | Deep Night canvas, actual vertical slit sublayers, updated title/body placement and two equally styled choice branches; Desktop horizontal / Mobile vertical |
| Time Select | Light background and approved phone-silhouette mask; unchanged raster, outer geometry, initial10 selection and5/10/15 interaction |
| Voluntary Prayer | Dark background, approved typography and restrained divider treatment; existing original Puzz preserved |
| FAQ / Form | Light background; existing seven-question shadcn Accordion, native CTA/Button behavior and all eight form groups preserved |
| Transition | Dedicated small client component between Why Now and THE GAP; no extra semantic section, sticky stage, scroll interception, WebGL or dependency |

The working tree already contained section extraction and actual shadcn/ui Button/Accordion adoption before this patch. Those changes were preserved. This patch does not introduce another theme or replace the form state machine.

## Explicit user instruction versus exported effects

The supplied THE GAP composite still includes environmental light and floor reflections. The user's explicit request that only the vertical slit emit light takes precedence. The composite is not used. The actual Figma primitive slit layers are implemented from their own high-fidelity contexts:

- Desktop1089:1281 /1089:1282:9×340 penumbra and3×340 clean inner edge
- Mobile1089:1291 /1089:1292:6×230 penumbra and2×230 clean inner edge

No floor pool, surrounding ellipse/bloom or horizontal glow is rendered in the transition-to-GAP scene. The choice divider lines/arrows stay symmetric; the additional blurred reflection nodes1088:997/1004 and1088:1330/1337 are omitted. Hero artwork and Puzz's original grounding are unchanged assets outside this scene.

The same explicit removal omits these five conflicting animated layers per viewport while preserving all remaining Figma track values:

- Desktop1117:1259,1117:1305,1117:1319,1117:1334,1117:1347
- Mobile1088:1299,1088:1306,1088:1308,1088:1311,1088:1312

These are Lavender ambient, slit reflection and three horizontal aperture glow layers. No replacement effect was invented.

## Motion behavior

The actual Figma payload specifies a **2,800ms Desktop /2,410ms Mobile repeating timeline**, not a scroll-progress or sticky interaction. The previous feasibility proposal is superseded.

Twelve remaining opacity elements run on one synchronized native Web Animations API timeline per viewport, preserving the exported values, normalized offsets and ease-in-out/linear segments. Existing dependencies are sufficient. IntersectionObserver pauses playback offscreen; hidden tabs pause; breakpoint changes rebuild the matching timeline; cleanup cancels animations and listeners. Reduced motion cancels animation and displays a readable static bridge; SSR/no-JS also keeps a static reading fallback. No hydration suppression is used.

## Asset verification

Final Desktop/Mobile Hero, Time Select and Puzz raster downloads were SHA256-compared with existing local files: byte-identical, so the originals are reused. All are non-empty and their callsites/geometry were checked. No screenshot is used as an implementation asset and no temporary Figma URL is present at runtime.

New local exports are two24×24 choice-arrow SVGs and six viewport-specific dot SVGs (Desktop5.6×5.6, Mobile4×4). Intrinsic SVG dimensions are preserved. No generated or redrawn brand asset was added.

## Changed implementation files

- `src/app/globals.css`: final scoped visual rules
- `src/app/page.tsx`: imports/composes the transition between the original sections
- `src/components/landing/signature-transition.tsx`: motion lifecycle and exact remaining tracks
- `src/components/landing/why-now-section.tsx`, `gap-section.tsx`: approved line breaks/slit/choice structure and bridge placement
- `src/components/landing/time-select-section.tsx`, `voluntary-prayer-section.tsx`: surface roles and matching line breaks
- `src/components/landing/hero-section.tsx`, `faq-section.tsx`: updated Figma provenance markers
- `public/assets/choice-*-arrow.svg`, `transition-dot-*.svg`: actual Figma exports
- `tests/e2e/landing.spec.ts`: strengthened checks within the existing18 scenarios
- Project context / comparison / QA documents: updated source authority and stage status

## Latest validation

| Command | Result |
| --- | --- |
| `npm run lint` | PASS, zero warnings |
| `npm run typecheck` | PASS |
| `npm run test` | PASS,40/40 across four files |
| `npm run test:e2e` | PASS,18/18 |
| `npm run build -- --webpack` | PASS, optimized production build |

The browser suite runs against `next start` from the Webpack production build. All earlier FAQ keyboard/focus, CTA heading focus, consent/validation, loading/receipt/duplicate/error, ARIA and time-wheel checks remain. New checks cover Soft Paper/Dark surfaces across320–1440px, slit geometry, equal-choice symmetry, actual Desktop/Mobile animation opacity changes, offscreen pause, normal wheel scrolling and reduced-motion cancellation. No missing asset, horizontal overflow or application console/page error was found.

The default Turbopack internal-worker EPERM limitation remains a separate recorded environment issue; its default build is not claimed as passing. No script/config bundler change was made.

Rendered captures use reduced motion for a deterministic readable static comparison. The full transition's running behavior is verified separately by the browser suite. Captures and geometry:

- [Desktop1440](evidence/final-visual-patch/full-1440.jpg)
- [Mobile393](evidence/final-visual-patch/full-393.jpg)
- [THE GAP Desktop](evidence/final-visual-patch/gap-1440.png) / [Mobile](evidence/final-visual-patch/gap-393.png)
- [Measured geometry](evidence/final-visual-patch/geometry.json)
- [Check results and exit codes](evidence/final-visual-patch/checks.json); raw [lint](evidence/final-visual-patch/lint.log), [typecheck](evidence/final-visual-patch/typecheck.log), [unit](evidence/final-visual-patch/unit.log), [browser](evidence/final-visual-patch/browser.log), [build](evidence/final-visual-patch/build.log) logs

Desktop leading section heights match the final layout: Hero684, One Question514, Why Now963, transition760, GAP1180px. Mobile:889,366,1098,560,1024px. Both have zero horizontal overflow or missing images. This is isolated Chrome QA, not a claim of a new deployed or native-incognito release check.

## Preserved release boundaries

Production persistence remains OFF; privacy guard and existing backend/API/store code are unchanged. Automated tests force persistence disabled, clear provider bindings and intercept successful/duplicate HTTP outcomes. Those cases are not actual storage evidence. No DB INSERT or existing applicant read/update/delete was performed.

No commit, push, new PR, merge or Vercel redeployment occurred. The current production code remains the earlier release. The separate custom-domain cutover remains deferred per the user's decision; this visual task does not change DNS or hosting settings.

## Subsequent favicon request · local only

The user requested a new favicon after the visual patch. The existing Signal Red Pause Mark now sits on a square Navy tile in `public/assets/praytime-favicon.svg`, with16/32/48px `public/favicon.ico` fallback and180px `public/apple-touch-icon.png`, all rendered from the same code-native SVG. The former24×36px export remains on disk but is no longer linked as the favicon. `src/lib/site-metadata.ts`, its existing unit expectation and the README description were updated. Landing CSS, interaction and backend are unchanged.

Fresh favicon-stage checks: lint PASS, typecheck PASS, unit40/40 PASS, Webpack production build PASS. Local production HTML links the three correct icons; GET responses are200 with correct formats and dimensions. Evidence: [favicon-http-qa.json](evidence/favicon-http-qa.json). The18-browser result above belongs to the preceding visual patch; it was not rerun for this metadata-only follow-up. No commit/push/deploy or DB action.
