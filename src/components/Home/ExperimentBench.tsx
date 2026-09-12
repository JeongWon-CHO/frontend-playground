import Icon from "@/components/Home/Icon";
import { useState } from "react";
import SignalPlayground from "@/components/Home/SignalPlayground";

export default function ExperimentBench({ kind }: { kind: string }) {
  const [lit, setLit] = useState<number[]>([]);
  const [renders, setRenders] = useState(0);
  const [memo, setMemo] = useState(true);
  const [spread, setSpread] = useState(70);
  const [split, setSplit] = useState(true);
  const touch = (index: number) => {
    if (kind === "memo" && memo && lit.includes(index)) return;
    setRenders((value) => value + (kind === "grid" ? 16 : 1));
    setLit(kind === "grid" ? Array.from({ length: 16 }, (_, i) => i) : [index]);
  };
  if (kind === "threads")
    return (
      <div className="experiment-bench">
        <SignalPlayground split={split} load={65} />
        <button
          className="bench-action"
          aria-pressed={split}
          onClick={() => setSplit(!split)}
        >
          Web Worker {split ? "ON" : "OFF"}{" "}
          <span>
            <Icon name="swap" />
          </span>
        </button>
      </div>
    );
  return (
    <div className={`experiment-bench bench-${kind}`}>
      <div className="bench-heading mono">
        {kind === "chunks" ? "PULL THE BUNDLE APART" : "TOUCH THE COMPONENTS"}
        <span>
          <Icon name="arrow-down-left" />
        </span>
      </div>
      <div
        className="bench-grid"
        style={{
          gap: kind === "chunks" ? `${spread * 0.22}px` : "8px",
          transform:
            kind === "chunks" ? `rotate(${-spread * 0.12}deg)` : undefined,
        }}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <button
            key={i}
            className={lit.includes(i) ? "lit" : ""}
            aria-label={`컴포넌트 ${i + 1} 실행`}
            aria-pressed={lit.includes(i)}
            onClick={() => touch(i)}
          >
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <span>{lit.includes(i) ? "✳" : "+"}</span>
          </button>
        ))}
      </div>
      {kind === "chunks" ? (
        <label className="bench-range">
          <span className="mono">
            ONE BUNDLE <span>SMALL CHUNKS</span>
          </span>
          <input
            aria-label="번들 분리 정도"
            type="range"
            min="0"
            max="100"
            value={spread}
            onChange={(event) => setSpread(Number(event.target.value))}
          />
        </label>
      ) : (
        <div className="bench-stats">
          <span className="mono" aria-live="polite">
            SIMULATED RENDERS <b>{renders}</b>
          </span>
          <button
            className="bench-action"
            onClick={() => {
              setLit([]);
              setRenders(0);
            }}
          >
            Reset <Icon name="reset" />
          </button>
        </div>
      )}
      {kind === "memo" && (
        <button
          className="bench-action"
          aria-pressed={memo}
          onClick={() => setMemo(!memo)}
        >
          Memo {memo ? "ON" : "OFF"} <Icon name="swap" />
        </button>
      )}
      <p className="bench-note">
        {kind === "grid"
          ? "하나를 눌러도 전체가 반응합니다. 렌더링 범위를 눈으로 확인해 보세요."
          : kind === "memo"
            ? "같은 칸을 다시 눌러보세요. Memo를 켜면 같은 입력의 렌더링을 건너뜁니다."
            : "슬라이더를 당겨 하나의 번들을 작은 조각으로 분리해 보세요."}
      </p>
      <span className="bench-disclaimer mono">
        INTERACTIVE CONCEPT · 실제 성능 측정이 아닙니다
      </span>
    </div>
  );
}
