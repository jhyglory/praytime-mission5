# Mission 5 개인정보 고지 정합성 감사

## 실제 접수 활성화 승인 · 2026-11-06

사용자가 실제 저장을 요청했고, 수집 항목 정정안 게시를 승인했다. 기존 Privacy URL에 정정안을 게시한 뒤 HTTP 200 및 본문을 확인했다. 새 snapshot/version과 `PRIVACY_COLLECTION_APPROVED=true`를 사용한다. Production에서 기존 Supabase 연결과 `BETA_SIGNUP_PERSISTENCE=supabase`를 설정하는 release를 진행한다. Preview·자동 테스트·기본 로컬 설정은 disabled다. 기존 beta_signups/UNIQUE(email)/INSERT 전용 RLS를 유지하며, 새 DB·migration·공개 SELECT/UPDATE/DELETE·service-role key는 없다. 사용자가 승인한 QA 신청 1건만 생성·검증하고 기존 신청자 행은 조회·수정하지 않는다. merge·main 변경·DNS 전환은 계속 금지다. 아래 이전 저장 OFF/법률 문구 작성 금지 기록은 이 승인 이전의 이력이다. 기존 감사표의 누락/불일치는 이번 승인된 게시본에서 정정됐다. 법률 검토 메모는 정합성 확인과 별개로 유지한다. 실제 배포/QA 결과는 docs/BACKEND_ACTIVATION.md에 기록한다.

**LEGAL REVIEW REQUIRED** — 아래 표는 승인된 정정안 게시 전의 역사적 비교입니다. 누락 항목은 위 활성화 기록의 승인된 게시본에서 정정됐습니다. 이 스타일 작업에서는 운영 Privacy URL·법률 문구·수집 항목·저장 설정을 변경하지 않습니다. 이 문서는 법률 적합성 판정이 아닙니다.

확인일: 2026-11-06 KST. [운영 개인정보처리방침](https://praytime.glorifier.kr/privacy)과 실제 `beta-signup.ts` / form / server consent payload를 비교했습니다. 법률 문구의 새 작성·수정은 하지 않았습니다.

공개 페이지의 배포 module `privacy-DqWsLzak.js`를 다시 읽어 보관 중인 snapshot과 수집 항목 표현이 같음을 확인했습니다. 정확한 전문은 `privacy/operating-policy-snapshot.txt`, 식별·정규화 규칙은 `privacy/snapshot.json`에 있습니다. 이 문서는 법률 적합성 판정이 아닌 항목·필수 여부·표현 범위 비교입니다.

| 실제 수집 항목 | 현재 고지 | 분류 | 확인 내용 |
| --- | --- | --- | --- |
| 닉네임 (필수) | 명시 없음 | **누락** | nickname을 수집·저장 |
| 이메일 (필수) | 이메일 주소(필수) | **현재 고지와 일치** | email 저장 |
| 사용 기기 (필수) | 선택 항목으로 나열 | **현재 고지와 다르게 정의됨** | 실제 API는 os 필수 |
| 신청 이유 (필수·복수선택) | 명시 없음 | **누락** | signup_reason 저장 |
| 연령대 (선택) | 연령대(선택) | **현재 고지와 일치** | age_range 또는null |
| 줄이고 싶은 앱 (선택) | 관심 앱(선택) | **표현 확인 필요** | 의미가 같다고 단정하지 않음 |
| 최근 3개월 사용 감소 시도 (선택) | 스크린타임 사용 경험(선택) | **표현 확인 필요** | 차단 앱·삭제·알림·집중모드·금식 등으로 실제 범위가 더 넓음 |
| 개인정보 동의 기록 | 명시 없음 | **누락** | privacy_consent_at / privacy_policy_version 서버 기록 |

추가 자동 metadata 비교:

| 항목 | 분류 | 확인 내용 |
| --- | --- | --- |
| UTM / referrer | 현재 고지와 일치 | 4개 UTM + referrer 저장. utm_term은 보내지 않음 |
| signup_source | 표현 확인 필요 | mission5_landing 상수, 일반 유입 경로 고지가 이 출처 식별까지 포함하는지 확인 필요 |

현재 version identifier는 보관된 고지 전문의 SHA-256입니다. 문서에 시행일이 없어 날짜를 임의로 법적 version으로 만들지 않았습니다. 고지가 승인 수정되면 운영 URL의 실제 게시 내용, snapshot, SHA-256, `PRIVACY_POLICY_VERSION` 및 테스트를 함께 갱신해야 합니다. 현재 기록용 hash가 위 불일치를 해결하는 것은 아닙니다.

운영 사용자 row 조회·수정이나 신규 POST는 이번 감사에 포함하지 않았습니다.

## Legal review에 필요한 항목 목록

- 누락된 닉네임, 신청 이유, 동의 시각·고지 버전의 수집 항목 반영 여부 검토
- 기기 필수/선택 표시를 실제 폼과 일치시키는 검토
- 관심 앱/줄이고 싶은 앱, 스크린타임 경험/최근 3개월 감소 시도의 표현 범위 검토
- signup_source를 포함한 유입 경로 식별 고지 범위 확인
- 승인·게시 후 snapshot/hash 갱신, server release gate 검토, 이후 별도 승인된 INSERT QA

이는 필요한 항목 목록이며 법률 문구 초안이 아닙니다. 별도 Terms URL은 없으며 추정하거나 만들지 않습니다.

정정안 게시 전 보호 조치(과거 기록): persistence는 disabled였고 Supabase key를 Vercel에 등록하지 않았습니다. 추가로 handler가 VERCEL_ENV=production 및 PRIVACY_COLLECTION_APPROVED=false 상태에서 유효 payload도503 PRIVACY_REVIEW_REQUIRED로 막고 store를 호출하지 않습니다. 성공 receipt를 발행하지 않습니다.

## 항목별 구분 요약

- 누락: 닉네임, 신청 이유, 개인정보 동의 기록(시각/고지 버전).
- 다르게 정의됨: 사용 기기는 실제 폼/API 필수이나 현재 고지는 선택.
- 일치: 이메일 필수, 연령대 선택, UTM/referrer 유입 정보.
- 추가 확인: 관심 앱과 줄이고 싶은 앱의 의미, 스크린타임 경험과 최근3개월 감소 시도의 범위, signup_source의 고지 범위.
