# 빛의 틈 · 7초 로컬 보정

최신 배포 승인: 사용자가 누적 보정을 마무리해 기존 랜딩 주소에 배포하도록 요청했다. 이하 로컬-only/게시 보류 기록은 이전 단계의 이력이며, 현재 랜딩 연결·검증·배포는 [FINAL_INTERACTION_RELEASE.md](FINAL_INTERACTION_RELEASE.md)를 따른다.


[현재2000ms 진입 대기 실측](evidence/gap-entry-delay-2000/browser.json): Chrome1440/393px에서 대기2002.4/2002.6ms, 활성 재생7005.9/7015.6ms, 전체9008.3/9018.2ms. 대기 중 clock0, 재생/정지/seek/최종 보기의 타이머 취소, reduced-motion PASS. lint/typecheck/unit60 PASS이며 로컬에만 반영했다.

최신 타이밍 보정: 로컬 미리보기의 화면 진입/다시 재생 앞 대기를700ms에서2000ms로 늘린다. 실제 모션은 기존7000ms 그대로이며 slider는 활성 모션 시간을 표시한다. 대기 포함 완료까지 약9000ms다. 대기 상태는 별도 안내하고, seek/최종/reduced-motion은 대기를 건너뛴다. 랜딩의 기본 delay0과 이번 변경의 게시 보류는 유지한다. 아래700ms 및7초 trace/영상은 이전 단계 검수 기록이다.

[현재 진입 대기 실측](evidence/gap-entry-delay/browser.json): Chrome1440/393px에서 대기701.9/702.4ms, 활성 재생7014.5/7017.1ms, 전체7716.4/7719.5ms. 대기 중 clock0 유지, 다시 재생/정지/seek/최종 보기의 timer 취소와 reduced-motion PASS. lint/typecheck/unit60 PASS. 새 변경은 로컬 미커밋 상태다.

이번 요청은 개발 미리보기만 보정한다. 기존 랜딩 파일·배포·PR·backend/DB/env/DNS는 변경하지 않으며 commit/push하지 않는다. `GapLightMotion`의 공유 player를 재사용하고 `variant="preview"`에서만 새 타임라인/질감을 선택한다. 기본 `landing` variant는 기존4521.43ms 타임라인·fill·blur·geometry를 유지한다.

## 실제 시간

| 범위 | 단계 |
| --- | --- |
| 0–400ms | 네이비 어둠 |
| 400–1300ms | 길이7.2%의 짧은 빛이 중앙을 따라 가속 낙하, 흔적 없음 |
| 1300–2000ms | 작은 접점 광원과 채워진 바닥 광채 확산 |
| 2000–2300ms | 짧은 빛과 바닥 광채를 유지하며 머무름 |
| 2300–4500ms | 같은 짧은 빛 상승, 선두부터 바닥까지 하나의 연속 core |
| 4500–6500ms | 중심/높이/바닥을 고정한 채 좁은 직사각형으로 확장 |
| 6500–7000ms | 가까운/먼 광채 정착 |
| 7000ms 이후 | 최종 모습 유지 |

UI의 전체 시간·slider max·현재 단계·재생 완료는 같은 clock에서 계산한다. 다시 재생/일시정지/재개/seek/최종 보기와 reduced-motion을 유지한다.

## 빛의 표현

- 바닥 필드의 가로/세로 크기는 이전 대비1.4배다. 중심에서 감쇠하는 radial gradient의 채워진 타원을 사용하며 링·수평선은 없다. 접점은 짧게 밝아졌다가 부드럽게 정착하고 상승/확장에도 바닥 빛을 유지한다.
- face는 원래 중심/높이/폭을 보존한다. 아이보리 화이트의 미세한 가로 gradient와0.8SVG-unit Gaussian softness로 가장자리를 처리한다. 360–600px canvas에서10–90% edge 폭은 약0.6–1px이다. stroke/border/rx/문틀은 없다.
- near glow는 좁고 밝은 아이보리, mid glow는 약하게 연결하고 far glow는 최대0.035alpha의 넓은 radial field로 감쇠한다. 폭·밝기는 틈 확장과 함께 연속적으로 변한다. 전체 canvas/background를 scaleX하지 않는다.
- gradient/filter/mask ID는 인스턴스별 고유하며, 기존 RAF/observer/visibility cleanup을 유지한다. 새 dependency는 없다.

## 실행 및 검증

`npm run preview:gap-light` → `http://127.0.0.1:3100/dev/gap-light`.

## 변경 파일

- `src/components/motion/gap-light-preview-timeline.ts`: 미리보기 전용7000ms와 새로운 광원 필드. 기존 `gap-light-timeline.ts`는 변경하지 않는다.
- `src/components/motion/gap-light-motion.tsx` / `.module.css`: 기존 player에 명시적인 preview 선택, 미세한 면 gradient/softness·분리된 광채. 기본 landing 분기는 기존 값 유지.
- `src/components/dev/gap-light-preview.tsx` / `.module.css`:7000ms slider와 현재 단계, 접촉/머무름 안내. phase는 DOM output에 갱신하며 프레임마다 React state를 변경하지 않는다.
- `tests/gap-light-preview-timeline.test.ts`: 새6개 검사(상태/연속성/field/기본 landing 보존).
- AGENTS / README / 기존 preview 기록: 로컬7초 범위와 게시 보류 명시.

## 실제 확인한 결과

- lint/typecheck/unit **60/60 PASS**, `npm run build -- --webpack` PASS.
- [실제 Chrome trace](evidence/gap-light-seven/browser.json):1440/393/360px에서7000ms 타임라인의 벽시계 관측은 각각7019.0 /7008.4 /7005.5ms. dark/fall/impact/hold/rise/open/settle가 실제 재생에서 각각 관측됐다. phase 정지 캡처는 slider seek로 구분한다.
- 재생 유지, seek/키보드Home·End·10ms, 일시정지/재개, 연속 replay4회 취소·재시작, 최종 보기, reduced-motion PASS. 원치 않는 가로 넘침·console/page 오류·신청 POST0건.
- [단계 표시 검수](evidence/gap-light-seven/phase-labels.json):8개 시점에서 실제 frame의 한글 phase와 시간 output, slider max7000, 재생 완료 상태가 함께 갱신됨을 확인했다.
- [바닥 머무름](evidence/gap-light-seven/393-hold.png), [상승](evidence/gap-light-seven/393-rise.png), [Desktop 최종](evidence/gap-light-seven/1440-final.png), [Mobile393 최종](evidence/gap-light-seven/393-final.png), [Mobile360 최종](evidence/gap-light-seven/360-final.png)을 확인했다. 최종 face는 중심/높이/바닥 고정, stroke/모서리radii 없음. 새 그림자는 미리보기 canvas 안에서 네이비로 감쇠한다.
- [실제 전체 재생 영상](evidence/gap-light-seven/393-replay.webm)과 [녹화·디코딩 기록](evidence/gap-light-seven/video.json):393×477px,418개 실제 화면 frame, source clock7000ms. 녹화 시작/끝 여유를 포함한 capture walltime은 약7.85초다. 저장된 WebM을 새 Chrome 화면에서 보통 속도로 다시 재생해 낙하·접촉·머무름·상승·확장·최종 화면을 확인했다. 녹화 중 source seek나 별도 encoder/dependency는 없다.
- [실제 픽셀 샘플](evidence/gap-light-seven/appearance.json): face 중심RGB255/255/254, 가장자리 부근255/253/243으로 미세하게 변화한다. 바닥 가로 경계RGB9/15/39로 배경8/14/38에 가깝게 감쇠한다. 이는 모든 화면에서 주관적인 질감까지 동일하다는 주장이 아니다.

기존 Landing의 관련 브라우저 검사 `npm run test:e2e -- tests/e2e/gap-light.spec.ts` **6/6 PASS**(47.3초). 기존4521.43ms 완료·재진입 유지·기기3폭·화면 밖 pause·visibility 이벤트 처리·reduced-motion·no-JS·CTA 연결을 확인했다. Landing section/CSS, 기존 timeline, API/backend/env/dependency/lockfile과 Git HEAD6d7577f는 유지한다. 이번 변경은 미커밋 상태이며 PR/Vercel 변경은 없다.

물리 iPhone/Android·Safari·OS-level background throttling은 이번에 확인하지 않았다. 전체47개 Landing suite를 이번 로컬 실험에서 모두 재실행했다고 주장하지 않는다. 발광면은 SVG 표현이며 원본 PNG와의 픽셀 일치는 목표가 아니다. commit/push/배포/PR/merge/DB/env/DNS 변경은 하지 않는다.
