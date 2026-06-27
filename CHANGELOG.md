# Saveur N°5 — Nouveautés

---

## v42 — 2026-06-11

### 🍸 Cocktails : 50 recettes au niveau d'un bar à cocktails
- La carte passe de 30 à **50 cocktails**, dont le **Painkiller** ⭐
- Les 30 cocktails existants ont été **entièrement revus aux specs bartender** : mesures précises (cl), technique professionnelle (shake/stir, double-filtrage, dry-shake pour le blanc d'œuf, zeste pressé), verrerie et garniture pour faire « le meilleur du monde »
- **18 cocktails proposent des variantes célèbres** : Negroni → Boulevardier / Sbagliato / White Negroni, Margarita → Tommy's / épicée / frozen / mangue, Old Fashioned → rhum / érable / Oaxaca, Manhattan → Perfect / Rob Roy, Moscow Mule → Kentucky / mexicaine / londonienne, Mojito → Royal / fraise, Painkiller → n°2/3/4, etc.
- Chaque cocktail conserve sa version **Classique** et sa version **Sans alcool**
- Nouveaux : Painkiller, Dry Martini, Mint Julep, Gimlet, Aviation, Clover Club, White Russian, Irish Coffee, Tom Collins, Singapore Sling, Hurricane, Zombie, Gin Fizz, Bramble, Pornstar Martini, Amaretto Sour, Hugo Spritz, Americano, Vesper, Penicillin
- Drapeaux Russie 🇷🇺 et Irlande 🇮🇪 ajoutés

---

## v41 — 2026-06-11

### 🗑 Suppression du carrousel de l'Accueil
- Retrait du carrousel hélice 3D (rotation des suggestions de plats) sur la page d'Accueil
- L'Accueil reste centré sur les tuiles de raccourci, les suggestions du moment, la carte du monde et les recettes récentes

---

## v40 — 2026-06-11

### 🍹 15 nouveaux cocktails — la carte passe à 30
- Old Fashioned, Manhattan, Whisky Sour, Gin Tonic, Moscow Mule, Pisco Sour, Caipiroska, Bellini, Kir Royal, Espresso Martini, Long Island Iced Tea, Sidecar, Dark 'n' Stormy, French 75, Paloma
- Chacun avec sa version Classique et sa version Sans alcool (sélecteur sur la fiche), comme les 15 premiers cocktails

---

## v39 — 2026-06-11

### 🎨 Nouvelle identité visuelle
- Nouveau logo Saveur N°5 (toque de chef, « 5 » et cuillère) appliqué à **toutes** les icônes de l'application
- Icônes PWA régénérées dans toutes les tailles (16, 32, 180, 192, 512 px) + favicon multi-tailles
- L'icône se met à jour automatiquement à la prochaine ouverture (vider le cache si besoin via Réglages → Forcer la mise à jour)

---

## v38 — 2026-06-11

### 🍹 Nouvelle catégorie « Cocktails »
- 15 grands classiques mondiaux : Mojito, Piña Colada, Margarita, Daiquiri, Caïpirinha, Cosmopolitan, Tequila Sunrise, Cuba Libre, Aperol Spritz, Negroni, Bloody Mary, Sex on the Beach, Mai Tai, Sangria, Mimosa
- **Chaque cocktail propose sa version Classique ET sa version Sans alcool (« virgin »)** — un simple sélecteur sur la fiche bascule entre les deux (ingrédients et étapes adaptés)
- Accès via une tuile « Cocktails » sur l'Accueil et via le filtre Catégorie du catalogue
- Compatible recherche, filtres, favoris et liste de courses

---

## v37 — 2026-06-11

### 🏠 Nouvelle page Accueil
- L'app s'ouvre désormais sur un véritable accueil : carrousel saisonnier, suggestions du moment, carte du monde, recettes récentes et tuiles de raccourci vers toutes les sections
- Le logo et le bouton 🏠 ramènent à l'Accueil (raccourci clavier : `G` puis `H`)

### 🧭 Navigation repensée (ergonomie)
- Barre de navigation allégée : 7 boutons au lieu de 9
- **Frigo**, **Surprise** et **Créer** déménagent dans la barre d'outils du catalogue (et sur l'Accueil) — ils n'encombrent plus la navigation principale
- La vue **Recettes** devient un catalogue épuré : filtres + grille, sans carrousel ni carte
- Changement de vue : retour automatique en haut de page

### 🔒 Recettes exclusives à l'application
- Suppression de l'export PDF des fiches recettes (jsPDF retiré)
- Suppression de l'export du catalogue (CSV / JSON)
- Impression des fiches recettes bloquée (bouton retiré, Ctrl+P neutralisé, page d'impression remplacée par un avis)
- La liste de courses reste imprimable et partageable ; la sauvegarde de VOS données (favoris, notes) reste disponible

---

## v36 — 2026-06-10

### 💡 Générateur d'idées (Bêta)
- Tapez les ingrédients dont vous disposez (ex : « poulet, carottes, olives »)
- L'app vous propose les recettes de la base qui correspondent le mieux
- Si rien ne correspond, une recette inédite est **assemblée** à partir des meilleures recettes existantes — clairement signalée 🧪
- Notez chaque suggestion de 1 à 5 étoiles : vos notes influencent les prochaines suggestions
- Les recettes assemblées notées 4-5 rejoignent automatiquement votre collection (recherche, filtres, favoris)
- 100% hors-ligne : aucun service externe, la base de recettes est l'unique source
- Technique : nouveau `js/reco.js` (matching par score d'ingrédients → assemblage par patterns → notation persistée en localStorage)

### 📋 Notes de mise à jour complètes
- Le popup « Nouveautés » affiche désormais **toutes** les versions manquées depuis votre dernière visite, pas seulement la dernière
- Ajout de l'entrée v34 manquante dans l'historique in-app

---

## v35 — 2026-06-10

### 🌍 Carte du monde interactive
- Nouvelle carte sur l'accueil : les pays en couleur ont des recettes dans la base
- Survolez un pays pour voir la cuisine et le nombre de recettes
- Cliquez (ou tapez sur mobile) pour filtrer la grille de recettes — re-cliquez pour effacer
- Pays sans recettes en gris neutre, compatible mode sombre, responsive
- Technique : D3.js v7 (CDN), GeoJSON local `geo-data.json` mis en cache hors-ligne
- 🐛 Correction : une virgule orpheline dans `js/data/mexique.js` empêchait le chargement des 17 recettes mexicaines

---

## v34 — 2026-05-08

### 🌍 +237 nouvelles recettes du monde entier
- **Asie** : Japon (17), Chine (16), Corée (12), Vietnam (12), Thaïlande (11), Inde (15), Indonésie (10), Malaisie (10), Philippines (7), Singapour (5), Taïwan (5), Pakistan (5), Bangladesh (3)
- **Amérique latine** : Mexique (14), Pérou (10), Brésil (10), Argentine (10), Colombie (7), Chili (6), Cuba (5), Jamaïque (5)
- **Afrique & Maghreb** : Maroc (9), Tunisie (7), Algérie (6), Éthiopie (6), Sénégal (5), Nigeria (5)
- **Moyen-Orient** : Égypte (4)

La base passe à plus de **1 000 recettes**.

---

## v33 — 2026-05-06

### ⏱ Plusieurs minuteurs en même temps
- Lancez autant de minuteurs que nécessaire pendant la cuisine (ex : sauce 30 min + viande 45 min + oignons 20 min)
- Chaque minuteur a sa propre sonnerie pour les distinguer
- Vibration sur mobile quand le temps est écoulé
- Les minuteurs survivent si vous fermez et rouvrez l'app
- Panneau rétractable en bas à droite, compatible mode sombre

---

## v32 — 2026-05-05

### ✨ 7 améliorations visuelles
- Drapeau du pays plus visible sur la fiche recette
- Plus de drapeau en double sur les cartes du catalogue
- Le bouton panier ne recouvre plus le badge de catégorie
- Le bouton jour/nuit change d'apparence selon le mode actif
- Compteur en temps réel dans la fenêtre de filtres multiples
- Les boutons de la liste de courses ont maintenant des labels clairs (Imprimer, Copier…)
- Le formulaire de création de recette inclut désormais qualité, saison, régimes et tags

---

## v31 — 2026-05-04

### 🛠 10 corrections d'affichage
- Les étoiles de qualité et la note perso ne se chevauchent plus
- Notes personnelles lisibles en mode sombre
- Étoiles de notation bien visibles dans la grille
- Le bouton Frigo bascule correctement vers le catalogue
- Les filtres multiples s'affichent en chips cliquables au-dessus des résultats
- Infobulles au survol des boutons d'action
- Conversion cuillères à soupe/café en mode impérial (tbsp/tsp)
- Recettes récentes lisibles en mode sombre
- Le carrousel met mieux en valeur la recette centrale
- Chaque recette affiche un emoji adapté (🐟 poisson, 🍗 poulet, 🍝 pâtes, 🌮 tacos…)

---

## v30 — 2026-05-04

### 🔴 5 bugs importants corrigés
- Le mode Cuisine fonctionne à nouveau correctement
- Plus de titre en double sur la page d'une recette
- La vue Liste s'affiche de nouveau correctement
- Message clair quand aucune recette ne correspond aux filtres, avec possibilité de les retirer un par un
- Les liens directs vers une recette fonctionnent même avec un format d'identifiant différent

---

## v29 — 2026-05-03

### 📚 Réorganisation des recettes par pays
- Les recettes sont maintenant classées en 21 fichiers par pays ou région
- Aucun changement visible pour vous, mais l'app est plus rapide à mettre à jour

### 🌟 65 recettes réécrites par de grands chefs
- Recettes enrichies avec des techniques de chefs étoilés : Ducasse, Robuchon, Bottura, Ramsay, Acurio, Mallmann…
- Étapes beaucoup plus détaillées avec conseils de pros

---

## v28 — 2026-04-26

### ✨ 21 améliorations de confort
- Accord vin/boisson mis en valeur sur chaque recette
- Sauvegarde automatique des notes personnelles
- Cartes « Pour compléter le repas » agrandies et plus lisibles
- Portions : boutons +/− plus grands pour les écrans tactiles
- Fil d'Ariane plus visible
- Barre de progression du mode Focus améliorée
- Cartes plus réactives au survol
- Infobulles sur les boutons favoris et panier
- Filtre de difficulté avec labels (Facile, Moyen, Difficile…)
- Statistiques dans les réglages redessinées avec couleurs distinctes
- Mode sombre amélioré pour les réglages et les filtres
- Badge compteur de filtres actifs

---

## v27 — 2026-04-26

### 🧭 9 améliorations de navigation
- Boutons d'action mieux organisés sur la fiche recette (Mode cuisine et Favoris en premier)
- Plus de double barre de défilement sur la page d'une recette
- Étoiles de notation bien visibles en mode clair
- Filtres avec un style plus clair (labels discrets, valeurs en doré)
- Navigation par flèches et points dans le carrousel
- Cartes « Récemment consultées » plus détaillées (catégorie, temps, difficulté)
- Page Menu : exemples de menus de la semaine quand c'est vide
- Page Favoris : suggestions du jour quand c'est vide
- Astuce de recherche avancée affichée automatiquement

---

## v26 — 2026-04-25

### 🎨 Refonte visuelle des cartes recettes
- Chaque recette a désormais sa propre carte colorée unique (gradient + emoji + drapeau du pays)
- Fonctionne 100% hors ligne

### 🔧 Corrections
- Le bouton « Créer une recette » fonctionne correctement
- Meilleur contraste sur la photo de la recette
- La recherche de chef est maintenant un champ avec autocomplétion

---

## v25 — 2026-04-25

### 🌟 23 recettes de grands chefs
- Vichyssoise de Louis Diat, Salade Niçoise d'Hélène Barale, Gratin Dauphinois d'Anne-Sophie Pic, Poulet Rôti de Robuchon, Cassoulet de Christian Constant, Pizza Margherita d'Enzo Coccia…
- Chaque recette détaille les techniques professionnelles étape par étape

---

## v24 — 2026-04-25

### 🌍 +142 recettes internationales
- Nouvelles cuisines : Japon, Mexique, Corée, Vietnam, Thaïlande, Inde, Pérou, Brésil, Argentine, Maroc, Tunisie, Éthiopie, Scandinavie…
- Base portée à **794 recettes**

---

## v23 — 2026-04-24

### 🔍 Recherche et filtres avancés
- Recherche par chef, pays, catégorie, ingrédient, exclusion, phrase exacte
- Aide à la recherche avec exemples cliquables (bouton `?`)
- Filtres par saison (Printemps, Été, Automne, Hiver)
- Sélection multiple de pays, catégories ou chefs en même temps
- Transfert de vos données vers un autre appareil par QR code

### ❤️ Favoris et Courses améliorés
- Favoris : onglets Tous/Notés, filtres par tags personnels, édition de tags
- Courses : recherche dans la liste, import rapide des favoris ou du menu de la semaine

---

## v22 — 2026-04-22

### 📋 Notes de mise à jour dans l'app
- Consultez les nouveautés dans Réglages → « Nouveautés »
- Notification automatique des nouvelles versions à l'ouverture

---

## v21 — 2026-04-22

### 🛒 Liste de courses réorganisée
- Les ingrédients consolidés apparaissent en premier, les recettes en dessous

---

## v20 — 2026-04-22

### ✅ Étapes cochables
- Cochez chaque étape de la recette au fur et à mesure, en mode normal ou cuisine
- L'avancement est sauvegardé même si vous fermez l'app
- Impression repensée en format A4 professionnel

### 🔍 Recherche avancée
- Opérateurs : `chef:Bocuse`, `pays:Italie`, `cat:Dessert`, `ing:safran`, `-poisson`, `"crème brûlée"`

### ♿ Accessibilité
- Navigation au clavier améliorée
- Lien « Aller au contenu » pour les lecteurs d'écran

---

## v19 — 2026-04-22

### 🔄 Mises à jour plus fiables
- Bouton « Forcer la mise à jour » dans Réglages
- Les mises à jour s'appliquent immédiatement quand vous êtes en ligne

---

## v18 et antérieures

- Carrousel 3D de recettes saisonnières
- Mode hors ligne complet (PWA installable)
- Mode sombre
- Liste de courses avec export
- Générateur de menus de la semaine
- Minuteur intégré
- Notes personnelles et notation par étoiles

