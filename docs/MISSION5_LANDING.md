# Mission5 implementation and quality

## Composition

src/app/page.tsx composes Header/Hero → Question → WHY NOW → independent intro → SNS → GAP → Time Select → Prayer → FAQ → Beta Signup → Footer. Sections live in src/components/landing. Shared Button and Accordion live in src/components/ui and are actually rendered, using Radix/Slot/CVA with PrayTime styling.

Tailwind utilities own migrated static layouts and responsive rules; theme/breakpoints live in globals.css. Legacy contextual rules and complex animated artwork remain custom CSS. Do not change DOM/ARIA IDs, semantic headings, copy, anchors, data selectors or motion clocks while migrating styles.

## Acceptance

- Current approved Desktop/Mobile appearance, original assets, all80 photo assignments and exact A copy stay intact.
- Navigation and Hero CTA retain anchors; GAP choices target #hero / #how-it-works. Header has no signup CTA.
- FAQ supports keyboard/focus, accurate expanded states and independent toggles. Wheel supports tap/swipe/keyboard.
- Form retains all8 groups, exact options, validation, loading/error/duplicate/success state, required consent and Privacy URL. Success alert only after server201 + status=success + receipt=true.
- Existing production backend stays unchanged. Local/Preview tests force disabled persistence or mock receipts; no real DB activity.
- Metadata, favicon, OG asset and current indexing configuration are outside this styling task. Review indexing separately before a wider launch.

## Checks

npm run lint; npm run typecheck; npm run test; npm run build -- --webpack; npm run test:e2e.

Browser tests launch a separate production build with persistence disabled. If port3000 is occupied, use an ignored temporary Playwright config on another free port; do not reuse a live-enabled server or kill unrelated services. Compare baseline and refactored screens at1440/393/360 and responsive boundaries, plus actual normal-motion interactions and reduced motion. Report failures honestly and preserve tests' product assertions.

## Submission

Keep existing feature/mission-5-landing and PR #1 ([정하영]-미션5). The user approved committing/pushing the verified refactor on2026-11-09. Update the existing branch, allowing its existing PR and Vercel Git integration to reflect the push; do not create a new PR or initiate a separate manual deployment. Do not merge; mentor reviews/merges according to the course workflow.

## History

Historical reports and pre-refactor instruction documents are in archive/history-before-tailwind-2026-11-09.tar.gz. Their evidence paths resolve from the repository root after extraction. docs/evidence and privacy/design/license source files are preserved, including files used by automated tests.
