import Icon from "@/components/Home/Icon";
import { useEffect, useRef, useState } from "react";

export default function SignalPlayground({
  split,
  load,
}: {
  split: boolean;
  load: number;
}) {
  const [tasks, setTasks] = useState<{ id: number; lane: number }[]>([]);
  const [sent, setSent] = useState(0);
  const [completed, setCompleted] = useState(0);
  const id = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);
  const send = () => {
    if (tasks.length >= 24) return;
    const batch = Array.from({ length: 4 }, (_, i) => ({
      id: ++id.current,
      lane: split ? i % 2 : 0,
    }));
    setTasks((previous) => [...previous, ...batch]);
    setSent((previous) => previous + 4);
    for (const [index, task] of batch.entries()) {
      const timer = setTimeout(
        () => {
          setTasks((previous) =>
            previous.filter((item) => item.id !== task.id),
          );
          setCompleted((previous) => previous + 1);
          timers.current.delete(timer);
        },
        split
          ? 950 + index * 140
          : 1500 + (tasks.length + index) * (70 + load * 5),
      );
      timers.current.add(timer);
    }
  };
  return (
    <div className={`signal-playground ${split ? "parallel" : "serial"}`}>
      <div className="signal-heading">
        <span className="mono">01 / SEND SOMETHING THROUGH</span>
        <span className="mono">CONCEPT DEMO</span>
      </div>
      <button
        className="signal-surface"
        onClick={send}
        disabled={tasks.length >= 24}
        aria-label="작업 4개 보내기"
      >
        <span className="signal-source">+</span>
        <span className="signal-wire wire-a" />
        <span className="signal-wire wire-b" />
        <span className="signal-destination">{split ? "W+" : "M"}</span>
        <span className="signal-packets" aria-hidden="true">
          {tasks.map((task) => (
            <i
              key={task.id}
              style={{
                top: task.lane === 0 ? "35%" : "65%",
                animationDuration: split ? "1s" : "2.5s",
              }}
            />
          ))}
        </span>
        <span className="signal-instruction">
          {tasks.length >= 24
            ? "처리 중 · 잠깐 기다려주세요"
            : "클릭해서 작업을 보내보세요"}{" "}
          {tasks.length < 24 && <Icon />}
        </span>
      </button>
      <div className="signal-stats mono" aria-live="polite">
        <span>
          SENT <b>{String(sent).padStart(2, "0")}</b>
        </span>
        <span>
          IN FLIGHT <b>{String(tasks.length).padStart(2, "0")}</b>
        </span>
        <span>
          DONE <b>{String(completed).padStart(2, "0")}</b>
        </span>
      </div>
    </div>
  );
}
