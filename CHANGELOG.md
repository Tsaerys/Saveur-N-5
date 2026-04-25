# Saveur N°5 — Notes de mise à jour

Convention : chaque version correspond au numéro du cache Service Worker (`sw.js` → `CACHE_NAME`).
Format : `v<num> — AAAA-MM-JJ` · catégories 🔴 Critique · 🟠 Ergonomie · 🟡 Fonctionnalités · 🟢 A11y · 🔵 Contenu · ⚫ Technique.

---

## v23 — 2026-04-24

### 🔴 Critique
- **Carrousel Hélice** : titres latéraux désormais lisibles. Plancher d'opacité relevé à 0.78, suppression complète du flou, masquage anticipé des cartes les plus éloignées (`depth < 0.20`), fond opaque sur `.helix-card-body`.
- **Fiche recette** : suppression du « titre fantôme » qui apparaissait derrière le titre principal. Les zones `helix-zone` et `seasonal-zone` (sœurs de `<main>`, donc non couvertes par le changement de vue) sont désormais explicitement masquées dans `openRecipe()` / `setView()` et restaurées dans `goBack()`.

### 🟠 Ergonomie
- **Aide à la recherche** : nouveau bouton `?` à côté du micro vocal. Ouvre une modale avec exemples cliquables (`chef:Bocuse`, `pays:Italie`, `cat:Dessert`, `"crème brûlée"`, `-poisson`, `ing:safran`).
- **Filtres saison** : Printemps / Été / Automne / Hiver (basé sur les tags des recettes + détection mois courant).
- **Filtre chef** : dropdown dédié, alimenté par les chefs présents dans la base.
- **Fil d'Ariane** sur la fiche recette : `Recettes › <Pays> › <Catégorie> › <Titre>`. Chaque segment ramène à la liste filtrée correspondante.

### 🟡 Fonctionnalités
- **Vue Favoris** refondue :
  - Onglets « Tous » / « Notés » (`_favsMode`)
  - Barre de filtre par tag, alimentée par tous les tags utilisateur
  - Bouton 🏷 d'édition de tags par carte (modale dédiée)
  - Affichage des tags sous chaque carte
- **Vue Courses** enrichie :
  - Recherche interne dans la liste de recettes utilisée
  - Modes « Toutes » / « Favoris » / « Menu » (chips)
  - Boutons d'import « Ajouter mes favoris » et « Ajouter le menu de la semaine »
- **Filtre multi-sélection** : nouvelle modale qui permet de cumuler plusieurs pays / catégories / chefs (stockage en chaîne pipe-séparée `France|Italie` — compatible avec les dropdowns existants pour la sélection unique).
- **Transfert QR** : nouveau bouton « 📱 Transférer (QR) » dans Réglages → Sauvegarde. Génère un QR code encodant favoris + notes + tags + évaluations en base64 dans l'URL. Scanné depuis un autre appareil, les données sont importées automatiquement (`handleImportHash` appelé à l'init). Fallback texte si l'API QR externe est inaccessible. Limite ~2800 chars d'URL — au-delà, redirige vers l'export JSON classique.

### ⚫ Technique
- Bump cache SW → `saveur-n5-v23`
- `S.filters` étend `saison` et `chef`
- Nouveaux états : `FAV_TAGS` (`gft`), `_favsMode`, `_csRecFilter`
- `filtered()` accepte les chaînes pipe-séparées sur `co`/`cat`/`chef`
- Helpers saison : `_SEASON_MONTHS`, `_seasonTags()`, `_isInSeason()` avec cache mémo
- Réutilisation de `.qual-legend-overlay` / `.qual-legend-card` pour les nouvelles modales (recherche-help, multi-filter, edit-tags, QR)

---

## v22 — 2026-04-22

### 🔵 Contenu
- Notes de mise à jour complètes désormais visibles dans **Réglages → « 📋 Nouveautés »**
- Popup automatique au chargement : affiche toutes les versions non vues depuis la dernière visite (plus seulement la plus récente)
- Séparateurs visuels entre versions dans la modale

### ⚫ Technique
- `CHANGELOG.md` à la racine du projet (remplace `.github/CHANGELOG.md` obsolète)
- Helper `_sn5LogEntryHTML()` mutualisé entre auto-popup et affichage manuel
- Bump cache SW → `saveur-n5-v22`
- Convention documentée pour les futures mises à jour

---

## v21 — 2026-04-22

### 🟠 Ergonomie
- Vue **Courses** : la liste d'ingrédients consolidée passe tout en haut, sélecteur de recettes en dessous — plus besoin de scroller pour voir les ingrédients

### ⚫ Technique
- Bump cache SW → `saveur-n5-v21`

---

## v20 — 2026-04-22

### 🔴 Critique
- Carrousel « Printemps » : séparateur + marge supplémentaire, plus de chevauchement visuel
- Titres tronqués : `line-clamp` passé à 3 lignes + `word-break`, plus de coupure en plein mot
- Contraste WCAG AA : `--text3` → `#6d6250`, `--text4` → `#8a7a5e` (ratio ≥ 4.5:1 sur `--bg`)

### 🟠 Ergonomie
- Favoris / Courses : animation pop (scale + rotation), pulse du badge sur `+1`, vibration haptique sur appareils compatibles
- Recherche avancée : opérateurs `chef:`, `pays:`, `cat:`, `ing:`, `-exclusion`, `"phrase exacte"` — placeholder mis à jour avec exemples

### 🟡 Fonctionnalités
- Checkbox par étape dans la fiche recette et le mode cuisine, persistence localStorage
- Auto-cochage de l'étape courante quand on avance en mode cuisine
- Bouton `↺ Réinitialiser` les étapes faites
- Print stylesheet entièrement refait : typographie Georgia, en-tête sobre, pied de page avec source/date, 2 colonnes A4, `break-inside` géré

### 🟢 A11y
- Focus clavier global via `:focus-visible` (contour doré + offset)
- Skip link « Aller au contenu » en haut de page
- Drapeaux emoji : `aria-hidden="true"` avec `aria-label` sur le parent (« Pays : X »)
- Notes : `aria-label="Note : X sur 5"` sur les étoiles

### 🔵 Contenu
- Bannière devtools reformulée : « ✨ Saveur N°5 · Bon appétit ! »
- Échelle de qualité : modale explicative accessible via bouton `ℹ` dans les filtres (Esc / clic-fond pour fermer)

### ⚫ Technique
- Helpers centralisés (`_haptic`, `_qualTooltip`, `_popClassFav/Cart`)
- Bump cache SW → `saveur-n5-v20`

---

## v19 — 2026-04-22

### 🔵 Contenu
- **Dev mode** : ajout du paramètre `?dev=1` dans l'URL pour désactiver la protection DevTools (F12), `?dev=0` pour réactiver. Nécessaire pour récupérer les mises à jour bloquées par le cache.

### ⚫ Technique
- **Stratégie SW revue** : `index.html` passe en *Network First* — les mises à jour sont immédiates si l'appareil est en ligne
- **Bouton « 🔄 Forcer la mise à jour »** dans Réglages → Maintenance : vide tous les caches, désenregistre le SW et recharge avec cache-bust
- `skipWaiting()` sur message `SKIP_WAITING`
- Bump cache SW → `saveur-n5-v19`

---

## v18 et antérieures

### 🟡 Fonctionnalités
- Unification du builder de texte « Courses » (`opts.plain` pour AnyList/Bring vs format annoté)
- Suppression du duplicata `_fallbackCopy`
- Catégories `catOrder` synchronisées avec les valeurs réelles (`Sauce / Base`, `Accompagnement`, `Soupe`, `Entremet`, `Assaisonnement`)

### 🟢 A11y
- Helix 3D carousel, meta SEO, améliorations accessibilité

---

## Convention pour les futures mises à jour

1. Incrémenter `CACHE_NAME` dans `sw.js`
2. Ajouter un bloc en tête de ce fichier avec la nouvelle version + date
3. Classer chaque changement dans une catégorie (🔴 🟠 🟡 🟢 🔵 ⚫)
4. Refléter les changements visibles utilisateur dans `PATCH_NOTES` (`js/state.js`) pour l'affichage « Quoi de neuf »
