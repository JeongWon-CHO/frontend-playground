import { useRef, useState } from "react";

const labels = ["What if?", "Build.", "Break.", "Learn.", "Repeat."];
const initial = [
  { x: 15, y: 42 },
  { x: 34, y: 23 },
  { x: 52, y: 65 },
  { x: 70, y: 30 },
  { x: 86, y: 65 },
];
export default function CuriosityPlayground() {
  const field = useRef<HTMLDivElement>(null);
  const drag = useRef<number | null>(null);
  const [positions, setPositions] = useState(initial);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const relocate = (index: number, x: number, y: number) =>
    setPositions((previous) =>
      previous.map((point, i) =>
        i === index
          ? {
              x: Math.max(14, Math.min(86, x)),
              y: Math.max(18, Math.min(80, y)),
            }
          : point,
      ),
    );
  return (
    <div className="curiosity-playground">
      <div className="curiosity-heading">
        <span className="mono">NO FINAL FORM. JUST POSSIBILITIES.</span>
        <button
          onClick={() =>
            setPositions((previous) =>
              previous.map((_, i) => previous[(i + 1) % previous.length]),
            )
          }
        >
          Remix the idea ↗
        </button>
      </div>
      <div
        className={`curiosity-field ${dragging ? "is-dragging" : ""}`}
        ref={field}
      >
        <svg
          className="curiosity-connections"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {positions.map((point, i) => (
            <line
              key={i}
              className={i === active || (i + 1) % 5 === active ? "active" : ""}
              x1={point.x}
              y1={point.y}
              x2={positions[(i + 1) % 5].x}
              y2={positions[(i + 1) % 5].y}
            />
          ))}
        </svg>
        <span className="curiosity-watermark" aria-hidden="true">
          STAY CURIOUS.
        </span>
        {positions.map((point, i) => (
          <button
            key={labels[i]}
            className={`curiosity-node ${active === i ? "active" : ""}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label={`${labels[i]} 드래그하거나 방향키로 이동`}
            aria-pressed={active === i}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            onPointerDown={(event) => {
              drag.current = i;
              setActive(i);
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (drag.current !== i || !field.current) return;
              const rect = field.current.getBoundingClientRect();
              relocate(
                i,
                ((event.clientX - rect.left) / rect.width) * 100,
                ((event.clientY - rect.top) / rect.height) * 100,
              );
            }}
            onPointerUp={(event) => {
              drag.current = null;
              setDragging(false);
              event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={() => {
              drag.current = null;
              setDragging(false);
            }}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  event.key,
                )
              )
                return;
              event.preventDefault();
              relocate(
                i,
                point.x +
                  (event.key === "ArrowRight"
                    ? 3
                    : event.key === "ArrowLeft"
                      ? -3
                      : 0),
                point.y +
                  (event.key === "ArrowDown"
                    ? 3
                    : event.key === "ArrowUp"
                      ? -3
                      : 0),
              );
            }}
          >
            <span className="mono">0{i + 1}</span>
            {labels[i]}
            <span className="node-handle">⠿</span>
          </button>
        ))}
      </div>
      <div className="curiosity-footer">
        <span>단어를 끌어 나만의 연결을 만들어보세요.</span>
        <button onClick={() => setPositions(initial)}>Reset ↺</button>
      </div>
    </div>
  );
}
