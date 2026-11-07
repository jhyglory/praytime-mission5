# THE GAP · 자석처럼 끌리는 낙하

2026-11-08 사용자가 짧은 빛의 낙하를 “초반에는 천천히, 마지막에는 자석/블랙홀처럼 끌려가 붙는” 느낌으로 요청했다. 현재 활성 preset의 `fallingProgress`만 수정한다.

정규화한 낙하 시간p에 `0.15 * smootherstep(p) + 0.85 * p^8 * (45 -80p +36p^2)`를 적용했다. 첫 절반 이동은 기존22.66%에서12.15%로 줄고 최대 속도는 약77.13% 지점으로 늦어진다. 진행률은 단조 증가하고 끝의 속도/가속도는0이다. 초반에는 작은 움직임을 유지하며 마지막에 끌려간 뒤 짧게 감속하여 튕김·overshoot 없이 접점에 붙는다.

낙하900÷1.3=약692.31ms, 전체7000÷1.3=약5384.62ms와1200ms 진입 대기는 유지한다. 빛의 길이·중심·기하·접점·샴페인 팔레트·2.2SVG-unit softness·contact/hold/rise/open/settle·타이머/observer·reduced/no-JS·기존 comparison preset도 변경하지 않는다. 새로운 이펙트나 라이브러리는 없다.

## 검증

lint/typecheck·unit60·Webpack build PASS. 관련 GAP6개/전체페이지4개 browser10/10 PASS(46.0초). 기존 낙하 unit에 초기 절반의 느린 이동, 후반 최대 속도, 단조 진행을 확인하는 검증을 더했다. 기존 접촉 직전 속도/가속도·무흔적 낙하·이음선 없는 상승·최종 기하 검사도 유지한다.

로컬 production Chrome1440/393/360px의 실제 렌더에서41–42개 낙하 프레임을 기록했다. 첫 절반 이동12.17–12.19%, 최대 속도 시점76.0–77.3%, ground 접점 오차0이고 낙하 중 길이·색·무흔적·단조 진행을 유지했다.1.2초 대기/약5.4초 재생·8단계·최종 상태·reduced-motion·기하·palette도 통과했다. [실측 요약](evidence/gap-magnetic/local-summary.json). 최종 정지 그림은 이전 샴페인 빛과 같다.

배포 후 실측과 commit은 기존 PR #1 및 릴리스 산출물에 기록한다. 실제 신청 POST/DB 작업은 하지 않는다. 기존 feature 브랜치·PR #1·Vercel을 유지하고 main/merge/DNS/backend/env는 변경하지 않는다. 실물 기기/Safari/FPS는 측정하지 않았으며 직전 전체66개 이력을 이번 국소 검증으로 대신하지 않는다.
