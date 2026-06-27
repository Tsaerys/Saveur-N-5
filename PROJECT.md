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
- **Version courante** : **v42** (2026-06-11).
- **Public** : usage personnel/familial, mais le site est public et indexé.
- **⚠️ Règle produit (v37)** : les recettes sont **exclusives à l'application** — aucun
  export (PDF/CSV/JSON), impression des fiches bloquée. Seules la liste de courses et la
  sauvegarde des données UTILISATEUR (favoris, notes…) peuvent sortir de l'app.

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
| CDN externes | D3.js v7 (carte du monde), Google Fonts (Cormorant Garamond + DM Sans) — **tous avec dégradation propre** si indisponibles. (jsPDF retiré en v37) |
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
│                               sous-chef vocal, effets visuels, raccourcis
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
5. **Catégories autorisées** (`CATS` dans state.js) : Entrée, Plat, Dessert, **Cocktail** (v38),
   Sauce / Base, Accompagnement, Assaisonnement. Les soupes → `cat:"Plat"` ou `"Entrée"` +
   `sous:"Soupe"`. Les **cocktails** ont un champ supplémentaire
   `virgin:{ig:[...],et:"..."}` = version sans alcool ; la fiche affiche un sélecteur
   Classique/Sans-alcool (`S.cocktail_version`, `setCocktailVersion`). Ajouter une catégorie
   = la mettre dans `CATS` + `CAT_COLORS` + `PHOTO_EMOJIS` + une classe `.cat-<X>` en CSS.
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

- ✅ **Page Accueil (v37, carrousel retiré en v41)** : hero + stats, 8 tuiles de raccourci,
  suggestions du moment, carte du monde, récemment consultées. Vue par défaut ;
  logo et `G`+`H` y ramènent
- ✅ **Navigation (v37)** : topbar 7 boutons (Accueil, Recettes, Idées β, Menu, Favoris,
  Courses, Réglages) ; Frigo/Surprise/Créer vivent dans la barre d'outils du catalogue
- ✅ **Cocktails (v38)** : catégorie « Cocktail », 15 classiques mondiaux, chacun avec
  version Classique + Sans-alcool (virgin) basculable sur la fiche ; tuile d'accueil dédiée
- ✅ Catalogue 886 recettes (vue épurée : filtres + grille), grille/liste, pagination infinie (IntersectionObserver)
- ✅ Recherche avancée : `chef:`, `pays:`, `cat:`, `ing:`, `-exclusion`, `"phrase exacte"` + recherche vocale (Web Speech)
- ✅ Filtres : pays, catégorie, difficulté, temps, qualité, rayon, saison, chef (autocomplete), multi-sélection, 5 régimes (végé, sans gluten/lactose/fruits de mer/poissons), tri
- ✅ Mode Frigo : matching par ingrédients disponibles (+ mode strict)
- ✅ **Générateur d'idées (Bêta, v36)** : voir §7
- ✅ Fiche recette : portions dynamiques, conversion d'unités (métrique/impérial/volume), étapes cochables, notes perso auto-sauvées, notation 5 étoiles, photo perso (base64), variantes, accords, préparation à l'avance, breadcrumb
- ✅ Mode Cuisine + Mode Focus (plein écran, étape par étape) + Sous-Chef Vocal (SpeechSynthesis fr-FR)
- ✅ Multi-minuteurs persistants (Web Audio, 5 sons, vibration)
- ✅ Favoris (onglets, tags personnels), Liste de courses (agrégation par rayon, copie/partage/.txt/impression), Menu de la semaine (occasions, régimes, historique 5 menus)
- ✅ Création/édition/suppression de recettes utilisateur (vue ✍️ Créer)
- ✅ Export/import de sauvegarde des données utilisateur (JSON + QR code) — favoris, notes, notations uniquement
- ❌ **Supprimé en v37** : export PDF par recette, export catalogue CSV/JSON, impression
  des fiches recettes (Ctrl+P neutralisé sur les fiches + CSS print remplacé par un avis).
  La liste de courses reste imprimable
- ✅ PWA offline complet, popup changelog (depuis v36 : TOUTES les versions manquées), bouton « Forcer la mise à jour »
- ✅ Thème clair/sombre, raccourcis clavier (`?` pour l'aide), accueil saisonnier, carte du monde interactive (D3), deep-linking `#recette/ID`

## 6. Données recettes

- **Total : 886 recettes** réparties en 22 fichiers `js/data/*.js` (dont `cocktails.js`, v38).
- **Cuisines** (`co`) : France, Asie, Italie, Espagne, Grèce, Maroc, Mexique, Scandinavie,
  Amérique du Sud, Afrique, Argentine, États-Unis, Moyen-Orient, Pérou, Brésil, Portugal,
  Tunisie, Éthiopie, Caraïbes, Cuba, Europe Centrale, Turquie, Allemagne, Hongrie, Liban,
  Pologne, Royaume-Uni, Canada. Les cocktails réutilisent des `co` existants (Cuba, Mexique,
  Brésil, Caraïbes, Italie, Espagne, France, États-Unis).
- **Catégories** : Plat ~467, Dessert ~162, Entrée ~125, **Cocktail 50 (v38→v42)**,
  Sauce / Base 38, Accompagnement 38, Assaisonnement 6.
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

### 2026-06-11 — v42 : Cocktails portés à 50, niveau bar + variantes
- **Exigence durable (mémoire)** : les cocktails doivent être « les meilleurs du monde »
  (specs craft précises, technique, verrerie, garniture). Voir mémoire `cocktail-quality`.
- **js/data/cocktails.js réécrit** : les 30 existants (CK001-CK030) revus aux specs
  bartender (mesures cl, shake/stir, double-filtrage, dry-shake blanc d'œuf, zeste pressé,
  verrerie + garniture dans `notes`) ; 20 nouveaux (CK031-CK050) dont le **Painkiller**
  (CK031). Total : 50 cocktails, 886 recettes.
- **Variantes** : 18 cocktails ont un champ `vars:[{nom,desc}]` (riffs célèbres) — rendu par
  `buildVariantHtml` existant (logic.js), affiché sous les ingrédients sur la fiche. C'est un
  mécanisme TEXTUEL (descriptions), distinct du toggle Classique/Virgin. Choix assumé pour
  rester cohérent avec l'architecture (pas de swap d'ingrédients par variante).
- **state.js** : ajout des drapeaux + couleurs **Russie** 🇷🇺 (corrige Moscow Mule qui
  n'avait pas de drapeau) et **Irlande** 🇮🇪 (Irish Coffee). Ces `co` ne sont pas dans
  `MAP_CUISINE_GEO` → non colorés sur la carte (dégradation propre, OK).
- **sw.js** v42, **app.js** `_SN5_VER='v42'` + entrée changelog, **CHANGELOG.md** entrée v42.
- Vérifications : `node --check` OK ; smoke test Node (50 cocktails, 0 problème d'intégrité,
  tous avec `virgin` valide, Painkiller présent, toutes les `co` ont drapeau+couleur,
  `vars` bien formés).

### 2026-06-11 — v41 : Suppression du carrousel hélice de l'Accueil
- **js/app.js** : suppression complète du bloc « Carrousel Hélice 3D » (~280 lignes :
  `_hlxPool`, `_hlxRender`, `_hlxStep`, `_hlxBind`, `renderHelix()`, etc.) et de l'appel
  `renderHelix()` dans le wrapper de `renderMain`. Référence résiduelle `.helix-ctrl-btn`
  retirée du sélecteur de `_initRipple()`.
- **js/ui.js** : retrait de `helix-zone` des listes de zones affichées/masquées (`setView`,
  `openRecipe`) et de l'appel `renderHelix()` dans `renderHome()`.
- **index.html** : suppression de `<div id="helix-zone"></div>`.
- **css/style.css** : suppression de tous les blocs `.helix-*`/`#helix-*` (carrousel
  principal, flèches latérales, dots, lisibilité des cartes) ; retrait de `#helix-zone` de
  la règle d'impression. ⚠️ Une règle non liée (`.shared-mode .content-area`) suivait
  immédiatement le bloc principal et a été accidentellement supprimée puis restaurée —
  vérifier les blocs adjacents lors de suppressions similaires.
- **sw.js** : CACHE_NAME → v41. **app.js** : `_SN5_VER='v41'` + entrée changelog.
  **CHANGELOG.md** : entrée v41.
- L'Accueil garde : hero + stats, tuiles de raccourci, suggestions du moment (saisonnier),
  carte du monde, récemment consultées.
- Vérifications : `node --check` OK ; aucune trace `helix`/`hlx` restante dans JS/HTML/CSS ;
  test navigateur (cache + SW vidés pour forcer le rechargement — la mise à jour réelle
  passera par le mécanisme normal de bump de version) : Accueil sans carrousel, zéro erreur
  console, 866 recettes / 29 cuisines / 7 catégories inchangés.

### 2026-06-11 — v40 : +15 cocktails (carte portée à 30)
- **js/data/cocktails.js** : ajout de CK016-CK030 (Old Fashioned, Manhattan, Whisky Sour,
  Gin Tonic, Moscow Mule, Pisco Sour, Caipiroska, Bellini, Kir Royal, Espresso Martini,
  Long Island Iced Tea, Sidecar, Dark 'n' Stormy, French 75, Paloma) — même schéma que les
  15 premiers (`virgin:{ig,et}`). Catalogue total : 866 recettes (30 cocktails).
- **sw.js** : CACHE_NAME → v40. **app.js** : `_SN5_VER='v40'` + entrée changelog.
  **CHANGELOG.md** : entrée v40.
- Aucun changement de code applicatif (UI, filtres, sélecteur classique/virgin déjà en
  place depuis v38) — uniquement des données.
- Vérifications : `node --check` OK, 30/30 cocktails comptés dans le fichier.

### 2026-06-11 — v39 : Nouvelle identité visuelle (logo)
- **Icônes régénérées** depuis `images/Icon Saveur N°5.png` (source 1620×1608, conservée comme
  master) : `icon-16/32/180/192/512.png` + `favicon.ico` (multi-tailles 16/32/48, PNG embarqués)
  à la racine. Générées via System.Drawing (PowerShell) — recadrage carré centré + bicubique HQ.
- **sw.js** : CACHE_NAME → v39 ; ajout de favicon.ico + icon-16/32/180 à l'`APP_SHELL` (les
  icônes étant cache-first, le bump est nécessaire pour propager le nouveau logo).
- **app.js** : `_SN5_VER='v39'` + entrée changelog. **CHANGELOG.md** : entrée v39.
- Aucun changement de code applicatif ni de noms de fichiers d'icônes — manifest.json et
  index.html inchangés (mêmes chemins).
- ⚠️ Astuce future : le chemin du projet contient « ° » (Saveur N°5) ; en script PowerShell,
  résoudre le chemin par joker (`Get-Item 'S:\Apps\Saveur*\...'`) pour éviter la corruption
  d'encodage du caractère accentué.

### 2026-06-11 — v38 : Catégorie Cocktails (classique + virgin)
- **Nouveau `js/data/cocktails.js`** : 15 cocktails classiques (`cat:"Cocktail"`, IDs CK001-CK015),
  chacun avec un champ `virgin:{ig,et}` = version sans alcool. Réutilise des `co` existants.
- **state.js** : « Cocktail » ajouté à `CATS`, `CAT_COLORS` (#b81d6a), `PHOTO_EMOJIS` (🍹) ;
  nouvel état `S.cocktail_version` ('classic'|'virgin').
- **ui.js** : `renderDetail` calcule la version active (classique/virgin) pour ingrédients ET
  étapes, affiche un sélecteur `.cocktail-switch` (Classique gauche / Sans alcool droite),
  masque les pastilles végé/gluten et le bloc accord-vin (désormais conditionnel) pour les
  cocktails, libellé « Verres ». `setCocktailVersion()` ; `updateIngrList()` respecte la
  version ; `openRecipe` réinitialise à 'classic' ; emoji/gradient cocktail ; tuile « Cocktails »
  sur l'Accueil + helper `openCategory()`.
- **CSS** : `.cat-Cocktail` (clair + dark), `.cocktail-switch`/`.ck-switch-btn` (actif magenta /
  virgin vert).
- **index.html + sw.js** : `cocktails.js` ajouté au chargement et à l'app shell ; SW v38.
- Vérifications : `node --check` OK ; tests navigateur (851 recettes, 15 cocktails tous avec
  virgin, fiche Mojito : classique=avec rhum / virgin=sans rhum, étapes basculées, filtre
  catégorie Cocktail=15 cartes, tuile accueil, zéro erreur console).

### 2026-06-11 — v37 : Page Accueil + navigation repensée + recettes exclusives
- **Recettes exclusives à l'app** : suppression de `exportRecipePDF` et `exportCatalogue`
  (logic.js), des boutons 🖨/📄 de la fiche recette et des boutons CSV/JSON des Réglages ;
  jsPDF (CDN) retiré d'index.html ; Ctrl+P neutralisé sur les fiches (script de protection,
  via `body[data-view]`) ; CSS `@media print` réécrit — fiches/catalogue/accueil remplacés
  par un avis à l'impression, **liste de courses toujours imprimable**. La sauvegarde des
  données utilisateur (favoris/notes/notations, sans contenu de recettes) est conservée.
- **Page Accueil (vue par défaut)** : nouvelle vue `home` — hero (titre, tagline, stats),
  8 tuiles de raccourci (`renderHome`, ui.js), et déplacement du carrousel hélice, du
  saisonnier, de la carte du monde et des « récemment consultées » de browse vers home
  (gardes `S.view==='home'` dans app.js/map.js). Nouvelle zone `#home-hero-zone` +
  réordonnancement des zones dans index.html. `setView` pose `body[data-view]` et remonte
  en haut de page ; `goBack`/`render()` simplifiés pour passer par `setView`.
- **Ergonomie navigation** : topbar réduite de 9 à 7 boutons (Accueil, Recettes, Idées β,
  Menu, Favoris, Courses, Réglages) ; Frigo (avec compteur), Surprise et Créer déplacés
  dans la barre d'outils du catalogue (`.toolbar-btn` dans `renderFilters`) et en tuiles
  d'accueil ; clic carte du monde depuis l'Accueil → ouvre le catalogue filtré ;
  raccourci `G`+`H` → Accueil ; logo → Accueil.
- Vérifications : `node --check` OK ; tests navigateur complets (accueil/zones, tuiles,
  fiche sans boutons d'export, frigo toolbar, carte→catalogue, réglages sans CSV/JSON,
  retour logo, zéro erreur console).

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
