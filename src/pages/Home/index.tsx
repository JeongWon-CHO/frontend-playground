import Icon from "../../components/Home/Icon";
import { useLayoutEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Sculpture from "../../components/Home/Sculpture";
import PageMotion from "../../components/Home/PageMotion";
import LivingBackdrop from "../../components/Home/LivingBackdrop";
import SignalPlayground from "../../components/Home/SignalPlayground";
import ExperimentBench from "../../components/Home/ExperimentBench";
import CuriosityPlayground from "../../components/Home/CuriosityPlayground";
import SectionNavigation from "../../components/Home/SectionNavigation";
import ExperimentPreview from "../../components/Home/ExperimentPreview";
import { categories, experiments } from "../../data/experiments";
import "./Home.css";
import { rememberHomeScroll, restoreHomeScroll } from "./scrollPosition";

const github = "https://github.com/JeongWon-CHO/frontend-playground";
const githubMain = "https://github.com/JeongWon-CHO";

const featured = experiments
  .filter((e) => e.status === "live" && e.featured !== undefined)
  .sort(
    (a, b) =>
      (a.status === "live" ? (a.featured ?? 0) : 0) -
      (b.status === "live" ? (b.featured ?? 0) : 0),
  )
  .slice(0, 3);
export default function Home() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "All";
  const sort = params.get("sort") ?? "latest";
  const [selected, setSelected] = useState(experiments[0].id);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [split, setSplit] = useState(true);
  const [load, setLoad] = useState(65);
  const rawLimit = Number(params.get("limit"));
  const limit = Number.isFinite(rawLimit) ? Math.max(12, rawLimit) : 12;
  const filtered = experiments
    .filter(
      (e) =>
        (category === "All" || e.category === category) &&
        `${e.title} ${e.description} ${e.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "oldest"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );
  const active = filtered.find((e) => e.id === selected) ?? filtered[0];
  const feature = featured[featureIndex];
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "limit") next.delete("limit");
    setParams(next, { replace: true });
  };
  useLayoutEffect(() => {
    document.title = "Playground — Ideas in motion";
    restoreHomeScroll();
  }, []);
  const remember = () => {
    rememberHomeScroll();
    sessionStorage.setItem("playground-search", params.toString());
  };
  return (
    <div className="playground" id="top">
      <LivingBackdrop />
      <PageMotion />
      <SectionNavigation />
      <a className="skip-link" href="#experiments">
        실험 목록으로 건너뛰기
      </a>
      <header className="site-header shell">
        <a className="wordmark" href="#top">
          <span className="brand-symbol">✳</span> playground
          <span className="wordmark-dot">®</span>
        </a>
        <nav aria-label="메인 메뉴">
          <a href="#experiments">
            Experiments{" "}
            <span>{String(experiments.length).padStart(2, "0")}</span>
          </a>
          <a href="#about">About</a>
          <a href={githubMain} target="_blank" rel="noreferrer">
            GitHub <Icon />
          </a>
        </nav>
        <span className="header-note mono">
          <i /> ALWAYS IN PROGRESS
        </span>
      </header>
      <main>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-eyebrow mono">
            <span className="tiny-cross">+</span> A PERSONAL SPACE FOR WEB
            EXPERIMENTS
          </div>
          <div className="hero-content">
            <div className="hero-copy">
              <h1 id="hero-title">
                Ideas
                <br />
                in <em>motion.</em>
              </h1>
              <p>
                호기심에서 시작해, 경험으로 완성하는 웹.
                <br />
                만들고, 부수고, 다시 발견하는 작은 실험실.
              </p>
              <a className="explore-link" href="#experiments">
                <span className="circle-arrow">
                  <Icon name="arrow-down" />
                </span>{" "}
                Explore the experiments
              </a>
            </div>
            <Sculpture />
          </div>
          <div className="hero-bottom mono">
            <span>CODE. PLAY. DISCOVER. REPEAT.</span>
            <span>
              SCROLL TO DISCOVER{" "}
              <span className="lime">
                <Icon name="arrow-down" />
              </span>
            </span>
            <span>
              BASED IN CURIOSITY <Icon />
            </span>
          </div>
        </section>
        {feature && (
          <section
            className="featured-section shell"
            aria-labelledby="featured-title"
          >
            <div className="section-top">
              <span className="eyebrow mono">
                <span className="lime">01 /</span> IN THE SPOTLIGHT
              </span>
              <span className="mono muted">
                SELECTED EXPERIMENT {String(featureIndex + 1).padStart(2, "0")}{" "}
                / {String(featured.length).padStart(2, "0")}
              </span>
            </div>
            <div className="featured-card">
              <div className="featured-art">
                <div className="art-top mono">
                  <span>
                    <i className="status-dot" /> INTERACTIVE PREVIEW
                  </span>
                  <span>FIG. {feature.id}</span>
                </div>
                {feature.preview === "threads" ? (
                  <SignalPlayground split={split} load={load} />
                ) : (
                  <ExperimentPreview
                    kind={feature.preview}
                    split={split}
                    load={load}
                  />
                )}
                {feature.preview === "threads" && (
                  <div className="workload-control">
                    <label htmlFor="preview-workload">
                      <span className="mono">DRAG TO ADD WORK</span>
                      <output>{load}%</output>
                    </label>
                    <input
                      id="preview-workload"
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={load}
                      onChange={(event) => setLoad(Number(event.target.value))}
                    />
                    <p>
                      {split
                        ? "작업은 나눠서, 인터페이스는 부드럽게."
                        : load >= 60
                          ? "작업이 쌓일수록 메인 스레드가 혼잡해져요."
                          : "작업량을 올려 흐름의 변화를 확인해 보세요."}
                    </p>
                  </div>
                )}
                <div className="art-controls">
                  <span className="mono">CONCEPT VISUALIZATION</span>
                  {feature.preview === "threads" && (
                    <button
                      aria-pressed={split}
                      onClick={() => setSplit(!split)}
                    >
                      <span className={`toggle ${split ? "on" : ""}`} /> Web
                      Worker {split ? "ON" : "OFF"}
                    </button>
                  )}
                </div>
              </div>
              <div className="featured-copy">
                <span className="pill mono">
                  {feature.category.toUpperCase()}
                </span>
                <h2 id="featured-title">{feature.title}</h2>
                <p>{feature.description}</p>
                <div className="tags mono">
                  {feature.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {feature.status === "live" && (
                  <Link
                    className="primary-link"
                    to={feature.path}
                    onClick={remember}
                  >
                    실험 시작하기{" "}
                    <span>
                      <Icon />
                    </span>
                  </Link>
                )}
                <span className="feature-footnote mono">
                  BUILT TO UNDERSTAND, NOT JUST TO WORK.
                </span>
              </div>
            </div>
            {featured.length > 1 && (
              <div className="feature-selector">
                {featured.map((e, i) => (
                  <button
                    key={e.id}
                    aria-pressed={featureIndex === i}
                    onClick={() => setFeatureIndex(i)}
                  >
                    {e.title}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
        <section
          id="experiments"
          className="archive shell"
          aria-labelledby="archive-title"
        >
          <div className="section-top">
            <span className="eyebrow mono">
              <span className="lime">02 /</span> THE EXPLORATION INDEX
            </span>
            <span className="mono muted">AN EVER-GROWING COLLECTION</span>
          </div>
          <div className="archive-heading">
            <h2 id="archive-title">
              The experiments
              <span>({String(experiments.length).padStart(2, "0")})</span>
            </h2>
            <p>
              작은 질문 하나, 새로운 가능성 하나.
              <br />
              계속해서 쌓아가는 실험의 기록.
            </p>
          </div>
          <div className="archive-tools">
            <div className="filters" role="group" aria-label="실험 분류">
              {categories.map((c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  className={category === c ? "active" : ""}
                  onClick={() => update("category", c === "All" ? "" : c)}
                >
                  {c}
                  {c === "All" && <span>{experiments.length}</span>}
                </button>
              ))}
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                aria-label="실험 검색"
                placeholder="Search experiments"
                value={query}
                onChange={(e) => update("q", e.target.value)}
              />
            </label>
          </div>
          <div className="archive-body">
            <div className="experiment-list">
              <div className="list-header mono">
                <span>
                  {String(filtered.length).padStart(2, "0")} EXPERIMENTS
                </span>
                <select
                  aria-label="정렬 순서"
                  value={sort}
                  onChange={(e) => update("sort", e.target.value)}
                >
                  <option value="latest">Latest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
              {filtered.slice(0, limit).map((e) => (
                <article
                  className={`experiment-row ${active?.id === e.id ? "selected" : ""}`}
                  key={e.id}
                  onMouseEnter={() => setSelected(e.id)}
                  onFocus={() => setSelected(e.id)}
                >
                  <span className="row-number mono">{e.id}</span>
                  {e.status === "live" ? (
                    <Link onClick={remember} to={e.path} className="row-main">
                      <h3>{e.title}</h3>
                      <span className="row-tags mono">
                        {e.tags.join(" / ")}
                      </span>
                    </Link>
                  ) : (
                    <button
                      className="row-main"
                      onClick={() => setSelected(e.id)}
                      aria-label={`${e.title}, 준비 중. 프리뷰 보기`}
                    >
                      <h3>{e.title}</h3>
                      <span className="row-tags mono">
                        {e.tags.join(" / ")}
                      </span>
                    </button>
                  )}
                  <span className={`row-status mono ${e.status}`}>
                    {e.status === "live" ? (
                      <>
                        <i /> LIVE <Icon />
                      </>
                    ) : (
                      "COMING SOON"
                    )}
                  </span>
                </article>
              ))}
              {!filtered.length && (
                <div className="empty-state">
                  <span>아직 이곳은 미지의 영역.</span>
                  <p>다른 검색어나 분류로 실험을 찾아보세요.</p>
                  <button onClick={() => setParams({}, { replace: true })}>
                    전체 실험 보기 <Icon />
                  </button>
                </div>
              )}
              {filtered.length > limit && (
                <button
                  className="load-more"
                  onClick={() => update("limit", String(limit + 12))}
                >
                  Load more +
                </button>
              )}
              <div className="list-bottom mono">
                <span>
                  <i className="status-dot" />{" "}
                  {experiments.filter((e) => e.status === "live").length} LIVE
                </span>
                <span>
                  MORE IDEAS ARE ON THE WAY <Icon />
                </span>
              </div>
            </div>
            <aside className="archive-preview" aria-label="선택한 실험 프리뷰">
              {active ? (
                <>
                  <div className="preview-label mono">
                    <span>EXPERIMENT / {active.id}</span>
                    <span>
                      <Icon />
                    </span>
                  </div>
                  <ExperimentBench key={active.id} kind={active.preview} />
                  <div
                    className="preview-description"
                    key={`description-${active.id}`}
                  >
                    <span className="mono lime">
                      {active.category.toUpperCase()}
                    </span>
                    <h3>{active.title}</h3>
                    <p>{active.description}</p>
                    {active.status === "planned" && (
                      <span className="planned-note mono">
                        IN THE PIPELINE — 준비 중
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="preview-empty mono">
                  THE NEXT IDEA IS OUT THERE.
                </div>
              )}
            </aside>
          </div>
        </section>
        <section className="about-section shell" id="about">
          <div className="section-top">
            <span className="eyebrow mono">
              <span className="lime">03 /</span> THE MINDSET
            </span>
            <span className="brand-symbol">✳</span>
          </div>
          <div className="about-content">
            <h2>
              Curious
              <br />
              by <em>default.</em>
              <span className="lime">
                <Icon />
              </span>
            </h2>
            <div>
              <p>
                어떻게 움직일까? 더 나아질 수 있을까?
                <br />
                작은 궁금증을 코드로 옮기고,
                <br />
                직접 만들어 답을 찾아갑니다.
              </p>
              <p className="muted">
                이곳은 완성된 결과와 아직 진행 중인 생각이
                <br />
                함께 자라는 프론트엔드 플레이그라운드입니다.
              </p>
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Follow the exploration on GitHub <Icon />
              </a>
            </div>
          </div>
          <CuriosityPlayground />
        </section>
      </main>
      <footer className="site-footer shell mono">
        <span>© {new Date().getFullYear()} PLAYGROUND</span>
        <span>A LITTLE CURIOUS. ALWAYS BUILDING.</span>
        <a href="#top">
          BACK TO TOP <Icon name="arrow-up" />
        </a>
      </footer>
    </div>
  );
}
