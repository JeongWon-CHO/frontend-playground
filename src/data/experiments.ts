import { lazy } from 'react';
export const categories = ['All', 'Performance', 'Interaction', 'Graphics', 'Browser', 'Tooling'] as const;
type Experiment = {
    id: string;
    title: string;
    description: string;
    category: Exclude<(typeof categories)[number], 'All'>;
    tags: string[];
    date: string;
    preview: 'threads' | 'grid' | 'memo' | 'chunks';
} & ({
    status: 'live';
    path: string;
    page: ReturnType<typeof lazy>;
    featured?: number;
} | {
    status: 'planned';
});
// Register live pages here; App and Home share this registry.
export const experiments: Experiment[] = [
    { id: '001', title: 'Beyond the main thread', description: '무거운 연산 중에도 멈추지 않는 인터페이스. Web Worker로 메인 스레드의 여유를 만듭니다.', category: 'Performance', tags: ['Web Worker', 'Browser API'], date: '2026-09-06', preview: 'threads', status: 'live', path: '/web-worker', page: lazy(() => import('@/pages/WebWorker')), featured: 1 },
    { id: '002', title: 'Every render tells a story', description: 'React 렌더링 병목을 직접 만들고, Profiler로 원인을 찾아봅니다.', category: 'Performance', tags: ['React', 'Profiling'], date: '2026-09-07', preview: 'grid', status: 'planned' },
    { id: '003', title: 'The art of doing less', description: '같은 입력에 같은 결과. React.memo로 필요한 렌더링만 남기는 실험입니다.', category: 'Performance', tags: ['React', 'Memoization'], date: '2026-09-08', preview: 'memo', status: 'planned' },
    { id: '004', title: 'Small pieces, faster pages', description: 'Vite 번들을 분석하고, Chunk Splitting으로 로딩을 나눠봅니다.', category: 'Tooling', tags: ['Vite', 'Code Splitting'], date: '2026-09-09', preview: 'chunks', status: 'planned' },
];
