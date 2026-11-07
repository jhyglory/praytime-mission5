# Lovable Backend Audit · 증거 및 이력

조사일: 2026-11-06 KST. 최신 구조는 [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md), 동의 검증 이력은 [CONSENT_RECORDING_QA.md](CONSENT_RECORDING_QA.md)를 참조하세요.

## 확인된 사실

운영 [PrayTime](https://praytime.glorifier.kr/)의 배포 JS와 연결된 [Lovable 원본 프로젝트](https://lovable.dev/projects/e4aa3c3a-e142-4dc1-8fc0-74ba94ff47f7) 코드·env·DB 시스템 catalog에서 실제 Supabase 사용을 확인했습니다. Lovable라는 도구명에서 추정하지 않았습니다.

- project `yxiubxjpapiacvhbkxvd`, public.beta_signups, PostgREST insert.
- 원본 ref `660f70b4d2854d82e018618d00122ce875880e46`.
- publishable-key transport와 env 일치, UNIQUE(email), INSERT-only RLS 확인.
- 초기 16개 컬럼에는 동의 기록이 없었습니다. 사용자 승인 후 nullable 동의 컬럼3개가 추가되었습니다. 과거 schema evidence가 16개라고 해서 현재도 컬럼이 없다고 해석하지 마세요.
- 기존 DB 재사용 가능. 새 DB / table 불필요.
- 원본 duplicate는 23505 처리 후 /thanks로 이동할 수 있습니다. Mission 5는 409 duplicate로 신규 성공과 구분합니다.

## 단계별 증거

| 단계 | 수행 / 한계 | 근거 |
| --- | --- | --- |
| 공개 배포 조사 | JS 원본 확인, OPTIONS, limit=0 metadata probe. 신청자 row·운영 insert 없음 | deployed-code-excerpts.txt, readonly-probe.json, consent-column-check.json |
| Lovable 연결 audit | 원본 소스·마스킹 env, DB catalog만 확인. 사용자 row 없음 | lovable-BetaForm.tsx.txt, lovable-client.ts.txt, lovable-types.ts.txt, lovable-env-redacted.txt, lovable-db-metadata.json |
| 이전 승인 동의 작업 | nullable 3개 적용, QA 1건 insert·중복·invalid·receipt gate 검증. 기존 사용자 데이터 untouched | CONSENT_RECORDING_QA.md, consent-migration-security-verification.json, qa-*.json / png |
| 이번 디자인 독립 준비 | 문서·SQL draft·자동 테스트. DB 연결/변경·추가 운영 POST 없음 | CONSENT_MIGRATION_RUNBOOK.md, PRE_FIGMA_STATUS.md |

모든 evidence 경로는 `docs/evidence/` 기준입니다. key 값은 보관된 문서에 포함하지 않습니다. 실제 env 파일은 Git 제외이며 로컬 persistence를 disabled로 유지합니다. 예전 QA 증거를 이번 단계에서 새로 수행한 POST로 보고하지 않습니다.
