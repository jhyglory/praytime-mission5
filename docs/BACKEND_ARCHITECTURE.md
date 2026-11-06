# Mission 5 Backend Architecture

## 실제 접수 활성화 승인 · 2026-11-06

사용자가 실제 저장을 요청했고, 수집 항목 정정안 게시를 승인했다. 기존 Privacy URL에 정정안을 게시한 뒤 HTTP 200 및 본문을 확인했다. 새 snapshot/version과 `PRIVACY_COLLECTION_APPROVED=true`를 사용한다. Production에서 기존 Supabase 연결과 `BETA_SIGNUP_PERSISTENCE=supabase`를 설정하는 release를 진행한다. Preview·자동 테스트·기본 로컬 설정은 disabled다. 기존 beta_signups/UNIQUE(email)/INSERT 전용 RLS를 유지하며, 새 DB·migration·공개 SELECT/UPDATE/DELETE·service-role key는 없다. 사용자가 승인한 QA 신청 1건만 생성·검증하고 기존 신청자 행은 조회·수정하지 않는다. merge·main 변경·DNS 전환은 계속 금지다. 아래 이전 저장 OFF/법률 문구 작성 금지 기록은 이 승인 이전의 이력이다. 실제 배포/QA 결과는 docs/BACKEND_ACTIVATION.md에 기록한다.

기준일: 2026-11-06 KST. 기존 배포 소스·Lovable 원본 env·DB catalog·이전 승인 QA의 저장된 증거를 기준으로 정리했습니다. 이번 준비 단계에서 운영 row 조회·수정, migration 실행, 신규 POST는 하지 않았습니다.

## 기존 연결

- Lovable: [PrayTime Beta](https://lovable.dev/projects/e4aa3c3a-e142-4dc1-8fc0-74ba94ff47f7)
- 원본 조사 ref: `660f70b4d2854d82e018618d00122ce875880e46`
- Supabase project: `yxiubxjpapiacvhbkxvd`
- Endpoint: `https://yxiubxjpapiacvhbkxvd.supabase.co/rest/v1/beta_signups`
- 실제 table: **public.beta_signups**. 새 database / table 없음.

운영 Lovable는 브라우저 SDK에서 직접 insert합니다. Mission 5는 same-origin Route Handler를 거쳐 같은 public INSERT 권한으로 저장합니다. server key를 사용하는 관리자 우회 구조가 아닙니다.

## 흐름 / 책임

1. `beta-signup-form.tsx`: 8개 그룹, client validation, loading, 결과 상태.
2. `api/beta-signup/route.ts` → `signup-handler.ts`: origin/content type/16KiB/JSON/schema 검사.
3. `signup-consent.ts`: 검증된 consent=true에만 서버 시각·policy version·source 추가. 클라이언트가 보낸 동의 시각/버전/source는 무시.
4. `signup-store.ts`: `SignupStore.insert` 경계, Supabase `.from("beta_signups").insert(payload)`.
5. 201 + error 없음일 때만 API receipt 발행. UI는 실제 201 + `{status:"success",receipt:true}` 후 성공 표시.

## 전체 DB field 목록

기존 16개 + 이전 승인 작업에서 추가한 nullable 3개 = 19개. 아래 타입은 저장된 catalog / 원본 types / migration 증거입니다.

| 필드 | 타입 / nullable | 기본값 / 사용 |
| --- | --- | --- |
| id | uuid / NOT NULL | gen_random_uuid(), PK |
| email | text / NOT NULL | UNIQUE(email) |
| os | text / NOT NULL | 기존 3개 값 |
| age_range | text / nullable | 선택 |
| target_apps | text[] / NOT NULL | '{}' |
| tried_screen_limit | boolean / nullable | legacy, 신규 payload 생략 |
| utm_source | text / nullable | attribution |
| utm_medium | text / nullable | attribution |
| utm_campaign | text / nullable | attribution |
| utm_content | text / nullable | attribution |
| referrer | text / nullable | attribution |
| created_at | timestamptz / NOT NULL | now() |
| nickname | text / nullable | UI/API 필수 |
| usage_hours | text / nullable | legacy, 신규 payload 생략 |
| signup_reason | text / nullable | UI/API 필수 |
| reduction_methods | text[] / NOT NULL | '{}' |
| privacy_consent_at | timestamptz / nullable | 서버에서 기록, 기본값 없음 |
| privacy_policy_version | text / nullable | 서버에서 기록, 기본값 없음 |
| signup_source | text / nullable | mission5_landing, 기본값 없음 |

## Frontend → API → database mapping

| Frontend / API | DB | 변환 / 검증 |
| --- | --- | --- |
| nickname | nickname | trim, 1~40자 |
| email | email | trim + 형식 + lowercase, 최대255 |
| os | os | iPhone / Android / 둘 다·잘 모르겠어요 (정확한 옵션값은 schema) |
| signup_reason[] | signup_reason | 승인 7개 중 1개 이상, 중복 제거 후 ', ' join |
| age_range | age_range | 승인 enum 또는 null |
| target_apps[] | target_apps | 승인 enum, 최대6, 중복 제거 |
| reduction_methods[] | reduction_methods | 승인 enum, 최대7, 중복 제거 |
| consent | 직접 저장 안 함 | literal true 서버 검증, boolean column 불필요 |
| 서버 clock | privacy_consent_at | ISO UTC timestamptz |
| 서버 PRIVACY_POLICY_VERSION | privacy_policy_version | 현행 policy snapshot SHA-256 identifier |
| 서버 literal | signup_source | mission5_landing |
| attribution.utm_source/medium/campaign/content | 같은 이름 4개 컬럼 | 각 최대200 또는null |
| attribution.referrer | referrer | 최대500 또는null |
| company | 저장 안 함 | honeypot 값 있으면422, receipt 없음 |

`id` / `created_at`은 DB 기본값입니다. `utm_term` / `privacy_consent`는 보내지 않습니다. policy identifier는 법적 시행일을 주장하는 날짜가 아니라 관찰한 고지 텍스트의 hash입니다. 고지 승인 변경 시 snapshot·hash·상수를 함께 갱신해야 합니다.

## Duplicate / error mapping

| 경계 | API 응답 | UI |
| --- | --- | --- |
| INSERT HTTP201, error 없음 | 201 success + receipt:true | 신규 신청 성공 |
| PostgreSQL 23505 | 409 duplicate | 이미 신청된 이메일 |
| RLS 42501 / 기타 DB 오류 / 예상 외 status | 502 error | 입력 유지, 재시도 안내 |
| transport throw / timeout | 502 SUBMISSION_FAILED | 입력 유지 |
| persistence disabled / env 누락·부적합 | 503 BACKEND_UNCONFIRMED | 입력 유지, 가짜 성공 없음 |
| schema / consent 오류 | 422 invalid + field errors | 필드 오류 / focus |
| foreign origin / oversized / malformed / type | 403 / 413 / 400 / 415 | 일반 실패 |

실제 제약은 `beta_signups_email_key UNIQUE(email)`입니다. SELECT로 선조회하지 않으며 constraint 제거, 우회, upsert를 하지 않습니다. text UNIQUE 자체는 case-sensitive이고, 입력 정규화는 기존 폼과 동일한 lowercase입니다. 기존 mixed-case row에 대해 DB를 변경하지 않습니다.

## 환경변수 / 전송

`BETA_SIGNUP_PERSISTENCE`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`; 선택 fallback `SUPABASE_ANON_KEY`. metadata용 `SITE_URL`은 저장과 무관합니다. 정확한 이름 템플릿은 `config/environment.example`.

원본 Lovable `VITE_SUPABASE_*`와 서버 `SUPABASE_*` 값의 일치를 이전 audit에서 확인했습니다. 현재 로컬 URL/key는 유지하되 persistence는 disabled입니다. key 값은 문서에 없습니다. Supabase 라이브러리는 server adapter에서만 import되고 환경변수에 NEXT_PUBLIC_ prefix를 사용하지 않습니다. secret/service-role key는 adapter가 거부합니다.

publishable key는 `apikey`에 넣고 동일 publishable key의 Bearer Authorization은 제거합니다(원본 동작 유지). legacy anon JWT의 Authorization은 유지합니다. timeout 10초, 세션 저장·갱신 비활성화.

## RLS / 보안 동작

- RLS enabled=true, forced=false. 기존 정책 `Anyone can submit a beta signup`: INSERT, anon/authenticated.
- WITH CHECK: 이메일 형식·최대255, os 기존3값, age null 또는최대40, target_apps 배열 최대10.
- SELECT / UPDATE / DELETE 정책 없음. table-level SELECT grant가 있어도 row 가시성은 RLS 기본 거부.
- adapter는 `.select()`를 붙이지 않으며 공개 조회 정책을 요구하지 않습니다.
- 이번 단계에서 정책·grant·constraint·trigger를 변경하지 않았습니다.
- 기존 public INSERT는 그대로 접근 가능하므로 Mission 5 서버의 동의 강제는 이 Route Handler를 통과한 신청에 적용됩니다. 기존 Lovable client를 포함한 모든 직접 insert에 동의 metadata를 강제하는 DB 제약은 추가하지 않았습니다.

근거: `docs/evidence/lovable-db-metadata.json`, `consent-migration-security-verification.json`, 마스킹된 env와 원본 코드, `CONSENT_RECORDING_QA.md`. DB에 새로 연결해 재조회한 결과로 표현하지 않습니다.

## Latest production gate

LEGAL REVIEW REQUIRED. The user deferred all actual INSERT QA until notice alignment. Vercel Production/Preview persistence stays disabled, without Supabase credentials. In Production, PRIVACY_COLLECTION_APPROVED=false returns503 PRIVACY_REVIEW_REQUIRED before getStore, even if persistence is misconfigured. Missing/invalid fields still return422 before this gate. Success/duplicate/provider failure remain covered by mocked tests; no final-stage live applicant was created.
