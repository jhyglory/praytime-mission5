# Static intro gradient · 2026-11-08

## Current user correction

Restore the black gradient. Keep the upper 그래서 area light even after the word disappears.

The preceding1fceb61 implementation kept the entire scene light only while the word was visible and then faded it to navy. That interpreted a spatial distinction as a temporal background change. This correction supersedes it.

## Implementation

- Restore the original exported blurred paper geometry and lower navy handoff. Upper light and lower navy are connected by the original spatial gradient, not a time-based whole-scene background switch.
- Keep paper opacity1 from0ms through4600ms and after completion. Remove the temporal handoff track and full-scene paper media overrides added in1fceb61.
- Therefore the upper word area remains light after the word fades, while the actual white/red logo+은 remains on the lower navy area. Returning to the completed intro does not darken its upper background.
- Preserve word/light/logo geometry, actual assets,600ms hold,4600ms total, once-on-entry playback, offscreen/background pause, breakpoint continuity and completed-state retention. Keep the initial unresolved-hydration content guard.
- Reduced-motion/no-JS retains the existing readable upper-word/lower-brand static composition.
- Preserve separate SNS cards, its1700ms reading-field delay, the bright WHY NOW section, and every other interaction/backend/env/DB/DNS setting. No dependency added.

## Current validation

Current source: lint PASS; typecheck PASS after build-generated types were stable; unit60/60 PASS; Webpack production build PASS; scoped browser7/7 PASS in22.3s. The first parallel typecheck overlapped Next's generated-type cleanup and was rerun successfully after build. Other project's3000 server was preserved; browser checks used an ignored3102 config with disabled persistence and the same production build.

Actual local Chrome1440/393/360 replay recorded278/279/278 frames: paper1 throughout, original gradient/handoff retained, logo first visible at~2016.5–2016.6ms and completion4600ms. Captures were inspected during the word, immediately after it disappears, during logo entrance and after completion. Upper light/gradient/lower navy remain in all4 stages. Reduced-motion/no-JS readability, breakpoint continuity, complete-page heights/nav/reload and0 overflow/errors/write requests passed. Screenshots and pixel/frame traces are local review artifacts outside the repository.

Previous full-scene paper coverage and paper0-at-logo expectations are obsolete and must not be reported as current acceptance criteria. The full long-running66-test suite was not rerun for this scoped correction; prior full-suite PASS is historical. Real mobile hardware, Safari and FPS profiling were not tested.

## Release

Use existing feature/mission-5-landing, PR #1 and Vercel project. Public verification must replay the actual motion and inspect the upper light area after completion, not just during visible word frames. Block signup POSTs and external writes. Record deployment identity and public results in [PR #1](https://github.com/jhyglory/praytime-mission5/pull/1). No main/merge/new PR/DB/DNS change.
