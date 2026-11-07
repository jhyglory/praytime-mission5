# 느린 낙하 연장과 WHY NOW 밝은 배경

2026-11-08 사용자의 최신 요청 두 가지를 함께 반영한다.

1. 낙하 초반을400ms 늘린다. 기존 전반346.154ms를746.154ms로 확장하고 source clock을0.387334315x로 시작해 마지막186.538ms 동안1x로 부드럽게 연결한다. quintic smootherstep의 적분을 사용해 연결점의 속도·가속도가 연속이며 멈춤/역행이 없다. 원래 마지막346.154ms의 magnetic pull은 같은 위치·속도로 유지한다. 낙하1092.308ms, 전체 동작5784.615ms이며 이후 단계는400ms씩 뒤로 이동할 뿐 길이는 같다.1200ms 진입 대기·샴페인·기하·이음선 방지·정지/재개·reduced/no-JS는 유지한다. 미리보기 slider/단계/시간 표시는 기존 공유 상수를 통해 함께 갱신된다.
2. WHY NOW 하단의190px dark gradient pseudo-element를 제거한다. 카드 아래 설명과 출처까지 전체가 Soft Paper #F5F2F7이며 출처는#696a70/opacity1로 조정한다. DOM 순서·문구·줄바꿈·폰트·64/40px 출처 여백·section 높이1027/1138px·통계 모션은 유지한다. 다른 section 배경은 변경하지 않는다.

## 검증

lint/typecheck·unit60·Webpack build PASS。관련 GAP6개+whole-page4개 browser10/10 PASS(50.1초). 단위 검사는 길어진 전반과 원래 magnetic tail의 고정된 위치/속도·단조 진행·부드러운 접촉, 이후 단계의 동일한 간격을 확인한다. 브라우저에서는3개 viewport의 새 전체 시간/정지/재개/최종 상태와 gradient 없음·출처 색상·opacity·기존 배치/typography/reload를 확인했다. 공개 Desktop/Mobile 실측·캡처·commit은 기존 PR #1과 릴리스 산출물에 기록한다. 실제 신청 POST/DB 작업은 하지 않으며 기존 feature/PR1/Vercel을 사용한다. main/merge/DNS/backend/env는 변경하지 않는다. 이전692.31ms 낙하·190px gradient 기록은 과거 이력이다.
