import { Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Icon from "@/components/Home/Icon";
import Home from "@/pages/Home";
import { experiments } from "@/data/experiments";
import "@/App.css";
function ExperimentPage({
  experiment,
}: {
  experiment: (typeof experiments)[number];
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    document.title = `${experiment.title} — Playground`;
  }, [experiment.title]);
  if (experiment.status !== "live") return null;
  const Page = experiment.page;
  return (
    <div className="experiment-detail">
      <Link
        className="experiment-back"
        to={`/?${sessionStorage.getItem("playground-search") ?? ""}`}
      >
        <Icon name="arrow-left" size={16} /> Playground
      </Link>
      <header className="detail-header">
        <span className="detail-kicker">PLAYGROUND / EXPERIMENT {experiment.id}</span>
        <h1 ref={titleRef} tabIndex={-1}>{experiment.tags[0]}</h1>
        <div className="detail-credits">
          <span><small>CREATED BY</small> JeongWon Cho</span>
          <span><small>BUILT WITH</small> {experiment.tags.join(' / ')}</span>
          <span><small>YEAR</small> {experiment.date.slice(0, 4)}</span>
        </div>
        <p className="detail-description">{experiment.description}</p>
      </header>
      <Suspense fallback={<p className="route-loading">실험을 불러오는 중…</p>}>
        <Page />
      </Suspense>
    </div>
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
              <Link to="/">Playground로 돌아가기 <Icon size={18} /></Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
