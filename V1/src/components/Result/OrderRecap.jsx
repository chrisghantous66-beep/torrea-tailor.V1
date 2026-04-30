import { useMemo } from 'react';
import coffees from '../../data/coffees.json';
import archetypes from '../../data/archetypes.json';
import { match } from '../../lib/matching.js';

// 👉 À MODIFIER une fois le produit WooCommerce créé sur torrea.fr.
const BLEND_PRODUCT_URL = 'https://torrea.fr/product/blend-personnalise-torrea-tailor/';

const ROAST_LABELS = { light: 'Light', medium: 'Medium', dark: 'Dark' };
const GRIND_LABELS = { grain: 'En grain', moulu: 'Moulu' };
const METHOD_LABELS = {
  espresso: 'Espresso',
  filtre: 'V60 / Filtre',
  moka: 'Cafetière italienne',
  aeropress: 'Aeropress',
  piston: 'Piston (French Press)',
};

function buildOrderUrl(result, quiz) {
  const blend = result.blend.composition
    .map(({ coffee, percentage }) => `${percentage}-${coffee.id}`)
    .join(',');

  const paramsObj = {
    archetype: result.archetype.id,
    archetype_name: result.archetype.name,
    method: result.blend.method,
    roast: result.blend.roast_level,
    blend,
  };
  if (quiz.grind_type) paramsObj.grind = quiz.grind_type;

  const params = new URLSearchParams(paramsObj);
  return `${BLEND_PRODUCT_URL}?${params.toString()}`;
}

export default function OrderRecap({ quiz, onBack }) {
  const result = useMemo(() => match(quiz, { coffees, archetypes }), [quiz]);
  const orderUrl = useMemo(() => buildOrderUrl(result, quiz), [result, quiz]);

  return (
    <div className="recap">
      <h2 className="recap__title">Récapitulatif de ta commande</h2>
      <p className="recap__subtitle">
        Vérifie ta commande avant de passer au paiement.
      </p>

      <section className="recap__block">
        <p className="recap__eyebrow">Ton profil</p>
        <h3 className="recap__archetype">{result.archetype.name}</h3>
        <p className="recap__tagline">{result.archetype.tagline}</p>
      </section>

      <section className="recap__block">
        <p className="recap__eyebrow">Mode d'extraction</p>
        <p className="recap__value">{METHOD_LABELS[result.blend.method] || result.blend.method}</p>
      </section>

      <section className="recap__block">
        <p className="recap__eyebrow">Niveau de torréfaction</p>
        <p className="recap__value">{ROAST_LABELS[result.blend.roast_level] || result.blend.roast_level}</p>
      </section>

      {quiz.grind_type && (
        <section className="recap__block">
          <p className="recap__eyebrow">Mouture</p>
          <p className="recap__value">{GRIND_LABELS[quiz.grind_type] || quiz.grind_type}</p>
        </section>
      )}

      <section className="recap__block">
        <p className="recap__eyebrow">Composition du blend</p>
        <ul className="recap__composition">
          {result.blend.composition.map(({ coffee, percentage }) => (
            <li key={coffee.id}>
              <strong>{percentage}% {coffee.name}</strong>
              <span className="recap__origin"> — {coffee.origin}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="recap__next-step">
        ℹ️ Tu choisiras le poids (125g, 250g, 500g ou 1kg) et la quantité à l'étape suivante.
      </p>

      <div className="recap__actions">
        <a className="cta" href={orderUrl} target="_blank" rel="noopener noreferrer">
          Commander & payer
        </a>
        <button type="button" className="cta cta--secondary" onClick={onBack}>
          ← Modifier
        </button>
      </div>
    </div>
  );
}
