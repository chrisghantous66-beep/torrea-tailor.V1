export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="progress" aria-live="polite">
      <div className="progress__label">Étape {current} / {total}</div>
      <div className="progress__bar">
        <div className="progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
