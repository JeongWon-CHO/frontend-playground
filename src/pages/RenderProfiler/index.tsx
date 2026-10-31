import { useState } from "react";
import BaselineDashboard from "./BaselineDashboard";
import LocalStateDashboard from "./LocalStateDashboard";
import SourceComparison from "@/components/RenderProfiler/SourceComparison";
import "./RenderProfiler.css";

export default function RenderProfiler() {
  "use no memo";
  const [mode, setMode] = useState<"baseline" | "local-state">("baseline");
  const [samples, setSamples] = useState(10000);

  return (
    <main className="render-lab">
      <div className="render-comparison" role="group" aria-label="실험 버전">
        <button
          aria-pressed={mode === "baseline"}
          onClick={() => setMode("baseline")}
        >
          01 / 변경 전
        </button>
        <button
          aria-pressed={mode === "local-state"}
          onClick={() => setMode("local-state")}
        >
          02 / 상태 위치 변경 후
        </button>
      </div>
      {mode === "baseline" ? (
        <BaselineDashboard samples={samples} onSamplesChange={setSamples} />
      ) : (
        <LocalStateDashboard samples={samples} onSamplesChange={setSamples} />
      )}
      <SourceComparison />
    </main>
  );
}
