import { useMemo } from 'react';
import coffees from '../../data/coffees.json';
import archetypes from '../../data/archetypes.json';
import { match } from '../../lib/matching.js';

// 👉 À MODIFIER une fois le produit WooCommerce créé sur torrea.fr.
// Exemple final : 'https://torrea.fr/product/blend-personnalise-torrea-tailor/'
const BLEND_PRODUCT_URL = 'https://torrea.fr/product/blend-personnalise-torrea-tailor/';

const ROAST_LABELS = { light: 'Light', medium: 'Medium', dark: 'Dark' };
const METHOD_LABELS = {
  espresso: 'Espresso',
  filtre: 'V60 / Filtre',
  moka: 'Cafetière italienne',
  aeropress: 'Aeropress',
  piston: 'Piston (French Press)',
};

function buildOrderUrl(result) {
  // Composition encodée en lisible : 60-capucas_30-palanda_10-el_triunfo
  const blend = result.blend.composition
    .map(({ coffee, percentage }) => `${percentage}-${coffee.id}`)
    .join('_');

  const params = new URLSearchParams({
    archetype: result.archetype.id,
    archetype_name: result.archetype.name,
    method: result.blend.method,
    roast: result.blend.roast_level,
    blend,
  });

  return `${BLEND_PRODUCT_URL}?${params.toString()}`;
}

function buildMailto(result) {
  const composition = result.blend.composition
    .map(({ coffee, percentage }) => `- ${percentage}% ${coffee.name} (${coffee.origin})`)
    .join('\n');

  const subject = `Commande blend personnalisé — ${result.archetype.name}`;

  const body = `Bonjour,

Je souhaite commander un blend personnalisé via Torrea Tailor.

— MON PROFIL —
${result.archetype.name}
${result.archetype.tagline}

— DÉTAILS DU BLEND —
Mode d'extraction : ${METHOD_LABELS[result.blend.method] || result.blend.method}
Niveau de torréfaction : ${ROAST_LABELS[result.blend.roast_level] || result.blend.roast_level}

Composition :
${composition}

— À COMPLÉTER PAR MES SOINS —
Poids souhaité (125g / 250g / 500g / 1000g) :
Quantité :
Nom :
Téléphone :
Adresse de livraison :
Code postal & ville :

Merci !`;

  return `mailto:contact@torrea.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function OrderRecap({ quiz, onBack }) {
  const result = useMemo(() => match(quiz, { coffees, archetypes }), [quiz]);
  const orderUrl = useMemo(() => buildOrderUrl(result), [result]);
  const mailtoUrl = useMemo(() => buildMailto(result), [result]);

  return (
    <div className="recap">
      <h2 className="recap__title">Récapitulatif de ta commande</h2>
      <p className="recap__subtitle">
        Vérifie ta commande, puis choisis ton poids et règle directement par carte sur notre boutique.
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

      <div className="recap__actions">
        <a className="cta" href={orderUrl} target="_blank" rel="noopener noreferrer">
          Commander & payer
        </a>
        <a className="cta cta--secondary" href={mailtoUrl}>
          Envoyer par email
        </a>
        <button type="button" className="cta cta--secondary" onClick={onBack}>
          ← Modifier
        </button>
      </div>

      <p className="recap__hint">
        « Commander & payer » t'amène sur notre boutique pour choisir le poids (125g, 250g, 500g, 1000g) et régler par carte. La composition de ton blend nous est transmise automatiquement.
        <br /><br />
        Si tu préfères passer par email, « Envoyer par email » ouvre ton application mail avec le récap pré-rempli.
      </p>
    </div>
  );
}
