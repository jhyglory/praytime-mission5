# Mission 5 · 최종 Figma 전 준비 상태

기준일: 2026-11-06 KST. 이 문서가 현재 단계의 상태 기준입니다. 과거 IMPLEMENTATION_STATUS / CONSENT_RECORDING_QA는 당시 구현·승인 QA 이력입니다.

## 완료

- `outputs/praytime`에 Git 초기화, `feature/mission-5-landing` 생성. 작업 reset / 삭제 없음.
- 사용자 요청으로 private [jhyglory/praytime-mission5](https://github.com/jhyglory/praytime-mission5) 생성, origin 연결. 아직 첫 commit 전 / stage 없음 / push 없음 / PR 없음.
- `.gitignore`: 모든 .env*, node_modules, .next, .vercel, generated tests / cache 제외. safe template `config/environment.example` 제공.
- AGENTS 및 제품 / 디자인 / 미션 context 최신화. 승인된 제품·UX·디자인 가드레일 보존.
- README 서비스 / 문제 / core loop / stack / interactions / responsive / 설치 / env / Figma / backend / 배포 / 한계 작성.
- backend 전체 field 목록 / mapping / duplicate / error / env / RLS 문서화.
- nullable 동의 column 재검토 SQL draft와 적용·rollback runbook. 이번 단계 실행 안 함.
- 개인정보 고지 대조 결과 문서화. 법률 문구 변경 없음.
- metadata title / description / OG / Twitter / optional canonical 준비. favicon / OG artwork는 승인 asset TODO.
- skip-link keyboard focus / preview panel tab stop 개선. 스타일·assets 유지.
- Vercel 배포 체크리스트 / PR 본문 template / 최초 PR base 구성 계획 준비. Node24.x engines 명시.

## 현재 backend / DB 이력

기존 Lovable와 동일한 Supabase public.beta_signups를 재사용하며 새 DB는 없습니다. UNIQUE(email) / INSERT-only RLS 유지. 이전 승인 작업에서 동의 컬럼3개 적용 및 QA1건의 실제 INSERT·duplicate·invalid·receipt gate 검증이 완료되었습니다.

이번 단계에서 DB 요청 / migration 실행 / 추가 운영 POST / 기존 row 조회·수정을 하지 않았습니다. 로컬 .env.local의 같은 연결 값은 보존하고 persistence만 disabled로 전환했습니다. 자동 테스트는 fetch mock, browser route interception, 강제 disabled server 및 외부 browser request 차단으로 운영 저장소와 분리했습니다.

## 최종 자동 검증

| 명령 | 결과 |
| --- | --- |
| npm run lint | PASS, warnings 0 |
| npm run typecheck | PASS |
| npm test | PASS, 2 files / 34 tests |
| npm run test:e2e | PASS, 16 tests / Google Chrome / production server |
| npm run build | PASS, / static + /api/beta-signup Node Route Handler |

초기 브라우저 실행은 skip-link focus 문제로 15/16 통과였으며 수정 후 production build와 전체 16개를 재실행해 모두 통과했습니다. 최초 sandbox build는 compile에서 진행되지 않아 중단하고 로컬 build 권한으로 재실행해 통과했습니다. 이 환경 이슈를 코드의 production build 실패로 혼동하지 마세요.

확인된 개인정보 불일치: 닉네임·신청 이유·동의 기록 누락, 기기 필수/선택 차이, 관심 앱/줄일 앱과 스크린타임 경험/최근 감소 시도의 표현 범위 확인 필요. signup_source의 고지 범위 확인도 남아 있습니다.

## 최종 Figma 이후

1. 사용자 최종 Desktop / Mobile / Handoff revision 확인.
2. Hero, palette, section background, mockups, spacing, typography를 한 번의 visual pass로 반영. branding / UX 재설계 금지.
3. 승인 favicon / OG asset 반영, 실제 배포 origin과 metadata 확인.
4. 최종 responsive / contrast / keyboard / asset 재검증.
5. 개인정보 고지 보완 승인 및 게시본 snapshot / hash 갱신.
6. 최종 UI 후 실제 POST는 사용자 지시 범위의 1회 계획으로 별도 진행. 이전 QA 이력은 그대로 유지.
7. 최종 main base / feature commit·push, Vercel URL 반영 후 `[하영]-미션5` PR 생성. 지금은 실행하지 않음.

현재 추가 코드/빌드 blocker는 없습니다. 실제 제출은 최종 Figma·개인정보 고지 승인·최종 배포와 URL 확정이 남아 있습니다. 빈 remote의 main base는 최종 제출 workflow에서 구성해야 합니다.

관련 문서: BACKEND_ARCHITECTURE.md / PRIVACY_AUDIT.md / CONSENT_MIGRATION_RUNBOOK.md / ACCESSIBILITY_QUALITY_AUDIT.md / METADATA_ASSETS.md / SUBMISSION_WORKFLOW.md / 루트 VERCEL_DEPLOYMENT_CHECKLIST.md.
