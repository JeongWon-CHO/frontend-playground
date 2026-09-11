# Playground — Ideas in motion

React + TypeScript + Vite로 만드는 프론트엔드 실험실입니다.

## 실행

```sh
pnpm install
pnpm dev
```

`pnpm build`로 프로덕션 빌드, `pnpm lint`로 정적 검사를 실행합니다.

## 실험 추가

`src/data/experiments.ts`가 홈 목록과 라우트의 공통 등록부입니다.

1. `src/pages/`에 실험 페이지를 만들고 컴포넌트를 default export 합니다.
2. 등록부에 고유 `id`, 제목, 설명, 분류, 태그, 날짜, 프리뷰 종류를 추가합니다.
3. 공개할 실험은 `status: 'live'`, `path`, `page: lazy(() => import('../pages/YourExperiment'))`를 지정합니다. 준비 중인 아이디어는 `status: 'planned'`로 등록하며 페이지 경로가 필요 없습니다.
4. 대표 실험은 `featured: 1`처럼 순서를 지정합니다. 최대 세 개가 표시됩니다.

사용 가능한 프리뷰는 `threads`, `grid`, `memo`, `chunks`입니다. 새 시각화는 `src/components/Home/ExperimentPreview.tsx`에서 확장할 수 있습니다. 홈의 프리뷰는 원리 설명용이며 실제 성능 측정은 개별 실험에서 진행합니다.

분류는 `categories`에 정의합니다. 목록은 제목·설명·태그 검색, 분류, 날짜 정렬, 12개 단위 더 보기를 지원합니다. 검색 조건은 URL에 저장하며 실험에서 돌아올 때 탐색 위치를 복원합니다.

## 구성

- `src/pages/Home/`: 히어로, 대표 실험, 아카이브, 소개
- `src/components/Home/Sculpture.tsx`: Canvas 기반 입체 점 조형물. 포인터 주변 입자 반발, 드래그 회전과 관성, 클릭 파동, Knot·Orbit·Wave 형태 전환을 지원합니다. 방향키로도 회전할 수 있으며, 화면 밖과 비활성 탭에서는 렌더링을 멈춥니다.
- `src/components/Home/ExperimentPreview.tsx`: 실험별 개념 프리뷰. Web Worker 작업량 슬라이더와 스위치로 작업 정체와 분산 흐름을 비교합니다.
- `src/components/Home/PageMotion.tsx`: 스크롤 진행 표시와 섹션 진입 효과
- `src/data/experiments.ts`: 실험 메타데이터와 지연 로딩 페이지 등록
- `src/App.tsx`: 등록된 실험의 라우팅과 홈 복귀

홈 스타일은 `.playground` 아래에 한정합니다. 모바일 레이아웃, 키보드 포커스, `prefers-reduced-motion`을 지원합니다. 실험 페이지 코드는 각 경로 진입 시 불러옵니다.
