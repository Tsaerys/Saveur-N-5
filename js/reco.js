// Saveur N°5 — Recommandeur de recettes (Bêta) — v36
// ⚠️ Logique pure, AUCUN accès au DOM (même règle que logic.js).
// Pipeline : matching par ingrédients → assemblage par patterns → notation → persistance.
// Aucun appel réseau : la base RECIPES est l'unique source de données.

// ── PERSISTANCE ────────────────────────────────────────────────────────────
// sn5_reco_ratings : [{key, rating, ingredients, timestamp}]
//   key = id de recette existante OU hash d'une recette assemblée
// sn5_reco_recipes : recettes assemblées notées ≥4 (réinjectées dans le pool actif)
var RECO_RATINGS = lsGet('sn5_reco_ratings', []);
var RECO_RECIPES = lsGet('sn5_reco_recipes', []);

function saveRecoRatings(){ lsSet('sn5_reco_ratings', RECO_RATINGS); }
function saveRecoRecipes(){ lsSet('sn5_reco_recipes', RECO_RECIPES); }

// Fusion des recettes assemblées dans le pool actif — appelé à l'init,
// AVANT tout matching (même mécanisme que initUserRecipes).
function initRecoRecipes(){
  RECO_RECIPES = lsGet('sn5_reco_recipes', []);
  RECO_RECIPES.forEach(function(r){
    if(!r || !r.id || !Array.isArray(r.ig) || typeof r.et !== 'string') return;
    if(!RECIPES.find(function(x){ return x.id === r.id; })) RECIPES.push(r);
  });
}

// ── CONSTANTES ─────────────────────────────────────────────────────────────
var RECO_THRESHOLD = 0.45;  // score effectif minimal pour un "match"
var RECO_MAX_RESULTS = 6;
// Basiques de placard : jamais comptés contre le score (alignés sur TOLERANCE du frigo)
var RECO_PANTRY = ["sel", "poivre", "eau", "huile", "sucre", "farine", "beurre", "ail", "qs", "quantite suffisante"];

// ── NOTES : LOOKUP ─────────────────────────────────────────────────────────
// Dernière note attribuée à une clé (id recette ou hash généré)
function _recoLastRating(key){
  var last = 0;
  for(var i = 0; i < RECO_RATINGS.length; i++){
    if(RECO_RATINGS[i] && RECO_RATINGS[i].key === key) last = RECO_RATINGS[i].rating || 0;
  }
  return last;
}

// Multiplicateur de score selon la dernière note (4-5 boostent, 1-2 pénalisent)
function _recoMultiplier(key){
  var n = _recoLastRating(key);
  if(n >= 5) return 1.3;
  if(n >= 4) return 1.15;
  if(n === 2) return 0.9;
  if(n === 1) return 0.8;
  return 1;
}

// ── 1. MATCHING PAR INGRÉDIENTS ────────────────────────────────────────────
function _recoIsPantry(normName){
  return RECO_PANTRY.some(function(p){ return normName.includes(p); });
}

// Score d'une recette :
//   score = ingrédients correspondants / ingrédients totaux de la recette (hors placard)
//   cover = part des ingrédients UTILISATEUR couverts par la recette
// Le score brut seul pénalise trop les recettes riches (3 ingrédients tapés vs
// recette à 10 ingrédients → 0.3 max) ; la pertinence combine donc les deux.
function recoScoreRecipe(r, normIngs){
  var total = 0, matched = 0, names = [];
  var userHit = normIngs.map(function(){ return false; });
  (r.ig || []).forEach(function(ig){
    var n = _sn5Norm(ig[0] || '');
    if(!n || _recoIsPantry(n)) return;
    total++;
    var hit = false;
    normIngs.forEach(function(i, idx){
      if(n.includes(i) || i.includes(n)){ hit = true; userHit[idx] = true; }
    });
    if(hit){ matched++; names.push(ig[0]); }
  });
  var covered = userHit.filter(Boolean).length;
  var cover = normIngs.length ? covered / normIngs.length : 0;
  if(!total) return { score: 0, cover: 0, matched: 0, total: 0, names: [] };
  return { score: matched / total, cover: cover, matched: matched, total: total, names: names };
}

// Top matches au-dessus du seuil, triés par pertinence effective
// (0.6 × couverture utilisateur + 0.4 × score recette) × multiplicateur de note
function recoMatch(userIngs){
  var ings = (userIngs || []).map(_sn5Norm).filter(Boolean);
  if(!ings.length) return [];
  var out = [];
  RECIPES.forEach(function(r){
    var s = recoScoreRecipe(r, ings);
    if(!s.matched) return;
    var eff = (0.6 * s.cover + 0.4 * s.score) * _recoMultiplier(r.id);
    if(eff >= RECO_THRESHOLD){
      out.push({ r: r, score: s.score, cover: s.cover, eff: eff, matched: s.matched, total: s.total, names: s.names });
    }
  });
  out.sort(function(a, b){ return b.eff - a.eff; });
  return out.slice(0, RECO_MAX_RESULTS);
}

// ── 2. ASSEMBLAGE PAR PATTERNS ─────────────────────────────────────────────
// Méthodes de cuisson détectées dans les étapes (et) — clé → libellé pour le nom
var RECO_METHODS = [
  { kw: /mijot|brais|ragoût|daube|pot-au-feu/i, lbl: "mijoté(e)" },
  { kw: /rôtir|rôti|au four|enfourner|gratiner|gratin/i, lbl: "au four" },
  { kw: /griller|grillade|plancha|barbecue/i, lbl: "grillé(e)" },
  { kw: /sauter|poêle|poêler|revenir|wok/i, lbl: "poêlé(e)" },
  { kw: /vapeur|pocher|bouillir|blanchir/i, lbl: "vapeur" },
  { kw: /frire|friture|paner/i, lbl: "frit(e)" },
  { kw: /cru|tartare|ceviche|carpaccio|mariner sans cuisson/i, lbl: "en marinade" }
];
function _recoDetectMethod(et){
  for(var i = 0; i < RECO_METHODS.length; i++){
    if(RECO_METHODS[i].kw.test(et || '')) return RECO_METHODS[i];
  }
  return null;
}

// Hash déterministe (djb2) → id stable pour une même combinaison ingrédients+modèle
function _recoHash(str){
  var h = 5381;
  for(var i = 0; i < str.length; i++){ h = ((h << 5) + h + str.charCodeAt(i)) | 0; }
  return Math.abs(h).toString(36).toUpperCase();
}

// Quantité plausible pour un ingrédient : médiane des occurrences dans la base
var _recoQtyCache = null;
function _recoTypicalQty(normName){
  if(!_recoQtyCache) _recoQtyCache = {};
  if(_recoQtyCache[normName]) return _recoQtyCache[normName];
  var found = [];
  for(var i = 0; i < RECIPES.length && found.length < 40; i++){
    var igs = RECIPES[i].ig || [];
    for(var j = 0; j < igs.length; j++){
      var n = _sn5Norm(igs[j][0] || '');
      if((n.includes(normName) || normName.includes(n)) && typeof igs[j][1] === 'number' && igs[j][2] !== 'qs'){
        found.push([igs[j][1], igs[j][2]]);
      }
    }
  }
  var res;
  if(found.length){
    // Unité la plus fréquente, puis médiane des quantités pour cette unité
    var byUnit = {};
    found.forEach(function(f){ (byUnit[f[1]] = byUnit[f[1]] || []).push(f[0]); });
    var unit = Object.keys(byUnit).sort(function(a, b){ return byUnit[b].length - byUnit[a].length; })[0];
    var qs = byUnit[unit].sort(function(a, b){ return a - b; });
    res = [qs[Math.floor(qs.length / 2)], unit];
  } else {
    res = [200, 'g']; // fallback générique
  }
  _recoQtyCache[normName] = res;
  return res;
}

// Pool de patterns : recettes notées 4-5 par l'utilisateur, sinon les références qual:5
function _recoPatternPool(){
  var ratedIds = {};
  RECO_RATINGS.forEach(function(e){ if(e && e.rating >= 4) ratedIds[e.key] = true; });
  var rated = RECIPES.filter(function(r){ return ratedIds[r.id]; });
  return rated.length ? rated : RECIPES.filter(function(r){ return r.qual === 5; });
}

// Choix du modèle : meilleure recette partiellement compatible (boost si dans le pool de patterns)
function _recoPickTemplate(normIngs){
  var pool = _recoPatternPool();
  var poolIds = {};
  pool.forEach(function(r){ poolIds[r.id] = true; });
  var best = null, bestScore = -1;
  RECIPES.forEach(function(r){
    if(r.generated) return; // ne jamais assembler à partir d'une recette déjà assemblée
    if(r.cat !== 'Plat' && r.cat !== 'Entrée') return; // assembler un plat cohérent
    var s = recoScoreRecipe(r, normIngs);
    if(!s.matched) return;
    var sc = s.matched + s.score + (poolIds[r.id] ? 0.5 : 0);
    if(sc > bestScore){ bestScore = sc; best = { r: r, s: s }; }
  });
  return best;
}

function _recoCap(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

// Assemble une recette inédite à partir d'un modèle compatible + ingrédients utilisateur.
// Retourne null si aucun modèle exploitable (aucun ingrédient reconnu dans la base).
function recoAssemble(userIngs){
  var ings = (userIngs || []).map(function(s){ return String(s).trim(); }).filter(Boolean);
  var normIngs = ings.map(_sn5Norm);
  var tpl = _recoPickTemplate(normIngs);
  if(!tpl) return null;
  var t = tpl.r;
  var matchedNorm = tpl.s.names.map(_sn5Norm);

  // Ingrédients : on garde ceux du modèle qui matchent ou qui sont des basiques/assaisonnements,
  // on remplace les autres par les ingrédients utilisateur non couverts.
  var keep = [], toReplace = [];
  (t.ig || []).forEach(function(ig){
    var n = _sn5Norm(ig[0] || '');
    if(_recoIsPantry(n) || normIngs.some(function(i){ return n.includes(i) || i.includes(n); })) keep.push(ig.slice());
    else toReplace.push(ig);
  });
  var missingUser = [];
  ings.forEach(function(orig, idx){
    var n = normIngs[idx];
    var covered = keep.some(function(ig){ var k = _sn5Norm(ig[0]); return k.includes(n) || n.includes(k); });
    if(!covered) missingUser.push(orig);
  });
  var swaps = []; // [ancien nom, nouveau nom] pour adapter les étapes
  missingUser.forEach(function(orig, i){
    var q = _recoTypicalQty(_sn5Norm(orig));
    if(i < toReplace.length){
      swaps.push([toReplace[i][0], orig]);
      keep.push([_recoCap(orig), toReplace[i][1], toReplace[i][2]]);
    } else {
      keep.push([_recoCap(orig), q[0], q[1]]);
    }
  });

  // Étapes : celles du modèle, noms d'ingrédients remplacés
  var et = t.et || '';
  swaps.forEach(function(sw){
    var oldName = sw[0], newName = sw[1];
    // Remplace le nom complet puis le premier mot significatif (ex: "Filet de bœuf" → "bœuf")
    var safe = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    et = et.replace(new RegExp(safe, 'gi'), newName);
    var head = oldName.split(' ').filter(function(w){ return w.length > 3; })[0];
    if(head && _sn5Norm(head) !== _sn5Norm(newName)){
      var safeHead = head.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      et = et.replace(new RegExp(safeHead, 'gi'), newName);
    }
  });

  // Nom : ingrédient principal + méthode détectée + accompagnements
  var method = _recoDetectMethod(t.et);
  var main = _recoCap(ings[0] || t.nom);
  var rest = ings.slice(1, 3).join(', ');
  var nom = main + (method ? ' ' + method.lbl : '') + (rest ? ', ' + rest : '') + ' — façon ' + t.nom;

  var hash = _recoHash(normIngs.slice().sort().join('|') + '::' + t.id);
  return {
    id: 'GEN' + hash,
    generated: true,
    _custom: true,
    co: t.co, cat: t.cat, sous: t.sous || '',
    nom: nom,
    chef: 'Assemblage automatique (β)',
    bp: t.bp || 4, prep: t.prep || 20, cui: t.cui || 30,
    diff: t.diff || 2, qual: 1,
    ig: keep.length ? keep : [['Ingrédient', 1, 'qs']],
    et: et,
    vin: t.vin || '',
    notes: 'Recette assemblée automatiquement (Bêta) à partir de « ' + t.nom + ' » (' + t.co + ') et de vos ingrédients : ' + ings.join(', ') + '. Les résultats peuvent être imparfaits.',
    _tpl: t.id
  };
}

// ── 3. NOTATION ────────────────────────────────────────────────────────────
// Enregistre une note 1-5 ; une recette assemblée notée ≥4 rejoint le pool actif.
function recoRate(key, rating, ingredients, rec){
  rating = Math.min(5, Math.max(1, parseInt(rating) || 0));
  if(!key || !rating) return false;
  RECO_RATINGS.push({
    key: key,
    rating: rating,
    ingredients: (ingredients || []).slice(),
    timestamp: new Date().toISOString()
  });
  if(RECO_RATINGS.length > 200) RECO_RATINGS = RECO_RATINGS.slice(-200);
  saveRecoRatings();
  var promoted = false;
  if(rating >= 4 && rec && rec.generated){
    if(!RECO_RECIPES.find(function(x){ return x.id === rec.id; })){
      RECO_RECIPES.push(rec);
      saveRecoRecipes();
      promoted = true;
    }
    if(!RECIPES.find(function(x){ return x.id === rec.id; })){
      RECIPES.push(rec);
      _recipeCountsCache = null; // invalide le cache des comptes (logic.js)
      if(typeof _filteredMemo !== 'undefined' && _filteredMemo.clear) _filteredMemo.clear();
    }
  }
  return promoted;
}
