import Icon from "./Icon";
import type { HomePanel } from "@/pages/Home/hooks/useCollectionPanel";

type Props = {
  loading: boolean;
  opening: boolean;
  panel: HomePanel;
  onPanelChange: (panel: HomePanel) => void;
  onSelect: (index: number) => void;
};

export default function CollectionNavigation({
  loading,
  opening,
  panel,
  onPanelChange,
  onSelect,
}: Props) {
  return (
    <nav className="collection-nav" aria-label="메인 메뉴" inert={opening}>
      <button
        className="pg-logo"
        onClick={() => {
          onPanelChange(null);
          onSelect(0);
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
            onClick={() => onPanelChange(null)}
          >
            Experiments
          </button>
          <button
            className={panel === "about" ? "nav-active" : ""}
            onClick={() => onPanelChange(panel === "about" ? null : "about")}
          >
            About
          </button>
          <button
            aria-expanded={panel === "index"}
            aria-controls="collection-index"
            onClick={() => onPanelChange(panel === "index" ? null : "index")}
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
  );
}
