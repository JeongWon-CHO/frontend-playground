import { useEffect, useRef, useState } from "react";
import { countPrimes } from "@/components/WebWorker/calculatePrimes";
import PrimeWorker from "@/components/WebWorker/prime.worker.ts?worker";

import "@/pages/WebWorker/WebWorker.css";

type Result = {
  mode: "Main Thread" | "Web Worker";
  count: number;
  totalTime: number;
  computeTime?: number;
};

type WorkerResponse = {
  count: number;
  computeTime: number;
};

export default function WebWorker() {
  const [limit, setLimit] = useState(3_000_000);
  const [status, setStatus] = useState("대기 중");
  const [result, setResult] = useState<Result | null>(null);

  const [inputValue, setInputValue] = useState(""); // 실험용

  const workerRef = useRef<Worker | null>(null); // Worker 객체를 저장해두는 곳
  const ballRef = useRef<HTMLDivElement>(null); // 화면에서 움직이는 공의 div를 가리키기 위헤 만든 ref

  // Web Worker 생성
  useEffect(() => {
    const worker = new PrimeWorker(); // Vite의 Worker import로 생성

    workerRef.current = worker; // Worker 저장. 이후에 workerRef.current로 worker에 접근 가능

    return () => {
      // 페이지가 없어질 때 Worker도 종료
      worker.terminate();
    };
  }, []);

  /*
    메인 스레드에서 계속 실행되는 애니메이션
    다음 화면을 그릴 때 animate 실행하게 하는 함수
   */
  useEffect(() => {
    let animationFrameId: number;

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;

      const position = Math.sin(elapsed / 500) * 150 + 150;

      if (ballRef.current) {
        ballRef.current.style.transform = `translateX(${position}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Main Thread에서 직접 계산
  const runOnMainThread = () => {
    setStatus("Main Thread 계산 중...");
    setResult(null);

    setTimeout(() => {
      // 화면을 그리기도 전에 countPrimes()가 시작될 상황을 방지. 실험 화면을 보기 편하게 만든 장치에 가까움
      const start = performance.now();

      const count = countPrimes(limit);

      const totalTime = performance.now() - start;

      setResult({
        mode: "Main Thread",
        count,
        totalTime,
      });

      setStatus("완료");
    }, 100);
  };

  // Web Worker에서 계산
  const runOnWorker = () => {
    const worker = workerRef.current;

    if (!worker) {
      return;
    }

    setStatus("Web Worker 계산 중...");
    setResult(null);

    const start = performance.now();

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const totalTime = performance.now() - start;

      setResult({
        mode: "Web Worker",
        count: event.data.count,
        totalTime,
        computeTime: event.data.computeTime,
      });

      setStatus("완료");
    };

    worker.postMessage({
      limit,
    });
  };

  return (
    <main className="worker-page">
      <header className="worker-header">
        <h1>
          Main Thread
          <br />
          vs
          <br />
          Web Worker
        </h1>

        <p className="worker-description">
          CPU 연산을 메인 스레드와 Web Worker에서 각각 실행하고 UI 반응성을
          비교합니다.
        </p>
      </header>

      <section className="worker-section">
        <h2>01. UI Responsiveness</h2>

        <p>
          아래 공은 requestAnimationFrame으로 움직이고 있습니다.
          <br />
          계산 버튼을 누른 뒤 움직임을 확인해 보세요!
        </p>

        <div className="animation-track">
          <div ref={ballRef} className="animation-ball" />
        </div>

        <input
          className="worker-input"
          type="text"
          placeholder="계산 중에 여기 입력해보기"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      </section>

      <section className="worker-section">
        <h2>02. CPU Task</h2>

        <label className="limit-label">Prime Number Limit</label>

        <input
          className="worker-input"
          type="number"
          value={limit}
          onChange={(event) => setLimit(Number(event.target.value))}
        />

        <div className="worker-buttons">
          <button className="worker-button" onClick={runOnMainThread}>
            Run on Main Thread
          </button>

          <button className="worker-button" onClick={runOnWorker}>
            Run on Web Worker
          </button>
        </div>
      </section>

      <section className="worker-section">
        <h2>03. Result</h2>

        <div className="status-box">
          <span>Status</span>
          <strong>{status}</strong>
        </div>

        {result && (
          <div className="result-grid">
            <div>
              <span>Mode</span>
              <strong>{result.mode}</strong>
            </div>

            <div>
              <span>Prime Count</span>
              <strong>{result.count.toLocaleString()}</strong>
            </div>

            <div>
              <span>Total Time</span>
              <strong>{result.totalTime.toFixed(2)} ms</strong>
            </div>

            {result.computeTime !== undefined && (
              <div>
                <span>Worker Compute</span>
                <strong>{result.computeTime.toFixed(2)} ms</strong>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
