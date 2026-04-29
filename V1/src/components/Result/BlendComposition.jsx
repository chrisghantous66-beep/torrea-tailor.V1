const ROAST_LABELS = {
  light: 'Torréfaction light (vif & fruité)',
  medium: 'Torréfaction medium (équilibrée)',
  dark: 'Torréfaction dark (corsée & chocolatée)',
};

export default function BlendComposition({ blend }) {
  return (
    <section className="blend">
      <h3 className="blend__title">Notre blend pour toi</h3>
      {blend.roast_level && (
        <p className="blend__roast">{ROAST_LABELS[blend.roast_level]} — adaptée à la commande</p>
      )}
      <div className="blend__bar" role="img" aria-label="Composition du blend en pourcentages">
        {blend.composition.map(({ coffee, percentage }) => (
          <div
            key={coffee.id}
            className="blend__segment"
            style={{ width: `${percentage}%` }}
            title={`${coffee.name} ${percentage}%`}
          >
            <span className="blend__segment-label">{percentage}%</span>
          </div>
        ))}
      </div>
      <ul className="blend__legend">
        {blend.composition.map(({ coffee, percentage }) => (
          <li key={coffee.id}>
            <strong>{percentage}% {coffee.name}</strong>
            <span className="blend__legend-origin"> ({coffee.origin})</span>
            {coffee.tasting_notes && (
              <span className="blend__legend-notes"> — {coffee.tasting_notes.join(', ')}</span>
            )}
          </li>
        ))}
      </ul>
      <p className="blend__story">{blend.story}</p>
      <a className="cta" href="https://torrea.fr/" target="_blank" rel="noopener noreferrer">
        Le commander
      </a>
    </section>
  );
}
