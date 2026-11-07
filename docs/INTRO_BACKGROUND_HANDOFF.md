# Intro background handoff · 2026-11-08

## Confirmed user correction

“그래서” 동안만 밝게, “PrayTime은”부터 네이비.

The former paper was only a blurred upper patch and faded at1133.2–1632ms while the black word remained visible until1546ms. This was a source/timeline issue, not evidence of a cache problem.

## Implementation

- Normal-motion, JavaScript-enabled paper now covers the entire independent intro, including its viewport-height area. It uses solid Soft Paper #F5F2F7 with no blurred dark boundary.
- Keep paper fully opaque through1546ms, including the whole word's fade-out. Only1546–2010ms crossfades to the existing navy #0B1020. The lower handoff uses the inverse opacity on the same WAAPI clock, so it cannot introduce a navy band under the visible word.
- The actual red Pause/white wordmark+은 starts at the unchanged2010ms entrance, after the background reaches navy. Word, slit/aperture, logo positions,600ms shared hold and4600ms total timeline remain unchanged.
- Hide initial word/brand only while normal-motion hydration is unresolved to prevent the final white logo flashing over the initial light scene.
- Existing reduced-motion/no-JS static composition remains readable: upper light word and lower navy brand. Existing pause/resume, completed-state retention and breakpoint clock continuity remain.
- Independent SNS scene, every other section, backend, environment, database and DNS are unchanged. No dependency added.

## Validation

Current-source checks: lint PASS; typecheck PASS; unit60/60 PASS; Webpack production build PASS; scoped browser7/7 PASS in22.2s (intro sequence/breakpoint continuity/final responsive frame plus complete-page1440/393/360 and navigation/reload).

The default3000 port belongs to another project. Leave that process untouched. Use an ignored temporary Playwright config on3102 with the same production server and disabled persistence. Intro network isolation now derives its allowed origin from the configured baseURL; external endpoints and signup remain blocked. Initial tests on3102 exposed the old hardcoded3000 route guard; the corrected origin guard passed all7 scoped checks. No production code was changed to work around the port.

Actual local Chrome replay at1440/393/360 recorded276/279/278 frames. Every frame with visible black word kept paper opacity1 and navy-handoff opacity0. White brand first appeared at~2016.5–2016.7ms with paper0; every run ended at4600ms. Paper bounds matched the full900px scene at all3 widths. Actual screenshots confirmed full light word and navy brand states. Reduced-motion and no-JS readability passed; no horizontal overflow, console/page error or write request occurred.

Production: after the same commit is Ready and the existing canonical alias is updated, repeat the actual entry/replay and screenshot checks on https://praytime-mission5.vercel.app/. Final deployment identity and public results are recorded in [existing PR #1](https://github.com/jhyglory/praytime-mission5/pull/1). Public QA uses GET/HEAD only and blocks external/writing requests. Screenshots and frame traces are local review artifacts, not bundled app assets.

The full long-running66-test suite was not rerun for this scoped background fix. Earlier PASS records are historical. Real mobile hardware, Safari and FPS profiling are not tested in this patch.

## Release boundary

Use the existing feature/mission-5-landing branch, PR #1 and Vercel project. No new PR, merge, main change, production signup POST, applicant query/DB operation or DNS change.
