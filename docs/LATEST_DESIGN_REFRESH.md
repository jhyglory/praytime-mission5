# Latest Landing design refresh · 2026-11-06

The user selected [Figma page933:2](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/PrayTime?node-id=933-2). MCP metadata confirms that this page contains the current Desktop1088:916 and Mobile1088:1251; it does not select the retired933:3/933:4 frames. Both visible frames, their screenshots and recursive motion were read again.

## Applied differences

- The new source Hero raster continues into Dark ONE QUESTION. Desktop Hero684px + Question632px; mobile Hero932px with a220px artwork interval before the existing CTA. Question type80/112 desktop and44/66 mobile; current Figma colors and spacing.
- THE GAP uses the unmodified1440×1180 /393×1024 architectural SVG background. Native anchor semantics, equal choice weight, hover/focus and existing destinations remain. Choice divider and Prayer's PAUSE/PRAY/CHOOSE divider use the exact highlight, near halo, bloom and haze profiles.
- The transition restores Lavender ambient, slit reflection and outer/middle/inner aperture, including the Figma scaleX tracks.17 elements share the existing WAAPI lifecycle. Source opacity, scale values, viewport timing fractions and easing are preserved for the newly restored layers, with the user's existing6000ms clock. Existing word1050ms and bridge1550ms readable holds remain. Offscreen/background pause, reduced-motion and no-JS static fallbacks remain.
- Time Select, FAQ7, form and Footer are unchanged by the latest design. The current real shadcn Accordion/Button, wheel and form/API behavior remain.

## Preserved explicit customizations

The user previously chose the operating Lovable page's3000ms cubic ease-out statistics,7px square bars without a gray track,100% red /70% lavender. These remain rather than reverting to the unchanged Figma gauge prototype. Exact34.3%/25.3%, source and session/reduced-motion fallbacks remain. The selected Kakao OG image/favicon remain unchanged.

The newly requested complete light design supersedes the earlier omitted/reflection/ambient lighting restrictions. No new design direction, motion dependency or sticky/scroll hijacking was introduced.

## Assets and verification

All new assets were downloaded using the Figma tool's curl instructions and are local under public/assets/landing-*. No temporary Figma URL is used at runtime. Existing exact-matching phone, Puzz, arrows, chevrons and dots are reused. SVG root dimensions and blur padding are preserved. The new raster is shared between the two intro crops without editing.

Desktop1440 and Mobile393 screenshots were compared with current Figma section renders. Image slots, source dimensions and effective bounds are recorded during browser QA. Broader overflow, keyboard, motion, CTA and form checks are rerun at320/375/393/430/768/1024/1280/1440px.

Latest patch checks on2026-11-06: lint PASS; typecheck PASS; unit40/40 PASS; browser32/32 PASS(44.8s); production build `npm run build -- --webpack` PASS. Responsive QA found and corrected decorative Prayer light overflow at768px and precision of the393px type clamp before the final passing run. Existing FAQ keyboard/focus, CTA, wheel, API mocked/disabled states,6s transition and3s statistics remain covered. No actual DB INSERT was performed.

## Release boundaries

Use the existing feature/mission-5-landing branch, PR #1 and Vercel project. Production/Preview persistence remains OFF, privacy guard remains active, actual DB INSERT is forbidden. No merge, main change, new PR or DNS cutover. All local form tests mock/disable persistence; deployed QA is GET-only.
