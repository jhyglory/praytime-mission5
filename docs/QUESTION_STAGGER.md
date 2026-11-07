# 질문 두 문장의 순차 등장

2026-11-07 사용자 요청으로 질문만 수정한다. “무심코 열게 된 SNS,”가 먼저 등장하고 첫 문장의 시작에서1200ms 뒤 나머지 문장이 등장한다. 각 fade는 기존800ms/shared easing이며,800–1200ms에는 첫 문장만 완전히 보이고 총 약2000ms에 두 문장이 모두 보인다.

최신 추가 요청은 문장 사이 행간을 최소3배로 넓혀 뜸을 들이는 것이다. 두 문장의 시작 간격은 Desktop80→240px, Mobile48→144px다. 각 문장을 block span으로 두고 사이의 `<br>`만 제거하며 후속 문장에 Desktop160px/Mobile96px margin을 둔다. 후속 문장 내부 Mobile 줄바꿈·Desktop 공백과 기존80/48px line-height, 글자 크기·이미지·heading label은 유지한다. 이 의도적인 간격 증가로 질문 섹션만 Desktop416→576px/Mobile320→416px가 된다.

`whole-upper.css`의 opacity 전환을 각 span에 적용한다. 같은 scroll +15% visibility trigger와 한 번 나타난 뒤 유지하는 controller를 재사용한다.1200ms stagger/각800ms fade는 유지하며 추가 JS 타이머·dependency는 없다. CSS delay는 화면 밖에서도 완료되며 offscreen pause 기능을 새로 추가했다고 주장하지 않는다.

normal motion에서만 숨김/지연 규칙을 적용한다. reduced-motion/no-JS에서는 두 문장을 즉시 읽을 수 있다. 다른 모션·폼·API·backend·env·DB·DNS·main은 변경하지 않는다. 기존 feature/mission-5-landing · PR #1 · Vercel 주소를 유지하며 merge하지 않는다.

## 검증

간격 보정 소스에서 lint/typecheck·unit60·Webpack build와 관련 브라우저9/9 PASS(24.1초)를 확인했다.1440/393/360px에서 두 문장 시작 간격이 line-height의3배인지, 내부 행간이 같은지와 기존1200ms 순차 등장·첫 문장만 보이는 구간·중간 opacity·애니메이션 중 기하 유지·재진입·reduced/no-JS·전체 페이지·반복 reload를 검증했다. 실제 POST는 차단했다. 직전 순차 등장 패치의9/9 PASS(28.3초)는5f7ef14 기준이다.

배포 후 공개1440/393/360px 실측과 캡처, commit은 기존 PR #1과 릴리스 산출물에 기록한다. 직전 전체 browser66개 PASS는 이전 커밋5adc372 기준이며, 이번 국소 변경에서는 영향받은9개를 검증했다.
