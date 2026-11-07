# WHY NOW 설명 위치

2026-11-07 사용자 요청으로 기존 설명 문구를 두 과의존 위험군 카드 아래로 옮겼다. 순서는 WHY NOW → 제목 →20대/30대 통계 카드 → “스마트폰 사용을 줄이려는 마음이 있어도 / 익숙한 행동은 생각보다 빠르게 반복됩니다.” → 출처다. CSS order만 바꾸지 않고 DOM 읽기 순서도 변경했다.

Desktop2줄/Mobile3줄, 글자 크기·행간·회색 글자와 통계500ms 대기/1400ms 진행·34.3/25.3·빨간 장식80/70을 유지한다. 설명 아래의 출처에만 Desktop64px/Mobile40px margin을 추가했다. 설명은 기존190px 하단 gradient보다 위에 있어 회색 글자가 어두운 배경과 겹치지 않으며 출처의 gradient 안 상대 위치·색상은 그대로다. WHY auto 높이는1440px에서1027px,393/360px에서1138px다.

다른 섹션·질문3배 간격/1.2초 등장·SNS/GAP/Prayer·폼/API/backend/env/DB/DNS는 변경하지 않는다. 기존 feature/mission-5-landing · PR #1 · Vercel URL을 사용하며 merge하지 않는다.

## 검증

lint/typecheck·unit60·Webpack build를 통과했다. 관련 whole-page/WHY NOW9개가24.2초에 통과했고, 별도 모바일 카드40% 개별 진입/화면 밖 정지1개가6.7초에 통과했다(총10개,2회 실행).1440/393/360px의 DOM 읽기/화면 순서, 설명/카드/출처의 비중첩, 설명이 gradient 밖에 있음, 원래2/3줄·폰트·행간, 전체 레이아웃/CTA·reload,500+1400ms 진행·수치/게이지·취소/재개·reduced/no-JS를 확인했다.

실제 Desktop·Mobile 배치 캡처와 배포 commit은 기존 PR #1 및 릴리스 산출물에 기록한다. 모든 브라우저 검증은 disabled/mock 또는 GET-only로 실제 신청 POST를 차단한다. 직전 전체 browser66개 기록은5adc372 기준으로 구분하며 이번 국소 변경에서 전체 suite를 재실행했다고 주장하지 않는다.
