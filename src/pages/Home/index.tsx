import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { categories, experiments } from "@/data/experiments";
import Icon from "@/components/Home/Icon";
import ExperimentDisc from "@/components/Home/ExperimentDisc";
import "./Home.css";
export default function Home() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const index = Math.max(
    0,
    experiments.findIndex((e) => e.id === params.get("disc")),
  );
  const [panel, setPanel] = useState<"index" | "about" | null>(null);
  const [loading, setLoading] = useState(!sessionStorage.getItem("pg-intro"));
  const [progress, setProgress] = useState(7);
  const [introNumber, setIntroNumber] = useState(7);
  const [opening, setOpening] = useState(false);
  const openingRef = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const wheel = useRef({ total: 0, time: 0 });
  const touch = useRef<number | null>(null);
  const active = experiments[index];
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "All";
  const filtered = experiments
    .filter(
      (e) =>
        (category === "All" || e.category === category) &&
        `${e.title} ${e.tags.join(" ")} ${e.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      params.get("sort") === "oldest"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );
  function select(next: number) {
    if (openingRef.current) return;
    const value = Math.min(experiments.length - 1, Math.max(0, next));
    const updated = new URLSearchParams(params);
    updated.set("disc", experiments[value].id);
    setParams(updated, { replace: true });
  }
  function remember() {
    sessionStorage.setItem("playground-search", params.toString());
  }
  function update(key: string, value: string) {
    const updated = new URLSearchParams(params);
    if (value) updated.set(key, value);
    else updated.delete(key);
    setParams(updated, { replace: true });
  }
  useEffect(() => {
    document.title = "Playground — The experiment collection";
  }, []);
  useEffect(() => {
    if (!opening || active.status !== "live") return;
    // Recover if the browser cancels the exit animation (for example, when motion settings change).
    const fallback = window.setTimeout(() => navigate(active.path), 1500);
    return () => window.clearTimeout(fallback);
  }, [opening, active, navigate]);
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
  useEffect(() => {
    const element = stage.current;
    if (!element || panel || loading || opening) return;
    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaX) < Math.abs(event.deltaY))
        return;
      event.preventDefault();
      const now = performance.now();
      if (now - wheel.current.time < 750) return;
      wheel.current.total += event.deltaX;
      if (Math.abs(wheel.current.total) > 45) {
        select(index + Math.sign(wheel.current.total));
        wheel.current = { total: 0, time: now };
      }
    }
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  });
  useEffect(() => {
    if (!panel) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [panel]);
  return (
    <div
      className={`collection ${loading ? "is-loading" : ""} ${opening ? "is-opening" : ""}`}
    >
      <a className="skip-link" href="#collection-stage">
        실험 컬렉션으로 건너뛰기
      </a>
      <nav className="collection-nav" aria-label="메인 메뉴" inert={opening}>
        <button
          className="pg-logo"
          onClick={() => {
            setPanel(null);
            select(0);
          }}
          aria-label="Playground 홈"
        >
          pg.
        </button>
        {loading ? (
          <span>
            Preparing{" "}
            <Icon name="loading" size={14} className="loading-spinner" />
          </span>
        ) : (
          <>
            <button
              className={!panel ? "nav-active" : ""}
              onClick={() => setPanel(null)}
            >
              Experiments
            </button>
            <button
              className={panel === "about" ? "nav-active" : ""}
              onClick={() => setPanel(panel === "about" ? null : "about")}
            >
              About
            </button>
            <button
              aria-expanded={panel === "index"}
              aria-controls="collection-index"
              onClick={() => setPanel(panel === "index" ? null : "index")}
            >
              Index{" "}
              <Icon
                name="chevron"
                size={16}
                className={`chevron ${panel === "index" ? "up" : ""}`}
              />
            </button>
          </>
        )}
      </nav>
      <main>
        <section
          className="collection-info"
          key={`${active.id}-${loading}`}
          aria-live="polite"
        >
          <h1>{active.tags[0]}</h1>
          <dl>
            <div>
              <dt>CREATED BY</dt>
              <dd>JeongWon Cho</dd>
            </div>
            <div>
              <dt>YEAR</dt>
              <dd>{active.date.slice(0, 4)}</dd>
            </div>
            <div>
              <dt>BUILT WITH</dt>
              <dd>
                {active.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </dd>
            </div>
            <div className="info-status">
              <dt>STATUS</dt>
              <dd>
                {active.status === "live" ? (
                  <>
                    Available to explore <Icon size={12} />
                  </>
                ) : (
                  "Work in progress"
                )}
              </dd>
            </div>
          </dl>
        </section>
        <div
          ref={stage}
          id="collection-stage"
          className="collection-stage"
          tabIndex={0}
          role="region"
          aria-label="실험 CD 컬렉션"
          inert={loading || !!panel || opening}
          onKeyDown={(e) => {
            if (panel || loading || opening) return;
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              select(index + (e.key === "ArrowRight" ? 1 : -1));
            }
          }}
          onTouchStart={(e) => {
            touch.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touch.current !== null) {
              const delta = touch.current - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 45) select(index + Math.sign(delta));
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
                    openingRef.current &&
                    experiment.status === "live" &&
                    offset === 0
                  ) {
                    navigate(experiment.path);
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
                      if (offset !== 0) select(i);
                      else if (experiment.status === "live") {
                        if (openingRef.current) return;
                        remember();
                        if (
                          window.matchMedia("(prefers-reduced-motion: reduce)")
                            .matches
                        ) {
                          navigate(experiment.path);
                          return;
                        }
                        openingRef.current = true;
                        setOpening(true);
                      } else setPanel("index");
                    }}
                    onPointerMove={(e) => {
                      if (e.pointerType !== "mouse" || openingRef.current)
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
        <div className="collection-notes" key={`notes-${active.id}-${loading}`}>
          <div>
            <span className="note-symbol">
              <Icon name="asterisk" />
            </span>
            <span className="note-label">THE EXPERIMENT</span>
            <h2>“{active.title}”</h2>
          </div>
          <div>
            <span className="note-symbol">
              <Icon />
            </span>
            <span className="note-label">
              {active.category.toUpperCase()} / VOL. {active.id}
            </span>
            <p>{active.description}</p>
            {active.status === "planned" && (
              <span className="coming-soon">COMING SOON</span>
            )}
          </div>
        </div>
        {loading && (
          <div
            className="intro-overlay"
            role="status"
            aria-label="컬렉션 준비 중"
          >
            <div className="intro-loader" aria-hidden="true">
              <div className="intro-loader-label">
                <span>PREPARING COLLECTION</span>
                <span>{introNumber}%</span>
              </div>
              <div className="intro-track">
                <div
                  className="intro-fill"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
            </div>
            <span className="intro-left">Frontend Playground</span>
            <span className="intro-right">2026</span>
          </div>
        )}
        {panel && (
          <section
            className="collection-panel"
            id="collection-index"
            aria-label={panel === "index" ? "실험 목록" : "소개"}
          >
            <div className="panel-heading">
              <span>
                PLAYGROUND / {panel === "index" ? "THE INDEX" : "ABOUT"}
              </span>
              <button onClick={() => setPanel(null)} aria-label="패널 닫기">
                Close <Icon name="close" size={16} />
              </button>
            </div>
            {panel === "about" ? (
              <div className="collection-about">
                <h2>
                  Curious
                  <br />
                  by default.
                </h2>
                <p>
                  호기심에서 시작해, 경험으로 완성하는 웹.
                  <br />
                  만들고, 부수고, 다시 발견하는 작은 실험실.
                </p>
                <p>
                  작은 궁금증을 코드로 옮기고,
                  <br />
                  직접 만들어 답을 찾아갑니다.
                </p>
                <a
                  href="https://github.com/JeongWon-CHO/frontend-playground"
                  target="_blank"
                  rel="noreferrer"
                >
                  Follow the exploration on GitHub <Icon size={16} />
                </a>
              </div>
            ) : (
              <>
                <h2 className="index-title">
                  The experiments <sup>({experiments.length})</sup>
                </h2>
                <div className="index-tools">
                  <input
                    type="search"
                    aria-label="실험 검색"
                    placeholder="Search experiments…"
                    value={query}
                    onChange={(e) => update("q", e.target.value)}
                  />
                  <select
                    aria-label="정렬 순서"
                    value={params.get("sort") ?? "latest"}
                    onChange={(e) => update("sort", e.target.value)}
                  >
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
                <div className="index-filters">
                  {categories.map((c) => (
                    <button
                      key={c}
                      aria-pressed={category === c}
                      onClick={() => update("category", c === "All" ? "" : c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="index-list">
                  {filtered.map((e) => (
                    <article key={e.id}>
                      <button
                        className="index-select"
                        onClick={() => {
                          select(experiments.indexOf(e));
                          setPanel(null);
                        }}
                      >
                        <span>{e.id}</span>
                        <h3>{e.title}</h3>
                        <span>{e.category}</span>
                      </button>
                      {e.status === "live" ? (
                        <Link to={e.path} onClick={remember}>
                          Explore <Icon size={14} />
                        </Link>
                      ) : (
                        <span className="index-planned">In progress</span>
                      )}
                    </article>
                  ))}
                  {!filtered.length && (
                    <p>
                      검색 결과가 없어요. 다른 검색어나 분류를 선택해 보세요.
                    </p>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
