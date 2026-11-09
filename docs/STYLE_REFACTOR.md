# Tailwind / documentation refactor · 2026-11-09

## Scope and GitHub publication approval

Local changes on feature/mission-5-landing, based on6318f53. User requested the approved design and behavior remain intact. The initial local-only phase is complete. On2026-11-09 the user approved committing/pushing the verified changes to the existing branch, which updates its existing PR and may trigger the existing Vercel Git integration. No separate manual deployment, merge, API/backend/env/DB operation is requested.

## Styling changes

- globals.css now exposes named paper/navy/ink/signal colors, contextual shadcn background/foreground/surface/border/primary/ring tokens, action/control radii and the original motion easing through Tailwind v4 theme.
- Actual rendered section, grid, statistic, form and shared UI classes use flex/grid/gap/padding/type/color utilities with mobile-first md/lg variants. md=768px and lg=1200px preserve the original section breakpoints. The custom container utility separately retains the original768/1024/1280px container caps.
- Removed duplicated CSS declarations for56 shared/section classes, plus Button, native input and FAQ primitives. Existing semantic class hooks remain for controllers and tests. Standard layout values use the spacing scale; exact design measurements keep explicit arbitrary values.
- shadcn Button still uses Slot/CVA; Accordion still uses Radix and the approved chevron. Result-panel utilities cover success/duplicate/failure states, not just the default form.
- Base resets and shared container rules use appropriate Tailwind layers so they no longer silently override utilities.
- Complex SVG/motion/artwork masking, stateful selectors and remaining contextual typography rules stay custom CSS. This is not a blanket conversion of every CSS rule. No animation controller/JSON/timing, image, dependency, field contract, validation, handler, consent or API changed.

## Documentation

44 root docs →8 current documents (including this report). Historical Markdown documents plus the previous AGENTS/README are retained in archive/history-before-tailwind-2026-11-09.tar.gz (about140KiB). Current AGENTS, README, product, design and mission guidance replace the accumulated contradictory task history. Backend/activation/privacy/migration documentation remains accessible; pre-activation restrictions are labeled historical. Evidence, source assets, licenses and privacy snapshots used by tests are intact.

To inspect old reports without replacing current docs, extract the archive into a separate temporary directory. Paths inside the archive retain their original repository-relative names.

## Verification

- Captured the pre-refactor page and compared the refactor at320/360/393/768/1024/1200/1440px with reduced motion.458 sampled DOM elements per width had identical rectangles and computed styles (excluding animation/transition properties); horizontal overflow0. SVG interiors and SNS artwork internals were excluded from this static comparison. This is not a claim of pixel-by-pixel equality or a motion test.
- Inspected actual full-page Desktop1440 and Mobile393 screenshots. Baseline/after captures and the detailed comparison are outside the app repository in ../tailwind-refactor/.
- Added an independent pre-refactor responsive fixture and browser regression. Button unit tests now assert class membership rather than the entire class string/order; native semantics assertions remain. Form transport tests additionally check the original result-panel presentation.
- Final full browser suite: **68/68 passed in5.3min**, including the new7-width baseline regression and result-panel style checks. Lint, typecheck, unit60/60 and Webpack build passed. The first collection attempt needed the standard JSON import attribute; a partial run was then stopped to restore the dynamic result-panel utility classes before the final clean68-test run.
- Browser tests use a separate production server on3102 with persistence disabled and empty Supabase credentials. The final rebuild produces byte-identical production CSS to the68-test build. Production writes are never used for style verification. The temporary3102 test config is removed after testing; the normal Playwright config remains unchanged.

No physical-device/Safari/FPS or Lighthouse claim is made. Metadata/indexing and deployment settings remain unchanged by the application patch; indexing should be reviewed separately for formal public launch.

Local review: http://127.0.0.1:3102/ (production build, persistence explicitly disabled). Start a new local server with the disabled environment from the test config if this process is stopped.
