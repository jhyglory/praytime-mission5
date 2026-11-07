# 빛의 틈 · Landing 연결 및 배포

## 범위와 승인

사용자가 완성된 로컬 GapLightMotion의 랜딩 연결 및 배포를 승인했다. 미리보기 단계의 게시 보류는 종료되었다. 기존 feature/mission-5-landing과 PR #1을 유지하고 merge/main/DNS/backend/env/실제 신청 데이터는 변경하지 않는다.

## 구현

- `GapSection`의 정적 중앙 PNG만 동일한 `GapLightMotion`으로 교체한다. 제목·본문·두 anchor와 section1180/1024px 높이는 유지한다.
- 기존 빛의 상단/바닥 축을 보존한다: Desktop528/868px, Mobile461/691px(각 섹션 내부 기준). 아이보리 시안의 내부 비율에 맞춰 SVG canvas만 배치한다. 캔버스 전체를 scaleX로 늘리지 않는다.
- SVG20% 노출 시 한 번 재생한다. 약4521.43ms 타임라인,7.2% 높이의 짧은 빛,0.7배 하강 속도, 닿자마자 상승·바닥 확산, 이음선 없는 중심 빛, 최종 borderless 면을 그대로 사용한다.
- 화면 밖/비활성 탭에서는 clock을 멈추고 복귀 시 이어간다. 완료 후 재진입하면 최종 상태를 유지한다. 고유 SVG ID와 cleanup을 보존한다.
- 장식 wrapper는 `aria-hidden`이다. reduced-motion/no-JS는 최종 정지 상태다. 개발용 재생 제어는 production에 노출하지 않는다.

## 검증 및 배포

이번 소스 기준 lint/typecheck/unit54 PASS. Webpack production build PASS. 브라우저47개 중46개는 전체 실행에서 통과했고, 기존 SNS3개 너비 두 주기 테스트는 전체240초 제한으로 한 차례 timeout 후 다른 브라우저 작업 없이 단독 재실행에서 PASS(3.0분)했다. 테스트의 assertion/timeout을 완화하거나 SNS 소스를 변경하지 않았다.

신규 Landing 검사는1440/393/360px에서20% 노출 진입, 최초 화면 밖0ms, 완료 후 재진입 유지, 화면 밖 pause, visibilitychange 처리, reduced-motion, 실제 JS-disabled final 및 기존 anchor를 검증한다. visibilitychange 검사는 결정적으로 이벤트 경로를 검증한 것이며 OS 탭 throttling 검수로 주장하지 않는다. 물리 기기/Safari 검수는 수행하지 않았다.

[실제 로컬 Chrome 측정](evidence/gap-light-landing/local-browser.json)에서 빛 상단/바닥은 Desktop527.99/867.99px, Mobile461.00/690.99px이며 가로 넘침·console/page 오류·실제 POST0건이다. [Desktop 최종 모습](evidence/gap-light-landing/local-final-1440.png) / [Mobile 최종 모습](evidence/gap-light-landing/local-final-393.png). 실제 시간 재생과 두 CTA의 URL·키보드 focus, 개발 제어 경로 production404를 확인했다. 과거 미리보기 PASS는 [별도 이력](GAP_LIGHT_MOTION_PREVIEW.md)이다.

배포 대상은 기존 `https://praytime-mission5.vercel.app/`다. 배포 후 동일한 GET-only Chrome 검증을 반복하고 실제 commit/배포 결과를 기존 PR #1 설명 및 사용자 보고에 기록한다. 테스트 중 실제 DB 접근/신청 POST, backend/env 변경, merge는 하지 않는다.
