# Vercel Deployment Checklist

현재 상태: **배포 READY** — [Production](https://praytime-mission5.vercel.app), project glorifier1/praytime-mission5. GitHub 연결 / CLI 인증 완료. 실제 저장은 사용자 지시에 따라 비활성화했습니다. 실제 QA는 docs/FINAL_DELIVERY.md와 docs/evidence에 기록했습니다.

## Import / Build

- [x] Repository: https://github.com/jhyglory/praytime-mission5 (Vercel GitHub 접근 권한 확인)
- [x] Root Directory: **.** (package.json이 Git root에 있음. 로컬 바깥 `outputs` 폴더를 입력하지 않음)
- [x] Framework Preset: **Next.js** 자동 감지 확인
- [x] Node.js: **24.x**, Install Command: `npm ci`
- [x] Build Command: `npm run build`, Output Directory: Next.js 기본값(별도 override 없음)
- [x] Runtime: Route Handler Node.js, static export 사용 금지(API 필요)
- [x] Production Branch: feature/mission-5-landing (mentor merge 후 main으로 전환 가능)

## 환경별 변수

| 이름 | Development / Preview | 최종 승인 후 Production |
| --- | --- | --- |
| BETA_SIGNUP_PERSISTENCE | disabled | disabled (LEGAL REVIEW REQUIRED) |
| SUPABASE_URL | 비움 | 비움, 고지 승인 전 등록 금지 |
| SUPABASE_PUBLISHABLE_KEY | 비움 | 비움, 고지 승인 전 등록 금지 |
| SUPABASE_ANON_KEY | 비움 | 일반적으로 비움, legacy anon JWT 필요 시만 |
| SITE_URL | 로컬 비움, Preview는 검증할 preview origin 선택 | 실제 Mission 5 production origin |

- [x] Dashboard Settings → Environment Variables에서 scope를 구분. key 값은 README / Git / NEXT_PUBLIC_ 변수에 넣지 않음.
- [x] service-role / sb_secret_ key 사용하지 않음. 기존 RLS를 이용하는 server adapter 유지.
- [x] 환경변수 변경 후 해당 환경을 redeploy. 정적 metadata는 build 때 반영됨.
- [x] 최종 public connection은 기존 Lovable와 동일 project인지 확인. 새 database 생성하지 않음.
- [x] consent SQL은 이번 단계 실행 금지. 기존 적용 이력과 schema 확인 없이 db push하지 않음.
- [x] client bundle에 Supabase URL / key 및 SDK가 포함되지 않는지 정적 검사.

## 출시 전 확인

- [x] 최종 Desktop / Mobile / Handoff 반영 및 visual pass
- [ ] 개인정보 고지 불일치 보완 승인, 게시본 snapshot / version hash 갱신
- [x] 승인 favicon / OG asset 등록, Vercel system URL metadata fallback 확인, noindex 유지
- [x] lint / typecheck / unit / browser / production build 통과
- [x] 실제 INSERT QA는 고지 정합성 승인 후로 보류. 현재 production503/no receipt 차단을 검증
- [x] Production에서 disabled 응답 / 입력 유지 / asset·anchor 확인 (Preview 별도 수동 QA 미실시)
- [x] Production deployment 및 실제 Vercel URL을 README에 반영
- [x] 최종 commit / push / PR. 제목 `[하영]-미션5`

main의 최소 review baseline과 feature 전체 구현 commit을 만들고 각각 push했습니다. Vercel production source는 feature/mission-5-landing으로 지정해 mentor merge 전에도 검수할 수 있게 합니다. 멘토가 PR을 merge한 뒤 production branch를 main으로 전환할 수 있습니다. 에이전트는 PR을 merge하지 않습니다.

공식 참고(2026-11-06 확인): [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Build settings](https://vercel.com/docs/builds/configure-a-build), [Environment variables](https://vercel.com/docs/environment-variables).

## QA limits

정상 유효 payload503 PRIVACY_REVIEW_REQUIRED, 잘못된 입력422, no receipt 검증 완료. 모든 실제 INSERT는 보류했습니다. 일반 Chrome은 확장 경고와 hydration418이 있으며 원인 확장은 특정하지 않았습니다. 확장 없는 isolated Chrome context는 error0 / missing asset0 / eight widths PASS입니다. native incognito 수동 단계는 UI 도구 timeout으로 미확인입니다.

.vercelignore로 .env* / .vercel / .git / node_modules / .next를 source upload에서 제외합니다. CLI가 생성한 local OIDC token은 배포하거나 commit하지 않습니다.
