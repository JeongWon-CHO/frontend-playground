import { useSearchParams } from "react-router-dom";
import { experiments } from "@/data/experiments";

export default function useExperimentSelection() {
  const [params, setParams] = useSearchParams();
  const index = Math.max(
    0,
    experiments.findIndex((experiment) => experiment.id === params.get("disc")),
  );

  function select(next: number) {
    const value = Math.min(experiments.length - 1, Math.max(0, next));
    setParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("disc", experiments[value].id);
      return updated;
    }, { replace: true });
  }

  return { index, active: experiments[index], select };
}
