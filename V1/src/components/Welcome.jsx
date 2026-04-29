export default function Welcome({ onStart }) {
  return (
    <div className="welcome">
      <h1 className="welcome__title">Trouvons ton café idéal</h1>
      <p className="welcome__subtitle">En moins de 90 secondes, on te recommande le café (ou le blend) qui te ressemble.</p>
      <button type="button" className="cta" onClick={onStart}>
        Commencer
      </button>
    </div>
  );
}
