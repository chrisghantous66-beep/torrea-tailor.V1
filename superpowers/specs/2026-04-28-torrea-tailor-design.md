# Torrea Tailor — Design Document

**Date :** 2026-04-28
**Version :** V1 (Phase 1)
**Repo :** `torrea-tailor/V1/`
**Auteur :** Chris (Torrea) + Claude

---

## 1. Vision & objectif

Webapp interactive intégrée au site Torrea (WooCommerce + Elementor) qui guide chaque visiteur vers le café idéal — soit un café existant de la gamme, soit un **blend personnalisé réellement produit à la commande**.

L'expérience est ludique, intuitive, en boutons-bulles tactiles, avec un format **adaptatif court-moyen** (3 questions cœur obligatoires + 4 questions optionnelles d'affinage). Le résultat n'est pas qu'un produit : c'est un **archétype nommé** avec storytelling, blend principal et 1-2 alternatives en cafés simples.

**Objectifs business :**
- Augmenter le taux de conversion sur le site
- Valoriser le savoir-faire de torréfacteur (recettes hand-curated)
- Différencier l'expérience d'achat café spé en France

**Périmètre Phase 1 :** outil de découverte pur. Le bouton « commander » redirige vers la fiche produit du site Torrea existant.

**Note importante sur la torréfaction :** chaque café Torrea a une torréfaction par défaut (Kitché → filtre/light, les 5 autres → medium). **Mais pour les commandes via Torrea Tailor, Chris torréfie à la demande dans le niveau choisi par le client.** Le quiz inclut donc une question obligatoire sur le niveau de torréfaction souhaité (light / medium / dark), et le résultat indique au client que la torréfaction sera adaptée.

**Périmètre Phase 2 (hors scope, à anticiper) :** intégration API REST WooCommerce pour pousser le blend dans le panier directement. Pricing dynamique (125g / 250g / 500g / 1000g) par café et par blend.

---

## 2. Contraintes & décisions clés

| Décision | Choix retenu | Raison |
|---|---|---|
| Stack | React 18 + Vite + Vercel statique | Cohérent avec V10.1 (`torrea-dialin`), zéro back-end |
| Données | 3 fichiers JSON versionnés | Modifiable sans toucher au code |
| Quiz | Adaptatif court-moyen (3 + 4 optionnelles) | Maximise complétion + permet l'affinage pour les engagés |
| Algo de reco | Hybride : archétypes hand-curated + scoring algorithmique pour alternatives | Préserve l'expertise du torréfacteur, garde du dynamisme |
| Output | Profil nommé + blend + 1-2 cafés alternatifs + storytelling | Différenciant, partageable, valorise le savoir-faire |
| Mode d'extraction | Question 0 (obligatoire, avant tout) | Filtre tout : un blend espresso ≠ un blend V60 |
| Identité visuelle | Cohérente avec torrea.fr (marron dominant, artisanal-premium) mais direction libre | Le site actuel sert de boussole, pas de cage |
| Mobile-first | Oui | La majorité des conversions e-commerce viennent du mobile |

---

## 3. Catalogue de cafés (entrée du système)

6 cafés de spécialité, source de toutes les recommandations et compositions de blends.

| ID | Nom | Origine | Notes principales | Grade |
|---|---|---|---|---|
| `capucas` | Capucas | Honduras | Chocolat, caramel, réglisse | Grand Cru |
| `el_palomar` | El Palomar | Pérou | Fruits secs, agrumes | 84 SCA |
| `el_triunfo` | El Triunfo | Mexique | Chocolat, accessible | 84 SCA |
| `palanda` | Palanda | Équateur | Chocolat, caramel, miel, malt | Grand Cru |
| `kitche` | Kitché | Guatemala | Complexe, fruits secs, floral | 84 SCA |
| `salomon` | Salomon | Éthiopie | Caramel, chocolat, citron, pêche | 84 SCA |

**Données manquantes à compléter ensemble (atelier dédié) :**
- Profil chiffré 1-5 par café : `intensity`, `acidity`, `body`, `sweetness`
- Modes d'extraction recommandés (`best_for`)
- Tags gustatifs synthétiques (`flavor_tags`) : ex. « gourmand », « vif », « complexe », « floral »
- Storytelling court (1-2 phrases) par café

---

## 4. Architecture technique

### 4.1 Stack

- **Framework :** React 18 + Vite
- **Déploiement :** Vercel statique (zéro backend en Phase 1)
- **Langage :** JavaScript (pas TypeScript pour rester aligné avec V10.1)
- **Style :** CSS plain ou CSS Modules (à trancher au moment du dev)
- **PWA :** optionnelle, à décider en fin de projet

### 4.2 Flux utilisateur

```
Accueil (« Trouvons ton café idéal ») → bouton « Commencer »
   ↓
Q0 — Mode d'extraction [obligatoire]
   ↓
Q1 — Moment de consommation [obligatoire]
   ↓
Q2 — Profil gustatif global [obligatoire]
   ↓
Q3 — Intensité [obligatoire]
   ↓
Q4 — Niveau de torréfaction [obligatoire]
   ↓
Choix : « Voir mon résultat » OU « Aller plus loin (+1 min) »
   ↓
[Si « Aller plus loin »] Q5-Q8 (notes spécifiques, expérience, acidité tolérée, habitude)
   ↓
Page résultat : archétype + blend principal + 2 alternatives + storytelling
   ↓
Boutons : « Le commander » (→ site Torrea) | « Recommencer » | « Partager »
```

### 4.3 Principes UX

- **Boutons-bulles tactiles** (vrais `<button>`), pas de saisie texte, pas de dropdowns
- **1 question = 1 écran**, focus total
- **1 clic = avance auto** (pas de bouton « Suivant » sur les choix uniques)
- **Barre de progression** discrète en haut
- **Bouton « Retour »** toujours visible
- **Animations douces** (~300ms) entre écrans, respectant `prefers-reduced-motion`
- **Sauvegarde sessionStorage** : refresh préserve l'état

### 4.4 Structure des fichiers

```
torrea-tailor/V1/
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── img/
│       ├── archetypes/         (10 illustrations PNG/WebP)
│       └── methods/            (5 icônes SVG)
├── src/
│   ├── main.jsx
│   ├── App.jsx                 (routing interne + état global)
│   ├── data/
│   │   ├── coffees.json
│   │   ├── archetypes.json
│   │   └── brewing_methods.json
│   ├── lib/
│   │   ├── matching.js         (moteur de scoring + sélection)
│   │   └── storage.js          (sessionStorage helpers)
│   ├── components/
│   │   ├── Welcome.jsx
│   │   ├── BubbleQuestion.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── DeepenPrompt.jsx
│   │   └── Result/
│   │       ├── Result.jsx
│   │       ├── ArchetypeCard.jsx
│   │       ├── BlendComposition.jsx
│   │       └── Alternatives.jsx
│   ├── styles/
│   │   └── *.css
│   └── tests/
│       └── matching.test.js
```

---

## 5. Modèle de données

### 5.1 `coffees.json` — schéma par café

```json
{
  "id": "capucas",
  "name": "Capucas",
  "origin": "Honduras",
  "grade": "Grand Cru",
  "tasting_notes": ["chocolat", "caramel", "réglisse"],
  "profile": {
    "intensity": 4,
    "acidity": 2,
    "body": 4,
    "sweetness": 4
  },
  "default_roast": "medium",
  "flavor_tags": ["gourmand", "chocolaté", "réconfortant"],
  "best_for": ["espresso", "moka", "filtre"],
  "short_story": "Un Honduras grand cru aux notes profondes de chocolat et caramel."
}
```

Tous les champs sont obligatoires. Profils sur échelle 1-5.

### 5.2 `archetypes.json` — schéma par archétype

```json
{
  "id": "aventurier_chocolate",
  "name": "L'Aventurier Chocolaté",
  "tagline": "Énergie franche, profondeur gourmande.",
  "description": "Tu commences ta journée comme on lance une expédition...",
  "illustration": "/img/archetypes/aventurier-chocolate.png",
  "accent_color": "#5C3A21",
  "match_tags": {
    "moment": ["matin", "focus"],
    "profil": ["gourmand-chocolate"],
    "intensity": ["equilibre", "corse"],
    "roast": ["medium", "dark"]
  },
  "blend_recipes": {
    "espresso": [
      { "coffee_id": "capucas",    "percentage": 60 },
      { "coffee_id": "palanda",    "percentage": 30 },
      { "coffee_id": "el_triunfo", "percentage": 10 }
    ],
    "filtre":    [ /* recette filtre */ ],
    "moka":      [ /* recette moka */ ],
    "aeropress": [ /* recette aeropress */ ],
    "piston":    [ /* recette piston */ ]
  },
  "blend_story": "Capucas pour la base chocolatée, Palanda pour la rondeur miellée, El Triunfo pour l'accessibilité.",
  "alternatives_hint": ["capucas", "palanda"]
}
```

10 archétypes au total. Chaque archétype contient une recette par mode d'extraction (5 modes).

**Archétype spécial `decouverte`** : fallback générique utilisé quand aucun autre archétype n'atteint le score plancher. Recette pensée pour être universellement accessible (probablement basée sur El Triunfo).

### 5.3 `brewing_methods.json` — schéma par mode

```json
{
  "id": "espresso",
  "name": "Espresso",
  "icon": "/img/methods/espresso.svg",
  "short_description": "Court et intense, machine à percolation.",
  "favors_profile": { "body": "high", "intensity": "high" }
}
```

5 modes : `espresso`, `filtre` (V60), `moka` (cafetière italienne), `aeropress`, `piston` (French Press).

### 5.4 État interne du quiz

```js
{
  brewing_method: "espresso",        // Q0
  moment: "matin",                   // Q1
  profil_gustatif: "gourmand-chocolate", // Q2
  intensity: "corse",                // Q3
  roast_level: "dark",               // Q4
  // Optionnels (si « Aller plus loin »)
  notes_specifiques: ["chocolat", "caramel"], // utilisé en scoring + storytelling
  experience_level: "amateur",                 // utilisé en scoring + storytelling
  acidite_toleree: "moyenne",                  // utilisé en scoring
  consommation: "2-3_par_jour"                 // informatif uniquement (storytelling), pas de scoring
}
```

Persisté dans `sessionStorage` à chaque réponse.

---

## 6. Moteur de matching

Module unique : `src/lib/matching.js`. Fonction principale : `match(quizState, catalog) → result`.

### 6.1 Étape 1 — Scorer chaque archétype

```
score(archétype) =  3  × match(moment)
                 +  3  × match(profil_gustatif)
                 +  2  × match(intensity)
                 +  2  × match(roast_level)
                 +  1  × bonus(notes_specifiques)
                 +  1  × bonus(acidite_toleree)
                 +  1  × bonus(experience_level)
```

Chaque `match()` vaut **1** si la réponse client est dans `archetype.match_tags[axe]`, sinon **0**.

Score max : **13** (quiz long), **10** (quiz court).

`consommation` n'apparaît pas dans le scoring : c'est une donnée purement informative qui sert à personnaliser le ton du storytelling sur la page résultat (ex. « Pour quelqu'un qui en boit 3-4 par jour, ce blend tient la durée »).

### 6.2 Étape 2 — Sélection de l'archétype gagnant

1. Score strictement le plus élevé → gagnant.
2. Égalité → tie-breaker sur les 4 axes obligatoires (moment + profil + intensity + roast uniquement).
3. Égalité persistante → ordre déterministe par `id` (alphabétique).
4. **Score plancher** : si score gagnant < 3/10, fallback sur archétype `decouverte`.

### 6.3 Étape 3 — Génération du blend

```js
const recipe = archetype.blend_recipes[user.brewing_method];
```

La recette est déjà curatée, aucun calcul. Validation runtime : si la recette manque pour le mode demandé, fallback sur `espresso` + warning console (ne devrait pas arriver, validé par tests au build).

### 6.4 Étape 4 — Calcul des 2 alternatives en cafés simples

Pour chaque café du catalogue :

```
alt_score(café) = 
    2 × match_intensity(café.profile.intensity, user.intensity)
  + 2 × match_profil(café.flavor_tags, user.profil_gustatif)
  + 1 × match_brewing(café.best_for, user.brewing_method)
  + 1 × match_notes(café.tasting_notes, user.notes_specifiques)
```

Détail des `match_*` :
- `match_intensity` : 1 si l'intensité du café est dans la fourchette demandée (doux=1-2, équilibré=2-4, corsé=4-5), sinon 0.
- `match_profil` : 1 si un des `flavor_tags` du café matche le profil choisi, sinon 0.
- `match_brewing` : 1 si le mode est dans `best_for`, 0.5 si compatible mais non-idéal.
- `match_notes` : +0.5 par note partagée, plafonné à 1.

Tri décroissant par `alt_score`. On prend les **2 meilleurs cafés qui ne sont pas déjà à >50% dans le blend principal** (évite la redondance).

### 6.5 Étape 5 — Composition du résultat retourné

```js
{
  archetype: { /* objet archétype complet */ },
  blend: {
    method: "espresso",
    composition: [
      { coffee: { ...capucas },    percentage: 60 },
      { coffee: { ...palanda },    percentage: 30 },
      { coffee: { ...el_triunfo }, percentage: 10 }
    ],
    story: "Capucas pour la base..."
  },
  alternatives: [
    { coffee: { ...capucas }, reason: "Pour la même profondeur chocolatée, en café pur." },
    { coffee: { ...palanda }, reason: "Encore plus rond, miellé." }
  ]
}
```

---

## 7. Cas limites & gestion d'erreurs

| Cas | Comportement |
|---|---|
| Refresh en plein quiz | État restauré depuis `sessionStorage` |
| Retour navigateur | Routing interne préserve l'état |
| Score archétype < seuil | Fallback `decouverte` |
| Recette absente pour un mode | Fallback `espresso` + warning console |
| JS désactivé | Message statique « Active JavaScript » |
| Bouton « Recommencer » | Reset complet + retour accueil |
| Partage du résultat | URL stateless `?result=<base64>` qui ré-encode les réponses |

---

## 8. Accessibilité & performance

### Accessibilité (cible WCAG AA)
- Boutons-bulles = vrais `<button>`, navigation clavier complète
- Contraste AA minimum sur tous les textes
- `aria-label` sur chaque bulle
- `aria-live` sur la barre de progression
- Animations désactivées si `prefers-reduced-motion`

### Performance (cibles)
- Bundle < 150 KB gzippé
- Images d'archétypes en WebP + lazy loading (~500 KB total max)
- Polices système ou self-hosted avec `font-display: swap`
- Lighthouse : Performance ≥ 90, A11y ≥ 95

---

## 9. Tests

### Tests unitaires (`matching.test.js`)
- 10 scénarios représentatifs (1 par archétype) → vérifie la sélection correcte
- Tie-breaking déterministe
- Fallback `decouverte` quand score insuffisant
- Validation : toutes les recettes somment à 100%
- Validation : tous les `coffee_id` référencés existent dans `coffees.json`

### Tests E2E (optionnel, plus tard)
- Playwright sur 2-3 parcours utilisateur

### Test manuel final
- Passer le quiz dans le navigateur, mobile + desktop, au moins 5 personas

---

## 10. Travail de contenu à produire (côté Chris)

Ces inputs créatifs sont la valeur ajoutée du projet — le code est inutile sans eux.

| Livrable | Quantité | Format |
|---|---|---|
| Profils chiffrés des 6 cafés | 6 cafés × 5 champs (intensity, acidity, body, sweetness, best_for) | Atelier ~30 min |
| Storytelling court par café (1-2 phrases) | 6 | À rédiger |
| Liste des 10 archétypes (nom + tagline + description) | 10 | Atelier 2-3h |
| Recettes de blends par archétype × mode d'extraction | 10 × 5 = 50 (mais beaucoup peuvent être communes) | Expertise pure 3-4h |
| Storytelling court par blend | 10 | À rédiger ~2h |
| Illustrations d'archétypes | 10 | Externe ou IA — à décider |
| Pricing par poids (125g/250g/500g/1000g) | par café/blend | À voir en fin de projet |

---

## 11. Phase 2 — Anticipée (hors scope actuel)

- **Pricing dynamique** : à partir des prix unitaires des cafés, calcul du prix d'un blend selon ses pourcentages, par poids (125g, 250g, 500g, 1000g). C'est ici que le pricing rejoint l'app.
- **Intégration API REST WooCommerce** : bouton « Ajouter au panier » qui crée un produit personnalisé dans le panier WooCommerce du site Torrea avec la composition du blend en métadonnées.
- **Tracking analytics** : taux de complétion, archétypes les plus fréquents (Plausible ou Vercel Analytics, sans cookies).

---

## 12. Critères de succès Phase 1

- [ ] L'utilisateur peut compléter le quiz court (5 questions obligatoires) en moins de 80s
- [ ] Le moteur de matching retourne un résultat cohérent pour chaque combinaison de réponses obligatoires
- [ ] La page résultat affiche : archétype nommé + blend + 2 alternatives + storytelling
- [ ] Le bouton « Le commander » redirige correctement vers le site Torrea
- [ ] Lighthouse Performance ≥ 90, A11y ≥ 95 sur mobile
- [ ] Les 10 archétypes sont curatés et les recettes validées par Chris
- [ ] Tests unitaires du moteur passent (couverture des 10 archétypes + edge cases)
- [ ] Déployé sur Vercel avec URL stable
