import "./SourceComparison.css";
import baselineSource from "@/pages/RenderProfiler/BaselineDashboard.tsx?raw";
import localStateSource from "@/pages/RenderProfiler/LocalStateDashboard.tsx?raw";

const versions = [
  {
    title: "변경 전 · 부모가 검색 상태를 소유",
    filename: "BaselineDashboard.tsx",
    description:
      "검색어가 바뀌면 BaselineDashboard부터 다시 렌더링됩니다. 그 아래 Dashboard와 RevenueChart도 함께 실행됩니다.",
    source: baselineSource.slice(
      baselineSource.indexOf("export default function"),
    ),
  },
  {
    title: "변경 후 · 목록이 검색 상태를 소유",
    filename: "LocalStateDashboard.tsx",
    description:
      "검색 상태와 필터링을 SearchableOrders로 옮겼습니다. 입력할 때 이 컴포넌트와 OrderList만 업데이트되고, 바깥의 Dashboard와 RevenueChart는 다시 실행되지 않습니다.",
    source: localStateSource.slice(
      localStateSource.indexOf("function SearchableOrders"),
    ),
  },
];

export default function SourceComparison() {
  return (
    <details className="render-source-comparison">
      <summary>코드에서 무엇을 바꿨을까요?</summary>
      <p>
        <code>useState</code>로 만든 검색 상태, 검색 필터링, 입력 핸들러를
        부모에서 <code>SearchableOrders</code> 안으로 옮겼습니다. 두 버전의{" "}
        <code>Dashboard</code>는 같은 차트와 목록 영역을 보여줍니다.
      </p>
      <div className="render-source-grid">
        {versions.map((version) => (
          <section key={version.filename} aria-label={version.title}>
            <h3>{version.title}</h3>
            <p>{version.description}</p>
            <figure>
              <figcaption>{version.filename} · 현재 소스에서 발췌</figcaption>
              <pre>
                <code>
                  {version.source
                    .trimEnd()
                    .split("\n")
                    .map((line, index) => (
                      <span
                        key={index}
                        className={
                          line.includes("const [query, setQuery]")
                            ? "render-source-state"
                            : undefined
                        }
                      >
                        {line || " "}
                        {"\n"}
                      </span>
                    ))}
                </code>
              </pre>
            </figure>
          </section>
        ))}
      </div>
      <p>
        색으로 표시한 줄이 검색 상태의 위치입니다. <code>memo</code>나
        <code>useMemo</code>는 추가하지 않았고, 차트 계산량도 같습니다. 두 버전
        모두 실험 컴포넌트의 <code>"use no memo"</code> 설정을 유지합니다.
        차트를 처음 표시하거나 계산량을 바꿀 때의 비용은 여전히 남아 있습니다.
      </p>
    </details>
  );
}
