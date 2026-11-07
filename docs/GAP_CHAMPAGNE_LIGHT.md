# THE GAP · 샴페인 빛 보정

2026-11-08 사용자가 기존 흰 막대 같은 빛을 더 고급스럽게 다듬고 노란 기운을 추가하도록 요청했다. 현재 활성 `preview` preset의 SVG 색/발광면/softness만 수정한다. 이전 순백색 기준보다 이번 요청이 우선이다.

- 발광면은 밝은 아이보리 `#FFFEED`에서 `#FFF8DF`, `#FFEEC4`, 샴페인 `#F0D396`로 부드럽게 변한다. 낮은 중심부가 조금 더 밝은 radial gradient로 평면적인 균일함을 줄인다. 테두리/stroke·문틀·어두운 중심·둥근 모서리는 없다.
- near/mid/far와 바닥을 같은 샴페인 계열로 맞추고 바닥 외곽 opacity만 조금 낮춰 흰 안개 같은 인상을 줄인다. 기존 ellipse 범위와 반경은 유지한다.
- face blur는0.8→2.2SVG units, 현재 표시 크기 기준 약0.5–0.73px다. 기존 필터를 조절하며 새 필터·필터 영역·dependency를 추가하지 않는다.
- 낙하 traveler와 상승 trail core는 같은 `#FFF7DD` 단색이다. 이음선 방지 구조를 유지하고 이전 comparison preset은 원래 색과 값을 보존한다.

기존 중심·너비·높이·바닥 접점·기하·1.2초 대기·약5384.62ms(1.3배) 단계·정지/재개·reduced/no-JS·CTA를 유지한다. 다른 섹션·문구·backend/env/DB/DNS/main은 변경하지 않고 기존 feature/PR #1/Vercel을 사용한다. merge하지 않는다.

## 검증

lint/typecheck·unit60·Webpack build PASS. 관련 browser는 GAP6개+전체 페이지4개,10/10 PASS(47.4초)다. 실제 Desktop1440/Mobile393·360px 재생·최종 렌더와 배포 commit은 기존 PR #1 및 릴리스 산출물에 기록한다. 브라우저 검수는 disabled/mock 또는 GET-only로 실제 신청 POST를 차단한다. 과거 전체66개 PASS는5adc372의 이력이며 이번 국소 보정에서 전체 suite를 재실행했다고 주장하지 않는다.

로컬 production build에서 실제 약1.2초 대기/5.4초 재생과8단계·최종 상태 유지·reduced-motion을 확인했다. 모든 viewport에서 기존 상단/바닥/너비·높이와 CTA 영역·넘침0·console error0·실제 POST0을 유지했다. [실측 요약](evidence/gap-champagne/local-summary.json) · [Desktop 최종](evidence/gap-champagne/light-1440.png) · [Mobile 최종](evidence/gap-champagne/light-393.png). 실제 렌더를 직접 검토했으며 Safari/실물 기기/FPS 측정은 하지 않았다.
