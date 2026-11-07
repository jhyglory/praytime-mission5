# SNS 카드 뒤 텍스트 등장 · 로컬 보정

현재 대기시간은1700ms입니다. 이전3000ms/900ms 측정은 이력이며 이번 timing 검수 결과는 FINAL_INTERACTION_RELEASE.md의 후속 기록을 따릅니다.

최신 배포 승인: 사용자가 누적 보정을 마무리해 기존 랜딩 주소에 배포하도록 요청했다. 이하 로컬-only/게시 보류 기록은 이전 단계의 이력이며, 현재 랜딩 연결·검증·배포는 [FINAL_INTERACTION_RELEASE.md](FINAL_INTERACTION_RELEASE.md)를 따른다.


이전3000ms 단계의 [실제 Chrome 검수](evidence/sns-copy-reveal-3000/capture.json): Desktop1440 대기3001.7ms/fade400.6ms, Mobile393 대기3002.0ms/fade401.8ms. 초기에는 문구/quiet opacity0, 이후 두 레이어 동시fade/최종opacity1, 기존 카드 clock·교차 방향과 오류/POST0건을 확인했다. lint/typecheck/unit60 PASS. 이 단계는 로컬 변경이며 재배포하지 않았다.

최신 사용자 요청에 따라 SNS scene에는 처음에 카드만 표시하고1700ms 뒤 기존 선언·보조 문구와 중앙 검은 배경을 함께400ms fade-in한다. 카드의 속도/교차 방향/80개 사진/하트·종이비행기/scene 크기·문구·줄바꿈은 유지한다. 별도의 clean intro에는 이 배경이나 카드를 추가하지 않는다.

- `signature-transition.tsx`: 독립 entry timer와 `data-copy-state` pending/waiting/revealing/shown.5% scene 노출 시 대기 시작. 화면 밖/비활성 탭의 대기는 취소 후 재진입 시 다시 기다린다. 등장 중 이탈하면 최종 상태로 끝내고 재진입 시 다시 숨기지 않는다. cleanup은 두 timer와 observer/listener를 정리한다.
- `signature-transition.css`: declaration과 quiet layer를 동시에opacity로 전환한다. quiet의 기존 너비/위치/blur는 유지하며 중심색을 검정으로 조정한다. reduced-motion/no-JS에서는 즉시 읽을 수 있는 모습이다.
- 기존 WAAPI stream 배열/clock은 변경하지 않는다. stream 전용 테스트는 short CSS fade가 끝난 뒤 기존 카드·입자 inventory를 검사한다.

실행: `npm run preview:gap-light` 서버의 `http://127.0.0.1:3100/`에서 SNS 구간으로 이동한다. `/dev/gap-light`는 별도 빛 미리보기이며 이 문구가 있는 SNS scene은 랜딩 `/`에 있다.

이하900ms 검수는 이전 단계 기록이다. 현재 대기는1700ms이며 fade400ms는 유지한다.

lint/typecheck/unit60/webpack production build PASS. 관련 browser6개 PASS(37.8초): 새 Desktop1440/Mobile393의900ms 대기·동시fade·화면 밖 대기 취소·재진입 최종 유지·reduced-motion, 실제 no-JS 가독성, 기존 clean intro/scene geometry,500ms 통계 대기·취소. 타이밍은 browser내 MutationObserver와RAF로 측정하며 text/quiet의 opacity가 함께 바뀌는지 검사한다. SNS의 장기 두 주기 전체 검사까지 이번에 재실행했다고 주장하지 않는다.

viewport 변경 시 이미 등장한 문구를 유지하는 마지막 보정 후 lint/typecheck/unit60/webpack build를 다시 통과했고 관련 SNS browser3개도 PASS(10.9초)했다. 최초 캡처의 Desktop 종료 상태가 waiting으로 되돌아간 것을 확인해 persistent ref를 추가했고, 최종 캡처는 전후 shown/opacity1 상태를 추가 검증한다.

[실제 로컬 화면 기록](evidence/sns-copy-reveal/capture.json): Desktop1440의 등장 대기901.5ms/fade401.1ms, Mobile393의 대기900.4ms/fade401.2ms. 초기 캡처는 각각 진입 후270.9/183.5ms이며 text/quiet가 모두0인 상태를 전후로 검증했다. [Desktop 전](evidence/sns-copy-reveal/before-1440.png) / [후](evidence/sns-copy-reveal/after-1440.png), [Mobile 전](evidence/sns-copy-reveal/before-393.png) / [후](evidence/sns-copy-reveal/after-393.png). 최종 캡처 전후에도 shown/opacity1을 검증했다. 기존 column/particle clock·교차 방향을 확인했고 실제 POST/console·page 오류0건이다. 한 번 등장한 copy는 ref에 기록해 viewport breakpoint나 모션 설정이 바뀌어도 다시 숨기지 않는다.

기존500ms 통계 대기와 미리보기 전용2000ms 빛 대기/7000ms 모션 등 미커밋 작업을 유지한다. commit/push/배포/PR/merge/backend/DB/env/DNS 변경은 하지 않는다.
