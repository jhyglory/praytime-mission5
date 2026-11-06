# PrayTime · Mission 5

PrayTime은 무심코 SNS·숏폼 앱을 여는 순간 잠깐 멈추고 기도한 뒤, 지금 필요한 사용인지 다시 선택하도록 돕는 기독교 기반 디지털 웰니스 서비스입니다. 이 저장소는 제품 소개와 베타 신청 Landing입니다.

핵심 흐름은 **PAUSE → PRAY → CHOOSE → USE → RETURN**입니다. 기도 완료가 SNS 자동 해제를 뜻하지 않습니다. 돌아가거나, 필요하면 **5 / 10 / 15분**을 정해 사용합니다. 시간이 끝나면 다시 제한되고 추가 사용에는 Prayer / Choice가 필요합니다.

## 현재 기준과 작업 상태

최신 작업은 Header부터 Footer까지 **전체 12구간**을 다시 비교·보정하는 작업입니다. 우선순위는 **최신 사용자 명세 → 최종 Figma Desktop1209:514 / Mobile1209:1051 → 기존 구현·문서**입니다. 이전 문서의 일부 구간만 수정·나머지 고정 조건과 상충하는 모션 사양은 이 작업에 적용하지 않습니다.

- [최종 Desktop · 1440](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-514)
- [최종 Mobile · 393](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-1051)
- [Desktop intro entrance](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-8215) · [Mobile intro entrance](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-11339)
- 구간별 변경·보존 내역과 검증 상태: [WHOLE_PAGE_FINAL.md](docs/WHOLE_PAGE_FINAL.md)

전체12구간 구현·시각 비교를 완료하고 **lint / typecheck / unit47 / browser40 / Webpack production build**를 최종 통과했습니다.1440/393/360px에서 통계 reload 재생과 SNS25초 playback을 확인했습니다. 이번 변경의 commit과 Production 배포 후 결과는 WHOLE_PAGE_FINAL.md에서 별도 관리합니다.

| 항목 | 현재 연결 |
| --- | --- |
| Repository | [jhyglory/praytime-mission5](https://github.com/jhyglory/praytime-mission5), private |
| 작업 branch | `feature/mission-5-landing` |
| 기존 PR | [[하영]-미션5 #1](https://github.com/jhyglory/praytime-mission5/pull/1) |
| 기존 Production | [praytime-mission5.vercel.app](https://praytime-mission5.vercel.app) |

사용자는 검증 후 기존 feature branch / PR #1 / Vercel 프로젝트를 통한 commit/push/deploy를 승인했습니다. main 변경·merge·새 PR·새 DB·DNS 전환은 하지 않습니다.

## 전체 Landing과 현재 동작

Header/Nav → Hero → ONE QUESTION → WHY NOW → 독립 clean intro → SNS declaration → THE GAP → TIME SELECT → PRAYER BEFORE CHOICE → FAQ → BETA SIGNUP → Footer 순서입니다. Header는 Hero 위 overlay이며, clean intro와 SNS scene은 서로 다른 스크롤 구간입니다.

- Header/Hero의 CTA와 form submit은 사용자 지정 **“무료로 신청하기”**를 유지합니다. 원본 artwork와 실제 Figma wordmark를 사용합니다.
- ONE QUESTION은 Hero와 같은 원본 artwork의 연속 crop을 사용합니다. 최종 Figma의 Desktop56/80, Mobile32/48 제목을 적용합니다.
- WHY NOW는 각 카드가 실제 **40%** 보일 때 독립 시작합니다. 숫자와 막대가 같은 **1400ms** cubic ease-out 진행률로 `0.0% → 34.3% / 25.3%`에 도달합니다. 두 막대 모두 **Signal Red #FF4438**, 전체100% 길이는 연한 회색 track, 최종 red fill은 정확히34.3% /25.3%입니다.
- 통계는 **카드마다 페이지 로드당 한 번** 실행합니다. 새로고침·페이지 재진입에서는 다시 실행하며, 완료 여부를 `sessionStorage`나 `localStorage`에 저장하지 않습니다. reduced-motion/no-JS는 읽을 수 있는 최종값을 표시합니다.
- clean intro는 카드 없이 **“그래서” 전체 단어 → 실제 Figma 로고 + “은”** 순서로 한 번 등장하고 읽을 수 있는 결과를 유지합니다. 높이는 원본 Desktop760/Mobile680px와 **현재 viewport 높이 이상**을 모두 만족하도록 확보합니다. 다음 SNS scene과 교차 fade하거나 자동 스크롤하지 않습니다.
- SNS scene은 최종 Figma의 Desktop760/Mobile680px 구간을 따릅니다. 선언·보조 문구는 고정하고 **모든 카드 열이 위로** 약12초 주기로 계속 흐릅니다. 원본 사진80개를 각 viewport의 base cycle에 한 번씩 배치하고, Desktop6열/Mobile3열과 독립 phase·동일 duplicate tile로 반복을 연결합니다. 하트16개·공유4개가 반복 상승합니다. 각25초 실제 재생과 모든 seam 경계 검사에서 화면 내 중복 사진0을 확인했습니다.
- THE GAP은 건축적 light artwork와 동등한 두 선택을 유지합니다. 조건 문구·light·CTA와 arrow 묶음은 각 panel 중앙축을 공유합니다. 돌아가기 → `#hero`, 시간 선택 → `#how-it-works`입니다. 요청된 문장 “열기 전, 무엇 때문에 열었는지 떠올려 보세요.”는 제거하며 대체 문구를 추가하지 않습니다.
- TIME SELECT는 실제10분 wheel mockup을 유지하고 swipe/tap/키보드로5/10/15분을 선택할 수 있습니다.
- PRAYER는 Dark section과 원본 Puzz를 유지합니다. Mobile은 원본128px figure와 해당 크기로 export된 grounding SVG를 사용합니다.
- FAQ는 실제 fill인 **Soft Paper #F5F2F7**와 승인된7문항입니다. Mobile layer의 이름이 Dark여도 실제 배경은 Light입니다. 첫 문항 기본 펼침, 독립 toggle과 Radix 키보드 동작을 유지합니다.
- 신청 form은 기존8개 그룹과 validation, 제출 대기·성공·중복·오류·입력 유지·최초 오류 focus를 보존합니다. 실제 server201/status=success/receipt=true일 때만 성공 안내와 alert을 표시합니다.
- Footer는 원래 정책 URL과 브랜드를 유지하며128×21 wordmark와 최종 간격을 적용합니다.

**이전의3000ms·50% trigger·세션당1회, track 없는100% red/70% lavender, 위·아래 교대 이동, SNS100dvh 고정 명세는 최신 whole-page 명세로 대체되었습니다.** 과거 변경 이력은 관련 문서에 남기되 현재 구현 기준은 이 README와 WHOLE_PAGE_FINAL.md를 따릅니다.

## Tech Stack

| 기술 | 현재 사용 |
| --- | --- |
| Next.js / React | Next.js16.4.5 App Router, React19.3.1 |
| TypeScript / Tailwind | TypeScript, Tailwind4.3.4, CSS tokens |
| shadcn/ui | 실제 Radix Accordion·Slot·CVA 기반 Button, PrayTime styling |
| Supabase | 기존 Lovable 저장소, supabase-js2.119.0 |
| Quality | ESLint, TypeScript, Vitest, Playwright / Google Chrome |

shadcn/ui는 프로젝트에서 소유하는 컴포넌트 소스로 사용하며 stock theme로 초기화하지 않습니다. native selection controls와 기존 form/API를 유지합니다. [도입 근거](docs/SHADCN_ADOPTION.md).

## 설치와 검증

`package.json`이 있는 이 디렉터리가 프로젝트 루트입니다. Node.js24.x와 npm11을 사용합니다. 실제 환경 파일이 이미 있으면 덮어쓰지 않습니다.

```sh
npm ci
cp config/environment.example .env.local
npm run dev
```

기본 로컬은 `http://127.0.0.1:3000`이며 persistence가 disabled입니다. 유효한 신청도 저장되지 않고503을 반환합니다. 가짜 성공을 표시하지 않습니다.

```sh
npm run lint
npm run typecheck
npm run test
npm run build -- --webpack
npm run test:e2e
```

이 환경에서 기본 Turbopack worker 포트가 EPERM으로 실패한 이력이 있어 production build는 공식 일회성 `--webpack` 옵션으로 확인합니다. build script나 Vercel 설정은 변경하지 않았습니다. 브라우저 테스트는 별도 서버에서 persistence를 강제로 disabled하고 실제 저장 없이 mock/disabled 경로로 검증합니다.

이번 최종 QA는1440/393/360px 전체 실제 화면,24초 이상 SNS loop, 통계 숫자/막대 동기화와 reload 재생, reduced-motion·pause/cleanup, navigation·CTA·wheel·FAQ·form, overflow·overlap·console을 확인합니다. 최종 결과는 [검증 표](docs/WHOLE_PAGE_FINAL.md#최종-통합-검증과-release)에 기록합니다.

## Backend와 데이터 안전

`BetaSignupForm → POST /api/beta-signup → validation + server consent metadata → SignupStore → Supabase public.beta_signups`.

**기존 Production 접수는 LIVE 상태로 유지합니다.** 승인된 고지 정정·실제 접수 활성화는 이전 작업에서 완료했으며 이번 시각 작업에서 이를 끄거나 backend/env를 변경하지 않습니다. Preview·자동 테스트·기본 로컬은 disabled를 유지합니다. 통계 완료 latch를 웹스토리지에 저장하지 않는 조건은 Production 신청 저장과 별개입니다.

기존 `UNIQUE(email)`, INSERT 전용 RLS, server consent timestamp/policy version/source, Privacy URL, 중복·오류 처리와 실제 receipt 확인을 보존합니다. 새 DB·migration·RLS 변경·service-role key·공개 SELECT/UPDATE/DELETE·기존 신청자 조회/수정은 없습니다. **이번 whole-page QA의 실제 Production POST와 실제 INSERT는0건**입니다. 공개 시각 QA는 신청 endpoint를 차단하고 GET으로 확인합니다.

활성화의 과거 승인·검증 이력은 [BACKEND_ACTIVATION.md](docs/BACKEND_ACTIVATION.md)에 있습니다. 과거 문서의 개인정보 고지 미승인·Production 저장 OFF 서술은 활성화 전 기록입니다.

| 환경변수 | 용도 |
| --- | --- |
| `BETA_SIGNUP_PERSISTENCE` | Production은 승인된 `supabase`, Preview/tests/default local은 `disabled` |
| `SUPABASE_URL` | 기존 프로젝트의 서버 endpoint |
| `SUPABASE_PUBLISHABLE_KEY` | 기존 INSERT용 public key, 서버 환경에만 설정 |
| `SUPABASE_ANON_KEY` | legacy fallback, 필요한 경우만 사용 |
| `SITE_URL` | metadata origin override, 없으면 Vercel system origin fallback |

모든 `.env*`는 Git에서 제외합니다. 키 값·`NEXT_PUBLIC_` Supabase 변수·service-role key를 코드나 문서에 넣지 않습니다. 현재 privacy approval gate와 게시된 정책 URL을 유지합니다.

## 프로젝트 구조

```text
AGENTS.md                     최신 작업 우선순위와 안전 범위
docs/WHOLE_PAGE_FINAL.md       현재 전체 Landing 변경·보존·최종 검증
docs/PRAYTIME_PRODUCT.md       제품 정의
docs/PRAYTIME_DESIGN.md        브랜드·디자인 가드레일
docs/MISSION5_LANDING.md       미션 기준과 과거 이력
src/app/                      page 조립, layout, API
src/components/landing/       section·motion·form, whole-page CSS 보정
src/components/ui/            shadcn Button·Accordion, native selection control
src/lib/                      validation·mapping·consent·store·metadata
public/assets/, public/fonts/ 승인 Figma 에셋과 로컬 폰트
supabase/                     기존 migration 이력, 실행하지 않은 drafts
tests/                        unit·browser 검증
config/environment.example    값이 없는 환경 템플릿
```

## 배포와 보존 항목

기존 Vercel `glorifier1/praytime-mission5` 프로젝트와 `feature/mission-5-landing`을 유지합니다. 화면 source834b5b0을 Production에 배포하고 canonical URL을1440/393/360px에서 재검증했습니다. 각약25초 SNS playback·통계 reload·주요 interaction·전체 화면에서 오류/overflow/실제 POST0을 확인했습니다. deployment ID와 실제 측정값은 [WHOLE_PAGE_FINAL.md](docs/WHOLE_PAGE_FINAL.md)에 있습니다. 이후 문서 검증 기록 commit은 배포된 UI source와 구분합니다.

사용자 지정 공유 이미지는 `/og/praytime-share-8b6783f5.png` 원본1711×919를 유지합니다. favicon은 투명 배경의 Signal Red Pause Mark입니다. 기존 noindex, metadata, Privacy URL과 custom-domain DNS는 변경하지 않습니다. Figma 파일 수정, 새 기능·dependency·DB, main 변경과 merge는 이번 작업 범위에 없습니다.

배포할 때는 기존 Vercel 프로젝트의 Root Directory를 이 `package.json` 디렉터리로 지정하고 Next.js framework detection을 사용합니다. 설치는 `npm ci`, 기본 build는 `npm run build`이며, 이 실행 환경의 포트 제한 검증에는 `npm run build -- --webpack`을 사용합니다. Production 환경변수는 기존 승인값을 유지하고 Preview에는 persistence를 활성화하지 않습니다. 같은 feature branch를 push한 뒤 기존 프로젝트에서 검증된 source를 Production으로 배포합니다. 자세한 확인 항목은 [Vercel 배포 체크리스트](VERCEL_DEPLOYMENT_CHECKLIST.md)를 참고하세요.

## Known limitations

- Chromium의 실제 responsive rendering으로1440/393/360px를 검증합니다. 물리 iPhone/Android와 Safari의 별도 수동 검수는 수행 범위와 구분해 기록합니다.
- 앱 사용 제한과 실제 기도 기능은 Mission6 MVP 범위입니다. Landing의 시간 선택 mockup은 제품 설명용 preview입니다.
- 이번 시각 작업은 실제 신청을 추가하지 않습니다. form 성공/중복/실패 회귀는 mock/disabled 저장소로 확인하며, 과거 실제 저장 검증은 backend 문서를 참고합니다.
- 저장소는 private입니다. 평가자에게 저장소 접근 권한이 있어야 PR과 소스를 검토할 수 있습니다. 멘토 리뷰 전 merge하지 않습니다.
