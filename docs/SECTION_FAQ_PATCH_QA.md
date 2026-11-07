# Local section / FAQ patch · 2026-11-06 KST

Stage snapshot before the subsequent shadcn/ui Button adoption. Dependency changes and fresh checks for that later authorized local patch are recorded in SHADCN_ADOPTION.md. This document's35-unit result is historical for the section/FAQ stage.

Base: feature/mission-5-landing, HEAD529bdd8094ac45c8c20dd9ef04ee9a486500c70d. Changes remain uncommitted and unpushed for user review. Existing PR #1, main and Vercel were not modified. No DB actions or dependency changes.

## Scope / preservation

page.tsx only imports and composes the skip link, original eight sections and footer. Section files: header.tsx, hero-section.tsx, one-question-section.tsx, why-now-section.tsx, gap-section.tsx, time-select-section.tsx, voluntary-prayer-section.tsx, faq-section.tsx, beta-signup-section.tsx, footer.tsx. Header and Footer share the Wordmark export without adding an extra tiny component file.

Non-FAQ function bodies were compared with the original snapshot and independently rechecked: unchanged except function/component names (LandingHeader → Header, etc.). DOM, copy, classNames, anchors, static WHY NOW gradient/bridge, form notices and client boundaries are preserved. No transition placeholder, sticky animation or new motion dependency. Motion remains PENDING DESIGN; see MOTION_PLAN.md.

FAQ is the authorized exception: final seven questions/expanded paragraphs, Light #fcfbfc / Ink #18181b / approved chevron. Removed the FAQ audience question; the unchanged form still states the target audience and that signup does not mean immediate access or confirmed participation. FAQ anchor, IDs, keyboard buttons, aria-expanded/controls, independent toggles and first-open default remain.

Figma source precedence is Desktop933:3 → Mobile933:4 → Handoff933:5 for corresponding viewports. FAQ's seven topics and hidden answers were read with MCP; the board's five-item Dark instruction is superseded. faq-chevron.svg is the actual Figma node1041:579 export, root24×24,331bytes; no artwork was invented. The Figma file was not edited.

## Current working-tree verification

| Check | Result |
| --- | --- |
| npm run lint | PASS, zero warnings |
| npm run typecheck | PASS |
| npm test | PASS,35/35, two test files |
| git diff --check | PASS |
| npm run build | FAIL / environment-limited: Turbopack PostCSS worker cannot bind a local port; Operation not permitted (os error1) |
| Browser execution | Not run: required production build is unavailable. Previous18 PASS remains historical evidence only. |

Build failure chain: Failed to write app endpoint /page → generated Inter CSS module → PostCssTransformedAsset/evaluate_webpack_loader → creating new process → binding to a port → Operation not permitted. The command was attempted with elevated execution as well; no config/script workaround was introduced. This is not evidence of a completed production build for the local patch.

The existing FAQ browser scenario now expects all seven approved questions, the Light/Ink palette and chevron, and checks 5/10/15, no automatic unlock, prayer-original collection direction, free signup and the unchanged participation disclaimer. Test cases remain18; checks were updated inside the existing scenario rather than deleting tests or relaxing selectors. Browser behavior/pixel geometry is not freshly verified until the suite can run.

After the final design patch, run lint, typecheck, unit, production build and the full browser suite against the final commit in an environment that permits local ports. Then do normal/incognito/mobile QA. Do not claim historical PASS for the final patch and do not activate persistence before privacy alignment approval.
