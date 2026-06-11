# PROJECT.md — Saveur N°5

> **Document de référence unique du projet.** Toute IA ou développeur reprenant ce projet doit
> lire ce fichier EN PREMIER, puis le mettre à jour (section *Journal des sessions*) à la fin
> de **chaque** session de travail. C'est un contexte obligatoire pour tout travail futur.

---

## 1. Vue d'ensemble

**Saveur N°5** est une application web de recettes gastronomiques en français, créée par
**Teva L.** (© tous droits réservés). Elle référence 836 recettes de grands chefs et de
traditions culinaires du monde entier (Ducasse, Bocuse, Robuchon, Pierre Hermé, Bottura,
Ramsay, Acurio…), avec un niveau de détail professionnel (techniques, accords vins, notes).

- **Type** : SPA 100 % statique, PWA installable, fonctionne entièrement hors-ligne.
- **URL de production** : https://tsaerys.github.io/Saveur-N-5/ (GitHub Pages).
- **Version courante** : **v36** (2026-06-10).
- **Public** : usage personnel/familial, mais le site est public et indexé.

## 2. Stack technique et déploiement

| Aspect | Choix |
|---|---|
| Langage | JavaScript vanilla (pas de framework, pas de TypeScript) |
| Build | **AUCUN** — pas de bundler, pas de npm, pas de transpilation. Les fichiers sont servis tels quels |
| Modules | **AUCUN** — balises `<script>` classiques en ordre fixe dans `index.html`, tout vit dans le namespace global |
| Hébergement | GitHub Pages (branche `main`, racine du repo) |
| Déploiement | `git push` sur `main` → publication automatique |
| Offline | Service Worker (`sw.js`) — app shell en Cache First, `index.html` en Network First |
| Persistance | `localStorage` uniquement (aucun backend, aucune base de données, aucun appel API) |
| CDN externes | jsPDF 2.5.1 (export PDF), D3.js v7 (carte du monde), Google Fonts (Cormorant Garamond + DM Sans) — **tous avec dégradation propre** si indisponibles |
| Tests | Aucun framework — `node --check` comme garde-fou syntaxique + plans de test manuels (`.github/commands/*.md`) |

## 3. Structure des fichiers

```
saveur-n5-v14/                  ← racine du repo git (le vrai "projet")
├── index.html                  Point d'entrée unique. Meta SEO/OG, script de protection
│                               anti-copie, topbar + nav, zones de rendu (#main, #filters-zone,
│                               #frigo-zone, #map-zone…), overlays (Focus, raccourcis,
│                               changelog), ordre de chargement des <script> (CRITIQUE)
├── sw.js                       Service Worker. APP_SHELL (liste exhaustive des assets à
│                               mettre en cache), CACHE_NAME versionné ('saveur-n5-vXX')
├── manifest.json               Manifest PWA (icônes, thème, mode standalone)
├── CHANGELOG.md                Notes de version lisibles par l'utilisateur (FR)
├── PROJECT.md                  CE FICHIER — contexte obligatoire
├── geo-data.json               GeoJSON du monde (252 Ko) pour la carte D3
├── favicon.ico, _redirects     Divers hébergement
├── nouvelles_recettes_300.js   ⚠️ Fichier de STAGING non chargé par l'app (reliquat v34) —
│                               recettes déjà intégrées dans js/data/. Peut être supprimé
├── css/style.css               ~2500 lignes. Tout le style : thème clair/sombre via
│                               [data-theme="dark"] + variables CSS (--gold, --surf, --bord…)
├── images/                     Icônes PWA (16→512px) + placeholder.webp
├── js/
│   ├── data.js                 Déclare `var RECIPES=[]` (conteneur global)
│   ├── data/*.js               21 fichiers pays/région — chacun fait RECIPES.push(…).
│   │                           UNE recette par ligne, PAS de backticks
│   ├── state.js                Constantes (FLAGS, CATS, COUNTRY_COLORS, RAYON_MAP, REGIME_KW,
│   │                           UNIT_CONV…) + état global S + stores localStorage (FAVS, CART,
│   │                           NOTES, RATINGS, TIMERS, USER_RECIPES…) + helpers lsGet/lsSet.
│   │                           ⚠️ AUCUNE logique métier, AUCUN DOM
│   ├── logic.js                Logique métier pure : validation, filtres (filtered() mémoïsé),
│   │                           recherche avancée, régimes, agrégation courses, génération de
│   │                           menus, export PDF/CSV/JSON. ⚠️ AUCUN accès DOM (sauf exceptions
│   │                           historiques _dlBlob/exportRecipePDF)
│   ├── reco.js                 (v36) Recommandeur Bêta : matching par ingrédients, assemblage
│   │                           par patterns, notation, persistance. ⚠️ AUCUN DOM
│   ├── ui.js                   ~2400 lignes. TOUT le rendu : setView() (routeur), grille/liste,
│   │                           fiche recette, favoris, courses, menu, réglages, création de
│   │                           recette, frigo, minuteurs, vue reco. innerHTML + handlers inline
│   ├── map.js                  Carte du monde D3 (zone #map-zone, accueil). Mapping cuisine→ISO3
│   └── app.js                  Orchestration : _SN5_VER + _SN5_LOG (changelog in-app), init(),
│                               enregistrement SW, deep-linking #recette/ID, mode Focus,
│                               sous-chef vocal, carrousel hélice 3D, effets visuels, raccourcis
├── .github/commands/*.md       Gabarits de plans de test manuels (ajout-fonctionnalite,
│                               correction-bug, refactor-safe, test-avant-commit, ui-mod,
│                               validation-data) — ⚠️ certains chiffres périmés (512 recettes)
└── .claude/settings.local.json Permissions Claude Code
```

**Ordre de chargement des scripts (ne pas casser)** :
`data.js` → les 21 `data/*.js` → `state.js` → `logic.js` → `reco.js` → `ui.js` → (D3 CDN) → `map.js` → `app.js` (qui appelle `init()` en dernière ligne).

## 4. Contraintes architecturales (extraites du code — à respecter impérativement)

1. **Zéro build, zéro module** : tout nouveau fichier JS = nouvelle balise `<script>` dans
   `index.html` (au bon endroit de la chaîne de dépendances) + entrée dans `APP_SHELL` de `sw.js`.
2. **Séparation des couches** : `state.js` (données/constantes, ni logique ni DOM) →
   `logic.js`/`reco.js` (logique pure, pas de DOM) → `ui.js` (rendu) → `app.js` (orchestration).
3. **Workflow de release obligatoire** (documenté en tête de `app.js`) :
   1. Bumper `CACHE_NAME` dans `sw.js` ;
   2. Mettre `_SN5_VER` à la même valeur dans `app.js` ;
   3. Ajouter un bloc en tête de `_SN5_LOG` (plus récent d'abord) ;
   4. Mettre à jour `CHANGELOG.md`.
4. **Schéma de recette** (positionnel, compact — une recette par ligne dans `data/*.js`) :
   ```js
   {id:"FR001", co:"France", cat:"Plat", sous:"Volaille", nom:"…", chef:"…",
    bp:4,            // portions de base
    prep:20, cui:60, // minutes
    diff:2, qual:5,  // 1-5 (difficulté, qualité de la source)
    ig:[["Nom ingrédient", 200, "g"], …],   // [nom, quantité, unité] — unité "qs" possible
    et:"1. …\n2. …", // étapes = UNE chaîne, lignes numérotées séparées par \n
    vin:"…", notes:"…",
    vars:[{nom,desc}]?, saison:""?}          // optionnels
   // Recettes utilisateur (localStorage) : + _custom:true, _regimes:[], _tags:[]
   // Recettes assemblées (v36)           : + generated:true, _tpl:"<id modèle>"
   ```
   IDs = préfixe pays + numéro zéro-paddé (FR001, IT042, U001 pour l'utilisateur, GENxxxx
   pour les recettes assemblées). **Pas de backticks dans les fichiers de données.**
5. **Catégories autorisées** (`CATS` dans state.js) : Entrée, Plat, Dessert, Sauce / Base,
   Accompagnement, Assaisonnement. Les soupes → `cat:"Plat"` ou `"Entrée"` + `sous:"Soupe"`.
6. **Dégradation propre de toute dépendance CDN** : tester `typeof X !== 'undefined'` et
   prévoir un fallback (jsPDF → `window.print()`, D3 → carte absente, app intacte).
7. **localStorage uniquement**, clés préfixées `sn5_` (récentes) ou courtes historiques
   (`gf`, `gc`, `gn`, `gr2`, `gci`, `grec`, `gsd`, `gft`). Toujours via `lsGet`/`lsSet`
   (try/catch intégré).
8. **Français partout** (UI, commentaires, changelog). Recherche insensible aux accents
   via `_sn5Norm` (NFD).
9. **Intégrité au démarrage** : `validateRecipes()` + `warnRecipeDuplicates()` (console
   warnings). Les caches mémoïsés (`_filteredMemo`, `_recipeCountsCache`) doivent être
   invalidés si on modifie `RECIPES` après l'init.
10. **Garde-fou syntaxe** : `node --check` sur chaque JS modifié avant commit.
11. **Accessibilité** : aria-labels, rôles, focus clavier, skip-link — à maintenir sur
    tout nouvel élément interactif.
12. **Protection anti-copie** (index.html) : ne pas la retirer ; mode dev via `?dev=1`.

## 5. Fonctionnalités (état au 2026-06-10, v36)

Toutes **livrées et fonctionnelles** sauf mention contraire :

- ✅ Catalogue 836 recettes, grille/liste, pagination infinie (IntersectionObserver)
- ✅ Recherche avancée : `chef:`, `pays:`, `cat:`, `ing:`, `-exclusion`, `"phrase exacte"` + recherche vocale (Web Speech)
- ✅ Filtres : pays, catégorie, difficulté, temps, qualité, rayon, saison, chef (autocomplete), multi-sélection, 5 régimes (végé, sans gluten/lactose/fruits de mer/poissons), tri
- ✅ Mode Frigo : matching par ingrédients disponibles (+ mode strict)
- ✅ **Générateur d'idées (Bêta, v36)** : voir §7
- ✅ Fiche recette : portions dynamiques, conversion d'unités (métrique/impérial/volume), étapes cochables, notes perso auto-sauvées, notation 5 étoiles, photo perso (base64), variantes, accords, préparation à l'avance, breadcrumb
- ✅ Mode Cuisine + Mode Focus (plein écran, étape par étape) + Sous-Chef Vocal (SpeechSynthesis fr-FR)
- ✅ Multi-minuteurs persistants (Web Audio, 5 sons, vibration)
- ✅ Favoris (onglets, tags personnels), Liste de courses (agrégation par rayon, copie/partage/.txt/impression), Menu de la semaine (occasions, régimes, historique 5 menus)
- ✅ Création/édition/suppression de recettes utilisateur (vue ✍️ Créer)
- ✅ Export/import de sauvegarde (JSON + QR code), export catalogue CSV/JSON, export PDF par recette (jsPDF)
- ✅ PWA offline complet, popup changelog (depuis v36 : TOUTES les versions manquées), bouton « Forcer la mise à jour »
- ✅ Thème clair/sombre, raccourcis clavier (`?` pour l'aide), carrousel hélice 3D, accueil saisonnier, carte du monde interactive (D3), deep-linking `#recette/ID`

## 6. Données recettes

- **Total : 836 recettes** réparties en 21 fichiers `js/data/*.js`.
- **28 cuisines** (`co`) : France 205, Asie 193, Italie 158, Espagne 54, Grèce 25, Maroc 24,
  Mexique 17, Scandinavie 15, Amérique du Sud 14, Afrique 13, Argentine 12, États-Unis 12,
  Moyen-Orient 12, Pérou 11, Brésil 10, Portugal 10, Tunisie 10, Éthiopie 8, Caraïbes 7,
  Cuba 5, Europe Centrale 5, Turquie 5, Allemagne 2, Hongrie 2, Liban 2, Pologne 2,
  Royaume-Uni 2, Canada 1.
- **Catégories** : Plat 467, Dessert 162, Entrée 125, Sauce / Base 38, Accompagnement 38,
  Assaisonnement 6.
- Structure : voir contrainte §4.4. Les recettes utilisateur (`U…`) et assemblées (`GEN…`)
  vivent en localStorage et sont fusionnées dans `RECIPES` à l'init
  (`initUserRecipes()` / `initRecoRecipes()`).

## 7. Générateur d'idées (Bêta) — architecture v36

Fonctionnalité **zéro coût, zéro réseau** : la base `RECIPES` est l'unique source.

1. **Matching** (`recoMatch`, js/reco.js) : score recette = ingrédients correspondants /
   ingrédients totaux (hors basiques de placard `RECO_PANTRY`) ; pertinence effective =
   `(0.6 × couverture des ingrédients utilisateur + 0.4 × score) × multiplicateur de note`.
   Seuil `RECO_THRESHOLD = 0.45`, max 6 résultats.
2. **Assemblage** (`recoAssemble`) si aucun match : choix d'un modèle compatible (priorité
   aux recettes notées 4-5 par l'utilisateur, sinon `qual:5` ; jamais une recette déjà
   assemblée), substitution des ingrédients non couverts par ceux de l'utilisateur
   (quantités = médiane des occurrences dans la base), adaptation des étapes par
   remplacement de noms, détection de méthode de cuisson (`RECO_METHODS`) pour le nom.
   ID déterministe `GEN<hash djb2>` → même saisie = même recette.
3. **Notation** (`recoRate`) : 1-5 après CHAQUE résultat ; stockée dans
   `sn5_reco_ratings` `[{key, rating, ingredients, timestamp}]` (plafonné à 200 entrées).
   Notes 4-5 → multiplicateur ×1.15/×1.3 ; notes 1-2 → ×0.8/×0.9.
   Une recette assemblée notée ≥4 est promue dans `sn5_reco_recipes` **et** dans `RECIPES`
   (pool actif : recherche, filtres, matching futur).
4. **UI** (`renderReco`, ui.js) : vue `reco` (bouton nav 💡 Idées β), badge BÊTA,
   avertissement avant première utilisation (« Ce générateur utilise uniquement les recettes
   existantes comme base. Les résultats peuvent être imparfaits. », flag `sn5_reco_warned`),
   distinction visuelle 📚 existante (bordure pays) vs 🧪 assemblée (bordure pointillée
   violette), bouton « 💾 Garder dans mes recettes » (→ `USER_RECIPES`, éditable via ✍️ Créer).

## 8. Problèmes connus / limitations

- **Métadonnées périmées** : `index.html` (OG/Twitter) annonce « 652 recettes » ;
  `.github/commands/*.md` vérifient « 512 » ; le changelog v34 annonce « plus de 1 000 »
  (le staging de 300 n'a été intégré que partiellement). Réalité : **836**.
- **`nouvelles_recettes_300.js`** à la racine : staging v34 non chargé par l'app, contenu
  déjà intégré — supprimable après vérification.
- La carte du monde ne gère que la **mono-sélection** de cuisine (pas le multi `a|b`).
- `getPhotoUrl()` retourne toujours `null` (reliquat Unsplash) — l'art CSS généré a pris le relais.
- Les caches `_recipeCountsCache`/`_filteredMemo` sont invalidés manuellement quand on
  pousse dans `RECIPES` après init (fait dans reco.js) — tout nouveau code modifiant
  `RECIPES` à chaud doit faire pareil.
- Assemblage (Bêta) : qualité variable par construction — les étapes du modèle sont adaptées
  par substitution de noms, pas réécrites. C'est assumé et signalé à l'utilisateur.
- Recherche vocale : non supportée sur certains navigateurs (message dédié).

## 9. Fonctionnalités envisagées (non commencées)

- **Générateur de recettes par IA (API Anthropic)** : envisagé initialement puis remplacé
  par le recommandeur zéro-coût (v36). Si réactivé un jour : la clé API ne doit JAMAIS être
  dans le frontend (site public) → proxy Cloudflare Worker recommandé.
- Intégration du reliquat utile de `nouvelles_recettes_300.js` (pays annoncés en v34 mais
  absents : Algérie, Sénégal, Nigeria, Égypte, Iran, Syrie, Israël, Australie, NZ…) puis
  suppression du fichier.
- Multi-sélection de cuisines sur la carte du monde.
- Mise à jour des compteurs périmés (OG meta « 652 », checklists « 512 »).
- Évolutions possibles du Bêta : pondération par saison, prise en compte des régimes dans
  l'assemblage, historique des suggestions.

## 10. Journal des sessions

> ⚠️ Ajouter une entrée ici à la FIN de chaque session (plus récent en premier).

### 2026-06-10 — v36 : Générateur d'idées (Bêta) + changelog complet
- **Créé `PROJECT.md`** (ce fichier).
- **Nouveau `js/reco.js`** : recommandeur zéro-coût (matching par ingrédients → assemblage
  par patterns → notation 1-5 persistée → promotion des recettes assemblées notées ≥4 dans
  le pool actif). Aucun appel réseau. Smoke-testé sous Node (matching, assemblage,
  hash stable, promotion, multiplicateurs).
- **`js/ui.js`** : vue `reco` (saisie d'ingrédients en chips, avertissement première
  utilisation, cartes 📚 existante / 🧪 assemblée, étoiles de notation, sauvegarde) +
  `case "reco"` dans `setView`.
- **`index.html`** : bouton nav « 💡 Idées β » + `<script src="js/reco.js">` (entre logic.js
  et ui.js).
- **`css/style.css`** : styles `.reco-*`, `.beta-badge`, `.nav-beta` + scroll du modal
  changelog (`max-height:84vh`).
- **`js/app.js`** : `_SN5_VER='v36'`, entrée v36 dans `_SN5_LOG`, **ajout de l'entrée v34
  manquante**, `checkChangelog` affiche désormais TOUTES les versions manquées (historique
  complet si version inconnue), `initRecoRecipes()` appelé dans `init()`.
- **`sw.js`** : `CACHE_NAME` → `saveur-n5-v36`, `js/reco.js` ajouté à `APP_SHELL`.
- **`CHANGELOG.md`** : entrée v36.
- **Fix data** : `js/data/asie.js` TH003 `cat:"Soupe"` → `cat:"Plat"` (catégorie hors
  référentiel, invisible dans les filtres).
- **`.claude/launch.json`** (+ copie dans le dossier parent) : config de serveur de preview
  local (`npx http-server -p 8317`) pour vérifier l'app dans un navigateur.
- Vérifications : `node --check` OK sur tous les JS modifiés ; décompte réel confirmé :
  **836 recettes / 28 cuisines** ; test navigateur complet (boot sans erreur console,
  matching 6 résultats sur « poulet, carottes, olives », assemblage sur combinaison rare,
  notation 5★ → promotion dans le pool, changelog multi-versions : v33→3 entrées,
  version inconnue→historique complet).

### Avant 2026-06-10 (historique condensé — voir CHANGELOG.md et `git log`)
- v35 (2026-06-10) : carte du monde D3 + fix mexique.js. v34 (2026-05-08) : +237 recettes,
  export PDF jsPDF. v33 : multi-minuteurs. v29-v32 : refactor data en 21 fichiers + vagues
  de corrections UX. v23-v28 : recherche avancée, favoris/courses enrichis, audits qualité.
  ≤ v22 : fondations (PWA, thème sombre, menus, mode Focus, carrousel 3D).
