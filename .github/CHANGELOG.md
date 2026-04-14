## Changelog — Saveur N°5

### Non publié

- **js/logic.js**: ajout validation `RECIPES`, détection doublons, merge incrémental, `checkState`, recherche accent-insensible et mémoïsation de `filtered()`.
- **js/state.js**: ajout des filtres `qual` et `rayon` au state.
- **js/ui.js**: filtres combinables (qualité + rayon), badge qualité, loader (>100ms) et infinite scroll (20 par 20).
- **css/style.css**: styles loader + badge qualité + media queries grid responsive.
- **sw.js**: cache versionné `saveur-n5-v14` + app shell mis à jour.
- **index.html**: ordre scripts `data.js` → `state.js` → `logic.js` → `ui.js` → `app.js`.
- **js/app.js**: orchestration (init + render + SW + hashchange).

