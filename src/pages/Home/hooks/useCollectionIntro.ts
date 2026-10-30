import { useEffect, useState } from "react";

export default function useCollectionIntro() {
  const [loading, setLoading] = useState(!sessionStorage.getItem("pg-intro"));
  const [progress, setProgress] = useState(7);
  const [introNumber, setIntroNumber] = useState(7);

  useEffect(() => {
    if (!loading) return;
    let frame: number;
    let start = 0;
    let cancelled = false;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Wait for the document's font assets before completing the entrance.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      function tick(now: number) {
        if (!start) start = now;
        const checkpoints = [7, 29, 43, 75, 100];
        const hold = 220;
        const travel = 260;
        const elapsed = now - start;
        const step = Math.min(4, Math.floor(elapsed / (hold + travel)));
        const phase = elapsed - step * (hold + travel);
        const from = checkpoints[step];
        const to = checkpoints[Math.min(step + 1, 4)];
        const fraction = Math.min(1, Math.max(0, (phase - hold) / travel));
        // Pause at each checkpoint, then ease the bar to the next value.
        const eased = fraction * fraction * (3 - 2 * fraction);
        setProgress(reduced ? 100 : from + (to - from) * eased);
        setIntroNumber(reduced ? 100 : phase < hold || step === 4 ? from : to);
        if (!reduced && elapsed < 4 * (hold + travel) + hold)
          frame = requestAnimationFrame(tick);
        else {
          sessionStorage.setItem("pg-intro", "1");
          setLoading(false);
        }
      }
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [loading]);

  return { loading, progress, introNumber };
}
