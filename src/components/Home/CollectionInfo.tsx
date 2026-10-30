import type { Experiment } from "@/data/experiments";
import Icon from "./Icon";

type Props = { experiment: Experiment };

export default function CollectionInfo({ experiment }: Props) {
  return (
    <section
      className="collection-info"
      aria-live="polite"
    >
      <h1>{experiment.tags[0]}</h1>
      <dl>
        <div>
          <dt>CREATED BY</dt>
          <dd>JeongWon Cho</dd>
        </div>
        <div>
          <dt>YEAR</dt>
          <dd>{experiment.date.slice(0, 4)}</dd>
        </div>
        <div>
          <dt>BUILT WITH</dt>
          <dd>
            {experiment.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </dd>
        </div>
        <div className="info-status">
          <dt>STATUS</dt>
          <dd>
            {experiment.status === "live" ? (
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
  );
}
