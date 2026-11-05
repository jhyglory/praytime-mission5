> 이 문서는 이전 구현/승인 QA 이력입니다. 최신 디자인 동결·Git·자동 테스트 준비 상태는 [PRE_FIGMA_STATUS.md](PRE_FIGMA_STATUS.md)를 참조하세요. 이번 준비 단계에는 추가 DB 변경/운영 POST를 하지 않았고 로컬 persistence는 disabled입니다.

# Mission 5 구현·검증 기록

검증일: 2026-11-06 (Asia/Seoul)

**최신 동의 기록/POST 검증:** 사용자 승인에 따라 nullable 동의 metadata 3개 컬럼을 추가하고 QA 1건으로 201/409/422 및 DB 기록·UI 성공 gate를 확인했습니다. 현재 결과는 `CONSENT_RECORDING_QA.md`를 기준으로 합니다. 아래 최초 UI/backend audit 기록은 당시 범위와 구분합니다.

**Backend 후속 조사 반영:** 운영 Lovable 배포 코드와 실제 읽기 전용 API에서 기존 Supabase/table/컬럼을 확인했고 같은 저장소에 로컬 adapter를 연결했습니다. 전체 backend를 UNCONFIRMED로 두었던 이전 상태를 갱신합니다. Lovable 원본 env와 DB catalog에서 UNIQUE(email)·RLS·trigger까지 확인했습니다. 운영 insert 응답은 미검증입니다. 상세: `LOVABLE_BACKEND_AUDIT.md`.

## 결과

승인된 Desktop `913:13`, Mobile `913:14`, Handoff `913:15`를 기준으로 정적 Landing, 모든 요청된 UI 동작, 폼 검증과 Route Handler/adapter 경계를 구현했습니다. 기존 Lovable backend의 공개 연결과 계약은 확인하여 로컬 adapter에 연결했습니다. 승인된 QA 신청 1건으로 실제 저장과 응답을 확인했습니다. 배포 완료 상태는 아닙니다. 비공개 RLS와 email UNIQUE 제약은 Lovable 연결을 통해 확인했습니다.

## 실행한 검사

| 검사 | 결과 |
| --- | --- |
| `npm run lint` | PASS, warning 0 |
| `npm run typecheck` | PASS |
| `npm test` | PASS, 21개 (consent validation·서버 metadata·publishable key 헤더·legacy JWT 포함) |
| `npm run build` | PASS, `/` 정적 생성 및 `/api/beta-signup` 서버 route 생성 |
| `npm run test:e2e` | UI 구현 단계 production 서버에서 PASS, 14개. 후속 backend 수정은 단위 검사·build로 검증 |
| 최종 screenshot 검증 | responsive 8개 재검사 PASS |
| dependency audit | 설치 완료 시 vulnerability 0 |

검증 환경: Node.js 24.22.0, npm 11.19.1, Next.js 16.4.5, React 19.3.1, Tailwind 4.3.4, macOS 설치 Chrome.

## 브라우저 검사 범위

- 1440 / 1280 / 1024 / 768 / 430 / 393 / 375 / 320px에서 페이지 가로 overflow 없음
- H1 하나, 8개 섹션 순서, 8개 폼 그룹 유지
- 이미지 로딩 및 실제 앱 프리뷰 폭: Desktop 252px, Mobile 280px
- Hero object geometry: Desktop 1140×855 crop, Mobile 690×517.5 crop
- FAQ 5개 기본 펼침, 독립 toggle, Enter/Space
- Hero 앱 전용 Light/Dark, 방향키, 사이트 canvas와 Loop 프리뷰 Dark 유지
- CTA 앵커와 키보드 사용 시 목적지 제목 포커스
- 동의 미선택 시 submit disabled, 첫 오류 필드 포커스
- 실제 로컬 POST의 `503 BACKEND_UNCONFIRMED`, 입력 유지와 재시도 가능
- loading 중 재제출 방지
- 모의 HTTP success/duplicate/receipt 누락 결과 구분과 전환 이벤트 조건

## 검증의 한계

단위 테스트는 **모의 HTTP**이며, 별도로 승인된 합성 QA 신청 1건을 실제 backend에 저장했습니다. 실제 201/409/422, 동의 metadata와 UI receipt gate를 확인했습니다. RLS, schema와 이메일 unique constraint도 검증했습니다.

기존 저장소의 공개 연결을 확인해 `.env.local`은 같은 운영 프로젝트에 연결했습니다. Portable `.env.example`과 자동 테스트 서버는 disabled 상태를 유지합니다. 운영 insert QA를 수행하지 않았으며, 사용자 입력을 파일이나 다른 임시 DB에 대신 저장하지 않습니다.

Handoff와 후속 운영 Privacy JS 조사에서 개인정보 고지가 필수 nickname/signup_reason과 기기 필수 여부에 맞지 않는 것을 확인했습니다. 승인된 Privacy URL을 유지했으며, 고지 문구를 임의 작성하거나 수정하지 않았습니다. 이 정합성 확인과 실제 저장 검증은 배포 전 남은 연결 조건입니다.

## 시각 확인

Desktop 및 Mobile Hero를 Figma screenshot과 대조했습니다. 각 breakpoint의 crop과 앱 크기, native Pause Mark, 원본 Puzz/Prayer Light 배치를 확인했습니다. 앱 화면의 고정 좌표는 승인된 앱 미리보기 내부에 한정되며, 사이트 섹션은 grid/flex로 반응형 구성했습니다.

Figma 코드 export가 축소된 wordmark instance의 tracking을 master 값으로 반환하는 부분은 screenshot을 기준으로 배율을 보정했습니다. 버튼은 60px 높이, FAQ와 interactive control은 키보드 및 터치 접근성을 적용했습니다.

## 에셋 확인

모든 원본 파일의 non-empty 상태와 코드 참조를 확인했습니다. SVG root width/height는 변경하지 않았습니다. 앱 프리뷰의 SVG는 원본 크기를 유지하며 프리뷰 전체 배율과 함께 확대됩니다. 만료되는 Figma asset URL을 런타임 코드에서 참조하지 않습니다.

| 로컬 에셋 | 승인 slot / callsite |
| --- | --- |
| `offset-interval-b-refinement-v11-hero-only.png` | Hero `916:311 / 916:797`, `hero-preview.tsx` |
| `puzz-quiet-companion.png` | PRAY `914:63`, Voluntary `916:600`, `app-screens.tsx` / `puzz.tsx` |
| `low-prayer-light-no-strong-mark.svg` | PRAY `914:62`, `app-screens.tsx`, native 269.313×230.84 |
| `local-ground-low-oval-reflection.svg` | PRAY Puzz ground `834:13`, `app-screens.tsx`, native 18.0568×4.37313 |
| `contact-shadow-under-feet.svg` | PRAY Puzz contact `834:14`, `app-screens.tsx`, native 11.2855×1.83389 |
| `local-ground-low-oval-reflection1.svg` | Voluntary ground `834:13`, `puzz.tsx`, native 32×7.75 |
| `contact-shadow-under-feet1.svg` | Voluntary contact `834:14`, `puzz.tsx`, native 20×3.25 |
| `chevron.svg` | Form select `913:116`, `globals.css`, native 24×24 |
| `control-indicator-aligned.svg` | OS Radio, `globals.css`, native 20×20 |
| `toggle-icon.svg` | FAQ open `913:100`, `faq.tsx`, native 24×24 |
| `toggle-icon-closed.svg` | FAQ closed `913:107`, `faq.tsx`, native 24×24 |

Pretendard/Inter는 로컬 제공하며 공식 라이선스를 `docs/licenses/`에 포함합니다.

## 남은 작업

승인된 개인정보 고지 보완 → 새 공개 고지 snapshot/version 반영 → 배포. 기존 저장소 연결, nullable 동의 기록 migration, 실제 success/duplicate/invalid/attribution·UI 검증은 완료했습니다.

디자인 재설계, 새 기능, 새 DB, 기존 사용자 데이터 변경이나 외부 배포는 수행하지 않았습니다. 합성 QA 신청 1건만 생성했습니다.
