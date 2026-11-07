# shadcn/ui · actual local adoption

Stage record for the shadcn adoption before the final1088 visual patch. The adopted Accordion/Button remain in use. Current visual CSS, transition and latest evidence are in [FINAL_VISUAL_PATCH.md](FINAL_VISUAL_PATCH.md); old pending-design and byte-identical-style statements below describe the earlier adoption stage only.

Status: implemented locally, uncommitted / unpushed / undeployed. Existing feature/mission-5-landing, PR #1 and production are preserved. The previous section extraction and seven-item FAQ changes remain in the working tree. No DB or Figma actions.

## Source and installation

- [Official Radix Button documentation](https://ui.shadcn.com/docs/components/radix/button)
- [Official new-york Button registry source](https://ui.shadcn.com/r/styles/new-york/button.json)
- [Official Radix Accordion documentation](https://ui.shadcn.com/docs/components/radix/accordion) and [new-york Accordion registry source](https://ui.shadcn.com/r/styles/new-york/accordion.json)
- [Radix Accordion keyboard / multiple / forceMount API](https://www.radix-ui.com/primitives/docs/components/accordion)
- [Manual installation](https://ui.shadcn.com/docs/installation/manual) and [components.json](https://ui.shadcn.com/docs/components-json)
- [Upstream MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md), retained locally in licenses/shadcn-ui-LICENSE.md

Official shadcn/ui Radix Button and Accordion sources are manually adopted and customized in src/components/ui/button.tsx and accordion.tsx. This is source-based adoption, not a claim that shadcn CLI init/add generated the files. The project's React19 Button forwards ref through props and preserves CVA / cn / Radix Slot / asChild composition. Accordion uses the actual Radix Root, Item, Header, Trigger and Content, with the registry's wrapper pattern. Default shadcn theme/animations/lucide icon are replaced by existing PrayTime CSS and the approved Figma chevron. Components are imported and rendered in the Landing, not left unused.

Direct runtime dependencies: class-variance-authority0.7.1, @radix-ui/react-slot1.5.0 and @radix-ui/react-accordion1.3.1. Their required Radix dependencies are in the lockfile. Existing cn (clsx + tailwind-merge), Tailwind4 and aliases are reused. Installation used npm --ignore-scripts. components.json declares new-york / RSC / TSX / Tailwind4 (empty config path) and current CSS/aliases. The shadcn CLI package is not a runtime dependency. No Card, Dialog, full Form framework, stock icon package or motion package is introduced.

## Actual UI usage

| Place | Runtime behavior |
| --- | --- |
| FAQ | FaqSection imports Accordion / AccordionItem / AccordionTrigger / AccordionContent; controlled type=multiple, seven exact answers and first item open |
| Header beta CTA | Button asChild + AnchorLink → one native a, same href and pt-button classes |
| Hero beta / how-it-works CTAs | Same Slot composition; primary and secondary variants preserve the two existing class strings |
| Beta signup submit | Native Button with type=submit and existing disabled condition. One state prop reflects the existing submitting status; labels, validation, handler and receipt logic stay intact |

Button separates appearance (variant=primary/secondary) from interaction state (state=default/disabled/submitting). Explicit disabled/submitting and the existing disabled prop all enforce native disabled; an explicit default state cannot re-enable a disabled button. Submitting alone sets aria-busy=true. State marker classes/data-state do not replace the existing Signal Red/Navy/radius/typography/hover/focus/disabled CSS. asChild anchors keep their link semantics; disabled/state props are native-button-only in the type contract.

FAQ retains class names and h3 → button / region topology, Light background, Ink text, 24px Figma chevron and the existing rotation/focus CSS. Radix supplies toggling and Enter/Space/arrow/Home/End keyboard behavior. Explicit faq-question-N / faq-answer-N IDs and matching aria-controls/aria-labelledby override generated IDs. forceMount + controlled hidden preserves all answer DOM targets and keeps closed answers hidden. SSR verifies this structure; the latest production-browser run also passes the actual keyboard and visible focus checks.

AnchorLink's type now accepts React19 refs via ComponentPropsWithRef; its click handler, defaultPrevented/modifier handling, keyboard heading focus, history and scroll logic are unchanged. No wrapper DOM or nested button/link is added. data-slot=button identifies the adopted component.

src/app/globals.css, Header, Hero and AnchorLink are byte-identical to the snapshot before this Accordion/state patch. The seven-item FAQ copy array is also byte-identical. beta-signup-form.tsx differs only by state={status === "submitting" ? "submitting" : undefined} on its existing Button. Approved styling, form validation/consent/submit logic and native selection controls remain. API, backend, DB and persistence gate are unchanged.

## Checks

Current Accordion/state patch files: src/components/ui/accordion.tsx (new), src/components/ui/button.tsx, src/components/landing/faq-section.tsx, src/components/landing/beta-signup-form.tsx (one prop), package.json/package-lock.json, tests/accordion.test.ts (new), tests/button.test.ts, tests/e2e/landing.spec.ts. README, AGENTS and product/design submission context documents are updated to describe the real usage. components.json / Hero / Header / AnchorLink from the previous Button step are retained unchanged in this step.

- npm run lint: PASS, zero warnings.
- npm run typecheck: PASS.
- npm test: PASS,40/40 across four files: all original35 plus four Button state/link cases and one actual FAQ Accordion integration case. No original test was removed.
- The component cases render the actual components with react-dom/server: native disabled/submitting behavior and busy state, one native anchor for both appearance variants, seven Radix-backed FAQ headers/regions, explicit ARIA ID targets, first-open/closed-answer visibility, unchanged FAQ principles and chevron path. No DOM-test dependency was added.
- Vitest's @ alias now matches the existing TypeScript alias so the real components and cn are tested.
- git diff --check: PASS. Static comparison confirms unchanged CSS/CTA handlers/copy and the single form state prop difference.
- npm run build (default Turbopack): FAIL / environment-limited, including the approved execution outside the default sandbox. Its Inter CSS/PostCSS worker fails at creating new process → binding to a port → EPERM. Normal approved IPv4/IPv6 loopback probes pass; the exact restriction layer remains unconfirmed.
- npm run build -- --webpack: PASS on the current local implementation, using Next.js's official one-off bundler option. Optimized production compilation, TypeScript and static-page generation complete. package.json / next.config.ts / Vercel settings are unchanged; default Turbopack is not reported as passing.
- npm run test:e2e: PASS,18/18 against that Webpack production build, using next start and isolated Chrome. Includes seven FAQ items / Enter / Space / ArrowUp / ArrowDown / Home / End / visible focus, Header and Hero beta CTA keyboard heading focus, loading disabled / aria-busy / data-state, form validation, actual disabled local API503, mocked success / duplicate / no receipt / provider failure, and eight responsive widths. Existing18 scenarios are preserved; relevant assertions are strengthened.

These are fresh checks of the uncommitted local patch, not a relabeling of historical PASS evidence. The browser console/page-error, missing asset, ARIA-target and overflow checks pass. A complete pixel comparison against the pending final Figma polish is not claimed. The full suite and production build must run again after that final design patch. Detailed diagnosis and scope: BUILD_BROWSER_QA.md. Persistence remains disabled and success/duplicate outcomes are mocked, not live INSERT evidence.

## Pending scope

WHY NOW → THE GAP remains **PENDING DESIGN** with the current static transition. No placeholder, sticky animation, motion package, asset or other visual patch was added. Production persistence remains blocked until privacy alignment. Do not commit, push or deploy this local work before the user's next instruction.
