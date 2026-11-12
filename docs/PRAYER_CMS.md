# 기도문 CMS · Mission 6

## 범위와 환경

기존 Mission5 Next.js16.4.5 / React19 / TypeScript / Tailwind4 / shadcn UI 위에 서비스 제공 기도문 하나를 관리합니다. **인증 없는 과제용 관리 화면**입니다. 누구나 데모 URL에서 일반 기도문을 수정·삭제할 수 있으므로 개인정보·개인 기도제목을 입력하지 않습니다. 로그인·역할·사용자별 권한은 Mission7 범위입니다.

기존 운영 사전신청 `beta_signups` / Lovable 연결은 변경하지 않습니다. 사용자 승인으로 생성한 과제용 Supabase 프로젝트는 `cibcyeyznfmywacfiokh` (PrayTime CMS, Seoul, 생성 시 조회 비용 월0)입니다. Burger Tower 등 다른 프로젝트는 접근·수정하지 않습니다. CMS 코드는 Production 환경에서는 비활성화하며, 기존 Production 배포를 덮어쓰지 않고 Preview로 검증합니다.

## 화면 기능 명세

| 화면/입력 | 사용자 행동 | 성공 | 실패 |
|---|---|---|---|
| `/admin` | 진입 | 목록으로 redirect | 목록의 연결 상태 표시 |
| `/admin/prayers?page=N` | 목록·이전/다음 | DB20개/페이지, 전체건수, 안정적 수정시각+ID 정렬 | 설정 필요/조회 실패를 빈 목록과 구분 |
| `/admin/prayers/new` | 제목·본문·선택 metadata·대표 이미지 입력 | 실제 INSERT 후 상세 이동 | 필드 오류·입력 유지·재시도, 중복 제출 차단 |
| `/admin/prayers/[id]` | 원문·성경구절·이미지 읽기 | DB 최신 데이터와 이미지 server proxy | 잘못된/없는 ID는 not-found, DB 장애는 별도 안내 |
| `/admin/prayers/[id]/edit` | 공통 PrayerForm, 유지/교체/제거 | 실제 UPDATE 후 상세·목록·랜딩 최신 반영 | 기존 정상 이미지/데이터 보존, 입력 유지 |
| 상세의 삭제 dialog | 제목 확인·취소/확정 | 실제 DELETE 후 목록 이동·마지막 페이지 보정 | 실패시 보존, 중복 실행 차단, 이미 삭제된 항목 구분 |
| 랜딩 하단 미리보기 | 최근 수정 기도문 확인/상세 이동 | DB 기반 기도문 표시 | 연결 오류/빈 상태를 명시, JSON으로 대체하지 않음 |

모든 읽기는 서버 모듈, 변경은 same-origin Route Handler의 multipart FormData를 거칩니다. 로그인 없이 공개된 과제 데모라는 것과 RLS로 직접 DB 접근이 차단된 것은 별개입니다. 서버 비밀 키가 관리자 인증을 대신하지 않습니다.

## 실제 JSON 분석 · 2026-11-12

원본 경로(읽기만 함):

- iOS: `/Users/codeit/Desktop/코드잇/PrayTime/PrayTime/Resources/prayer_guides_ko.json`
- Android: `/Users/codeit/Desktop/코드잇/PrayTime/android/PrayTimeAndroid/app/src/main/assets/prayer_guides_ko.json`

두 파일은 바이트까지 동일: SHA256 `0b03acfc60e5f0c880286be194dea92860c1b575a1cc56a5664466f45cb6eb45`. 최상위 배열100건, 레코드당8개 string 필드입니다. 누락/빈값·중복ID·중복본문·형식 오류가 없습니다. 단계 중첩이나 다국어 배열은 존재하지 않으며 한 배열 항목이 한 기도문입니다. `title_kr`/`prayer_kr` 등 실제 한국어 필드명을 근거로 language=ko를 부여합니다. 기존 ID `guide_001` 등은 DB UUID와 분리합니다.

최대길이: title41 / prayer239 / scripture73 / category4 / category_full15 / keyword3 / scripture_ref13 / id9. 실제 줄바꿈은 없지만 문자열·줄바꿈을 임의 변환하지 않고 저장·`whitespace-pre-wrap`로 표시합니다. 복사본 `data/prayer-guides-ko.json`은 원본과 바이트가 같습니다. 네이티브 JSON과 앱 코드는 수정하지 않습니다.

분류: 마음17, 디지털8, 관계19, 일·성장18, 신앙21, 공동체6, 돈6, 사명5.

## DB 구조와 매핑

| 원본 → DB | 타입·필수·제약 |
|---|---|
| DB기본값/서버UUID → id | uuid PK, gen_random_uuid() |
| id → source_key | nullable text UNIQUE, `praytime:ko:<원본ID>`; seed 중복 방지 |
| title_kr → title | 필수 text1~300, 공백만 금지 |
| prayer_kr → content | 필수 text1~20000, 공백만 금지 |
| category → category | nullable text1~80 |
| category_full → category_full | nullable text1~200 |
| keyword_kr → keyword | nullable text1~100 |
| scripture_ref → scripture_ref | nullable text1~200 |
| scripture_kr → scripture_text | nullable text1~2000 |
| 한국어 원본 근거 → language | 필수 text, 기본ko, 2~16, 언어 코드 형식 |
| 서버 업로드 → image_path | nullable text, `prayers/<기도문UUID>/<업로드UUID>.<확장자>` |
| 원본 레코드 → source_payload | nullable jsonb object, 읽기 전용 보존 |
| DB → created_at / updated_at | 필수 timestamptz, now(), UPDATE trigger로 수정시각 갱신 |

수정 trigger는 id/created_at/source_key/source_payload를 보존합니다. 클라이언트는 시간·원본정보·임의 image_path를 지정하지 못합니다. `(updated_at desc,id desc)` 인덱스와 category복합 인덱스를 사용합니다. RLS enabled, anon/authenticated 권한과 정책 없음. service_role만 서버에서 CRUD합니다. 기존 RLS는 해제하거나 약화하지 않습니다.

재현 SQL: `supabase/migrations/20261112060636_prayer_cms.sql`. CLI3.1.0 `migration new`로 생성하고, 승인된 과제 프로젝트에만 적용합니다. 다른 프로젝트에는 실행하지 않습니다. 기존 테이블 DROP/TRUNCATE가 없습니다. 이미 적용한 migration을 재실행하지 말고 migration 목록과 실제 대상을 확인합니다. 자동 rollback 삭제 명령은 제공하지 않습니다. 원복이 필요하면 과제 데이터 보관 후 별도 검토합니다.

## 환경변수와 로컬 실행

실제 값 없는 `.env.example`을 참고하세요. 기존 `.env.local`을 덮어쓰지 않고 Git 제외 `.env.cms.local`을 사용합니다.

```sh
npm ci
# .env.cms.local: PRAYER_CMS_ENABLED=true, 과제용 SUPABASE_URL/SUPABASE_SECRET_KEY
npm run dev:cms
# http://127.0.0.1:3103/admin/prayers
```

`PRAYER_CMS_PROJECT_REF`는 기본 과제 ref를 다른 별도 데모 프로젝트에 명시적으로 바꿀 때만 사용합니다. 기존 운영 ref는 거부합니다. `SUPABASE_SERVICE_ROLE_KEY`는 legacy service_role JWT가 이미 있을 때만 지원하며 현대식 `SUPABASE_SECRET_KEY`를 우선합니다. 현재 과제 프로젝트는 현대식 키를 사용하도록 설정합니다. 서버 모듈은 `server-only`로 client import를 막고, 키·SDK 오류를 브라우저/로그에 출력하지 않습니다.

Preview에서는 `BETA_SIGNUP_PERSISTENCE=disabled`, CMS에는 과제용 URL/비밀 키만 설정합니다. Production의 기존 URL·키·접수 설정은 그대로 둡니다. DB 환경변수가 없으면 설정 오류를 명시하며 JSON/mock/localStorage fallback이 없습니다.

## 적재 / 비교 / 재실행

```sh
npm run prayers:seed:dry-run
npm run prayers:seed -- /path/to/source.json --compare /path/to/other.json --dry-run
npm run prayers:seed -- --apply
```

기본은 DB에 접속하지 않는 dry-run입니다. 전체 데이터 검증과 두 파일 비교를 마친 뒤에만 `--apply`가 허용됩니다. key순서/포맷 차이와 의미 차이를 구분하고 동일ID 내용 충돌이면 적재하지 않습니다. source_key UNIQUE + ignoreDuplicates insert로 없는 데이터만 추가하며 관리자가 수정한 기존 데이터는 덮어쓰지 않습니다. build/페이지/앱 시작에서 seed를 실행하지 않습니다. scanned/inserted/skipped/failed와 오류 위치를 출력합니다.

## 이미지와 실패 복구

`prayer-covers` private bucket, JPEG/PNG/WebP만, 최대2MiB(2097152bytes). bucket에도 같은 제한을 적용합니다. 서버는 확장자·MIME·실제 decode 형식·크기·25Mpixel 상한을 확인합니다. 모든 byte를 디코드하여 잘린/위장 파일을 거부합니다. 파일을 전체 캔버스 이미지로 바꾸거나 애니메이션을 지원하지 않습니다.

- 새 파일은 서버 UUID 경로에 업로드합니다. 유지/교체/제거를 구분하며 client가 경로를 지정할 수 없습니다.
- 업로드 또는 DB 저장 실패시 새 파일 정리를 시도하고 기존 정상 파일은 삭제하지 않습니다.
- UPDATE는 조회한 updated_at에 조건을 걸어 경합시409로 구분합니다. 새 파일 연결 성공 후에만 옛 파일을 정리합니다.
- DELETE는 DB 삭제 성공 후 연결됐던 정확한 파일만 정리합니다. 이미지 GET은 레코드 경로를 조회해 서버가 Storage에서 받아 반환하며 no-store/nosniff를 적용합니다.
- 파일 정리 실패는 저장/삭제 성공과 구분해 경고를 표시하고 `PRAYER_IMAGE_CLEANUP_REQUIRED`의 id/path만 서버 로그에 기록합니다(키/원문 SDK 오류 없음). 재처리는 과제 DB에서 해당 path가 현재 다른 레코드에 연결되지 않았음을 확인한 후 그 정확한 파일만 삭제합니다. 자동 전체 bucket purge는 금지합니다. `npm run prayers:cleanup -- 'prayers/<recordUUID>/<uploadUUID>.png' --dry-run`으로 경로를 검토한 뒤 `--apply`를 명시해야만 DB 참조 확인과 단일 파일 삭제를 수행합니다.
- Route Handler는 실제 본문 stream을3MiB로 제한합니다. 2MiB 파일+폼에 여유가 있고 Vercel4.5MB 요청 한도 이내입니다. Server Actions를 사용하지 않아 bodySizeLimit을 변경하지 않습니다.

## 배포·QA 결과

작업 브랜치: `feature/mission-6-prayer-cms`. 기존 Mission5 PR과 Production branch는 보존하고 merge하지 않습니다. 기존 Vercel 프로젝트의 Preview를 우선 사용하며 Production을 새 CMS로 덮어쓰지 않습니다. 평가자 접근 URL·실제 적재/CRUD/Storage 검증 결과는 작업 완료 시 아래에 기록합니다. 설정이나 실제 연결을 확인하지 못한 경우 완료로 표시하지 않습니다.

현재 확인:

- 두 원본 및 복사본 SHA 동일, dry-run100건 유효·오류0.
- 사용자 승인 과제 프로젝트에 migration/private bucket 적용, RLS true, anon의 SELECT/INSERT/UPDATE/DELETE grant와 정책 모두 없음. Advisor의 RLS-no-policy INFO는 의도된 서버 전용 구조입니다.
- 검증된 seed 매핑으로 초기 SQL 적재(ON CONFLICT DO NOTHING): scanned100 / inserted100 / skipped0 / failed0. DB의100개 모두 원본 필드 매핑이 일치합니다. CLI 실제 `--apply`/재실행은 서버 키가 없어 아직 실행하지 않았습니다(중복/수정 보호는 모의 adapter 단위검사).
- unit137/137(13파일), browser75/75(5.6분), lint·typecheck·Webpack build PASS. 브라우저는 설정 누락/모의 HTTP 경로이며 실제 DB CRUD/Storage 검증이 아닙니다.
- 실제 로컬1440/393/360 화면에서 설정 오류와 등록 폼을 확인합니다. 실제 웹 등록→상세→수정→삭제, DB 빈 상태·페이지 이동, Storage 업로드/교체/제거와 배포 환경 최대파일 검사는 서버 키 설정 후 진행해야 합니다.
- 서버 비밀 키는 아직 비어 있습니다. Git 제외 `.env.cms.local`에 입력해야 실제 웹 연결과 Preview 환경변수 설정을 완료할 수 있습니다. 실제 웹 저장과 배포 QA가 완료된 상태로 보고하지 않습니다.

공식 참고: [서버 API key](https://supabase.com/docs/guides/getting-started/api-keys), [bucket 제한](https://supabase.com/docs/reference/javascript/storage-createbucket), [페이지 range](https://supabase.com/docs/reference/javascript/range), [Vercel 요청 제한](https://vercel.com/docs/functions/limitations).
