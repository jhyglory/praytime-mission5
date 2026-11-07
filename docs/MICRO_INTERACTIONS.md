# Mission 5 · Micro-interaction patch

> 현재 릴리스: 사용자가 누적된 로컬 보정을 마무리한 뒤 기존 랜딩 주소에 배포하도록 승인했습니다. 아래의 로컬-only·배포 보류 문구는 당시 작업 이력이며 이번 승인으로 종료됐습니다. 기존 feature 브랜치와 PR #1을 유지하고, 현재 범위와 검증 결과는 [FINAL_INTERACTION_RELEASE.md](FINAL_INTERACTION_RELEASE.md)를 따릅니다. merge·main·DNS·backend/env·실제 DB 작업은 이번 릴리스에 포함하지 않습니다.

## Latest Hero override · 2026-11-07

사용자가 hover 때 틈이 벌어져 보이는 반응 제거를 요청했다. Hero의2.5px 전체 이미지 pointer parallax와 전용 controller/CSS를 제거하고 고정 artwork로 유지한다. 유리와 빛은 하나의 PNG이며 개별 유리 바를 벌리는 코드는 없었다. 원본 이미지·crop·mask·정렬·CTA hover/focus는 보존한다. 아래 Hero 동작과 해당 검증 기록은 이전 구현 이력이다. 현재 통계는40% 노출 뒤500ms 대기/1400ms count/페이지당1회/빨간80·70% 장식이며 AGENTS.md와 README.md가 우선한다. 최신 로컬 요청으로 기존700ms보다200ms 일찍 시작하며, 이번 단계에서는 배포하지 않는다.

## Historical patch

기준: 배포된 `7c77356` / `feature/mission-5-landing` / 기존 PR #1. 이번 patch는 처음에 로컬 수정·검증만 승인됐으며, diff와 전체 검사 결과 보고 후 사용자가 2026-11-06 “재배포해”로 release를 승인했습니다. 기존 feature branch commit·push, PR #1 업데이트, 기존 Vercel 재배포를 진행합니다. merge, main 변경, DB INSERT, DNS 변경은 계속 금지입니다.

승인된 Figma1088 디자인·copy·8개 섹션·responsive geometry·shadcn Button/Accordion·Time Select·폼/API/privacy guard를 보존합니다. 기존 WHY NOW → THE GAP transition은 그대로 유지합니다. 새 dependency는 없습니다.

## 동작 / 파일

| 영역 | 파일 | 적용 |
| --- | --- | --- |
| Hero | `src/components/landing/hero-pointer-motion.tsx`, `hero-section.tsx` | 768px 이상·fine mouse·hover·no-preference 조건에서만 pointer 반대 방향 반응. 벡터 최대 2.5px, 240ms ease-out 복귀. 원본은 object/light가 합쳐진 raster이므로 분리·재생성 없이 더 엄격한 background 이동 한도 내에서 한 plane만 이동. 회전·확대·밝기 변경 없음 |
| Equal Choice | `src/components/landing/gap-section.tsx` | 사용자가 확정한 `#hero` / `#how-it-works` 링크. 기존 AnchorLink 재사용, 키보드 activation 시 목적지 heading focus |
| Navigation | `src/components/landing/active-section-nav.tsx`, `header.tsx` | 기존 3개 이름·anchor 유지. Header 높이를 반영한 중앙 band IO와 hysteresis. 일치하는 항목만 `aria-current=location`, opacity .65 → 1. Header absolute 위치 유지 |
| WHY NOW | `src/components/landing/why-now-count-up.tsx`, `why-now-section.tsx` | 기존 운영 StatMetric 기준3000ms cubic ease-out. 각 카드50% visibility/bottom-15% IO. 숫자34.3%/25.3%,7px 각진 bar: 첫100% 빨강·둘째70% 연보라, 회색 없음. 세션당 각 카드1회, reduced/no-JS 최종값 |
| CSS | `src/app/globals.css` 마지막 micro-interaction 블록 | 동등한 hover -2px, 화살표 바깥쪽 4px, active scale .995. 2px Lavender ring / offset3px. 기본 상태 geometry·surface 유지 |
| 테스트 | `tests/e2e/micro-interactions.spec.ts` | 원래13개 + 카드별 mobile 시작1개 추가. 기존18개를 유지하고 변경된 스타일/시간 기대값을 갱신(총32개) |
| 맥락 / 기록 | `AGENTS.md`, `README.md`, `docs/PRAYTIME_PRODUCT.md`, `docs/PRAYTIME_DESIGN.md`, `docs/MISSION5_LANDING.md`, 이 문서 | 이전 release와 현재 local-only patch의 권한 범위 구분 |
| QA evidence | `docs/evidence/micro-interactions/checks.json`, `geometry.json` | 이번 실행 결과와 8개 viewport의 geometry·오류·CLS 기록 |

## 접근성 / fallback

- 링크는 실제 anchor이며 두 선택 모두 동일한 accessible name/description 구조와 44px 이상 target을 가집니다. 이동을 위해 button 역할이나 Space 처리를 추가하지 않습니다. Enter는 native anchor activation을 따릅니다.
- Hero pointer motion은 reduced-motion, coarse pointer, mobile width에서 완전히 꺼집니다. preference 변경·leave·cancel·resize·blur·background·unmount 시 reset합니다.
- Equal Choice의 reduced-motion에서는 hover/pressed/arrow transform과 transition을 제거하고 focus ring을 유지합니다.
- 통계의 최종 수치는 SSR markup과 screen-reader 전용 span에 남습니다. 시각적 애니메이션 span은 aria-hidden이며 live count announcement를 하지 않습니다. JavaScript가 없어도 최종 수치·gauge가 보입니다.
- 통계 reduced-motion은 즉시 최종값을 표시합니다. background/offscreen 전환 중 이미 시작한 animation은 최종값으로 마무리합니다. sessionStorage 차단 시에는 mount당 1회로 fallback합니다.

## 성능

- pointer는 cached Hero document bounds + 단일 pending rAF로 CSS custom properties만 갱신합니다. frame당 React state나 layout read가 없습니다.
- Navigation은 scroll listener 없이 IO 경계 변화에만 active state를 갱신합니다. resize는 rAF로 제한하고 IO를 교체·disconnect합니다.
- 하나의 IO가 각 카드를 관찰하고 하나의 rAF가 활성 카드만 갱신합니다. 각 색 막대의 width는100%로 고정하고 transform scaleX만 변경합니다. 사용자 승인에 따라 각 막대의 최대값은 해당 수치34.3 /25.3이며, 공통100% 척도를 그리는 통계 그래프가 아닙니다. 회색 track은 투명하고 막대는 aria-hidden 장식으로 유지합니다. 숫자는 소수점 한 자리로 textContent만 갱신합니다.
- effect cleanup에서 observer, rAF, media/visibility/pointer/resize listener를 정리합니다. 상시 will-change, blur/filter/shadow/width/height animation을 추가하지 않았습니다.

## 검증

2026-11-06 최종 로컬 변경사항 기준으로 실행했습니다. 이전 배포의 PASS를 재사용하지 않았습니다.

| Command | 결과 |
| --- | --- |
| `npm run lint` | PASS, warning 0 |
| `npm run typecheck` | PASS |
| `npm run test` | PASS, 4 files / 40 tests |
| `npm run test:e2e` | PASS, 31 tests / 28.9s (기존18 + 신규13) |
| `npm run build -- --webpack` | PASS, static Landing + dynamic Route Handler |

8개 너비 모두 overflow·누락 asset·console/page/hydration error 없음. 폰트 로드 후 통계 동작 중 관찰한 CLS는 모두 0입니다. 1440px / 393px은 이전 visual release의 기록과 모든 section top/height/background 및 transition height가 정확히 일치합니다. Equal Choice의 링크 도입 전후 text/arrow 기본 geometry도 8개 너비 모두 일치합니다. 실제 mobile tap, keyboard/focus, reduced-motion, SSR/no-JS와 기존 transition/wheel/FAQ/form outcome 검증이 통과했습니다.

검증 중 발견한 reduced-motion hover selector 우선순위를 수정한 뒤 rebuild했습니다. 그 다음 실행의 첫 기존 테스트는 페이지 navigation 전에 Chrome context 생성에서 30초 timeout이 났으나 신규13개는 모두 통과했습니다. timeout·assertion·기존 테스트를 바꾸지 않고 전체 suite를 다시 실행해 31/31 통과했습니다. 경과는 `checks.json`에 구분해 기록했습니다.

필수: lint / typecheck / unit / browser / Webpack production build. 브라우저 QA는 persistence-disabled 로컬 production artifact에서 실행하고 외부 요청을 차단합니다. 폼의 success/duplicate/error는 mock transport이며 실제 INSERT 증거가 아닙니다.

Viewport: 1440 / 1280 / 1024 / 768 / 430 / 393 / 375 / 320. Runtime console/page error, hydration, overflow, assets, keyboard/focus, reduced-motion, 실제 mobile tap, SSR/no-JS, 통계 CLS를 확인합니다.

## 보존 범위 / release gate

원본 이미지·favicon·section background·typography·spacing·기존 transition 코드·FAQ copy·shadcn UI·Time Select·form/API/backend·package/lock/env는 변경하지 않습니다. 시각적 변화는 요청한 4개 micro-interaction에 한정합니다. Header는 Hero 안의 absolute navigation이므로 스크롤 중 화면에 계속 고정되지 않습니다.

로컬 검증을 마쳤으며 diff 검토 후 commit/push할 수 있는 상태입니다. 배포 전 검증 기준 HEAD는 `7c77356`이며 아래 diff는 그 위의 변경사항입니다. 사용자의 새 release 승인으로 commit/push·기존 PR #1 업데이트·Vercel 재배포 보류는 해제됐습니다. 기존 feature branch와 PR을 유지하고 직접 merge하지 않습니다. Production 저장 OFF와 privacy guard를 유지하며 실제 저장은 LEGAL REVIEW REQUIRED 상태입니다.


## Previous WHY NOW fill presentation · superseded

The user approved independent displayed maxima34.3 /25.3 and full-width decorative accents with no gray background. Exact numbers/source/accessible text remain intact; no shared statistical0–100 scale or progressbar semantics are introduced. The original750ms rAF and session-once behavior stay; session keyv2 gives existing visitors one first run of the updated presentation. Existing tests now check transparent tracks, full-width endpoints and stable layout width during scaleX growth, preserving monotonic numbers, once/reload, CLS, reduced-motion and no-JS coverage. Historical evidence JSON above remains unchanged.

Fresh validation for this fill update: lint PASS, typecheck PASS, unit40/40 PASS, browser31/31 PASS (57.0s), Webpack production build PASS. The existing6s transition, other micro-interactions and all form/API/privacy/package/assets paths are preserved.


## Current gauge reference · 2026-11-06

The user rejected the approximation and explicitly asked to copy the gauge/speed at https://praytime.glorifier.kr/. Both the rendered page and Lovable `src/components/site/StatMetric.tsx` at ref `660f70b4d2854d82e018618d00122ce875880e46` were inspected read-only. No original-site source, DNS or database was changed.

- Duration3000ms; easing `1-(1-p)^3`.
- Track has no background;7px high, square ends. First width100%, color#FF4438; second width70%, color#C4C0F0. Reference inner maximum420px is preserved for the bars (second cap294px).
- Each card starts when50% enters the viewport area with `rootMargin: 0px 0px -15% 0px`; mobile's second card waits for its own appearance.
- Retain Mission5 Ink numbers/typography, exact34.3%/25.3%, source/copy/card layout and existing6s transition. No reference FAQ or other product claims are copied.
- Preserve transform-based growth, one shared rAF, session-once per card, static accessible values and reduced/no-JS fallback. Hydrated unseen visuals start at0.0%/empty, while SSR/accessibility stays final. Version3 keys let existing visitors see the corrected animation once.
- The7px bar intentionally adds1px to the desktop stats row and2px to the stacked mobile pair versus the prior6px presentation. Historical geometry/QA records remain unchanged.

Fresh reference-correction checks: lint PASS, typecheck PASS, unit40/40 PASS, browser32/32 PASS (52.8s), Webpack production build PASS. The added mobile case verifies that the second card stays pending until seen. An initial test scroll-position calculation was corrected to use viewport height; application behavior was unchanged by that harness correction.
