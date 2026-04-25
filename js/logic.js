// Saveur N°5 — Logique métier
// ⚠️ Ce fichier ne contient AUCUN accès au DOM (pas de getElementById, innerHTML, etc.)
// Uniquement : calculs, filtres, transformations, détections.

// ── INTÉGRITÉ / VALIDATION ─────────────────────────────────────────────────
function validateRecipes(){
  try{
    if(!Array.isArray(RECIPES)){
      console.error("[SN5] RECIPES n'est pas un tableau");
      return false;
    }
    if(RECIPES.length<100){
      console.warn("[SN5] Nombre de recettes anormalement faible:", RECIPES.length);
    }
    let ok=true;
    for(let i=0;i<RECIPES.length;i++){
      const r=RECIPES[i];
      if(!r||typeof r!=="object"){console.warn("[SN5] Recette invalide (non-objet) index",i,r);ok=false;continue;}
      // Champs historiques utilisés par l'app (id/nom/ig/et)
      if(!r.id||typeof r.id!=="string"){console.warn("[SN5] Champ manquant/invalide: id",r);ok=false;}
      if(!r.nom||typeof r.nom!=="string"){console.warn("[SN5] Champ manquant/invalide: nom",r);ok=false;}
      if(!Array.isArray(r.ig)){console.warn("[SN5] Champ manquant/invalide: ig",r);ok=false;}
      if(typeof r.et!=="string"){console.warn("[SN5] Champ manquant/invalide: et",r);ok=false;}

      // Compat: demandes externes (title/ingredients/steps)
      if(r.title===undefined){/* noop */}
      if(r.ingredients===undefined){/* noop */}
      if(r.steps===undefined){/* noop */}
    }
    return ok;
  }catch(e){
    console.warn("[SN5] validateRecipes() erreur:",e);
    return false;
  }
}

function warnRecipeDuplicates(){
  try{
    const seenId=new Set();
    const seenTitle=new Set();
    for(let i=0;i<RECIPES.length;i++){
      const r=RECIPES[i]||{};
      const id=r.id;
      const title=r.title||r.nom;
      if(id){
        if(seenId.has(id))console.warn("[SN5] Doublon d'id:",id);
        seenId.add(id);
      }
      if(title){
        const t=String(title).trim().toLowerCase();
        if(seenTitle.has(t))console.warn("[SN5] Doublon de titre:",title);
        seenTitle.add(t);
      }
    }
  }catch(e){
    console.warn("[SN5] warnRecipeDuplicates() erreur:",e);
  }
}

function mergeNewRecipes(base,next){
  if(!Array.isArray(base))base=[];
  if(!Array.isArray(next))return base;
  const byId=new Set(base.map(r=>r&&r.id).filter(Boolean));
  next.forEach(function(r){
    if(!r||typeof r!=="object")return;
    if(!r.id||typeof r.id!=="string")return;
    if(byId.has(r.id))return;
    if(!Array.isArray(r.ig))return;
    if(typeof r.et!=="string")return;
    base.push(r);
    byId.add(r.id);
  });
  return base;
}

function checkState(){
  try{
    if(typeof S!=="object"||!S){console.warn("[SN5] State absent/invalide");return;}
    if(S.filtered!==undefined && !Array.isArray(S.filtered)){
      console.warn("[SN5] state.filtered devrait être un tableau",S.filtered);
    }
    if(S.filters && typeof S.filters!=="object"){
      console.warn("[SN5] state.filters invalide",S.filters);
    }
  }catch(e){
    console.warn("[SN5] checkState() erreur:",e);
  }
}

// ── HISTORIQUE RECETTES ────────────────────────────────────────────────────
function addRecent(recipeId){
  if(!recipeId||typeof recipeId!=="string")return;
  // Retirer si déjà présent
  RECENT=RECENT.filter(id=>id!==recipeId);
  // Ajouter au début
  RECENT.unshift(recipeId);
  // Garder max 10 récentes
  if(RECENT.length>10)RECENT=RECENT.slice(0,10);
  // Sauvegarder
  saveRecent();
}

// ── HELPERS CALCUL ─────────────────────────────────────────────────────────
function getRayon(nom){
  var nomLower=nom.toLowerCase();
  for(var rayon in RAYON_MAP){
    var keywords=RAYON_MAP[rayon];
    for(var i=0;i<keywords.length;i++){
      if(nomLower.includes(keywords[i]))return rayon;
    }
  }
  return "Divers";
}

function fmtQty(val,unit){
  if(unit==="qs")return "";
  if(S.unit_mode!=="metric"&&UNIT_CONV[unit]){
    const conv=UNIT_CONV[unit];
    if(S.unit_mode==="imperial"){
      if(unit==="g"&&conv.oz){const v=Math.round(val*conv.oz*10)/10;return v.toFixed(1).replace('.0','')+" oz";}
      if(unit==="kg"&&conv.lb){const v=Math.round(val*conv.lb*10)/10;return v.toFixed(1).replace('.0','')+" lb";}
      if(unit==="cl"&&conv["fl oz"]){const v=Math.round(val*conv["fl oz"]*10)/10;return v.toFixed(1).replace('.0','')+" fl oz";}
      if(unit==="ml"&&conv["fl oz"]){const v=Math.round(val*conv["fl oz"]*100)/100;return v.toFixed(2).replace('.00','')+" fl oz";}
    } else if(S.unit_mode==="volume"){
      if(unit==="cl"&&conv.verre){const v=Math.round(val*conv.verre*10)/10;return v.toFixed(1).replace('.0','')+(v>1?" verres":" verre");}
      if(unit==="cs"&&conv.ml)return Math.round(val*conv.ml)+" ml";
      if(unit==="cc"&&conv.ml)return Math.round(val*conv.ml)+" ml";
    }
  }
  if(UNIT_DEC.includes(unit)){const v=Math.round(val);return v===0?"–":v+" "+unit;}
  const r=Math.round(val*2)/2;if(r===0)return "–";
  const num=r===Math.floor(r)?r.toString():r.toFixed(1);
  return num+" "+unit;
}

function totTime(r){return r.prep+r.cui;}
function catClass(cat){return cat.replace(" / "," ").split(" ")[0];}
function diffLabel(d){return d<=1?'Facile':d===2?'Moyen':d===3?'Difficile':'Expert';}
function dots(difficulty){
  const d=Math.min(5,Math.max(1,parseInt(difficulty)||1));
  let html='';
  for(let i=0;i<5;i++){
    html+='<span class="dot'+(i<d?' on':'')+'" style="display:inline-block"></span>';
  }
  return html;
}

function debounce(fn,delay){
  let t;
  return function(...args){clearTimeout(t);t=setTimeout(()=>fn.apply(this,args),delay);}
}

// Échappement HTML pour insertion sûre dans innerHTML / valeurs d'attributs
function attrEscape(s){return String(s==null?"":s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

// Comptes par pays / chef sur RECIPES — mémorisé (RECIPES est statique après init)
var _recipeCountsCache=null;
function getRecipeCounts(){
  if(_recipeCountsCache)return _recipeCountsCache;
  var byCo={},byChef={};
  RECIPES.forEach(function(r){byCo[r.co]=(byCo[r.co]||0)+1;byChef[r.chef]=(byChef[r.chef]||0)+1;});
  var chefList=Object.keys(byChef).sort(function(a,b){return a.localeCompare(b,'fr');});
  _recipeCountsCache={byCo:byCo,byChef:byChef,chefList:chefList};
  return _recipeCountsCache;
}

// ── RECHERCHE : NORMALISATION ──────────────────────────────────────────────
function _sn5Norm(s){
  if(s==null)return "";
  try{
    return String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .trim();
  }catch{
    return String(s).toLowerCase().trim();
  }
}

// ── RÉGIMES ALIMENTAIRES ───────────────────────────────────────────────────
function isVege(r){const ings=r.ig.map(([n])=>n.toLowerCase());return!REGIME_KW.vege.some(kw=>ings.some(i=>i.includes(kw)));}
function isGlutenFree(r){const ings=r.ig.map(([n])=>n.toLowerCase());return!REGIME_KW.gluten.some(kw=>ings.some(i=>i.includes(kw)));}
function isLactoseFree(r){const ings=r.ig.map(([n])=>n.toLowerCase());return!REGIME_KW.lactose.some(kw=>ings.some(i=>i.includes(kw)));}
const SEAFOOD_KW=['homard','langoustin','crevette','palourde','moule','saint-jacque','gambas','poulpe','pieuvre','seiche','calmar','huître','huitre','crabe','tourteau','bigorneau','bulot','praire','fruits de mer'];
const FISH_KW=['saumon','thon','sole ','bar ','anchois','sardine','truite','brochet','congre','grondin','vive ','rascasse','cabillaud','morue','lotte','merlu','turbot','daurade','maquereau','hareng','lieu noir','lieu jaune'];
function isSeafoodFree(r){const ings=r.ig.map(([n])=>n.toLowerCase());return!SEAFOOD_KW.some(kw=>ings.some(i=>i.includes(kw)));}
function isFishFree(r){const ings=r.ig.map(([n])=>n.toLowerCase());return!FISH_KW.some(kw=>ings.some(i=>i.includes(kw)));}

// ── FILTRAGE ───────────────────────────────────────────────────────────────
let _filteredMemo=new Map();
function _filteredKey(){
  try{
    return JSON.stringify({
      f:S.filters,
      fr:S.frigo_active?{a:1,ings:S.frigo_ings,strict:S.frigo_strict}:null,
      um:S.unit_mode,
      c:CART?CART.size:0,
      fv:FAVS?FAVS.size:0
    });
  }catch{
    return String(Date.now());
  }
}

/* Renvoie true si au moins un filtre est actif (includeFrigo = inclure le mode frigo) */
function hasAnyFilter(includeFrigo){
  var f=S.filters;
  return !!(f.co||f.cat||f.diff||f.time||f.q||f.regime||f.qual||f.rayon||f.saison||f.chef||(includeFrigo&&S.frigo_active));
}

/* Réinitialise tous les filtres (hors frigo) */
function clearAllFilters(){
  S.filters.co="";S.filters.cat="";S.filters.diff="";S.filters.time="";
  S.filters.q="";S.filters.regime="";S.filters.qual="";S.filters.rayon="";
  S.filters.sort="";S.filters.saison="";S.filters.chef="";
  var qi=document.getElementById('qi');if(qi)qi.value="";
  renderFilters();renderMain();updateCount();
}

// ── FILTRE SAISON ─────────────────────────────────────────────────────────
// SEASON_DATA (app.js) regroupe les tags par mois ; SEASONS agrège par saison.
const SEASONS=[
  {key:"printemps",label:"Printemps",emoji:"🌸",months:[2,3,4]},
  {key:"ete",      label:"Été",      emoji:"☀️",months:[5,6,7]},
  {key:"automne",  label:"Automne",  emoji:"🍂",months:[8,9,10]},
  {key:"hiver",    label:"Hiver",    emoji:"❄️",months:[11,0,1]}
];
const _SEASON_BY_KEY=Object.fromEntries(SEASONS.map(function(s){return[s.key,s];}));
var _seasonTagsCache={};
function _seasonTags(key){
  if(_seasonTagsCache[key])return _seasonTagsCache[key];
  var s=_SEASON_BY_KEY[key];if(!s)return _seasonTagsCache[key]=[];
  var set=new Set();
  s.months.forEach(function(m){var d=(typeof SEASON_DATA!=='undefined')&&SEASON_DATA[m];if(d&&d.tags)d.tags.forEach(function(t){set.add(t);});});
  _seasonTagsCache[key]=[...set];
  return _seasonTagsCache[key];
}
function _isInSeason(r,key){
  var tags=_seasonTags(key);if(!tags.length)return true;
  var h=(r.nom+' '+(r.sous||'')+' '+r.cat+' '+(r.et||'')).toLowerCase();
  return tags.some(function(t){return h.includes(t);});
}

/* Tri post-filtrage — ne modifie pas le tableau d'origine */
function sortRecipes(recs){
  var s=S.filters.sort||"";
  if(!s)return recs;
  var arr=recs.slice();
  if(s==="nom")arr.sort(function(a,b){return a.nom.localeCompare(b.nom,'fr');});
  else if(s==="time")arr.sort(function(a,b){return totTime(a)-totTime(b);});
  else if(s==="diff")arr.sort(function(a,b){return a.diff-b.diff;});
  else if(s==="rate")arr.sort(function(a,b){return (RATINGS[b.id]||0)-(RATINGS[a.id]||0);});
  else if(s==="qual")arr.sort(function(a,b){return (b.qual||0)-(a.qual||0);});
  return arr;
}

function filtered(){
  const k=_filteredKey();
  if(_filteredMemo.has(k))return _filteredMemo.get(k);

  const {co,cat,diff,time,q,regime,qual,rayon,saison,chef}=S.filters;
  const _arr=v=>v?String(v).split('|').filter(Boolean):[];
  const coArr=_arr(co),catArr=_arr(cat),chefArr=_arr(chef);
  let recs=RECIPES.filter(r=>{
    if(coArr.length&&coArr.indexOf(r.co)<0)return false;
    if(catArr.length&&catArr.indexOf(r.cat)<0)return false;
    if(chefArr.length&&chefArr.indexOf(r.chef)<0)return false;
    if(diff&&r.diff!==+diff)return false;
    if(qual&&r.qual!==+qual)return false;
    if(time){const t=totTime(r);if(time==="30"&&t>30)return false;if(time==="60"&&t>60)return false;if(time==="120"&&t>120)return false;}
    if(regime==="vege"&&!isVege(r))return false;
    if(regime==="gluten"&&!isGlutenFree(r))return false;
    if(regime==="lactose"&&!isLactoseFree(r))return false;
    if(regime==="seafood"&&!isSeafoodFree(r))return false;
    if(regime==="fish"&&!isFishFree(r))return false;
    if(saison&&!_isInSeason(r,saison))return false;
    if(rayon){
      try{
        const rs=(r.ig||[]).map(function(x){return getRayon((x&&x[0])||"");});
        if(!rs.includes(rayon))return false;
      }catch{}
    }
    return true;
  });
  if(S.frigo_active&&S.frigo_ings.length){
    const ings=S.frigo_ings.map(i=>i.toLowerCase());
    const TOLERANCE=["sel","poivre","eau","huile","sucre","farine","beurre","ail"];
    if(S.frigo_strict){
      recs=recs.filter(function(r){
        return r.ig.every(function(ig){
          var n=ig[0].toLowerCase();
          if(TOLERANCE.some(function(t){return n.includes(t);}))return true;
          return ings.some(function(i){return n.includes(i)||i.includes(n);});
        });
      });
    }
    recs=recs.map(r=>{const rn=r.ig.map(([n])=>n.toLowerCase());const m=ings.filter(i=>rn.some(rni=>rni.includes(i)));return{...r,_match:m.length,_mr:m.length/ings.length};}).filter(r=>r._match>0).sort((a,b)=>b._mr-a._mr);
  } else if(q){
    const parsed=_parseSearchQuery(q);
    if(parsed.terms.length||parsed.excludes.length||parsed.ops.length){
      recs=recs.filter(r=>_matchSearch(r,parsed));
    }
  }
  _filteredMemo.set(k,recs);
  if(_filteredMemo.size>200){
    // purge simple (FIFO)
    const first=_filteredMemo.keys().next().value;
    _filteredMemo.delete(first);
  }
  return recs;
}

// ── RECHERCHE AVANCÉE ─────────────────────────────────────────────────────
// Opérateurs supportés :
//   chef:bocuse      → filtre sur le chef
//   pays:france      → filtre sur le pays
//   cat:plat         → filtre sur la catégorie
//   ing:truffe       → filtre sur les ingrédients
//   -word            → exclut les recettes contenant "word"
//   "phrase exacte"  → recherche phrase exacte
//   mot1 mot2        → recherche tous les mots (AND)
function _parseSearchQuery(q){
  var tokens=[],re=/(-?)(\w+):(?:"([^"]+)"|(\S+))|(-?)"([^"]+)"|(-?)(\S+)/g,m;
  while((m=re.exec(q))!==null){
    if(m[2]){tokens.push({op:m[2].toLowerCase(),val:(m[3]||m[4]||""),neg:m[1]==="-"});}
    else if(m[6]){tokens.push({op:"text",val:m[6],neg:m[5]==="-",exact:true});}
    else if(m[8]){tokens.push({op:"text",val:m[8],neg:m[7]==="-"});}
  }
  var terms=[],excludes=[],ops=[];
  tokens.forEach(function(t){
    if(t.op==="text"){(t.neg?excludes:terms).push({val:_sn5Norm(t.val),exact:!!t.exact});}
    else{ops.push({op:t.op,val:_sn5Norm(t.val),neg:t.neg});}
  });
  return{terms:terms,excludes:excludes,ops:ops};
}
function _matchSearch(r,p){
  var n=_sn5Norm(r.nom),c=_sn5Norm(r.chef),s=_sn5Norm(r.sous||""),co=_sn5Norm(r.co),cat=_sn5Norm(r.cat);
  var igs=(r.ig||[]).map(function(x){return _sn5Norm(x[0]||"");});
  var steps=_sn5Norm(r.et||"");
  var hayAll=n+" "+c+" "+s+" "+igs.join(" ")+" "+steps;
  for(var i=0;i<p.ops.length;i++){
    var o=p.ops[i],match=false;
    if(o.op==="chef")match=c.includes(o.val);
    else if(o.op==="pays"||o.op==="co")match=co.includes(o.val);
    else if(o.op==="cat")match=cat.includes(o.val);
    else if(o.op==="ing")match=igs.some(function(x){return x.includes(o.val);});
    else match=hayAll.includes(o.val);
    if(match===o.neg)return false;
  }
  for(var j=0;j<p.terms.length;j++){if(!hayAll.includes(p.terms[j].val))return false;}
  for(var k=0;k<p.excludes.length;k++){if(hayAll.includes(p.excludes[k].val))return false;}
  return true;
}

// ── DÉTECTION PRÉPARATION À L'AVANCE ──────────────────────────────────────
function detectPrepAv(r){
  const items=[];
  const allSteps=r.et.split("\n").filter(s=>s.trim());
  const kws=[/veille/i,/12\s*h/i,/24\s*h/i,/48\s*h/i,/dégorger/i,/mariner/i,/marinade/i,/tremper/i,/réfrigér/i,/j-1/i,/reposer.{0,20}(nuit|heure)/i,/la\s+veille/i];
  allSteps.forEach(s=>{if(kws.some(re=>re.test(s))){const txt=s.replace(/^\d+[\.\)]\s*/,"");items.push(txt);}});
  return items;
}

// ── ACCORDS / SUGGESTIONS ─────────────────────────────────────────────────
function getAccords(r){
  const same=RECIPES.filter(x=>x.id!==r.id&&x.co===r.co);
  const diffCat={Entrée:"Plat",Plat:"Dessert","Sauce / Base":"Plat",Dessert:"Entrée"};
  const complement=diffCat[r.cat]||"Plat";
  const sameChef=same.filter(x=>x.chef===r.chef&&x.cat!==r.cat).slice(0,1);
  const complem=same.filter(x=>x.cat===complement).slice(0,1);
  const sameCountry=same.filter(x=>x.id!==sameChef[0]?.id&&x.id!==complem[0]?.id).slice(0,1);
  return[...sameChef,...complem,...sameCountry].filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i).slice(0,3);
}

// ── COURSES : AGRÉGATION ──────────────────────────────────────────────────
function buildCoursesAgg(){
  var cartRecs=RECIPES.filter(function(r){return CART.has(r.id);});
  var groups={};
  cartRecs.forEach(function(r){
    var factor=(S.portions||4)/r.bp;
    r.ig.forEach(function(ig){
      var nom=ig[0];var qty=ig[1];var unit=ig[2];
      var rayon=getRayon(nom);
      if(!groups[rayon])groups[rayon]=[];
      var existing=groups[rayon].find(function(x){return x.nom===nom&&x.unit===unit;});
      if(existing){existing.qty+=qty*factor;}
      else{groups[rayon].push({nom:nom,qty:qty*factor,unit:unit});}
    });
  });
  return{cartRecs:cartRecs,groups:groups,order:RAYON_ORDER};
}

// opts.plain=true → format sans en-tête/rayons/cases (idéal AnyList / Bring)
function buildCoursesText(opts){
  var plain=opts&&opts.plain;
  var agg=buildCoursesAgg();
  if(plain&&!agg.cartRecs.length)return "";
  var lines=plain?[]:['🛒 Ma liste de courses — Saveur N°5',''];
  agg.order.forEach(function(rayon){
    var items=agg.groups[rayon];
    if(!items||!items.length)return;
    if(!plain)lines.push('── '+rayon+' ──');
    items.forEach(function(item){
      var qty=item.unit==='qs'?'q.s.':fmtQty(item.qty,item.unit);
      var line=item.nom+(qty?' ('+qty+')':'');
      lines.push(plain?line:((CHECKED_ITEMS[item.nom]?'[x] ':'[ ] ')+line));
    });
    if(!plain)lines.push('');
  });
  return lines.join('\n');
}

// ── MENU : GÉNÉRATION ─────────────────────────────────────────────────────
// Contraintes par occasion : difficulté max, temps max (min), multi-plats autorisés
var MENU_OCC_RULES={
  famille:    {maxDiff:3,maxTime:90,  lbl:"Repas en famille"},
  diner:      {maxDiff:4,maxTime:120, lbl:"Dîner entre amis"},
  romantique: {maxDiff:4,maxTime:120, lbl:"Dîner romantique"},
  grande:     {maxDiff:5,maxTime:240, lbl:"Grande occasion"},
  rapide:     {maxDiff:3,maxTime:40,  lbl:"Quotidien rapide",noEntree:true,noDessert:true},
  batch:      {maxDiff:4,maxTime:180, lbl:"Batch cooking",noEntree:true}
};

function generateMenu(){
  const pers=parseInt(document.getElementById("cfg-pers").value)||4;
  const occ=document.getElementById("cfg-occ").value;
  const regime=document.getElementById("cfg-regime").value;
  const jours=parseInt(document.getElementById("cfg-jours").value)||7;
  var rules=MENU_OCC_RULES[occ]||MENU_OCC_RULES.famille;
  const maxDiff=rules.maxDiff;
  const maxTime=rules.maxTime;
  let pool={};
  ["Entrée","Plat","Dessert"].forEach(cat=>{
    pool[cat]=RECIPES.filter(r=>{
      if(r.cat!==cat)return false;
      if(r.diff>maxDiff)return false;
      if(totTime(r)>maxTime)return false;
      if(regime==="vege"&&!isVege(r))return false;if(regime==="gluten"&&!isGlutenFree(r))return false;if(regime==="lactose"&&!isLactoseFree(r))return false;if(regime==="seafood"&&!isSeafoodFree(r))return false;if(regime==="fish"&&!isFishFree(r))return false;
      return true;
    });
  });
  const jrs=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"].slice(0,jours);
  const usedIds=new Set();
  function pick(cat){
    const avail=pool[cat].filter(r=>!usedIds.has(r.id));
    const r=avail.length?avail[Math.floor(Math.random()*avail.length)]:(pool[cat][Math.floor(Math.random()*pool[cat].length)]||null);
    if(r)usedIds.add(r.id);
    return r;
  }
  MENU_DATA={
    pers,occ,occLbl:rules.lbl,regime,
    jours:jrs.map(j=>{
      var day={day:j,plat:pick("Plat")};
      if(!rules.noEntree)day.entree=pick("Entrée");
      if(!rules.noDessert)day.dessert=pick("Dessert");
      return day;
    }).filter(j=>j.plat)
  };
  saveMenuHistory(MENU_DATA);
  renderMenuResult();
}

// ── MENU : HISTORIQUE ─────────────────────────────────────────────────────
function loadMenuHistory(){return lsGet('sn5_menu_history',[])||[];}
function saveMenuHistory(menu){
  if(!menu||!menu.jours||!menu.jours.length)return;
  var hist=loadMenuHistory();
  var entry={
    date:new Date().toISOString(),
    occ:menu.occ,
    occLbl:menu.occLbl||'',
    regime:menu.regime||'',
    pers:menu.pers||4,
    days:menu.jours.length,
    // Stocker uniquement les IDs pour rester léger
    ids:menu.jours.map(function(j){
      return{
        day:j.day,
        entree:j.entree&&j.entree.id,
        plat:j.plat&&j.plat.id,
        dessert:j.dessert&&j.dessert.id
      };
    })
  };
  hist.unshift(entry);
  if(hist.length>5)hist=hist.slice(0,5);
  lsSet('sn5_menu_history',hist);
}
function restoreMenuFromHistory(idx){
  var hist=loadMenuHistory();
  var h=hist[idx];if(!h)return;
  MENU_DATA={
    pers:h.pers,occ:h.occ,occLbl:h.occLbl,regime:h.regime,
    jours:h.ids.map(function(d){
      return{
        day:d.day,
        entree:d.entree?RECIPES.find(function(r){return r.id===d.entree;}):null,
        plat:d.plat?RECIPES.find(function(r){return r.id===d.plat;}):null,
        dessert:d.dessert?RECIPES.find(function(r){return r.id===d.dessert;}):null
      };
    }).filter(function(j){return j.plat;})
  };
  if(typeof renderMenuResult==='function')renderMenuResult();
  if(typeof toast==='function')toast('📅 Menu restauré',2000);
}
function deleteMenuHistory(idx){
  var hist=loadMenuHistory();
  hist.splice(idx,1);
  lsSet('sn5_menu_history',hist);
  if(typeof renderMenuView==='function')renderMenuView();
}

// ── VARIANTES ─────────────────────────────────────────────────────────────
function buildVariantHtml(r){
  if(!r.vars||!r.vars.length)return "";
  var av=S.variant&&S.variant.rId===r.id?S.variant.idx:null;
  var btns=r.vars.map(function(v,i){
    return "<button class='var-btn"+(av===i?" active":"")+"' onclick=\"selectVariant('"+r.id+"',"+i+")\">"+v.nom+"</button>";
  }).join("");
  var desc=av!==null&&r.vars[av]?"<div class='var-desc'>"+r.vars[av].desc+"</div>":"";
  return "<div class='variants-section'><div class='variants-title'>🔀 Variantes</div><div class='var-btns'>"+btns+"</div>"+desc+"</div>";
}

// ── RECETTES UTILISATEUR : ID ──────────────────────────────────────────────
function getUserRecipeNextId(){
  var max=0;
  USER_RECIPES.forEach(function(r){
    var m=r.id.match(/^U(\d+)$/);
    if(m)max=Math.max(max,parseInt(m[1]));
  });
  return 'U'+String(max+1).padStart(3,'0');
}

// ── EXPORT : LOGIQUE DONNÉES ───────────────────────────────────────────────
function _dlBlob(data,filename,type){
  var blob=new Blob([data],{type:type||'application/octet-stream'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download=filename;a.click();
  setTimeout(function(){URL.revokeObjectURL(url);},2000);
}

function exportCatalogue(format){
  if(format==='csv'){
    var lines=['id,nom,pays,categorie,difficulte,temps_total'];
    RECIPES.forEach(function(r){
      lines.push([r.id,'"'+r.nom.replace(/"/g,'""')+'"',r.co,r.cat,r.diff,r.prep+r.cui].join(','));
    });
    _dlBlob(lines.join('\n'),'saveur-n5-catalogue.csv','text/csv;charset=utf-8');
  }else{
    var cat=RECIPES.map(function(r){
      return{id:r.id,nom:r.nom,pays:r.co,categorie:r.cat,difficulte:r.diff,temps:r.prep+r.cui};
    });
    _dlBlob(JSON.stringify(cat,null,2),'saveur-n5-catalogue.json','application/json');
  }
  toast('Catalogue exporte ('+RECIPES.length+' recettes)');
}

// ── SON + VIBRATION (pas de DOM direct) ───────────────────────────────────
function _timerAlertSound(){
  if(navigator.vibrate)navigator.vibrate([300,100,300,100,300]);
  try{
    var ctx=new(window.AudioContext||window.webkitAudioContext)();
    var o=ctx.createOscillator();var g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.frequency.value=880;
    g.gain.setValueAtTime(0.3,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+1.5);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+1.5);
  }catch(e){}
}

function _fallbackCopy(text,okMsg){
  var ta=document.createElement('textarea');
  ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
  document.body.appendChild(ta);ta.focus();ta.select();
  try{document.execCommand('copy');toast(okMsg||'📋 Copié !',2500,'success');}
  catch(e){toast('⚠ Impossible de copier',2500);}
  document.body.removeChild(ta);
}
