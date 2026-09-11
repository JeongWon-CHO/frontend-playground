import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Route components own scroll positioning; browser reload restoration must not race them.
window.history.scrollRestoration = "manual";
const navigation = performance.getEntriesByType("navigation")[0] as
  | PerformanceNavigationTiming
  | undefined;
if (
  navigation?.type === "reload" &&
  location.pathname === "/" &&
  location.hash
) {
  window.history.replaceState(
    window.history.state,
    "",
    location.pathname + location.search,
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
