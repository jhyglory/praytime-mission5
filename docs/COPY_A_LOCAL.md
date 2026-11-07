# A안 카피 · 로컬 적용 및 검수 · 2026-11-08

## 범위와 상태

사용자가 제공한 A안 원고가 교체 문구의 기준이다. 작업 시작 HEAD는ab235d84f122ebc22f30b36ccb82d6584606c3cf이며 시작 시 working tree는 clean이었다. 현재 feature/mission-5-landing과 사용자 변경을 보존한다. **로컬 검수 후 사용자가 A안을 확인하고 커밋·푸시·배포를 승인했다.** 기존feature/PR #1/Vercel release를 진행한다. merge·main·새PR·DNS·실제신청·DB작업은 하지 않는다. 아래 로컬 미발행 기록은 검수 당시 이력이며, 최종 배포 identity와 공개 화면 확인 결과는 기존 PR #1에 기록한다.

| 구간 | 적용 | 실제 수정 파일 |
| --- | --- | --- |
|01 Hero | 상단 소개·H1·본문·Primary CTA·예약 안내 |src/components/landing/hero-section.tsx |
|02 질문 | 두 문장 전체, 기존1200ms/800ms 순차 fade 유지 |src/components/landing/one-question-section.tsx |
|03 WHY NOW | 헤드라인·카드 아래 설명, Desktop/Mobile 양쪽 |src/components/landing/why-now-section.tsx |
|04 인트로/SNS | 인트로/로고·분리는 유지, SNS 본문·보조·sr-only 설명 |src/components/landing/signature-transition.tsx |
|05 빛의 틈 | H2·설명, 동등한 두 선택/링크/모션 보존 |src/components/landing/gap-section.tsx |
|06 시간 선택 | H2·설명·Desktop/Mobile reminder,5/10/15 UI 보존 |src/components/landing/time-select-section.tsx |
|07 기도와 선택 | H2·설명·3단계·자발적 기도 안내 |src/components/landing/voluntary-prayer-section.tsx, prayer-steps.tsx |
|08 사전예약 | H2·첫 안내·모집 대상·참여 조건 |src/components/landing/beta-signup-section.tsx |
| FAQ | 질문7개·답변 전체, 설계중이라는 개인정보 표현 유지 |src/components/landing/faq-section.tsx |
| 폼 | 지정 label/placeholder/helper/legend/submit·폼 접근성 이름 |src/components/landing/beta-signup-form.tsx |

## 레이아웃·동작 보존

1440/393/360의 변경 전 production artifact를 로컬에서 실행해 copy 슬롯·section 높이·Hero CTA 위치·폼 DOM 계약을 기록했다. 모바일 문구가 짧아져 Hero CTA가112px, GAP 선택지가30–74px, 시간 미리보기가26px 위로 이동하는 것을 확인했다. 기존 텍스트 슬롯 크기만 유지했다: Hero editorial 최소352px, GAP h2/body 최소132/90px, Time story body 최소78px. 변경 파일은whole-upper.css와whole-page.css이며 전체 font/width/padding/gap/배경/에셋은 변경하지 않는다. 길어진 Prayer/FAQ/폼은 기존 flow/Accordion auto-height로만 자연스럽게 커지거나 줄어든다.

인트로는 직전 승인된 고정된 상단 밝음→하단 네이비 gradient를 유지한다. ‘그래서’가 사라져도 상단은 밝고 실제 로고는 원래 아래 네이비 영역이다. A안의 ‘흰 배경 구간’ 표현은 카드 없는 독립 인트로를 뜻하는 것으로, copy-only 보존 지침에 따라 배경/실제 로고를 새로 칠하지 않았다. 인트로/SNS/기도/빛의 timing JSON, 컨트롤, particle/column 데이터와80사진은 수정하지 않는다.

폼의 key·선택지 전송값·required·consent·privacy URL·API·RLS·환경변수·실제 저장소는 변경하지 않는다. 테스트는disabled persistence 또는HTTP mock이고 production 신청·DB query/INSERT는 없다. 분석 이벤트와anchor/ARIA 연결ID도 유지한다.

## 검증

| 명령/검사 | 현재 결과 |
| --- | --- |
| npm run lint | PASS |
| npm run typecheck | PASS |
| npm run test |60/60 PASS,7files |
| npm run build -- --webpack | PASS |
| npm run test:e2e (3102 임시 구성) | 전체67개 항목 확인: 최초63PASS/4FAIL 후 해당4개 기대값·동기화 보정 및 재실행PASS |
| 최종 줄바꿈 보정 후 landing/whole-page/motion-polish | 관련26개 확인:25PASS 후 anchor/intro 검사를 독립 진입으로 분리해1개 재실행PASS |

최초 실패는 구 SNS 보조문구 기대값, 예전 FAQ 답변의100px 고정 높이 기대값, 자동화 왕복이500ms 대기/초기 pause를 소진하던 통계 검사였다. 원고 기대값과 실제 native answer height로 갱신하고 짧은 구간은 브라우저 안에서 샘플링했다. 최종 anchor/intro 사례는 앞선 smooth anchor·focus가 남지 않도록 fresh entry에서 테스트하며1700ms reveal 완료 후 영구 트랙을 검사한다. 실제 모션 코드/시간은 변경하지 않았다. 한 번의 전체 실행이 처음부터67/67이었다고 표시하지 않는다.

1440/393/360px에서8구간·FAQ·폼을 실제 캡처해 읽고, viewport 밖의 WHY설명/출처·GAP두선택지·FAQ4–7·폼중간/최근시도/하단까지 추가 캡처로 확인했다. 가로 넘침0, 텍스트box 잘림0, console/page error0. FAQ7개를 모두 펼쳐 각 region이 native height(오차1px 이내)로 완전히 표시됨을 확인했다. 새 카피의좁은 자발기도/베타 안내는 모바일에서 word-break:keep-all, 자발기도의불필요한 mobile강제br만 제거해 완성 단어로 읽히게 했다. 폰트·폭·section 높이는 이 줄바꿈 보정 전후 동일하다.

변경 전후 DOM 대조에서 폼 control ID/name/type/value/required/options/ARIA references가 모두 동일했다. 각 슬롯의font/line-height/color/background/padding/gap도 동일하다. Hero CTA y는1440에서422px,393/360에서724px, GAP choice의section기준y는980/771/771px, time story높이는365/258/258px로 기존과 같다. 통계 설명은 카드 뒤·출처 앞이며 실제 수치34.3/25.3와빨간80/70장식·500ms대기/1400ms 진행을 유지한다.

질문의두span1200ms시차/동시문장fade, 기존독립intro→SNS순서, SNS1700ms readingfield·열교차21.42857s·80사진무중복/두주기·16hearts/4planes, GAP1200ms+5784.615ms motion, prayer3900ms누적light, 시간선택tap/keyboard/swipe, FAQkeyboard/native-height/reversal, 폼검증/503/성공/중복/오류/receipt guard는 실제 로컬 browser tests로 확인했다. 성공/중복 등은HTTP mock이고 운영신청/DB INSERT는 없었다.

캡처·로그·layout.json·comparison.json은작업산출물 outputs/copy-a-local(저장소 밖)에 보관한다. 현재 미리보기는http://127.0.0.1:3102/이며 실제 저장은disabled다. 실물모바일·Safari·FPS는 검증하지 않았다.

검증 원고 fixture:tests/fixtures/copy-a.json. 섹션41개·폼7개·FAQ7쌍을 사용자 원고 기준으로 전사했으며 Desktop/Mobile hidden copy 및 접힌 FAQ 답변 전체도 비교한다. 기존 unit/e2e는 바뀐 기대 문구만 최신화했고 외부 요청 차단은 현재 test baseURL을 사용한다. 다른 프로젝트의3000 포트를 중단하지 않고 별도3102 포트에서 검사한다.

## 기타 실제 변경 파일

- 배치 보존:src/components/landing/whole-upper.css, whole-page.css. 단어 단위 mobile 줄바꿈:whole-lower.css 및 voluntary-prayer-section.tsx의desktop-only br.
- 원고/동작 회귀:tests/fixtures/copy-a.json, tests/accordion.test.ts, tests/e2e/intro-motion.spec.ts, landing.spec.ts, micro-interactions.spec.ts, motion-polish.spec.ts, question-reveal.spec.ts, whole-page.spec.ts.
- 현재 로컬 범위/발행 보류 맥락:AGENTS.md, README.md, docs/PRAYTIME_PRODUCT.md, PRAYTIME_DESIGN.md, MISSION5_LANDING.md 및 이 검수 문서.

## 적용 제외·유지 항목

- public/assets/time-select-wheel.png 안의 앱 UI 원문: 사용자 지시대로 원본 이미지를 유지한다. src/components/landing/time-select-preview.tsx의선택값 UI/동작·alt도 유지한다.
- src/components/landing/ambient-cards.tsx / mobile-ambient-cards.tsx의장식용 SNS 카드 UI 문구 및 사진: 카드 구조/모션 보존 대상이다.
- src/lib/site-metadata.ts: 기존 SEO/OG 제목·설명은 지정된8개 화면/FAQ/폼 교체 범위 밖이므로 유지했다.
- beta-signup-form.tsx의기존 성공 alert ‘사전신청이 접수되었습니다.’와src/lib/beta-signup.ts의검증 오류 문구: 새 원고가 지정하지 않은 상태/검증 메시지이므로 동작과 함께 보존했다.
- 개인정보 동의 문구·Privacy URL·법률 문서는 변경하지 않는다.
- 별도 기존 관찰: 비활성 제출 버튼은기존회색스타일로 대비가낮고, 일부변경대상외선택지에는한글자동줄바꿈이있다. 이번카피로인한 잘림/입력차단은 없으며 기존디자인/전송값 보존지침에따라 변경하지 않았다.

## 실행

```sh
npm ci
npm run build -- --webpack
BETA_SIGNUP_PERSISTENCE=disabled SUPABASE_URL= SUPABASE_PUBLISHABLE_KEY= SUPABASE_ANON_KEY= npm run start -- --port 3102
```

미리보기: http://127.0.0.1:3102/. 운영 endpoint에 테스트 신청을 보내지 않는다.

로컬 Chrome viewport 검수 외 실물 모바일·Safari는 검증하지 않았다. 새 production 배포는 사용자의 후속 승인에 따라 기존 프로젝트로 진행하고 공개GET-only검수를 수행한다.
