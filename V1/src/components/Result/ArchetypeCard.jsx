import { CoffeeLeaf } from '../BotanicalDecor.jsx';

export default function ArchetypeCard({ archetype }) {
  return (
    <section className="archetype-card" style={{ '--accent': archetype.accent_color }}>
      <CoffeeLeaf className="archetype-card__leaf archetype-card__leaf--left" />
      <CoffeeLeaf className="archetype-card__leaf archetype-card__leaf--right" />
      <div className="archetype-card__header">
        <p className="archetype-card__eyebrow">Ton profil</p>
        <h2 className="archetype-card__name">{archetype.name}</h2>
        <p className="archetype-card__tagline">{archetype.tagline}</p>
      </div>
      {archetype.illustration && (
        <img
          src={archetype.illustration}
          alt={`Illustration de ${archetype.name}`}
          className="archetype-card__illustration"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      <p className="archetype-card__description">{archetype.description}</p>
    </section>
  );
}
