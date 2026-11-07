# 누적 interaction 보정 · 최종 배포

사용자가 모든 보정을 마무리한 뒤 기존 랜딩 주소에 배포하도록 승인했다. 기존 feature/mission-5-landing과 PR #1을 사용한다. 이전 로컬-only 보류는 이번 릴리스에서 종료되며 merge/main/DNS/backend/env/실제 신청 데이터는 변경하지 않는다.

## 반영 범위

- 질문: BEFORE YOU OPEN 제거, 기존 한국어 문구·영역·artwork 유지. 초기 숨김 후 스크롤+제목15% 노출 시800ms opacity fade. reduced-motion/no-JS는 즉시 표시.
- 통계:40% 노출 후500ms 대기, 기존1400ms 숫자/빨간 장식 동기화와34.3/25.3·80/70 스타일 유지.
- 독립 인트로: 공통 정지 대기600ms, 전체4600ms. 빛 전환과 로고 fade 길이는 유지한다. 로고가 첫 완전한 “그래서” 표시 후 정확히600ms에 시작한다고 주장하지 않는다.
- SNS: 카드가3000ms 먼저 움직인 뒤 검은 중앙 배경과 기존 문구를400ms 동시에fade. 화면 밖 대기 취소, 이미 보인 문구는 재진입/viewport 변경에도 유지. 카드/입자 clock·80개 사진·교차 방향 유지.
- THE GAP: 미리보기에서 검수한7초 모션과2초 진입 대기를 랜딩에 연결. 접촉/확산→300ms hold→상승/trail→폭 확장→정착.1.4배 바닥 빛, 미세한 면 gradient/softness, 분리된 near/far glow. 기존section 크기·빛 상단/바닥·CTA 유지.
- shadcn Button/Accordion, form/API, 기존Production 접수 동작·개인정보 guard는 유지한다. QA는 mock/disabled 또는 GET-only이며 실제 POST/DB 작업은 하지 않는다.

## 검증과 릴리스

최종 소스 기준 검사와 배포 결과를 수행 후 기록한다. 과거 단계 PASS로 대신하지 않는다. `/dev/gap-light`는 production404를 유지한다. 물리 기기/Safari와 실제 개인정보 저장은 검증 범위가 아니다.


## 최종 소스 검사 · 2026-11-07

| 검사 | 결과 |
| --- | --- |
| npm run lint | PASS · warning0 |
| npm run typecheck | PASS |
| npm run test | 60/60 PASS |
| npm run test:e2e | 53/53 PASS · 4.6분, 전체 실행 |
| npm run build -- --webpack | PASS |

브라우저 전체 실행에는 Desktop/Mobile SNS를 실제 두 주기 이상 재생하는 기존 검사도 포함했고, assertion과 timeout을 완화하지 않았다. 전경·배경/화면 밖 정지, 재진입, reduced-motion/no-JS, FAQ keyboard/focus, CTA, 시간 선택, disabled/mock 폼 결과와 필수항목 검증을 통과했다. 실제 DB INSERT는 수행하지 않았다.

## 추가 실제 경과시간 검수

로컬 production artifact를 Chrome1440/393/360px에서 실제로 스크롤하며 재생했다. 이 측정은 seek로 대신하지 않았다. 질문은 초기 opacity0 → 스크롤 후 약800ms fade, 인트로는4600ms clock과600ms paper hold 및 실제 로고 노출을 확인했다. SNS 텍스트/검은 배경은 함께400ms fade하며,80개 원본/교차 방향/21.42857초 카드 clock/12초 상승 입자는 그대로다.

| 화면 | 통계 시작 대기(두 카드) | SNS 카드 선행 | 빛 대기 / 동작 | 가로 넘침 |
| --- | --- | --- | --- | --- |
|1440px|500.7ms, 500.7ms|3001.5ms|2001.3ms / 7012.1ms|0|
|393px|501.9ms, 502.0ms|3002.9ms|2001.3ms / 7012.7ms|0|
|360px|501.2ms, 501.3ms|3003.0ms|2001.0ms / 7013.6ms|0|

THE GAP 중심·상단·바닥·섹션 높이와 두 CTA는 기존 좌표를 유지한다. 새 face gradient/0.8-unit softness 및 border/stroke/rx 없음, 단계 전환·2초 대기·7초 완료를 확인했다. Developer preview는production404이며 reduced-motion은 즉시 최종 모습을 표시한다. console/page error0, 실제 POST0, 기존 신청 데이터 접근0.

[로컬 실제 측정](evidence/final-interaction-release/local-browser.json)과 같은 디렉터리의 Desktop/Mobile 화면을 확인했다. 배포는 이 검증된 소스를 같은 feature branch와 PR #1에 반영한다. 공개 URL의 commit/배포 상태 및 배포 후 실제 측정은 PR #1과 별도 사용자 전달 evidence에 기록한다. 물리 기기·Safari와 실제 개인정보 저장은 이번 QA에서 확인하지 않았다.
