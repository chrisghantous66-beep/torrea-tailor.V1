# Torrea Tailor V1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire la webapp Torrea Tailor V1 (Phase 1) — un quiz interactif en boutons-bulles qui recommande à chaque visiteur un blend personnalisé (réellement produit à la commande) ou un café existant, avec storytelling et profil-archétype nommé.

**Architecture:** SPA React 18 + Vite, 100% frontend statique, données en JSON versionnés. Moteur de matching hybride : 10 archétypes hand-curated + scoring algorithmique pour les alternatives. Déploiement Vercel statique. Phase 1 = redirection vers le site Torrea pour la commande.

**Tech Stack:** React 18, Vite 5, Vitest (tests unitaires), CSS plain, Vercel.

**Spec source:** [`../specs/2026-04-28-torrea-tailor-design.md`](../specs/2026-04-28-torrea-tailor-design.md)

---

## File structure

```
torrea-tailor/V1/
├── package.json
├── vite.config.js
├── vitest.config.js
├── index.html
├── public/
│   └── img/
│       ├── archetypes/      (10 illustrations — placeholders en dev)
│       └── methods/         (5 icônes SVG)
├── src/
│   ├── main.jsx                       (point d'entrée React)
│   ├── App.jsx                        (état global du quiz + routing interne)
│   ├── data/
│   │   ├── coffees.json               (catalogue 6 cafés)
│   │   ├── archetypes.json            (10 archétypes + recettes)
│   │   └── brewing_methods.json       (5 modes d'extraction)
│   ├── lib/
│   │   ├── matching.js                (moteur scoring + sélection)
│   │   └── storage.js                 (sessionStorage helpers)
│   ├── components/
│   │   ├── Welcome.jsx                (écran d'accueil)
│   │   ├── BubbleQuestion.jsx         (composant question réutilisable)
│   │   ├── ProgressBar.jsx            (barre de progression)
│   │   ├── DeepenPrompt.jsx           (« Voir résultat / Aller plus loin »)
│   │   └── Result/
│   │       ├── Result.jsx             (page résultat globale)
│   │       ├── ArchetypeCard.jsx      (carte archétype)
│   │       ├── BlendComposition.jsx   (composition du blend)
│   │       └── Alternatives.jsx       (cafés alternatifs)
│   ├── styles/
│   │   ├── global.css                 (reset + variables CSS)
│   │   └── components.css             (styles composants)
│   └── tests/
│       └── matching.test.js           (tests moteur de matching)
```

**Découpage en 14 tâches** :
- A. Bootstrap (1-3) — projet, données, helper storage
- B. Moteur (4-7) — TDD du matching
- C. UI (8-12) — composants + assemblage
- D. Polish & deploy (13-14) — styling/a11y, Vercel

---

## Task 1: Initialiser le projet Vite + React + Vitest

**Files:**
- Create: `c:/Users/chris/torrea-tailor/V1/package.json`
- Create: `c:/Users/chris/torrea-tailor/V1/vite.config.js`
- Create: `c:/Users/chris/torrea-tailor/V1/vitest.config.js`
- Create: `c:/Users/chris/torrea-tailor/V1/index.html`
- Create: `c:/Users/chris/torrea-tailor/V1/src/main.jsx`
- Create: `c:/Users/chris/torrea-tailor/V1/src/App.jsx`
- Create: `c:/Users/chris/torrea-tailor/V1/.gitignore`

- [ ] **Step 1: Initialiser un repo git à la racine de torrea-tailor (si pas déjà fait)**

```bash
cd c:/Users/chris/torrea-tailor
git init
git add superpowers/
git commit -m "docs: spec et plan torrea-tailor V1"
```

- [ ] **Step 2: Créer `V1/package.json`**

```json
{
  "name": "torrea-tailor-v1",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.1",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3: Créer `V1/vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
});
```

- [ ] **Step 4: Créer `V1/vitest.config.js`**

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.js'],
  },
});
```

- [ ] **Step 5: Créer `V1/index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#5C3A21" />
    <title>Torrea Tailor — Trouve ton café idéal</title>
  </head>
  <body>
    <noscript>Active JavaScript pour utiliser cet outil.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Créer `V1/src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 7: Créer `V1/src/App.jsx` (squelette minimal)**

```jsx
export default function App() {
  return <div>Torrea Tailor — squelette OK</div>;
}
```

- [ ] **Step 8: Créer `V1/src/styles/global.css` (placeholder)**

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; }
```

- [ ] **Step 9: Créer `V1/.gitignore`**

```
node_modules
dist
.env
.env.local
.DS_Store
*.log
```

- [ ] **Step 10: Installer les dépendances et lancer le dev server pour vérifier**

```bash
cd c:/Users/chris/torrea-tailor/V1
npm install
npm run dev
```

Expected: serveur Vite démarre sur http://localhost:5173, page affiche « Torrea Tailor — squelette OK ».

- [ ] **Step 11: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/
git commit -m "feat: scaffold Vite + React + Vitest pour torrea-tailor V1"
```

---

## Task 2: Créer les fichiers JSON de données

**Files:**
- Create: `V1/src/data/coffees.json`
- Create: `V1/src/data/brewing_methods.json`
- Create: `V1/src/data/archetypes.json`

Les profils chiffrés des cafés et le contenu textuel des archétypes sont des **valeurs seed** plausibles. **Chris validera/corrigera dans un atelier dédié** — la structure est figée, le contenu peut évoluer sans modifier le code.

- [ ] **Step 1: Créer `V1/src/data/coffees.json` avec les 6 cafés**

```json
[
  {
    "id": "capucas",
    "name": "Capucas",
    "origin": "Honduras",
    "grade": "Grand Cru",
    "tasting_notes": ["chocolat", "caramel", "réglisse"],
    "profile": { "intensity": 4, "acidity": 2, "body": 4, "sweetness": 4 },
    "default_roast": "medium",
    "flavor_tags": ["gourmand", "chocolate", "reconfortant"],
    "best_for": ["espresso", "moka", "filtre"],
    "short_story": "Un Honduras grand cru aux notes profondes de chocolat et caramel."
  },
  {
    "id": "el_palomar",
    "name": "El Palomar",
    "origin": "Pérou",
    "grade": "84 SCA",
    "tasting_notes": ["fruits secs", "agrumes"],
    "profile": { "intensity": 3, "acidity": 4, "body": 3, "sweetness": 3 },
    "default_roast": "medium",
    "flavor_tags": ["vif", "fruite"],
    "best_for": ["filtre", "aeropress"],
    "short_story": "Un Pérou éclatant, entre fruits secs et fraîcheur d'agrumes."
  },
  {
    "id": "el_triunfo",
    "name": "El Triunfo",
    "origin": "Mexique",
    "grade": "84 SCA",
    "tasting_notes": ["chocolat"],
    "profile": { "intensity": 3, "acidity": 3, "body": 3, "sweetness": 3 },
    "default_roast": "medium",
    "flavor_tags": ["gourmand", "equilibre", "accessible"],
    "best_for": ["espresso", "moka", "filtre", "piston"],
    "short_story": "Un Mexique chocolaté et accessible, parfait pour découvrir le café de spécialité."
  },
  {
    "id": "palanda",
    "name": "Palanda",
    "origin": "Équateur",
    "grade": "Grand Cru",
    "tasting_notes": ["chocolat", "caramel", "miel", "malt"],
    "profile": { "intensity": 4, "acidity": 2, "body": 5, "sweetness": 5 },
    "default_roast": "medium",
    "flavor_tags": ["gourmand", "chocolate", "rond"],
    "best_for": ["espresso", "moka"],
    "short_story": "Un Équateur grand cru, dense et miellé, à la rondeur exceptionnelle."
  },
  {
    "id": "kitche",
    "name": "Kitché",
    "origin": "Guatemala",
    "grade": "84 SCA",
    "tasting_notes": ["fruits secs", "floral"],
    "profile": { "intensity": 3, "acidity": 4, "body": 3, "sweetness": 3 },
    "default_roast": "light",
    "flavor_tags": ["complexe", "floral"],
    "best_for": ["filtre", "aeropress"],
    "short_story": "Un Guatemala complexe, aux notes florales et de fruits secs."
  },
  {
    "id": "salomon",
    "name": "Salomon",
    "origin": "Éthiopie",
    "grade": "84 SCA",
    "tasting_notes": ["caramel", "chocolat", "citron", "pêche"],
    "profile": { "intensity": 3, "acidity": 4, "body": 3, "sweetness": 4 },
    "default_roast": "medium",
    "flavor_tags": ["vif", "fruite", "complexe"],
    "best_for": ["filtre", "aeropress", "espresso"],
    "short_story": "Une Éthiopie expressive, du citron à la pêche, avec une douceur de caramel."
  }
]
```

- [ ] **Step 2: Créer `V1/src/data/brewing_methods.json` (5 modes)**

```json
[
  {
    "id": "espresso",
    "name": "Espresso",
    "icon": "/img/methods/espresso.svg",
    "short_description": "Court et intense, machine à percolation."
  },
  {
    "id": "filtre",
    "name": "Filtre / V60",
    "icon": "/img/methods/filtre.svg",
    "short_description": "Méthode douce et aromatique, idéale pour les profils fruités."
  },
  {
    "id": "moka",
    "name": "Cafetière italienne",
    "icon": "/img/methods/moka.svg",
    "short_description": "Le café corsé du quotidien, intermédiaire entre filtre et espresso."
  },
  {
    "id": "aeropress",
    "name": "Aeropress",
    "icon": "/img/methods/aeropress.svg",
    "short_description": "Polyvalente, met en valeur clarté et corps."
  },
  {
    "id": "piston",
    "name": "Piston (French Press)",
    "icon": "/img/methods/piston.svg",
    "short_description": "Texture pleine, immersion longue, profil rond."
  }
]
```

- [ ] **Step 3: Créer `V1/src/data/archetypes.json` (10 archétypes seed)**

```json
[
  {
    "id": "aventurier_chocolate",
    "name": "L'Aventurier Chocolaté",
    "tagline": "Énergie franche, profondeur gourmande.",
    "description": "Tu commences ta journée comme on lance une expédition : tu veux de la matière, du chocolat, du caractère.",
    "illustration": "/img/archetypes/aventurier-chocolate.png",
    "accent_color": "#5C3A21",
    "match_tags": {
      "moment": ["matin", "focus"],
      "profil": ["gourmand-chocolate"],
      "intensity": ["corse"],
      "roast": ["medium", "dark"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "capucas", "percentage": 60}, {"coffee_id": "palanda", "percentage": 30}, {"coffee_id": "el_triunfo", "percentage": 10}],
      "filtre":    [{"coffee_id": "capucas", "percentage": 50}, {"coffee_id": "palanda", "percentage": 30}, {"coffee_id": "el_triunfo", "percentage": 20}],
      "moka":      [{"coffee_id": "capucas", "percentage": 60}, {"coffee_id": "palanda", "percentage": 40}],
      "aeropress": [{"coffee_id": "capucas", "percentage": 50}, {"coffee_id": "palanda", "percentage": 30}, {"coffee_id": "el_triunfo", "percentage": 20}],
      "piston":    [{"coffee_id": "capucas", "percentage": 50}, {"coffee_id": "palanda", "percentage": 50}]
    },
    "blend_story": "Capucas pour la base chocolatée et structurée, Palanda pour la rondeur miellée, El Triunfo pour adoucir l'ensemble.",
    "alternatives_hint": ["capucas", "palanda"]
  },
  {
    "id": "gourmand_reconfort",
    "name": "Le Gourmand Réconfort",
    "tagline": "Une pause cocoon, douce et chaleureuse.",
    "description": "Tu cherches le café qui réconforte : chocolat, caramel, miel, sans agressivité.",
    "illustration": "/img/archetypes/gourmand-reconfort.png",
    "accent_color": "#7A5230",
    "match_tags": {
      "moment": ["apres-midi"],
      "profil": ["gourmand-chocolate"],
      "intensity": ["equilibre"],
      "roast": ["medium"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "palanda", "percentage": 60}, {"coffee_id": "el_triunfo", "percentage": 40}],
      "filtre":    [{"coffee_id": "palanda", "percentage": 50}, {"coffee_id": "el_triunfo", "percentage": 50}],
      "moka":      [{"coffee_id": "palanda", "percentage": 60}, {"coffee_id": "el_triunfo", "percentage": 40}],
      "aeropress": [{"coffee_id": "palanda", "percentage": 50}, {"coffee_id": "el_triunfo", "percentage": 50}],
      "piston":    [{"coffee_id": "palanda", "percentage": 60}, {"coffee_id": "el_triunfo", "percentage": 40}]
    },
    "blend_story": "Palanda apporte la rondeur miellée, El Triunfo l'accessibilité chocolatée. Un duo doux et confortable.",
    "alternatives_hint": ["palanda", "el_triunfo"]
  },
  {
    "id": "soir_chocolate_doux",
    "name": "Le Velours du Soir",
    "tagline": "Le chocolat sans agitation.",
    "description": "Tu veux un café gourmand mais qui ne te tienne pas éveillé. Doux, profond, apaisant.",
    "illustration": "/img/archetypes/soir-chocolate-doux.png",
    "accent_color": "#3E2A1A",
    "match_tags": {
      "moment": ["soir"],
      "profil": ["gourmand-chocolate"],
      "intensity": ["doux"],
      "roast": ["medium"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "el_triunfo", "percentage": 70}, {"coffee_id": "palanda", "percentage": 30}],
      "filtre":    [{"coffee_id": "el_triunfo", "percentage": 70}, {"coffee_id": "palanda", "percentage": 30}],
      "moka":      [{"coffee_id": "el_triunfo", "percentage": 60}, {"coffee_id": "palanda", "percentage": 40}],
      "aeropress": [{"coffee_id": "el_triunfo", "percentage": 70}, {"coffee_id": "palanda", "percentage": 30}],
      "piston":    [{"coffee_id": "el_triunfo", "percentage": 60}, {"coffee_id": "palanda", "percentage": 40}]
    },
    "blend_story": "El Triunfo en majorité pour la douceur, Palanda pour une rondeur soyeuse. Un café du soir chocolaté sans excès.",
    "alternatives_hint": ["el_triunfo", "palanda"]
  },
  {
    "id": "matin_vif",
    "name": "Le Matin Vif",
    "tagline": "Réveil net, fruits et fraîcheur.",
    "description": "Tu démarres avec de l'éclat : agrumes, fruits secs, une acidité qui ouvre la journée.",
    "illustration": "/img/archetypes/matin-vif.png",
    "accent_color": "#C97B3F",
    "match_tags": {
      "moment": ["matin"],
      "profil": ["vif-fruite"],
      "intensity": ["equilibre"],
      "roast": ["light", "medium"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "salomon", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}],
      "filtre":    [{"coffee_id": "salomon", "percentage": 50}, {"coffee_id": "el_palomar", "percentage": 50}],
      "moka":      [{"coffee_id": "salomon", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}],
      "aeropress": [{"coffee_id": "salomon", "percentage": 50}, {"coffee_id": "el_palomar", "percentage": 50}],
      "piston":    [{"coffee_id": "salomon", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}]
    },
    "blend_story": "Salomon apporte les notes vives de citron et pêche, El Palomar la structure de fruits secs.",
    "alternatives_hint": ["salomon", "el_palomar"]
  },
  {
    "id": "apresmidi_solaire",
    "name": "L'Après-midi Solaire",
    "tagline": "Légèreté fruitée, douceur ensoleillée.",
    "description": "Une pause fruitée et lumineuse, sans intensité, juste pour le plaisir.",
    "illustration": "/img/archetypes/apresmidi-solaire.png",
    "accent_color": "#E8A45C",
    "match_tags": {
      "moment": ["apres-midi"],
      "profil": ["vif-fruite"],
      "intensity": ["doux"],
      "roast": ["light"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "salomon", "percentage": 70}, {"coffee_id": "el_triunfo", "percentage": 30}],
      "filtre":    [{"coffee_id": "salomon", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}],
      "moka":      [{"coffee_id": "salomon", "percentage": 70}, {"coffee_id": "el_triunfo", "percentage": 30}],
      "aeropress": [{"coffee_id": "salomon", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}],
      "piston":    [{"coffee_id": "salomon", "percentage": 70}, {"coffee_id": "el_triunfo", "percentage": 30}]
    },
    "blend_story": "Salomon en vedette pour ses fruits, complété par une note adoucissante. Une pause solaire.",
    "alternatives_hint": ["salomon", "el_palomar"]
  },
  {
    "id": "focus_intense",
    "name": "Le Focus Intense",
    "tagline": "Concentration soutenue, café qui tient.",
    "description": "Tu as besoin d'un café qui te porte sur la durée : intense, structurant, sans détour.",
    "illustration": "/img/archetypes/focus-intense.png",
    "accent_color": "#2E1810",
    "match_tags": {
      "moment": ["focus"],
      "profil": ["gourmand-chocolate", "vif-fruite"],
      "intensity": ["corse"],
      "roast": ["medium", "dark"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "capucas", "percentage": 50}, {"coffee_id": "palanda", "percentage": 30}, {"coffee_id": "salomon", "percentage": 20}],
      "filtre":    [{"coffee_id": "capucas", "percentage": 50}, {"coffee_id": "salomon", "percentage": 30}, {"coffee_id": "el_palomar", "percentage": 20}],
      "moka":      [{"coffee_id": "capucas", "percentage": 60}, {"coffee_id": "palanda", "percentage": 40}],
      "aeropress": [{"coffee_id": "capucas", "percentage": 50}, {"coffee_id": "salomon", "percentage": 30}, {"coffee_id": "el_palomar", "percentage": 20}],
      "piston":    [{"coffee_id": "capucas", "percentage": 60}, {"coffee_id": "palanda", "percentage": 40}]
    },
    "blend_story": "Capucas pour la structure, Palanda pour la rondeur, Salomon pour l'éveil. Un trio qui tient la durée.",
    "alternatives_hint": ["capucas", "palanda"]
  },
  {
    "id": "explorateur_floral",
    "name": "L'Explorateur Floral",
    "tagline": "Complexité, élégance, finesse florale.",
    "description": "Tu veux un café qui se découvre par couches : fleurs, fruits, complexité aromatique.",
    "illustration": "/img/archetypes/explorateur-floral.png",
    "accent_color": "#6B7E5A",
    "match_tags": {
      "moment": ["matin", "apres-midi"],
      "profil": ["complexe-floral"],
      "intensity": ["equilibre"],
      "roast": ["light"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "kitche", "percentage": 60}, {"coffee_id": "salomon", "percentage": 40}],
      "filtre":    [{"coffee_id": "kitche", "percentage": 70}, {"coffee_id": "salomon", "percentage": 30}],
      "moka":      [{"coffee_id": "kitche", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}],
      "aeropress": [{"coffee_id": "kitche", "percentage": 70}, {"coffee_id": "salomon", "percentage": 30}],
      "piston":    [{"coffee_id": "kitche", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}]
    },
    "blend_story": "Kitché en vedette pour sa complexité florale, Salomon pour ajouter une note fruitée.",
    "alternatives_hint": ["kitche", "salomon"]
  },
  {
    "id": "soir_floral_doux",
    "name": "Le Soir Floral",
    "tagline": "Subtil, délicat, presque thé.",
    "description": "Une fin de journée tout en finesse, fleurs et clarté, sans poids.",
    "illustration": "/img/archetypes/soir-floral-doux.png",
    "accent_color": "#A8B59C",
    "match_tags": {
      "moment": ["soir"],
      "profil": ["complexe-floral", "vif-fruite"],
      "intensity": ["doux"],
      "roast": ["light"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "kitche", "percentage": 60}, {"coffee_id": "el_triunfo", "percentage": 40}],
      "filtre":    [{"coffee_id": "kitche", "percentage": 70}, {"coffee_id": "el_palomar", "percentage": 30}],
      "moka":      [{"coffee_id": "kitche", "percentage": 60}, {"coffee_id": "el_triunfo", "percentage": 40}],
      "aeropress": [{"coffee_id": "kitche", "percentage": 70}, {"coffee_id": "el_palomar", "percentage": 30}],
      "piston":    [{"coffee_id": "kitche", "percentage": 60}, {"coffee_id": "el_triunfo", "percentage": 40}]
    },
    "blend_story": "Kitché pour la finesse florale, complété pour adoucir la tasse en fin de journée.",
    "alternatives_hint": ["kitche", "el_palomar"]
  },
  {
    "id": "focus_clarte",
    "name": "Le Focus Clarté",
    "tagline": "Esprit clair, café précis.",
    "description": "Tu veux un café net, précis, qui ne distrait pas mais qui éveille.",
    "illustration": "/img/archetypes/focus-clarte.png",
    "accent_color": "#4A6B5E",
    "match_tags": {
      "moment": ["focus"],
      "profil": ["complexe-floral"],
      "intensity": ["equilibre"],
      "roast": ["light", "medium"]
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "kitche", "percentage": 50}, {"coffee_id": "el_palomar", "percentage": 50}],
      "filtre":    [{"coffee_id": "kitche", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}],
      "moka":      [{"coffee_id": "kitche", "percentage": 50}, {"coffee_id": "el_palomar", "percentage": 50}],
      "aeropress": [{"coffee_id": "kitche", "percentage": 60}, {"coffee_id": "el_palomar", "percentage": 40}],
      "piston":    [{"coffee_id": "kitche", "percentage": 50}, {"coffee_id": "el_palomar", "percentage": 50}]
    },
    "blend_story": "Kitché et El Palomar à parts égales : un duo précis, fruits secs et clarté florale.",
    "alternatives_hint": ["kitche", "el_palomar"]
  },
  {
    "id": "decouverte",
    "name": "Le Curieux",
    "tagline": "L'entrée idéale dans le café de spécialité.",
    "description": "Tu cherches un café accessible et bien tempéré, pour découvrir sans te tromper.",
    "illustration": "/img/archetypes/decouverte.png",
    "accent_color": "#8B6F47",
    "match_tags": {
      "moment": [],
      "profil": [],
      "intensity": [],
      "roast": []
    },
    "blend_recipes": {
      "espresso":  [{"coffee_id": "el_triunfo", "percentage": 60}, {"coffee_id": "palanda", "percentage": 40}],
      "filtre":    [{"coffee_id": "el_triunfo", "percentage": 60}, {"coffee_id": "salomon", "percentage": 40}],
      "moka":      [{"coffee_id": "el_triunfo", "percentage": 70}, {"coffee_id": "palanda", "percentage": 30}],
      "aeropress": [{"coffee_id": "el_triunfo", "percentage": 60}, {"coffee_id": "salomon", "percentage": 40}],
      "piston":    [{"coffee_id": "el_triunfo", "percentage": 70}, {"coffee_id": "palanda", "percentage": 30}]
    },
    "blend_story": "El Triunfo comme base accessible, complété pour donner du caractère.",
    "alternatives_hint": ["el_triunfo", "capucas"]
  }
]
```

- [ ] **Step 4: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/data/
git commit -m "feat: ajouter données seed (cafés, méthodes, archétypes)"
```

---

## Task 3: Helper sessionStorage

**Files:**
- Create: `V1/src/lib/storage.js`
- Create: `V1/src/tests/storage.test.js`

- [ ] **Step 1: Écrire le test (storage.test.js)**

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { saveQuizState, loadQuizState, clearQuizState } from '../lib/storage.js';

const mockStorage = (() => {
  let store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

beforeEach(() => {
  globalThis.sessionStorage = mockStorage;
  mockStorage.clear();
});

describe('storage', () => {
  it('sauvegarde et restaure un état', () => {
    saveQuizState({ moment: 'matin' });
    expect(loadQuizState()).toEqual({ moment: 'matin' });
  });

  it('retourne null si rien n\'est stocké', () => {
    expect(loadQuizState()).toBeNull();
  });

  it('efface l\'état', () => {
    saveQuizState({ moment: 'matin' });
    clearQuizState();
    expect(loadQuizState()).toBeNull();
  });

  it('retourne null si JSON corrompu', () => {
    sessionStorage.setItem('torrea_tailor_quiz', '{invalid');
    expect(loadQuizState()).toBeNull();
  });
});
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

```bash
cd c:/Users/chris/torrea-tailor/V1
npm test -- --run storage
```

Expected: FAIL — module `storage.js` n'existe pas.

- [ ] **Step 3: Implémenter `V1/src/lib/storage.js`**

```js
const KEY = 'torrea_tailor_quiz';

export function saveQuizState(state) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // sessionStorage indisponible ou plein → silencieux, pas critique
  }
}

export function loadQuizState() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearQuizState() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // silencieux
  }
}
```

- [ ] **Step 4: Lancer le test pour vérifier qu'il passe**

```bash
npm test -- --run storage
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/lib/storage.js V1/src/tests/storage.test.js
git commit -m "feat: helper sessionStorage pour persistence du quiz"
```

---

## Task 4: Moteur de matching — scoring des archétypes

**Files:**
- Create: `V1/src/lib/matching.js`
- Create: `V1/src/tests/matching.test.js`

- [ ] **Step 1: Écrire les premiers tests (matching.test.js — partie scoring)**

```js
import { describe, it, expect } from 'vitest';
import archetypes from '../data/archetypes.json';
import { scoreArchetype } from '../lib/matching.js';

const aventurier = archetypes.find(a => a.id === 'aventurier_chocolate');

describe('scoreArchetype', () => {
  it('score plein sur match parfait des 4 axes obligatoires', () => {
    const quiz = {
      moment: 'matin',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
      roast_level: 'dark',
    };
    expect(scoreArchetype(aventurier, quiz)).toBe(10); // 3+3+2+2
  });

  it('score 0 si aucun axe ne matche', () => {
    const quiz = {
      moment: 'soir',
      profil_gustatif: 'complexe-floral',
      intensity: 'doux',
      roast_level: 'light',
    };
    expect(scoreArchetype(aventurier, quiz)).toBe(0);
  });

  it('ajoute des bonus pour les questions optionnelles', () => {
    const quiz = {
      moment: 'matin',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
      roast_level: 'dark',
      notes_specifiques: ['chocolat'],
      acidite_toleree: 'faible',
      experience_level: 'amateur',
    };
    expect(scoreArchetype(aventurier, quiz)).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 2: Lancer les tests pour vérifier qu'ils échouent**

```bash
npm test -- --run matching
```

Expected: FAIL — `scoreArchetype` non défini.

- [ ] **Step 3: Implémenter `scoreArchetype` dans `V1/src/lib/matching.js`**

```js
export function scoreArchetype(archetype, quiz) {
  let score = 0;
  const tags = archetype.match_tags;

  // Axes obligatoires
  if (tags.moment.includes(quiz.moment)) score += 3;
  if (tags.profil.includes(quiz.profil_gustatif)) score += 3;
  if (tags.intensity.includes(quiz.intensity)) score += 2;
  if (tags.roast?.includes(quiz.roast_level)) score += 2;

  // Bonus optionnels (si réponses présentes ET tags définis sur archétype)
  if (quiz.notes_specifiques?.length && hasNoteOverlap(archetype, quiz.notes_specifiques)) {
    score += 1;
  }
  if (quiz.acidite_toleree && matchesAcidity(archetype, quiz.acidite_toleree)) {
    score += 1;
  }
  if (quiz.experience_level && matchesExperience(archetype, quiz.experience_level)) {
    score += 1;
  }

  return score;
}

function hasNoteOverlap(archetype, userNotes) {
  // Bonus si les notes du quiz sont cohérentes avec l'archétype.
  // Heuristique simple : les archétypes "chocolate" matchent les notes chocolat/caramel,
  // les "fruite" matchent agrumes/fruits, etc.
  const profil = archetype.match_tags.profil[0] || '';
  const choc = ['chocolat', 'caramel', 'noisette'];
  const fruit = ['agrumes', 'fruits secs', 'pêche', 'citron', 'fruits rouges'];
  const floral = ['floral', 'fleur'];

  if (profil.includes('chocolate') && userNotes.some(n => choc.includes(n))) return true;
  if (profil.includes('fruite') && userNotes.some(n => fruit.includes(n))) return true;
  if (profil.includes('floral') && userNotes.some(n => floral.includes(n))) return true;
  return false;
}

function matchesAcidity(archetype, acidite) {
  const profil = archetype.match_tags.profil[0] || '';
  if (acidite === 'faible' && profil.includes('chocolate')) return true;
  if (acidite === 'moyenne') return true;
  if (acidite === 'haute' && (profil.includes('fruite') || profil.includes('floral'))) return true;
  return false;
}

function matchesExperience(archetype, level) {
  // Heuristique : débutants → archétypes accessibles, connaisseurs → archétypes complexes
  if (level === 'debutant' && archetype.id === 'decouverte') return true;
  if (level === 'connaisseur' && archetype.match_tags.profil.includes('complexe-floral')) return true;
  if (level === 'amateur') return true;
  return false;
}
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

```bash
npm test -- --run matching
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/lib/matching.js V1/src/tests/matching.test.js
git commit -m "feat: moteur matching — scoring des archétypes"
```

---

## Task 5: Moteur de matching — sélection + tie-break + fallback

**Files:**
- Modify: `V1/src/lib/matching.js`
- Modify: `V1/src/tests/matching.test.js`

- [ ] **Step 1: Ajouter les tests de sélection (en append à matching.test.js)**

```js
import { selectArchetype } from '../lib/matching.js';

describe('selectArchetype', () => {
  it('retourne l\'archétype au meilleur score', () => {
    const quiz = {
      moment: 'matin',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
      roast_level: 'dark',
    };
    const result = selectArchetype(archetypes, quiz);
    expect(result.id).toBe('aventurier_chocolate');
  });

  it('fallback sur "decouverte" si aucun score >= seuil', () => {
    const quiz = {
      moment: 'jamais',
      profil_gustatif: 'inexistant',
      intensity: 'inconnu',
      roast_level: 'inconnu',
    };
    const result = selectArchetype(archetypes, quiz);
    expect(result.id).toBe('decouverte');
  });

  it('départage par les 4 axes obligatoires en cas d\'égalité', () => {
    const quiz = {
      moment: 'soir',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'doux',
      roast_level: 'medium',
    };
    const result = selectArchetype(archetypes, quiz);
    expect(result.id).toBe('soir_chocolate_doux');
  });
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
npm test -- --run matching
```

Expected: FAIL — `selectArchetype` non défini.

- [ ] **Step 3: Implémenter `selectArchetype` dans matching.js**

```js
const FLOOR_SCORE = 3;
const FALLBACK_ID = 'decouverte';

export function selectArchetype(archetypes, quiz) {
  const scored = archetypes
    .filter(a => a.id !== FALLBACK_ID)
    .map(a => ({ archetype: a, score: scoreArchetype(a, quiz) }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Tie-break : plus de matches sur les 4 axes obligatoires
    const aMandatory = mandatoryMatchCount(a.archetype, quiz);
    const bMandatory = mandatoryMatchCount(b.archetype, quiz);
    if (bMandatory !== aMandatory) return bMandatory - aMandatory;
    // Fallback : ordre alphabétique d'id (déterministe)
    return a.archetype.id.localeCompare(b.archetype.id);
  });

  const winner = scored[0];
  if (!winner || winner.score < FLOOR_SCORE) {
    return archetypes.find(a => a.id === FALLBACK_ID);
  }
  return winner.archetype;
}

function mandatoryMatchCount(archetype, quiz) {
  let count = 0;
  if (archetype.match_tags.moment.includes(quiz.moment)) count++;
  if (archetype.match_tags.profil.includes(quiz.profil_gustatif)) count++;
  if (archetype.match_tags.intensity.includes(quiz.intensity)) count++;
  if (archetype.match_tags.roast?.includes(quiz.roast_level)) count++;
  return count;
}
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
npm test -- --run matching
```

Expected: PASS, tous les tests (scoring + selection).

- [ ] **Step 5: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/lib/matching.js V1/src/tests/matching.test.js
git commit -m "feat: sélection d'archétype avec tie-break et fallback"
```

---

## Task 6: Moteur — alternatives en cafés simples

**Files:**
- Modify: `V1/src/lib/matching.js`
- Modify: `V1/src/tests/matching.test.js`

- [ ] **Step 1: Ajouter les tests d'alternatives**

```js
import coffees from '../data/coffees.json';
import { computeAlternatives } from '../lib/matching.js';

describe('computeAlternatives', () => {
  it('retourne 2 cafés ranking-déterminé', () => {
    const quiz = {
      brewing_method: 'espresso',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
    };
    const blendComposition = [{ coffee_id: 'capucas', percentage: 60 }];
    const alts = computeAlternatives(coffees, quiz, blendComposition);
    expect(alts).toHaveLength(2);
    expect(alts[0].coffee.id).not.toBe('capucas'); // exclu car >50% du blend
  });

  it('exclut un café déjà majoritaire dans le blend', () => {
    const quiz = {
      brewing_method: 'espresso',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
    };
    const blendComposition = [{ coffee_id: 'capucas', percentage: 60 }];
    const alts = computeAlternatives(coffees, quiz, blendComposition);
    expect(alts.every(a => a.coffee.id !== 'capucas')).toBe(true);
  });
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
npm test -- --run matching
```

Expected: FAIL — `computeAlternatives` non défini.

- [ ] **Step 3: Implémenter `computeAlternatives` dans matching.js**

```js
export function computeAlternatives(coffees, quiz, blendComposition) {
  const majorityIds = blendComposition
    .filter(c => c.percentage > 50)
    .map(c => c.coffee_id);

  const scored = coffees
    .filter(c => !majorityIds.includes(c.id))
    .map(c => ({ coffee: c, score: scoreCoffeeAlt(c, quiz) }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 2).map(({ coffee }) => ({
    coffee,
    reason: buildAltReason(coffee, quiz),
  }));
}

function scoreCoffeeAlt(coffee, quiz) {
  let s = 0;
  s += 2 * matchIntensityScore(coffee.profile.intensity, quiz.intensity);
  s += 2 * matchProfilScore(coffee.flavor_tags, quiz.profil_gustatif);
  s += 1 * matchBrewingScore(coffee.best_for, quiz.brewing_method);
  s += 1 * matchNotesScore(coffee.tasting_notes, quiz.notes_specifiques);
  return s;
}

function matchIntensityScore(coffeeIntensity, userIntensity) {
  const ranges = {
    doux: [1, 2],
    equilibre: [2, 4],
    corse: [4, 5],
  };
  const [min, max] = ranges[userIntensity] || [1, 5];
  return coffeeIntensity >= min && coffeeIntensity <= max ? 1 : 0;
}

function matchProfilScore(flavorTags, profil) {
  const profilToTags = {
    'gourmand-chocolate': ['gourmand', 'chocolate', 'reconfortant', 'rond'],
    'vif-fruite': ['vif', 'fruite'],
    'complexe-floral': ['complexe', 'floral'],
  };
  const targetTags = profilToTags[profil] || [];
  return flavorTags.some(t => targetTags.includes(t)) ? 1 : 0;
}

function matchBrewingScore(bestFor, brewingMethod) {
  if (!brewingMethod) return 0.5;
  return bestFor.includes(brewingMethod) ? 1 : 0.5;
}

function matchNotesScore(tastingNotes, userNotes) {
  if (!userNotes?.length) return 0;
  const overlap = tastingNotes.filter(n => userNotes.includes(n)).length;
  return Math.min(overlap * 0.5, 1);
}

function buildAltReason(coffee, quiz) {
  const tags = coffee.flavor_tags.slice(0, 2).join(' et ');
  return `${coffee.name} (${coffee.origin}) — ${tags}, en café pur.`;
}
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
npm test -- --run matching
```

Expected: PASS, tous les tests.

- [ ] **Step 5: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/lib/matching.js V1/src/tests/matching.test.js
git commit -m "feat: calcul des alternatives en cafés simples"
```

---

## Task 7: Moteur — fonction principale `match()` + validation des recettes

**Files:**
- Modify: `V1/src/lib/matching.js`
- Modify: `V1/src/tests/matching.test.js`

- [ ] **Step 1: Ajouter les tests d'intégration**

```js
import { match, validateRecipes } from '../lib/matching.js';

describe('match (intégration)', () => {
  it('retourne archetype + blend + alternatives + roast_level', () => {
    const quiz = {
      brewing_method: 'espresso',
      moment: 'matin',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
      roast_level: 'dark',
    };
    const result = match(quiz, { coffees, archetypes });

    expect(result.archetype.id).toBe('aventurier_chocolate');
    expect(result.blend.method).toBe('espresso');
    expect(result.blend.roast_level).toBe('dark');
    expect(result.blend.composition.length).toBeGreaterThan(0);
    expect(result.blend.composition.reduce((a, c) => a + c.percentage, 0)).toBe(100);
    expect(result.alternatives).toHaveLength(2);
  });

  it('fallback sur recette espresso si la recette du mode est absente', () => {
    const fakeArch = {
      ...archetypes[0],
      blend_recipes: { espresso: archetypes[0].blend_recipes.espresso },
    };
    const quiz = {
      brewing_method: 'aeropress',
      moment: 'matin',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
      roast_level: 'dark',
    };
    const result = match(quiz, { coffees, archetypes: [fakeArch, archetypes.find(a => a.id === 'decouverte')] });
    expect(result.blend.composition).toEqual(fakeArch.blend_recipes.espresso.map(r => ({
      coffee: expect.any(Object),
      percentage: r.percentage,
    })));
  });
});

describe('validateRecipes', () => {
  it('toutes les recettes des archétypes seed somment à 100%', () => {
    const errors = validateRecipes(archetypes);
    expect(errors).toEqual([]);
  });

  it('toutes les recettes référencent des coffee_id existants', () => {
    const validIds = new Set(coffees.map(c => c.id));
    archetypes.forEach(a => {
      Object.values(a.blend_recipes).forEach(recipe => {
        recipe.forEach(item => {
          expect(validIds.has(item.coffee_id)).toBe(true);
        });
      });
    });
  });
});
```

- [ ] **Step 2: Vérifier que les tests échouent**

```bash
npm test -- --run matching
```

Expected: FAIL — `match` et `validateRecipes` non définis.

- [ ] **Step 3: Implémenter `match` et `validateRecipes` dans matching.js**

```js
export function match(quiz, { coffees, archetypes }) {
  const archetype = selectArchetype(archetypes, quiz);
  const recipe = archetype.blend_recipes[quiz.brewing_method]
              || archetype.blend_recipes.espresso;

  if (!archetype.blend_recipes[quiz.brewing_method]) {
    console.warn(`Recipe absente pour ${archetype.id}/${quiz.brewing_method}, fallback sur espresso`);
  }

  const composition = recipe.map(item => ({
    coffee: coffees.find(c => c.id === item.coffee_id),
    percentage: item.percentage,
  }));

  const alternatives = computeAlternatives(coffees, quiz, recipe);

  return {
    archetype,
    blend: {
      method: quiz.brewing_method,
      roast_level: quiz.roast_level,
      composition,
      story: archetype.blend_story,
    },
    alternatives,
  };
}

export function validateRecipes(archetypes) {
  const errors = [];
  archetypes.forEach(a => {
    Object.entries(a.blend_recipes).forEach(([method, recipe]) => {
      const sum = recipe.reduce((acc, r) => acc + r.percentage, 0);
      if (sum !== 100) {
        errors.push(`${a.id}/${method}: somme = ${sum}, attendu 100`);
      }
    });
  });
  return errors;
}
```

- [ ] **Step 4: Vérifier que les tests passent**

```bash
npm test
```

Expected: PASS, tous les tests du moteur (~10 tests).

- [ ] **Step 5: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/lib/matching.js V1/src/tests/matching.test.js
git commit -m "feat: fonction match() principale + validation des recettes"
```

---

## Task 8: Composant `BubbleQuestion` (le composant UI le plus réutilisé)

**Files:**
- Create: `V1/src/components/BubbleQuestion.jsx`
- Create: `V1/src/styles/components.css`

- [ ] **Step 1: Créer `V1/src/components/BubbleQuestion.jsx`**

```jsx
export default function BubbleQuestion({ question, options, value, onChange, multi = false }) {
  const handleClick = (optId) => {
    if (multi) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(optId)
        ? current.filter(o => o !== optId)
        : [...current, optId];
      onChange(next);
    } else {
      onChange(optId);
    }
  };

  const isSelected = (optId) => {
    if (multi) return Array.isArray(value) && value.includes(optId);
    return value === optId;
  };

  return (
    <div className="bubble-question">
      <h2 className="bubble-question__title">{question}</h2>
      <div className="bubble-question__options">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            className={`bubble ${isSelected(opt.id) ? 'bubble--selected' : ''}`}
            onClick={() => handleClick(opt.id)}
            aria-pressed={isSelected(opt.id)}
            aria-label={`${opt.label}, ${question}`}
          >
            {opt.icon && <span className="bubble__icon">{opt.icon}</span>}
            <span className="bubble__label">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Créer `V1/src/styles/components.css` avec les styles initiaux des bulles**

```css
:root {
  --color-primary: #5C3A21;
  --color-bg: #FAF6F1;
  --color-text: #2E1810;
  --color-bubble-bg: #FFFFFF;
  --color-bubble-border: #D4C5B0;
  --color-bubble-selected: #5C3A21;
  --radius-bubble: 9999px;
  --transition: 200ms ease;
}

.bubble-question {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem;
  max-width: 720px;
  margin: 0 auto;
}

.bubble-question__title {
  font-size: clamp(1.25rem, 4vw, 2rem);
  text-align: center;
  color: var(--color-text);
  font-weight: 500;
}

.bubble-question__options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}

.bubble {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  background: var(--color-bubble-bg);
  border: 2px solid var(--color-bubble-border);
  border-radius: var(--radius-bubble);
  color: var(--color-text);
  font-size: 1rem;
  cursor: pointer;
  transition: transform var(--transition), background var(--transition), color var(--transition), border-color var(--transition);
}

.bubble:hover { transform: translateY(-2px); border-color: var(--color-primary); }
.bubble--selected {
  background: var(--color-bubble-selected);
  border-color: var(--color-bubble-selected);
  color: white;
}

@media (prefers-reduced-motion: reduce) {
  .bubble { transition: none; }
  .bubble:hover { transform: none; }
}
```

- [ ] **Step 3: Importer le CSS dans main.jsx**

Modifier `V1/src/main.jsx` pour ajouter (après le import de global.css) :

```jsx
import './styles/components.css';
```

- [ ] **Step 4: Tester manuellement dans App.jsx (provisoire)**

Modifier `V1/src/App.jsx` :

```jsx
import { useState } from 'react';
import BubbleQuestion from './components/BubbleQuestion.jsx';

export default function App() {
  const [moment, setMoment] = useState(null);
  return (
    <BubbleQuestion
      question="Quand vas-tu le boire ?"
      options={[
        { id: 'matin', label: 'Matin énergie' },
        { id: 'apres-midi', label: 'Après-midi pause' },
        { id: 'soir', label: 'Soir détente' },
        { id: 'focus', label: 'Concentration / focus' },
      ]}
      value={moment}
      onChange={setMoment}
    />
  );
}
```

Lancer `npm run dev` et vérifier visuellement que les bulles apparaissent, sont cliquables, et changent d'état au clic.

- [ ] **Step 5: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/components/BubbleQuestion.jsx V1/src/styles/components.css V1/src/main.jsx V1/src/App.jsx
git commit -m "feat: composant BubbleQuestion + styles bulles"
```

---

## Task 9: ProgressBar + Welcome screen + structure routing dans App.jsx

**Files:**
- Create: `V1/src/components/ProgressBar.jsx`
- Create: `V1/src/components/Welcome.jsx`
- Modify: `V1/src/App.jsx`
- Modify: `V1/src/styles/components.css`

- [ ] **Step 1: Créer `V1/src/components/ProgressBar.jsx`**

```jsx
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
```

- [ ] **Step 2: Créer `V1/src/components/Welcome.jsx`**

```jsx
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
```

- [ ] **Step 3: Ajouter les styles dans components.css (append)**

```css
.progress {
  width: 100%;
  max-width: 720px;
  margin: 0 auto 1rem;
  padding: 0 1rem;
}
.progress__label {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.6;
  margin-bottom: 0.4rem;
  text-align: center;
}
.progress__bar {
  height: 4px;
  background: var(--color-bubble-border);
  border-radius: 2px;
  overflow: hidden;
}
.progress__fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 300ms ease;
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  padding: 2rem 1rem;
  gap: 1.5rem;
}
.welcome__title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  color: var(--color-primary);
  font-weight: 500;
  max-width: 600px;
}
.welcome__subtitle {
  font-size: 1.125rem;
  color: var(--color-text);
  opacity: 0.75;
  max-width: 500px;
}

.cta {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition);
}
.cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(92, 58, 33, 0.25);
}
@media (prefers-reduced-motion: reduce) { .cta { transition: none; } .cta:hover { transform: none; } }
```

- [ ] **Step 4: Réécrire `V1/src/App.jsx` avec un système de steps**

```jsx
import { useState, useEffect } from 'react';
import Welcome from './components/Welcome.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import { saveQuizState, loadQuizState, clearQuizState } from './lib/storage.js';

const STEPS = ['welcome', 'q0', 'q1', 'q2', 'q3', 'q4', 'deepen', 'q5', 'q6', 'q7', 'q8', 'result'];
const TOTAL_MANDATORY = 5; // Q0..Q4

export default function App() {
  const [step, setStep] = useState('welcome');
  const [quiz, setQuiz] = useState({});

  useEffect(() => {
    const saved = loadQuizState();
    if (saved?.step && saved?.quiz) {
      setStep(saved.step);
      setQuiz(saved.quiz);
    }
  }, []);

  useEffect(() => {
    if (step !== 'welcome') saveQuizState({ step, quiz });
  }, [step, quiz]);

  const update = (key, value, nextStep) => {
    setQuiz(q => ({ ...q, [key]: value }));
    setStep(nextStep);
  };

  const restart = () => {
    clearQuizState();
    setQuiz({});
    setStep('welcome');
  };

  const stepIndex = STEPS.indexOf(step);
  const showProgress = stepIndex >= 1 && stepIndex <= 5;

  return (
    <main>
      {showProgress && (
        <ProgressBar current={stepIndex} total={TOTAL_MANDATORY} />
      )}

      {step === 'welcome' && <Welcome onStart={() => setStep('q0')} />}

      {/* TODO: les écrans Q0..Q8 et Result seront ajoutés dans les tâches suivantes */}
      {step !== 'welcome' && (
        <div style={{padding:'2rem', textAlign:'center'}}>
          <p>Étape : {step}</p>
          <pre>{JSON.stringify(quiz, null, 2)}</pre>
          <button onClick={restart}>Recommencer</button>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 5: Lancer `npm run dev` et vérifier**

Expected : page d'accueil affiche « Trouvons ton café idéal », bouton « Commencer » → passe à un écran « Étape : q0 » avec le state vide. Le refresh préserve le step et le state.

- [ ] **Step 6: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/
git commit -m "feat: Welcome + ProgressBar + structure de steps avec persistence"
```

---

## Task 10: Quiz mandatoire — écrans Q0 à Q4

**Files:**
- Modify: `V1/src/App.jsx`

- [ ] **Step 1: Ajouter les définitions de questions et leurs options en haut de App.jsx (après les imports)**

```jsx
import BubbleQuestion from './components/BubbleQuestion.jsx';

const QUESTIONS = {
  q0: {
    key: 'brewing_method',
    question: 'Comment prépares-tu ton café ?',
    next: 'q1',
    options: [
      { id: 'espresso', label: 'Espresso' },
      { id: 'filtre', label: 'V60 / Filtre' },
      { id: 'moka', label: 'Cafetière italienne' },
      { id: 'aeropress', label: 'Aeropress' },
      { id: 'piston', label: 'Piston' },
    ],
  },
  q1: {
    key: 'moment',
    question: 'Quand vas-tu le boire ?',
    next: 'q2',
    options: [
      { id: 'matin', label: 'Matin énergie' },
      { id: 'apres-midi', label: 'Après-midi pause' },
      { id: 'soir', label: 'Soir détente' },
      { id: 'focus', label: 'Concentration / focus' },
    ],
  },
  q2: {
    key: 'profil_gustatif',
    question: 'Profil gustatif global ?',
    next: 'q3',
    options: [
      { id: 'gourmand-chocolate', label: 'Gourmand & chocolaté' },
      { id: 'vif-fruite', label: 'Vif & fruité' },
      { id: 'complexe-floral', label: 'Complexe & floral' },
    ],
  },
  q3: {
    key: 'intensity',
    question: 'Intensité ?',
    next: 'q4',
    options: [
      { id: 'doux', label: 'Doux' },
      { id: 'equilibre', label: 'Équilibré' },
      { id: 'corse', label: 'Corsé' },
    ],
  },
  q4: {
    key: 'roast_level',
    question: 'Niveau de torréfaction ?',
    next: 'deepen',
    options: [
      { id: 'light', label: 'Light — Vif, fruité, floral' },
      { id: 'medium', label: 'Medium — Équilibré, polyvalent' },
      { id: 'dark', label: 'Dark — Corsé, chocolaté' },
    ],
  },
};
```

- [ ] **Step 2: Remplacer le bloc « TODO » dans App.jsx par le rendu des questions**

```jsx
{['q0','q1','q2','q3','q4'].includes(step) && (() => {
  const q = QUESTIONS[step];
  return (
    <BubbleQuestion
      question={q.question}
      options={q.options}
      value={quiz[q.key]}
      onChange={(val) => update(q.key, val, q.next)}
    />
  );
})()}

{step === 'deepen' && (
  <div style={{padding:'2rem', textAlign:'center'}}>
    <p>(Deepen prompt — à implémenter)</p>
    <button onClick={() => setStep('result')}>Voir le résultat</button>
  </div>
)}

{step === 'result' && (
  <div style={{padding:'2rem', textAlign:'center'}}>
    <p>(Result page — à implémenter)</p>
    <pre>{JSON.stringify(quiz, null, 2)}</pre>
    <button onClick={restart}>Recommencer</button>
  </div>
)}
```

- [ ] **Step 3: Tester manuellement**

Lancer `npm run dev` et passer le quiz : welcome → Q0 (espresso) → Q1 (matin) → Q2 (gourmand) → Q3 (corsé) → Q4 (medium) → écran « deepen » → bouton « Voir le résultat ».

- [ ] **Step 4: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/App.jsx
git commit -m "feat: écrans Q0-Q4 (quiz obligatoire incl. torréfaction)"
```

---

## Task 11: DeepenPrompt + questions optionnelles Q5-Q8

**Files:**
- Create: `V1/src/components/DeepenPrompt.jsx`
- Modify: `V1/src/App.jsx`
- Modify: `V1/src/styles/components.css`

- [ ] **Step 1: Créer `V1/src/components/DeepenPrompt.jsx`**

```jsx
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
```

- [ ] **Step 2: Ajouter les styles dans components.css (append)**

```css
.deepen {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}
.deepen__title { font-size: 1.5rem; color: var(--color-primary); }
.deepen__hint { color: var(--color-text); opacity: 0.75; }
.deepen__actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem; }
.cta--secondary { background: transparent; color: var(--color-primary); border: 2px solid var(--color-primary); }
.cta--secondary:hover { background: var(--color-primary); color: white; }
```

- [ ] **Step 3: Ajouter les définitions Q4-Q7 dans QUESTIONS de App.jsx**

```jsx
const QUESTIONS = {
  // ... q0-q4 existantes
  q5: {
    key: 'notes_specifiques',
    question: 'Des notes que tu adores ? (optionnel, plusieurs choix)',
    next: 'q6',
    multi: true,
    options: [
      { id: 'chocolat', label: 'Chocolat' },
      { id: 'caramel', label: 'Caramel' },
      { id: 'agrumes', label: 'Agrumes' },
      { id: 'fruits secs', label: 'Fruits secs' },
      { id: 'floral', label: 'Floral' },
      { id: 'pêche', label: 'Pêche' },
    ],
  },
  q6: {
    key: 'experience_level',
    question: 'Ton niveau avec le café ?',
    next: 'q7',
    options: [
      { id: 'debutant', label: 'Débutant' },
      { id: 'amateur', label: 'Amateur' },
      { id: 'connaisseur', label: 'Connaisseur' },
    ],
  },
  q7: {
    key: 'acidite_toleree',
    question: 'Tu aimes l\'acidité ?',
    next: 'q8',
    options: [
      { id: 'faible', label: 'Pas trop' },
      { id: 'moyenne', label: 'Modérée' },
      { id: 'haute', label: 'Beaucoup' },
    ],
  },
  q8: {
    key: 'consommation',
    question: 'Combien de cafés par jour ?',
    next: 'result',
    options: [
      { id: '1-2', label: '1-2' },
      { id: '3-4', label: '3-4' },
      { id: '5+', label: '5 et plus' },
    ],
  },
};
```

- [ ] **Step 4: Remplacer le bloc deepen et étendre la liste des questions affichables dans App.jsx**

```jsx
{['q0','q1','q2','q3','q4','q5','q6','q7','q8'].includes(step) && (() => {
  const q = QUESTIONS[step];
  return (
    <BubbleQuestion
      question={q.question}
      options={q.options}
      value={quiz[q.key]}
      onChange={(val) => {
        if (q.multi) {
          // Pour multi-select, on attend un bouton "Suivant"
          setQuiz(prev => ({ ...prev, [q.key]: val }));
        } else {
          update(q.key, val, q.next);
        }
      }}
      multi={q.multi}
    />
  );
})()}

{step === 'q5' && quiz.notes_specifiques && (
  <div style={{textAlign:'center', marginTop:'1rem'}}>
    <button className="cta" onClick={() => setStep(QUESTIONS.q5.next)}>Suivant</button>
  </div>
)}

{step === 'deepen' && (
  <DeepenPrompt
    onShow={() => setStep('result')}
    onDeepen={() => setStep('q5')}
  />
)}
```

Importer `DeepenPrompt` en haut.

- [ ] **Step 5: Tester manuellement le parcours complet**

Lancer `npm run dev`. Tester deux parcours :
1. Court : Welcome → Q0-Q4 → Deepen → « Voir le résultat » → écran result placeholder
2. Long : Welcome → Q0-Q4 → Deepen → « Aller plus loin » → Q5 (multi-select chocolat+caramel + bouton Suivant) → Q6-Q8 → écran result placeholder

- [ ] **Step 6: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/
git commit -m "feat: DeepenPrompt + questions optionnelles Q5-Q8"
```

---

## Task 12: Page Résultat — composants + intégration moteur

**Files:**
- Create: `V1/src/components/Result/Result.jsx`
- Create: `V1/src/components/Result/ArchetypeCard.jsx`
- Create: `V1/src/components/Result/BlendComposition.jsx`
- Create: `V1/src/components/Result/Alternatives.jsx`
- Modify: `V1/src/App.jsx`
- Modify: `V1/src/styles/components.css`

- [ ] **Step 1: Créer `V1/src/components/Result/ArchetypeCard.jsx`**

```jsx
export default function ArchetypeCard({ archetype }) {
  return (
    <section className="archetype-card" style={{ '--accent': archetype.accent_color }}>
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
        />
      )}
      <p className="archetype-card__description">{archetype.description}</p>
    </section>
  );
}
```

- [ ] **Step 2: Créer `V1/src/components/Result/BlendComposition.jsx`**

```jsx
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
```

- [ ] **Step 3: Créer `V1/src/components/Result/Alternatives.jsx`**

```jsx
export default function Alternatives({ alternatives }) {
  if (!alternatives?.length) return null;
  return (
    <section className="alternatives">
      <h3 className="alternatives__title">Ou si tu préfères un café pur</h3>
      <ul className="alternatives__list">
        {alternatives.map(({ coffee, reason }) => (
          <li key={coffee.id} className="alternatives__item">
            <h4 className="alternatives__name">{coffee.name}</h4>
            <p className="alternatives__origin">{coffee.origin} — {coffee.grade}</p>
            <p className="alternatives__reason">{reason}</p>
            <p className="alternatives__story">{coffee.short_story}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Créer `V1/src/components/Result/Result.jsx`**

```jsx
import { useMemo } from 'react';
import ArchetypeCard from './ArchetypeCard.jsx';
import BlendComposition from './BlendComposition.jsx';
import Alternatives from './Alternatives.jsx';
import coffees from '../../data/coffees.json';
import archetypes from '../../data/archetypes.json';
import { match } from '../../lib/matching.js';

export default function Result({ quiz, onRestart }) {
  const result = useMemo(() => match(quiz, { coffees, archetypes }), [quiz]);

  return (
    <div className="result">
      <ArchetypeCard archetype={result.archetype} />
      <BlendComposition blend={result.blend} />
      <Alternatives alternatives={result.alternatives} />
      <div className="result__footer">
        <button type="button" className="cta cta--secondary" onClick={onRestart}>
          Recommencer
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Ajouter les styles dans components.css (append)**

```css
.result {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.archetype-card {
  background: var(--accent, var(--color-primary));
  color: white;
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  text-align: center;
}
.archetype-card__eyebrow { opacity: 0.7; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; }
.archetype-card__name { font-size: clamp(1.75rem, 5vw, 2.5rem); margin: 0.5rem 0; }
.archetype-card__tagline { font-style: italic; opacity: 0.9; margin-bottom: 1.5rem; }
.archetype-card__illustration { max-width: 200px; margin: 1rem auto; display: block; }
.archetype-card__description { line-height: 1.6; opacity: 0.95; }

.blend { background: white; border: 1px solid var(--color-bubble-border); border-radius: 1.25rem; padding: 2rem; text-align: center; }
.blend__title { color: var(--color-primary); margin-bottom: 0.5rem; }
.blend__roast { color: var(--color-text); opacity: 0.7; font-size: 0.9rem; margin-bottom: 1.5rem; }
.blend__bar { display: flex; height: 32px; border-radius: 16px; overflow: hidden; background: var(--color-bubble-border); margin-bottom: 1rem; }
.blend__segment { background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; }
.blend__segment:nth-child(2) { background: #7A5230; }
.blend__segment:nth-child(3) { background: #A8784A; }
.blend__legend { list-style: none; padding: 0; margin: 1rem 0 1.5rem; text-align: left; }
.blend__legend li { padding: 0.5rem 0; border-bottom: 1px dashed var(--color-bubble-border); }
.blend__story { font-style: italic; color: var(--color-text); opacity: 0.85; margin-bottom: 1.5rem; }

.alternatives { background: var(--color-bg); padding: 2rem; border-radius: 1.25rem; }
.alternatives__title { color: var(--color-primary); text-align: center; margin-bottom: 1.5rem; }
.alternatives__list { list-style: none; padding: 0; display: grid; gap: 1.5rem; }
.alternatives__item { background: white; padding: 1.25rem; border-radius: 0.75rem; }
.alternatives__name { color: var(--color-primary); margin-bottom: 0.25rem; }
.alternatives__origin { font-size: 0.85rem; opacity: 0.7; margin-bottom: 0.5rem; }
.alternatives__reason { font-style: italic; margin-bottom: 0.5rem; }
.alternatives__story { color: var(--color-text); opacity: 0.85; font-size: 0.95rem; }

.result__footer { display: flex; justify-content: center; padding: 1rem; }
```

- [ ] **Step 6: Brancher Result dans App.jsx**

Remplacer le bloc placeholder `step === 'result'` par :

```jsx
{step === 'result' && (
  <Result quiz={quiz} onRestart={restart} />
)}
```

Importer `Result` en haut : `import Result from './components/Result/Result.jsx';`

- [ ] **Step 7: Tester le parcours complet manuellement**

Lancer `npm run dev`. Faire le quiz court (Q0-Q4) avec choix : espresso / matin / gourmand-chocolate / corsé / dark. Vérifier que la page résultat affiche : « L'Aventurier Chocolaté » + mention « Torréfaction dark — adaptée à la commande » + blend Capucas/Palanda/El Triunfo + 2 alternatives.

- [ ] **Step 8: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/
git commit -m "feat: page résultat avec archetype, blend et alternatives"
```

---

## Task 13: Polish — bouton retour, partage URL, accessibilité

**Files:**
- Modify: `V1/src/App.jsx`
- Modify: `V1/src/styles/components.css`

- [ ] **Step 1: Ajouter un bouton « Retour » dans App.jsx**

Au-dessus du contenu principal, ajouter une barre :

```jsx
const stepIndex = STEPS.indexOf(step);
const canGoBack = stepIndex > 1 && step !== 'result';

const goBack = () => {
  if (stepIndex > 1) {
    const prev = STEPS[stepIndex - 1];
    // Skip "deepen" en arrière (il n'a pas d'état à restaurer)
    setStep(prev === 'deepen' ? 'q4' : prev);
  }
};

// Dans le JSX, juste après <main> :
{canGoBack && (
  <button
    type="button"
    className="back-btn"
    onClick={goBack}
    aria-label="Revenir à la question précédente"
  >
    ← Retour
  </button>
)}
```

- [ ] **Step 2: Ajouter le style du bouton retour dans components.css**

```css
.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: transparent;
  border: none;
  color: var(--color-text);
  opacity: 0.7;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: background var(--transition);
}
.back-btn:hover { background: var(--color-bubble-border); opacity: 1; }
main { position: relative; min-height: 100vh; padding-top: 3rem; }
```

- [ ] **Step 3: Ajouter le partage URL stateless**

Dans App.jsx, après les imports :

```jsx
function encodeQuiz(quiz) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(quiz))));
}
function decodeQuiz(encoded) {
  try { return JSON.parse(decodeURIComponent(escape(atob(encoded)))); }
  catch { return null; }
}
```

Dans le `useEffect` initial, lire `?result=` :

```jsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get('result');
  if (shared) {
    const q = decodeQuiz(shared);
    if (q) {
      setQuiz(q);
      setStep('result');
      return;
    }
  }
  const saved = loadQuizState();
  if (saved?.step && saved?.quiz) {
    setStep(saved.step);
    setQuiz(saved.quiz);
  }
}, []);
```

Dans `Result.jsx`, ajouter un bouton « Partager » (à côté de « Recommencer ») :

```jsx
const shareUrl = useMemo(() => {
  const enc = btoa(unescape(encodeURIComponent(JSON.stringify(quiz))));
  return `${window.location.origin}${window.location.pathname}?result=${enc}`;
}, [quiz]);

const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({ url: shareUrl, title: 'Mon profil café Torrea' });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Lien copié dans le presse-papier !');
    }
  } catch {}
};

// Dans le JSX du footer :
<button type="button" className="cta cta--secondary" onClick={handleShare}>Partager mon profil</button>
```

- [ ] **Step 4: Tester manuellement**

- Faire le quiz, arriver sur résultat, copier le lien partagé, l'ouvrir dans un nouvel onglet privé → doit afficher directement le résultat sans repasser par les questions.
- Cliquer « Retour » à plusieurs étapes du quiz → vérifier qu'on remonte correctement.
- Tester la navigation clavier (Tab + Enter) sur les bulles.

- [ ] **Step 5: Commit**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/src/
git commit -m "feat: bouton retour + partage URL stateless + a11y"
```

---

## Task 14: Build de prod, déploiement Vercel, vérification finale

**Files:**
- Create: `V1/vercel.json` (optionnel, pour SPA fallback)

- [ ] **Step 1: Créer `V1/vercel.json` pour gérer le routing SPA**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Lancer `npm run build` localement**

```bash
cd c:/Users/chris/torrea-tailor/V1
npm run build
```

Expected : dossier `dist/` créé, pas d'erreur. Bundle size affiché < 200 KB gzippé idéalement.

- [ ] **Step 3: Tester le build localement avec `npm run preview`**

```bash
npm run preview
```

Faire un parcours complet dans le navigateur sur l'URL de preview.

- [ ] **Step 4: Lancer Lighthouse sur la version preview (Chrome DevTools)**

Cibles :
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 90

Si A11y < 95 : vérifier les contrastes des bulles et du bouton CTA, ajouter `lang="fr"` (déjà dans index.html), `aria-label` (déjà fait dans BubbleQuestion).

- [ ] **Step 5: Lancer la suite de tests une dernière fois**

```bash
cd c:/Users/chris/torrea-tailor/V1
npm run test:run
```

Expected : 100% des tests passent.

- [ ] **Step 6: Push sur le remote (si configuré) + déploiement Vercel**

Si pas encore connecté à Vercel :
```bash
cd c:/Users/chris/torrea-tailor/V1
npx vercel
```

Suivre les prompts (link to project, deploy preview), puis :
```bash
npx vercel --prod
```

- [ ] **Step 7: Vérification post-déploiement**

Sur l'URL Vercel de prod :
- Parcours mobile (DevTools responsive ou vrai téléphone)
- Parcours desktop
- Test du lien de partage cross-device
- Vérifier que le bouton « Le commander » ouvre bien torrea.fr en nouvel onglet

- [ ] **Step 8: Commit final + tag version**

```bash
cd c:/Users/chris/torrea-tailor
git add V1/vercel.json
git commit -m "chore: vercel config + déploiement V1.0.0"
git tag v1.0.0
```

---

## Travail de contenu post-MVP (parallèle à l'implémentation)

Ces livrables ne bloquent pas le code mais devront remplacer les seeds avant la mise en prod publique :

- [ ] Atelier avec Chris : valider/corriger les profils chiffrés des 6 cafés (intensité, acidité, body, sweetness, best_for)
- [ ] Atelier avec Chris : valider/réécrire les 10 noms d'archétypes, taglines, descriptions
- [ ] Atelier avec Chris : valider/recomposer les 50 recettes de blend (10 archétypes × 5 modes)
- [ ] Production des 10 illustrations d'archétypes (IA ou illustrateur — placeholder dans `public/img/archetypes/`)
- [ ] Production des 5 icônes de méthodes d'extraction (SVG dans `public/img/methods/`)
- [ ] Décision pricing 125g / 250g / 500g / 1000g par café et par blend (décision finale, voir Phase 2)
