import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CollectionNavigation from "@/components/Home/CollectionNavigation";
import CollectionInfo from "@/components/Home/CollectionInfo";
import CollectionStage from "@/components/Home/CollectionStage";
import CollectionNotes from "@/components/Home/CollectionNotes";
import CollectionIntro from "@/components/Home/CollectionIntro";
import CollectionPanel from "@/components/Home/CollectionPanel";
import useCollectionIntro from "./hooks/useCollectionIntro";
import useExperimentSelection from "./hooks/useExperimentSelection";
import useExperimentFilters from "./hooks/useExperimentFilters";
import useCollectionPanel from "./hooks/useCollectionPanel";
import useExperimentOpening from "./hooks/useExperimentOpening";
import "./Home.css";

export default function Home() {
  const [params] = useSearchParams();
  const { loading, progress, introNumber } = useCollectionIntro();
  const { index, active, select: selectExperiment } = useExperimentSelection();
  const { query, category, sort, filtered, update } = useExperimentFilters();
  const { panel, setPanel } = useCollectionPanel();
  const { opening, isOpening, open, finishOpening } = useExperimentOpening(active, remember);

  useEffect(() => {
    document.title = "Playground — The experiment collection";
  }, []);

  function remember() {
    sessionStorage.setItem("playground-search", params.toString());
  }

  function select(next: number) {
    if (!isOpening()) selectExperiment(next);
  }

  return (
    <div
      className={`collection ${loading ? "is-loading" : ""} ${opening ? "is-opening" : ""}`}
    >
      <a className="skip-link" href="#collection-stage">
        실험 컬렉션으로 건너뛰기
      </a>
      <CollectionNavigation
        loading={loading}
        opening={opening}
        panel={panel}
        onPanelChange={setPanel}
        onSelect={select}
      />
      <main>
        <CollectionInfo key={`${active.id}-${loading}`} experiment={active} />
        <CollectionStage
          index={index}
          loading={loading}
          opening={opening}
          disabled={loading || !!panel || opening}
          onSelect={select}
          onOpen={open}
          onOpenComplete={finishOpening}
          onShowIndex={() => setPanel("index")}
        />
        <CollectionNotes key={`notes-${active.id}-${loading}`} experiment={active} />
        {loading && <CollectionIntro progress={progress} introNumber={introNumber} />}
        {panel && (
          <CollectionPanel
            panel={panel}
            query={query}
            category={category}
            sort={sort}
            filtered={filtered}
            onClose={() => setPanel(null)}
            onSelect={select}
            onUpdate={update}
            onExplore={remember}
          />
        )}
      </main>
    </div>
  );
}
