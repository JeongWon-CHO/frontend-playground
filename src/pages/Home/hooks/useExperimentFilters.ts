import { useSearchParams } from "react-router-dom";
import { experiments } from "@/data/experiments";

export type ExperimentFilterKey = "q" | "category" | "sort";

export default function useExperimentFilters() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "All";
  const sort = params.get("sort") ?? "latest";
  const filtered = experiments
    .filter(
      (experiment) =>
        (category === "All" || experiment.category === category) &&
        `${experiment.title} ${experiment.tags.join(" ")} ${experiment.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "oldest"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date),
    );

  function update(key: ExperimentFilterKey, value: string) {
    setParams((current) => {
      const updated = new URLSearchParams(current);
      if (value) updated.set(key, value);
      else updated.delete(key);
      return updated;
    }, { replace: true });
  }

  return { query, category, sort, filtered, update };
}
