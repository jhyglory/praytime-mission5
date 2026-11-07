> Final-stage catalog recheck: all three nullable columns already exist with the expected types and no default. No schema change or draft execution is required. Keep UNIQUE(email) and RLS unchanged. Final QA is separately authorized for one synthetic applicant after deployment.

# Consent migration · 검토 초안 / 적용 이력

## 상태를 구분할 것

- 과거 사용자 승인 작업: `supabase/migrations/20261105165403_mission5_signup_consent_recording.sql` **이미 적용됨**. nullable 3개 컬럼과 명확한 QA 1건 저장 검증 완료. `CONSENT_RECORDING_QA.md`와 저장된 evidence 참조.
- 이번 준비 작업: `supabase/drafts/20261105171809_mission5_consent_recording_draft.sql` **작성만 함, 실행하지 않음**. active migrations 밖의 draft이며 자동 배포·DB push에 포함하지 않음.
- 현재 사용자 요청에 따라 DB 변경·추가 QA POST·기존 사용자 row 조회/수정을 하지 않음. 이미 완료된 과거 변경을 미적용으로 표기하거나 되돌리지 않음.

## SQL 내용

`privacy_consent_at timestamptz`, `privacy_policy_version text`, `signup_source text`를 nullable로 추가합니다. 초안은 `IF NOT EXISTS`, transaction, 5초 lock timeout / 30초 statement timeout, schema cache reload를 포함합니다.

기본값·NOT NULL·backfill·기존 row UPDATE·정책/권한 변경·UNIQUE 변경이 없습니다. 기존 row와 기존 Lovable 폼의 신규 row는 이 metadata가 NULL이어도 호환됩니다. IF NOT EXISTS는 기존 column의 타입을 검증하거나 교정하지 않으므로 schema 확인을 대체하지 않습니다.

## 향후 적용 절차 (이번에는 실행 금지)

1. 대상이 기존 project `yxiubxjpapiacvhbkxvd`인지 확인. 새 DB를 만들지 않습니다.
2. 승인된 관리자 도구에서 **catalog만** 확인: 3개 컬럼의 이름·타입·nullable, UNIQUE(email), RLS·정책. 신청자 row는 조회하지 않습니다.
3. 이 프로젝트에는 이미 적용되어 있으므로 재실행하지 않습니다. migration 이력과 schema가 맞는지 확인하고 기존 적용 기록을 유지합니다.
4. 정말 미적용인 별도 승인 환경에만 초안을 검토하고 적용합니다. Supabase CLI의 현재 `--help`를 확인하고 `supabase migration new <name>`으로 migration 파일을 만든 뒤 SQL을 옮깁니다. 관리자 SQL editor 또는 검토된 migration workflow로 transaction을 실행합니다. 무차별 `db push`는 하지 않습니다.
5. catalog에서 세 column nullable / no default 및 기존 security / constraint 불변을 검증하고 적용 이력을 기록합니다.
6. 개인정보 고지 승인, hash 갱신 후에만 persistence 활성화. 실제 QA는 최종 UI 반영 후 사용자 요청 범위의 **1회 계획**으로 별도 수행합니다. 이번 테스트는 mock / disabled입니다.

## Rollback 방법

- COMMIT 이전 실패·중단: 같은 session에서 `ROLLBACK;`. transaction 밖 부분 변경은 없습니다. lock timeout이면 자동 재시도하지 않고 원인을 확인합니다.
- COMMIT 이후 기능 되돌리기: `BETA_SIGNUP_PERSISTENCE=disabled` 후 앱 재배포 또는 이전 앱 버전으로 되돌립니다. nullable columns는 남겨 두므로 기존 폼과 데이터는 계속 호환됩니다.
- 컬럼을 물리적으로 제거하면 기록된 동의 데이터가 삭제됩니다. 따라서 안전한 rollback에 DROP COLUMN을 포함하지 않습니다. 별도 승인·보존 방침 없이 기존 적용 migration을 reverse 실행하거나 QA row를 삭제하지 않습니다.

## 앱 연결

신규 Mission 5 요청의 consent literal true 검증과 서버 timestamp / policy version / source 기록 코드는 이전 승인 작업에서 이미 연결했습니다. 이번에는 이를 유지하며 자동 테스트로만 검증합니다. 클라이언트가 보낸 timestamp / version / source를 신뢰하지 않습니다.

참고: [Supabase tables](https://supabase.com/docs/guides/database/tables), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security). 운영 schema 변경은 현재 사용자 요청으로 보류되어 있습니다.
