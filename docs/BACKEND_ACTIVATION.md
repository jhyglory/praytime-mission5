# 실제 접수 활성화 · 2026-11-06

사용자 요청: 실제 저장 활성화 → 고지 정정안 검토 → “게시하세요” 승인.

## Privacy 게시

- 기존 URL 유지: https://praytime.glorifier.kr/privacy
- Lovable 수정 commit: `5b8a5f2dfc7bc2fcbcb59c5050bee83180b66d0c`
- Lovable 배포 요청: `15992227-9116-4340-8761-2875464bbbae`
- 공개 Chrome 페이지 HTTP200 및 5개 절/승인 본문 확인.
- 필수 닉네임·이메일·기기·신청 이유, 선택 연령·대상 앱·최근 감소 시도, 유입/접수/동의 기록을 고지.
- 기존 목적·보관·문의처 유지. 이는 사용자 게시 승인 기록이며 법률 적합성 보증은 아니다. 정정안의 추가 법률 검토 메모는 유지.
- 게시본 버전: `privacy-sha256:61b237b3a2c926f95e6e445d7ba478dd4fb58eefae336009791785652b65207b`
- 실제 공개 DOM snapshot과 canonicalization을 docs/privacy에 기록. 이전 본문도 별도 보존.

## 연결

기존 public.beta_signups 재사용. 새 migration/DB/RLS 변경 없음. UNIQUE(email), anon/authenticated INSERT 전용 정책 유지. 기존 사용자 행 접근 없음.

Production 서버 환경만 SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY / BETA_SIGNUP_PERSISTENCE=supabase 사용. 키 값은 문서/commit에 없음. Preview와 자동 테스트는 disabled. 코드의 privacy approval gate를 보존하면서 승인 값을 true로 설정. UI/필드/validation/중복 처리 디자인 변경 없음.

서버가 consent=true를 검증하고 서버 시각, 게시 정책 버전, mission5_landing 출처를 추가한다. INSERT 성공201만 success receipt. 기존23505는409 duplicate, 유효하지 않은 입력422, 공급자 오류502, 미설정503. 서비스 역할 키/공개 SELECT/UPDATE/DELETE는 사용하지 않는다.

## 검증

- lint PASS
- typecheck PASS
- unit 40/40 PASS (실제 네트워크 금지, 미승인 gate 차단 및 승인 production 동의 기록 검증)
- production build --webpack PASS
- browser 32/32 PASS (1.1m), 실제 저장 disabled.
- 실제 Production QA는 아래 release 결과로 갱신한다.
- 클라이언트 .next/static에서 기존 연결 key 일치 0건.

## Release 결과

- Release code commit: `9fc4d3b3ed84c2846d374ab23c3dc862cdb452a3`
- Vercel Ready: `dpl_3Wbni7v57MnjaxzZjZZGQNYJzZ13`
- https://praytime-mission5.vercel.app/ (immutable: https://praytime-mission5-rdjv0lwqx-glorifier1.vercel.app)
- 실제 브라우저 form POST201 / receipt=true 및 이후 success UI 확인.
- QA 이메일: `mission5-qa-1793959730461@example.com` (합성 데이터, 실제 수신자 아님).
- 기존 사용자 행은 조회·수정하지 않았고, 이 QA 이메일+닉네임+출처로 제한한 SELECT만 수행했다.
- 해당 QA row consent timestamp: `2026-11-06T10:08:54.055Z` (서버 시각).
- 해당 QA row policy version: `privacy-sha256:61b237b3a2c926f95e6e445d7ba478dd4fb58eefae336009791785652b65207b`.
- 해당 QA row signup_source: `mission5_landing`.
- 같은 QA 이메일의 두 번째 폼 요청409 및 “이미 신청된 이메일입니다.” UI 확인. 추가 저장 없음.
- consent=false 요청422 및 consent 오류 확인. INSERT 없음.
- 합성 QA row는 검증 이력으로 유지한다. 기존 신청자 변경/일괄 정리 없음.
- 기존 PR #1 유지, merge하지 않았다. DNS 변경하지 않았다. Vercel에 이미 등록돼 있는 custom-domain alias와 실제 DNS 전환은 별개다.

## 접수 성공 확인창

사용자 요청에 따라 실제 201/status=success/receipt=true 응답을 받은 경우에만 브라우저 기본 alert을 표시한다. 확인 버튼으로 닫은 뒤 기존 성공 안내와 중복 제출 방지를 유지한다. 오류·중복·receipt 없는 응답에는 성공 alert이 없다. API/DB 변경과 추가 실제 INSERT는 없다.

검증: lint/typecheck/unit40/40/Webpack build PASS, 관련 browser5/5 PASS (6.0s). HTTP 응답 대기 중 alert 없음 및 성공 응답일 때 정확히 한 번 alert/확인 동작을 검증했다.

데이터 확인: 기존 Lovable 프로젝트 → More → Database → beta_signups. 신규 Mission5는 signup_source=mission5_landing 필터로 구분한다. https://docs.lovable.dev/features/database
