import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Experiment } from "@/data/experiments";

export default function useExperimentOpening(
  active: Experiment,
  onBeforeOpen: () => void,
) {
  const navigate = useNavigate();
  const [opening, setOpening] = useState(false);
  const openingRef = useRef(false);

  useEffect(() => {
    if (!opening || active.status !== "live") return;
    // Recover if the browser cancels the exit animation.
    const fallback = window.setTimeout(() => navigate(active.path), 1500);
    return () => window.clearTimeout(fallback);
  }, [opening, active, navigate]);

  function open() {
    if (active.status !== "live" || openingRef.current) return;
    onBeforeOpen();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate(active.path);
      return;
    }
    openingRef.current = true;
    setOpening(true);
  }

  function finishOpening() {
    if (openingRef.current && active.status === "live") navigate(active.path);
  }

  // Event handlers can check the lock before React commits the opening state.
  function isOpening() {
    return openingRef.current;
  }

  return { opening, isOpening, open, finishOpening };
}
