// Saveur N°5 — UI (DOM uniquement)

/* ── Filtres rétractables (mobile) ── */
var _filtersOpen = window.matchMedia('(min-width: 640px)').matches;
function toggleFilters(){
  _filtersOpen = !_filtersOpen;
  var body = document.querySelector('.filters-body');
  var btn  = document.querySelector('.filters-toggle-btn');
  if(body) body.classList.toggle('open', _filtersOpen);
  if(btn){
    btn.classList.toggle('open', _filtersOpen);
    btn.setAttribute('aria-expanded', _filtersOpen);
  }
}

function recipeEmoji(cat,nom){
  var nomL=nom.toLowerCase();
  if(nomL.includes('boeuf')||nomL.includes('steak')||nomL.includes('entrecote')||nomL.includes('cote de'))return'🥩';
  if(nomL.includes('poulet')||nomL.includes('volaille')||nomL.includes('canard')||nomL.includes('faisan'))return'🍗';
  if(nomL.includes('agneau')||nomL.includes('mouton'))return'🫙';
  if(nomL.includes('porc')||nomL.includes('jambon')||nomL.includes('lard'))return'🥓';
  if(nomL.includes('saumon')||nomL.includes('thon')||nomL.includes('morue')||nomL.includes('cabillaud')||nomL.includes('lotte')||nomL.includes('truite'))return'🐟';
  if(nomL.includes('crevette')||nomL.includes('homard')||nomL.includes('gambas')||nomL.includes('moule'))return'🦐';
  if(nomL.includes('pate')||nomL.includes('pâtes')||nomL.includes('spaghetti')||nomL.includes('risotto')||nomL.includes('lasagne')||nomL.includes('tagliatelle'))return'🍝';
  if(nomL.includes('pizza')||nomL.includes('calzone'))return'🍕';
  if(nomL.includes('soupe')||nomL.includes('veloute')||nomL.includes('velout')||nomL.includes('bisque')||nomL.includes('potage'))return'🍲';
  if(nomL.includes('salade')||nomL.includes('tabboul'))return'🥗';
  if(nomL.includes('tarte')||nomL.includes('quiche')||nomL.includes('flamm')||nomL.includes('tourte'))return'🥧';
  if(nomL.includes('gateau')||nomL.includes('gâteau')||nomL.includes('cake')||nomL.includes('fondant')||nomL.includes('brownie'))return'🎂';
  if(nomL.includes('glace')||nomL.includes('sorbet')||nomL.includes('gelato'))return'🍦';
  if(nomL.includes('macaron')||nomL.includes('biscuit')||nomL.includes('cookie')||nomL.includes('madeleine'))return'🍪';
  if(nomL.includes('chocolat'))return'🍫';
  if(nomL.includes('crepe')||nomL.includes('crêpe'))return'🥞';
  if(nomL.includes('oeuf')||nomL.includes('omelette')||nomL.includes('souffle'))return'🍳';
  if(nomL.includes('burger')||nomL.includes('sandwich'))return'🍔';
  if(nomL.includes('sushi')||nomL.includes('maki'))return'🍱';
  if(nomL.includes('curry')||nomL.includes('dal')||nomL.includes('masala'))return'🍛';
  if(nomL.includes('taco')||nomL.includes('enchilada'))return'🌮';
  if(nomL.includes('pain')||nomL.includes('brioche')||nomL.includes('naan'))return'🍞';
  if(nomL.includes('couscous')||nomL.includes('tajine'))return'🫕';
  if(nomL.includes('legume')||nomL.includes('légume')||nomL.includes('ratatouille')||nomL.includes('aubergine'))return'🥦';
  if(cat==='Dessert')return'🍰';
  if(cat==='Entrée')return'🥗';
  if(cat==='Sauce / Base')return'🫙';
  return'🍽';
}
function recipeGradient(cat){
  if(cat==='Entrée')return'linear-gradient(135deg,#e8f5e9 0%,#c8e6c9 100%)';
  if(cat==='Plat')return'linear-gradient(135deg,#fff3e0 0%,#ffe0b2 100%)';
  if(cat==='Dessert')return'linear-gradient(135deg,#fce4ec 0%,#f8bbd0 100%)';
  return'linear-gradient(135deg,#f3e5f5 0%,#e1bee7 100%)';
}

function toast(msg,dur,type){
  var t=document.getElementById("toast");
  if(!t)return;
  t.textContent=msg;
  t.className="toast show"+(type?" toast-"+type:"");
  t.style.pointerEvents="none";
  clearTimeout(t._tid);
  t._tid=setTimeout(function(){t.classList.remove("show");},dur||2800);
}

function _pulseBadge(el,n){
  if(!el)return;
  var prev=+el.dataset.prev||0;
  if(n>prev){el.classList.remove("pulse");void el.offsetWidth;el.classList.add("pulse");}
  el.dataset.prev=n;
}
function updateBadges(){
  const fb=document.getElementById("fav-badge"),cb=document.getElementById("cart-badge"),gb=document.getElementById("frigo-badge");
  if(FAVS.size){fb.style.display="flex";fb.textContent=FAVS.size;_pulseBadge(fb,FAVS.size);}else{fb.style.display="none";fb.dataset.prev=0;}
  if(CART.size){cb.style.display="flex";cb.textContent=CART.size;_pulseBadge(cb,CART.size);}else{cb.style.display="none";cb.dataset.prev=0;}
  if(gb){if(S.frigo_ings&&S.frigo_ings.length){gb.style.display="flex";gb.textContent=S.frigo_ings.length;_pulseBadge(gb,S.frigo_ings.length);}else{gb.style.display="none";gb.dataset.prev=0;}}
}

function rateRecipe(id,n){
  RATINGS[id]=RATINGS[id]===n?0:n;
  saveRatings();
  // re-render rating bars in place
  document.querySelectorAll(`.card-rating[data-id="${id}"] .rs`).forEach((el,i)=>{
    el.classList.toggle("on",i<RATINGS[id]);
  });
  if(S.view==="recipe"&&S.recipe?.id===id){
    document.querySelectorAll('.detail-rating-bar .rs').forEach((el,i)=>{
      el.classList.toggle("on",i<RATINGS[id]);
    });
  }
}

// ── MINUTEUR FLOTTANT ─────────────────────────────────────────────────────
function ftStart(sec,label="Minuteur"){
  if(FT.interval){clearInterval(FT.interval);}
  FT.remaining=sec;FT.running=true;FT.label=label;
  document.getElementById("floating-timer").classList.add("active");
  document.getElementById("ft-name").textContent=label;
  document.getElementById("ft-toggle").textContent="⏸ Pause";
  FT.interval=setInterval(()=>{
    FT.remaining--;
    const el=document.getElementById("ft-time");
    if(el)el.textContent=fmtTimerFT(FT.remaining);
    if(FT.remaining<=0){
      clearInterval(FT.interval);FT.interval=null;FT.running=false;
      if(el){el.textContent="✓ Terminé";el.classList.add("done");}
      document.getElementById("ft-toggle").textContent="▶ Relancer";
      toast("⏱ "+label+" — Temps écoulé !",3500);
      _timerAlertSound();
    }
  },1000);
  document.getElementById("ft-time").textContent=fmtTimerFT(sec);
  document.getElementById("ft-time").classList.remove("done");
  toast(`⏱ ${label} démarré (${fmtTimerFT(sec)})`);
}
function ftToggle(){
  if(FT.running){clearInterval(FT.interval);FT.interval=null;FT.running=false;document.getElementById("ft-toggle").textContent="▶ Reprendre";}
  else if(FT.remaining>0){
    FT.running=true;
    FT.interval=setInterval(()=>{
      FT.remaining--;
      const el=document.getElementById("ft-time");
      if(el)el.textContent=fmtTimerFT(FT.remaining);
      if(FT.remaining<=0){clearInterval(FT.interval);FT.interval=null;FT.running=false;if(el){el.textContent="✓ Terminé";el.classList.add("done");}document.getElementById("ft-toggle").textContent="▶ Relancer";toast("⏱ Temps écoulé !",3000);}
    },1000);
    document.getElementById("ft-toggle").textContent="⏸ Pause";
  }
}
function ftClose(){clearInterval(FT.interval);FT.interval=null;FT.running=false;document.getElementById("floating-timer").classList.remove("active");}

// ── VIEWS ─────────────────────────────────────────────────────────────────
function setView(v){
  S.view=v;
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  document.getElementById("nav-"+v)?.classList.add("active");
  const sz=document.getElementById("search-zone");
  const fz=document.getElementById("filters-zone");
  const rz=document.getElementById("recent-zone");
  // Search toujours visible sur les vues principales (browse + favs), masqué ailleurs
  var showSearch=(v==="browse"||v==="favs");
  if(sz)sz.style.display=showSearch?"":"none";
  if(!fz||!rz){console.warn("[SN5] zones manquantes");return;}
  var hz=document.getElementById("helix-zone"),ssz=document.getElementById("seasonal-zone");
  if(hz)hz.style.display=(v==="browse")?"":"none";
  if(ssz)ssz.style.display=(v==="browse")?"":"none";
  if(v==="browse"){
    fz.style.display="";rz.style.display="";
    renderFilters();renderRecent();renderMain();
  }else{
    fz.style.display="none";rz.style.display="none";
    switch(v){
      case "favs":     renderFavs();break;
      case "courses":  renderCourses();break;
      case "menu":     renderMenuView();break;
      case "settings": renderSettings();break;
      case "create":   renderCreateRecipe();break;
      case "edit":     if(S._editId)renderCreateRecipe(S._editId);break;
      default:         console.warn("[SN5] Vue inconnue:",v);
    }
  }
  // Rebind le champ de recherche global pour qu'il route correctement selon la vue
  var qi=document.getElementById("qi");
  if(qi){
    qi.oninput=debounce(function(e){
      var val=e.target.value;
      if(S.view==="favs"){renderFavs(val);}
      else{S.filters.q=val;if(S.view!=="browse"){setView("browse");}else{renderMain();updateCount();}}
    },300);
  }
}
function toggleFrigo(){
  S.frigo_active=!S.frigo_active;
  document.getElementById("nav-frigo").classList.toggle("active",S.frigo_active);
  const fz=document.getElementById("frigo-zone");fz.style.display=S.frigo_active?"":"none";
  if(S.frigo_active)renderFrigo();if(S.view==="browse")renderMain();
}

// ── RECHERCHE VOCALE ──────────────────────────────────────────────────────
function startVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast("Recherche vocale non disponible sur Opera");return;}
  const r=new SR();r.lang="fr-FR";r.interimResults=false;r.maxAlternatives=1;
  const btn=document.getElementById("voice-btn");btn.classList.add("listening");r.start();
  r.onresult=e=>{const txt=e.results[0][0].transcript;document.getElementById("qi").value=txt;S.filters.q=txt;renderMain();updateCount();btn.classList.remove("listening");toast("🎤 "+txt);};
  r.onerror=()=>{btn.classList.remove("listening");toast("Impossible d'utiliser le micro");};
  r.onend=()=>btn.classList.remove("listening");
}

// ── FILTRES RENDER ────────────────────────────────────────────────────────
function renderFilters(){
  var f=S.filters;var co=f.co,cat=f.cat,diff=f.diff,time=f.time,regime=f.regime,qual=f.qual,rayon=f.rayon,sort=f.sort||"",saison=f.saison||"",chef=f.chef||"";
  var hasFilter=hasAnyFilter(false);
  if(hasFilter) _filtersOpen=true;
  var counts=getRecipeCounts();
  const coOpts=COUNTRIES.map(function(c){var n=counts.byCo[c]||0;return'<option value="'+attrEscape(c)+'"'+(co===c?' selected':'')+'>'+(FLAGS[c]||"")+' '+attrEscape(c)+' ('+n+')</option>';}).join("");
  const catOpts=CATS.map(c=>`<option value="${c}"${cat===c?" selected":""}>${c}</option>`).join("");
  const diffOpts=[1,2,3,4,5].map(d=>`<option value="${d}"${diff==d?" selected":""}>${"★".repeat(d)}</option>`).join("");
  const timeOpts=[["30","−30 min"],["60","−1 h"],["120","−2 h"]].map(([v,l])=>`<option value="${v}"${time===v?" selected":""}>${l}</option>`).join("");
  const qualOpts=[1,2,3,4,5].map(d=>`<option value="${d}"${qual==d?" selected":""}>${d} — ${QUAL_LABELS[d]||""}</option>`).join("");
  const rayonOpts=RAYON_ORDER.map(r=>`<option value="${r}"${rayon===r?" selected":""}>${r}</option>`).join("");
  const sortOpts=[["nom","A → Z"],["time","⏱ Plus rapide"],["diff","⭐ Plus facile"],["qual","🏆 Meilleure qualité"],["rate","★ Ma note"]].map(([v,l])=>`<option value="${v}"${sort===v?" selected":""}>${l}</option>`).join("");
  const saisonOpts=SEASONS.map(function(s){return'<option value="'+s.key+'"'+(saison===s.key?' selected':'')+'>'+s.emoji+' '+s.label+'</option>';}).join("");
  // Chef : datalist avec autocomplete (300+ chefs → input cherchable au lieu d'un select monstrueux)
  const chefDatalist=counts.chefList.map(function(c){return'<option value="'+attrEscape(c)+'">'+attrEscape(c)+' ('+counts.byChef[c]+')</option>';}).join("");
  const ratedCount=Object.keys(RATINGS).filter(id=>RATINGS[id]>0).length;
  const n=filtered().length;
  var summaryParts=[];
  if(co) summaryParts.push(co);
  if(cat) summaryParts.push(cat);
  if(chef) summaryParts.push('👨‍🍳 '+chef.split(' ').slice(-1)[0]);
  if(saison){var _s=_SEASON_BY_KEY[saison];if(_s)summaryParts.push(_s.emoji+' '+_s.label.toLowerCase());}
  if(regime) summaryParts.push(regime);
  if(diff) summaryParts.push('★'.repeat(Number(diff)));
  if(time) summaryParts.push('−'+time+' min');
  var summaryTxt = summaryParts.length ? summaryParts.join(' · ') : (n+' recette'+(n>1?'s':''));
  var openClass = _filtersOpen ? ' open' : '';
  var hasClass  = hasFilter ? ' has-filter' : '';
  var clearBtn  = hasFilter ? `<button class="filters-clear-btn" onclick="clearAllFilters()" aria-label="Effacer tous les filtres">✕ Tout effacer</button>` : '';
  var vm=S.view_mode||'grid';
  document.getElementById("filters-zone").innerHTML=`
    <div class="filters-toggle-row">
      <span class="filters-summary">${summaryTxt}</span>
      ${clearBtn}
      <button class="view-mode-btn${vm==='grid'?' active':''}" onclick="setViewMode('grid')" aria-label="Vue grille" aria-pressed="${vm==='grid'}" title="Vue grille">▦</button>
      <button class="view-mode-btn${vm==='list'?' active':''}" onclick="setViewMode('list')" aria-label="Vue liste" aria-pressed="${vm==='list'}" title="Vue liste">☰</button>
      <button class="filters-toggle-btn${openClass}${hasClass}" onclick="toggleFilters()" aria-expanded="${_filtersOpen}" aria-label="Afficher ou masquer les filtres">
        🔍 Filtres <span class="filters-toggle-chevron">▼</span>
      </button>
    </div>
    <div class="filters-body${openClass}">
      <div class="filters-bar">
        <div class="filter-grp"><label>Pays</label><select id="fco"><option value="">Tous les pays</option>${coOpts}</select></div>
        <div class="filter-grp"><label>Catégorie</label><select id="fcat"><option value="">Toutes</option>${catOpts}</select></div>
        <div class="filter-grp"><label>Difficulté</label><select id="fdiff"><option value="">Toutes</option>${diffOpts}</select></div>
        <div class="filter-grp"><label>Temps</label><select id="ftime"><option value="">Tout</option>${timeOpts}</select></div>
        <div class="filter-grp"><label>Qualité <button type="button" class="qual-info-btn" onclick="showQualLegend()" aria-label="Voir l'échelle de qualité" title="Échelle de qualité des sources">ℹ</button></label><select id="fqual"><option value="">Toutes</option>${qualOpts}</select></div>
        <div class="filter-grp"><label>Rayon</label><select id="frayon"><option value="">Tous</option>${rayonOpts}</select></div>
        <div class="filter-grp"><label>Saison</label><select id="fsaison"><option value="">Toutes</option>${saisonOpts}</select></div>
        <div class="filter-grp"><label>Chef</label><div class="chef-input-wrap"><input id="fchef" list="chef-datalist" type="search" placeholder="Tous les chefs…" value="${attrEscape(chef)}" autocomplete="off" aria-label="Filtrer par chef"><datalist id="chef-datalist">${chefDatalist}</datalist>${chef?'<button type="button" class="chef-clear-btn" onclick="document.getElementById(\'fchef\').value=\'\';S.filters.chef=\'\';renderFilters();renderMain();updateCount();" aria-label="Effacer le filtre chef">✕</button>':''}</div></div>
        <div class="filter-grp"><label>&nbsp;</label><button type="button" class="multi-filter-btn" onclick="openMultiFilter()" title="Sélectionner plusieurs pays, catégories ou chefs">🔀 Multi-sélection</button></div>
        <div class="filter-grp"><label>Trier par</label><select id="fsort"><option value="">Pertinence</option>${sortOpts}</select></div>
        <div class="regime-filters">
          <button class="regime-btn${regime==="vege"?" active":""}" aria-pressed="${regime==="vege"}" onclick="setRegime('vege')">🌿 Végétarien</button>
          <button class="regime-btn${regime==="gluten"?" active":""}" aria-pressed="${regime==="gluten"}" onclick="setRegime('gluten')">🌾 Sans gluten</button>
          <button class="regime-btn${regime==="lactose"?" active":""}" aria-pressed="${regime==="lactose"}" onclick="setRegime('lactose')">🥛 Sans lactose</button>
          <button class="regime-btn${regime==="seafood"?" active":""}" aria-pressed="${regime==="seafood"}" onclick="setRegime('seafood')">🦐 Sans fruits de mer</button>
          <button class="regime-btn${regime==="fish"?" active":""}" aria-pressed="${regime==="fish"}" onclick="setRegime('fish')">🐟 Sans poissons</button>
          ${ratedCount>0?`<button class="regime-btn${regime==="rated"?" active":""}" aria-pressed="${regime==="rated"}" onclick="setRegime('rated')">⭐ Mes évaluées (${ratedCount})</button>`:""}
        </div>
        <div class="filter-count">${n} recette${n>1?"s":""}</div>
      </div>
    </div>`;
  document.getElementById("fco").onchange=e=>{S.filters.co=e.target.value;renderFilters();renderMain();updateCount();};
  document.getElementById("fcat").onchange=e=>{S.filters.cat=e.target.value;renderFilters();renderMain();updateCount();};
  document.getElementById("fdiff").onchange=e=>{S.filters.diff=e.target.value;renderFilters();renderMain();updateCount();};
  document.getElementById("ftime").onchange=e=>{S.filters.time=e.target.value;renderFilters();renderMain();updateCount();};
  document.getElementById("fqual").onchange=e=>{S.filters.qual=e.target.value;renderFilters();renderMain();updateCount();};
  document.getElementById("frayon").onchange=e=>{S.filters.rayon=e.target.value;renderFilters();renderMain();updateCount();};
  document.getElementById("fsaison").onchange=e=>{S.filters.saison=e.target.value;renderFilters();renderMain();updateCount();};
  // Chef : input autocomplete — réagit sur change (option choisie) ou input debounced
  var _chefInput=document.getElementById("fchef");
  _chefInput.addEventListener("change",function(e){S.filters.chef=e.target.value.trim();renderFilters();renderMain();updateCount();});
  _chefInput.addEventListener("input",debounce(function(e){
    var v=e.target.value.trim();
    // Ne déclenche le filtre que si la valeur correspond exactement à un chef de la liste
    if(!v||counts.chefList.indexOf(v)>=0){S.filters.chef=v;renderMain();updateCount();}
  },350));
  document.getElementById("fsort").onchange=e=>{S.filters.sort=e.target.value;renderMain();};
  document.getElementById("qi").oninput=debounce(e=>{S.filters.q=e.target.value;renderMain();updateCount();},300);
}

function setViewMode(m){
  S.view_mode=m;
  saveViewMode();
  renderFilters();
  renderMain();
}
function setRegime(r){S.filters.regime=S.filters.regime===r?"":r;renderFilters();renderMain();}
function updateCount(){const el=document.querySelector(".filter-count");if(!el)return;let recs=filtered();if(S.filters.regime==="rated")recs=recs.filter(r=>(RATINGS[r.id]||0)>0);const n=recs.length;el.textContent=`${n} recette${n>1?"s":""}`;}

// ── FRIGO ─────────────────────────────────────────────────────────────────
// Cache du datalist (construit une fois)
var _frigoSuggestions=null;
function _buildFrigoSuggestions(){
  if(_frigoSuggestions)return _frigoSuggestions;
  var set=new Set();
  // Mots-clés de RAYON_MAP (déjà normalisés)
  Object.keys(RAYON_MAP).forEach(function(r){
    RAYON_MAP[r].forEach(function(k){set.add(k.toLowerCase());});
  });
  // Noms d'ingrédients de toutes les recettes (mot principal)
  RECIPES.forEach(function(r){
    (r.ig||[]).forEach(function(ig){
      var n=(ig[0]||'').toLowerCase().trim();
      if(n&&n.length<=30&&!/\d/.test(n))set.add(n);
    });
  });
  _frigoSuggestions=Array.from(set).sort();
  return _frigoSuggestions;
}

function renderFrigo(){
  const tags=S.frigo_ings.map((ing,i)=>`<span class="frigo-tag">${ing}<button aria-label="Retirer ${ing}" onclick="removeIng(${i})">×</button></span>`).join("");
  var opts=_buildFrigoSuggestions().map(function(s){return'<option value="'+s.replace(/"/g,'&quot;')+'">';}).join('');
  document.getElementById("frigo-zone").innerHTML=`
    <div class="frigo-bar">
      <div class="frigo-row-top">
        <span class="frigo-title">🧊 Mon frigo</span>
        <div class="frigo-input-wrap">
          <input type="text" id="frigo-input" list="frigo-ing-list" placeholder="agneau, tomates… (virgule ou Entrée)" onkeydown="if(event.key==='Enter')addIng()" aria-label="Ajouter un ingrédient" autocomplete="off">
          <datalist id="frigo-ing-list">${opts}</datalist>
          <button class="btn-add-ing" onclick="addIng()">Ajouter</button>
        </div>
      </div>
      <label class="frigo-strict-label">
        <input type="checkbox" id="frigo-strict-cb" ${S.frigo_strict?"checked":""} onchange="S.frigo_strict=this.checked;saveFrigo();renderMain();updateCount()">
        <span>Je n'ai <strong>QUE</strong> ces ingrédients</span>
      </label>
      ${S.frigo_ings.length?`
      <div class="frigo-tags-row">
        <div class="frigo-tags">${tags}</div>
        <button class="frigo-clear" onclick="clearIngs()" aria-label="Vider le frigo">✕ Tout vider</button>
      </div>`:''}
    </div>`;
}
function addIng(){var inp=document.getElementById("frigo-input");var raw=inp.value.trim();if(!raw)return;raw.split(/[,\n]+/).map(function(s){return s.trim().toLowerCase();}).filter(Boolean).forEach(function(v){if(!S.frigo_ings.includes(v))S.frigo_ings.push(v);});inp.value="";saveFrigo();renderFrigo();renderMain();updateCount();updateBadges();}
function removeIng(i){S.frigo_ings.splice(i,1);saveFrigo();renderFrigo();renderMain();updateCount();updateBadges();}
function clearIngs(){S.frigo_ings=[];saveFrigo();renderFrigo();renderMain();updateCount();updateBadges();}

// ── PHOTO HELPERS ─────────────────────────────────────────────────────────
// v26 : remplace les images Unsplash dépréciées par des cartes CSS uniques
// par recette (gradient + emoji catégorie + drapeau). Fonctionne offline.
function _userPhoto(id){
  try{return localStorage.getItem('sn5_photo_'+id)||null;}catch(e){return null;}
}
// getPhotoUrl conservée pour compatibilité backups : retourne null par défaut
function getPhotoUrl(r){return null;}

// Hash 32 bits stable de l'ID — détermine angle + variation de teinte
function _hashId(id){
  var h=2166136261;
  for(var i=0;i<id.length;i++){h^=id.charCodeAt(i);h=Math.imul(h,16777619);}
  return h>>>0;
}
// Génère le style d'art unique de la recette (gradient + emoji + drapeau)
var _artCache={};
function _recipeArt(r){
  if(_artCache[r.id])return _artCache[r.id];
  var primary=COUNTRY_COLORS[r.co]||'#9a6f2a';
  var h=_hashId(r.id);
  var angle=(h%18)*20;          // 0,20,40…340°
  var hue=(h>>5)%360;           // teinte secondaire
  var sat=30+((h>>11)%25);      // 30-55%
  var lum=22+((h>>17)%14);      // 22-35% (sombre — texte clair lisible)
  var secondary='hsl('+hue+','+sat+'%,'+lum+'%)';
  var emoji=(typeof PHOTO_EMOJIS!=='undefined'&&PHOTO_EMOJIS[r.cat])||'🍽';
  var flag=(typeof FLAGS!=='undefined'&&FLAGS[r.co])||'';
  var bg='linear-gradient('+angle+'deg, '+primary+' 0%, '+secondary+' 100%)';
  var art={bg:bg,emoji:emoji,flag:flag};
  _artCache[r.id]=art;
  return art;
}
function _artHtml(r,sizeClass,emojiSize){
  var art=_recipeArt(r);
  var s='style="background:'+art.bg+'"';
  return'<div class="'+sizeClass+' recipe-art" '+s+' role="img" aria-label="'+attrEscape(r.nom)+'">'
    +'<span class="recipe-art-emoji" aria-hidden="true"'+(emojiSize?' style="font-size:'+emojiSize+'"':'')+'>'+art.emoji+'</span>'
    +(art.flag?'<span class="recipe-art-flag" aria-hidden="true">'+art.flag+'</span>':'')
    +'</div>';
}
// Si l'utilisateur a uploadé une photo perso → on garde l'image. Sinon, art CSS.
function _photoOrArt(r,imgClass,artClass,emojiSize){
  var url=_userPhoto(r.id);
  if(url)return'<img class="'+imgClass+'" src="'+url+'" alt="'+attrEscape(r.nom)+'" loading="lazy">';
  return _artHtml(r,artClass,emojiSize);
}
function buildCardPhoto(r){return _photoOrArt(r,'card-photo','card-photo recipe-art-card');}
function buildRecentPhoto(r){return _photoOrArt(r,'recent-card-photo','recent-card-photo recipe-art-recent','30px');}
function buildAccordPhoto(r){return _photoOrArt(r,'accord-card-photo','accord-card-photo recipe-art-accord','24px');}
function buildDetailPhoto(r){return _photoOrArt(r,'detail-photo','detail-photo recipe-art-detail','72px');}
function buildMenuPhoto(r){return _photoOrArt(r,'menu-slot-photo','menu-slot-photo recipe-art-menu','22px');}

// ── RÉCENTS ───────────────────────────────────────────────────────────────
function renderRecent(){
  const rz=document.getElementById("recent-zone");
  if(!RECENT.length||!rz){if(rz)rz.innerHTML="";return;}
  const recRecs=RECENT.map(id=>RECIPES.find(r=>r.id===id)).filter(Boolean);
  const cards=recRecs.map(r=>`
    <div class="recent-card" onclick="openRecipe('${r.id}')">
      ${buildRecentPhoto(r)}
      <div class="recent-card-body">
        <div class="recent-card-nom">${r.nom}</div>
        <div class="recent-card-co"><span aria-hidden="true">${FLAGS[r.co]||""}</span> ${r.co}</div>
      </div>
    </div>`).join("");
  rz.innerHTML=`<div class="recent-section"><div class="recent-title">Récemment consultées</div><div class="recent-scroll">${cards}</div></div>`;
}

// ── GRILLE ────────────────────────────────────────────────────────────────
let _sn5MainLastKey="";
let _sn5MainLimit=20;
let _sn5MainObserver=null;
let _sn5MainBusy=false;

function _sn5EnsureLoader(){
  if(document.getElementById("sn5-loader"))return;
  var d=document.createElement("div");
  d.id="sn5-loader";
  d.className="sn5-loader";
  d.innerHTML='<div class="sn5-spinner"></div><div class="sn5-loader-txt">Chargement…</div>';
  document.body.appendChild(d);
}
function _sn5ShowLoader(){_sn5EnsureLoader();var d=document.getElementById("sn5-loader");if(d)d.classList.add("show");}
function _sn5HideLoader(){var d=document.getElementById("sn5-loader");if(d)d.classList.remove("show");}

function renderMain(){
  var loaderTid=null;
  _sn5MainBusy=true;
  loaderTid=setTimeout(function(){if(_sn5MainBusy)_sn5ShowLoader();},100);

  let recs=filtered();
  if(S.filters.regime==="rated")recs=recs.filter(r=>(RATINGS[r.id]||0)>0);
  recs=sortRecipes(recs);

  // reset pagination if filters changed
  var k;
  try{k=JSON.stringify({f:S.filters,fr:S.frigo_active?{a:1,ings:S.frigo_ings,strict:S.frigo_strict}:null,vm:S.view_mode});}catch{k="x";}
  if(k!==_sn5MainLastKey){_sn5MainLastKey=k;_sn5MainLimit=20;}
  const main=document.getElementById("main");
  var bkc=lsGet("sn5_bkc",0)+1;lsSet("sn5_bkc",bkc);
  if(bkc%30===0&&FAVS.size>0&&!getLastBackup()){toast("Astuce : pense a exporter tes favoris depuis une fiche recette",4000);}
  if(!recs.length){
    main.innerHTML=`<div class="empty"><div class="empty-ico">◆</div><p style="font-size:15px;margin-bottom:6px">Aucune recette trouvée</p><small style="font-size:13px;color:var(--text4)">${S.frigo_active&&S.frigo_ings.length?"Essayez de retirer un ingrédient du frigo":"Modifiez vos filtres"}</small></div>`;
    clearTimeout(loaderTid);_sn5MainBusy=false;_sn5HideLoader();
    return;
  }
  const viewRecs=recs.slice(0,_sn5MainLimit);
  var isList=(S.view_mode==='list');
  const cards=viewRecs.map(r=>{
    const isFav=FAVS.has(r.id),inCart=CART.has(r.id);
    const rating=RATINGS[r.id]||0;
    const coCol=COUNTRY_COLORS[r.co]||"#9a6f2a";
    if(isList){
      // Format liste compact : photo miniature + infos linéaires
      return`<div class="list-card" role="article" aria-label="${r.nom}" data-id="${r.id}" style="--co-accent:${coCol}">
        ${buildCardPhoto(r).replace('class="card-photo"','class="list-card-photo"')}
        <div class="list-card-body">
          <div class="list-card-top">
            <span class="cat-badge cat-${catClass(r.cat)}">${r.cat}</span>
            <span class="list-card-co" aria-label="Pays : ${r.co}"><span class="card-co-dot" style="background:${coCol}" aria-hidden="true"></span><span aria-hidden="true">${FLAGS[r.co]||""}</span> ${r.co}</span>
            ${rating?`<span class="card-rate-sum">★ ${rating}/5</span>`:""}
          </div>
          <div class="list-card-nom">${r.nom}</div>
          <div class="list-card-meta">${r.chef} · ⏲ ${totTime(r)} min · ${diffLabel(r.diff)} · ${r.bp} pers.</div>
        </div>
        <div class="list-card-actions">
          <button class="card-fav-btn${isFav?" active":""}${_popClassFav(r.id,isFav)}" aria-label="${isFav?'Retirer des favoris':'Ajouter aux favoris'}" aria-pressed="${isFav}" onclick="event.stopPropagation();toggleFav('${r.id}')">${isFav?"♥":"♡"}</button>
          <button class="card-cart-btn${inCart?" active":""}${_popClassCart(r.id,inCart)}" aria-label="${inCart?'Retirer des courses':'Ajouter aux courses'}" aria-pressed="${inCart}" onclick="event.stopPropagation();toggleCart('${r.id}')">🛒</button>
        </div>
      </div>`;
    }
    let matchExtra="";
    if(S.frigo_active&&r._match!==undefined){const pct=Math.round(r._mr*100);matchExtra=`<div class="match-strip"><div class="match-fill" style="width:${pct}%"></div></div><div class="match-label">${r._match}/${S.frigo_ings.length} ingr. correspondant${r._match>1?"s":""}</div>`;}
    const ratingHtml=`<div class="card-rating" role="group" aria-label="Ma note" data-id="${r.id}">${[1,2,3,4,5].map(i=>`<span class="rs${i<=rating?" on":""}" role="button" tabindex="0" aria-label="${i} étoile${i>1?'s':''}" aria-pressed="${i<=rating}" onclick="event.stopPropagation();rateRecipe('${r.id}',${i})">★</span>`).join("")}</div>`;
    const qlbl=r.qual?`<span class="qual-pill" style="border-color:${QUAL_COLORS[r.qual]||"#aaa"};color:${QUAL_COLORS[r.qual]||"#aaa"}" title="${_qualTooltip(r.qual)}" aria-label="Niveau de qualité : ${QUAL_LABELS[r.qual]||''}">${QUAL_LABELS[r.qual]||""}</span>`:"";
    const ratingFoot=rating?`<span class="card-rate-sum">★ ${rating}/5</span>`:"";
    return`<div class="card" role="article" aria-label="${r.nom}" data-id="${r.id}" style="--co-accent:${coCol}">
      ${buildCardPhoto(r)}
      <button class="card-fav-btn${isFav?" active":""}${_popClassFav(r.id,isFav)}" aria-label="${isFav?'Retirer des favoris':'Ajouter aux favoris'}" aria-pressed="${isFav}" onclick="event.stopPropagation();toggleFav('${r.id}')">${isFav?"♥":"♡"}</button>
      <button class="card-cart-btn${inCart?" active":""}${_popClassCart(r.id,inCart)}" aria-label="${inCart?'Retirer des courses':'Ajouter aux courses'}" aria-pressed="${inCart}" onclick="event.stopPropagation();toggleCart('${r.id}')">🛒</button>
      ${ratingHtml}
      <div class="card-body">
        <div class="card-top">
          <span class="cat-badge cat-${catClass(r.cat)}">${r.cat}</span>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:flex-end">
            ${qlbl}
            ${(totTime(r)<30)?'<span class="badge-express">⏱ Express</span>':''}
            ${isVege(r)?'<span class="badge-vege">🌿 Végé</span>':''}
          </div>
        </div>
        <div class="card-nom">${r.nom}</div>
        <div class="card-chef">${r.chef}</div>
        <div class="card-meta">
          <div class="meta-item"><strong>${totTime(r)}</strong> min</div>
          <div class="meta-item"><strong>${r.bp}</strong> pers.</div>
          <div class="meta-item meta-diff-${r.diff}">${diffLabel(r.diff)}</div>
        </div>
        <div class="card-foot"><span class="card-co" aria-label="Pays : ${r.co}"><span class="card-co-dot" style="background:${coCol}" aria-hidden="true"></span><span aria-hidden="true">${FLAGS[r.co]||""}</span> ${r.co}</span> ${ratingFoot}</div>
        ${matchExtra}
      </div>
    </div>`;
  }).join("");
  const more=recs.length>_sn5MainLimit;
  var wrapCls=isList?'list':'grid';
  main.innerHTML=`<div class="main-content"><div class="${wrapCls}">${cards}</div>${more?'<div id="sn5-sentinel" style="height:1px"></div>':''}</div>`;
  document.querySelectorAll(".card[data-id],.list-card[data-id]").forEach(c=>c.onclick=()=>openRecipe(c.dataset.id));

  if(more){
    if(!_sn5MainObserver){
      _sn5MainObserver=new IntersectionObserver(function(entries){
        const e=entries[0];
        if(!e||!e.isIntersecting)return;
        _sn5MainLimit+=20;
        renderMain();
      },{root:null,threshold:0});
    }
    const s=document.getElementById("sn5-sentinel");
    if(s){
      try{_sn5MainObserver.disconnect();}catch{}
      _sn5MainObserver.observe(s);
    }
  }else{
    if(_sn5MainObserver){try{_sn5MainObserver.disconnect();}catch{}}
  }

  clearTimeout(loaderTid);
  _sn5MainBusy=false;
  _sn5HideLoader();
}

// ── RECETTE ALÉATOIRE ("Surprise") ────────────────────────────────────────
function openRandom(){
  // Utilise la liste filtrée pour proposer une recette cohérente avec le contexte
  var pool=filtered();
  if(S.filters.regime==="rated")pool=pool.filter(function(r){return (RATINGS[r.id]||0)>0;});
  if(!pool||!pool.length)pool=RECIPES;
  var r=pool[Math.floor(Math.random()*pool.length)];
  if(r)openRecipe(r.id);
}

// ── DETAIL ────────────────────────────────────────────────────────────────
function openRecipe(id){
  S.recipe=RECIPES.find(r=>r.id===id);
  S.portions=S.recipe.bp;S.view="recipe";S.unit_mode="metric";
  addRecent(id);
  ["search-zone","filters-zone","frigo-zone","recent-zone","helix-zone","seasonal-zone"].forEach(z=>{var el=document.getElementById(z);if(el)el.style.display="none";});
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
  window.location.hash = 'recette/' + id;
  renderDetail();window.scrollTo(0,0);
}

function renderDetail(){
  const r=S.recipe;const ratio=S.portions/r.bp;
  const isFav=FAVS.has(r.id),inCart=CART.has(r.id);
  const note=NOTES[r.id]||"";
  const rating=RATINGS[r.id]||0;

  const ig=r.ig.map(([n,q,u])=>`
    <li class="ingr-item">
      <span class="ingr-name">${n}</span>
      <span class="ingr-qty">${u==="qs"?"q.s.":fmtQty(q*ratio,u)}</span>
    </li>`).join("");

  const doneSteps=_getDoneSteps(r.id);
  let stepNum=0;
  const steps=r.et.split("\n").filter(s=>s.trim()).map(s=>{
    const isHead=!s.match(/^\d+[\.\)]/);
    if(isHead)return`<div class="etape-item section-head">${s}</div>`;
    stepNum++;
    const stepText=s.replace(/^\d+[\.\)]\s*/,"");
    const tm=stepText.match(/(\d+)\s*(heures?|h\b|minutes?|min\b)/i);
    let timerBtn="";
    if(tm){const num=parseInt(tm[1]);const isH=/^h/i.test(tm[2]);const sec=isH?num*3600:num*60;const lbl=isH?(num>1?num+" heures":"1 heure"):(num>1?num+" min":"1 min");timerBtn=`<br><button class="step-timer-btn" onclick="ftStart(${sec},'Étape ${stepNum} — ${r.nom.split(' ').slice(0,3).join(' ')}')" aria-label="Lancer minuteur ${lbl}">⏱ ${lbl}</button>`;}
    const done=doneSteps.has(stepNum);
    return`<div class="etape-item${done?' step-done':''}" data-step="${stepNum}"><button class="step-check${done?' on':''}" onclick="toggleStepDone('${r.id}',${stepNum},this)" aria-label="Marquer l'étape ${stepNum} comme ${done?'non faite':'faite'}" aria-pressed="${done}" title="${done?'Décocher':'Marquer cette étape comme faite'}">${done?'✓':''}</button><div class="step-num">${stepNum}</div><div class="step-text">${stepText}${timerBtn}</div></div>`;
  }).join("");

  var variantHtml=buildVariantHtml(r);
  const prepAv=detectPrepAv(r);
  const prepAvHtml=prepAv.length?`<div class="prepav-block"><div class="prepav-title">⏰ À préparer à l'avance</div>${prepAv.map(p=>`<div class="prepav-item"><span>📌</span><span>${p}</span></div>`).join("")}</div>`:"";

  const accords=getAccords(r);
  const accordsHtml=accords.length?`<div class="accords-section"><div class="accords-title">✨ Recettes pour compléter le repas</div><div class="accords-grid">${accords.map(a=>`<div class="accord-card" role="button" tabindex="0" aria-label="Voir la recette ${a.nom}" onclick="openRecipe('${a.id}')">${buildAccordPhoto(a)}<div class="accord-card-info"><div class="accord-card-nom">${a.nom}</div><div class="accord-card-lbl"><span class="cat-badge cat-${catClass(a.cat)}" style="font-size:10px;padding:2px 7px">${a.cat}</span> · ${a.chef.split(' ').slice(-1)[0]}</div></div></div>`).join("")}</div></div>`:"";

  const breadcrumb=`<nav class="detail-breadcrumb" aria-label="Fil d'Ariane"><button class="bc-seg" data-bc="">Recettes</button><span class="bc-sep" aria-hidden="true">›</span><button class="bc-seg" data-bc="co" data-bc-val="${attrEscape(r.co)}"><span aria-hidden="true">${FLAGS[r.co]||""}</span> ${attrEscape(r.co)}</button><span class="bc-sep" aria-hidden="true">›</span><button class="bc-seg" data-bc="cat" data-bc-val="${attrEscape(r.cat)}">${attrEscape(r.cat)}</button><span class="bc-sep" aria-hidden="true">›</span><span class="bc-cur" aria-current="page">${attrEscape(r.nom)}</span></nav>`;
  document.getElementById("main").innerHTML=`
    <div class="detail-wrap">
      ${breadcrumb}
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:0">
        <button class="back-btn" onclick="goBack()" aria-label="Retour à la liste des recettes">← Retour</button>
        <div class="detail-actions-bar">
          <button class="act-btn${isFav?" active":""}" aria-label="${isFav?'Retirer des favoris':'Ajouter aux favoris'}" aria-pressed="${isFav}" onclick="toggleFav('${r.id}')">${isFav?"♥ Favori":"♡ Favoris"}</button>
          <button class="act-btn${inCart?" active":""}" aria-label="${inCart?'Retirer des courses':'Ajouter aux courses'}" aria-pressed="${inCart}" onclick="toggleCart('${r.id}')">${inCart?"🛒 Dans la liste":"🛒 Courses"}</button>
          <button class="act-btn" onclick="startCooking()">👨‍🍳 Mode cuisine</button>
          <button class="act-btn" onclick="printRecipe()">🖨 Imprimer</button>
          ${S.recipe&&S.recipe._custom?'<button class="act-btn" onclick="S._editId=S.recipe.id;setView(\'edit\')" aria-label="Modifier">✏️ Modifier</button>':''}

          <button class="act-btn" onclick="shareRecipe(S.recipe.id)" aria-label="Partager ou copier le lien">🔗 Partager</button>
          <button class="act-btn" onclick="exportBackup()" aria-label="Exporter une sauvegarde de mes données">💾 Sauvegarder</button>
          <button class="act-btn" onclick="importBackup()" aria-label="Restaurer une sauvegarde">📥 Restaurer</button>
        </div>
      </div>
      <div class="detail-card" style="margin-top:14px">
        <div class="detail-photo-wrap">
          ${buildDetailPhoto(r)}
          <div class="detail-photo-overlay"></div>
          <div class="detail-photo-title">${r.nom}</div>
          <div class="detail-photo-chef">${r.chef}</div>
          ${r.qual?'<div class="qual-badge" style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.55);border-radius:20px;padding:3px 11px;font-size:11px;color:#fff;letter-spacing:.3px;cursor:help" title="'+_qualTooltip(r.qual)+'" aria-label="Niveau de qualité : '+(QUAL_LABELS[r.qual]||'')+'">'+'★'.repeat(r.qual)+' '+(QUAL_LABELS[r.qual]||'')+'</div>':''}

          <div class="detail-rating-bar" role="group" aria-label="Ma note">${[1,2,3,4,5].map(i=>`<span class="rs${i<=rating?" on":""}" role="button" tabindex="0" aria-label="${i} étoile${i>1?'s':''}" aria-pressed="${i<=rating}" onclick="rateRecipe('${r.id}',${i})">★</span>`).join("")}</div>
        </div>
        <div class="detail-info-row">
          <span class="info-pill" aria-label="Pays : ${r.co}"><span aria-hidden="true">${FLAGS[r.co]||""}</span> ${r.co}</span>
          <span class="info-pill"><span class="cat-badge cat-${catClass(r.cat)}">${r.cat}</span></span>
          <span class="info-pill">⏲ Prépa : ${r.prep} min</span>
          <span class="info-pill">🔥 Cuisson : ${r.cui===0?"Aucune":r.cui+" min"}</span>
          <span class="info-pill">${dots(r.diff)} ${r.diff}/5</span>
          ${isVege(r)?'<span class="info-pill" style="color:#2a7a2a">🌿 Végétarien</span>':""}
          ${isGlutenFree(r)?'<span class="info-pill" style="color:#6a4a1a">🌾 Sans gluten</span>':""}
          ${rating>0?`<span class="info-pill" style="color:#8a6010">${"★".repeat(rating)} Ma note</span>`:""}
        </div>
        <div class="detail-body">
          <div class="col-l">
            <div class="sec-lbl">Ingrédients</div>
            <div class="portions-ctrl">
              <span class="portions-lbl">Personnes</span>
              <button class="qty-btn" aria-label="Réduire les portions" onclick="changePortion(-1)">−</button>
              <span class="qty-val" id="qv" aria-live="polite">${S.portions}</span>
              <button class="qty-btn" aria-label="Augmenter les portions" onclick="changePortion(1)">+</button>
            </div>
            <div class="portions-hint">Base : ${r.bp} pers. · Les quantités s'ajustent automatiquement</div>
            <div class="unit-toggle-bar">
              <span style="font-size:11px;color:var(--text4);font-weight:500">Unités :</span>
              <button class="unit-toggle-btn${S.unit_mode==="metric"?" active":""}" aria-pressed="${S.unit_mode==="metric"}" onclick="setUnitMode('metric')">Métrique</button>
              <button class="unit-toggle-btn${S.unit_mode==="imperial"?" active":""}" aria-pressed="${S.unit_mode==="imperial"}" onclick="setUnitMode('imperial')">Impérial</button>
              <button class="unit-toggle-btn${S.unit_mode==="volume"?" active":""}" aria-pressed="${S.unit_mode==="volume"}" onclick="setUnitMode('volume')">Volumes</button>
            </div>
            <ul class="ingr-list" id="ingr-list">${ig}</ul>
            ${variantHtml}
          ${prepAvHtml}
            <div class="vin-block"><div class="vin-lbl">Accord vin / boisson</div><div class="vin-txt">${r.vin}</div></div>
            <div class="notes-box">${r.notes}</div>
            <div style="margin-top:12px">
              <div class="pnotes-lbl">Mes notes personnelles</div>
              <textarea class="pnotes-ta" id="pnotes-ta" placeholder="Vos variantes, observations, astuces personnelles…">${note}</textarea>
              <div style="display:flex;align-items:center">
                <button class="pnotes-save" aria-label="Sauvegarder mes notes personnelles" onclick="saveNote('${r.id}')">Sauvegarder</button>
                <span id="pnotes-saved" class="pnotes-saved">✓ Sauvegardé</span>
              </div>
            </div>
          </div>
          <div class="col-r">
            <div class="sec-lbl" style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
              <span>Étapes de préparation</span>
              ${doneSteps.size?`<button class="step-reset-btn" onclick="resetSteps('${r.id}')" aria-label="Réinitialiser toutes les étapes">↺ Réinitialiser (${doneSteps.size} faite${doneSteps.size>1?'s':''})</button>`:''}
            </div>
            <div>${steps}</div>
          </div>
        </div>
        ${accordsHtml}
        <div class="print-footer">Saveur N°5 · ${r.nom} · ${r.chef} · ${r.co} · Imprimé le ${new Date().toLocaleDateString('fr-FR')}</div>
      </div>
    </div>`;
  var bc=document.querySelector(".detail-breadcrumb");
  if(bc)bc.addEventListener("click",function(e){
    var btn=e.target.closest(".bc-seg");if(!btn)return;
    bcFilter(btn.dataset.bc||"",btn.dataset.bcVal||"");
  });
}

function printRecipe(){window.print();}
function changePortion(d){S.portions=Math.max(1,S.portions+d);document.getElementById("qv").textContent=S.portions;updateIngrList();}
function setUnitMode(m){S.unit_mode=m;renderDetail();}
function updateIngrList(){
  const r=S.recipe;const ratio=S.portions/r.bp;
  document.getElementById("ingr-list").innerHTML=r.ig.map(([n,q,u])=>`<li class="ingr-item"><span class="ingr-name">${n}</span><span class="ingr-qty">${u==="qs"?"q.s.":fmtQty(q*ratio,u)}</span></li>`).join("");
}

function goBack(){
  S.view="browse";
  if(window.location.hash)history.pushState('',document.title,window.location.pathname+window.location.search);
  document.getElementById("search-zone").style.display="";
  document.getElementById("filters-zone").style.display="";
  if(S.frigo_active)document.getElementById("frigo-zone").style.display="";
  document.getElementById("recent-zone").style.display="";
  ["helix-zone","seasonal-zone"].forEach(function(z){var el=document.getElementById(z);if(el)el.style.display="";});
  document.getElementById("nav-browse").classList.add("active");
  renderFilters();renderRecent();renderMain();updateCount();
  // Restore search input binding for browse view
  var qi=document.getElementById("qi");
  if(qi){
    qi.oninput=debounce(function(e){S.filters.q=e.target.value;renderMain();updateCount();},300);
  }
}
function bcFilter(key,val){
  clearAllFilters();
  if(key==="co")S.filters.co=val;
  else if(key==="cat")S.filters.cat=val;
  else if(key==="chef")S.filters.chef=val;
  goBack();
  if(S.view==="browse"){renderFilters();renderMain();updateCount();}
}
function _haptic(added){if(navigator.vibrate)try{navigator.vibrate(added?[10,30,15]:10);}catch(e){}}
function _qualTooltip(q){
  var desc={
    1:"★ Source locale : recette personnelle ou familiale",
    2:"★★ Recette courante : version classique, non sourcée",
    3:"★★★ Bonne source : chef reconnu ou livre fiable",
    4:"★★★★ Référence reconnue : institution culinaire majeure",
    5:"★★★★★ Référence absolue : maître ou ouvrage canonique"
  };
  return desc[q]||(QUAL_LABELS[q]||"");
}
function _qualLegendHTML(){
  return[1,2,3,4,5].map(function(q){
    return'<div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--bord)"><span style="color:'+(QUAL_COLORS[q]||"#aaa")+';font-weight:700;width:60px;flex-shrink:0">'+"★".repeat(q)+'</span><span style="font-size:13px">'+_qualTooltip(q).replace(/^★+\s+/,"")+'</span></div>';
  }).join("");
}
// Modale générique réutilisée par toutes les boîtes de dialogue (qual, recherche, multi-filtre, QR).
// `onMount` reçoit ({overlay, body, close}) pour câbler les listeners internes après insertion.
function _makeModal(opts){
  var titleId=opts.titleId||("modal-"+Math.random().toString(36).slice(2,8));
  var maxW=opts.maxWidth?(' style="max-width:'+opts.maxWidth+'px"'):'';
  var ov=document.createElement("div");
  ov.className="qual-legend-overlay";
  ov.innerHTML='<div class="qual-legend-card" role="dialog" aria-modal="true" aria-labelledby="'+titleId+'"'+maxW+'><div class="qual-legend-head"><strong id="'+titleId+'">'+opts.title+'</strong><button class="qual-legend-close" aria-label="Fermer">✕</button></div><div class="qual-legend-body">'+(opts.body||"")+'</div></div>';
  document.body.appendChild(ov);
  var body=ov.querySelector(".qual-legend-body");
  var close=function(){if(!ov.parentNode)return;ov.remove();document.removeEventListener("keydown",onKey);};
  var onKey=function(e){if(e.key==="Escape")close();};
  ov.addEventListener("click",function(e){if(e.target===ov||e.target.classList.contains("qual-legend-close"))close();});
  document.addEventListener("keydown",onKey);
  ov._close=close;
  if(typeof opts.onMount==="function")opts.onMount({overlay:ov,body:body,close:close});
  return{overlay:ov,body:body,close:close};
}
function showQualLegend(){
  _makeModal({
    titleId:"ql-title",
    title:"Échelle de qualité des sources",
    body:_qualLegendHTML()+'<p style="margin-top:10px;font-size:11.5px;color:var(--text3);font-style:italic">La qualité reflète la fiabilité et la reconnaissance de la source, pas la difficulté ni le goût.</p>'
  });
}
// Filtres multi-sélection (pays / cat / chef) — modale avec chips cochables
function openMultiFilter(){
  var counts=getRecipeCounts();
  var renderBody=function(body){
    var coArr=(S.filters.co||"").split('|').filter(Boolean);
    var catArr=(S.filters.cat||"").split('|').filter(Boolean);
    var chefArr=(S.filters.chef||"").split('|').filter(Boolean);
    var section=function(lbl,items,arr,key,fmt){
      var chips=items.map(function(v){
        var on=arr.indexOf(v)>=0;
        return'<button class="mf-chip'+(on?' active':'')+'" data-mf-key="'+key+'" data-mf-val="'+attrEscape(v)+'">'+(fmt?fmt(v):attrEscape(v))+'</button>';
      }).join("");
      return'<div class="mf-section"><div class="mf-lbl">'+lbl+'</div><div class="mf-chips">'+chips+'</div></div>';
    };
    body.innerHTML=section("🌍 Pays",COUNTRIES,coArr,"co",function(c){return(FLAGS[c]||"")+" "+attrEscape(c)+" ("+(counts.byCo[c]||0)+")";})
      +section("🍽 Catégories",CATS,catArr,"cat")
      +section("👨‍🍳 Chefs",counts.chefList,chefArr,"chef",function(c){return attrEscape(c)+" ("+counts.byChef[c]+")";})
      +'<p style="margin-top:14px;font-size:11.5px;color:var(--text3);font-style:italic">Sélectionnez autant de valeurs que vous le souhaitez dans chaque catégorie.</p>';
  };
  _makeModal({
    titleId:"mf-title",
    title:"Filtres multi-sélection",
    maxWidth:620,
    onMount:function(m){
      renderBody(m.body);
      m.body.addEventListener("click",function(e){
        var btn=e.target.closest(".mf-chip");if(!btn)return;
        var key=btn.dataset.mfKey,val=btn.dataset.mfVal;
        var cur=(S.filters[key]||"").split('|').filter(Boolean);
        var i=cur.indexOf(val);
        if(i>=0)cur.splice(i,1);else cur.push(val);
        S.filters[key]=cur.join('|');
        renderFilters();renderMain();updateCount();
        renderBody(m.body);
      });
    }
  });
}
// Aide recherche avancée — exemples cliquables
var _SEARCH_EXAMPLES=[
  {op:"chef:ducasse",   desc:"Toutes les recettes du chef Ducasse"},
  {op:"pays:italie",    desc:"Cuisine italienne"},
  {op:"cat:dessert",    desc:"Catégorie desserts"},
  {op:"ing:truffe",     desc:"Recettes avec de la truffe"},
  {op:"-porc",          desc:"Exclure les recettes contenant « porc »"},
  {op:"\"crème brûlée\"", desc:"Recherche d'une phrase exacte"},
  {op:"chef:bocuse pays:france", desc:"Combinaison d'opérateurs"},
  {op:"ing:chocolat -sucre", desc:"Chocolat, sans mot « sucre »"}
];
function runSearchExample(q){
  var ov=document.querySelector(".qual-legend-overlay");
  if(ov&&typeof ov._close==="function")ov._close();else if(ov)ov.remove();
  var qi=document.getElementById("qi");if(!qi)return;
  qi.value=q;
  S.filters.q=q;
  if(S.view!=="browse")setView("browse");
  else{renderMain();updateCount();}
  qi.focus();
}
function showSearchHelp(){
  var rows=_SEARCH_EXAMPLES.map(function(e){
    return'<div class="search-help-row" role="button" tabindex="0" data-q="'+attrEscape(e.op)+'"><code class="search-help-op">'+attrEscape(e.op)+'</code><span class="search-help-desc">'+attrEscape(e.desc)+'</span></div>';
  }).join("");
  _makeModal({
    titleId:"sh-title",
    title:"Aide — Recherche avancée",
    maxWidth:520,
    body:'<p style="margin:0 0 10px;font-size:12.5px;color:var(--text2)">Cliquez sur un exemple pour l\'essayer :</p>'+rows+'<p style="margin-top:12px;font-size:11.5px;color:var(--text3);font-style:italic">Combinez les opérateurs en les séparant par un espace.</p>',
    onMount:function(m){
      var act=function(row){if(row&&row.dataset&&row.dataset.q)runSearchExample(row.dataset.q);};
      m.body.addEventListener("click",function(e){act(e.target.closest(".search-help-row"));});
      m.body.addEventListener("keydown",function(e){
        if(e.key!=="Enter"&&e.key!==" ")return;
        var row=e.target.closest(".search-help-row");if(!row)return;
        e.preventDefault();act(row);
      });
    }
  });
}
function _getDoneSteps(id){var a=STEPS_DONE[id];return new Set(Array.isArray(a)?a:[]);}
function _markStepDone(id,n,done){
  var set=_getDoneSteps(id);
  if(done)set.add(n);else set.delete(n);
  if(set.size)STEPS_DONE[id]=[...set];else delete STEPS_DONE[id];
  saveStepsDone();
}
function toggleStepDone(id,n,btn){
  var cur=_getDoneSteps(id).has(n);
  _markStepDone(id,n,!cur);
  if(btn){
    btn.classList.toggle("on",!cur);
    btn.textContent=!cur?"✓":"";
    btn.setAttribute("aria-pressed",!cur);
    var item=btn.closest(".etape-item");if(item)item.classList.toggle("step-done",!cur);
  }
  _haptic(!cur);
}
function resetSteps(id){
  delete STEPS_DONE[id];saveStepsDone();
  if(S.view==="recipe")renderDetail();
  toast("Étapes réinitialisées");
}
var _popFav=null,_popCart=null;
function _popClassFav(id,isFav){return(isFav&&_popFav===id)?" just-pop":"";}
function _popClassCart(id,inCart){return(inCart&&_popCart===id)?" just-pop":"";}
function toggleFav(id){
  var added=!FAVS.has(id);
  if(added){FAVS.add(id);toast("♥ Ajouté aux favoris");_popFav=id;}
  else{FAVS.delete(id);toast("Retiré des favoris");_popFav=null;
    if(FAV_TAGS[id]){delete FAV_TAGS[id];saveFavTags();}
  }
  saveFavs();updateBadges();_haptic(added);
  if(S.view==="recipe")renderDetail();else if(S.view==="favs")renderFavs();else renderMain();
  _popFav=null;
}
function toggleCart(id){
  var added=!CART.has(id);
  if(added){CART.add(id);toast("🛒 Ajouté à la liste de courses");_popCart=id;}else{CART.delete(id);toast("Retiré de la liste de courses");_popCart=null;}
  saveCart();updateBadges();_haptic(added);
  if(S.view==="recipe")renderDetail();else if(S.view==="courses")renderCourses();else renderMain();
  _popCart=null;
}
function saveNote(id){
  NOTES[id]=document.getElementById("pnotes-ta").value;saveNotes();
  const el=document.getElementById("pnotes-saved");el.style.opacity=1;setTimeout(()=>el.style.opacity=0,1800);
}

// ── MODE CUISINE ──────────────────────────────────────────────────────────
function startCooking(){
  if(navigator.wakeLock){navigator.wakeLock.request("screen").then(function(wl){_wakeLock=wl;}).catch(function(){});}

  const r=S.recipe;
  const rawSteps=r.et.split("\n").filter(s=>s.trim());
  const steps=rawSteps.filter(s=>s.match(/^\d+[\.\)]/));
  const prepAv=detectPrepAv(r);
  S.cooking={recipe:r,steps,portions:S.portions,prepAv};
  S.cooking_step=0;S.timer_interval=null;S.timer_remaining=0;S.timer_running=false;
  renderCooking();
}
function renderCooking(){
  const {recipe:r,steps,portions,prepAv}=S.cooking;
  const ratio=portions/r.bp;
  const si=S.cooking_step;const step=steps[si];
  const pct=Math.round(((si+1)/steps.length)*100);
  const stepDone=_getDoneSteps(r.id).has(si+1);
  const tm=step?.match(/(\d+)\s*(heures?|h\b|minutes?|min\b)/i);
  let timerSec=0;if(tm){const n=parseInt(tm[1]);timerSec=/^h/i.test(tm[2])?n*3600:n*60;}
  if(S.timer_remaining===0&&timerSec>0)S.timer_remaining=timerSec;
  const tStr=fmtTimerFT(S.timer_remaining);
  const tCls=S.timer_running?"running":(S.timer_remaining===0&&timerSec>0?"done":"");
  const igList=r.ig.map(([n,q,u])=>`<li><span>${n}</span><span class="iq">${u==="qs"?"q.s.":fmtQty(q*ratio,u)}</span></li>`).join("");
  const prepAvHtml=si===0&&prepAv.length?`<div class="cooking-prepav"><div class="cooking-prepav-title">⏰ À préparer à l'avance</div>${prepAv.map(p=>`<div class="cooking-prepav-item">📌 ${p}</div>`).join("")}</div>`:"";
  document.getElementById("cooking-overlay").innerHTML=`
    <div class="cooking-mode" id="cm">
      <div class="cooking-hdr">
        <div class="cooking-nom">${r.nom}</div>
        <div class="cooking-prog"><div class="cooking-prog-fill" style="width:${pct}%"></div></div>
        <span style="font-size:12px;color:var(--text3);flex-shrink:0">${si+1}/${steps.length}</span>
        <button class="cooking-close" onclick="closeCooking()">✕ Quitter</button>
      </div>
      <div class="cooking-body">
        ${prepAvHtml}
        <details class="cooking-ingredients">
          <summary>🧂 Ingrédients pour ${portions} pers.</summary>
          <ul>${igList}</ul>
        </details>
        <div class="cooking-step-counter">Étape ${si+1} sur ${steps.length}</div>
        <div class="cooking-step-row">
          <button class="step-check big${stepDone?' on':''}" onclick="toggleStepDone('${r.id}',${si+1},this);renderCooking()" aria-label="${stepDone?'Décocher cette étape':'Marquer cette étape comme faite'}" aria-pressed="${stepDone}">${stepDone?'✓':''}</button>
          <div class="cooking-step-text${stepDone?' step-done':''}">${step?.replace(/^\d+[\.\)]\s*/,"")}</div>
        </div>
        ${timerSec>0?`<div class="cooking-timer-zone">
          <div class="timer-display ${tCls}" id="cm-timer">${tStr}</div>
          <div class="timer-btns">
            <button class="timer-btn primary" onclick="cookToggleTimer(${timerSec})">${S.timer_running?"⏸ Pause":"▶ Démarrer"}</button>
            <button class="timer-btn" onclick="cookResetTimer(${timerSec})">↺ Réinitialiser</button>
            <button class="timer-btn" onclick="sendToFloat(${timerSec},'${r.nom.split(' ').slice(0,2).join(' ')} – Ét.${si+1}')">📌 Flottant</button>
          </div>
        </div>`:""}
      </div>
      <div class="cooking-nav">
        <button class="cook-nav-btn" onclick="cookStep(-1)" ${si===0?"disabled":""}>← Précédent</button>
        <button class="cook-nav-btn primary" onclick="cookStep(1)">${si===steps.length-1?"✓ Terminé":"Suivant →"}</button>
      </div>
    </div>`;
}
function sendToFloat(sec,label){ftStart(sec,label);}
function cookStep(d){
  const {recipe,steps}=S.cooking;const next=S.cooking_step+d;
  if(next<0)return;
  if(d>0){_markStepDone(recipe.id,S.cooking_step+1,true);}
  if(next>=steps.length){closeCooking();toast("✓ Recette terminée ! Bon appétit !",3000);return;}
  if(S.timer_interval){clearInterval(S.timer_interval);S.timer_interval=null;}
  S.timer_running=false;S.timer_remaining=0;S.cooking_step=next;renderCooking();
}
function cookToggleTimer(total){
  if(S.timer_remaining===0)S.timer_remaining=total;
  if(S.timer_running){clearInterval(S.timer_interval);S.timer_interval=null;S.timer_running=false;}
  else{
    S.timer_running=true;
    S.timer_interval=setInterval(()=>{
      S.timer_remaining--;
      const el=document.getElementById("cm-timer");
      if(el){el.textContent=fmtTimerFT(S.timer_remaining);
        if(S.timer_remaining<=0){clearInterval(S.timer_interval);S.timer_interval=null;S.timer_running=false;if(el){el.textContent="✓ 0:00";el.className="timer-display done";}toast("⏱ Temps écoulé !",3000);}}
    },1000);
  }
  renderCooking();
}
function cookResetTimer(total){if(S.timer_interval){clearInterval(S.timer_interval);S.timer_interval=null;}S.timer_running=false;S.timer_remaining=total;renderCooking();}
function closeCooking(){
  if(_wakeLock){_wakeLock.release().catch(function(){});_wakeLock=null;}
if(S.timer_interval){clearInterval(S.timer_interval);S.timer_interval=null;}S.timer_running=false;S.cooking=null;document.getElementById("cooking-overlay").innerHTML="";}

// ── MENU DE LA SEMAINE ────────────────────────────────────────────────────
function renderMenuView(){
  var hist=loadMenuHistory();
  var histHtml='';
  if(hist.length){
    histHtml='<div class="menu-history"><div class="menu-history-title">📜 Menus récents</div><div class="menu-history-list">'
      +hist.map(function(h,i){
        var d=new Date(h.date);
        var dateStr=d.toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
        return'<div class="menu-history-item">'
          +'<div class="mh-info"><div class="mh-date">'+dateStr+'</div>'
          +'<div class="mh-lbl">'+(h.occLbl||h.occ||'')+' · '+h.days+'j · '+h.pers+' pers.</div></div>'
          +'<button class="act-btn mh-restore" onclick="restoreMenuFromHistory('+i+')">↻ Restaurer</button>'
          +'<button class="mh-del" onclick="deleteMenuHistory('+i+')" aria-label="Supprimer">✕</button>'
          +'</div>';
      }).join('')
      +'</div></div>';
  }
  document.getElementById("main").innerHTML=`
    <div class="menu-wrap">
      <div class="page-title">📅 Menu de la semaine</div>
      <div class="page-sub">Générez un menu équilibré et sa liste de courses en un clic</div>
      <div class="menu-config">
        <div class="config-grp"><label>Personnes</label><input type="number" id="cfg-pers" value="4" min="1" max="20"></div>
        <div class="config-grp"><label>Occasion</label><select id="cfg-occ">
          <option value="rapide">⏱ Quotidien rapide</option>
          <option value="famille" selected>👨‍👩‍👧 Repas en famille</option>
          <option value="batch">🥘 Batch cooking</option>
          <option value="diner">🍷 Dîner entre amis</option>
          <option value="romantique">💞 Dîner romantique</option>
          <option value="grande">🎉 Grande occasion</option>
        </select></div>
        <div class="config-grp"><label>Régime</label><select id="cfg-regime"><option value="">Aucun</option><option value="vege">Végétarien</option><option value="gluten">Sans gluten</option><option value="lactose">Sans lactose</option><option value="seafood">Sans fruits de mer</option><option value="fish">Sans poissons</option></select></div>
        <div class="config-grp"><label>Jours</label><select id="cfg-jours"><option value="3">3 jours</option><option value="5">5 jours</option><option value="7" selected>7 jours</option></select></div>
        <button class="btn-gen-menu" onclick="generateMenu()">✨ Générer le menu</button>
      </div>
      ${histHtml}
      <div id="menu-result"></div>
    </div>`;
  if(MENU_DATA)renderMenuResult();
}

function renderMenuResult(){
  if(!MENU_DATA){document.getElementById("menu-result").innerHTML="";return;}
  const html=MENU_DATA.jours.map((j,ji)=>{
    // Slots réellement présents (entrée et dessert sont optionnels selon l'occasion)
    var slots=[];
    if(j.entree) slots.push(["Entrée",j.entree,"entree"]);
    slots.push(["Plat",j.plat,"plat"]);
    if(j.dessert) slots.push(["Dessert",j.dessert,"dessert"]);
    const allInCart=slots.every(function(s){return CART.has(s[1].id);});
    return`<div class="menu-day">
      <div class="menu-day-hdr">
        <div class="menu-day-title">${j.day}</div>
        <button class="menu-courses-btn${allInCart?" added":""}" onclick="addMenuToCourses(${ji})">${allInCart?"✓ Dans les courses":"🛒 Ajouter aux courses"}</button>
      </div>
      <div>
        ${slots.map(function(s){
          var type=s[0],r=s[1],field=s[2];
          return`
          <div class="menu-slot">
            <span class="menu-slot-type">${type}</span>
            <div class="menu-slot-recipe" onclick="openRecipe('${r.id}')">
              ${buildMenuPhoto(r)}
              <div class="menu-slot-info">
                <div class="menu-slot-nom">${r.nom}</div>
                <div class="menu-slot-meta">${r.chef.split(' ').slice(-1)[0]} · ${totTime(r)} min · diff ${r.diff}/5</div>
              </div>
            </div>
            <button class="menu-slot-change" onclick="changeMenuSlot(${ji},'${field}','${type}')" aria-label="Changer de ${type.toLowerCase()}">↺</button>
          </div>`;}).join("")}
      </div>
    </div>`;
  }).join("");
  var actions='<div class="menu-actions-bar"><button class="act-btn" onclick="addAllMenuToCourses()">🛒 Tout ajouter aux courses</button><button class="act-btn" onclick="generateMenu()">🔄 Régénérer</button></div>';
  document.getElementById("menu-result").innerHTML=actions+html;
}

function addMenuToCourses(ji){
  const j=MENU_DATA.jours[ji];
  [j.entree,j.plat,j.dessert].filter(Boolean).forEach(function(r){CART.add(r.id);});
  saveCart();updateBadges();toast("🛒 Ajouté aux courses");renderMenuResult();
}
function addAllMenuToCourses(){
  if(!MENU_DATA||!MENU_DATA.jours)return;
  var n=0;
  MENU_DATA.jours.forEach(function(j){
    [j.entree,j.plat,j.dessert].filter(Boolean).forEach(function(r){if(!CART.has(r.id)){CART.add(r.id);n++;}});
  });
  saveCart();updateBadges();
  toast(n?"🛒 "+n+" recette"+(n>1?"s":"")+" ajoutée"+(n>1?"s":""):"Tout était déjà dans les courses",2500);
  renderMenuResult();
}
function changeMenuSlot(ji,field,type){
  const current=MENU_DATA.jours[ji][field];
  const usedIds=new Set(MENU_DATA.jours.flatMap(j=>[j.entree?.id,j.plat?.id,j.dessert?.id]).filter(Boolean));
  if(current)usedIds.delete(current.id);
  const avail=RECIPES.filter(r=>r.cat===type&&!usedIds.has(r.id));
  if(!avail.length)return;
  MENU_DATA.jours[ji][field]=avail[Math.floor(Math.random()*avail.length)];
  renderMenuResult();
}

// ── FAVORIS ───────────────────────────────────────────────────────────────
var _favsMode="all";// "all" | "rated"
var _favsTagFilter="";// tag actif ("" = tous)
function setFavsMode(m){_favsMode=m;_favsTagFilter="";renderFavs();}
function setFavsTagFilter(t){_favsTagFilter=(_favsTagFilter===t)?"":t;renderFavs();}
function _getFavTags(id){var a=FAV_TAGS[id];return Array.isArray(a)?a:[];}
function _setFavTags(id,tags){
  var clean=tags.map(function(t){return(t||"").trim();}).filter(Boolean);
  var uniq=[];clean.forEach(function(t){if(!uniq.some(function(u){return u.toLowerCase()===t.toLowerCase();}))uniq.push(t);});
  if(uniq.length)FAV_TAGS[id]=uniq;else delete FAV_TAGS[id];
  saveFavTags();
}
function _allFavTags(){
  var set=new Set();
  Object.keys(FAV_TAGS).forEach(function(id){if(FAVS.has(id))(FAV_TAGS[id]||[]).forEach(function(t){set.add(t);});});
  return[...set].sort(function(a,b){return a.localeCompare(b,'fr');});
}
function editFavTags(id){
  var cur=_getFavTags(id).join(", ");
  var v=prompt("Tags (séparés par des virgules) — ex : À tester, Dîner de Noël, Rapide",cur);
  if(v===null)return;
  _setFavTags(id,v.split(",").map(function(t){return t.trim();}).filter(Boolean));
  renderFavs();
  toast("🏷 Tags mis à jour",1800);
}
function renderFavs(q){
  q=q||"";
  var ql=q.toLowerCase();
  var ratedTotal=Object.keys(RATINGS).filter(function(id){return RATINGS[id]>0;}).length;
  var mode=_favsMode;
  var recs=RECIPES.filter(function(r){
    if(mode==="rated"){if(!(RATINGS[r.id]>0))return false;}
    else{if(!FAVS.has(r.id))return false;}
    if(ql&&!r.nom.toLowerCase().includes(ql)&&!r.co.toLowerCase().includes(ql))return false;
    if(mode==="all"&&_favsTagFilter){
      var tags=_getFavTags(r.id);
      if(!tags.some(function(t){return t.toLowerCase()===_favsTagFilter.toLowerCase();}))return false;
    }
    return true;
  });
  if(mode==="rated")recs.sort(function(a,b){return (RATINGS[b.id]||0)-(RATINGS[a.id]||0);});
  var main=document.getElementById("main");
  var tabs=`<div class="favs-tabs" role="tablist">
    <button class="favs-tab${mode==='all'?' active':''}" role="tab" aria-selected="${mode==='all'}" onclick="setFavsMode('all')">♥ Favoris (${FAVS.size})</button>
    <button class="favs-tab${mode==='rated'?' active':''}" role="tab" aria-selected="${mode==='rated'}" onclick="setFavsMode('rated')">⭐ Mes recettes notées (${ratedTotal})</button>
  </div>`;
  var tagsBar="";
  if(mode==="all"){
    var allTags=_allFavTags();
    if(allTags.length){
      tagsBar='<div class="favs-tagbar"><span class="favs-tagbar-lbl">🏷 Tags :</span>'
        +'<button class="favs-tagchip'+(_favsTagFilter===""?' active':'')+'" onclick="setFavsTagFilter(\'\')">Tous</button>'
        +allTags.map(function(t){
          var safe=t.replace(/'/g,"\\'").replace(/"/g,'&quot;');
          var active=_favsTagFilter.toLowerCase()===t.toLowerCase();
          return'<button class="favs-tagchip'+(active?' active':'')+'" onclick="setFavsTagFilter(\''+safe+'\')">'+t+'</button>';
        }).join("")
        +'</div>';
    }
  }
  var placeholder=mode==="rated"?"Rechercher dans mes recettes notées…":"Rechercher dans mes favoris…";
  var searchBar=`<div style="padding:12px 16px 0"><input type="text" value="${q}" placeholder="${placeholder}" oninput="renderFavs(this.value)" style="width:100%;background:var(--bg3);border:1.5px solid var(--bord);border-radius:var(--rx);padding:8px 14px;font-size:13px;font-family:inherit;color:var(--text);outline:none"></div>`;
  if(!recs.length){
    var hasAny=mode==="rated"?ratedTotal>0:FAVS.size>0;
    var ico=mode==="rated"?"⭐":"♡";
    var emptyBody;
    if(hasAny){
      emptyBody=`<p style="font-size:15px;margin-bottom:6px">Aucun résultat</p><small style="font-size:13px;color:var(--text4)">Essayez un autre terme de recherche</small>`;
    }else if(mode==="rated"){
      emptyBody=`<p style="font-size:17px;margin-bottom:10px;color:var(--text2)">Aucune recette notée</p>
         <p style="font-size:13px;color:var(--text4);max-width:360px;margin:0 auto 18px auto;line-height:1.5">Notez vos recettes préférées en cliquant sur les étoiles ; elles apparaîtront ici triées par note.</p>
         <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
           <button class="act-btn" onclick="setView('browse')">🍽 Parcourir les recettes</button>
         </div>`;
    }else{
      emptyBody=`<p style="font-size:17px;margin-bottom:10px;color:var(--text2)">Aucun favori pour le moment</p>
         <p style="font-size:13px;color:var(--text4);max-width:340px;margin:0 auto 18px auto;line-height:1.5">Cliquez sur ♡ sur n'importe quelle recette pour la sauvegarder ici. Vos favoris sont synchronisés entre tous les appareils via la sauvegarde.</p>
         <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
           <button class="act-btn" onclick="setView('browse')">🍽 Parcourir les recettes</button>
           <button class="act-btn" onclick="openRandom()">🎲 Surprise</button>
         </div>`;
    }
    main.innerHTML=tabs+searchBar+tagsBar+`<div class="empty"><div class="empty-ico">${ico}</div>${emptyBody}</div>`;
    return;
  }
  const cards=recs.map(r=>{
    var coCol=COUNTRY_COLORS[r.co]||"#9a6f2a";
    var rt=RATINGS[r.id]||0;
    var isFav=FAVS.has(r.id);
    var tags=mode==="all"?_getFavTags(r.id):[];
    var tagsHtml=tags.length?'<div class="card-tags">'+tags.map(function(t){return'<span class="card-tag">'+t+'</span>';}).join("")+'</div>':"";
    var tagBtn=mode==="all"?`<button class="card-tag-btn" onclick="event.stopPropagation();editFavTags('${r.id}')" aria-label="Modifier les tags" title="Modifier les tags">🏷</button>`:"";
    return`
    <div class="card" data-id="${r.id}" style="--co-accent:${coCol}">
      ${buildCardPhoto(r)}
      <button class="card-fav-btn${isFav?' active':''}" onclick="event.stopPropagation();toggleFav('${r.id}')">${isFav?'♥':'♡'}</button>
      ${tagBtn}
      <div class="card-body">
        <div class="card-top"><span class="cat-badge cat-${catClass(r.cat)}">${r.cat}</span><div class="diff-dots">${dots(r.diff)}</div></div>
        <div class="card-nom">${r.nom}</div>
        <div class="card-chef">${r.chef}</div>
        ${tagsHtml}
        <div class="card-meta"><div class="meta-item"><strong>${totTime(r)}</strong> min</div><div class="meta-item"><strong>${r.bp}</strong> pers.</div><div class="meta-item meta-diff-${r.diff}">${diffLabel(r.diff)}</div></div>
        <div class="card-foot"><span class="card-co" aria-label="Pays : ${r.co}"><span class="card-co-dot" style="background:${coCol}" aria-hidden="true"></span><span aria-hidden="true">${FLAGS[r.co]||""}</span> ${r.co}</span> ${rt?`<span class="card-rate-sum" aria-label="Note : ${rt} sur 5">★ ${rt}/5</span>`:""}</div>
      </div>
    </div>`;}).join("");
  var title=mode==="rated"?"Mes recettes notées":"Mes favoris";
  var subtitle=mode==="rated"
    ? `${recs.length} recette${recs.length>1?"s":""} notée${recs.length>1?"s":""} · triées par note`
    : `${recs.length} recette${recs.length>1?"s":""} sauvegardée${recs.length>1?"s":""}`;
  main.innerHTML=tabs+searchBar+tagsBar+`<div class="page-header"><div class="page-title">${title}</div><div style="font-size:13px;color:var(--text3);margin-bottom:20px">${subtitle}</div></div><div style="padding:0 20px"><div class="grid">${cards}</div></div>`;
  document.querySelectorAll(".card[data-id]").forEach(c=>c.onclick=()=>openRecipe(c.dataset.id));
}

// ── LISTE DE COURSES ──────────────────────────────────────────────────────
var _csRecFilter={q:"",mode:"all"};// mode: "all" | "favs" | "menu"
function setCoursesRecMode(m){_csRecFilter.mode=m;renderCourses();}
function coursesImportFavs(){
  if(!FAVS.size){toast("Aucun favori à importer",2200);return;}
  var n=0;FAVS.forEach(function(id){if(!CART.has(id)){CART.add(id);n++;}});
  saveCart();updateBadges();renderCourses();
  toast(n?"🛒 "+n+" favori"+(n>1?"s":"")+" ajouté"+(n>1?"s":"")+" aux courses":"Tous les favoris étaient déjà dans les courses",2500);
}
function coursesImportMenu(){
  if(!MENU_DATA||!MENU_DATA.jours||!MENU_DATA.jours.length){toast("Aucun menu généré. Allez dans 📅 Menu.",2500);return;}
  var n=0;
  MENU_DATA.jours.forEach(function(j){
    [j.entree,j.plat,j.dessert].filter(Boolean).forEach(function(r){if(!CART.has(r.id)){CART.add(r.id);n++;}});
  });
  saveCart();updateBadges();renderCourses();
  toast(n?"🛒 "+n+" recette"+(n>1?"s":"")+" du menu ajoutée"+(n>1?"s":""):"Les recettes du menu étaient déjà dans les courses",2500);
}
function _csRecFilterInput(v){_csRecFilter.q=v;_csRenderPills();}
function _csRenderPills(){
  var zone=document.getElementById("cs-pills-zone");if(!zone)return;
  zone.innerHTML=_buildCoursesPillsHtml();
}
function _buildCoursesPillsHtml(){
  var q=(_csRecFilter.q||"").toLowerCase();
  var mode=_csRecFilter.mode||"all";
  var pool=RECIPES.filter(function(r){
    if(mode==="favs"&&!FAVS.has(r.id))return false;
    if(mode==="menu"){
      if(!MENU_DATA||!MENU_DATA.jours)return false;
      var inMenu=MENU_DATA.jours.some(function(j){return[j.entree,j.plat,j.dessert].some(function(x){return x&&x.id===r.id;});});
      if(!inMenu)return false;
    }
    if(q&&!r.nom.toLowerCase().includes(q)&&!r.co.toLowerCase().includes(q)&&!r.chef.toLowerCase().includes(q))return false;
    return true;
  });
  if(!pool.length){
    var msg=mode==="favs"?"Aucun favori ne correspond.":mode==="menu"?"Aucune recette du menu ne correspond.":"Aucune recette ne correspond.";
    return'<div style="padding:16px;font-size:13px;color:var(--text3);font-style:italic">'+msg+'</div>';
  }
  var pillGroups={};
  pool.forEach(function(r){(pillGroups[r.cat]=pillGroups[r.cat]||[]).push(r);});
  var preferred=["Entrée","Plat","Dessert","Sauce / Base","Accompagnement","Soupe","Assaisonnement","Entremet"];
  var otherCats=Object.keys(pillGroups).filter(function(c){return preferred.indexOf(c)<0;}).sort();
  var catOrder=preferred.filter(function(c){return pillGroups[c];}).concat(otherCats);
  return catOrder.map(function(cat){
    var col=CAT_COLORS[cat]||"#9a6f2a";
    var list=pillGroups[cat].slice().sort(function(a,b){return a.nom.localeCompare(b.nom);});
    var inner=list.map(function(r){
      var sel=CART.has(r.id);
      return'<div class="cs-pill'+(sel?' selected':'')+'" onclick="toggleCartFromCourses(\''+r.id+'\')"><span class="cs-dot" style="background:'+col+'"></span>'+r.nom+'</div>';
    }).join("");
    return'<div class="cs-pill-group"><div class="cs-pill-cat" style="color:'+col+'">'+cat+'</div><div class="cs-pills">'+inner+'</div></div>';
  }).join("");
}
function renderCourses(){
  const {cartRecs,groups,order}=buildCoursesAgg();
  const main=document.getElementById("main");
  var pillsHtml=_buildCoursesPillsHtml();
  var mode=_csRecFilter.mode||"all";
  var hasFavs=FAVS.size>0, hasMenu=!!(MENU_DATA&&MENU_DATA.jours&&MENU_DATA.jours.length);
  var recCtrls=`<div class="cs-rec-ctrls">
      <input type="text" class="cs-rec-search" placeholder="Filtrer les recettes (nom, pays, chef)…" value="${(_csRecFilter.q||"").replace(/"/g,'&quot;')}" oninput="_csRecFilterInput(this.value)">
      <div class="cs-rec-chips">
        <button class="cs-chip${mode==='all'?' active':''}" aria-pressed="${mode==='all'}" onclick="setCoursesRecMode('all')">Toutes (${RECIPES.length})</button>
        <button class="cs-chip${mode==='favs'?' active':''}" aria-pressed="${mode==='favs'}" onclick="setCoursesRecMode('favs')">♥ Favoris (${FAVS.size})</button>
        <button class="cs-chip${mode==='menu'?' active':''}" aria-pressed="${mode==='menu'}" onclick="setCoursesRecMode('menu')">📅 Menu</button>
      </div>
      <div class="cs-rec-imports">
        ${hasFavs?'<button class="btn-export" onclick="coursesImportFavs()" title="Ajouter tous mes favoris aux courses">+ Ajouter mes favoris</button>':''}
        ${hasMenu?'<button class="btn-export" onclick="coursesImportMenu()" title="Ajouter les recettes du dernier menu">+ Ajouter le menu</button>':''}
      </div>
    </div>`;
  let html="";
  if(cartRecs.length){
    order.forEach(cat=>{
      if(!groups[cat])return;
      const items=groups[cat].sort((a,b)=>a.nom.localeCompare(b.nom));
      const rows=items.map(function(item){
          var done=!!CHECKED_ITEMS[item.nom];
          var cbId='ci-'+item.nom.replace(/[^a-z0-9]/gi,'-');
          var st=done?'style="opacity:.4;text-decoration:line-through"':'';
          var chk=done?'checked':'';
          var safeNom=item.nom.replace(/'/g,"\\'");
          var qty=item.unit==="qs"?"q.s.":fmtQty(item.qty,item.unit);
          return'<div class="cs-item">'
            +'<label for="'+cbId+'" style="display:flex;align-items:center;gap:8px;flex:1;cursor:pointer">'
            +'<input type="checkbox" id="'+cbId+'" '+chk+' onchange="toggleCheckedItem(\''+safeNom+'\',this.checked)" style="cursor:pointer;accent-color:var(--gold-l);flex-shrink:0">'
            +'<span class="cs-iname" '+st+'>'+item.nom+'</span>'
            +'</label>'
            +'<span class="cs-iqty" '+st+'>'+qty+'</span>'
            +'</div>';
        }).join("");
      html+=`<div class="courses-section"><div class="cs-cat-title">${cat}</div>${rows}</div>`;
    });
  }
  main.innerHTML=`
    <div class="courses-wrap">
      <div class="page-title">🛒 Liste de courses</div>
      <input type="text" id="courses-search" placeholder="Rechercher un ingrédient..." oninput="filterCoursesDisplay()" style="width:100%;background:var(--bg3);border:1.5px solid var(--bord);border-radius:var(--rx);padding:8px 14px;font-size:13px;font-family:inherit;color:var(--text);outline:none;margin-bottom:12px">
      <div class="courses-card">
        <div class="courses-card-hdr">
          <span>${cartRecs.length>0?`Ingrédients — ${cartRecs.length} recette${cartRecs.length>1?"s":""}`:""}<span id="courses-count" class="courses-count"></span></span>
          <div class="courses-export-btns">
            <button class="btn-export" onclick="clearAllChecked()" title="Tout décocher">☐ Décocher</button>
            <button class="btn-export" onclick="exportCoursesText()" title="Copier en presse-papier">📋 Copier</button>
            <button class="btn-export" onclick="shareCoursesText()" title="Partager / AnyList / Bring">🔗 Partager</button>
            <button class="btn-export" onclick="downloadCoursesText()" title="Télécharger .txt">⬇ .txt</button>
            <button class="btn-export" onclick="window.print()" title="Imprimer">🖨</button>
          </div>
        </div>
        ${cartRecs.length>0?html:`<div class="courses-empty">Sélectionnez des recettes ci-dessous pour générer la liste</div>`}
      </div>
      <div style="font-size:13px;color:var(--text3);margin:22px 0 14px">Sélectionnez des recettes — les ingrédients sont consolidés automatiquement</div>
      <div class="cs-selector"><div class="cs-lbl">Choisir les recettes</div>${recCtrls}<div id="cs-pills-zone">${pillsHtml}</div></div>
    </div>`;
}

function updateCoursesCount(){
  var total=0,checked=0;
  document.querySelectorAll(".cs-item").forEach(function(el){
    total++;
    if(el.querySelector("input[type=checkbox]:checked"))checked++;
  });
  var el=document.getElementById("courses-count");
  if(el)el.textContent=checked+"/"+total+" cochés";
}
function toggleCartFromCourses(id){if(CART.has(id))CART.delete(id);else CART.add(id);saveCart();updateBadges();renderCourses();}

function filterCoursesDisplay(){
  var q=(document.getElementById("courses-search")||{}).value||"";
  var ql=q.toLowerCase();
  document.querySelectorAll(".cs-item").forEach(function(el){
    var nom=el.querySelector(".cs-iname");
    if(!nom){return;}
    el.style.display=(!ql||nom.textContent.toLowerCase().includes(ql))?"":"none";
  });
  document.querySelectorAll(".courses-section").forEach(function(sec){
    var visible=sec.querySelectorAll(".cs-item:not([style*=none])");
    sec.style.display=visible.length>0?"":"none";
  });
}
function clearAllChecked(){
  CHECKED_ITEMS={};
  saveCheckedItems();
  renderCourses();
  toast("Tous les articles ont été décochés");
}

// ── EXPORT COURSES : COPIE / PARTAGE / TÉLÉCHARGEMENT ─────────────────────
function _copyToClipboard(txt,okMsg){
  if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(txt).then(function(){toast(okMsg||'📋 Copié !',2500,'success');}).catch(function(){_fallbackCopy(txt,okMsg);});
  }else{
    _fallbackCopy(txt,okMsg);
  }
}
function exportCoursesText(){
  var txt=buildCoursesText();
  if(!txt)return toast('Liste vide');
  _copyToClipboard(txt,'📋 Liste copiée !');
}
function shareCoursesText(){
  // Format "plain" (1 item/ligne) : directement collable dans AnyList / Bring
  var txt=buildCoursesText({plain:true});
  if(!txt)return toast('Liste vide');
  if(navigator.share){
    navigator.share({title:'Ma liste de courses',text:txt}).catch(function(){});
  }else{
    _copyToClipboard(txt,'📋 Copié (format AnyList/Bring)');
  }
}
function downloadCoursesText(){
  var txt=buildCoursesText();
  if(!txt)return toast('Liste vide');
  var blob=new Blob([txt],{type:'text/plain;charset=utf-8'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;
  a.download='courses-'+new Date().toISOString().slice(0,10)+'.txt';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(url);},1000);
  toast('⬇ Liste téléchargée');
}

// ── EXPORT / IMPORT BACKUP ────────────────────────────────────────────────
function exportBackup() {
  var backup = {
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    appName: 'Saveur N\u00b05',
    data: {
      favs: [...FAVS],
      cart: [...CART],
      notes: NOTES,
      ratings: RATINGS,
      recent: RECENT
    }
  };
  var json = JSON.stringify(backup, null, 2);
  var filename = 'saveur-n5-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  lsSet('sn5_bk', new Date().toISOString());
  _dlBlob(json, filename, 'application/json');
  toast('\u2705 Sauvegarde export\u00e9e (' + [...FAVS].length + ' favoris, '
        + Object.keys(RATINGS).length + ' notes)');
}

function exportBackupQR(){
  var payload={favs:[...FAVS],ratings:RATINGS,notes:NOTES,tags:FAV_TAGS};
  var json=JSON.stringify(payload);
  var b64;
  try{b64=btoa(unescape(encodeURIComponent(json)));}catch(e){toast("❌ Impossible d'encoder les données");return;}
  var url=window.location.origin+window.location.pathname+'#import='+b64;
  if(url.length>2800){toast("⚠ Trop de données pour un QR code. Utilisez « 📤 Exporter » à la place.",4500);return;}
  var qrSrc='https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data='+encodeURIComponent(url);
  var body='<div style="text-align:center"><img id="qr-img" alt="QR code de transfert" src="'+attrEscape(qrSrc)+'" style="width:100%;max-width:300px;height:auto;display:block;margin:0 auto;background:#fff;border-radius:8px;padding:10px"><div id="qr-fallback" style="display:none;padding:12px;background:var(--bg3);border-radius:8px;font-size:10.5px;font-family:monospace;word-break:break-all;text-align:left;max-height:180px;overflow-y:auto">'+attrEscape(url)+'</div><p style="font-size:12.5px;color:var(--text2);margin:12px 0 8px;line-height:1.5">Scannez ce code avec votre autre appareil pour importer <strong>'+FAVS.size+'</strong> favoris, <strong>'+Object.keys(RATINGS).length+'</strong> notes, tags et évaluations.</p><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><button class="act-btn" id="qr-copy-btn">📋 Copier le lien</button></div><p style="margin-top:12px;font-size:11px;color:var(--text3);font-style:italic">Les données restent sur votre appareil. Le QR est généré localement à chaque ouverture.</p></div>';
  _makeModal({
    titleId:"qr-title",
    title:"📱 Transférer mes données",
    maxWidth:380,
    body:body,
    onMount:function(m){
      var img=m.body.querySelector("#qr-img"),fb=m.body.querySelector("#qr-fallback");
      if(img)img.addEventListener("error",function(){img.style.display="none";if(fb)fb.style.display="block";});
      var btn=m.body.querySelector("#qr-copy-btn");
      if(btn)btn.addEventListener("click",function(){
        if(navigator.clipboard)navigator.clipboard.writeText(url).then(function(){toast("🔗 Lien copié");});
      });
    }
  });
}
function handleImportHash(){
  if(!location.hash||!location.hash.startsWith('#import='))return false;
  var b64=location.hash.slice('#import='.length);
  try{
    var json=decodeURIComponent(escape(atob(b64)));
    var p=JSON.parse(json);
    var nFavs=p.favs?p.favs.length:0;
    var nRatings=p.ratings?Object.keys(p.ratings).length:0;
    if(!confirm("Importer "+nFavs+" favori(s) et "+nRatings+" note(s) depuis le QR code ?\n\nCeci remplace vos données actuelles."))return false;
    if(p.favs){FAVS=new Set(p.favs);saveFavs();}
    if(p.ratings){RATINGS=p.ratings;saveRatings();}
    if(p.notes){NOTES=p.notes;saveNotes();}
    if(p.tags){FAV_TAGS=p.tags;saveFavTags();}
    history.replaceState('',document.title,location.pathname+location.search);
    updateBadges();
    if(S.view==="favs")renderFavs();
    else if(S.view==="courses")renderCourses();
    else if(S.view==="recipe")renderDetail();
    else if(S.view==="browse")renderMain();
    toast("✅ Données importées depuis le QR code ("+nFavs+" favoris, "+nRatings+" notes)",3500);
    return true;
  }catch(e){toast("❌ QR code invalide : "+e.message,3500);return false;}
}
function importBackup() {
  var inp = document.createElement('input');
  inp.type = 'file'; inp.accept = '.json';
  inp.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var bk = JSON.parse(ev.target.result);
        if (!bk.schemaVersion || !bk.data) {
          toast('\u274c Fichier invalide'); return;
        }
        var d = bk.data;
        if (d.favs)    { FAVS = new Set(d.favs);   saveFavs();    }
        if (d.cart)    { CART = new Set(d.cart);   saveCart();    }
        if (d.notes)   { NOTES = d.notes;           saveNotes();   }
        if (d.ratings) { RATINGS = d.ratings;       saveRatings(); }
        if (d.recent)  { RECENT = d.recent;         saveRecent();  }
        lsSet('sn5_bk', new Date().toISOString());
        updateBadges();
        toast('\u2705 Restaur\u00e9 ! (' + [...FAVS].length + ' favoris, '
              + Object.keys(RATINGS).length + ' notes)');
        if (S.view === 'browse') renderMain();
        else if (S.view === 'favs') renderFavs();
      } catch(err) {
        toast('\u274c Erreur import : ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  inp.click();
}

// ── HASH ROUTER / PARTAGE ────────────────────────────────────────────────
function shareRecipe(id){
  var r=RECIPES.find(function(x){return x.id===id;});
  var url=window.location.origin+window.location.pathname+'?s=1#recette/'+id;
  if(navigator.share&&r){
    navigator.share({title:'Saveur N5 - '+r.nom,url:url}).catch(function(){});
  }else if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(url).then(function(){toast('🔗 Lien copié dans le presse-papiers !',2500,'success');}).catch(function(){_fallbackCopy(url,'🔗 Lien copié dans le presse-papiers !');});
  }else{_fallbackCopy(url,'🔗 Lien copié dans le presse-papiers !');}
}

// ── VUE PARAMÈTRES ────────────────────────────────────────────────────────
function renderSettings(){
  var lastBk=lsGet('sn5_bk',null);
  var lastBkStr=lastBk
    ?new Date(lastBk).toLocaleDateString('fr-FR')+' à '+new Date(lastBk).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})
    :'Jamais';
  var byCountry={};var byCat={};
  RECIPES.forEach(function(r){
    byCountry[r.co]=(byCountry[r.co]||0)+1;
    byCat[r.cat]=(byCat[r.cat]||0)+1;
  });
  var countryRows=Object.keys(byCountry).sort(function(a,b){return byCountry[b]-byCountry[a];})
    .map(function(c){return'<div class="setting-stat-row"><span>'+(FLAGS[c]||'')+' '+c+'</span><strong>'+byCountry[c]+'</strong></div>';}).join('');
  var catPills=Object.keys(byCat).map(function(c){
    return'<span class="cat-badge cat-'+catClass(c)+'">'+c+' <strong>'+byCat[c]+'</strong></span>';
  }).join(' ');

  // Statistiques personnelles
  var ratedCount=Object.keys(RATINGS).filter(function(k){return RATINGS[k]>0;}).length;
  var avgRating=0;
  if(ratedCount){
    var sum=0;Object.keys(RATINGS).forEach(function(k){if(RATINGS[k]>0)sum+=RATINGS[k];});
    avgRating=(sum/ratedCount).toFixed(1);
  }
  var notesCount=Object.keys(NOTES).filter(function(k){return NOTES[k]&&NOTES[k].trim();}).length;
  var viewsCount=lsGet('sn5_bkc',0);
  var customCount=USER_RECIPES.length;

  // Préférence auto-save
  var autoBkOn=lsGet('sn5_autobk',false);

  document.getElementById('main').innerHTML=`
    <div style="max-width:600px;margin:0 auto;padding:24px 20px">
      <div class="page-title" style="margin-bottom:20px">⚙️ Paramètres</div>

      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">📊 Mes statistiques</div>
        <div class="setting-section-body">
          <div class="stats-grid">
            <div class="stat-tile"><div class="stat-num">${FAVS.size}</div><div class="stat-lbl">Favoris</div></div>
            <div class="stat-tile"><div class="stat-num">${ratedCount}</div><div class="stat-lbl">Notées</div></div>
            <div class="stat-tile"><div class="stat-num">${avgRating||'—'}</div><div class="stat-lbl">Note moyenne</div></div>
            <div class="stat-tile"><div class="stat-num">${notesCount}</div><div class="stat-lbl">Mémos</div></div>
            <div class="stat-tile"><div class="stat-num">${CART.size}</div><div class="stat-lbl">Panier</div></div>
            <div class="stat-tile"><div class="stat-num">${customCount}</div><div class="stat-lbl">Mes recettes</div></div>
          </div>
        </div>
      </div>

      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">💾 Sauvegarde des données</div>
        <div class="setting-section-body">
          <p class="setting-desc">Exporte favoris, notes, évaluations et historique. Restaure sur n'importe quel appareil.</p>
          <div class="setting-last-backup">Dernière sauvegarde : <strong>${lastBkStr}</strong></div>
          <label style="display:flex;align-items:center;gap:8px;margin-top:10px;cursor:pointer;font-size:13px;color:var(--text2)">
            <input type="checkbox" id="auto-bk-cb" ${autoBkOn?'checked':''} onchange="toggleAutoBackup(this.checked)" style="accent-color:var(--gold-l)">
            <span>Rappel auto de sauvegarde (hebdomadaire)</span>
          </label>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="act-btn" onclick="exportBackup()">📤 Exporter</button>
            <button class="act-btn" onclick="importBackup()">📥 Restaurer</button>
            <button class="act-btn" onclick="exportBackupQR()">📱 Transférer (QR)</button>
          </div>
        </div>
      </div>

      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">🎨 Apparence</div>
        <div class="setting-section-body">
          <p class="setting-desc">Thème clair ou sombre. Le thème système est utilisé par défaut.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="act-btn" onclick="toggleTheme()">🌓 Basculer thème</button>
            <button class="act-btn" onclick="resetTheme()">↺ Réinitialiser</button>
          </div>
        </div>
      </div>

      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">📚 Catalogue des recettes</div>
        <div class="setting-section-body">
          <p class="setting-desc">${RECIPES.length} recettes au total (dont ${customCount} personnelle${customCount>1?'s':''}).</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="act-btn" onclick="exportCatalogue('csv')">📄 CSV</button>
            <button class="act-btn" onclick="exportCatalogue('json')">🗂 JSON</button>
          </div>
        </div>
      </div>

      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">🌍 Répartition par pays</div>
        <div class="setting-section-body">
          <div style="margin-bottom:12px;display:flex;flex-wrap:wrap;gap:6px">${catPills}</div>
          ${countryRows}
        </div>
      </div>

      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">⌨️ Raccourcis clavier</div>
        <div class="setting-section-body">
          <p class="setting-desc">Appuyez sur <kbd>?</kbd> n'importe où dans l'app pour afficher l'aide rapide.</p>
          <button class="act-btn" onclick="showShortcuts()">Voir les raccourcis</button>
        </div>
      </div>

      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">🔄 Maintenance</div>
        <div class="setting-section-body">
          <p class="setting-desc">Forcez le téléchargement de la toute dernière version de l'app (vide le cache hors-ligne et recharge).</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="act-btn" onclick="forceUpdate()">🔄 Forcer la mise à jour</button>
          </div>
        </div>
      </div>

      <div class="detail-card">
        <div class="setting-section-head">ℹ️ À propos</div>
        <div class="setting-section-body">
          <p class="setting-desc" style="margin-bottom:8px"><strong>Saveur N°5</strong> — Base de recettes gastronomiques.</p>
          <p class="setting-desc" style="margin-bottom:8px">Version ${_SN5_VER||'—'} · ${RECIPES.length} recettes · Mode hors-ligne</p>
          <p class="setting-desc" style="margin-bottom:8px">Conçu et développé par <strong>Teva L.</strong></p>
          <p class="setting-desc" style="margin-bottom:8px;font-size:12px;color:var(--text4)">Aucune publicité, aucun tracking, aucune collecte de données. Toutes vos données restent sur votre appareil.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="act-btn" onclick="showChangelog()">📋 Nouveautés</button>
          </div>
        </div>
      </div>
    </div>`;
}

function toggleAutoBackup(on){
  lsSet('sn5_autobk',on);
  toast(on?'✅ Rappel hebdomadaire activé':'Rappel désactivé',2200);
}

function resetTheme(){
  lsSet('sn5_theme',null);
  localStorage.removeItem('sn5_theme');
  document.documentElement.removeAttribute('data-theme');
  if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.documentElement.setAttribute('data-theme','dark');
  }
  _updateThemeBtn();
  toast('Thème système restauré',2000);
}

function showChangelog(){
  if(!_SN5_LOG.length){toast('Aucun historique',1800);return;}
  var body=document.getElementById('changelog-body');
  if(body){body.innerHTML=_SN5_LOG.map(_sn5LogEntryHTML).join('<hr class="changelog-sep">');}
  var ov=document.getElementById('changelog-overlay');
  if(ov)ov.classList.add('active');
}

// ── THEME CLAIR / SOMBRE ──────────────────────────────────────────────────
function initTheme(){
  var saved=lsGet('sn5_theme',null);
  if(saved){document.documentElement.setAttribute('data-theme',saved);}
  else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.documentElement.setAttribute('data-theme','dark');
  }
  _updateThemeBtn();
}
function toggleTheme(){
  var cur=document.documentElement.getAttribute('data-theme')||'light';
  var next=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  lsSet('sn5_theme',next);
  _updateThemeBtn();
}
function _updateThemeBtn(){
  var btn=document.getElementById('theme-toggle-btn');
  if(!btn)return;
  var cur=document.documentElement.getAttribute('data-theme')||'light';
  btn.textContent=cur==='dark'?'☀️':'🌙';
  btn.title=cur==='dark'?'Passer en mode clair':'Passer en mode sombre';
}

// ── SCROLL TO TOP ────────────────────────────────────────────────────────
function initScrollTop(){
  var btn=document.getElementById('scroll-top-btn');
  if(!btn)return;
  window.addEventListener('scroll',function(){
    btn.style.opacity=window.scrollY>300?'1':'0';
    btn.style.pointerEvents=window.scrollY>300?'auto':'none';
  },{passive:true});
  btn.onclick=function(){window.scrollTo({top:0,behavior:'smooth'});};
}

// ── VARIANTES ─────────────────────────────────────────────────────────────
function selectVariant(rId,idx){
  if(S.variant&&S.variant.rId===rId&&S.variant.idx===idx){S.variant=null;}
  else{S.variant={rId:rId,idx:idx};}
  renderDetail();
}

// ── RECETTES PERSONNALISÉES (CRUD) ─────────────────────────────────────────
function renderCreateRecipe(editId){
  var ex = editId ? USER_RECIPES.find(function(r){ return r.id === editId; }) : null;
  var r = ex || {id:'',co:'France',cat:'Plat',sous:'',nom:'',chef:'Ma recette',
                  bp:4,prep:20,cui:30,diff:2,qual:3,ig:[['',1,'g']],et:'',vin:'',notes:''};
  var catOpts = CATS.map(function(c){
    return '<option value="' + c + '"' + (r.cat===c?' selected':'') + '>' + c + '</option>';
  }).join('');
  var igRows = r.ig.map(function(ig, i){
    return '<div class="cr-ig-row" id="cr-ig-' + i + '">'
      + '<input class="cr-input cr-ing-name" value="' + (ig[0]||'') + '" placeholder="Ingrédient">'
      + '<input class="cr-input cr-ing-qty" type="number" value="' + (ig[1]||1) + '" min="0" step="0.5">'
      + '<input class="cr-input cr-ing-unit" value="' + (ig[2]||'g') + '" placeholder="unité">'
      + '<button onclick="this.closest(\'.cr-ig-row\').remove()" class="cr-rm-btn">✕</button>'
      + '</div>';
  }).join('');

  document.getElementById('main').innerHTML =
    '<div class="cr-wrap">'
    + '<div class="cr-header">' + (ex ? '✏️ Modifier' : '✍️ Créer') + ' une recette</div>'
    + '<div class="detail-card cr-section">'
    +   '<label class="cr-label">Nom *</label>'
    +   '<input id="cr-nom" class="cr-input" value="' + (r.nom||'') + '" placeholder="Ex : Tarte de grand-mère">'
    +   '<div class="cr-grid2">'
    +     '<div><label class="cr-label">Catégorie</label><select id="cr-cat" class="cr-input">' + catOpts + '</select></div>'
    +     '<div><label class="cr-label">Sous-catégorie</label><input id="cr-sous" class="cr-input" value="' + (r.sous||'') + '" placeholder="Ex : Tarte"></div>'
    +     '<div><label class="cr-label">Pays / Origine</label><input id="cr-co" class="cr-input" value="' + (r.co||'France') + '"></div>'
    +     '<div><label class="cr-label">Source / Chef</label><input id="cr-chef" class="cr-input" value="' + (r.chef||'') + '"></div>'
    +     '<div><label class="cr-label">Portions</label><input id="cr-bp" class="cr-input" type="number" min="1" max="20" value="' + (r.bp||4) + '"></div>'
    +     '<div><label class="cr-label">Difficulté (1-5)</label><input id="cr-diff" class="cr-input" type="number" min="1" max="5" value="' + (r.diff||2) + '"></div>'
    +     '<div><label class="cr-label">Préparation (min)</label><input id="cr-prep" class="cr-input" type="number" min="0" value="' + (r.prep||0) + '"></div>'
    +     '<div><label class="cr-label">Cuisson (min)</label><input id="cr-cui" class="cr-input" type="number" min="0" value="' + (r.cui||0) + '"></div>'
    +   '</div>'
    + '</div>'
    + '<div class="detail-card cr-section">'
    +   '<label class="cr-label">Ingrédients</label>'
    +   '<div id="cr-igs">' + igRows + '</div>'
    +   '<button class="btn-export" onclick="crAddIgRow()" style="margin-top:8px">+ Ajouter un ingrédient</button>'
    + '</div>'
    + '<div class="detail-card cr-section">'
    +   '<label class="cr-label">Étapes de préparation *</label>'
    +   '<textarea id="cr-et" class="cr-input cr-textarea" placeholder="1. Préchauffer le four...\n2. Mélanger...">' + (r.et||'') + '</textarea>'
    +   '<label class="cr-label" style="margin-top:10px">Vin conseillé</label>'
    +   '<input id="cr-vin" class="cr-input" value="' + (r.vin||'') + '" placeholder="Ex : Bourgogne blanc">'
    +   '<label class="cr-label" style="margin-top:10px">Notes et astuces</label>'
    +   '<textarea id="cr-notes" class="cr-input cr-textarea" placeholder="Conseils, variantes...">' + (r.notes||'') + '</textarea>'
    + '</div>'
    + '<div class="cr-actions">'
    +   '<button class="act-btn" onclick="crSave(\'' + (ex ? editId : '') + '\')">💾 Sauvegarder</button>'
    +   (ex ? '<button class="act-btn" onclick="crDelete(\'' + editId + '\')" style="background:#fee2e2;color:#c0392b;border-color:#fca5a5">🗑 Supprimer</button>' : '')
    +   '<button class="act-btn" onclick="setView(\'browse\')" style="background:var(--bg3);color:var(--text2)">Annuler</button>'
    + '</div>'
    + '</div>';

  // Auto-resize textareas
  document.querySelectorAll('.cr-textarea').forEach(function(ta){
    ta.style.height = 'auto';
    ta.style.height = Math.max(80, ta.scrollHeight) + 'px';
    ta.addEventListener('input', function(){ this.style.height='auto'; this.style.height=this.scrollHeight+'px'; });
  });
}

function crAddIgRow(){
  var cont = document.getElementById('cr-igs');
  if(!cont) return;
  var n = cont.querySelectorAll('.cr-ig-row').length;
  var d = document.createElement('div');
  d.className = 'cr-ig-row';
  d.innerHTML = '<input class="cr-input cr-ing-name" placeholder="Ingrédient">'
    + '<input class="cr-input cr-ing-qty" type="number" value="1" min="0" step="0.5">'
    + '<input class="cr-input cr-ing-unit" placeholder="g">'
    + '<button onclick="this.closest(\'.cr-ig-row\').remove()" class="cr-rm-btn">✕</button>';
  cont.appendChild(d);
}

function crSave(editId){
  var nom = (document.getElementById('cr-nom').value || '').trim();
  var et  = (document.getElementById('cr-et').value  || '').trim();
  if(!nom || !et){ toast('Nom et étapes sont obligatoires', 2500, 'error'); return; }
  var igs = [];
  document.querySelectorAll('.cr-ig-row').forEach(function(row){
    var n = (row.querySelector('.cr-ing-name').value || '').trim();
    var q = parseFloat(row.querySelector('.cr-ing-qty').value) || 1;
    var u = (row.querySelector('.cr-ing-unit').value || 'qs').trim();
    if(n) igs.push([n, q, u]);
  });
  var recipe = {
    id:    editId || getUserRecipeNextId(),
    _custom: true,
    co:    document.getElementById('cr-co').value   || 'France',
    cat:   document.getElementById('cr-cat').value  || 'Plat',
    sous:  document.getElementById('cr-sous').value || '',
    nom:   nom,
    chef:  document.getElementById('cr-chef').value || 'Ma recette',
    bp:    parseInt(document.getElementById('cr-bp').value)   || 4,
    diff:  Math.min(5, Math.max(1, parseInt(document.getElementById('cr-diff').value) || 2)),
    qual:  3,
    prep:  parseInt(document.getElementById('cr-prep').value) || 0,
    cui:   parseInt(document.getElementById('cr-cui').value)  || 0,
    ig:    igs.length ? igs : [['Ingrédient', 1, 'qs']],
    et:    et,
    vin:   document.getElementById('cr-vin').value   || '',
    notes: document.getElementById('cr-notes').value || '',
  };
  if(editId){
    var idx = USER_RECIPES.findIndex(function(r){ return r.id === editId; });
    if(idx >= 0) USER_RECIPES[idx] = recipe; else USER_RECIPES.push(recipe);
    var gi = RECIPES.findIndex(function(r){ return r.id === editId; });
    if(gi >= 0) RECIPES[gi] = recipe;
  } else {
    USER_RECIPES.push(recipe);
    RECIPES.push(recipe);
  }
  saveUserRecipes();
  toast('✅ Recette sauvegardée !', 2500, 'success');
  openRecipe(recipe.id);
}

function crDelete(id){
  if(!confirm('Supprimer définitivement cette recette ?')) return;
  USER_RECIPES = USER_RECIPES.filter(function(r){ return r.id !== id; });
  saveUserRecipes();
  RECIPES = RECIPES.filter(function(r){ return r.id !== id; });
  if(FAVS.has(id)){ FAVS.delete(id); saveFavs(); }
  if(CART.has(id)){ CART.delete(id); saveCart(); }
  toast('Recette supprimée', 2000, 'info');
  setView('browse');
}

