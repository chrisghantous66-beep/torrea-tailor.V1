# PWA & Offline — Torrea Dial-In V7

## Objectif

Transformer Torrea Dial-In en Progressive Web App installable sur Android et iOS, avec mode offline complet et transparent. L'utilisateur installe l'app depuis le navigateur et l'utilise sans connexion comme une app native.

## Stack

- **vite-plugin-pwa** (Workbox sous le capot) — génération automatique du manifest et du service worker au build
- **sharp** (Node.js) — génération des icônes PNG aux bonnes dimensions depuis le logo source

## Fichiers ajoutés / modifiés

```
V7/
├── public/
│   └── icons/
│       ├── icon-192.png        ← logo Torrea recadré 192×192
│       └── icon-512.png        ← logo Torrea recadré 512×512
├── scripts/
│   └── generate-icons.js       ← script one-shot pour générer les icônes
├── vite.config.js              ← config VitePWA ajoutée
├── src/
│   └── App.jsx                 ← ajout registerSW() au montage
└── package.json                ← ajout vite-plugin-pwa + sharp (devDependencies)
```

## Manifest

```json
{
  "name": "Torrea Dial-In",
  "short_name": "Torrea",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a2e1a",
  "theme_color": "#1a2e1a",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

## Stratégie de cache (Workbox)

- **Stratégie** : `CacheFirst` pour tous les assets statiques (JS, CSS, HTML, icônes)
- **Scope** : tous les fichiers générés par le build Vite (`/assets/**`, `index.html`)
- **Comportement** : au premier chargement, tous les assets sont mis en cache. Les visites suivantes chargent depuis le cache — aucune connexion requise.
- **localStorage** : inchangé, fonctionne nativement offline.

## Mise à jour automatique

Quand une nouvelle version est déployée sur Vercel :
1. Le service worker détecte un nouveau `sw.js` au prochain lancement de l'app
2. Le cache est mis à jour en arrière-plan
3. L'app recharge silencieusement — aucune action requise de l'utilisateur

## Icônes

- **Source** : logo PNG fourni (cercle vert Torrea, fond blanc)
- **Tailles générées** : 192×192 et 512×512
- **Recadrage** : carré, fond blanc conservé, pas de transparence (requis pour `maskable`)
- **Script** : `node scripts/generate-icons.js` — à lancer une seule fois

## Comportement offline — transparent

Aucun indicateur visuel offline. L'app fonctionne identiquement avec ou sans connexion. Toutes les données sont dans `localStorage` — pas de sync réseau.

## Compatibilité

| Plateforme | Installation | Offline |
|---|---|---|
| Android (Chrome) | Bannière "Ajouter à l'écran d'accueil" | Oui |
| iOS (Safari) | Manuel via Partager → Sur l'écran d'accueil | Oui |
| Desktop (Chrome) | Icône installation dans la barre d'adresse | Oui |

## Hors scope

- Notifications push
- Sync en arrière-plan
- Indicateur visuel offline
- Autre méthode que vite-plugin-pwa
