import { Link } from "react-router-dom";
import { categories, experiments } from "@/data/experiments";
import type { Experiment } from "@/data/experiments";
import type { HomePanel } from "@/pages/Home/hooks/useCollectionPanel";
import type { ExperimentFilterKey } from "@/pages/Home/hooks/useExperimentFilters";
import Icon from "./Icon";

type Props = {
  panel: NonNullable<HomePanel>;
  query: string;
  category: string;
  sort: string;
  filtered: Experiment[];
  onClose: () => void;
  onSelect: (index: number) => void;
  onUpdate: (key: ExperimentFilterKey, value: string) => void;
  onExplore: () => void;
};

export default function CollectionPanel({
  panel,
  query,
  category,
  sort,
  filtered,
  onClose,
  onSelect,
  onUpdate,
  onExplore,
}: Props) {
  return (
    <section
      className="collection-panel"
      id="collection-index"
      aria-label={panel === "index" ? "실험 목록" : "소개"}
    >
      <div className="panel-heading">
        <span>
          PLAYGROUND / {panel === "index" ? "THE INDEX" : "ABOUT"}
        </span>
        <button onClick={onClose} aria-label="패널 닫기">
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
              onChange={(e) => onUpdate("q", e.target.value)}
            />
            <select
              aria-label="정렬 순서"
              value={sort}
              onChange={(e) => onUpdate("sort", e.target.value)}
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
                onClick={() => onUpdate("category", c === "All" ? "" : c)}
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
                    onSelect(experiments.indexOf(e));
                    onClose();
                  }}
                >
                  <span>{e.id}</span>
                  <h3>{e.title}</h3>
                  <span>{e.category}</span>
                </button>
                {e.status === "live" ? (
                  <Link to={e.path} onClick={onExplore}>
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
  );
}
