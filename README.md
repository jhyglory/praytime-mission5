# PrayTime · Mission 5

## 실제 접수 활성화 승인 · 2026-11-06

사용자가 실제 저장을 요청했고, 수집 항목 정정안 게시를 승인했다. 기존 Privacy URL에 정정안을 게시한 뒤 HTTP 200 및 본문을 확인했다. 새 snapshot/version과 `PRIVACY_COLLECTION_APPROVED=true`를 사용한다. Production에서 기존 Supabase 연결과 `BETA_SIGNUP_PERSISTENCE=supabase`를 설정하는 release를 진행한다. Preview·자동 테스트·기본 로컬 설정은 disabled다. 기존 beta_signups/UNIQUE(email)/INSERT 전용 RLS를 유지하며, 새 DB·migration·공개 SELECT/UPDATE/DELETE·service-role key는 없다. 사용자가 승인한 QA 신청 1건만 생성·검증하고 기존 신청자 행은 조회·수정하지 않는다. merge·main 변경·DNS 전환은 계속 금지다. 아래 이전 저장 OFF/법률 문구 작성 금지 기록은 이 승인 이전의 이력이다. 실제 배포/QA 결과는 docs/BACKEND_ACTIVATION.md에 기록한다.

PrayTime은 무심코 SNS·숏폼 앱을 여는 순간 잠깐 멈추고 기도한 뒤, 지금 필요한 사용인지 다시 선택하도록 돕는 기독교 기반 디지털 웰니스 서비스입니다. 앱 삭제·시간 제한을 시도해도 반복되는 자동 사용 습관에 개입합니다.

핵심 흐름은 **PAUSE → PRAY → CHOOSE → USE → RETURN**입니다. 기도 완료가 SNS 자동 해제를 뜻하지 않습니다. 돌아가거나, 필요하면 **5 / 10 / 15분**을 정해 사용합니다. 시간이 끝나면 다시 제한되고 추가 사용에는 Prayer / Choice가 필요합니다. 이 프로젝트는 제품 자체의 OS 차단 기능이 아닌 소개·베타 신청 Landing입니다.

최신 기준: [Desktop1209:514](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-514) · [Mobile1209:1051](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-1051) · [Desktop entrance](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-8215) · [Mobile entrance](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-11339). 다른 섹션의 기존 구현 기준과 명시적인 CTA/파비콘 수정은 유지합니다.

## 현재 단계

현재 최신 수정은 full Desktop1209:514 / Mobile1209:1051과 intro previews1265:8215 /1265:11339에 대한 최종 명세를 반영합니다. 실제 Figma 로고로 “그래서 → 로고와 은”이 순차 등장하고, 다음 독립 섹션은 화면을 가득 채우며 카드 열이12초 주기로 위·아래 번갈아 이동합니다. 카드 없는 인트로와 선언 화면을 독립 구간으로 분리하고, 원본 사진80개·Desktop6열/Mobile3열·12초 카드 스트림을 적용했습니다. 나머지 랜딩·shadcn·폼 동작은 유지합니다. Production은 승인된 기존 Supabase 접수를 사용하고 Preview·테스트·기본 로컬은 disabled입니다. 기존 feature branch / PR #1 / Vercel을 유지하며 merge·새 DB·DNS 전환은 하지 않습니다. [최신 변경과 검증](docs/FULLSCREEN_SNS_PATCH.md), [접수 활성화 이력](docs/BACKEND_ACTIVATION.md).

- Repository: [jhyglory/praytime-mission5](https://github.com/jhyglory/praytime-mission5) (private)
- 작업 branch: `feature/mission-5-landing`
- 최종 PR 제목: `[하영]-미션5`
- Vercel URL: [praytime-mission5.vercel.app](https://praytime-mission5.vercel.app)
- PR: [[하영]-미션5 #1](https://github.com/jhyglory/praytime-mission5/pull/1), merge하지 않음

## Tech Stack

| 기술 | 현재 사용 |
| --- | --- |
| Next.js App Router | 16.4.5, Server Components / Route Handler |
| TypeScript | schema·HTTP·adapter 경계 타입 |
| React | 19.3.1, 클라이언트 interaction |
| Tailwind CSS | 4.3.4, CSS 토큰·반응형 스타일 |
| shadcn/ui | 공식 Radix Accordion·Button registry 소스 수동 도입·Figma 스타일 적용. Accordion1.3.1 / Slot1.5.0 / CVA0.7.1, FAQ·Hero/Header CTA·신청 submit에서 실제 사용 |
| Supabase | supabase-js 2.119.0, 기존 Lovable 저장소 재사용 |
| Quality | ESLint, Vitest, Playwright (Google Chrome) |

shadcn/ui는 컴포넌트 소스를 프로젝트에서 소유하는 방식으로 적용했습니다. `components.json`에 Tailwind4 / RSC / alias를 설정하고 Button의 CVA·Radix Slot 및 FAQ의 Radix Accordion을 실제 사용합니다. 승인된 CSS·chevron을 그대로 연결해 색·크기·focus·disabled 스타일을 유지합니다. Button은 Primary/Secondary 외형과 Disabled/Submitting 상태를 구분합니다. native SelectionControl·폼 validation·API는 보존하며 Card/Dialog/Form 전체 도입이나 theme reset·motion dependency는 추가하지 않았습니다. [도입 근거와 검증](docs/SHADCN_ADOPTION.md).

## 설치 / 로컬 실행

프로젝트 루트는 이 README와 `package.json`이 있는 디렉터리입니다. Node.js **24.x**, npm 11로 검증했습니다.

```sh
npm ci
cp config/environment.example .env.local
npm run dev
```

로컬: http://127.0.0.1:3000 . 기본 persistence는 `disabled`이며 유효한 신청도 503으로 실패합니다. 가짜 성공은 표시하지 않습니다. 기존 로컬 연결 파일도 이번 단계에서는 disabled로 전환했습니다.

```sh
npm run lint
npm run typecheck
npm run test
npm run build -- --webpack
npm run test:e2e
npm run start
```

브라우저 테스트는 설치된 Google Chrome을 사용합니다. production build 후 실행하며 3000번 포트의 기존 서버를 종료해야 합니다. 기존 서버를 재사용하지 않고 persistence를 강제로 disabled합니다. fetch mock과 UI response interception은 실제 저장 증거와 구분합니다.

현재 Codex 실행 환경에서는 기본 Turbopack의 PostCSS 내부 worker 포트 연결이 `EPERM`으로 실패한 이력이 있습니다. 이 환경에서는 Next.js 공식 일회성 옵션 `npm run build -- --webpack`으로 production build한 뒤 `npm run test:e2e`를 실행합니다. 기본 build script와 Vercel 설정은 변경하지 않았습니다. 최종 visual patch 이전 기준선은 lint / typecheck / unit40 / Webpack build / browser18 모두 PASS였으며 [BUILD_BROWSER_QA.md](docs/BUILD_BROWSER_QA.md)는 그 이전 단계의 기록입니다. 최신 프로토타입 정정 결과는 [PROTOTYPE_CORRECTION.md](docs/PROTOTYPE_CORRECTION.md)를 확인하세요.

## 환경변수

값은 `.env.local` 또는 Vercel 환경변수 설정에만 넣으세요. 모든 `.env*`는 Git에서 제외됩니다. 안전한 이름 템플릿은 `config/environment.example`입니다.

| 이름 | 용도 |
| --- | --- |
| `BETA_SIGNUP_PERSISTENCE` | 기본 `disabled`. 실제 저장 승인 시에만 `supabase` |
| `SUPABASE_URL` | 기존 프로젝트의 HTTPS endpoint |
| `SUPABASE_PUBLISHABLE_KEY` | 기존 public INSERT용 publishable key |
| `SUPABASE_ANON_KEY` | legacy anon JWT가 필요한 경우만 fallback, 보통 비움 |
| `SITE_URL` | 최종 배포 origin override. Vercel은 자동 VERCEL_PROJECT_PRODUCTION_URL fallback, 로컬은 비움 |

`NEXT_PUBLIC_` Supabase 변수와 secret/service-role key를 사용하지 않습니다. key 값은 문서에 포함하지 않습니다. 원본 Lovable의 `VITE_SUPABASE_*`는 운영 원본의 변수이며 이 Next.js 앱의 변수 이름이 아닙니다.

## Figma Source

파일 `J8iLsfruyMwVCakXsSJPq4`:

- [Final Desktop 1088:916](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-916)
- [Final Mobile 1088:1251](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-1251)
- [Final Desktop THE GAP 1088:986](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-986)
- [Mobile THE GAP 1088:1319](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=1088-1319), 최종 Mobile의 하위 섹션

각 viewport는 해당 최종1088 화면을 따릅니다. 이전933/913 Landing과 Handoff `933:5`는 과거 참고 자료입니다. 모든 Light Section은 **Soft Paper #F5F2F7**, FAQ는 **Light + 최종 7개**, Time Select는 Light, Voluntary Prayer는 Dark입니다. THE GAP의 두 선택은 동등하게 유지합니다. Figma export에 남아 있는 floor reflection·주변 bloom·horizontal glow는 사용자의 명시적 제거 지시에 따라 제외하고 Vertical Slit에서만 빛이 나도록 처리합니다. Figma 파일과 승인된 branding / UX는 변경하지 않습니다.

## 구현한 Interaction / Responsive

8개 섹션: HERO → ONE QUESTION → WHY NOW → THE GAP → TIME SELECT → PRAYER BEFORE CHOICE → FAQ → BETA SIGNUP.

- CTA / 메뉴 anchor, 키보드 사용 시 목적지 heading focus
- Hero: Desktop/fine pointer에서 원본 raster 전체를 최대 2.5px 이동, leave 시 복귀. Mobile/coarse/reduced-motion에서는 정적
- THE GAP: 두 선택지를 동일한 hover/pressed/focus 규칙으로 처리. 돌아가기 → Hero, 시간 선택 → Time Select
- 메뉴: 중앙 viewport의 섹션을 IntersectionObserver로 감지, opacity·aria-current만 갱신. Header의 기존 absolute 위치 유지
- WHY NOW: 기존 운영 페이지의 실제 StatMetric을 기준으로3000ms cubic ease-out, 회색 track 없는7px 각진 막대, 첫100% 빨강 /둘째70% 연보라를 적용합니다. 각 카드가 보일 때 개별 시작하며 세션당1회 실행합니다. 정확한34.3% /25.3%와 Ink typography·SSR/no-JS/reduced-motion 최종값은 유지합니다.
- WHY NOW → THE GAP: 별도의 카드 없는 “그래서 → 실제 Figma 로고와 은” 순차 등장 후 다음 구간의 고정 선언 문구와12초 연속 카드 스트림. Desktop6열/Mobile3열과20개 하트·공유 장식에 원본 timing/opacity 적용. Native WAAPI, offscreen/background pause, reduced-motion/no-JS 읽기 fallback. [최종 사양](docs/FINAL_SNS_PATCH.md).
- shadcn Accordion FAQ 7개 독립 토글, 첫 항목만 기본 펼침, Enter / Space / 화살표 / Home / End; Light 배경·Ink text·승인 chevron
- 최종 TIME SELECT 프리뷰: 5 / 10 / 15분 중 10분 selected. 원본 mockup 재사용, swipe·중앙 snap·tap·키보드 선택 지원. Hero 앱 테마 toggle은 최종 Figma에 없어 노출하지 않습니다.
- 8개 폼 그룹, client·server validation, 최초 오류 focus
- loading / success / duplicate / server error, 입력 유지, 중복 전송 차단
- 실제 HTTP 201 + receipt 이후에만 success와 전환 이벤트
- reduced motion, live result announcement, native form controls

1440 / 1280 / 1024 / 768 / 430 / 393 / 375 / 320px에서 overflow·asset·구조를 검증합니다. 최신 프로토타입 검증은 PROTOTYPE_CORRECTION.md, 이전 visual/micro-interaction 기록은 FINAL_VISUAL_PATCH.md / MICRO_INTERACTIONS.md를 확인하세요.

## Backend 구조

`BetaSignupForm → POST /api/beta-signup → validation + server consent metadata → SignupStore → Supabase public.beta_signups`.

기존 Lovable 프로젝트와 동일한 저장소를 사용합니다. `beta_signups_email_key UNIQUE(email)`와 INSERT용 RLS를 유지합니다. `.insert()`만 사용하고 `.select()` / upsert / UPDATE / DELETE는 하지 않습니다. `23505`는 409 duplicate, provider 실패는 502, 연결 미설정은 503입니다.

기존 승인 작업에서 nullable 동의 컬럼 3개 추가와 QA 신청 1건 검증이 이미 완료되었습니다. **이번 단계에서는 DB 변경·실제 INSERT를 하지 않았습니다. 배포 후 가상 QA payload의 HTTP POST는 저장 차단503과 validation422만 검증했습니다.** 재검토 SQL 초안은 active migration 폴더 밖에 두었습니다. 고지와 수집 항목의 불일치는 아직 승인 보완이 필요합니다.

상세: [Backend architecture](docs/BACKEND_ARCHITECTURE.md), [Privacy audit](docs/PRIVACY_AUDIT.md), [Migration runbook](docs/CONSENT_MIGRATION_RUNBOOK.md).

## 구조 / Project Context

```text
AGENTS.md                     다음 개발 에이전트 진입점
docs/PRAYTIME_PRODUCT.md       제품 정의
docs/PRAYTIME_DESIGN.md        승인 브랜드·디자인 가드레일
docs/MISSION5_LANDING.md       섹션·interaction·미션 기준
src/app/                      section 조립 page, layout, API
src/components/landing/       역할별 section 파일 / header / footer / form interaction
src/components/ui/            shadcn/ui Accordion·Button / native selection control
components.json               shadcn/ui / Tailwind4 / RSC / alias 설정
src/lib/                      schema, mapping, consent, store, metadata
public/assets/, public/fonts/ 승인 Figma 에셋·로컬 폰트
supabase/migrations/           과거 적용 이력
supabase/drafts/               실행하지 않은 검토용 SQL
tests/                        단위·브라우저 테스트
config/environment.example    값이 없는 환경 템플릿
```

## 배포

Vercel에서 GitHub repo를 import하고 Framework **Next.js**, Root Directory **.**, Install Command `npm ci`, Build Command `npm run build`, Node **24.x**를 사용합니다. Preview는 `BETA_SIGNUP_PERSISTENCE=disabled`로 유지하세요. Production은 승인된 기존 Supabase 연결을 서버 환경에 등록하고 persistence=supabase로 설정합니다. Preview는 disabled를 유지합니다. SITE_URL은 실제 배포 origin으로 설정합니다. env 변경 후 재배포가 필요합니다. 상세 [배포 체크리스트](VERCEL_DEPLOYMENT_CHECKLIST.md).

Vercel `glorifier1/praytime-mission5`에 배포했습니다. Production source는 `feature/mission-5-landing`이며 mentor merge 후 `main`으로 전환할 수 있습니다. Production의 기존 Supabase 서버 환경변수는 유지하고 Preview는 disabled입니다. 운영 검증은 [최종 상태](docs/FINAL_DELIVERY.md)와 [HTTP 증거](docs/evidence/production-blocked-http-qa.json), [브라우저 증거](docs/evidence/production-browser-qa.json)에 기록했습니다.

## Known limitations

- 최종 Figma에 없는 제품 기능이나 site-wide theme toggle은 추가하지 않았습니다.
- 개인정보 고지는 사용자 승인 정정본 게시·접수 활성화가 완료됐습니다. 이전 불일치 감사와 실제 검증 이력은 BACKEND_ACTIVATION.md에 보존합니다.
- OG/Twitter 공유 이미지는 사용자가 지정한 「기도의 문, PrayTime」 원본 PNG(1711×919)를 사용합니다. 버전 경로는 `/og/praytime-share-8b6783f5.png`이며 Landing Hero와 별개입니다. favicon은 배경 없이 기존 Signal Red Pause Mark만 남긴 투명 SVG·16/32/48px ICO와180px Apple Touch icon을 사용합니다.
- `SITE_URL` 미설정 시 Vercel system production URL을 metadata origin으로 사용합니다. 검색 indexing은 기존 noindex 유지, 공개 시 검토 필요.
- 베타 신청 API의 기본 로컬·Preview 설정은 disabled입니다. 승인된 Production은 실제 Supabase 접수를 사용하며 일반 자동 테스트는 항상 mock / disabled입니다.
- OS 접근 제한·기도 실행 등 제품 기능은 Landing의 설명·프리뷰입니다.
- 자동 a11y 검증이 screen reader 전체 사용성·최종 색상 contrast 감사를 대체하지 않습니다.
- 최신 프로토타입 카드 모션은 PROTOTYPE_CORRECTION.md가 우선합니다. 이번 visual patch에서 backend/env와 운영 데이터는 변경하지 않았습니다. merge는 멘토 리뷰 전까지 하지 않습니다.
- 커스텀 도메인의 DNS 전환은 별도 보류 상태입니다. 기존 Lovable 서비스 연결을 유지하며 현재 배포는 Vercel URL로 확인합니다.

Full-page QA PNG export (optional): `CAPTURE_QA_SCREENSHOTS=1 npm run test:e2e`. Required browser assertions always run.

Vercel system variables (automatic): VERCEL_ENV selects the Production legal-review gate; VERCEL_PROJECT_PRODUCTION_URL supplies the metadata origin when SITE_URL is empty. Do not manually override these.

이전 배포 QA에서는 일반 Chrome 프로필의 외부 확장 경고와 React hydration418이 관찰되었습니다. 당시 확장 없는 별도 Chrome context에서는 page error가 없었습니다. native 시크릿 창 수동 검증은 도구 timeout으로 미완료였으며 격리 context 검증과 구분합니다. 이 과거 관찰을 이번 최종 로컬 patch의 최신 검증 결과로 취급하지 않습니다.
