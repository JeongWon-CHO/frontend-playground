import { Suspense, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { experiments } from "./data/experiments";
import "./App.css";
function ExperimentPage({
  experiment,
}: {
  experiment: (typeof experiments)[number];
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${experiment.title} — Playground`;
  }, [experiment.title]);
  if (experiment.status !== "live") return null;
  const Page = experiment.page;
  return (
    <>
      <Link
        className="experiment-back"
        to={`/?${sessionStorage.getItem("playground-search") ?? ""}`}
      >
        ← Playground
      </Link>
      <Suspense fallback={<p className="route-loading">실험을 불러오는 중…</p>}>
        <Page />
      </Suspense>
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {experiments.map((e) =>
          e.status === "live" ? (
            <Route
              key={e.id}
              path={e.path}
              element={<ExperimentPage experiment={e} />}
            />
          ) : null,
        )}
        <Route
          path="*"
          element={
            <div className="route-loading">
              <h1>아직 탐험하지 않은 곳이에요.</h1>
              <Link to="/">Playground로 돌아가기 ↗</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
