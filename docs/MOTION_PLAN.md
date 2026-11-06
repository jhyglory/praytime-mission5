# WHY NOW → THE GAP · current motion specification

> Latest speed override: SNS card columns run at0.8× the original speed, changing their cycle from12000ms to15000ms. Hearts/shares retain12000ms timing; the original Figma JSON remains unchanged.

## Whole-page final correction · 2026-11-06 — current authority

This task covers every Desktop/Mobile landing section. Latest explicit user requirements override final1209:514/1051 Figma, which overrides older repository restrictions. Remove narrow “other sections unchanged” scope,100%/70% transparent/lavender gauges,3000ms/50% trigger/sessionStorage latch, and alternating-column behavior. Stats now1400ms/40% independent visibility, both red34.3%/25.3% of a gray100% track, once per page load and replay on reload. SNS columns all rise; independent intro gets sufficient viewport height. Audit every section at1440/393/360 and publish real24s+/reload/interaction evidence. Product/security/approved original assets and existing live backend remain unchanged. See AGENTS.md and docs/WHOLE_PAGE_FINAL.md. Earlier stage records below are historical where they conflict.


## Historical: Fullscreen alternating SNS override · superseded

Latest user instruction changes ONLY the “손이 먼저 움직인 순간” card scene: fill the viewport (100vh fallback /100dvh), cover-scale the original artwork, center the static declaration, and alternate columns up/down/up/down. Use the same12s linear cycle, authored phase and two identical tiles; downward columns run−cycleHeight→0. Keep the independent clean intro at760/680px, original80-photo mapping, particles, reduced-motion/offscreen pause and all other interactions/backend. This explicit instruction supersedes fixed SNS scene heights and all-up motion in older Figma notes. No dependency, Figma/DB/DNS/main/merge changes. See docs/FULLSCREEN_SNS_PATCH.md.


## Historical: Previous intro/SNS-only specification · superseded

Use full Desktop1209:514 / Mobile1209:1051 for layout and previews1265:8215 /1265:11339 for the clean intro's entrance values. The user explicitly requires two independent sections: animate the WHOLE “그래서” word, then the actual exported Figma wordmark plus “은”, once on intro entry; hold the readable result without scene crossfade or auto-scroll. Entrance milestones are150.4–649.6ms /1350.4–1950.4ms with source easing, within the preview's4s clean window. Do not restore letter-by-letter text or a text/CSS substitute logo. The SNS scene stays separate with fixed copy,12s linear columns,16hearts/4shares and original80 ZIP Photos assigned once per base cycle. The supplied ZIP matches all existing80 photo bytes. Use an equivalent full-cycle translation and duplicate tile rather than interpolate the export's1.2ms internal column teleport. Reduced motion now retains static cards and readable text; no-JS keeps readable copy. Mobile WHY uses32/48 and26/44 even below393px. Center each GAP condition, actual light and CTA/arrow flex group on one panel axis. Preserve all other interactions, live backend/privacy guard, favicon/OG and source photos. No DB operation, Figma mutation, dependency, main/merge or DNS change. Existing authorized feature/PR1/Vercel workflow continues after checks. See docs/FINAL_SNS_PATCH.md. Earlier static-intro notes below are historical.


## Historical: Prototype correction · superseded

The user's latest prototype is Desktop1214:651 on page1209:513, starting at full Landing1209:514. Its companion Mobile preview is1214:830 (full Landing1209:1051). These supersede the previous combined16s board1265:8215 for this intro/card patch. The full Landing has a separate clean text-only intro (Desktop1265:8075, Mobile1265:8099), followed by a separate card-declaration scene. Both clean roots return an empty motion inventory; do not invent an auto-fade between the two scroll sections. Each section is760px Desktop /680px Mobile. Card scenes loop continuously every12000ms while declaration/anchor copy stays visible. Desktop six24-card cycles and Mobile three36-card cycles each duplicate once for seamless stream resets;20 decorative particles per viewport. All80 original photo assets are verified against their Figma image hashes. Use the actual Mobile geometry, not a scaled/cropped Desktop scene. Preserve all other sections and explicit CTA/GAP-label/favicon overrides, shadcn, live backend/privacy guard and success alert. No DB operations, Figma edits, dependency, merge/main or DNS changes. Continue the existing authorized feature/PR1/Vercel workflow after checks. See docs/PROTOTYPE_CORRECTION.md. Historical notes below are superseded where they conflict.


## Superseding source1265 · 2026-11-06

The new requested full-motion1265:8215 replaces the historical6s timeline below. Clean intro1265:8081 defines the card-free start; the full scene coordinates the intro and card motion on a16s loop. See [CARD_INTRO_PATCH.md](CARD_INTRO_PATCH.md). The old three-letter/slit/aperture implementation is retired; other Landing interactions and live backend remain unchanged.

## Historical: Earlier933/1088 authority · superseded

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
