# Mission 5 개인정보 고지 정합성 감사

확인일: 2026-11-06 KST. [운영 개인정보처리방침](https://praytime.glorifier.kr/privacy)과 실제 `beta-signup.ts` / form / server consent payload를 비교했습니다. 법률 문구의 새 작성·수정은 하지 않았습니다.

공개 페이지의 배포 module `privacy-DqWsLzak.js`를 다시 읽어 보관 중인 snapshot과 수집 항목 표현이 같음을 확인했습니다. 정확한 전문은 `privacy/operating-policy-snapshot.txt`, 식별·정규화 규칙은 `privacy/snapshot.json`에 있습니다. 이 문서는 법률 적합성 판정이 아닌 항목·필수 여부·표현 범위 비교입니다.

| 실제 수집 항목 | 현재 고지 | 분류 | 확인 내용 |
| --- | --- | --- | --- |
| 닉네임 (필수) | 명시 없음 | **누락** | nickname을 수집·저장 |
| 이메일 (필수) | 이메일 주소(필수) | **현재 고지와 일치** | email 저장 |
| 사용 기기 (필수) | 선택 항목으로 나열 | **표현 확인 필요** | 실제 API는 os 필수 |
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
