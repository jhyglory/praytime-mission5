# 기도 단계 순차 빛 모션

사용자의 최신 요청에 따라 01 PAUSE → 02 PRAY → 03 CHOOSE 영역만 수정한다. 기존 문구·타이포·너비·간격·모바일 세로 배치는 유지한다. 처음에는 세 단계 텍스트와 빛이 보이지 않고, 첫 단계35% 노출 시 한 번 재생한다. 빛은 각 단계 안에서 왼쪽부터 선을 그으며 나타난 뒤 계속 남는다. 번호·제목·설명과 앞 단계의 빛도 함께 유지되어01→01+02→01+02+03으로 누적된다.

## 동작

하나의3900ms native Web Animations clock을 사용한다. 매 프레임 React state나 타이머·새 dependency를 사용하지 않는다.

| 단계 | 시작 | 선 그리기·glow 이동 | 빛 유지 | 문구 fade |
| --- | --- | --- | --- | --- |
|01 PAUSE|0ms|0–1000ms|등장 후 계속|250–700ms|
|02 PRAY|1300ms|1300–2300ms|등장 후 계속|1550–2000ms|
|03 CHOOSE|2600ms|2600–3600ms|등장 후 계속|2850–3300ms|

완료 후 세 단계 텍스트·그려진 선·glow를 모두 유지한다. glow는 선을 그린 끝에서 정지한다. 재진입 시 반복하지 않는다. 전체 목록이 화면 밖이거나 탭이 비활성화되면 clock을 정지하고 복귀 시 이어간다. 모바일에서 첫 단계가 화면 밖이더라도 나머지 목록이 보이면 계속 재생할 수 있도록 첫 단계의 시작 감지와 목록의 재생 감지를 분리한다.

reduced-motion/no-JS에서는 모든 텍스트와 원래 정적 빛을 즉시 표시한다. 원래 밝은 중심20/50/80%는 정적 대체 상태에서 보존하며, 일반 모션에서는 기존 highlight/halo/bloom/haze 묶음이 선의 끝과 함께 이동한다. THE GAP의 두 선택지 빛은 변경하지 않는다. observer·visibility/media listener·animation은 unmount에서 정리한다.

## 파일

- src/components/landing/prayer-steps.tsx: 원래 목록 markup과 shared clock/entry/lifecycle.
- src/components/landing/gap-light-divider.tsx: opt-in sweep wrapper, 기존 원본 SVG glow 재사용.
- src/components/landing/prayer-light-divider.css: 초기 숨김과 sweep wrapper/선 transform origin.
- src/components/landing/voluntary-prayer-section.tsx: 기존 목록 자리에서 PrayerSteps 사용.
- tests/e2e/prayer-steps.spec.ts: 실제 elapsed-time 순서/그리기/정지/정적 대체 검증.

## 검증

최신 사용자 요청은 빛을 제거하지 않고 누적 유지하는 방식이다. 아래 소멸 방식의 측정/캡처는 이전 단계의 이력이며 최신 보정 결과는 문서 마지막에 기록한다.

최종 검사와 실제 Desktop/Mobile 화면 결과는 수행 후 아래에 기록한다. 공개 화면 검수는 GET-only이며 backend/env/DB/DNS/main/merge는 변경하지 않는다.


## 이전 소멸 방식 검증 · 3255bbc (현재 방식으로 대체됨)

- npm run lint / npm run typecheck / unit60 / npm run build -- --webpack: 모두 PASS.
- 관련 browser11개: 모두 PASS(31.5초). 새 순차모션7개 + 기존 전체페이지4개. 이전 전체53개를 이번에 재실행했다고 주장하지 않는다.
- 실제 Chrome1440/393/360px에서 seek 없이3.9초 전체를 재생하고 단계별 캡처를 남겼다. 완료까지 각각3914.6/3906.2/3906.8ms. 모든 단계에서 빛의 중심과 그려지는 선의 끝이 함께 이동하며 다음 단계 전에 이전 빛이 사라진다. 번호·제목·설명의 순서와 최종 유지, 재진입 유지, 좌표 불변, 가로 넘침0, page/console error0, 실제POST0을 확인했다.
- 화면 밖·비활성 탭 정지/재개, reduced-motion 전환, no-JS 정적 가독성도 통과했다. 정적 대체 상태의 빛 중심20/50/80%와 기존 THE GAP 선택지 레이어는 보존된다.
- [실제 측정](evidence/prayer-steps/local-browser.json), [Desktop01](evidence/prayer-steps/stage-1-1440.png) / [02](evidence/prayer-steps/stage-2-1440.png) / [03](evidence/prayer-steps/stage-3-1440.png), [Mobile02](evidence/prayer-steps/stage-2-393.png).

검증한 코드를 동일 feature/PR1/Vercel에 배포하고 공개 URL에서 같은 실제 재생을 다시 확인한다. 공개 배포 commit과 결과는 PR #1에 기록한다. 물리 기기·Safari 검수 및 실제 신청 저장은 수행하지 않는다.


## 최신 누적 유지 보정 · 2026-11-07

빛의 fade-out만 제거했다. 처음에는 숨김이며01이 그려지면 유지하고, 다음02/03을 추가하여 최종 빛/선/텍스트가 모두 남는다. 기존3900ms 타임라인·1300ms 간격·그리기 속도·glow 이동·색·위치·정지/재개·정적 대체는 유지한다. 다른 빛 모션의1.3배 속도와1.2초 대기는 변경하지 않는다.

- lint/typecheck/unit60/webpack production build: PASS.
- 관련 browser11개: PASS(33.4초), Prayer7 + 전체페이지4. 이번 수정에서 전체 browser suite를 재실행했다고 주장하지 않는다.
- 실제 Chrome1440/393/360px에서3905.0/3901.2/3916.1ms 전체 재생·단계별 실제 캡처를 확인했다. 먼저 나타난 빛/선의 opacity·길이가 줄지 않고 이후 단계에서도 남으며, 최종·재진입 모두 light=[1,1,1], line=[1,1,1]이다. 문구/좌표/크기 보존, 가로 넘침0, page/console error0, 실제POST0.
- [현재 실측 요약](evidence/prayer-steps-accumulate/local-summary.json), [Desktop 최종](evidence/prayer-steps-accumulate/final-1440.png), [Mobile 최종](evidence/prayer-steps-accumulate/final-393.png), [Desktop 두 빛 누적](evidence/prayer-steps-accumulate/stage-2-1440.png).

이 검증 소스를 기존 feature/PR1/Vercel에 반영한다. 공개 주소의 후속 검수와 배포 commit은 PR #1에 기록한다. backend/env/DB/DNS/main/merge는 변경하지 않는다.
