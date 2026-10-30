import type { Experiment } from "@/data/experiments";
import Icon from "./Icon";

type Props = { experiment: Experiment };

export default function CollectionNotes({ experiment }: Props) {
  return (
    <div className="collection-notes">
      <div>
        <span className="note-symbol">
          <Icon name="asterisk" />
        </span>
        <span className="note-label">THE EXPERIMENT</span>
        <h2>“{experiment.title}”</h2>
      </div>
      <div>
        <span className="note-symbol">
          <Icon />
        </span>
        <span className="note-label">
          {experiment.category.toUpperCase()} / VOL. {experiment.id}
        </span>
        <p>{experiment.description}</p>
        {experiment.status === "planned" && (
          <span className="coming-soon">COMING SOON</span>
        )}
      </div>
    </div>
  );
}
