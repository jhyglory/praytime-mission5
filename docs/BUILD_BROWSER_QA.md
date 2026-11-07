# Local production build / browser QA · 2026-11-06

Pre-final visual-stage diagnosis and checks. The port diagnosis remains relevant; current1088 visual implementation and strengthened browser results are recorded in [FINAL_VISUAL_PATCH.md](FINAL_VISUAL_PATCH.md).

Scope: the current uncommitted section extraction, seven-item Light FAQ and actual shadcn/ui Accordion/Button implementation. Branch `feature/mission-5-landing`, HEAD `529bdd8094ac45c8c20dd9ef04ee9a486500c70d`. Results apply to the working tree, not to a new commit or deployment.

## Port diagnosis

| Execution | Observed result |
| --- | --- |
| Default sandbox: temporary Node listener on 127.0.0.1:0 | EPERM |
| Approved execution outside the default sandbox: temporary IPv4 and IPv6 loopback listeners | PASS; opened and closed successfully |
| Approved `npm run build` (default Turbopack) | FAIL at the internal CSS/PostCSS worker port binding, EPERM |
| Approved `npm run build -- --webpack` | PASS, optimized production build |
| Approved `npm run test:e2e` using that build | PASS,18/18 in19.9s |

The panic chain is Inter CSS module → PostCssTransformedAsset → evaluate_webpack_loader → creating new process → binding to a port → `Operation not permitted (os error 1)`. The generated Turbopack worker uses loopback IPC. This is distinct from the application's HTTP port3000; no EADDRINUSE was observed, and port3000 was free before the tests. The evidence points to a restriction affecting Turbopack's internal worker/IPC path, but does not identify the exact enforcing sandbox/OS layer. A permanent bundler switch or an application-code defect is not inferred from this error alone.

[Next.js officially supports choosing Webpack](https://nextjs.org/docs/app/api-reference/turbopack#using-webpack-instead) with `next build --webpack`. It was selected for this one execution only. No change to package.json scripts, Next config, Vercel configuration or dependencies was made in this QA stage. The completed build compiles the app, passes TypeScript, generates four pages and exposes static `/` / `/_not-found` plus dynamic `/api/beta-signup`.

## Latest results

| Check | Result |
| --- | --- |
| `npm run lint` | PASS, zero warnings |
| `npm run typecheck` | PASS |
| `npm test` | PASS,40/40 across four files; original35 retained |
| `npm run build` | FAIL, Turbopack internal worker EPERM as above |
| `npm run build -- --webpack` | PASS, optimized production build |
| `npm run test:e2e` | PASS,18/18 on that production build |

The browser suite starts `next start` with installed Google Chrome in an isolated context. It does not use the development server. Node emits a terminal-only NO_COLOR/FORCE_COLOR conflict warning; the application console/page-error checks pass.

## Executed interaction checks

- FAQ: seven approved questions, first open, independent toggles, Enter/Space, ArrowUp/ArrowDown, Home/End, explicit ARIA targets, visible3px keyboard focus outline, Light background / Ink heading / approved chevron.
- CTA: primary beta anchors and secondary how-it-works anchor retain native link semantics; keyboard activation focuses the destination heading. Header and Hero beta CTA are both exercised; prayer navigation is also checked.
- Form: consent controls initial submit availability; missing required fields focus the first error. A valid local request reaches the disabled Route Handler and returns503 without success, retains input and re-enables retry.
- Mocked transport:201 with receipt permits success and one conversion event;409 shows the duplicate state;502 shows the server failure;201 without receipt does not produce success. While the response is held, the real submit Button is disabled with submitting data-state and aria-busy=true. A deterministic response gate replaces a fixed sleep to keep this assertion reliable.
- Responsive/quality:1440/1280/1024/768/430/393/375/320px; no horizontal overflow or missing assets, one H1, eight sections/groups, valid heading order/labels/ARIA targets, no duplicate IDs, reduced-motion navigation and skip link, and the time wheel's tap/keyboard/swipe behavior.

Browser test count remains18. This QA stage strengthens existing assertions in `tests/e2e/landing.spec.ts`; it does not change application UI, CSS, copy, form logic, API or persistence. No final Figma pixel pass is claimed.

## Persistence / release boundaries

Playwright forces `BETA_SIGNUP_PERSISTENCE=disabled`, clears all Supabase connection variables in the server and aborts external HTTP from the page. Success/duplicate/provider outcomes are intercepted HTTP responses, not live storage evidence. No production INSERT or existing applicant read/update/delete was performed.

WHY NOW → THE GAP remains **PENDING DESIGN** with the current static transition. No motion implementation or dependency was added. No commit, push, PR mutation, merge or deployment was performed. The current production release is preserved. Rerun all quality checks after the final visual patch; the default Turbopack build remains environment-blocked here.
