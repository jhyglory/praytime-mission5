# 빛의 틈 · Stage 3 로컬 모션 미리보기

최신 배포 승인: 사용자가 누적 보정을 마무리해 기존 랜딩 주소에 배포하도록 요청했다. 이하 로컬-only/게시 보류 기록은 이전 단계의 이력이며, 현재 랜딩 연결·검증·배포는 [FINAL_INTERACTION_RELEASE.md](FINAL_INTERACTION_RELEASE.md)를 따른다.


최신 로컬 보정: `/dev/gap-light`는 별도 `variant="preview"`로 실제7초 타임라인과 접촉·확산·머무름, 미세한 발광면·광채를 검수한다. 랜딩의 기본4521.43ms 모션은 유지하며 이번 변경은 게시하지 않는다. [7초 보정 기록](GAP_LIGHT_SEVEN_SECOND_STUDY.md)이 아래 과거 단계보다 우선한다.

현재 단계 업데이트: 사용자가 완성된 모션의 랜딩 연결과 배포를 승인했다. 아래의 연결/배포 보류 문구와 기록은 미리보기 단계의 이력이다. 동일 컴포넌트를 THE GAP에서 사용하며, 현재 검증과 릴리스 상태는 [GAP_LIGHT_LANDING_RELEASE.md](GAP_LIGHT_LANDING_RELEASE.md)를 따른다. 개발용 제어 화면은 계속 production404다.

현재 기준은 새 첨부 이미지 `docs/design-assets/gap-light-ivory/reference.png`와 후속 길이/0.7배 하강 속도 조정이다. 전체 약4.52초이며 이전ZIP/14·24 폭/8px 선택/테두리·캡/3.2·4.2초 고정 타임라인보다 우선한다. 기존 랜딩 연결·commit·push·배포·PR 수정/병합은 하지 않는다.

## 실행과 조작

프로젝트 root에서 `npm run preview:gap-light`를 실행하고 [미리보기](http://127.0.0.1:3100/dev/gap-light)를 연다.

- **처음부터 다시 재생**: 실행 중인 RAF를 취소하고 어둠0ms부터 시작.
- **일시정지 / 재개**: 현재 clock을 유지하고 그 시점부터 이어서 재생.
- **타임라인**: 드래그 또는 키보드로 특정 시점에 정지. 재개하면 해당 시점부터 계속됨.
- **최종 정지 모습 보기**: 즉시 최신 타임라인 끝4521.43ms의 최종 모습 유지.
- reduced-motion: 움직임 없이 최종 모습. 타임라인/일시정지 조작은 비활성화.

이 경로는 development에서만 렌더링하며 production에서는404다. Landing은 재사용 가능한 모션 컴포넌트만 import하며 미리보기 제어 화면은 import하지 않는다.

## 현재 타임라인

| 시간 | 동작 |
| --- | --- |
| 0–200ms | 네이비 배경만 표시 |
| 200–1271.43ms | 길이7.2%의 빛이 이전의0.7배 속도로 하강.750÷0.7=1071.43ms, 잔상/바닥 빛 없음 |
| 1271.43–1771.43ms | 바닥에 닿자마자 상승하는 동시에 속이 채워진 바닥 광채가 확산 |
| 1271.43–3121.43ms | 같은 빛이 연속 상승하며 별도 trail을 남김. 선두/틈이 연결되고 상단에 합쳐짐 |
| 3121.43–4221.43ms | 높이/중심/바닥 고정, 좌우 대칭으로 발광면 폭 확장. 바닥/주변 광채도 확대 |
| 4221.43–4521.43ms | 부드럽게 정착 후 유지. 자동 반복/깜빡임/bounce 없음 |

## 새 이미지 기준과 빛의 구조

원본 PNG는1139×1381이다. 중앙 발광면은 약46×970px, x547–592/y188–1158이며 내부는 거의 균일한 밝은 아이보리다. 이를1200폭 좌표로 비례 변환했다.

- canvas:1200×1454.960
- 중심:x600 / 상단198.068 / 바닥1220.018
- 최종 면 폭:48.464,393px canvas에서는 약15.87px
- 이동 빛 길이:직전 길이에서1.5배 늘어난 최종 높이7.2% (약73.58SVG units)
- 내부 면: `#FEF9E7`, 단일 채워진 직사각형. stroke/border/가장자리 두 선/가로 캡/rx 없음.
- 배경:#080E26. 외부는 약한 아이보리/샴페인, 여러 폭의 고정 blur와 radial gradient로 감쇠.
- 바닥: 접점의 작은 광원 + 채워진 확산 타원. 링/동심원/파티클 없음.

레이어는 background / ambient / floor-spread / floor-contact / trail / face / traveler로 분리한다. PNG 전체를 늘이거나 이동시켜 모션을 대체하지 않는다. 최종 역시 SVG로 재현하므로 원본의 픽셀 노이즈까지 동일하다고 주장하지 않는다. 원본 ZIP과 이전 결과는 비교 이력으로만 보존한다.

## 구현 파일과 API

- `src/components/motion/gap-light-timeline.ts`: 유일한 clock/구간/하강 속도0.7/참고 이미지 좌표.
- `src/components/motion/gap-light-motion.tsx`: 기존SVG/RAF 구조를 활용한 layer 제어와 player controller.
- `src/components/motion/gap-light-motion.module.css`: 초기 어둠과 reduced-motion fallback.
- `src/components/dev/gap-light-preview.tsx` / `.module.css`: 재생/정지/seek UI.
- `src/app/dev/gap-light/page.tsx`: development guard와 noindex.
- `tests/gap-light-motion.test.ts`: 새 동작/발광면/좌표/ID 검증.
- `docs/design-assets/gap-light-ivory/reference.png`: 새 원본 PNG 보존.
- `AGENTS.md`: 현재 기준과 로컬 전용 범위.
- `package.json`: 기존 `preview:gap-light` 실행 script.

`GapLightMotionHandle`의 `replay()`, `pause()`, `resume()`, `seek(timeMs)`, `showFinal()`을 ref로 사용한다. 기존 `mode="animate"|"still"`, `playbackId`, `className` API도 유지한다. `onProgress(timeMs)`는 preview slider/output의 DOM만 갱신하고 React state는 재생 상태 변경 때만 갱신한다. 수동 pause/seek는 탭/화면 진입으로 자동 재개하지 않는다.

컴포넌트는 화면 밖/비활성 탭에서 멈추고 cleanup에서 RAF/observer/media/visibility listener를 해제한다. Gradient/filter/mask/clip/title ID는 인스턴스별 useId를 사용한다. 새 dependency는 없다.

## 최신 짧은 빛 / 긴 빛 접합부 수정

기존에는 짧은 코어3.8/#FFFFF6/opacity1과 긴 코어2.6/#FFFDEF/opacity0.9가 겹쳐 폭/밝기 단차가 보였다. 같은 색 두 사각형을 겹쳐도 안티앨리어싱이 중복 합성될 수 있어, 상승 중에는 선두부터 바닥까지 하나의 불투명 코어로 그린다. 이동하는 짧은 빛의 위치/halo는 별도 제어하며 접촉 직전·직후 코어 영역은 동일하다. 두 코어 폭/색과 opening 시작 폭은3.8/#FFFFF6로 맞추고 광채만 feather한다. 최종 발광면/길이/하강0.7배/즉시 상승/전체 시간은 유지한다.

1440/393/360px의 상승15%·50%·85%·97% 시점을 [측정](evidence/gap-light-join/browser.json)했다. 옛 접합 위치의 인접 픽셀 최대 채널 단차는 수정 전 최대64에서 수정 후1–2로 줄었다. [이전 화면](evidence/gap-light-join/before-393.png) / [현재 화면](evidence/gap-light-join/after-393-0.5.png). 실제 처음부터 끝까지 재생과 reduced-motion PASS, 오류·가로 넘침·POST0건. lint/typecheck/unit54/webpack build PASS. 기존 랜딩 연결·commit·push·배포는 하지 않았다.

## 직전 하강 속도0.7배 기록

하강 구간만750ms에서750÷0.7=1071.428571ms로 늘렸다. 어둠200ms는 유지하고 접촉 이후 구간은321.428571ms 뒤로 이동하여 각 구간의 재생 속도는 유지한다. 전체는4521.428571ms다. 길이7.2%/완만한 궤적/접촉 즉시 복귀/바닥 동시 확산/최종 모습은 유지한다. 슬라이더는 소수점 끝점에 정확히 도달할 수 있고 키보드 화살표10ms·Home·End 동작을 유지한다.

현재1440/393/360px [실제 재생 기록](evidence/gap-light-slower/browser.json): 설정상 하강1071.43ms, frame 단위 관측 약1066.7–1066.8ms. 접촉 직후 상승과 바닥 광채 동시 성장, 소수점 끝점End/Home/화살표10ms, reduced-motion, 오류·가로 넘침·POST0건 확인. lint/typecheck/unit53/webpack build PASS. 미리보기만 수정했으며 commit/push/랜딩 연결/배포는 하지 않았다.

## 직전 길이 추가 확장 · 전체4.2초 당시 기록

짧은 빛을 더 길게 해 달라는 후속 요청으로 직전4.8% 길이에서 다시1.5배 늘렸다. 현재 길이는 최종 높이의7.2%, 약73.58SVG units다. 타이밍/부드러운 하강/950ms 즉시 복귀/바닥 동시 확산/최종 아이보리 면은 유지한다. 현재 길이의 검수는 [별도 기록](evidence/gap-light-longer/browser.json)으로 구분한다.

현재1440/393/360px 실제 재생 확인 PASS: 빛 길이는 각각36.79/24.10/22.07CSS px, 접촉 후 즉시 상승/바닥 광채 동시 성장/최종4200ms 유지/reduced-motion/오류·가로 넘침·POST0건. lint/typecheck/unit53/webpack build PASS. 이번 길이 변경의 새 영상은 별도로 녹화하지 않았으며 아래 이전 영상은 길이4.8% 당시 기록이다. 기존 랜딩 적용·commit·push·배포는 하지 않았다.

## 직전 부드러운 하강/동시 출발 수정 · 길이4.8% 당시 기록

현재 빛 길이를1.2배로 늘리고, 하강을 양끝 속도0인 smoothstep 및 최대12SVG units의 미세한 곡선으로 조정했다. 낙하 끝과 상승 시작은 모두950ms다. 바닥에서 기다리는 구간은 없고 원형 광채와 trail도 같은 순간 시작한다. 전체4200ms/발광면 비율/색/미리보기 조작은 유지한다.

현재 Chrome1440/393/360px [실측](evidence/gap-light-gentle/browser.json): 실제 재생4217.9/4216.9/4217.5ms, 길이 모두4.8%, 궤적 최대11.997–11.998SVG units. 실제950ms 직후 trace에서 빛이 이미 바닥 위로 이동하면서 impact 반경이 함께 증가함을 확인했다. 최종 면 크기·RGB는 동일하고, pause/resume/seek/키보드/반복재생/reduced-motion/초기어둠 PASS, 오류·가로 넘침·POST0건이다. visibility handler는 이전과 같이 모의 이벤트로 검증한다.

lint/typecheck PASS, unit **53/53 PASS**(현재 모션6개), webpack build PASS. [최신 실제 재생 영상](evidence/gap-light-gentle/393-replay.webm), [접촉 직후1050ms](evidence/gap-light-gentle/393-contact-rise.png), [상승과 바닥 확산1300ms](evidence/gap-light-gentle/393-impact-rise.png). 영상도 저장 파일을 실제 재생해 낙하/상승/최종 화면과 잘림 없음을 확인했다. 기존 Landing 연결·commit·push·배포·PR 변경은 계속 보류한다.

## 직전 v3 검수 · 아래 수치는 길이/출발 수정 전 기록

2026-11-07, Chrome에서 시간을 seek하지 않은 실제4200ms 재생을 검수했다. [현재 측정](evidence/gap-light-ivory/browser.json)은 과거3200ms 결과와 분리한다.

| viewport | 실제 재생 시간 | 면의 실제 표시 폭 | 내부색9개 샘플 |
| --- | --- | --- | --- |
| Desktop1440px (canvas600px) | 4217.6ms | 24.23px | 모두 RGB254/249/231 |
| Mobile393px | 4214.3ms | 15.87px | 모두 RGB254/249/231 |
| Mobile360px | 4216.7ms | 14.54px | 모두 RGB254/249/231 |

- 최초200ms 네이비만 표시. 하강 중에는4% 길이의 traveler만 보이고 바닥/긴 trail/발광면은0. 접촉 후 속이 채워진 바닥 ellipse가 확산한다.
- 상승하는 짧은 빛과 trail의 연결, 전체 선 완성 후 대칭 폭 확장, 최종 유지, stroke/path/가로 캡/링 부재를 실제 frame trace와 화면에서 확인했다.
- 일시정지/재개,500/1200/2000/3300ms seek 후 정지 및 재개, ArrowRight/End/Home 키보드 seek, 재생 중5회 재시작, 최종 모습 유지 PASS.
- 수동 pause 후 실제 화면 밖으로 스크롤하고 돌아와도 정지 유지. visibilitychange handler는 document.hidden을 바꾸는 모의 이벤트로 pause/복귀를 검증했다. 물리 탭 전환을 수행했다고 주장하지 않는다.
- reduced-motion에서 최종 상태/슬라이더 비활성화 확인. JavaScript 실행 전 초기 화면은 빛 픽셀0개이고 reduced-motion SSR은 최종 모습을 표시한다.
- 오류/가로 넘침/실제 신청 POST0건. 새 PNG의 비율과 내부 색을 맞춘 SVG 재현이며 원본 PNG의 픽셀 노이즈까지 bit-identical하다는 주장은 하지 않는다.
- [짧은 실제 재생 영상](evidence/gap-light-ivory/393-replay.webm): 같은 페이지의 실제 Chrome CDP frame을 canvas/MediaRecorder로 녹화. source clock을 seek하지 않았다. 새 dependency/ffmpeg 설치 없음.
- 실제 화면: [어둠](evidence/gap-light-ivory/393-dark.png), [짧은 빛 하강](evidence/gap-light-ivory/393-fall.png), [바닥 접촉](evidence/gap-light-ivory/393-impact.png), [상승과 틈](evidence/gap-light-ivory/393-rise.png), [발광면 열림](evidence/gap-light-ivory/393-open.png), [최종 모습](evidence/gap-light-ivory/393-final.png).

lint PASS, typecheck PASS, unit **52/52 PASS**(기존47+현재5), `npm run build -- --webpack` PASS. 로컬 production 실행에서 `/`200/preview SVG없음, `/dev/gap-light`404를 [확인](evidence/gap-light-ivory/production-guard.json)했다. 배포는 하지 않았다.

검수 범위는 실제 Chrome의 responsive viewport다. Safari/물리 iPhone·Android 검수는 수행하지 않았다. 원본 PNG 전체를 사용한 애니메이션이나 실제 데이터 저장은 없다. 기존 feature branch/HEAD/PR·Landing/API/DB/env/dependency/lockfile은 유지하고 모든 초안은 미커밋 상태다.

## 과거 기록

- [v1 ZIP 정지 시안 및3200ms 검수](evidence/gap-light-preview/browser.json): 새 기준으로는 완료 증거가 아님.
- 원본ZIP: `docs/design-assets/gap-light-v1/`.
- 이전 v2 하강/복귀 초안은3200ms·24폭·테두리/캡이 있는 과거 구현이며 현재 구현은 이를 대체한다.
