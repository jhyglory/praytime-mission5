# WHY NOW → THE GAP · final implementation specification

Status: final design approved; the former **PENDING DESIGN has ended**. Implementation is local and awaiting final verification/review. No commit, push, PR creation/merge or Vercel redeployment is authorized before the user approves the final diff/check results. Figma remains read-only. Latest results belong in FINAL_VISUAL_PATCH.md; this specification does not claim all checks have already passed.

## Authoritative sources

- [Desktop1088:916](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-916), transition child1088:965
- [Mobile1088:1251](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-1251), transition child1088:1297
- [Desktop THE GAP1088:986](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-986), Mobile child1088:1319

The actual recursive Figma motion context defines **opacity timelines with looping cohorts**, Desktop2800ms / Mobile2410ms. It does not define a sticky or scroll-progress transition. The final sources supersede the933/913 frames and the earlier feasibility proposal.

## Retained motion and explicit removal

The export contains17 animated nodes per viewport. Twelve retained node tracks use the supplied opacity values, normalized offsets, easing and shared viewport duration. The user's explicit instruction to remove floor reflection, surrounding bloom and horizontal glow takes precedence over residual Figma effects. Five exported reflection/ambient/aperture tracks per viewport are therefore omitted rather than replayed.

| Retained element | Desktop node(s) | Mobile node(s) |
| --- | --- | --- |
| Paper veil |1117:1254 |1088:1298 |
| Three dot cues |1117:1264 /1277 /1291 |1088:1300 /1302 /1304 |
| 그 / 래 / 서 |1117:1270 /1284 /1298 |1088:1301 /1303 /1305 |
| First vertical slit |1117:1312 |1088:1307 |
| Two converging slit edges |1117:1360 /1366 |1088:1313 /1314 |
| Two bridge lines |1117:1372 /1379 |1088:1315 /1316 |

| Omitted under user instruction | Desktop | Mobile |
| --- | --- | --- |
| Lavender ambient / fading |1117:1259 |1088:1299 |
| Hidden source / slit reflection |1117:1305 |1088:1306 |
| Outer lavender atmosphere |1117:1319 |1088:1308 |
| Middle ivory illumination |1117:1334 |1088:1311 |
| Inner warm light |1117:1347 |1088:1312 |

THE GAP itself keeps only the narrow slit layers1089:1281–1282 /1089:1291–1292 rather than the full environment/floor export. The two final choice outcomes remain equal. The separate Prayer section's approved dividers and original companion artwork are preserved in their own section.

## Runtime implementation

`src/components/landing/signature-transition.tsx` confines enhancement to one client component. `page.tsx` mounts it between WhyNowSection and GapSection as a div, preserving the original eight semantic sections, anchors and surrounding Server Components.

- Native Web Animations API drives the12 tracks; repeated letters and edges share named tracks and one synchronized lifecycle. No motion package was installed.
- CSS reserves the final stage height: Desktop760px / Mobile560px. Static CSS handles placement; only opacity is animated. Slit geometry/blur values remain local to their narrow elements.
- IntersectionObserver starts/pauses playback when the stage enters/leaves view. The document visibility listener pauses hidden-tab playback. Re-entry resumes the coordinated current time.
- Responsive matchMedia selects the Desktop/Mobile cohort and reconstructs animations when the viewport crosses the breakpoint. The duration remains the corresponding Figma2800/2410ms value.
- prefers-reduced-motion cancels motion and exposes the static readable composition. The server and initial client HTML match; browser APIs are only accessed in useEffect. No hydration suppression or scroll-input listeners are used.
- Unmount cleanup disconnects the observer, cancels animations and removes listeners. No sticky stage, scroll lock, wheel/touch interception, scroll hijacking, WebGL or requestAnimationFrame loop is added.
- Dot cue SVGs are downloaded local Figma exports with the supplied desktop5.6px / mobile4px sizes. The full section screenshot is never used as a runtime asset.

## Verification required for the final local patch

Run lint, typecheck, unit tests, `npm run build -- --webpack`, then browser tests against that production artifact. Verify at least one complete actual loop per viewport, the2800/2410ms durations,12 coordinated tracks, offscreen/background pause, reduced-motion/static state, forward/back scrolling, normal keyboard anchors, no hydration/console errors and responsive geometry/overflow. Recheck FAQ, CTA, form loading/result/receipt behavior and all prior test cases without reducing their coverage. Record actual results in FINAL_VISUAL_PATCH.md, separate from earlier QA records.

Production/Preview signup persistence and the Privacy guard remain unchanged. No real DB INSERT or existing applicant read/update/delete is allowed during motion QA. Automated submission outcomes remain mocked or disabled.

## Superseded feasibility proposal

Before the final Figma arrived, the proposed fallback was CSS + IntersectionObserver + requestAnimationFrame with a short sticky stage and scroll progress. It was never approved as a visual specification and is **not the implemented transition**. Do not reintroduce that proposal over the actual final Figma motion timeline.

## Release authorization update · 2026-11-06

The user has now approved committing/pushing this final visual + favicon implementation, updating the existing PR #1 and redeploying the existing Vercel project. Earlier pre-approval publishing holds in this stage are satisfied. Keep feature/mission-5-landing, PR #1, main, the privacy guard and disabled persistence. No merge, actual DB INSERT, new DB or custom-domain DNS cutover is authorized.
