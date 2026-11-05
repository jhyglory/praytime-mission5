# Final Figma comparison

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
| FAQ | Same five approved answers, first open, native keyboard / ARIA behavior |
| Form | Same eight groups, Light controls, reserved nickname helper line, final email helper copy |

Where the reference board differs visually, final Desktop/Mobile win: their gauges are6px with424px desktop /297px mobile available tracks rather than the board's4px/240px/232px note; their transition stops are preserved. The earlier751:7316 product screen was inspected as supporting native interaction context, and does not replace the final supplied mockup or copy.

The user's latest release instruction overrides the board's live-submission gate: current Privacy URL stays, no Terms/legal text is invented, and all actual INSERT QA is deferred. Landing deployment and mocked/disabled tests proceed while production writes remain blocked.

Automated browser assertions remain enabled for all responsive and interactive checks. Optional full-page PNG export uses CAPTURE_QA_SCREENSHOTS=1; it is separate because host resource pressure caused a screenshot-export timeout after assertions had passed. Earlier Desktop/Mobile screenshots and direct browser visual checks were also performed.
