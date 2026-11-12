# PrayTime

SNS를 열기 전 잠깐 기도하고, 지금 필요한 사용인지 다시 선택하도록 돕는 기독교 기반 디지털 웰니스 서비스입니다. 무심코 반복되는 사용을 멈추고 싶은 성인 개신교인을 위한 제품 소개·무료 베타 사전예약 Landing입니다.

**PAUSE → PRAY → CHOOSE → USE → RETURN**: 기도 후 돌아가거나5·10·15분을 선택합니다. 기도만으로 자동 해제되지 않으며 정한 시간이 끝나면 다시 제한됩니다.

- [사이트](https://praytime-mission5.vercel.app/)
- [GitHub](https://github.com/jhyglory/praytime-mission5)
- [기존 PR #1 · [정하영]-미션5](https://github.com/jhyglory/praytime-mission5/pull/1)

## 기술과 구현

Next.js16 App Router · React19 · TypeScript · Tailwind CSS4 · shadcn/ui(Radix Accordion / Slot·CVA Button) · Supabase. 섹션은 역할별 컴포넌트로 분리하며 Tailwind 테마/유틸리티로 공통 스타일과 반응형 레이아웃을 관리합니다. 정밀한 SVG/카드 모션은 CSS·WAAPI·IntersectionObserver를 사용합니다.

구현 interaction: anchor/focus 이동, 순차 질문·로고 등장, 통계 count-up,80장 SNS 무한 교차 스트림·하트/종이비행기, 빛의 틈, 누적 기도 단계,5/10/15분 wheel, 키보드 FAQ, 폼 검증·로딩·중복·성공/오류 처리. 화면 밖/비활성 탭 정지와 reduced-motion을 지원합니다.

Mobile/Tablet/Desktop을 대응합니다. 기존 디자인 기준을 유지해 md=768px, lg=1200px를 사용합니다. 자세한 시각·모션 계약과 Figma 링크는 [디자인 문서](docs/PRAYTIME_DESIGN.md)에 있습니다.

## 설치·실행

Node.js24.x / npm11. 이 README와 package.json이 있는 디렉터리가 프로젝트 루트입니다.

```sh
npm ci
cp config/environment.example .env.local # 기존 파일이 있으면 덮어쓰지 마세요
npm run dev
```

기본 주소는 http://127.0.0.1:3000 입니다. 개발 전용 빛 미리보기는 npm run preview:gap-light 후 /dev/gap-light 에서 확인합니다. production에서는 개발 도구를 노출하지 않습니다.

```sh
npm run lint
npm run typecheck
npm run test
npm run build -- --webpack
npm run test:e2e
```

브라우저 검사는 별도 서버에서 persistence를 강제로 disabled합니다. 실제 DB에 저장하지 않으며 성공 응답은 명시적으로 mock합니다. 로컬 disabled 접수는 가짜 성공 대신503을 반환합니다.

## Backend·환경변수

BetaSignupForm → POST /api/beta-signup → 서버 validation/동의 기록 → SignupStore adapter → 기존 Supabase public.beta_signups. 실제201/receipt 이후에만 성공을 표시하며 UNIQUE(email) 중복은409로 구분합니다. 새 DB를 만들지 않습니다.

필요한 이름: BETA_SIGNUP_PERSISTENCE, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY(또는 SUPABASE_ANON_KEY), PRIVACY_COLLECTION_APPROVED, SITE_URL. 고지 버전은 서버 상수와 승인된 snapshot으로 관리합니다. 실제 적용 이름/허용값은 config/environment.example과 [Backend](docs/BACKEND_ARCHITECTURE.md)를 따릅니다. secret은 문서나 client bundle에 넣지 않습니다. 기존 Production 접수는 live이며 이번 스타일 작업에서는 변경하지 않습니다.

## 배포

기존 GitHub feature/mission-5-landing → Vercel 프로젝트 praytime-mission5를 사용합니다. Root Directory는 이 프로젝트 루트, Framework는 Next.js입니다. 환경변수와 배포 절차는 [Vercel checklist](VERCEL_DEPLOYMENT_CHECKLIST.md)를 따릅니다. Tailwind 정리와 검증을 완료했고 사용자가 기존 브랜치의 커밋·푸시를 승인했습니다. 푸시 후 기존 PR에 자동 반영되며 연결된 Vercel이 자동 배포할 수 있습니다. PR merge는 멘토 리뷰에 맡깁니다.

## 문서

- [제품](docs/PRAYTIME_PRODUCT.md) · [디자인/모션](docs/PRAYTIME_DESIGN.md) · [구현/검수](docs/MISSION5_LANDING.md)
- [Backend 구조](docs/BACKEND_ARCHITECTURE.md) · [활성화 근거](docs/BACKEND_ACTIVATION.md)
- [Privacy audit](docs/PRIVACY_AUDIT.md) · [Migration runbook](docs/CONSENT_MIGRATION_RUNBOOK.md)
- [이번 리팩터링 검증](docs/STYLE_REFACTOR.md)

이전 작업 보고서는 docs/archive/history-before-tailwind-2026-11-09.tar.gz 하나로 보관했습니다. 라이선스·고지 snapshot·테스트에서 사용하는 증거와 원본 디자인 에셋은 유지합니다.

## 제한사항

이 저장소는 Landing이며 실제 OS 앱 차단 기능은 모바일 제품의 범위입니다. 기도 원문 수집 여부는 설계 방향으로 표현합니다. 물리 모바일/Safari 검수와 Lighthouse는 별도 확인이 필요합니다. 현재 검색엔진 indexing 설정(noindex/nofollow)은 이번 스타일 변경에서 수정하지 않았으며 정식 공개 범위에 맞춰 별도로 검토해야 합니다.

## 기도문 CMS · Mission 6

**인증 없는 과제용 관리 화면**입니다. 과제 전용 Supabase에서 일반 서비스 기도문만 관리하며 운영 사전신청 데이터와 분리합니다. 등록 → 목록(20개 페이지네이션) → 상세 → 수정 → 확인 후 삭제, 선택적 대표 이미지 업로드·교체·제거를 제공합니다. 로그인·역할·사용자별 권한은 Mission7에서 구현합니다. 개인정보나 개인 기도제목을 입력하지 마세요.

- 진입: `/admin` → `/admin/prayers`
- 로컬: `npm run dev:cms`
- 원본 JSON100편은 iOS/Android가 바이트까지 동일하며 원본 수정 없이 한 번만 초기 적재합니다.
- `npm run prayers:seed:dry-run` / 명시적 실제 적재는 `npm run prayers:seed -- --apply`
- `.env.example`의 변수 이름만 참고하고 실제 비밀 값은 Git 제외 환경 파일에 보관합니다.
- [기능 명세·원본 비교·DB 매핑·Storage·적재·QA·배포](docs/PRAYER_CMS.md)

CMS는 Preview 환경을 우선 사용하며 기존 Production과 사전신청 설정을 변경하지 않습니다. DB 미설정 상태는 오류로 표시하고 JSON·localStorage로 성공을 흉내내지 않습니다.
