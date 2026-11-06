# WHY NOW → THE GAP · current motion specification

## Superseding source1265 · 2026-11-06

The new requested full-motion1265:8215 replaces the historical6s timeline below. Clean intro1265:8081 defines the card-free start; the full scene coordinates the intro and card motion on a16s loop. See [CARD_INTRO_PATCH.md](CARD_INTRO_PATCH.md). The old three-letter/slit/aperture implementation is retired; other Landing interactions and live backend remain unchanged.

## Current authority · 2026-11-06

The current visual source is [Figma page933:2](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/PrayTime?node-id=933-2), containing Desktop1088:916 and Mobile1088:1251. Source transition nodes are1088:965 /1088:1297. The user subsequently requested two explicit motion corrections: a slower6000ms reading pace, then sequential **그 → 래 → 서** instead of the dots-first / simultaneous-word reveal. These requests override the corresponding original Figma timing/choreography. Figma itself remains unchanged.

## Letter sequence

The dot prelude is removed from the rendered scene. The existing three Korean text nodes keep their position, typography, color and content; each now has its own opacity track. Earlier letters stay visible as the next appears.

| Letter | Fade in | Full-opacity interval | Fade out |
| --- | --- | --- | --- |
| 그 |0–300ms |300–2050ms |2050–2500ms |
| 래 |350–650ms |650–2050ms |2050–2500ms |
| 서 |700–1000ms |1000–2050ms |2050–2500ms |

All three are fully visible together for1050ms, matching the existing readable-word hold. The full loop remains6000ms on both viewports. The Paper veil stays full until1950ms and fades by2700ms. Bridge line1 is fully visible3400–5100ms; line2 is fully visible3550–5100ms, preserving1550ms simultaneous readability. Their timings, other lighting tracks and viewport layout are unchanged.

## Scene and source layers

The latest architectural light design retains its full source layers. There are **14 animated elements** after removing the three dot cues (previously17): Paper, ambient, three letters, reflection, slit, three apertures, two converging edges and two bridge lines. The aperture tracks preserve their original Figma opacity/scaleX values, center origin, viewport-specific normalized offsets and easing within the user-approved six-second clock. No extra motion was added to other elements.

Letter node mappings remain Desktop1117:1270 /1284 /1298 and Mobile1088:1301 /1303 /1305. Dot exports remain as historical source assets but are neither rendered nor animated. THE GAP uses the unmodified architectural SVG and the current Equal Choice / Prayer light divider system described in [LATEST_DESIGN_REFRESH.md](LATEST_DESIGN_REFRESH.md).

## Runtime and fallbacks

- The existing SignatureTransition client component uses native Web Animations API and one synchronized lifecycle; no dependency was installed.
- Desktop760px / Mobile560px geometry is reserved by CSS. Only opacity and the already implemented aperture scaleX animate; letters do not move or change width.
- IntersectionObserver starts/pauses the shared clock at visibility threshold.05. Hidden-tab playback pauses. Re-entry resumes the same coordinated time; responsive changes reconstruct the viewport-specific scene.
- With reduced motion or without JavaScript, all three letters and the bridge remain statically readable. Server and initial client HTML match. Browser APIs run only in useEffect.
- Cleanup disconnects the observer, cancels animations and removes media/visibility listeners. No sticky stage, scroll locking, input interception, scroll hijacking, WebGL or animation package.
- Existing Hero pointer, active nav,3s statistics, wheel, shadcn FAQ/Button and form/API behavior remain unchanged.

## Verification

Browser coverage samples actual rendered letter opacity at150/500/850/1000/2000ms on Desktop and Mobile, proving the ordered reveal and cumulative hold. It then resumes the shared clock to verify a complete real cycle, slit/aperture playback and offscreen pause. Reduced-motion coverage checks all letters are visible and no dots render. Existing anchor, form, keyboard and responsive checks remain.

Latest sequential-letter patch checks on2026-11-06: lint PASS; typecheck PASS; unit40/40 PASS; browser32/32 PASS(52.8s); production build `npm run build -- --webpack` PASS. The full browser run includes actual Desktop/Mobile sequential opacity samples, complete live playback, reading holds, reduced-motion/static letters, offscreen pause and existing form/CTA/FAQ/wheel/statistics regressions. No actual DB INSERT.

## Release boundaries

Continue the authorized feature/mission-5-landing / existing PR #1 / Vercel workflow after checks. Keep main untouched and do not merge. Production/Preview persistence stays OFF and the Privacy guard stays active. No actual DB INSERT or existing applicant access is allowed; local form tests use mock/disabled persistence and deployed QA is GET-only. Existing Lovable/DNS connection remains unchanged.
