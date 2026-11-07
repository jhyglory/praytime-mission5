# 기도 단계 순차 빛 모션

사용자의 최신 요청에 따라 01 PAUSE → 02 PRAY → 03 CHOOSE 영역만 수정한다. 기존 문구·타이포·너비·간격·모바일 세로 배치는 유지한다. 처음에는 세 단계 텍스트와 빛이 보이지 않고, 첫 단계35% 노출 시 한 번 재생한다. 빛은 각 단계 안에서 왼쪽부터 선을 그으며 흐르고 사라진다. 번호·제목·설명은 함께 등장한 뒤 남는다.

## 동작

하나의3900ms native Web Animations clock을 사용한다. 매 프레임 React state나 타이머·새 dependency를 사용하지 않는다.

| 단계 | 시작 | 선 그리기·glow 이동 | 빛 소멸 | 문구 fade |
| --- | --- | --- | --- | --- |
|01 PAUSE|0ms|0–1000ms|1000–1200ms|250–700ms|
|02 PRAY|1300ms|1300–2300ms|2300–2500ms|1550–2000ms|
|03 CHOOSE|2600ms|2600–3600ms|3600–3800ms|2850–3300ms|

완료 후 텍스트는 모두 표시되고 움직이는 빛은 숨긴다. 재진입 시 반복하지 않는다. 전체 목록이 화면 밖이거나 탭이 비활성화되면 clock을 정지하고 복귀 시 이어간다. 모바일에서 첫 단계가 화면 밖이더라도 나머지 목록이 보이면 계속 재생할 수 있도록 첫 단계의 시작 감지와 목록의 재생 감지를 분리한다.

reduced-motion/no-JS에서는 모든 텍스트와 원래 정적 빛을 즉시 표시한다. 원래 밝은 중심20/50/80%는 정적 대체 상태에서 보존하며, 일반 모션에서는 기존 highlight/halo/bloom/haze 묶음이 선의 끝과 함께 이동한다. THE GAP의 두 선택지 빛은 변경하지 않는다. observer·visibility/media listener·animation은 unmount에서 정리한다.

## 파일

- src/components/landing/prayer-steps.tsx: 원래 목록 markup과 shared clock/entry/lifecycle.
- src/components/landing/gap-light-divider.tsx: opt-in sweep wrapper, 기존 원본 SVG glow 재사용.
- src/components/landing/prayer-light-divider.css: 초기 숨김과 sweep wrapper/선 transform origin.
- src/components/landing/voluntary-prayer-section.tsx: 기존 목록 자리에서 PrayerSteps 사용.
- tests/e2e/prayer-steps.spec.ts: 실제 elapsed-time 순서/그리기/정지/정적 대체 검증.

## 검증

최종 검사와 실제 Desktop/Mobile 화면 결과는 수행 후 아래에 기록한다. 공개 화면 검수는 GET-only이며 backend/env/DB/DNS/main/merge는 변경하지 않는다.


## 최종 로컬 검증 · 2026-11-07

- npm run lint / npm run typecheck / unit60 / npm run build -- --webpack: 모두 PASS.
- 관련 browser11개: 모두 PASS(31.5초). 새 순차모션7개 + 기존 전체페이지4개. 이전 전체53개를 이번에 재실행했다고 주장하지 않는다.
- 실제 Chrome1440/393/360px에서 seek 없이3.9초 전체를 재생하고 단계별 캡처를 남겼다. 완료까지 각각3914.6/3906.2/3906.8ms. 모든 단계에서 빛의 중심과 그려지는 선의 끝이 함께 이동하며 다음 단계 전에 이전 빛이 사라진다. 번호·제목·설명의 순서와 최종 유지, 재진입 유지, 좌표 불변, 가로 넘침0, page/console error0, 실제POST0을 확인했다.
- 화면 밖·비활성 탭 정지/재개, reduced-motion 전환, no-JS 정적 가독성도 통과했다. 정적 대체 상태의 빛 중심20/50/80%와 기존 THE GAP 선택지 레이어는 보존된다.
- [실제 측정](evidence/prayer-steps/local-browser.json), [Desktop01](evidence/prayer-steps/stage-1-1440.png) / [02](evidence/prayer-steps/stage-2-1440.png) / [03](evidence/prayer-steps/stage-3-1440.png), [Mobile02](evidence/prayer-steps/stage-2-393.png).

검증한 코드를 동일 feature/PR1/Vercel에 배포하고 공개 URL에서 같은 실제 재생을 다시 확인한다. 공개 배포 commit과 결과는 PR #1에 기록한다. 물리 기기·Safari 검수 및 실제 신청 저장은 수행하지 않는다.
