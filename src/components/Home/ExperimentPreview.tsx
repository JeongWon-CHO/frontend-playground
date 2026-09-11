import { useEffect, useRef, useState } from "react";
export default function ExperimentPreview({
  kind,
  split = true,
  load = 65,
}: {
  kind: string;
  split?: boolean;
  load?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`experiment-visual visual-${kind} ${split ? "is-split" : ""} ${visible ? "is-visible" : ""} ${!split && load >= 60 ? "is-congested" : ""}`}
      style={
        {
          "--work-duration": `${split ? 3 : 3 + load / 8}s`,
        } as import("react").CSSProperties
      }
      aria-hidden="true"
    >
      <div className="visual-grid" />
      {kind === "threads" ? (
        <>
          <span className="thread-label mono">MAIN THREAD</span>
          <div className="thread-track main-track">
            {Array.from({ length: Math.ceil(load / 7) }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * -0.57}s` }} />
            ))}
          </div>
          <div className="thread-bridge" />
          <span className="thread-label worker-label mono">WEB WORKER</span>
          <div className="thread-track worker-track">
            {Array.from({ length: Math.ceil(load / 7) }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * -0.63}s` }} />
            ))}
          </div>
          <div className="thread-core">
            <span>
              {split ? "W" : "M"}
              <span className="core-plus">{split ? "+" : "!"}</span>
            </span>
          </div>
          <span className="visual-caption mono">
            {split
              ? "TWO THREADS. ONE SMOOTH EXPERIENCE."
              : "ONE THREAD. ALL THE WORK."}
          </span>
        </>
      ) : (
        <>
          <div className="blocks">
            {Array.from({ length: 16 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * -0.31}s` }} />
            ))}
          </div>
          <span className="visual-caption mono">
            {kind === "chunks"
              ? "BREAK IT DOWN. LOAD WHAT MATTERS."
              : kind === "memo"
                ? "LESS WORK. SAME RESULT."
                : "MAKE THE INVISIBLE VISIBLE."}
          </span>
        </>
      )}
    </div>
  );
}
