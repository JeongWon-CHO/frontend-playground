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
3. 공개할 실험은 `status: 'live'`, `path`, `page: lazy(() => import('@/pages/YourExperiment'))`를 지정합니다. 준비 중인 아이디어는 `status: 'planned'`로 등록하며 페이지 경로가 필요 없습니다.
4. 대표 실험은 `featured: 1`처럼 순서를 지정합니다. 최대 세 개가 표시됩니다.

사용 가능한 프리뷰는 `threads`, `grid`, `memo`, `chunks`입니다. 새 시각화는 `src/components/Home/ExperimentPreview.tsx`에서 확장할 수 있습니다. 홈의 프리뷰는 원리 설명용이며 실제 성능 측정은 개별 실험에서 진행합니다.

분류는 `categories`에 정의합니다. 목록은 제목·설명·태그 검색, 분류, 날짜 정렬, 12개 단위 더 보기를 지원합니다. 검색 조건은 URL에 저장하며 실험에서 돌아올 때 탐색 위치를 복원합니다. 새로고침하면 검색 조건은 유지하고 홈 맨 위에서 시작합니다. 스크롤 위치는 세션 저장소 대신 현재 앱 실행 중의 메모리에만 보관합니다.

## 구성

- `src/pages/Home/`: 히어로, 대표 실험, 아카이브, 소개
- `src/components/Home/Sculpture.tsx`: Canvas 기반 입체 점 조형물. 포인터 주변 입자 반발, 드래그 회전과 관성, 클릭 파동, Knot·Orbit·Wave 형태 전환을 지원합니다. 방향키로도 회전할 수 있으며, 화면 밖과 비활성 탭에서는 렌더링을 멈춥니다.
- `src/components/Home/ExperimentPreview.tsx`: 실험별 개념 프리뷰. Web Worker 작업량 슬라이더와 스위치로 작업 정체와 분산 흐름을 비교합니다.
- `src/components/Home/PageMotion.tsx`: 스크롤 진행 표시와 섹션 진입 효과
- `src/data/experiments.ts`: 실험 메타데이터와 지연 로딩 페이지 등록
- `src/App.tsx`: 등록된 실험의 라우팅과 홈 복귀

홈 스타일은 `.playground` 아래에 한정합니다. 모바일 레이아웃, 키보드 포커스, `prefers-reduced-motion`을 지원합니다. 실험 페이지 코드는 각 경로 진입 시 불러옵니다.

## 섹션 스크롤

데스크톱(901px 이상, 정밀 포인터)에서는 휠 한 제스처로 다음·이전 섹션으로 이동합니다. 트랙패드 관성이 여러 섹션을 연속으로 넘기지 않도록 제스처를 구분합니다. 화면보다 긴 섹션은 내용을 먼저 일반 스크롤로 읽은 뒤 다음 섹션으로 이동합니다. 오른쪽 섹션 내비게이션으로도 이동할 수 있습니다.

`src/components/Home/SectionNavigation.tsx`에서 동작을 관리합니다. 모바일 터치, 폼 입력, 내부 스크롤 영역과 확대 제스처는 기본 동작을 유지합니다. 키보드·터치 입력은 진행 중인 자동 이동을 취소하고, 움직임 줄이기 설정에서는 즉시 이동합니다. 홈에서 나가면 이벤트와 애니메이션을 정리합니다.

## 섹션별 인터랙션

- `LivingBackdrop`: 화면 전체에 이어지는 Canvas 배경. 섹션 진입에 따라 점·작업 흐름·격자·파형으로 변하며 포인터에 반응합니다. 빛 효과는 개별 캔버스가 아닌 고정 화면 레이어에서 그려 컨테이너 경계에 잘리지 않습니다.
- `SignalPlayground`: 클릭으로 작업 4개를 보내고 진행·완료를 확인하는 개념 시뮬레이션. Worker 스위치와 작업량에 따라 처리 흐름이 달라집니다. 동시에 최대 24개를 유지하며 페이지를 벗어나면 타이머를 해제합니다.
- `ExperimentBench`: 실험 선택에 따라 작업 전송, 전체 렌더링, Memo 입력 비교, 번들 분리 슬라이더를 제공합니다. 표시되는 값은 원리 설명용이며 실제 브라우저 성능 측정값이 아닙니다.
- `CuriosityPlayground`: 소개 영역의 단어 연결을 드래그·방향키로 변경하고 Remix 또는 Reset으로 재배치합니다. 터치 드래그는 단어 버튼 안에서만 처리합니다.

공유 배경은 비활성 탭에서 렌더링을 중지하며, 움직임 줄이기 설정에서는 정적인 배경과 직접 조작만 유지합니다.

## 소스 경로

`@/`는 `src/`를 가리킵니다. 컴포넌트, CSS, 지연 로딩 import 모두 같은 별칭을 사용합니다.

```tsx
import Home from '@/pages/Home';
import Icon from '@/components/Home/Icon';
import '@/pages/Home/Home.css';
```

Vite의 `resolve.alias`와 `tsconfig.app.json`의 `paths`에 함께 설정되어 있어 개발 서버, 빌드, 타입 검사와 에디터에서 동일하게 해석합니다. Worker는 `@/components/WebWorker/prime.worker.ts?worker`로 가져옵니다.
