export default function DeepenPrompt({ onShow, onDeepen }) {
  return (
    <div className="deepen">
      <h2 className="deepen__title">Veux-tu affiner ton profil ?</h2>
      <p className="deepen__hint">+1 minute, 4 questions de plus pour une recommandation encore plus précise.</p>
      <div className="deepen__actions">
        <button type="button" className="cta" onClick={onShow}>Voir mon résultat</button>
        <button type="button" className="cta cta--secondary" onClick={onDeepen}>Aller plus loin</button>
      </div>
    </div>
  );
}
