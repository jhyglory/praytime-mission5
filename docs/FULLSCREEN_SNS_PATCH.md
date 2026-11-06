# Fullscreen alternating SNS scene · 2026-11-06

> Historical release record. Current whole-page layout, statistics, source-sized all-up SNS motion and viewport-height intro are defined in [WHOLE_PAGE_FINAL.md](WHOLE_PAGE_FINAL.md). Earlier scope, timing, geometry or direction rules below are superseded where they conflict.

The user's latest instruction overrides only the SNS card scene's fixed frame height and shared upward direction. The previous intro/photo/GAP specification remains in [FINAL_SNS_PATCH.md](FINAL_SNS_PATCH.md).

- Scene height is100dvh with100vh fallback. The original1440×760 Desktop /393×680 Mobile artwork is centered and uniformly cover-scaled to fill both axes. ResizeObserver updates only a CSS variable on resize, with no React state/frame loop.
- The declaration remains unscaled and centered in the viewport. Copy, typography and central dark overlay are preserved.
- Columns alternate up / down / up / down. Up runs0→−cycleHeight; down runs−cycleHeight→0. Both use the same12s linear loop and existing initial y phase. The identical second tile preserves seamless coverage and photo uniqueness in both directions.
- Standalone clean intro retains760px Desktop /680px Mobile and its existing whole-word/actual-logo entrance.
- Original80 photos,6/3columns,16hearts/4shares, reduced-motion static arrangement, offscreen/background pause, normal scrolling and existing CTA/FAQ/wheel/form/backend remain intact.
- No dependency, API/env/schema/RLS, real POST/DB write, Figma edit, main/merge or DNS change.

## Checks

- lint / typecheck / unit47 PASS.
- Webpack production build PASS.
- Browser35 tests: existing regressions plus fullscreen coverage/centering at1440×900,1440×1080,1920×1080,2560×1080,844×390,393×844,430×932; alternating signed column/photo movement; every source phase and12s/24s seam ±2ms; visible-photo uniqueness and full coverage; actual12s playback; reduced/no-JS and existing interactions.
- Local screenshot comparison at1440×900,1920×1080,393×844 and430×932. [GET-only visual evidence](evidence/fullscreen-sns/local-browser.json) records scene/art/copy bounds, column directions/positions, runtime errors and POST count.
