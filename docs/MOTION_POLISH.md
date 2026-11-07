# 전체 모션 부드러움 보정

사용자가 모든 모션을 전반적으로 부드럽게 다듬도록 요청했다. 기존 디자인·문구·순서·최종 geometry와 직접 지정한 대기/전체 속도는 유지한다. 기존 feature/mission-5-landing · PR #1 · Vercel 배포 흐름을 사용하며 backend/env/DB/DNS/main/merge는 변경하지 않는다.

## 적용

- 공통 easing: CSS와 native WAAPI에 같은 `cubic-bezier(0.45,0,0.55,1)`을 사용한다. 시작·끝 속도가0인 곡선이며 focus outline은 즉시 표시한다.
- 통계:500ms 대기+1400ms를 유지하고 숫자/막대에 C2 quintic smootherstep을 함께 적용한다. 같은 숫자·상태값의 DOM 반복 쓰기를 줄인다. 값34.3/25.3과 빨간 장식80/70은 유지한다.
- GAP:1.2초 대기·1.3배속도(약5384.62ms)·모든 단계 경계·최종 빛을 유지한다. 단계 곡선은 C2, 낙하는 가속감을 유지하면서 접촉 시 속도/가속도가0으로 이어지는 비대칭 C2 곡선으로 보정한다. 같은 SVG 속성의 중복 쓰기를 줄인다.
- Prayer:3900ms·01→02→03 누적 유지. 선과 glow에 같은 공통 easing,200ms 부드러운 점등, 기존250–700ms 문구 fade를 적용한다.
- 질문/SNS 선언: 기존800ms 및1700ms 선행+400ms fade를 유지하면서 공통 easing을 적용한다.
- 인트로:4600ms/600ms hold·원본 offsets를 유지하며 viewport 변경 후 진행/완료 상태를 이어간다. reduced-motion 후 다시 켜도 이미 완료된 인트로를 반복하지 않는다.
- SNS: 카드21.42857초 linear 교차 이동·사진80장·입자12초를 유지한다. 이미 일정한 속도로 흐르는 열은 감속/가속시키지 않는다. 일부 입자의4번 opacity pulse에1–2번만 있던 상승 transform을 기존 벡터로 보완해 매번 상승하게 한다. viewport 변경 시 공유 clock을 보존한다. opacity만 공통 easing으로 정리한다.
- FAQ: 기존 shadcn Accordion/IDs/7개 문구/최종 높이와 native hidden을 유지한다.280ms 동안 본문 높이·opacity가 변하며 빠른 재토글은 현재 프레임에서 이어간다. 닫기 즉시 aria-hidden/inert, 완료 후 native hidden. 첫 열린 답변 SSR은 애니메이션 없이 표시한다.
- 시간 선택: 첫 화면은 원본10분 raster 그대로다. 첫 선택 후 stable keyed 숫자를 유지해10분 복귀도360ms 이동/회전/opacity로 이어진다. 좌우 순환 숫자는 중앙을 가로질러 겹치지 않도록 보이지 않을 때 자리 이동 후 나타난다. radio hit target도 함께 이동하며 키보드·swipe·선택 상태는 즉시 반영한다.
- 버튼/선택지/메뉴/chevron/입력색:260ms 공통 전환으로 정리한다. 전체 layout이나 Hero artwork는 움직이지 않는다. native anchor scroll과 즉시 focus는 보존한다.

모든 추가 전환은 reduced-motion에서 즉시 최종 상태이며 no-JS 가독성을 유지한다. 새 dependency/scroll hijacking/전체 카드의 will-change/eager loading은 추가하지 않는다. 중복 DOM 쓰기 감소는 코드에서 확인한 최적화이며 특정 FPS 향상을 측정 없이 보장하지 않는다.

## 검증

2026-11-07 최종 소스에서 실행했다. 과거 PASS로 대신하지 않는다.

| 검사 | 결과 |
| --- | --- |
| `npm run lint` | PASS · warning0 |
| `npm run typecheck` | PASS |
| `npm run test` |60/60 PASS ·7 files |
| `npm run test:e2e` |66/66 PASS ·4.9분 |
| `npm run build -- --webpack` | PASS |

전체 browser suite에는1440/393/360px에서 SNS 두 주기 이상(42.857초 초과)의 반복·양방향 연결·화면 내 사진 중복 검사, 입자20개의 모든 반복 상승, 통계500+1400ms 동기화와 reload, intro/viewport 이어 재생, GAP/Prayer 진입·정지·재개, FAQ 중간 높이·빠른 역전·ARIA·keyboard, wheel10→15→10 순환 fade와 reduced-motion을 포함한다. 기존 CTA·폼 validation·disabled/mock API·no-JS·전체 레이아웃도 회귀 검사했다.

처음 제한 환경의 browser 서버는 `listen EPERM 127.0.0.1:3000`으로 실행되지 않았다. 포트 사용이 가능한 승인된 환경에서 같은 명령으로66개를 모두 통과했다. 앱이나 build 설정을 우회 변경하지 않았다.

추가로 production build를 Chrome1440/393/360px에서 실제 시간으로 재생하고 화면을 캡처했다. 시간 탐색으로 최종 프레임을 대신하지 않았으며 통계 약500ms 대기, SNS 약1700ms 선행/400ms fade, GAP 약1200ms 대기/5384.62ms 재생, Prayer 약3900ms 누적과 FAQ280ms/wheel360ms의 중간 프레임을 확인했다.393px에서는 입자12.3초 관찰로20개 모두 최소4번 상승했다. geometry·넘침·console 오류·신청 POST 없이 required validation·reduced-motion·개발 경로production404도 검사했다. 요약과 대표 화면은 [로컬 실측](evidence/motion-polish/local-summary.json)에 기록한다.

브라우저 검증은 disabled/mock 또는 GET-only로 실제 신청 POST를 차단했다. 실물 휴대전화·Safari·FPS 수치는 측정하지 않았으며 영상은 bundled ffmpeg가 없어 생성하지 않았다. 배포 commit과 공개 URL의 후속 실측은 기존 [PR #1](https://github.com/jhyglory/praytime-mission5/pull/1)과 릴리스 산출물에 기록한다.

대표 캡처: [Desktop SNS](evidence/motion-polish/sns-copy-1440.png) · [Mobile SNS](evidence/motion-polish/sns-copy-393.png) · [Desktop FAQ](evidence/motion-polish/faq-open-1440.png) · [Mobile FAQ](evidence/motion-polish/faq-open-393.png). 각1440×900/393×900 viewport의 실제 화면이며 애니메이션 자체의 평가는 위의 시간별 중간 프레임 검사로 확인했다.
