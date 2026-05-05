# Saveur N°5 — Notes de mise à jour

Convention : chaque version correspond au numéro du cache Service Worker (`sw.js` → `CACHE_NAME`).
Format : `v<num> — AAAA-MM-JJ` · catégories 🔴 Critique · 🟠 Ergonomie · 🟡 Fonctionnalités · 🟢 A11y · 🔵 Contenu · ⚫ Technique.

---

## v32 — 2026-05-05

### 🟡 Vague F — 7 polish items

**16. Drapeau pays sur fiche recette**
- Avant : 26 px en bas-droite, peu visible
- Fix : `recipe-art-detail .recipe-art-flag` passe à 36 px en haut-droite, badge blanc opaque avec ombre

**17. Double drapeau sur cartes catalogue**
- Avant : drapeau dans la pastille gradient ET drapeau dans le footer "🇫🇷 France"
- Fix : suppression du `${FLAGS[r.co]}` dans le footer ; pastille couleur + nom suffit

**18. Badge "Plat" écrasé par le bouton 🛒**
- Avant : la pastille catégorie en haut du `card-body` pouvait passer derrière le bouton cart
- Fix : `padding-left: 36-40px` sur `.card-top`, `min-height: 24px`

**19. Toggle thème : icône identique en clair et dark**
- Avant : 🌙 affichée dans les deux modes (perception bug)
- Fix : style visuel distinct — `theme-mode-light` (fond orangé clair, border doré) vs `theme-mode-dark` (fond bleu nuit, border foncée)
- Animation rotation 20° au hover, 180° à l'activation

**20. Modale multi-sélection : pas de compteur live**
- Avant : impossible de savoir combien de recettes vont rester
- Fix : barre sticky en bas avec `<X> recettes correspondent` + bouton « ✓ Appliquer »
- Mise à jour à chaque clic sur un chip, couleur rouge si `0` correspondance

**21. Boutons Liste de courses sans labels**
- Avant : `🖨` seul (sans texte) — confus
- Fix : `<span class="btn-lbl">Imprimer</span>` (et idem pour Décocher/Copier/Partager/.txt)
- Libellés masqués sous 520 px

**22. Formulaire Créer recette incomplet**
- Avant : pas de champs qualité, saison, régimes, tags
- Fix : section `<details>` collapsible "⚙️ Détails avancés" avec :
  - Qualité 1-5★ (avec QUAL_LABELS)
  - Saison (4 choix de SEASONS const)
  - Régimes (5 checkboxes : végétarien, sans gluten, sans lactose, sans fruits de mer, sans poissons)
  - Tags personnels (input séparé par virgules)
- `crSave()` met à jour pour récupérer ces nouveaux champs

### ⚫ Technique
- Bump cache SW → `saveur-n5-v32`

---

## v31 — 2026-05-04

### 🟠 Vague E — 10 frictions UX corrigées (suite audit Claude Web)

**6. Badge qualité vs notation perso superposés (hero recette)**
- Avant : `qual-badge` (top:10, right:10) chevauchait `detail-rating-bar` (top:14, right:14)
- Fix : `qual-badge-hero` passe en TOP-LEFT, rating-bar reste en TOP-RIGHT
- Bonus : qual-badge restylé (étoiles dorées + label en majuscule, séparation visuelle)

**7. Notes personnelles — contraste catastrophique en dark**
- Avant : `background:#fff` en dur → en dark = fond blanc + texte gris #e0e0e0 (illisible)
- Fix : `background:var(--surf)` en clair, override `#252540` + couleur `#f0e8d8` en dark
- Police passée à 14 px, italic sur placeholder

**8. Étoiles vides illisibles dans la grille principale**
- Avant : 13 px, stroke 1.2 px gris pâle → quasi invisibles
- Fix : 15 px, fond rgba semi-opaque autour du groupe, stroke 1 px doré contrasté
- Hover : scale 1.15 + couleur intermédiaire dorée

**9. Frigo : page vs toggle (incohérence navbar)**
- Avant : cliquer 🧊 Frigo depuis Menu ne quittait pas Menu → confusion
- Fix : si `S.view !== 'browse'` lors du `toggleFrigo`, basculement automatique vers le catalogue
- Bonus : `scrollIntoView` smooth sur la zone Frigo activée

**10. Multi-sélection sans feedback hors modale**
- Avant : valeur `co = 'France|Italie'` → dropdown affiche "Tous les pays" → utilisateur perdu
- Fix : barre dédiée `.multi-active-bar` au-dessus des filtres, chips dorés `France ×`, `Italie ×` cliquables individuellement
- Selects simples désactivés quand multi-sélection active (avec title explicatif)

**11. Tooltips icônes barre d'actions**
- Avant : 🖨 / 🔗 / ⋯ sans label visible au hover
- Fix : `[title]:hover::after` sur `.act-btn.act-secondary` → tooltip noir bas-haut avec animation `tip-fade`

**12. Conversion impériale incomplète**
- Avant : g→oz et kg→lb fonctionnaient, mais cs et cc restaient inchangés
- Fix : `cs → tbsp` et `cc → tsp` ajoutés au `fmtQty()` quand mode imperial

**13. Récents en dark mode — contraste insuffisant**
- Avant : titres `var(--text2)` (gris pâle) sur gradient sombre = illisibles
- Fix : `[data-theme="dark"] .recent-card-nom { color: rgba(255,255,255,.95) }` + bg de carte foncé + séparateur visible

**14. Carrousel hélix « Printemps fleuri » illisible**
- Avant : carte centrale et latérales avaient le même contraste → impossibilité de distinguer la carte active
- Fix : carte centrale `.helix-center` reçoit fond `var(--surf)` + ombre et taille typo augmentée
- Latérales gardent l'aspect mais leur typo est moins prononcée

**15. Tous les "Plats" affichaient le même 🍽**
- Avant : `PHOTO_EMOJIS[r.cat]` → mapping grossier 4-5 emojis pour 794 recettes
- Fix : `_recipeEmoji(r)` analyse `sous` + `nom` + ingrédients via 50+ patterns regex
- Résultats : 🐟 (saumon, bar), 🦐 (crevettes), 🥩 (bœuf), 🍗 (poulet), 🍝 (pâtes), 🍣 (sushi), 🍜 (ramen), 🌮 (taco), 🥗 (salade), 🍕 (pizza), 🍳 (œufs), 🧀 (gratin/fondue), 🍰 (cake)…

### ⚫ Technique
- Bump cache SW → `saveur-n5-v31`

---

## v30 — 2026-05-04

### 🔴 Vague D — 5 bugs bloquants corrigés (audit Claude Web)

**1. Mode Cuisine totalement cassé** (régression)
- Erreur : `ReferenceError: fmtTimerFT is not defined` à `ui.js:932` et 5 autres endroits
- Cause : la fonction de formatage timer n'avait jamais été définie
- Fix : ajout de `fmtTimerFT(sec)` dans `logic.js` qui retourne `MM:SS` ou `H:MM:SS`

**2. Titre fantôme dupliqué sur le hero recette**
- Cause : `.detail-photo-title` (bottom: 22px) + `.detail-photo-chef` (bottom: 0 + padding-bottom: 20px) → chevauchement quasi exact
- Fix : titre à `bottom: 42px`, chef à `bottom: 18px`, espacement clair de 8 px entre les deux

**3. Vue Liste cassée** (régression v26)
- Cause : `buildCardPhoto(r).replace('class="card-photo"','class="list-card-photo"')` ne nettoyait pas la classe `recipe-art-card` qui forçait `aspect-ratio: 4/3`
- Fix : helper dédié `buildListPhoto(r)` avec classe `recipe-art-list` (96×96 px carré, 72×72 sur mobile)

**4. Empty state silencieux quand filtres + recherche**
- Cause : aucun feedback que des filtres restent actifs après une recherche infructueuse
- Fix : empty state intelligent — chips dorés avec × pour retirer chaque filtre individuellement + bouton « ↺ Effacer tous les filtres »
- Couvre 11 types de filtres : recherche, pays, cat, chef, diff, time, qual, regime, saison, rayon, frigo

**5. Deep linking fragile**
- Cause : `RECIPES.find(x => x.id === id)` strict — `FR1` ne matchait pas `FR001`
- Fix : helper `_resolveRecipeId(rawId)` qui essaie : exact, uppercase, puis padding 0 sur la partie numérique
- Si introuvable : toast d'erreur clair + fallback vers le catalogue (au lieu de silence)

### ⚫ Technique
- Bump cache SW → `saveur-n5-v30`
- Aucun nouveau fichier ; seules régressions corrigées

---

## v29 — 2026-05-03

### 🗂 Refactor majeur — data.js divisé par pays

**Pourquoi** : 794 recettes dans un seul fichier de 1 MB rendait l'édition lourde et l'audit qualité difficile à mener par batches. Désormais :

- `js/data.js` est un simple conteneur (`var RECIPES = []`)
- 21 fichiers `js/data/<pays>.js` font chacun `RECIPES.push(...)`
- Chargés dans l'ordre de volume décroissant dans index.html
- SW v29 cache tous les fichiers pour offline

**Répartition** :
- ≥10 recettes : un fichier dédié (Asie 210, France 209, Italie 159, Espagne 59, Grèce 28, Mexique 24, Scandinavie 20, États-Unis 12, Portugal 10)
- 3-9 recettes : un fichier dédié (Maroc 9, Moyen-Orient 8, Europe Centrale 5, Turquie 5, Pérou 4, Afrique 4, Argentine 3, Tunisie 3, Éthiopie 3, Amérique du Sud 3, Caraïbes 3)
- ≤2 recettes : groupés dans `divers.js` (Allemagne, Liban, Royaume-Uni, Pologne, Hongrie, Brésil, Canada, Cuba — 13 recettes)

**Avantage immédiat** : audit qualité par cuisine — éditer juste `data/france.js` sans risque sur le reste de la base.

### 🔄 Audit qualité recettes 101-200 (en cours, 65/100 upgradées)

Recettes réécrites en versions chef étoilé élaborées (techniques pro, attributions chefs, étapes développées 5-8×) :

**Italie (12)** : IT028 Cantucci → Mattei (1858), IT029 Cotoletta → Cracco, IT030 Parmigiana → Cannavacciuolo, IT031-040 (Caprese, Lasagnes Bottura, Bruschetta, Risotto Cracco, Polenta Baronetto, Panzanella, Semifreddo Massari, Involtini Assenza, Carpaccio carciofi, Sarde in saor)

**Espagne (8)** : ES004 Gazpacho → Quique Dacosta, ES005 Patatas Bravas → Sergi Arola, ES006 Bacalà → Carme Ruscalleda, ES007 Churros → San Ginés (1894), ES008 Tortilla → Quique Dacosta, ES009 Croquetas → Sergi Arola

**Grèce (3)** : GR006 Dolmades → Aglaia Kremezi, GR007 Hummus → Yotam Ottolenghi, GR008 Briam → Diane Kochilas

**Mexique (4)** : MX001 Tacos al Pastor (libano-mex), MX002 Guacamole → Enrique Olvera, MX003 Flan → Daniela Soto-Innes, MX004 Sopa de Lima → Roberto Solís

**Maroc (3)** : MA001 Tajine → Choumicha, MA002 Couscous Royal → Najat Kaanache, MA003 Harira (Fès)

**Liban (2)** : LB001 Fattoush → Greg Malouf, LB002 Fatteh (Mokbel)

**Portugal (2)** : PT001 Bacalhau Brás → José Avillez, PT002 Pastéis → Antiga Confeitaria de Belém (1837)

**Scandinavie (2)** : SC001 Gravlax → Magnus Nilsson, SC002 Kladdkaka (tradition Stockholm)

**Allemagne (2)** : DE001 Sauerbraten → Alfons Schuhbeck, DE002 Forêt-Noire → Josef Keller (1915)

**UK (2)** : GB001 Beef Wellington → Gordon Ramsay, GB002 Sticky Toffee → Sharrow Bay (1971)

**Argentine (2)** : AR001 Asado → Francis Mallmann, AR002 Alfajores

**Vietnam (2)** : VN001 Phở Bò → Phở Gia Truyền (Hanoï 1947), VN002 Gỏi Cuốn → Charles Phan

**Inde (3)** : IN001 Dal Makhani → Vivek Singh, IN002 Naan → Atul Kochhar, IN003 Butter Chicken → Kundan Lal Jaggi (1948)

**Corée (2)** : KR001 Bibimbap (Jeonju), KR002 Bulgogi → Hooni Kim

**Moyen-Orient (2)** : ME001 Falafel → Ottolenghi, ME002 Kofta → Greg Malouf

**Japon (5)** : JP001-005 (Gyudon, Yakisoba, Onigiri, Miso Shiru, Gyoza Murata)

**Chine (2)** : CN001 Mapo Doufu → Chen Kenichi, CN002 Kung Pao (Sichuan tradition)

**Thaïlande (2)** : TH001 Pad Thai → David Thompson, TH002 Curry Vert → Chumpol Jangprai

**USA (3)** : US005 Cheeseburger → Daniel Boulud, US006 Cookies → Ruth Wakefield, US007 Apple Pie → Christina Tosi

**Tunisie + Éthiopie + Pérou (3)** : TN001 Chakchouka, ET001 Doro Wat → Marcus Samuelsson, PE001 Ceviche → Gastón Acurio

### ⚫ Technique
- Bump cache SW → `saveur-n5-v29`
- 21 fichiers `js/data/*.js` ajoutés à APP_SHELL
- Validation : 794 recettes, IDs uniques, champs obligatoires présents

---

## v28 — 2026-04-26

### 🟡 Vague C — 21 polish items

**15. Bouton « Surprise » plus discret**
- Padding réduit à 10 px ; opacité 0.78 → 1 au hover ; libellé masqué sous 900 px

**16. Couleurs catégories distinctes en dark mode**
- Variables CSS overridées en `[data-theme="dark"]`
- Entrée bleu clair, Plat rouge clair, Dessert vert clair, Sauce or
- Border subtle pour mieux délimiter chaque badge

**17. Transition fluide changement de thème**
- 30+ sélecteurs avec `transition: background-color .35s, color .35s, border-color .35s, box-shadow .35s`

**18. Mode Focus : barre de progression visible**
- Hauteur 4 px → 8 px ; gradient or + shadow rayonnant ; `::after` shimmer animé 1.6 s

**19. Footer © Teva atténué**
- `opacity: .5` → `.32`, font-size `10 px` → `9.5 px`, hover .72

**20. Compteur recettes affichées / total**
- `updateCount()` détecte si filtre actif → affiche `X / 794 recettes` au lieu de juste `X recettes`

**21. Hover state cartes plus expressif**
- `transform: translateY(-4px) scale(1.012)` + box-shadow plus marquée
- `brightness(1.04) saturate(1.08)` sur la photo
- `::before` "Voir la recette" qui apparaît centré sur la carte

**22. Tooltips boutons fav/cart sur cartes**
- Attribut `data-tip` ajouté en JS (sed batch)
- `::before` qui affiche le texte du tooltip au hover/focus avec animation

**23. Filtre difficulté avec labels textuels**
- `★★★ — Difficile`, `★★★★ — Expert`, etc. (labels Facile/Moyen/Difficile/Expert/Maître)

**24. Breadcrumb plus contrasté**
- `font-size: 13px`, color `--text2`, soulignement transparent qui apparaît au hover en doré

**25. Mode Focus : opacité réduite + blur**
- Background `rgba(248,244,239,.78)` au lieu de `var(--bg)` opaque
- `backdrop-filter: blur(28px) saturate(150%)` → l'image hero transparaît

**26. Sélecteur portions tactile**
- `.qty-btn { min-width: 44px; min-height: 44px }` (WCAG 2.5.5 minimum)
- Sur mobile (≤600 px), 48 px

**27. Accord vin/boisson visible**
- Block dédié : gradient or, border-left 3 px or, padding 12-14 px
- Texte `font-style: normal`, `font-weight: 500`, color full `--text`

**28. Notes auto-save**
- Nouveau handler `_pnotesAutoSave(id)` avec debounce 800 ms
- Statuts visuels : 🔘 Idle "Sauvegarde automatique" / 🟡 Typing pulse / 🟢 Saved ✓
- Bouton "Sauvegarder" remplacé par un indicateur passif

**29. Cartes "Pour compléter le repas" agrandies**
- Layout vertical (column), min-height 170 px, photo 120 px en haut
- Emoji art passé à 42 px

**30. Pills Courses groupées en cards**
- Chaque `.cs-pill-group` est maintenant un panneau avec border + padding 12 px
- Header de catégorie avec border-bottom

**31. Frigo : chips d'ingrédients**
- `.frigo-tag` redessinés en chips dorés (background `--gold-faint`, border `--gold-l`)
- Bouton × dans un cercle qui pivote 90° au hover

**32. Stats settings différenciées**
- 6 tiles avec couleur de bordure/fond/icône distincte (Favoris rouge, Notées or, Moyenne or foncé, Mémos bleu, Panier vert, Recettes violet)
- Police Cormorant Garamond pour les chiffres
- Hover lift

**33. Vue liste enrichie**
- `::before "👨‍🍳 "` devant le meta
- Slide horizontal léger au hover (translateX 2 px)
- Border-left dorée au hover

**34. Badge compteur filtres actifs**
- Sur le bouton "🔍 Filtres", badge rond doré avec le compte de filtres actifs
- Calculé depuis `summaryParts.length`

**35. Sections settings contrastées en dark**
- `[data-theme="dark"] .setting-section` : background `--bg2`, border + shadow distinct du fond `--bg`
- `.setting-section-head` : gradient subtil
- Plus de "fonte dans le fond"

### ⚫ Technique
- Bump cache SW → `saveur-n5-v28`

---

## v27 — 2026-04-26

### 🟠 Vague B — 9 frictions UX résolues

**6. Barre d'actions fiche recette hiérarchisée**
- Trois niveaux : primaires (Mode cuisine, Favoris, Courses) avec emoji + libellé visible ; secondaires (Imprimer, Partager) en icônes ; tertiaires (Modifier, Sauvegarder, Restaurer) dans un menu déroulant `⋯`
- Mobile : libellés masqués automatiquement sous 600 px

**7. Suppression du double scroll**
- `.col-l` (ingrédients) : `max-height` + `overflow-y` retirés. Garde uniquement `position:sticky;top:64px` → un seul scroll de page

**8. Étoiles de notation visibles en mode clair**
- Étoiles vides : `-webkit-text-stroke` 1.2px/1.4px doré clair (#b89b58) avec `color:transparent`
- Étoiles pleines : remplissage `#e8a020` + contour foncé + text-shadow doré

**9. Hiérarchie typographique des filtres**
- Labels : 11 px, 700, uppercase, letter-spacing 0.07em, gris clair
- Valeurs sélectionnées (autres que vide) : 13 px, 600, doré + bordure dorée

**10. Carrousel hélix navigation enrichie**
- Flèches latérales `‹/›` permanentes en marge (42×42 px, scale 1.08 au hover)
- Dots de pagination cliquables (un par recette du pool de 12), `active` en doré + halo
- Mise à jour automatique du dot actif à chaque frame du `_hlxRender`

**11. Cartes "Récemment consultées" enrichies**
- Largeur 130 → 155 px ; ajout : badge catégorie coloré, temps total (⏱ X min), difficulté en dots, séparateur avant le pays
- Accessibilité : `role="button"` + `tabindex="0"` + `aria-label`

**12. Page Menu — état vide engageant**
- Affiché uniquement si pas de menu généré ni d'historique
- 3 jours-exemples de menus harmonieux (Vichyssoise / Canard / Tatin, Niçoise / Risotto / Crème brûlée, Bourguignon / Dauphinois / Mousse)
- 4 « features » illustrées (équilibre, courses auto, historique, régénération)
- Illustration emoji 📆🍽️✨

**13. Page Favoris — état vide avec suggestions**
- 3 « Coups de cœur du jour » sélectionnés parmi les recettes `qual=5`, déterministe par seed du jour (ISO date), distincts par pays
- Cartes cliquables pour ouvrir directement la recette suggérée

**14. Search ops — tip flottant**
- Apparaît automatiquement au focus du champ (`focus-within`)
- Affiche les 6 opérateurs sous forme de chips `<code>` colorés
- Lien « Voir tous les exemples → » qui ouvre la modale d'aide complète

### 🐛 Bugfix
- `_hlxCardHTML` : référence à `_PH` (variable supprimée en v26) réparée → utilise le système d'art CSS
- `renderSeasonal` : idem pour les seasonal cards

### ⚫ Technique
- Bump cache SW → `saveur-n5-v27`

---

## v26 — 2026-04-25

### 🔴 Critique — Vague A (5 bugs critiques UI/UX)

**1. Images génériques sur 794 recettes → cartes visuelles uniques**
- Cause : `source.unsplash.com` déprécié par Unsplash en juin 2024 ; toutes les images retournaient 404 → fallback placeholder uniforme (cloche dorée)
- Solution : système d'art CSS génératif — chaque recette a un gradient unique calculé à partir d'un hash 32 bits de son ID + couleur primaire du pays + emoji catégorie + drapeau pays
- Avantages : 100% offline (PWA-friendly), pas d'appel réseau, unique par ID, joli et cohérent
- Pattern : `linear-gradient(<angle>deg, <color_pays>, hsl(<hue>, <sat>, <lum>))` avec emoji centré + drapeau coin bas-droit

**2. Bouton « Créer » → routing nettoyé**
- Cause : chaîne `if/else if` mal indentée dans `setView()`, fragile
- Solution : refactor en `switch` explicite avec cases dédiés (favs, courses, menu, settings, create, edit) + `default` qui log un warning
- Sécurisation : test de présence des zones DOM (filters-zone, recent-zone) avant accès

**3. Titre fantôme sur hero recette**
- Cause : image hero cassée → `alt="r.nom"` rendu visible par certains navigateurs (avant le `<img>` cassé) en plus du `.detail-photo-title` overlay
- Solution : remplacement par `<div role="img" aria-label>` → plus de fallback `alt` rendu

**4. Contraste hero insuffisant**
- `.detail-photo-overlay` : gradient renforcé `rgba(0,0,0,.85)` en bas → `transparent` en haut (au lieu de `.65` → `transparent` à 55%)
- `.detail-photo-title` : double text-shadow `0 2px 12px rgba(0,0,0,.7), 0 1px 3px rgba(0,0,0,.9)`
- `.detail-photo-chef` : opacité texte 0.92 (au lieu de 0.75) + text-shadow

**5. Dropdown CHEF avec 300+ entrées**
- Cause : `<select>` avec liste très longue, intitulés interminables, navigation impossible
- Solution : `<input type="search" list="chef-datalist">` + `<datalist>` natif → autocomplete avec recherche live, croix d'effacement, debounce sur l'input

### ⚫ Technique
- Bump cache SW → `saveur-n5-v26`
- `_recipeArt(r)` mémorisé par ID dans `_artCache`
- `getPhotoUrl()` retourne `null` (compat backups) ; `_userPhoto()` reste prioritaire pour photos uploadées

---

## v25 — 2026-04-25

### 🔵 Contenu — Audit qualité recettes
- 23 recettes (FR039–FR056 + IT023–IT027) réécrites en versions chef étoilé élaborées
- Attribution chef + technique signature pour chaque recette :
  - **Vichyssoise** → Louis Diat (Ritz-Carlton NY, 1917)
  - **Salade Niçoise** → Hélène Barale (charte de Nice, sans pommes de terre)
  - **Gratin Dauphinois** → Anne-Sophie Pic (sans fromage, précuisson dans la crème infusée)
  - **Ratatouille** → Alain Ducasse (méthode confit séparé, pelage des poivrons)
  - **Daube Provençale** → Reine Sammut (couenne de porc, zeste d'orange amère, 24 h marinade)
  - **Brandade de Morue** → Pierre Gagnaire (émulsion à chaud au mortier marbre)
  - **Poulet Rôti** → Joël Robuchon (séchage 12 h frigo, repos brechet en bas)
  - **Cassoulet de Toulouse** → Christian Constant (3 jours, 7 croûtes cassées)
  - **Crêpes Suzette** → Henri Charpentier (Café de Paris, Monte-Carlo 1895)
  - **Tarte aux Fraises** → Cédric Grolet (Le Meurice, crème diplomate)
  - **Soufflé au Comté** → Michel Roux (Le Gavroche, rigole du pouce)
  - **Œufs en Meurette** → Bernard Loiseau (vin flambé, beurre manié)
  - **Aglio e olio + Risotto porcini** → Massimo Bottura (mantecatura hors feu, pangrattato)
  - **Pizza Margherita** → Enzo Coccia (Pizza Napoletana STG, fermentation 24-48 h)
  - …et 9 autres
- Étapes développées 5–8× plus détaillées avec techniques professionnelles
- Champ `qual:5` ajouté aux 23 recettes

### ⚫ Technique
- Bump cache SW → `saveur-n5-v25`

---

## v24 — 2026-04-25

### 🌍 Contenu
- +142 nouvelles recettes internationales incorporées dans `data.js` (Japon x17, Mexique x14, Corée du Sud x12, Vietnam x12, Thaïlande x11, Inde x15, Pérou x4, Brésil x1, Argentine x3, Maroc x9, Tunisie x3, Éthiopie x3, Sénégal, Scandinavie x20, Moyen-Orient, Turquie, Liban, Iran, États-Unis…)
- Base totale portée à **794 recettes**

### ⚫ Technique
- Bump cache SW → `saveur-n5-v24`

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
