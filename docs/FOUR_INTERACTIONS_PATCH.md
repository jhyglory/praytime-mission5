# 네 가지 인터랙션 수정 · 2026-11-06

후속 타이밍 요청: “그래서”의 완전 표시 시간을1500ms 추가했다. 전체4초 원본은5.5초로 늘고, 단어의 fade-in310–533.2ms는 유지한다. 완전 표시533.2–2240ms, fade-out2240–2446ms이며 흰 배경도 추가 hold 중 opacity1을 유지한다. 뒤의 빛·로고는1500ms씩 늦추고 각각의 전환 길이·easing·레이아웃은 보존했다. 아래4초 인트로의 측정·배포 정보는 이 후속 요청 이전 기록이다. 나머지 세 인터랙션과 backend는 변경하지 않았다.

후속 변경 검증: lint/typecheck/unit47/47/관련 browser24/24(38.6s)/Webpack build PASS. 실제1440/393/360px에서 단어 완전 표시 약1700ms, 추가 hold 중 단어·흰 배경 opacity1, 화면 밖 clock0, reduced-motion, 오류/가로 넘침/신청POST0을 확인했다. [실측](evidence/intro-hold/local-browser.json). SNS 모션 코드는 동일하며 앞선40개 전체 검사·두 cycle 기록과 이번24개 실행을 구분한다. 후속 배포 식별자와 공개 검증은 PR #1에 기록한다.

현재 명세는 사용자의 최신 네 항목 요청이다. 기존 Desktop·Mobile 전체 Landing, 제품 흐름, backend·개인정보 고지, 다른 문구·레이아웃·기능을 보존한다. 아래 새 검사 결과가 채워지기 전까지 과거 release의 PASS나 screenshot을 이번 변경의 완료 근거로 사용하지 않는다.

## Figma 근거

파일: `J8iLsfruyMwVCakXsSJPq4`.

| 대상 | 기준 node |
| --- | --- |
| 전체 Desktop / Mobile | `1209:514` / `1209:1051` |
| 복원된 독립 인트로 Desktop / Mobile | `1265:8075` / `1265:8099`, 내부 최신 `1339:*` 복원 레이어 |
| 인트로 모션 reference board | `1265:8215` / `1265:11339` |
| board 내부 실제 preview scene | `1265:8216` / `1265:11340` |

전체 화면의 나머지 구간은 기존 source를 유지한다. 이번 사용자 지시가 이전 all-UP15초, 전체 네이비 인트로, PAUSE/CHOOSE 중앙 빛 규칙보다 우선한다. Figma 파일 자체를 수정하지 않는다. Root의 최신 `get_design_context`/screenshot/`get_motion_context` 확인과 프로젝트 로컬 asset/track을 함께 기준으로 삼는다.

## 1. 종이비행기 공유 아이콘

SNS 카드 내부와 떠오르는 공유4개를 같은 `PaperPlaneIcon` outline SVG로 통일한다. 카드별 기존 icon slot·stroke 색·투명도·like count/본문 위치는 유지한다. 떠오르는 icon은 기존18px 기준 슬롯과 각 particle scale을 유지하고 상위 transform/opacity 트랙만 따른다. 상자 위 화살표 glyph의 활성 callsite를 제거한다. 장식용 SVG는 `aria-hidden`이며 키보드 탐색 대상이 아니다.

## 2. 카드 속도0.7배와 열 방향 교차

직전 실제 카드 cycle은 **15000ms**다. 새 이동 속도는 직전의70%이므로 동일한 이동 거리에서 **15000÷0.7=21428.571428571428ms**, 약21.43초다. duration을0.7배로 줄이지 않는다.

- Desktop6열: **↑ /↓ /↑ /↓ /↑ /↓**.
- Mobile3열: **↑ /↓ /↑**.
- 위쪽 열은 `0 → -cycleHeight`, 아래쪽 열은 `-cycleHeight → 0`이며 열 전체가 함께 움직인다. source의 상대 y phase와 두 동일 tile을 보존해 초기·반복 경계의 coverage를 유지한다.
- 원본80개 사진 배정과 앱별 카드 종류·높이·중앙 문구는 유지한다. 한 base cycle에서 사진은 정확히 한 번씩 배정되고 원본/복제 tile이 동시에 같은 사진을 드러내지 않아야 한다.
- 하트16개와 종이비행기4개는 **기존12000ms 상승 motion**이다. 카드의 교차 방향·새 duration을 입자에 적용하지 않는다.
- 기존 공통 animation clock, 화면 밖/비활성 탭 pause, observer/listener/animation cleanup과 정적인 reduced-motion을 보존한다.

양방향 검사에서는 두 cycle 이상(42.857초 초과)의 실제 재생, seam 전후±2ms와81개 phase 표본, 이전 속도 대비0.7 비율, 빈 구간·사진 중복·역방향 오류를 확인한다.

## 3. 단계별 빛 중심

각 단계 영역 너비를 기준으로 **01 PAUSE20% /02 PRAY기존50% /03 CHOOSE80%**에 밝은 highlight와 주변 glow를 배치한다. Mobile 세로 stack에도 같은 비율을 적용한다. 긴 divider의 끝점·숫자·제목·본문·단계 위치를 움직이지 않으며 glow의 높이·색·밝기·blur도 유지한다. THE GAP의 choice divider는 이 변경 대상이 아니다.

## 4. 흰색에서 네이비로 이어지는 독립 인트로

복원된 Figma의 **4000ms 진입 timeline**을 사용한다. 흰색/light 영역의 검은 **그래서**가 단어 전체로 등장하고, 기존 얇은 빛과 aperture/background 전환이 이어진 뒤, 네이비에 실제 빨간 Pause Mark·워드마크와 **은**이 등장한다. 인트로에 도달했을 때 한 번 시작하며 화면 밖이나 비활성 탭에서 시간이 소모되지 않게 한다.

점 세 개와 **행동하기 전에, 잠깐의 틈을 만듭니다.** 문구는 제거한다. 브랜드는 실제 asset을 사용하며 일반 텍스트/임의 Pause mark로 대체하지 않는다. reduced-motion/no-JS는 읽을 수 있는 정적 white/brand 구성을 제공한다.

인트로는 다음 SNS 카드 section과 분리하고 clipping/stacking을 유지한다. 인트로에는 카드·앱 이름·사진·하트·종이비행기가 없다. 다음 SNS section의 **손이 먼저 움직인 순간, /다시 생각할 시간을 돌려드립니다.** 및 **잠깐 기도하고, 필요한 만큼만 선택합니다.**는 유지하며그래서/로고를 중복 표시하지 않는다. auto-scroll이나 scroll hijacking을 추가하지 않는다.

## 검증과 release 상태

| 항목 | 이번 패치 상태 |
| --- | --- |
| lint | PASS |
| typecheck | PASS |
| unit | PASS47/47 |
| browser | PASS40/40,3.3m |
| Webpack production build | PASS |
| Desktop·Mobile 네 항목 실제 실행 screenshot | 로컬 및 Production1440/393/360 PASS |
| SNS 실제 두 cycle·0.7속도·방향·seam·사진 중복·입자 | PASS — 실제44.45/44.10/44.48초, 중복/빈 구간0 |
| 인트로 실제 진입·순서·빛 전환·dots/옛 문구 제거 | PASS — 최초 화면 밖0ms 유지, 실제4s 진입 재생 |
| Prayer 빛20/50/80·divider/text geometry 보존 | PASS — 각 highlight/halo/bloom/haze20/50/80%, 긴 선 불변 |
| reduced-motion·offscreen/background·cleanup·기존 interaction 회귀 | PASS — 정적 글/로고·카드, observer/animation cleanup, CTA/FAQ/wheel/form 회귀 |
| 이번 source commit / push | 6ba19d90c6534ef839947af2dddd04e691eb3cba / PUSHED |
| 기존 PR #1 업데이트 | 동일 feature head 반영, [정하영]-미션5 / open·unmerged |
| Vercel Ready 및 실제 Production 재확인 | dpl_FZJKoB3G8tiwx7ANk375YT1qce3T / 공개1440·393·360 PASS |

Release는 기존 `feature/mission-5-landing`, 공개 저장소, **[[정하영]-미션5 #1](https://github.com/jhyglory/praytime-mission5/pull/1)** 및 기존 Vercel 프로젝트를 사용했다. 실제 DB 조회/INSERT/변경·env/schema/RLS 변경·merge·main 수정·reset/rebase/force push·DNS 변경은 수행하지 않았다. 공개 QA는 signup endpoint를 차단했다. 아래에 실제 검사 결과·screenshot·source commit·배포 식별자를 기록했다.

## 실제 Production 확인

[공개 사이트](https://praytime-mission5.vercel.app/)와 [검증된 immutable 배포](https://praytime-mission5-nfmsskk23-glorifier1.vercel.app)는 위 source commit의 결과다. [배포 manifest](evidence/four-changes/deployment.json)와 [실제 브라우저 측정](evidence/four-changes/production-browser.json)에 확인 내용을 기록했다.

1440px44.2165초 /393px44.149초 /360px44.3984초 동안 타임라인을 seek하지 않고 실제 재생했다. 모두 새 주기21.428571초를 두 번 넘겼으며 열 방향·이전 속도 대비0.7·실제 사진80개/원본 cycle 중복0·동시 사진 중복0·빈 track0·고정 중앙 문구를 확인했다. 하트는 최대9개, 종이비행기는 최대3개가 동시에 보였으며 두 cycle 모두 반복 등장했다. 카드 내부와 입자의 모든 활성 공유 아이콘은 paper plane이다.

인트로는 최초 화면 밖에서800ms 기다려도 clock0을 유지했고 실제 진입 후 흰 영역의 검은 단어 → slit/aperture → 투명 실제 로고와 은 순서를 확인했다. 인트로 내부 SNS/입자·점·옛 문구0, 다음 SNS의 중복 브랜드0이다. reduced-motion은 읽을 수 있는 정적 단어·로고·카드를 제공한다.

Prayer 각 영역의 highlight·near halo·bloom·haze 중심은20/50/80%다. 긴 선의 시작·너비·높이, 타이포와 UI 높이는 그대로다. 실제 공개 화면의 page/console/HTTP 오류·가로 넘침·signup POST는 모두0건이다. API·privacy version·env·schema·RLS·기존 데이터에 변경이 없다.

| 실제 배포 screenshot | Desktop | Mobile393 |
| --- | --- | --- |
| 흰색 단어 | [그래서](evidence/four-changes/intro-word-desktop.png) | [그래서](evidence/four-changes/intro-word-mobile.png) |
| 네이비 실제 로고 | [로고](evidence/four-changes/intro-logo-desktop.png) | [로고](evidence/four-changes/intro-logo-mobile.png) |
| 종이비행기·SNS 두 cycle 후 | [SNS](evidence/four-changes/sns-two-cycles-desktop.png) | [SNS](evidence/four-changes/sns-two-cycles-mobile.png) |
| 단계별 빛 | [Prayer](evidence/four-changes/prayer-desktop.png) | [Prayer](evidence/four-changes/prayer-mobile.png) |

추가 검증 기록 commit은 위 배포 이후의 문서·스크린샷만 포함하며 애플리케이션 source와 구분한다. 물리 iPhone/Android·Safari는 별도 수동 검수를 수행하지 않았다.

로컬 실제 측정: [local-browser.json](evidence/four-changes/local-browser.json). 원본 screenshots는 outputs/four-local-*에 저장했다. 실제 재생 중 관찰한 프레임과 E2E의 seam ±2ms/81개 phase seek 검증은 별도로 구분했다.

복원 인트로의 기존 PNG 로고에는 네이비 배경이 포함돼 aperture 위에서 사각 경계가 드러났다. Figma의 실제 inherited wordmark `1339:37732` / `1339:37867`을 투명 vector SVG로 export하여 원본 크기277×45 /177×29로 사용한다. 빛8개도 최신 디자인 context의 원본 SVG다. 위치·blur/filter padding을 보존하고 `public/assets/restored-intro/`에 저장했다. 원본 picture/SVG·투명 배경은 실제 화면에서 확인했으며 새 브랜드 로고를 임의 제작하지 않았다.

4초 원본 타임라인의 주요 시점은 그래서310–533ms 등장/740–946ms 퇴장, paper533–1032ms 퇴장, slit963–1746ms, aperture1118–2322ms, 실제 로고1410–1703ms 등장 후 유지다. 같은 opacity를 쓰는 세 글자 트랙은 사용자 지시에 따라 단일 단어로 합쳤다. 전체 preview의16초 scene 교차 fade/loop는 별도 SNS section에 적용하지 않는다.

### 브라우저 검사 기준 보정

첫 통합 실행의 속도 검사에서 DOMMatrix 문자열 반올림으로 실제 비율이 `0.7000124905`로 관측됐다. 정확한 duration 비율 검사는 유지하고 좌표 기반 실측은 절대 오차 `0.0001` 이내로 허용한다. 또한 텍스트·채팅·알림이 섞인 masonry에서는 특정 위상에 사진이5개 보이는 것이 정상이다. 임의의 최소6장 조건을 제거하고 보이는 사진의 존재·동시 중복0과 모든 열의 카드 coverage/간격을 각각 검사한다. 실제 두 주기 재생과 seam 전후·81개 phase 검사는 유지하며 이 보정은 애플리케이션 속도나 카드 배치를 변경하지 않는다.
