# PrayTime · Whole Landing 최종 비교와 구현

## Latest form spacing override: nickname and email

Removed only the empty nickname helper span and its unused CSS. Its 22px
height plus an 8px internal gap reserved 30px of blank space. The nickname
input bottom to email label gap is now 32px instead of 62px; input-to-input
gap is 64px instead of 94px. All other form-group gaps remain 32px.

The existing real nickname error still renders with role=alert and the same
ARIA association/focus behavior. It adds space naturally when required;
clearing it restores the compact default spacing. No input/validation/API
logic changed. Default form/section heights are reduced by 30px, so earlier
118px nickname and 150px email-top reference measurements are historical.

Latest checks: lint/typecheck/unit47/47/browser22/22/Webpack build PASS.
Actual 1440/393/360/320px checks confirm the 32px gap, unchanged remaining
gaps, invalid nickname focus/ARIA/error display, restoration after input,
no overflow/errors and no POSTs. See [measurements](evidence/name-email-spacing/local-browser.json)
and [validation](evidence/name-email-spacing/validation.json).

## Latest WHY visual override: red accents at 80% / 70%

The numeric statistics remain 34.3% and 25.3%. The user requested invisible
gray tracks and decorative red accent lengths of 80% and 70%. The layout
containers remain full width with transparent backgrounds; both fills stay
Signal Red #FF4438. The accents remain aria-hidden and the obsolete
data-max attribute is removed. They do not define the numeric statistic scale.

The existing 1400ms shared easing, independent 40% visibility trigger,
once-per-load/reload behavior, offscreen/background pause and reduced/no-JS
fallback remain unchanged. Number/rate and fill/accent-length share the same
eased scalar. No counter JavaScript, text, section geometry, backend or other
interactions changed.

Latest checks: lint/typecheck/unit47/47/browser37/37/Webpack build PASS.
Actual 1440/393/360/320px checks confirm transparent tracks, red fills,
80/70% final lengths, factual visible/accessible values, two plays including
reload, shared progress, reduced motion, no overflow/errors and no POSTs.
Width comparisons allow the browser's 1/64 CSS-pixel layout rounding.
See [measurements](evidence/red-accents/local-browser.json) and
[validation](evidence/red-accents/validation.json). Earlier gray proportional
34.3/25.3% bar measurements below are historical.

## Latest FAQ override: 85% typography and list spacing

Questions changed from 20/30px to 17/25.5px; answers from 18/30px to
15.3/25.5px. Row padding changed from 24px to 20.4px; question/answer,
divider and chevron gaps from 16px to 13.6px; paragraph gaps from 30px
to 25.5px. The section heading, outer padding/grid, 24px chevron,
1px divider, seven answers and Accordion behavior remain unchanged.

Default FAQ heights are 834.71875px at 1440px, 1065.71875px at 393px,
and 1091.21875px at 360px. A closed single-line row is about 80.875px.
Text reflows at the same width, so the whole section is not exactly 85%
of its old height. Following sections move naturally with the document.
Earlier 954/1224/1284px FAQ measurements below are historical.

Latest checks: lint/typecheck/unit 47/47/browser 22/22/Webpack build PASS.
Actual 1440/393/360/320px checks confirm computed values, unchanged
headings, all seven open, Enter/Space/Home/End focus, no overflow/errors
and no POSTs. See [measurements](evidence/faq-85/local-browser.json) and
[validation](evidence/faq-85/validation.json). High-resolution images,
0.8x photo speed, removed header CTA, form/backend/env, other sections,
main, merge and DNS are unchanged.

작성일: 2026-11-06. 이 문서는 최신 whole-page 요청의 구현·구간별 비교와 최종 로컬 검증 결과입니다. 최종 lint/typecheck/unit47/browser40/build가 통과했습니다. Production release 결과는 아래 표에서 별도로 기록합니다.

## 현재 기준

우선순위는 최신 사용자의 명시적 요구 → 최종 Figma 전체 Desktop/Mobile → 기존 구현·문서입니다. Header부터 Footer까지12구간 모두 검토하며, 이전의 intro/SNS만 수정·다른 구간 고정 조건은 현재 작업 범위를 제한하지 않습니다. 디자인 재해석, 새 제품 기능과 카피 추가는 하지 않습니다.

| 기준 | Source |
| --- | --- |
| Figma file | `J8iLsfruyMwVCakXsSJPq4` |
| 전체 Desktop | [1209:514 · 1440px](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-514) |
| 전체 Mobile | [1209:1051 · 393px](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1209-1051) |
| Desktop entrance motion | [1265:8215](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-8215) |
| Mobile entrance motion | [1265:11339](https://www.figma.com/design/J8iLsfruyMwVCakXsSJPq4/?node-id=1265-11339) |
| 검토 viewport | Desktop1440, Mobile393, 좁은 Mobile360px |

전체 frame의 sparse XML만으로 구현하지 않고 각 구간의 fresh high-fidelity context와 실제 screenshot, 필요한 경우 읽기 전용 Plugin API의 속성·render bounds를 비교했습니다. Figma 파일은 수정하지 않았습니다. screenshot을 UI asset으로 사용하지 않습니다.

## 12구간 변경·보존 내역

아래는 실제 비교 후 적용하거나 보존한 내역입니다. 최종 통합 확인 상태는 마지막 검증 표에서 관리합니다.

| 구간 | Desktop / Mobile node | 적용·보존 결과 |
| --- | --- | --- |
| Header / Nav | `1209:527` / `1209:1299` | 투명 Hero overlay와 기존 anchor·active navigation·키보드 focus를 보존. wordmark Desktop168.5px / Mobile128px, Mobile CTA152px과20px type, solid mark의 glow 제거를 source에 맞춤. 사용자 CTA “무료로 신청하기” 유지. |
| Hero | `1209:515` / `1209:1052` | 원본 연속 artwork·crop·overlay·pointer 반응·CTA 목적지를 보존. Mobile headline34px, body/guardrail 폭·크기를 최종 source에 맞춤. 새 이미지·카피·제품 UI를 추가하지 않음. |
| ONE QUESTION | `1209:535` / `1209:1067` | 원본 Hero artwork의 연속 crop 보존. 제목 Desktop56/80, Mobile32/48로 최종 frame을 반영. source에 없는 보조 문구는 노출하지 않음. |
| WHY NOW | `1209:542` / `1209:1073` | Mobile32/48 제목·26/44 설명과 의도된3줄 구성, 하단190px dark threshold를 반영. 좁은 화면은 별도 안전한 type adaptation으로 겹침을 방지. 통계·막대는 아래 최신 명세로 재구현. |
| Clean intro | `1265:8075` / `1265:8099` | 카드 없는 독립 section. “그래서” 전체 단어 → 실제 exported Figma wordmark + “은” 순서를 유지. 원본 Desktop760/Mobile680px 이상이면서 현재 viewport 이상 높이를 확보하고 copy를 중앙에 배치. |
| SNS declaration | `1209:565` / `1209:1100` | intro와 독립 구간으로 유지. 고정 선언·보조 문구, source Desktop760/Mobile680px geometry, 원본80사진·6/3열·입자 artwork 보존. 모든 열을 위로 이동하도록 보정하고12초 반복과 phase·seam을 유지. |
| THE GAP | `1209:587` / `1209:1122` | 건축적 light SVG, 동등한 두 선택과 목적지 보존. 조건·light·CTA/arrow 묶음의 중심축 정렬. “열기 전, 무엇 때문에 열었는지 떠올려 보세요.” 제거, 대체 문구 없음. |
| TIME SELECT | `1209:622` / `1209:1157` | 최종 mockup·silhouette crop·설명·시간 종료 안내·기존 wheel 동작을 비교 후 보존. 선택은5/10/15분이며 초기10분. PNG가 fresh source와 byte hash까지 동일함을 확인. |
| PRAYER BEFORE CHOICE | `1209:657` / `1209:1191` | Dark fill·3단계·원본 Puzz PNG·light layers 보존. Mobile128px 원본 크기로 export된 grounding2개를 사용하고 실제 render bounds로 위치 보정. narrow 화면에서도18/28 제목·15/24 본문과 source 문단 경계 유지. |
| FAQ | `1209:697` / `1209:1231` | Soft Paper와 승인7문항·첫 항목 open·Radix Accordion 동작 보존. border 대신 source의16px gap +1px divider +24px bottom padding을 적용해 전체 높이112px 부족을 수정. chevron gap16px과 한국어 줄바꿈 복원. |
| BETA SIGNUP | `1209:747` / `1209:1281` | 기존8그룹의 내용·순서·필수/선택·validation·form/API 보존. consent를 regular16/26으로 맞춰 Mobile4px 높이 차이 수정, source disabled styling 적용. submit은 사용자 지정 “무료로 신청하기” 유지. |
| Footer | `1209:758` / `1209:1292` | 원래 Privacy URL과 signature 보존. wordmark128×21과22px 정책 text row를 복원해 Desktop22px / Mobile약21.58px 과다 높이를 제거. 정책 링크는 보이지 않는44px pointer target을 유지. |

Mobile FAQ layer 이름에는 Dark가 남아 있지만 실제 fill은 `#F5F2F7`입니다. 이름을 근거로 어두운 배경으로 바꾸지 않습니다. Source 생성 코드의 footer tracking6px와 실제 node 속성이 달라, 읽기 전용 API로 확인한 Inter Regular16px / line20.5714px / tracking3.42857px / text frame104px을 사용했습니다.

## 최신 통계와 모션 명세

### WHY NOW

- 표시값은 한 자리 소수 `0.0% → 34.3%`와 `0.0% → 25.3%`입니다.
- 각 카드가 실제40% 보일 때 독립 시작합니다. observer는 threshold0.4와 rootMargin0입니다.
- 숫자와 red fill은 같은1400ms cubic ease-out 진행률을 공유합니다. `1 - (1 - progress)^3`를 사용합니다.
- 두 fill은 모두 Signal Red `#FF4438`이며, 전체100% 길이의 연한 회색 track 위에 최종34.3% /25.3% 길이로 표시합니다.
- 카드마다 페이지 로드당 한 번만 실행합니다. reload·새 페이지 진입은 다시 실행합니다. 완료 latch를 sessionStorage/localStorage에 기록하거나 읽지 않습니다.
- offscreen 또는 background에서 진행을 멈추고 안전하게 재개합니다. unmount 시 observer·RAF·media/visibility listener를 정리합니다.
- reduced-motion, no-JS와 observer가 없는 환경에서는 읽을 수 있는 최종 수치를 유지합니다. accessible text도 최종 수치를 유지합니다.

이전의3000ms·50% trigger·session당1회, 회색 track 없는100% red /70% lavender 막대는 현재 기준이 아닙니다. 통계 완료 여부에 대한 “no storage” 조건은 기존 Production 베타 신청 저장을 끄는 지시가 아닙니다.

### 독립 clean intro

“그래서”를 글자별로 나누지 않고 전체 단어로 등장시킨 뒤, 실제 Figma 로고와 “은”을 보여줍니다. source entrance의 onset·opacity·easing을 사용하며 source4초 window 안에서 한 번 재생한 뒤 결과를 유지합니다. 이미지 로고를 text/CSS 대체물로 바꾸지 않습니다.

높이는 Desktop `max(760px, viewport)` / Mobile `max(680px, viewport)`가 되도록 확보합니다. copy는 section 중앙에 배치하고 다음 SNS 카드가 intro 시작 화면으로 미리 침범하지 않게 clipping·stacking을 유지합니다. SNS와 scene crossfade, auto-scroll, scroll hijacking은 없습니다.

### SNS declaration

- 최종 source의 Desktop760px / Mobile680px 독립 구간을 따릅니다. 이전 SNS100dvh 고정 높이는 최신 whole-page source 기준으로 대체합니다.
- 모든 카드 열이 위로 계속 흐릅니다. 약12초 선형 cycle과 각 열의 독립 phase를 사용하며 위·아래 교대 방향은 적용하지 않습니다.
- 원본 사용자 사진80개를 각 viewport의 base cycle에 한 번씩 배치하고 동일 tile을 복제하여 seam을 연결합니다. 복제 tile이 같은 사진을 화면에 동시에 노출하지 않는지 장시간 playback으로 확인합니다.
- Desktop6열 / Mobile3열, 하트16개 / 공유4개를 유지합니다. 입자는 반복 상승합니다.
- 선언·보조 문구는 고정하여 읽을 수 있게 유지합니다. offscreen/background pause와 cleanup, reduced-motion/no-JS의 정적인 읽기 fallback을 보존합니다.
- 최종24초 이상 playback·seam·동시 photo uniqueness 검증은 아래 통합 검증 표에서 완료 여부를 기록합니다.

## 하단 구간 정밀 비교

중간 로컬 build와 최신 scoped CSS를 적용한 구간별 비교에서 다음 source 크기·간격을 확인했습니다. 이후 최종 rebuild와 전체 화면 재검증에서도 같은 높이와 overflow0을 확인했습니다.

| 구간 높이 | Desktop1440 | Mobile393 |
| --- | --- | --- |
| Time Select | source923.4198px / browser923.4063px | source1187.7405px / browser1187.7344px |
| Prayer | 757px | 999px |
| FAQ | 954px | 1224px |
| Beta Signup | 1739px | 2513px |
| Footer | 123px | 168px |

소수점 차이는 browser layout rounding 범위입니다. FAQ 첫 open row는 Desktop231px / Mobile321px, 나머지 closed row는95px입니다. 승인된7개 질문과 visible 첫 답변은 source와 동일하며, Figma에서 닫혀 있어 표시되지 않는 나머지 답변은 현재의 제품에 맞는 승인본을 보존했습니다.

8개 form group과 submit의 top/height는 form 시작점을0으로 비교했습니다.

| Group | Desktop top / height | Mobile top / height |
| --- | --- | --- |
| nickname | 0 /118 | 0 /118 |
| email | 150 /118 | 150 /118 |
| os | 300 /82 | 300 /182 |
| signup_reason | 414 /256 | 514 /406 |
| age_range | 702 /88 | 952 /88 |
| target_apps | 822 /156 | 1072 /206 |
| reduction_methods | 1010 /232 | 1310 /406 |
| consent | 1274 /98 | 1748 /124 |
| submit zone | 1404 /94 | 1904 /94 |
| form 전체 | 0 /1498 | 0 /1998 |

필드 label·placeholder·option 내용은 그대로입니다. source의 이유 legend에는 별표가 없지만 현재 필수항목을 설명하는 기존 별표는 보존했습니다. source submit의 “베타 사전신청”보다 사용자 지정 “무료로 신청하기”가 우선합니다. 입력 validation·error focus·중복 방지·요청/receipt 처리·privacy는 수정하지 않았습니다.

### 원본 asset 검증

Phone PNG와 Puzz PNG, FAQ/select chevron은 fresh source와 byte hash가 같습니다. Prayer light12개와 Desktop Puzz grounding, radio SVG는 export ID 때문에 byte hash가 달랐으나 동일 bounds의 raw rendered pixel hash가 같아 기존 파일을 재사용했습니다.

Mobile grounding은 native export와 Desktop SVG 축소본의 픽셀이 달라 아래2개만 원본 그대로 추가했습니다. SVG bytes/path는 수정하지 않았습니다.

| Asset | Source node | Size / position | SHA-256 |
| --- | --- | --- | --- |
| `public/assets/whole-page/prayer-mobile-ground.svg` | `I1209:1227;834:13` | 64×15.5, figure 기준32/114 | `c571de6bea87d7a7c611f0b1cb19f3c21ffe8139eac5eac5608f6986461486fc` |
| `public/assets/whole-page/prayer-mobile-shadow.svg` | `I1209:1227;834:14` | 40×6.5, figure 기준44.25/118.75 | `f82825df281cee176561d726fa8fd90cbf449317c4208ebeaef595f0e44478a6` |

Desktop shadow의 render 위치는55.3125/148.4375이며, PNG는 Desktop160×160 / Mobile128×128입니다. 실제 loaded source·non-empty·render geometry를1440/393/360에서 확인했습니다. 전체 asset 비교 manifest와 중간 screenshot·geometry 결과는 작업 세션의 `work/whole-page/lower-assets-verified.json`, `lower-local*.json`, `lower-local-*.png`에 있습니다.

## Backend와 변경 금지 범위

기존 Production의 승인된 Lovable/Supabase `public.beta_signups` 접수는 **LIVE를 유지**합니다. 이번 작업에서 backend/env, published Privacy URL, 승인 gate, 기존 `UNIQUE(email)`, INSERT 전용 RLS, server consent metadata와 실제 receipt 성공 조건을 바꾸지 않았습니다. Preview·tests·기본 local persistence는 disabled입니다.

**이번 whole-page QA: 실제 Production POST0건, 실제 INSERT0건.** 공개 visual QA는 신청 endpoint를 차단하고 GET만 사용합니다. 자동 form 검증의 mock/disabled POST는 실제 접수와 구분합니다. 기존 신청자는 조회·수정하지 않습니다.

과거의 실제 접수 활성화 승인과1건 검증은 [BACKEND_ACTIVATION.md](BACKEND_ACTIVATION.md)의 별도 이력입니다. 이번 시각 QA를 그 저장 검증의 반복으로 취급하지 않습니다.

원본 사진80개·브랜드·transparent Pause Mark favicon·지정 OG 이미지·metadata·noindex를 유지합니다. 새 제품 기능·dependency·DB/migration·RLS 완화·Figma write·main 변경·merge·DNS 전환은 없습니다.

## 최종 통합 검증과 release

최신 source의 production build와 Chrome 통합 테스트를 완료했습니다. 실제25초 재생을1440/393/360에서 각각 측정했으며 숫자/게이지 동기화와 같은 탭의 reload 재생을 확인했습니다. 측정 자료는 [local playback](evidence/whole-page/local-playback.json)과 [전체 geometry](evidence/whole-page/local-full.json)에 있습니다.

| 항목 | 상태 / 실제 증거 |
| --- | --- |
| 전체 lint | **PASS** — zero warnings |
| TypeScript typecheck | **PASS** |
| unit tests | **PASS 47/47** — 5 files |
| 최종 `npm run build -- --webpack` | **PASS** — optimized static Landing + dynamic signup route |
| browser tests | **PASS 40/40** — latest final build |
| 1440/393/360 전체 실제 screenshot | **PASS** — local-final-whole-{width}.png, SNS/stat viewport captures |
| SNS24초 이상·seam·80 unique·16+4 입자 | **PASS** — 각25초, 동시 사진 중복0·역방향 이동0·빈 track0; source phase 및12/24s 경계 ±2ms 검증 |
| 통계1400ms·40%·숫자/막대 동기화·reload replay | **PASS** — measured1399–1412ms; final34.3/25.3%, 각 카드40% 독립 감지·동일 탭 reload2회 |
| navigation·CTA·wheel·FAQ·form의 실제 동작 | **PASS** — keyboard/tap/swipe/focus와 success receipt·duplicate/error mock/disabled 경로 |
| repeated navigation/reload·reduced-motion·pause/cleanup | **PASS** — normal journey3회, reduced/no-JS, offscreen/background pause와 listener/RAF/observer 정리 검토 |
| overflow·overlap·console/hydration error | **PASS** —1440/393/360과 추가responsive폭, 가로 넘침0·runtime/HTTP/console 오류0 |
| 최종 code commit / push | **834b5b0 / PUSHED** — feature/mission-5-landing |
| 기존 PR #1 갱신 | **동일 feature head 반영** — title [하영]-미션5, open/unmerged |
| 이번 변경의 Vercel deployment ID / immutable URL | **READY** — dpl_CJ3sXTGH6dmLjKxj4Rqry2vzZyyg · [immutable deployment](https://praytime-mission5-ozzrxl4s2-glorifier1.vercel.app) |
| Production GET-only 재검증 | **PASS** — canonical praytime-mission5.vercel.app,1440/393/360px, 각약25초, 오류/overflow/POST0 |
| 실제 Production POST / INSERT | **0 /0 — 추가 수행 금지** |

작업 branch는 `feature/mission-5-landing`, 기존 PR은 [[하영]-미션5 #1](https://github.com/jhyglory/praytime-mission5/pull/1), 기존 Production은 [praytime-mission5.vercel.app](https://praytime-mission5.vercel.app)입니다. 기존 URL·과거 commit·과거 PASS를 이번 release 완료 근거로 사용하지 않습니다. [deployment manifest](evidence/whole-page/deployment.json)의 source commit834b5b0과 실제 canonical alias를 연결해 확인했습니다. 이후 검증 기록 commit은 문서/증거만 변경하며, 배포된 UI source와 구분합니다.

## 의도된 차이와 확인 범위

- 최신 요청의 독립 화면 조건에 따라 intro는900px viewport에서900px입니다. Figma760/680보다 Desktop140px / Mobile220px 길며 다음 SNS 구간이 비치지 않습니다.
-393px에서는 WHY32/48·26/44를 그대로 적용합니다.360px에서는3줄을 지키기 위해 약28.94px/23.51px로 조정하고 line-height48/44와 section rhythm은 유지합니다.
- 이전에 승인된 “무료로 신청하기”, GAP의04label 제거, 필수 이유 legend의별표, 지정favicon/OG는 source보다 사용자 지시를 우선해 보존했습니다.
- 전체 still screenshot은 reduced-motion의 최종 정적 상태이며, SNS 실제 모션 screenshot/25초 측정은 no-preference에서 따로 수집했습니다.
- 물리 iPhone/Android와 Safari 수동 검수는 미실시입니다. 실제 Production POST·INSERT는 이번 시각 작업에서 수행하지 않습니다.

## 배포 후 실제 재생 결과

[Production playback evidence](evidence/whole-page/production-playback.json)에서 실제 Chrome 전체 검증을 확인할 수 있습니다.1440px24998.864ms /393px25098.906ms /360px25065.668ms 재생을 측정했고, 사진 동시 중복0·역방향 이동0·정해진20/14px 카드 간격 외 빈 구간0입니다. 하트는 동시에6–9개, 공유는 fade 시0개에서 최대3개까지 보였으며 두 cycle 모두 반복 등장했습니다. 중앙 선언은 고정입니다.

숫자/게이지 동기화와 동일 탭 reload 후 재시작은 각 폭에서2회 확인했고 실제 진행 구간은1399.1–1400.4ms였습니다. 최종값34.3/25.3%와 track 길이 비율도 일치합니다. 공개 화면의 CTA·wheel·FAQ 키보드·client validation·입력 focus를 확인했습니다. form의 실제 API 호출은 차단하여 Production POST/INSERT0을 유지했습니다.

[Production intro evidence](evidence/whole-page/production-intro.json)는 타임라인을 조작하지 않은 실제 재생입니다. 세 폭에서 초기[0,0] → 단어 표시[1,0] → 실제 logo와은[1,1] 순서를 확인했습니다. intro 내부 카드/입자0, 다음 SNS scene의 top은 viewport 밖924px이었습니다(기존 anchor scroll margin24px 포함).

전체 screenshot은 production-whole-1440.png /production-whole-393.png /production-whole-360.png이며, actual motion still은 production-sns-{width}.png, production-stats-{width}.png, production-intro-word/logo-{width}.png입니다. 사용자 전달 outputs에 저장했고 고해상도 원본으로 확인했습니다. 전체 still은 reduced-motion 상태이고 실제 motion still/측정과 구분합니다. 실제 Safari/물리 기기와 추가 DB INSERT만 검수하지 않았습니다.

## 후속 사용자 수정 · Header CTA 제거

Desktop·Mobile 상단 Header의 “무료로 신청하기” 링크만 제거했습니다. Hero CTA와 form submit, 로고·navigation 위치·높이·나머지 모든 섹션은 유지합니다. header CTA 전용 CSS와 미사용 import를 정리하고 기존 responsive/CTA journey 검사를 변경된 DOM에 맞췄습니다. 기존 Figma Header CTA보다 이번 명시적 사용자 요청이 우선합니다.

이번 Header 변경의 lint·typecheck·unit47/47·Webpack production build와 관련 browser22/22가 통과했습니다. 전체40개 검증은 앞선834b5b0 기준선이며 이번 변경에서 전체를 다시 실행했다고 표시하지 않습니다.

## 후속 사용자 수정 · 사진 카드 속도0.8배

SNS 사진 카드 열의 이동 속도를 기존의0.8배로 낮춥니다. 같은 이동 거리의 cycle은12000/0.8=15000ms입니다. 하트/공유 transform·opacity는 기존12000ms를 유지합니다. 공통 누적 animation clock은 그대로 사용하고 column effect duration만 나누므로 offscreen/background pause와 phase 복원도 유지됩니다. 원본 Figma motion JSON·80사진 배정·카드 구조·이미지·다른 인터랙션은 바꾸지 않습니다. 위12초 카드 loop 검증은 이전 release 기록이며 이번15초 경계/반복 검증과 구분합니다.

이번 속도 변경의 lint·typecheck·unit47/47·browser40/40·Webpack production build가 모두 통과했습니다. 실제1440/393/360px에서 각30.1초 이상 재생,15/30초 경계±2ms, 사진 중복/coverage, 원래12초 particle transform/opacity 반복, reduced-motion·offscreen pause를 확인했습니다. 실제 DB POST/INSERT는0건입니다.

## 후속 사용자 수정 · 고화질 원본 Hero/GAP 교체

사용자가 제공한 PNG 두 장을 원본 byte 그대로 `public/assets/high-resolution/`에 추가했습니다. 파일 이름에 SHA-256 일부를 포함해 이전 이미지 캐시와 구분합니다. [원본 manifest](evidence/high-resolution-assets/originals.json)에 파일 크기·natural dimensions·전체 hash가 있습니다.

- Hero/Question:1672×941 landscape PNG. 기존1004×1566 long canvas raster 대신 원본 비율을 보존하고 공통 plane 안에서 width91%/left6.55%/top0.1%로 기존 glass-bar 크기·위치에 맞췄습니다. CSS edge mask로 section 배경과 연결하며 PNG pixel을 재압축·편집하지 않았습니다.
- GAP:1112×1415 PNG 하나로 기존 Desktop/Mobile SVG 전체를 대체했습니다. 비율 유지 크기는 Desktop약344.335×438.160, Mobile약232.933×296.403px입니다. 밝은 core는 Desktop y528–868 / Mobile y461–691과 중앙축을 유지합니다. 별도의 이전 slit/reflection layer는 겹치지 않습니다. 두 선택의 가로 divider·문구·anchor는 그대로입니다.
- GAP은native lazy/async decode를 사용해 최초Hero 요청과 분리합니다. 실제 스크롤로viewport 진입·decode·paint 후 캡처했으며, 밝은core의 실제 pixel red 최대값244/230/217로 표시를 확인했습니다. 화면 밖 full-page capture만으로 로드·paint 완료를 단정하지 않았습니다.
-1440/393/360/320px 실제 화면, 원본HTTP byte hash 일치, 비율, glass/slit 위치, CTA·텍스트와 section 높이, 가로 넘침0·오류0·실제POST0을 확인했습니다. [로컬 확인](evidence/high-resolution-assets/local-browser.json).

이번 교체의 lint·typecheck·unit47/47·관련browser37/37·Webpack production build가 통과했습니다. 원본사진80장·카드0.8배 속도와15초 cycle·입자12초·Header CTA삭제·신청API·privacy/backend/env·OG/favicon·다른섹션·main/merge/DNS는 변경하지 않았습니다. 별도30초SNS검사는 motion 코드가 같은 d78bbe0 검증과 구분합니다.
