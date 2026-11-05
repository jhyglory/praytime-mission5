# Vercel Deployment Checklist

현재 상태: **최종 구현 commit/push 완료, Vercel 연결 진행 중**. GitHub 계정 연결의 최종 권한 승인을 대기 중입니다. production URL과 실제 QA 결과는 배포 후 기록합니다.

## Import / Build

- [ ] Repository: https://github.com/jhyglory/praytime-mission5 (Vercel GitHub 접근 권한 확인)
- [ ] Root Directory: **.** (package.json이 Git root에 있음. 로컬 바깥 `outputs` 폴더를 입력하지 않음)
- [ ] Framework Preset: **Next.js** 자동 감지 확인
- [ ] Node.js: **24.x**, Install Command: `npm ci`
- [ ] Build Command: `npm run build`, Output Directory: Next.js 기본값(별도 override 없음)
- [ ] Runtime: Route Handler Node.js, static export 사용 금지(API 필요)
- [ ] Production Branch: 최종 PR을 merge할 base branch. 현재 작업 branch는 feature/mission-5-landing

## 환경별 변수

| 이름 | Development / Preview | 최종 승인 후 Production |
| --- | --- | --- |
| BETA_SIGNUP_PERSISTENCE | disabled | supabase |
| SUPABASE_URL | 비우거나 기존 URL, disabled 유지 | 기존 project HTTPS URL |
| SUPABASE_PUBLISHABLE_KEY | 비움 | 기존 public INSERT publishable key |
| SUPABASE_ANON_KEY | 비움 | 일반적으로 비움, legacy anon JWT 필요 시만 |
| SITE_URL | 로컬 비움, Preview는 검증할 preview origin 선택 | 실제 Mission 5 production origin |

- [ ] Dashboard Settings → Environment Variables에서 scope를 구분. key 값은 README / Git / NEXT_PUBLIC_ 변수에 넣지 않음.
- [ ] service-role / sb_secret_ key 사용하지 않음. 기존 RLS를 이용하는 server adapter 유지.
- [ ] 환경변수 변경 후 해당 환경을 redeploy. 정적 metadata는 build 때 반영됨.
- [ ] 최종 public connection은 기존 Lovable와 동일 project인지 확인. 새 database 생성하지 않음.
- [ ] consent SQL은 이번 단계 실행 금지. 기존 적용 이력과 schema 확인 없이 db push하지 않음.
- [ ] client bundle에 Supabase URL / key 및 SDK가 포함되지 않는지 정적 검사.

## 출시 전 확인

- [ ] 최종 Desktop / Mobile / Handoff 반영 및 visual pass
- [ ] 개인정보 고지 불일치 보완 승인, 게시본 snapshot / version hash 갱신
- [ ] 승인 favicon / OG asset 등록, SITE_URL 설정, indexing 정책 검토
- [ ] lint / typecheck / unit / browser / production build 통과
- [ ] 최종 UI 이후 실제 QA POST는 요청 범위의 1회 계획으로 진행. 기존 QA 중복 재실행 금지
- [ ] Preview에서 disabled 응답 / 입력 유지, console·asset·anchor 확인
- [ ] Production deployment 및 실제 Vercel URL을 README에 반영
- [ ] 최종 commit / push / PR. 제목 `[하영]-미션5`

main의 최소 review baseline과 feature 전체 구현 commit을 만들고 각각 push했습니다. Vercel production source는 feature/mission-5-landing으로 지정해 mentor merge 전에도 검수할 수 있게 합니다. 멘토가 PR을 merge한 뒤 production branch를 main으로 전환할 수 있습니다. 에이전트는 PR을 merge하지 않습니다.

공식 참고(2026-11-06 확인): [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Build settings](https://vercel.com/docs/builds/configure-a-build), [Environment variables](https://vercel.com/docs/environment-variables).
