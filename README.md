# PrayTime · Mission 5

PrayTime은 무심코 SNS·숏폼 앱을 여는 순간 잠깐 멈추고 기도한 뒤, 지금 필요한 사용인지 다시 선택하도록 돕는 기독교 기반 디지털 웰니스 서비스입니다. 앱 삭제·시간 제한을 시도해도 반복되는 자동 사용 습관에 개입합니다.

핵심 흐름은 **PAUSE → PRAY → CHOOSE → USE → RETURN**입니다. 기도 완료가 SNS 자동 해제를 뜻하지 않습니다. 돌아가거나, 필요하면 **5 / 10 / 15분**을 정해 사용합니다. 시간이 끝나면 다시 제한되고 추가 사용에는 Prayer / Choice가 필요합니다. 이 프로젝트는 제품 자체의 OS 차단 기능이 아닌 소개·베타 신청 Landing입니다.

## 현재 단계

최종 Figma Desktop `933:3` / Mobile `933:4`를 반영했습니다. 승인된 Light Editorial + Dark Spatial 구성, full-bleed Hero, 투명 header, WHY NOW, THE GAP, TIME SELECT를 구현했습니다. 기존 폼과 backend는 재사용합니다. PR을 제출하며 멘토가 리뷰·merge합니다.

- Repository: [jhyglory/praytime-mission5](https://github.com/jhyglory/praytime-mission5) (private)
- 작업 branch: `feature/mission-5-landing`
- 최종 PR 제목: `[하영]-미션5`
- Vercel URL: **TODO — 최종 디자인 반영 후 배포 URL 입력**

## Tech Stack

| 기술 | 현재 사용 |
| --- | --- |
| Next.js App Router | 16.4.5, Server Components / Route Handler |
| TypeScript | schema·HTTP·adapter 경계 타입 |
| React | 19.3.1, 클라이언트 interaction |
| Tailwind CSS | 4.3.4, CSS 토큰·반응형 스타일 |
| shadcn/ui | 기술 방향으로 검토. 현재 Button / SelectionControl은 native control 기반 자체 공통 컴포넌트이며 shadcn 생성 코드·Radix 의존성은 미도입 |
| Supabase | supabase-js 2.119.0, 기존 Lovable 저장소 재사용 |
| Quality | ESLint, Vitest, Playwright (Google Chrome) |

현재 interaction에 추가 dependency가 필요하지 않습니다. shadcn/ui 도입 여부는 실제 사용 코드와 구분하며, 라이브러리 설치를 위해 승인 디자인을 바꾸지 않습니다.

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
npm test
npm run build
npm run test:e2e
npm run start
```

브라우저 테스트는 설치된 Google Chrome을 사용합니다. production build 후 실행하며 3000번 포트의 기존 서버를 종료해야 합니다. 기존 서버를 재사용하지 않고 persistence를 강제로 disabled합니다. fetch mock과 UI response interception은 실제 저장 증거와 구분합니다.

## 환경변수

값은 `.env.local` 또는 Vercel 환경변수 설정에만 넣으세요. 모든 `.env*`는 Git에서 제외됩니다. 안전한 이름 템플릿은 `config/environment.example`입니다.

| 이름 | 용도 |
| --- | --- |
| `BETA_SIGNUP_PERSISTENCE` | 기본 `disabled`. 실제 저장 승인 시에만 `supabase` |
| `SUPABASE_URL` | 기존 프로젝트의 HTTPS endpoint |
| `SUPABASE_PUBLISHABLE_KEY` | 기존 public INSERT용 publishable key |
| `SUPABASE_ANON_KEY` | legacy anon JWT가 필요한 경우만 fallback, 보통 비움 |
| `SITE_URL` | 최종 Mission 5 배포 origin, 로컬은 비움 |

`NEXT_PUBLIC_` Supabase 변수와 secret/service-role key를 사용하지 않습니다. key 값은 문서에 포함하지 않습니다. 원본 Lovable의 `VITE_SUPABASE_*`는 운영 원본의 변수이며 이 Next.js 앱의 변수 이름이 아닙니다.

## Figma Source

파일 `J8iLsfruyMwVCakXsSJPq4`:

- [Desktop 933:3](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=933-3)
- [Mobile 933:4](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=933-4)
- [Developer Handoff 913:15](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4?node-id=913-15)

최종 visual authority는 Desktop / Mobile입니다. Handoff `913:15`는 기존 제품·폼 계약 참고이며 최신 두 화면보다 우선하지 않습니다. branding / UX를 재설계하지 않습니다.

## 구현한 Interaction / Responsive

8개 섹션: HERO → ONE QUESTION → WHY NOW → THE GAP → TIME SELECT → PRAYER BEFORE CHOICE → FAQ → BETA SIGNUP.

- CTA / 메뉴 anchor, 키보드 사용 시 목적지 heading focus
- FAQ 5개 독립 토글, 첫 항목만 기본 펼침, Enter / Space
- 최종 TIME SELECT 프리뷰: 5 / 10 / 15분 중 10분 selected. 원본 mockup 재사용. Hero 앱 테마 toggle은 최종 Figma에 없어 노출하지 않습니다.
- 8개 폼 그룹, client·server validation, 최초 오류 focus
- loading / success / duplicate / server error, 입력 유지, 중복 전송 차단
- 실제 HTTP 201 + receipt 이후에만 success와 전환 이벤트
- reduced motion, live result announcement, native form controls

1440 / 1280 / 1024 / 768 / 430 / 393 / 375 / 320px에서 overflow·asset·구조 검증을 합니다. Desktop / Mobile의 시각 정합성은 최종 Figma와 브라우저 screenshot으로 비교했습니다.

## Backend 구조

`BetaSignupForm → POST /api/beta-signup → validation + server consent metadata → SignupStore → Supabase public.beta_signups`.

기존 Lovable 프로젝트와 동일한 저장소를 사용합니다. `beta_signups_email_key UNIQUE(email)`와 INSERT용 RLS를 유지합니다. `.insert()`만 사용하고 `.select()` / upsert / UPDATE / DELETE는 하지 않습니다. `23505`는 409 duplicate, provider 실패는 502, 연결 미설정은 503입니다.

기존 승인 작업에서 nullable 동의 컬럼 3개 추가와 QA 신청 1건 검증이 이미 완료되었습니다. **이번 단계에서는 DB 변경·추가 운영 POST를 하지 않았습니다.** 재검토 SQL 초안은 active migration 폴더 밖에 두었습니다. 고지와 수집 항목의 불일치는 아직 승인 보완이 필요합니다.

상세: [Backend architecture](docs/BACKEND_ARCHITECTURE.md), [Privacy audit](docs/PRIVACY_AUDIT.md), [Migration runbook](docs/CONSENT_MIGRATION_RUNBOOK.md).

## 구조 / Project Context

```text
AGENTS.md                     다음 개발 에이전트 진입점
docs/PRAYTIME_PRODUCT.md       제품 정의
docs/PRAYTIME_DESIGN.md        승인 브랜드·디자인 가드레일
docs/MISSION5_LANDING.md       섹션·interaction·미션 기준
src/app/                      page, layout, API
src/components/landing/       Landing / form interaction
src/components/ui/            공통 native UI primitives
src/lib/                      schema, mapping, consent, store, metadata
public/assets/, public/fonts/ 승인 Figma 에셋·로컬 폰트
supabase/migrations/           과거 적용 이력
supabase/drafts/               실행하지 않은 검토용 SQL
tests/                        단위·브라우저 테스트
config/environment.example    값이 없는 환경 템플릿
```

## 배포

Vercel에서 GitHub repo를 import하고 Framework **Next.js**, Root Directory **.**, Install Command `npm ci`, Build Command `npm run build`, Node **24.x**를 사용합니다. Preview는 `BETA_SIGNUP_PERSISTENCE=disabled`로 유지하세요. Production / Preview persistence는 disabled로 유지하고 Supabase key를 등록하지 않습니다. 고지 정합성 승인 후에만 release gate와 기존 connection을 검토합니다. SITE_URL은 실제 배포 origin으로 설정합니다. env 변경 후 재배포가 필요합니다. 상세 [배포 체크리스트](VERCEL_DEPLOYMENT_CHECKLIST.md).

아직 배포하지 않았으며, Vercel URL은 위 placeholder를 실제 URL로 교체해야 합니다.

## Known limitations

- 최종 Figma에 없는 제품 기능이나 site-wide theme toggle은 추가하지 않았습니다.
- 개인정보 고지의 누락·필수 여부·표현 범위 보완 승인이 필요합니다. 법률 문구는 임의 작성하지 않았습니다.
- OG는 승인된 Hero 원본 이미지, favicon은 승인 Pause Mark 원본 export를 재사용합니다. 별도 social composition을 만들지 않았습니다.
- `SITE_URL` 미설정 시 canonical / OG URL 생략. 검색 indexing은 기존 noindex 유지, 공개 시 검토 필요.
- 베타 신청 API는 기본 disabled. 실제 INSERT QA는 개인정보 고지 정합성 승인 후로 보류합니다. Production handler도503 PRIVACY_REVIEW_REQUIRED로 저장을 차단합니다. 일반 자동 테스트는 항상 mock / disabled입니다.
- OS 접근 제한·기도 실행 등 제품 기능은 Landing의 설명·프리뷰입니다.
- 자동 a11y 검증이 screen reader 전체 사용성·최종 색상 contrast 감사를 대체하지 않습니다.
