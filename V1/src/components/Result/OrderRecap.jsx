import { useMemo } from 'react';
import coffees from '../../data/coffees.json';
import archetypes from '../../data/archetypes.json';
import { match } from '../../lib/matching.js';

const ROAST_LABELS = { light: 'Light', medium: 'Medium', dark: 'Dark' };
const METHOD_LABELS = {
  espresso: 'Espresso',
  filtre: 'V60 / Filtre',
  moka: 'Cafetière italienne',
  aeropress: 'Aeropress',
  piston: 'Piston (French Press)',
};

function buildMailto(result, quiz) {
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
  const mailtoUrl = useMemo(() => buildMailto(result, quiz), [result, quiz]);

  return (
    <div className="recap">
      <h2 className="recap__title">Récapitulatif de ta commande</h2>
      <p className="recap__subtitle">
        Vérifie ta commande, puis envoie-la-nous : nous préparerons ton blend à la torréfaction choisie et te recontacterons pour finaliser le paiement et la livraison.
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
        <a className="cta" href={mailtoUrl}>
          Envoyer ma commande
        </a>
        <button type="button" className="cta cta--secondary" onClick={onBack}>
          ← Modifier
        </button>
      </div>

      <p className="recap__hint">
        En cliquant sur « Envoyer ma commande », ton application mail s'ouvre avec le récap pré-rempli. Complète tes coordonnées (nom, téléphone, adresse) puis envoie. Nous te recontacterons rapidement pour le paiement et la livraison.
      </p>
    </div>
  );
}
