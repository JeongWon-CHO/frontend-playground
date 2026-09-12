import { countPrimes } from '@/components/WebWorker/calculatePrimes';

type WorkerRequest = {
  limit: number;
};

type WorkerResponse = {
  count: number;
  computeTime: number;
};

type WorkerContext = {
  onmessage:
    | ((event: MessageEvent<WorkerRequest>) => void)
    | null;
  postMessage: (response: WorkerResponse) => void;
};

const worker = self as unknown as WorkerContext;

worker.onmessage = (event) => {
  const { limit } = event.data;
  const start = performance.now();
  const count = countPrimes(limit);
  const computeTime = performance.now() - start;

  worker.postMessage({
    count,
    computeTime,
  });
};
