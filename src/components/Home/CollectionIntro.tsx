type Props = { progress: number; introNumber: number };

export default function CollectionIntro({ progress, introNumber }: Props) {
  return (
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
  );
}
