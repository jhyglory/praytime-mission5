# Final Figma comparison

## Current approved visual patch

Desktop1088:916 / Mobile1088:1251, including Desktop THE GAP1088:986, supersede all933/913 visual targets below. The final visual patch is implemented locally; PENDING DESIGN has ended. Light surfaces are Soft Paper #F5F2F7, Time Select is Light, Prayer is Dark, FAQ retains its final seven items. The GAP uses actual narrow slit primitives with floor/reflection/environmental bloom omitted per the user's explicit instruction. The transition uses the actual exported timed loop (Desktop2800ms/Mobile2410ms), native WAAPI with offscreen pause and reduced-motion fallback, with the conflicting glow/reflection tracks omitted. No redesign, dependency, backend change or publishing. See [FINAL_VISUAL_PATCH.md](FINAL_VISUAL_PATCH.md) for current differences, asset checks, captures and fresh verification.

## Historical933-stage local patch scope

The remainder of this document records the earlier implementation stage; its static-transition / deferred-polish statements and old source priority are superseded by the current1088 patch above.

Source priority: **Desktop933:3 → Mobile933:4 → Handoff933:5**. Each viewport follows its corresponding visual frame; both override the reference board. Handoff's Dark FAQ / five questions is outdated. The approved FAQ is Light Background + seven questions, including stored expanded answers in both frames.

The local patch extracts major sections into files and replaces only the FAQ copy/palette/chevrons. The subsequent authorized shadcn/ui Accordion/Button adoption uses Radix and CVA with the existing CSS. CTA links remain native anchors without wrappers; FAQ retains the h3/button/answer-region topology and explicit ARIA IDs. Copy, base classes, hrefs, static transition and behavior are preserved; Button adds state attributes/classes without changing visual rules. The original eight-section order, One Question and form participation notice remain. See SHADCN_ADOPTION.md for UI dependencies and latest checks. No Figma write, backend change, commit/push, PR mutation or Vercel action is part of this patch.

WHY NOW → THE GAP motion and its dependent bridge/spacing are **PENDING DESIGN**. Keep the current static transition; no placeholder or sticky implementation. See MOTION_PLAN.md. Other visual differences (Time Select silhouette/background, Prayer background/light/dividers, spacing polish) remain deferred until final authorization.

The table and session below describe the earlier deployed baseline; the FAQ row is superseded by this local patch. Do not present historical build/browser PASS as fresh evidence for uncommitted changes.

Figma MCP session: 747951af-d3a8-49ae-a94f-94fa35af8e09.

- [Desktop 933:3](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/PrayTime?node-id=933-3): final visual authority
- [Mobile 933:4](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/PrayTime?node-id=933-4): final visual authority
- [Handoff 933:5](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/PrayTime?node-id=933-5): development reference

All three were read with get_design_context and screenshots. The supplied final Hero / Time Select / Puzz raster assets and native Pause Mark are reused. Old913:13 /913:14 are not implementation targets.

| Area | Final implementation |
| --- | --- |
| Hero | Full bleed, transparent overlay header, white nav, red CTA, exact artwork/crop |
| Light regions | Paper White / restrained Lavender Mist, Ink data |
| Why Now | 34.3% /25.3%, common100% track, red proportional fill,12px mobile source |
| Transition | Uses the colors/stops of the final Desktop/Mobile frames |
| The Gap | Original approved glowing mark and equal agency |
| Time Select | Exact supplied10-minute initial image. Tap / arrows / Home / End / swipe select discrete5/10/15-minute states; changed states paint only the interactive wheel UI slot. The underlying supplied image remains unchanged. This preview does not unlock apps or start a real timer. |
| CTA | Beta anchors to signup; Hero secondary anchors to The Gap per Handoff |
| FAQ | Historical baseline: five answers on Dark. Local patch supersedes this with final seven answers on Light / Ink / chevrons, retaining native keyboard / ARIA behavior and first-open state. |
| Form | Same eight groups, Light controls, reserved nickname helper line, final email helper copy |

Where the reference board differs visually, final Desktop/Mobile win: their gauges are6px with424px desktop /297px mobile available tracks rather than the board's4px/240px/232px note; their transition stops are preserved. The earlier751:7316 product screen was inspected as supporting native interaction context, and does not replace the final supplied mockup or copy.

The user's latest release instruction overrides the board's live-submission gate: current Privacy URL stays, no Terms/legal text is invented, and all actual INSERT QA is deferred. Landing deployment and mocked/disabled tests proceed while production writes remain blocked.

Automated browser assertions remain enabled for all responsive and interactive checks. Optional full-page PNG export uses CAPTURE_QA_SCREENSHOTS=1; it is separate because host resource pressure caused a screenshot-export timeout after assertions had passed. Earlier Desktop/Mobile screenshots and direct browser visual checks were also performed.
