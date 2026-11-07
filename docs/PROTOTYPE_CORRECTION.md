# Actual prototype correction · 2026-11-06

> Historical release record. Current whole-page layout, statistics, source-sized all-up SNS motion and viewport-height intro are defined in [WHOLE_PAGE_FINAL.md](WHOLE_PAGE_FINAL.md). Earlier scope, timing, geometry or direction rules below are superseded where they conflict.

> Historical8bd03ed release. The subsequent explicit intro/ZIP specification is implemented in [FINAL_SNS_PATCH.md](FINAL_SNS_PATCH.md).

The user corrected the preceding16s board implementation with the actual [Desktop prototype](https://www.figma.com/proto/J8iLsfruyMwVCakXsSJPq4/?node-id=1214-651&page-id=1209%3A513&starting-point-node-id=1209%3A514). Chrome playback and fresh Figma design/motion context were read. No Figma document was edited.

## Exact scope

- Full Landing1209:514 / Mobile1209:1051 places a clean text-only intro before the card declaration. They are separate scroll sections,760px each Desktop /680px each Mobile. Clean roots1265:8075 /1265:8099 return no animation tracks. There is no invented4s/16s auto-crossfade between them.
- Card preview1214:651 / Mobile1214:830 uses12000ms infinite linear streams. The declaration and product-anchor copy remain visible throughout. Exact supplied transform/opacity offsets are translated to the existing native WAAPI lifecycle.
- Desktop6columns,24 cards per cycle,2copies =288 cards; Mobile3columns,36cards per cycle,2copies =216 cards. Column opacity is0.64 Desktop /0.52 Mobile. Every viewport has20 decorative heart/share particles. Desktop26animated nodes/46property effects, Mobile23/43.
- Source image slots are dynamic per card: photo,video,collection0(left-top),collection1(right-top),collection2(left-bottom). All80 original JPEGs match Figma's imageHash by SHA-1; MIME, dimensions, bytes and SHA256 are recorded in [assets.json](evidence/prototype-correction/assets.json). No substitute photos or temporary runtime URLs.
- Desktop reuses the existing six card templates. Mobile templates preserve the source's actual140px child geometry and typography, rather than scaling the220px Desktop templates. SVG roots retain intrinsic dimensions; separate positioning wrappers carry scale.
- Next Image lazy optimization serves appropriately sized photo variants without downloading24MB of originals into each page view. Only the active viewport's decorative tree mounts after stable hydration. Reduced-motion/no-JS remains readable without mounting decorative cards. Offscreen/hidden-tab effects pause, and cleanup cancels old tracks when the viewport changes.
- Existing section order, remaining visuals, approved CTA and removed GAP label, shadcn Accordion/Button, Time Select, anchors, favicon/OG, live server adapter, privacy guard and actual-success alert remain intact. No backend/env/schema change or real POST/DB operation.

## File map

- src/components/landing/signature-transition.tsx / .css: two independent scenes, viewport-specific card streams/overlays/particles.
- card-intro-motion.json: exact12s Desktop/Mobile motion data.
- prototype-columns.json: card identity/slot/geometry mapping.
- ambient-cards.tsx / mobile-ambient-cards.tsx: reusable six card templates.
- prototype-mobile-cards.json: source geometry evidence used to generate the mobile templates; not imported into the client.
- public/assets/prototype-cards:80 original photos; public/assets/card-intro/{prototype-floor,mobile-floor}.svg: source support layers.
- tests/e2e/landing.spec.ts / micro-interactions.spec.ts: separate-scene geometry, unchanged readable copy across the timeline, all actual motion nodes, exact loop boundary, normal scrolling/offscreen pause, all-image integrity,8widths, no-JS/reduced motion and existing FAQ/CTA/form regressions.

## Verification and release

Final check and deployment results are recorded below only after completion. Earlier16s implementation details in CARD_INTRO_PATCH.md are historical. An initial browser run was interrupted after revealing that the former all-images-loaded check counted intentionally unloaded lazy images as missing. The QA now explicitly requests eager loading only in the test browser, then verifies all images finish with a nonzero natural width; the application's lazy loading remains intact.

### Final local checks

- npm run lint: PASS, zero warnings.
- npm run typecheck: PASS.
- npm run test:40/40 PASS,4files.
- npm run test:e2e:32/32 PASS,1.3min. Includes all8widths and the final0.64/0.52 column-opacity correction.
- npm run build -- --webpack: PASS, static Landing and dynamic beta-signup Route Handler.
- Desktop1440×760 / Mobile393×680 captures visually compared to downloaded Figma node renders at exact stream time0. Original photo slots, fixed copy, quiet overlays and source layer bounds match; optimizer compression/font rasterization can differ slightly from the editor render.
- [Local GET-only browser evidence](evidence/prototype-correction/local-browser.json):runtime errors0, HTTP errors0, horizontal overflow0, POST0; Desktop6columns/Mobile3columns. All photos verified loaded in QA. Source asset hashes80/80 match.
- No API, backend, env, schema, privacy policy, DB operation, new dependency, Figma write or DNS change. Existing live Production persistence remains unchanged.
