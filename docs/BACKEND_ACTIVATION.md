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

배포 및 실제 POST 검증 진행 전. 결과를 확인한 후 갱신한다. 실제 QA는 합성 데이터 1건 및 같은 이메일 중복/동의 누락 요청만 수행하며 기존 신청자는 조회·수정하지 않는다.
