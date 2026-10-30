import { useEffect, useState } from "react";

export type HomePanel = "index" | "about" | null;

export default function useCollectionPanel() {
  const [panel, setPanel] = useState<HomePanel>(null);

  useEffect(() => {
    if (!panel) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [panel]);

  return { panel, setPanel };
}
