# PrayTime · 틈 모션 레이어 v1

2단계: 1단계 시안의 방향을 바탕으로 코드로 재구성한 레이어 세트입니다.
원본 PNG에서 픽셀을 추출한 파일이 아니며, 이미지를 늘리지 않고 모션을 만들 수 있도록 재구성했습니다.

- 01-background.svg: 불투명 네이비 #080E26
- 02-opening.svg: 틈 내부의 따뜻한 빛
- 03-edges.svg: 빛의 테두리와 가까운 광채
- 04-ambient.svg: 부드러운 주변 광채
- 05-floor.svg: 바닥 빛
- gap-layered.svg: 편집 가능한 그룹을 포함한 합성본
- preview.html: 레이어 표시/숨김 확인용. 폴더를 풀고 브라우저에서 열기
- preview.png: 합성 정지 화면 미리보기

## 좌표와 조립
모든 SVG는 1200×1440 공통 viewBox를 사용합니다. 배경 외에는 투명합니다.
같은 크기와 원점에 겹쳐 배치하세요. 레이어마다 별도로 crop하거나 object-fit: cover를 적용하지 마세요.
뒤에서 앞으로: background → ambient → floor → opening → edges.
중심 x=600, 위 y=180, 바닥 y=1240, 최종 틈 폭=14.
폭 390px로 표시하면 틈은 약 4.6px입니다.

## 다음 단계 구현 시
SVG 내부 geometry 또는 CSS mask를 움직입니다.
1. floor opacity: 0 → 표시
2. opening/edges: 아래 기준 clip-path로 위를 향해 공개
3. 두 테두리: 중앙에서 x=593/607로 분리, 내부 빛 폭도 함께 증가
4. ambient/floor opacity와 확산을 점진적으로 증가
전체 캔버스를 scaleX하면 바닥 빛과 여백까지 변형되므로 사용하지 마세요.
현재 파일에는 애니메이션이 없습니다. 랜딩페이지는 수정하지 않았습니다.
투명 PNG 생성은 실패하여, 광채도 편집 가능한 SVG radialGradient로 제작했습니다.
