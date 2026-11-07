> Historical Pre-Figma audit. Current final-design verification: FINAL_DELIVERY.md and FIGMA_FINAL_COMPARISON.md.

# Accessibility / Quality Audit

확인일: 2026-11-06 KST. 최종 Figma 대기 중 **시각 디자인은 수정하지 않고** semantic HTML / keyboard / metadata / 테스트를 점검했습니다. 모든 accessibility 표준을 충족한다는 인증은 아닙니다.

| 점검 | 결과 / 근거 |
| --- | --- |
| semantic HTML | main 1개, section 8개에 heading 연결, nav / form / fieldset / legend / ol / dl 사용 |
| H1 / heading hierarchy | H1 1개, h1→h2→h3, level 건너뛰기 없음(브라우저 검사) |
| alt | 장식 raster/icon은 empty alt, 실제 preview는 role=img와 설명. 모든 img에 alt 존재 |
| button / link | 탐색 CTA는 a, FAQ / theme / submit은 button, native input 사용 |
| form label | 모든 실제 input/select labels 연결. 그룹은 fieldset/legend. honeypot은 hidden + tabindex=-1 |
| ARIA | controls / labelledby / describedby ID 유효, duplicate ID 없음, errors와 aria-invalid 연결 |
| focus-visible | 기존 button / link / input / select focus 스타일과 heading focus 유지. CSS 미변경 |
| keyboard | Tab / Enter / Space, theme arrows / Home / End, FAQ 독립 toggle, 오류 최초 필드 focus 확인 |
| skip link | 기존 native anchor가 heading focus를 옮기지 않는 문제를 발견. 같은 DOM a를 렌더링하는 AnchorLink를 재사용해 수정 |
| preview panel | tabIndex=0 추가, 선택 tab 다음에 panel을 키보드로 읽을 수 있음 |
| aria-live | form result polite / atomic 및 status / alert 유지 |
| reduced motion | CSS scroll-behavior:auto 및 anchor instant 전환. reduced-motion 브라우저 검사 통과 |
| console | 초기 문서·metadata·asset 로딩에 pageerror / console warning·error 없음. 예상 API503는 disabled 상태 검증이며 가짜 성공 없음 |
| broken links | 내부 anchor target 전부 존재. 외부 개인정보 URL은 공개 GET 성공, 문서 링크는 로컬 경로 점검 |
| assets | 브라우저 img 로딩과 source의 /assets /fonts 경로 누락 없음. 존재하지 않는 OG/favicon 경로를 출력하지 않음 |
| responsive | 1440/1280/1024/768/430/393/375/320px, horizontal overflow 없음 |
| server / client boundary | client JS 10개에서 실제 Supabase URL / key 및 store/SDK 코드 미검출 |

이번 단계의 기존 TSX 변경은 layout metadata, HeroPreview panel의 tabIndex, skip-link의 AnchorLink 재사용뿐입니다. 기존 page 본문·에셋·글꼴·mockup·CSS·spacing·색상·typography는 유지했습니다. 시작 시 hash baseline과 비교했습니다. metadata helper와 자동 테스트 파일은 별도로 추가/확장했습니다.

최종 Figma 이후에는 최종 색상 contrast, target spacing, 정확한 시각 정합성 및 실제 screen reader 사용성을 다시 점검해야 합니다. 이를 위해 지금 승인되지 않은 디자인을 조정하지 않았습니다. OG 이미지·favicon은 승인 asset TODO이며, 현재 가짜 파일로 대체하지 않았습니다.

브라우저 테스트 실행기의 NO_COLOR / FORCE_COLOR 안내는 로컬 도구 환경 경고입니다. 앱 브라우저 console warning과 구분하며 테스트 실패 원인은 아닙니다.
