import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { experiments } from "@/data/experiments";
import ExperimentDisc from "./ExperimentDisc";

type Props = {
  index: number;
  loading: boolean;
  opening: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
  onOpen: () => void;
  onOpenComplete: () => void;
  onShowIndex: () => void;
};

export default function CollectionStage({
  index,
  loading,
  opening,
  disabled,
  onSelect,
  onOpen,
  onOpenComplete,
  onShowIndex,
}: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const wheel = useRef({ total: 0, time: 0 });
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const element = stage.current;
    if (!element || disabled) return;
    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaX) < Math.abs(event.deltaY))
        return;
      event.preventDefault();
      const now = performance.now();
      if (now - wheel.current.time < 750) return;
      wheel.current.total += event.deltaX;
      if (Math.abs(wheel.current.total) > 45) {
        onSelect(index + Math.sign(wheel.current.total));
        wheel.current = { total: 0, time: now };
      }
    }
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  });

  return (
    <div
      ref={stage}
      id="collection-stage"
      className="collection-stage"
      tabIndex={0}
      role="region"
      aria-label="실험 CD 컬렉션"
      inert={disabled}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          onSelect(index + (e.key === "ArrowRight" ? 1 : -1));
        }
      }}
      onTouchStart={(e) => {
        touch.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touch.current !== null) {
          const delta = touch.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 45) onSelect(index + Math.sign(delta));
          touch.current = null;
        }
      }}
    >
      {experiments.map((experiment, i) => {
        const offset = i - index;
        return (
          <div
            className={`disc-position ${offset === 0 ? "current-disc" : ""}`}
            key={experiment.id}
            style={
              {
                "--offset": offset,
                "--distance": Math.abs(offset),
                "--entrance-order": i,
              } as CSSProperties
            }
            aria-hidden={Math.abs(offset) > 1}
            onAnimationEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                event.animationName === "disc-open" &&
                opening &&
                experiment.status === "live" &&
                offset === 0
              ) {
                onOpenComplete();
              }
            }}
          >
            <div className="disc-entrance" key={`entrance-${loading}`}>
              <button
                className="disc-button"
                tabIndex={Math.abs(offset) > 1 ? -1 : 0}
                aria-label={
                  offset === 0
                    ? `${experiment.title} 상세 보기`
                    : `${offset < 0 ? "이전" : "다음"} 실험: ${experiment.title}`
                }
                onClick={() => {
                  if (offset !== 0) onSelect(i);
                  else if (experiment.status === "live") onOpen();
                  else onShowIndex();
                }}
                onPointerMove={(e) => {
                  if (e.pointerType !== "mouse" || opening)
                    return;
                  const box = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--mx",
                    `${((e.clientX - box.left) / box.width) * 2 - 1}`,
                  );
                  e.currentTarget.style.setProperty(
                    "--my",
                    `${((e.clientY - box.top) / box.height) * 2 - 1}`,
                  );
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.setProperty("--mx", "0");
                  e.currentTarget.style.setProperty("--my", "0");
                }}
              >
                <div className="disc-motion">
                  <ExperimentDisc index={i} />
                  <svg
                    className="disc-scribble"
                    viewBox="0 0 600 600"
                    aria-hidden="true"
                  >
                    <path
                      className="scribble-line"
                      d="M85 104C175 7 381 -8 489 91S625 330 522 476S296 623 150 541S1 304 45 193"
                    />
                    <path
                      className="scribble-line scribble-line-secondary"
                      d="M105 74C226 -22 414 7 509 113S606 343 500 493S277 601 127 523S5 334 25 273"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
