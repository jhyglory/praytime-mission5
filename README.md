# PrayTime · Mission 5

PrayTime은 무심코 SNS·숏폼 앱을 여는 순간 잠깐 멈추고 기도한 뒤, 지금 필요한 사용인지 다시 선택하도록 돕는 기독교 기반 디지털 웰니스 서비스입니다. 이 저장소는 제품 소개와 베타 신청 Landing입니다.

핵심 흐름은 **PAUSE → PRAY → CHOOSE → USE → RETURN**입니다. 기도 완료가 SNS 자동 해제를 뜻하지 않습니다. 돌아가거나, 필요하면 **5 / 10 / 15분**을 정해 사용합니다. 시간이 끝나면 다시 제한되고 추가 사용에는 Prayer / Choice가 필요합니다.

## 현재 기준과 작업 상태

기도 단계의01 PAUSE→02 PRAY→03 CHOOSE는 섹션 진입 시 빛이 선을 그으며 순서대로 나타납니다. 각 빛은 다음 단계 전에 사라지고 텍스트는 남습니다. 기존 위치·크기·문구는 유지하며 화면 밖/비활성 탭에서는 정지하고 reduced-motion/no-JS에서는 원래 정적 구성을 표시합니다. [구현·검증](docs/PRAYER_STEPS_MOTION.md).

최신 배포 범위는 누적 interaction 보정입니다: 질문 문구의 스크롤 fade·영문 eyebrow 삭제, 통계500ms 대기, “그래서” 정지 대기600ms, SNS 카드 후1700ms에 검은 배경/문구 등장, THE GAP의1200ms 대기+약5384.62ms(1.3배 속도) 아이보리 빛 모션. 사용자가 랜딩 연결과 기존 feature/PR/Vercel을 통한 배포를 승인했습니다. 이전 “로컬만/아직 배포 안 함” 기록은 아래 보정 단계의 이력입니다. [현재 검증 및 릴리스](docs/FINAL_INTERACTION_RELEASE.md).

전체12구간 구현을 기준으로, 최신 작업은 **종이비행기 공유 아이콘·SNS 카드0.7배 속도와 열 교차·단계별 빛 중심·흰색→네이비 인트로** 네 항목입니다. 우선순위는 **최신 사용자 명세 → 최종 Figma Desktop1209:514 / Mobile1209:1051 및 복원된 인트로 → 기존 구현·문서**입니다. 네 항목 밖의 문구·레이아웃·기능은 유지합니다.

- [최종 Desktop · 1440](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-514)
- [최종 Mobile · 393](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-1051)
- [Desktop intro entrance](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-8215) · [Mobile intro entrance](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-11339)
- 구간별 변경·보존 내역과 검증 상태: [WHOLE_PAGE_FINAL.md](docs/WHOLE_PAGE_FINAL.md)
- 최신 네 항목의 Figma 레이어·타이밍·검증 상태: [FOUR_INTERACTIONS_PATCH.md](docs/FOUR_INTERACTIONS_PATCH.md)

이전 전체 페이지 검증에서 **lint / typecheck / unit47 / browser40 / Webpack production build**가 통과했고1440/393/360px 통계 reload와 SNS 재생을 확인했습니다. 이는 과거 기준선입니다. 현재 네 항목 패치의 검사·실제 두 주기 재생·배포 검증은 [별도 기록](docs/FOUR_INTERACTIONS_PATCH.md)을 따르며, 아직 수행하지 않은 항목을 과거 PASS로 대신하지 않습니다.

| 항목 | 현재 연결 |
| --- | --- |
| Repository | [jhyglory/praytime-mission5](https://github.com/jhyglory/praytime-mission5), public |
| 작업 branch | `feature/mission-5-landing` |
| 기존 PR | [[정하영]-미션5 #1](https://github.com/jhyglory/praytime-mission5/pull/1) |
| 기존 Production | [praytime-mission5.vercel.app](https://praytime-mission5.vercel.app) |

사용자는 검증 후 기존 feature branch / PR #1 / Vercel 프로젝트를 통한 commit/push/deploy를 승인했습니다. main 변경·merge·새 PR·새 DB·DNS 전환은 하지 않습니다.

## 빛의 틈 모션

THE GAP은 검수한 `preview` preset을1.3배 속도(7000÷1.3=약5384.62ms)로 재생하고1200ms 진입 대기를 사용합니다. 전체 약6.58초 뒤 최종 발광면을 유지합니다. 이전4521.43ms 기본 preset은 과거 비교용으로만 남깁니다. `/dev/gap-light`의 재생/탐색 제어는 개발 모드에서만 사용할 수 있습니다. [로컬 보정 이력](docs/GAP_LIGHT_SEVEN_SECOND_STUDY.md).

THE GAP의 중앙 빛은 재사용 가능한 `GapLightMotion` SVG 컴포넌트입니다. 짧은 빛의 하강 → 접촉·바닥 확산·머무름 → 상승과 연결된 틈 → 테두리 없는 아이보리 발광면 순서입니다. 진입 후1.2초 대기하고약5.38초 동안 한 번 재생하며 화면 밖/비활성 탭에서는 일시정지하며, reduced-motion과 JavaScript 비활성화에서는 최종 모습을 표시합니다. 기존 문구·CTA·섹션 크기는 유지합니다. 개발 전용 미리보기는 `npm run preview:gap-light` 후 `/dev/gap-light`에서 실행합니다. [연결·검증 기록](docs/GAP_LIGHT_LANDING_RELEASE.md).

## 전체 Landing과 현재 동작

질문 “무심코 열게 된 SNS…”는 일반 모션 환경에서 처음에는 숨기고, 사용자가 스크롤한 뒤 제목이 화면에 들어오면800ms 동안 opacity로 나타납니다. 문구·위치·영역 크기는 유지하며 한 번 표시된 뒤 다시 숨기지 않습니다. reduced-motion/no-JS는 즉시 읽을 수 있습니다. 검증 후 이번 릴리스에 포함합니다.

SNS 텍스트는 카드가 먼저 움직인 뒤1700ms 후 중앙 선언·보조 문구와 검은 reading field를 함께400ms fade-in합니다. 기존 위치/문구/카드 속도·방향은 유지하고 reduced-motion/no-JS에서는 바로 읽을 수 있습니다. [보정 이력](docs/SNS_COPY_REVEAL.md). 이번 릴리스에 포함합니다.

Header/Nav → Hero → ONE QUESTION → WHY NOW → 독립 clean intro → SNS declaration → THE GAP → TIME SELECT → PRAYER BEFORE CHOICE → FAQ → BETA SIGNUP → Footer 순서입니다. Header는 Hero 위 overlay이며, clean intro와 SNS scene은 서로 다른 스크롤 구간입니다.

- 상단 Header의 신청 CTA는 Desktop·Mobile 모두 제거했습니다. Hero CTA와 form submit의 **“무료로 신청하기”**는 유지합니다. 로고·기존 navigation 위치·원본 artwork는 보존합니다.
- Hero/Question은 사용자가 제공한 고화질 PNG 원본 비율·기존 glass 위치를 유지합니다. THE GAP은 이전 PNG의 빛 상단·바닥 위치를 보존하면서 위의 승인된 SVG 모션으로 교체했습니다. [과거 원본 해시](docs/evidence/high-resolution-assets/originals.json).
- Hero 유리 이미지는 hover·마우스 이동에도 고정됩니다. 이전2.5px pointer parallax는 제거했으며 원본 이미지·crop·CTA hover/focus는 유지합니다.
- ONE QUESTION은 Hero와 같은 원본 artwork의 연속 crop을 사용합니다. 최종 Figma의 Desktop56/80, Mobile32/48 제목을 적용합니다.
- WHY NOW는 각 카드가 실제 **40%** 보인 뒤 **500ms 대기 후** 독립 시작합니다. 대기 중 화면 밖으로 나가거나 탭이 비활성화되면 취소하고 재진입 때 다시 기다립니다. 이미 시작한 애니메이션은 추가 대기 없이 이어집니다. 숫자와 막대가 같은 **1400ms** cubic ease-out 진행률로 `0.0% → 34.3% / 25.3%`에 도달합니다. 두 막대 모두 **Signal Red #FF4438**이며 회색 track은 표시하지 않습니다. 사용자 요청에 따른 장식용 최종 길이는80% /70%이고, 실제 통계 숫자34.3% /25.3%는 그대로 유지합니다.
- 통계는 **카드마다 페이지 로드당 한 번** 실행합니다. 새로고침·페이지 재진입에서는 다시 실행하며, 완료 여부를 `sessionStorage`나 `localStorage`에 저장하지 않습니다. reduced-motion/no-JS는 읽을 수 있는 최종값을 표시합니다.
- clean intro는 **흰색 영역의 검은 “그래서” 전체 단어 → 얇은 빛과 배경 전환 → 네이비의 실제 빨간 Pause Mark·워드마크 + “은”** 순서입니다. 최신 요청으로 단어와 흰 배경의 공통 정지 대기를0.6초로 줄였으며 전체 타임라인은4.6초입니다. 원본의 등장·fade 속도는 유지하고 구간 진입 시 한 번 실행하며 화면 밖·비활성 탭에서 정지합니다. 점 세 개와 “행동하기 전에, 잠깐의 틈을 만듭니다.” 문구는 없으며, 인트로에 SNS 장식은 넣지 않습니다. reduced-motion/no-JS에서도 읽을 수 있는 정적 상태를 제공합니다.
- SNS scene은 최종 Figma의 Desktop760/Mobile680px 구간과 고정 선언·보조 문구를 유지합니다. 카드 속도는 직전15초 모션의 **0.7배**이며 같은 이동 거리의 새 주기는 **15000÷0.7=21428.571428571428ms(약21.43초)**입니다. Desktop6열은 **↑↓↑↓↑↓**, Mobile3열은 **↑↓↑**로 열 전체가 교차 이동합니다. 원본 사진80개를 각 viewport의 base cycle에 한 번씩 배치하고 독립 phase·동일 duplicate tile로 양방향 반복을 연결합니다. 하트16개·종이비행기4개는 카드 방향과 무관하게 기존12초 타이밍으로 계속 상승합니다.
- SNS 카드 안과 주변의 공유 glyph는 선으로 그린 재사용 `PaperPlaneIcon`으로 통일하며 기존 슬롯·색·투명도를 유지합니다. 다음 SNS 화면에는 인트로의그래서/로고를 다시 넣지 않습니다.
- THE GAP은 건축적 light artwork와 동등한 두 선택을 유지합니다. 조건 문구·light·CTA와 arrow 묶음은 각 panel 중앙축을 공유합니다. 돌아가기 → `#hero`, 시간 선택 → `#how-it-works`입니다. 요청된 문장 “열기 전, 무엇 때문에 열었는지 떠올려 보세요.”는 제거하며 대체 문구를 추가하지 않습니다.
- TIME SELECT는 실제10분 wheel mockup을 유지하고 swipe/tap/키보드로5/10/15분을 선택할 수 있습니다.
- PRAYER는 Dark section과 원본 Puzz를 유지합니다. 각 단계의 빛 중심은 **01 PAUSE20% /02 PRAY기존50% /03 CHOOSE80%**입니다. Mobile 세로 배치에서도 단계 내부를 기준으로 적용하며 긴 가로선·숫자·제목·본문·단계 위치는 유지합니다. Mobile은 원본128px figure와 해당 크기로 export된 grounding SVG를 사용합니다.
- FAQ는 실제 fill인 **Soft Paper #F5F2F7**와 승인된7문항입니다. Mobile layer의 이름이 Dark여도 실제 배경은 Light입니다. 질문·답변 글자와 목록 간격은 사용자 요청으로 이전의85%로 줄였습니다. 첫 문항 기본 펼침, 독립 toggle과 Radix 키보드 동작을 유지합니다.
- 신청 form은 기존8개 그룹과 validation, 제출 대기·성공·중복·오류·입력 유지·최초 오류 focus를 보존합니다. 실제 server201/status=success/receipt=true일 때만 성공 안내와 alert을 표시합니다.
- Footer는 원래 정책 URL과 브랜드를 유지하며128×21 wordmark와 최종 간격을 적용합니다.

**과거의3000ms·50% trigger·세션당1회,100% red/70% lavender, SNS100dvh 고정 명세는 현재 기준이 아닙니다.** 또한 모든 카드가 위로 흐르는15초 규칙과 전체 네이비 인트로는 이번 네 항목 명세로 대체했습니다. 과거 변경·PASS·release 이력은 보존하되 현재 동작은 이 README와 FOUR_INTERACTIONS_PATCH.md를 따릅니다.

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

현재 네 항목 QA는1440/393/360px 실제 화면, SNS 두 주기 이상(42.857초 초과)의 양방향 반복·중복 사진·입자,0.7배 실제 속도, 종이비행기, 단계별 빛20/50/80%, 흰색그래서→빛→실제 로고+은 순서를 확인합니다. reduced-motion·진입 시점·pause/cleanup과 기존 navigation·CTA·wheel·FAQ·form, overflow·overlap·console도 회귀 검사합니다. 최신 결과는 [네 항목 검증 기록](docs/FOUR_INTERACTIONS_PATCH.md), 과거 전체 검증은 [기존 검증 표](docs/WHOLE_PAGE_FINAL.md#최종-통합-검증과-release)에 구분해 기록합니다.

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

기존 Vercel `glorifier1/praytime-mission5` 프로젝트와 `feature/mission-5-landing`을 유지합니다. 전체 비교 release834b5b0과 이후 Header CTA·0.8배 속도 수정은 과거 기준선입니다. 현재 네 항목 패치는 직전15초 속도의0.7배와 열 교차를 사용합니다. 최신 code commit·deployment·배포 후 결과는 [기존 PR #1](https://github.com/jhyglory/praytime-mission5/pull/1)과 [FOUR_INTERACTIONS_PATCH.md](docs/FOUR_INTERACTIONS_PATCH.md)에서 관리합니다. 과거 release별 검증은 [WHOLE_PAGE_FINAL.md](docs/WHOLE_PAGE_FINAL.md)에 보존합니다.

사용자 지정 공유 이미지는 `/og/praytime-share-8b6783f5.png` 원본1711×919를 유지합니다. favicon은 투명 배경의 Signal Red Pause Mark입니다. 기존 noindex, metadata, Privacy URL과 custom-domain DNS는 변경하지 않습니다. Figma 파일 수정, 새 기능·dependency·DB, main 변경과 merge는 이번 작업 범위에 없습니다.

배포할 때는 기존 Vercel 프로젝트의 Root Directory를 이 `package.json` 디렉터리로 지정하고 Next.js framework detection을 사용합니다. 설치는 `npm ci`, 기본 build는 `npm run build`이며, 이 실행 환경의 포트 제한 검증에는 `npm run build -- --webpack`을 사용합니다. Production 환경변수는 기존 승인값을 유지하고 Preview에는 persistence를 활성화하지 않습니다. 같은 feature branch를 push한 뒤 기존 프로젝트에서 검증된 source를 Production으로 배포합니다. 자세한 확인 항목은 [Vercel 배포 체크리스트](VERCEL_DEPLOYMENT_CHECKLIST.md)를 참고하세요.

## Known limitations

- Chromium의 실제 responsive rendering으로1440/393/360px를 검증합니다. 물리 iPhone/Android와 Safari의 별도 수동 검수는 수행 범위와 구분해 기록합니다.
- 앱 사용 제한과 실제 기도 기능은 Mission6 MVP 범위입니다. Landing의 시간 선택 mockup은 제품 설명용 preview입니다.
- 이번 시각 작업은 실제 신청을 추가하지 않습니다. form 성공/중복/실패 회귀는 mock/disabled 저장소로 확인하며, 과거 실제 저장 검증은 backend 문서를 참고합니다.
- 저장소는 public입니다. 평가자는 로그인이나 별도 초대 없이 PR과 소스를 확인할 수 있습니다. 멘토 리뷰 전 merge하지 않습니다.
