# Final intro / SNS motion patch · 2026-11-06

This patch implements the user's explicit final specification on the existing Next.js App Router16.4.5 / React19.3.1 / TypeScript / Tailwind4 / shadcn project. It does not create another project or replace functioning forms.

## Design and choreography

- Layout: [Desktop1209:514](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-514) / [Mobile1209:1051](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-1051).
- Entrance references: [Desktop1265:8215](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-8215) / [Mobile1265:11339](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-11339). Fresh MCP layer/screenshot/motion data was inspected.
- The full layouts have two separate sections. The combined16s previews illustrate an intro and subsequent scene within a shared frame; the user's explicit independent-section requirement overrides that preview's scene crossfade/repeat. Only its intro entrance values are reused, retaining absolute timing and easing.
- CleanIntro is card-free: whole-word 그래서 enters150.4–649.6ms; actual Figma wordmark plus은 enters1350.4–1950.4ms. Its4s timeline plays once, holds the result and pauses offscreen/hidden. Logo assets are unmodified Figma exports of1265:8079 /1265:8103, not CSS/text reconstructions.
- The next SNS section contains only the approved declaration/supporting copy, fixed throughout the decorative stream. Each scene has its own overflow clipping and isolation. No automatic section advance, sticky lock or scroll hijacking.
- Desktop6columns / Mobile3columns retain source masonry, heights, spacing, low contrast, quiet central overlay and20source particles (16hearts/4shares). Existing12s source tracks remain recorded in card-intro-motion.json. Columns normalize the equivalent source velocity to a single linear0→−cycleHeight cycle, using the identical second tile for the seam. This avoids interpolating a1.2ms internal reset through other cards.
- Reduced motion retains the static card arrangement and readable copy, with no animations. No-JS preserves the complete readable introduction/declaration. Decorative scene remains aria-hidden with one accessible static description.
- Mobile WHY uses32px/48px and26px/44px, including320px; original copy/explicit breaks remain.
- GAP choices retain their actual links/copy/ARIA/hover/focus, while condition, light and CTA+arrow flex row share the panel center. Desktop action gap16px / Mobile12px. The removed instruction sentence remains absent.

## Photo pack and uniqueness

The supplied PrayTime_SNS_Photo_Pack_80.zip contains80 Photos JPEGs totaling23,890,874bytes. They are byte-identical to the existing80 public originals, so no second asset set is copied. Preview/docs in the ZIP are not used as images. [Audit evidence](evidence/final-intro/photo-pack.json) records ZIP hash and matching counts.

Each viewport's original cycle assigns all80 photos exactly once across all columns, including three distinct images within every collection. Data is deterministic in prototype-columns.json; no random render-time assignment. Repeated copies are separated by over4243px Desktop /4547px Mobile. Two tracks cover the entire scene at every normalized position, with minimum end clearance210px Desktop. Next Image preserves reserved crop boxes and lazy optimized delivery.

## Verification

- lint: PASS, zero warnings.
- typecheck: PASS.
- unit:47/47 PASS, including7new photo/hash/slot/cycle checks.
- browser:34/34 PASS, including the existing32regressions plus intro order/logo/leak and visible-photo uniqueness/continuity tests.
- The browser test checks every original reset phase ±2ms,12s/24s boundaries, repeated particles, actual real-time12s playback, fixed central copy, reduced/no-JS,8responsive widths, GAP centers and existing keyboard/CTA/wheel/form behavior.
- Webpack production build: PASS. Route Handler unchanged.
- [Local visual evidence](evidence/final-intro/local-browser.json): Desktop1440, Mobile393 and320; runtime/HTTP errors0, overflow0, intro SNS layer count0, POST0. Reduced-motion static columns6/3, animation count0.
- Source screenshots,0/650/2000ms intro states,0/6000/11999ms streams, GAP and narrow-mobile views were inspected. The source logo export has the editor's rasterization; no newly designed logo/asset.
- All browser/visual QA uses disabled/mock persistence. No backend/env/schema/RLS, real INSERT, Figma edit, new dependency, main/merge or DNS change.

## Run

From the repository root: npm ci, copy config/environment.example to .env.local for a fresh setup, then npm run dev. Local URL is http://127.0.0.1:3000. Default local/Preview persistence is disabled; the existing approved Production adapter remains unchanged. Full checks: npm run lint; npm run typecheck; npm run test; npm run build -- --webpack; npm run test:e2e.
