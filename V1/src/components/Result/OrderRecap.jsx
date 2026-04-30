import { useMemo, useState } from 'react';
import coffees from '../../data/coffees.json';
import archetypes from '../../data/archetypes.json';
import { match } from '../../lib/matching.js';

// 👉 À MODIFIER une fois le produit WooCommerce créé sur torrea.fr.
const BLEND_PRODUCT_URL = 'https://torrea.fr/product/blend-personnalise-torrea-tailor/';

const WEIGHTS = ['125g', '250g', '500g', '1000g'];

const ROAST_LABELS = { light: 'Light', medium: 'Medium', dark: 'Dark' };
const METHOD_LABELS = {
  espresso: 'Espresso',
  filtre: 'V60 / Filtre',
  moka: 'Cafetière italienne',
  aeropress: 'Aeropress',
  piston: 'Piston (French Press)',
};

function buildOrderUrl(result, form) {
  const blend = result.blend.composition
    .map(({ coffee, percentage }) => `${percentage}-${coffee.id}`)
    .join('_');

  const params = new URLSearchParams({
    archetype: result.archetype.id,
    archetype_name: result.archetype.name,
    method: result.blend.method,
    roast: result.blend.roast_level,
    blend,
    weight: form.weight,
    quantity: String(form.quantity || 1),
  });

  return `${BLEND_PRODUCT_URL}?${params.toString()}`;
}

function buildMailto(result, form) {
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

— MES INFORMATIONS —
Poids souhaité : ${form.weight || '(à compléter)'}
Quantité : ${form.quantity || 1}
Nom : ${form.name || '(à compléter)'}
Téléphone : ${form.phone || '(à compléter)'}
Adresse de livraison : ${form.address || '(à compléter)'}
Code postal & ville : ${form.cityzip || '(à compléter)'}

Merci !`;

  return `mailto:contact@torrea.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function OrderRecap({ quiz, onBack }) {
  const [form, setForm] = useState({
    weight: '',
    quantity: 1,
    name: '',
    phone: '',
    address: '',
    cityzip: '',
  });

  const result = useMemo(() => match(quiz, { coffees, archetypes }), [quiz]);
  const orderUrl = useMemo(() => buildOrderUrl(result, form), [result, form]);
  const mailtoUrl = useMemo(() => buildMailto(result, form), [result, form]);

  const formValid =
    form.weight &&
    form.quantity > 0 &&
    form.name.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.cityzip.trim();

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="recap">
      <h2 className="recap__title">Récapitulatif de ta commande</h2>
      <p className="recap__subtitle">
        Vérifie ta commande, complète tes informations, puis règle directement par carte sur notre boutique.
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

      <section className="recap__block recap__form">
        <p className="recap__eyebrow">Tes informations</p>

        <label className="recap__field">
          <span>Poids souhaité</span>
          <div className="recap__weights">
            {WEIGHTS.map(w => (
              <button
                key={w}
                type="button"
                className={`bubble bubble--small ${form.weight === w ? 'bubble--selected' : ''}`}
                onClick={() => updateField('weight', w)}
                aria-pressed={form.weight === w}
              >
                {w}
              </button>
            ))}
          </div>
        </label>

        <label className="recap__field">
          <span>Quantité</span>
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => updateField('quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="recap__input"
          />
        </label>

        <label className="recap__field">
          <span>Nom et prénom</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="recap__input"
            autoComplete="name"
          />
        </label>

        <label className="recap__field">
          <span>Téléphone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="recap__input"
            autoComplete="tel"
          />
        </label>

        <label className="recap__field">
          <span>Adresse de livraison</span>
          <textarea
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="recap__input recap__input--textarea"
            rows="2"
            autoComplete="street-address"
          />
        </label>

        <label className="recap__field">
          <span>Code postal & ville</span>
          <input
            type="text"
            value={form.cityzip}
            onChange={(e) => updateField('cityzip', e.target.value)}
            className="recap__input"
            autoComplete="postal-code"
          />
        </label>
      </section>

      <div className="recap__actions">
        <a
          className={`cta ${!formValid ? 'cta--disabled' : ''}`}
          href={formValid ? orderUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!formValid}
          onClick={(e) => { if (!formValid) e.preventDefault(); }}
        >
          Commander & payer
        </a>
        <a
          className={`cta cta--secondary ${!formValid ? 'cta--disabled' : ''}`}
          href={formValid ? mailtoUrl : undefined}
          aria-disabled={!formValid}
          onClick={(e) => { if (!formValid) e.preventDefault(); }}
        >
          Envoyer par email
        </a>
        <button type="button" className="cta cta--secondary" onClick={onBack}>
          ← Modifier
        </button>
      </div>

      {!formValid && (
        <p className="recap__hint recap__hint--warn">
          Complète tous les champs ci-dessus pour activer la commande.
        </p>
      )}

      <p className="recap__hint">
        « Commander & payer » t'amène sur notre boutique pour régler par carte ; la composition de ton blend nous est transmise automatiquement.
        <br /><br />
        Si tu préfères passer par email, « Envoyer par email » ouvre ton application mail avec toutes les informations pré-remplies.
      </p>
    </div>
  );
}
