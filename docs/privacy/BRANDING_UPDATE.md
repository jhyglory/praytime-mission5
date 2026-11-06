# 개인정보처리방침 과제명 제거 · 2026-11-06

사용자 요청에 따라 공개 방침의 `Mission 5 신청 페이지에서는`을 `신청 페이지에서는`으로 변경했다. 수집 항목, 이용 목적, 보관·파기, 이용자 권리, 동의 거부 안내와 동의 시각·방침 버전 기록 설명은 유지했다. 새 법률 문구는 추가하지 않았다.

- 게시 URL: https://praytime.glorifier.kr/privacy
- 원문 호스팅: 기존 Lovable 프로젝트의 `src/routes/privacy.tsx`
- Lovable commit: `32f8529e5d95edfb6e3ebe3f05a8d7aca9c7f5ab`
- 게시 요청: `f3908818-8d14-47c0-858c-ef2acfa1b76c`
- 실제 공개 Chrome 1440/393px: HTTP200, 과제명 표시0, 5개 절·나머지 본문 일치, 가로 넘침0, page error0.
- 모든 POST는 QA 중 차단했다. 신청 요청·DB 조회·INSERT·변경0건.

공개 DOM의 기존 정규화 규칙을 유지하며 현재 snapshot/hash와 서버의 `PRIVACY_POLICY_VERSION`을 동기화했다. 신규 접수만 새 게시본 식별자를 사용한다. 이전 snapshot은 `operating-policy-snapshot.before-branding-removal.txt`에 보존하며 과거 동의 데이터·QA 기록의 버전은 변경하지 않는다.

현재 버전: `privacy-sha256:77fa909dbd320635b6a2aa2d8bbfb5f8c590b1cc36957adaa3029537e87b1a1a`.

기존 Privacy URL, 승인 gate, Production 연결 설정, 내부 출처 식별자 `mission5_landing`, schema·RLS·UNIQUE(email) 및 폼 동작은 유지한다. 공개 방침의 과제명만 제거한 것이며 내부 데이터의 출처 식별자를 변경하는 작업이 아니다.

검증: lint PASS, typecheck PASS, unit47/47 PASS, Webpack production build PASS, browser40/40 PASS (2.6m). 브라우저 테스트는 disabled/mock persistence를 사용했다. 실제 공개 방침 확인 결과는 `branding-verification.json`에 기록했다.

검증된 변경은 기존 feature 브랜치·PR #1·Vercel 프로젝트로 반영한다. merge·main 수정·DNS 변경은 하지 않는다. 실제 배포 식별자는 PR #1에 기록한다.
