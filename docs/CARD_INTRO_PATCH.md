# Clean intro → Card motion patch

User source: [full scene1265:8215](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-8215), [clean intro1265:8081](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-8081). Mobile follow-up: [WHY NOW1209:1073](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-1073).

## Scope

Replace only SignatureTransition between WHY NOW and THE GAP. Existing Hero, OneQuestion, Gap, TimeSelect, prayer, FAQ7, shadcn Button/Accordion, anchors, favicon/OG, server API, privacy version and actual signup storage/success alert stay intact. No new dependency, Figma write, real POST, DB data/policy change, main/merge or DNS operation.

Mobile link is a393×1098 WHY NOW frame, not an intro frame. Its typography32/48 and26/44, reserved156/144px copy slots, lower190px dark threshold and6px gray/red proportional34.3%/25.3% gauges are implemented on mobile. Desktop retains the prior100%red/70%lavender reference. Count duration3s and visible/accessible exact values remain. Intro mobile layout is an explicit responsive adaptation of the supplied Desktop scene, keeping the existing560px slot; no claim of a supplied Mobile intro design.

## Design context and assets

Root response was sparse; high-fidelity contexts were fetched for clean stage, declaration, floor/quiet/edges, six card types and the heart/share vector descendants. Component instances retain exact scaled geometry/typography from read-only Plugin API inspection. The exported card reference code reported unscaled style values; resolved220px instance child bounds were used to avoid oversized text/padding.

- Six reusable card templates: photo / video / text / chat / collection / notification. Two repeat tiles per six columns,72 decorative cards total.
- Original downloaded PNGs and SVGs in public/assets/card-intro. All images have empty alt inside aria-hidden scene; one static sr-only description conveys the message.
- Existing repository has no mapped Heart/Share code components. Their actual vector descendants were fetched as source assets; no CodeConnectSnippet wrapper or substitute icon is shipped.
- Intrinsic SVG root dimensions preserved, including stroke and floor blur export padding. PNGs use their authored image slots. No screenshot used as UI asset, no temporary asset URLs in source.
- [Asset manifest](evidence/card-intro/assets.json) records source node/slot, local path, bytes, SHA256 and SVG root dimensions.

## Motion

32 animated nodes,55 WAAPI property effects. get_motion_context's exact exported snippets supply all values, normalized offsets and easing. x/y tracks with identical offsets combine into transform effects; opacity keeps its own offsets. No easing regenerated from fallback bindings. No motion library installed because the existing stack uses native WAAPI.

| Stage | Source timing |
| --- | --- |
| 그래서 |150.4–649.6ms, opacity0→1 / y12→0 |
| PRAYTIME은 |1350.4–1950.4ms, opacity0→1 / y14→0 |
| Clean intro |Opacity1 through4000ms; fade out by4449.6ms |
| Card stage |Opacity0 through4000ms; fade in by4449.6ms |
| Headline |4200–4950.4ms, opacity0→1 / y18→0 |
| Product anchor |4700.8–5249.6ms, opacity0→1 |
| Six columns and20 heart/share streams |Exact source linear offsets and resets on the shared16000ms loop |

Static centering/responsive scaling lives outside animated elements. Every motion node maps to its exact data-node-id. Offscreen and hidden-tab effects pause and resume together; cleanup cancels effects/listeners. Reduced motion and no-JS show the introduction and declaration statically, hiding the decorative stream. No scroll hijacking or sticky lock.

## Verification

Initial browser pass caught missing transition positioning/clipping and obsolete assertions. Restored relative/clip/isolation and replaced old6s letter/slit checks with source-specific16s phase samples, all32 animated node mappings,55 effects,72 cards,20 icons and actual stage playback. Validation never hits production storage.

Latest check results are recorded after the final alignment pass below.

Final alignment: Figma wordmark row316.975px versus rendered316.953px at1440px after reserving the exact225px text slot. Original SVG bounds remain unchanged. Desktop1440/Mobile393 at3s and6s: missing images0, horizontal overflow0. Screenshots were visually compared to the supplied clean-intro target; second-stage layout follows the fetched high-fidelity child contexts (its standalone Figma screenshot is1×1 because the parent stage starts at opacity0).

Final checks: lint PASS, typecheck PASS, unit40/40 PASS, production Webpack build PASS, browser32/32 PASS(1.0m). Browser test observes an actual full16s loop returning from cards to the clean intro, both viewport phase samples, all32 node mappings/55 effects, reduced/no-JS fallbacks,8 responsive widths, assets and existing form/CTA/FAQ/wheel regressions. No actual DB POST/INSERT in this patch.
