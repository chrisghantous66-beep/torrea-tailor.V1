# PWA & Offline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer Torrea Dial-In en PWA installable sur Android/iOS/Desktop avec mode offline transparent via vite-plugin-pwa.

**Architecture:** vite-plugin-pwa génère automatiquement le manifest et un service worker Workbox au build. Le SW intercepte tous les assets statiques avec une stratégie CacheFirst — l'app se charge entièrement depuis le cache après la première visite. L'enregistrement du SW se fait dans main.jsx via le module virtuel `virtual:pwa-register`.

**Tech Stack:** vite-plugin-pwa 0.21+, Workbox (inclus), sharp 0.33+ (génération icônes), React 18, Vite 5

---

## Fichiers touchés

| Fichier | Action |
|---|---|
| `package.json` | Ajouter vite-plugin-pwa + sharp en devDependencies |
| `vite.config.js` | Ajouter plugin VitePWA avec config manifest + Workbox |
| `public/icons/logo-source.png` | Créé manuellement par l'utilisateur (logo Torrea) |
| `public/icons/icon-192.png` | Généré par scripts/generate-icons.js |
| `public/icons/icon-512.png` | Généré par scripts/generate-icons.js |
| `scripts/generate-icons.js` | Nouveau script Node one-shot |
| `src/main.jsx` | Ajouter import registerSW |
| `index.html` | Ajouter apple-touch-icon + meta theme-color corrigé |

---

## Task 1 : Installer les dépendances

**Files:**
- Modify: `package.json`

- [ ] **Step 1 : Installer vite-plugin-pwa et sharp**

```bash
cd "V7 (UX PWA Arch)"
npm install -D vite-plugin-pwa sharp
```

Expected output : `added X packages` sans erreur.

- [ ] **Step 2 : Vérifier package.json**

`devDependencies` doit contenir :
```json
"vite-plugin-pwa": "^0.21.0",
"sharp": "^0.33.0"
```

- [ ] **Step 3 : Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add vite-plugin-pwa and sharp for PWA support"
```

---

## Task 2 : Placer le logo source

**Files:**
- Create: `public/icons/logo-source.png` (action manuelle utilisateur)

- [ ] **Step 1 : Créer le dossier**

```bash
mkdir -p public/icons
```

- [ ] **Step 2 : Copier le logo**

Sauvegarder le logo Torrea PNG (cercle vert, fond blanc) dans :
```
public/icons/logo-source.png
```

Le fichier doit exister avant de continuer. Vérifier :
```bash
ls public/icons/logo-source.png
```
Expected: le fichier est présent.

---

## Task 3 : Générer les icônes

**Files:**
- Create: `scripts/generate-icons.js`
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`

- [ ] **Step 1 : Créer le script de génération**

Créer `scripts/generate-icons.js` :

```js
import sharp from 'sharp'
import { existsSync } from 'fs'

const src = 'public/icons/logo-source.png'

if (!existsSync(src)) {
  console.error('logo-source.png introuvable dans public/icons/')
  process.exit(1)
}

await sharp(src).resize(192, 192).toFile('public/icons/icon-192.png')
console.log('icon-192.png généré')

await sharp(src).resize(512, 512).toFile('public/icons/icon-512.png')
console.log('icon-512.png généré')
```

- [ ] **Step 2 : Lancer le script**

```bash
node scripts/generate-icons.js
```

Expected output :
```
icon-192.png généré
icon-512.png généré
```

- [ ] **Step 3 : Vérifier les fichiers**

```bash
ls -la public/icons/
```

Expected : `icon-192.png` et `icon-512.png` présents, tailles > 0.

- [ ] **Step 4 : Commit**

```bash
git add scripts/generate-icons.js public/icons/icon-192.png public/icons/icon-512.png public/icons/logo-source.png
git commit -m "feat: add PWA icons from Torrea logo"
```

---

## Task 4 : Configurer vite-plugin-pwa

**Files:**
- Modify: `vite.config.js`

- [ ] **Step 1 : Remplacer vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: []
      },
      manifest: {
        name: 'Torrea Dial-In',
        short_name: 'Torrea',
        description: 'Calibration d\'extraction café — dial-in micrométrique',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a2e1a',
        theme_color: '#1a2e1a',
        orientation: 'portrait',
        lang: 'fr',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
```

- [ ] **Step 2 : Commit**

```bash
git add vite.config.js
git commit -m "feat: configure vite-plugin-pwa with Workbox CacheFirst strategy"
```

---

## Task 5 : Enregistrer le service worker

**Files:**
- Modify: `src/main.jsx`

- [ ] **Step 1 : Lire main.jsx**

```bash
cat src/main.jsx
```

- [ ] **Step 2 : Ajouter l'import registerSW**

Ajouter en haut de `src/main.jsx`, après les imports existants :

```js
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })
```

Le fichier complet doit ressembler à :

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'

registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3 : Commit**

```bash
git add src/main.jsx
git commit -m "feat: register PWA service worker on app start"
```

---

## Task 6 : Mettre à jour index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1 : Remplacer index.html**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#1a2e1a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Torrea Dial-In" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />
    <title>Torrea — Dial-In</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #1a2e1a; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2 : Commit**

```bash
git add index.html
git commit -m "feat: add apple-touch-icon and PWA meta tags to index.html"
```

---

## Task 7 : Build et vérification

**Files:** aucun fichier modifié — vérification uniquement.

- [ ] **Step 1 : Build de production**

```bash
npm run build
```

Expected : build sans erreur. Le dossier `dist/` doit contenir `sw.js` et `manifest.webmanifest`.

```bash
ls dist/sw.js dist/manifest.webmanifest
```

- [ ] **Step 2 : Prévisualiser**

```bash
npm run preview
```

Ouvrir `http://localhost:4173` dans Chrome.

- [ ] **Step 3 : Vérifier le manifest dans Chrome DevTools**

Chrome DevTools → Application → Manifest

Vérifier :
- Name : "Torrea Dial-In"
- Icons : 192×192 et 512×512 visibles
- Display : standalone
- Theme color : #1a2e1a

- [ ] **Step 4 : Vérifier le service worker**

Chrome DevTools → Application → Service Workers

Vérifier : SW actif (`sw.js`), status "activated and running".

- [ ] **Step 5 : Vérifier l'installabilité**

Chrome : icône d'installation dans la barre d'adresse (⊕ ou écran d'ordinateur avec flèche).

Si l'icône est présente → PWA installable. Cliquer pour installer et vérifier l'icône Torrea sur le bureau.

- [ ] **Step 6 : Vérifier le mode offline**

Chrome DevTools → Application → Service Workers → cocher "Offline".

Recharger la page. L'app doit se charger normalement depuis le cache.

- [ ] **Step 7 : Commit final**

```bash
git add -A
git commit -m "feat: PWA complete — installable + offline transparent"
```
