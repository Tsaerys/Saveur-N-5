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

function updateBadges(){
  const fb=document.getElementById("fav-badge"),cb=document.getElementById("cart-badge");
  if(FAVS.size){fb.style.display="flex";fb.textContent=FAVS.size;}else fb.style.display="none";
  if(CART.size){cb.style.display="flex";cb.textContent=CART.size;}else cb.style.display="none";
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
  if(v==="browse"){sz.style.display="";fz.style.display="";rz.style.display="";renderFilters();renderRecent();renderMain();}
  else{sz.style.display="none";fz.style.display="none";rz.style.display="none";
    if(v==="favs")renderFavs();else if(v==="courses")renderCourses();else if(v==="menu")renderMenuView();else if(v==="settings")renderSettings();
  else if(v==="create")renderCreateRecipe();
  else if(v==="edit"&&S._editId)renderCreateRecipe(S._editId);}
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
  var f=S.filters;var co=f.co,cat=f.cat,diff=f.diff,time=f.time,regime=f.regime,qual=f.qual,rayon=f.rayon;
  var hasFilter=hasAnyFilter(false);
  if(hasFilter) _filtersOpen=true;
  var countsByCo={};RECIPES.forEach(function(r){countsByCo[r.co]=(countsByCo[r.co]||0)+1;});
  const coOpts=COUNTRIES.map(function(c){var n=countsByCo[c]||0;return'<option value="'+c+'"'+(co===c?' selected':'')+'>'+(FLAGS[c]||"")+' '+c+' ('+n+')</option>';}).join("");
  const catOpts=CATS.map(c=>`<option value="${c}"${cat===c?" selected":""}>${c}</option>`).join("");
  const diffOpts=[1,2,3,4,5].map(d=>`<option value="${d}"${diff==d?" selected":""}>${"★".repeat(d)}</option>`).join("");
  const timeOpts=[["30","−30 min"],["60","−1 h"],["120","−2 h"]].map(([v,l])=>`<option value="${v}"${time===v?" selected":""}>${l}</option>`).join("");
  const qualOpts=[1,2,3,4,5].map(d=>`<option value="${d}"${qual==d?" selected":""}>${d} — ${QUAL_LABELS[d]||""}</option>`).join("");
  const rayonOpts=RAYON_ORDER.map(r=>`<option value="${r}"${rayon===r?" selected":""}>${r}</option>`).join("");
  const ratedCount=Object.keys(RATINGS).filter(id=>RATINGS[id]>0).length;
  const n=filtered().length;
  var summaryParts=[];
  if(co) summaryParts.push(co);
  if(cat) summaryParts.push(cat);
  if(regime) summaryParts.push(regime);
  if(diff) summaryParts.push('★'.repeat(Number(diff)));
  if(time) summaryParts.push('−'+time+' min');
  var summaryTxt = summaryParts.length ? summaryParts.join(' · ') : (n+' recette'+(n>1?'s':''));
  var openClass = _filtersOpen ? ' open' : '';
  var hasClass  = hasFilter ? ' has-filter' : '';
  document.getElementById("filters-zone").innerHTML=`
    <div class="filters-toggle-row">
      <span class="filters-summary">${summaryTxt}</span>
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
        <div class="filter-grp"><label>Qualité</label><select id="fqual"><option value="">Toutes</option>${qualOpts}</select></div>
        <div class="filter-grp"><label>Rayon</label><select id="frayon"><option value="">Tous</option>${rayonOpts}</select></div>
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
  document.getElementById("fco").onchange=e=>{S.filters.co=e.target.value;renderMain();updateCount();};
  document.getElementById("fcat").onchange=e=>{S.filters.cat=e.target.value;renderMain();updateCount();};
  document.getElementById("fdiff").onchange=e=>{S.filters.diff=e.target.value;renderMain();updateCount();};
  document.getElementById("ftime").onchange=e=>{S.filters.time=e.target.value;renderMain();updateCount();};
  document.getElementById("fqual").onchange=e=>{S.filters.qual=e.target.value;renderMain();updateCount();};
  document.getElementById("frayon").onchange=e=>{S.filters.rayon=e.target.value;renderMain();updateCount();};
  document.getElementById("qi").oninput=debounce(e=>{S.filters.q=e.target.value;renderMain();updateCount();},300);
}
function setRegime(r){S.filters.regime=S.filters.regime===r?"":r;renderFilters();renderMain();}
function updateCount(){const el=document.querySelector(".filter-count");if(!el)return;let recs=filtered();if(S.filters.regime==="rated")recs=recs.filter(r=>(RATINGS[r.id]||0)>0);const n=recs.length;el.textContent=`${n} recette${n>1?"s":""}`;}

// ── FRIGO ─────────────────────────────────────────────────────────────────
function renderFrigo(){
  const tags=S.frigo_ings.map((ing,i)=>`<span class="frigo-tag">${ing}<button aria-label="Retirer ${ing}" onclick="removeIng(${i})">×</button></span>`).join("");
  document.getElementById("frigo-zone").innerHTML=`
    <div class="frigo-bar">
      <div class="frigo-row-top">
        <span class="frigo-title">🧊 Mon frigo</span>
        <div class="frigo-input-wrap">
          <input type="text" id="frigo-input" placeholder="agneau, tomates… (virgule ou Entrée)" onkeydown="if(event.key==='Enter')addIng()" aria-label="Ajouter un ingrédient">
          <button class="btn-add-ing" onclick="addIng()">Ajouter</button>
        </div>
      </div>
      <label class="frigo-strict-label">
        <input type="checkbox" id="frigo-strict-cb" ${S.frigo_strict?"checked":""} onchange="S.frigo_strict=this.checked;renderMain();updateCount()">
        <span>Je n'ai <strong>QUE</strong> ces ingrédients</span>
      </label>
      ${S.frigo_ings.length?`
      <div class="frigo-tags-row">
        <div class="frigo-tags">${tags}</div>
        <button class="frigo-clear" onclick="clearIngs()" aria-label="Vider le frigo">✕ Tout vider</button>
      </div>`:''}
    </div>`;
}
function addIng(){var inp=document.getElementById("frigo-input");var raw=inp.value.trim();if(!raw)return;raw.split(/[,\n]+/).map(function(s){return s.trim().toLowerCase();}).filter(Boolean).forEach(function(v){if(!S.frigo_ings.includes(v))S.frigo_ings.push(v);});inp.value="";renderFrigo();renderMain();updateCount();}
function removeIng(i){S.frigo_ings.splice(i,1);renderFrigo();renderMain();updateCount();}
function clearIngs(){S.frigo_ings=[];renderFrigo();renderMain();updateCount();}

// ── PHOTO HELPERS ─────────────────────────────────────────────────────────
var _PH='images/placeholder.webp';

// getPhotoUrl : Unsplash source avec les mots-clés PHOTO_KW exacts.
// Retourne null si aucun mot-clé disponible → les build* utilisent placeholder.
function getPhotoUrl(r){
  var id=typeof r==='string'?r:r.id;
  if(typeof PHOTO_KW==='undefined'||!PHOTO_KW[id])return null;
  var kw=PHOTO_KW[id].trim().replace(/\s+/g,'+');
  return'https://source.unsplash.com/480x320/?'+encodeURIComponent(PHOTO_KW[id].trim());
}
function _userPhoto(id){
  try{return localStorage.getItem('sn5_photo_'+id)||null;}catch(e){return null;}
}
var _onerr="this.onerror=null;this.src='"+_PH+"'";

function buildCardPhoto(r){
  var url=_userPhoto(r.id)||getPhotoUrl(r);
  if(url)return'<img class="card-photo" src="'+url+'" alt="'+r.nom+'" loading="lazy" onerror="'+_onerr+'">';
  return'<img class="card-photo" src="'+_PH+'" alt="'+r.nom+'" loading="lazy">';
}
function buildRecentPhoto(r){
  var url=_userPhoto(r.id)||getPhotoUrl(r);
  if(url)return'<img class="recent-card-photo" src="'+url+'" alt="'+r.nom+'" loading="lazy" onerror="'+_onerr+'">';
  return'<img class="recent-card-photo" src="'+_PH+'" alt="'+r.nom+'" loading="lazy">';
}
function buildAccordPhoto(r){
  var url=_userPhoto(r.id)||getPhotoUrl(r);
  if(url)return'<img class="accord-card-photo" src="'+url+'" alt="'+r.nom+'" loading="lazy" onerror="'+_onerr+'">';
  return'<img class="accord-card-photo" src="'+_PH+'" alt="'+r.nom+'" loading="lazy">';
}
function buildDetailPhoto(r){
  var url=_userPhoto(r.id)||getPhotoUrl(r);
  if(url)return'<img class="detail-photo" src="'+url+'" alt="'+r.nom+'" loading="eager" onerror="'+_onerr+'">';
  return'<img class="detail-photo" src="'+_PH+'" alt="'+r.nom+'" loading="eager">';
}
function buildMenuPhoto(r){
  var url=_userPhoto(r.id)||getPhotoUrl(r);
  if(url)return'<img class="menu-slot-photo" src="'+url+'" alt="'+r.nom+'" loading="lazy" onerror="'+_onerr+'">';
  return'<img class="menu-slot-photo" src="'+_PH+'" alt="'+r.nom+'" loading="lazy">';
}

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
        <div class="recent-card-co">${FLAGS[r.co]||""} ${r.co}</div>
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

  // reset pagination if filters changed
  var k;
  try{k=JSON.stringify({f:S.filters,fr:S.frigo_active?{a:1,ings:S.frigo_ings,strict:S.frigo_strict}:null});}catch{k="x";}
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
  const cards=viewRecs.map(r=>{
    const isFav=FAVS.has(r.id),inCart=CART.has(r.id);
    let matchExtra="";
    if(S.frigo_active&&r._match!==undefined){const pct=Math.round(r._mr*100);matchExtra=`<div class="match-strip"><div class="match-fill" style="width:${pct}%"></div></div><div class="match-label">${r._match}/${S.frigo_ings.length} ingr. correspondant${r._match>1?"s":""}</div>`;}
    const rating=RATINGS[r.id]||0;
    const ratingHtml=`<div class="card-rating" role="group" aria-label="Ma note" data-id="${r.id}">${[1,2,3,4,5].map(i=>`<span class="rs${i<=rating?" on":""}" role="button" tabindex="0" aria-label="${i} étoile${i>1?'s':''}" aria-pressed="${i<=rating}" onclick="event.stopPropagation();rateRecipe('${r.id}',${i})">★</span>`).join("")}</div>`;
    const qlbl=r.qual?`<span class="qual-pill" style="border-color:${QUAL_COLORS[r.qual]||"#aaa"};color:${QUAL_COLORS[r.qual]||"#aaa"}">${QUAL_LABELS[r.qual]||""}</span>`:"";
    return`<div class="card" role="article" aria-label="${r.nom}" data-id="${r.id}">
      ${buildCardPhoto(r)}
      <button class="card-fav-btn${isFav?" active":""}" aria-label="${isFav?'Retirer des favoris':'Ajouter aux favoris'}" aria-pressed="${isFav}" onclick="event.stopPropagation();toggleFav('${r.id}')">${isFav?"♥":"♡"}</button>
      <button class="card-cart-btn${inCart?" active":""}" aria-label="${inCart?'Retirer des courses':'Ajouter aux courses'}" aria-pressed="${inCart}" onclick="event.stopPropagation();toggleCart('${r.id}')">🛒</button>
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
        <div class="card-foot">${FLAGS[r.co]||""} ${r.co} ${rating?`· ${"★".repeat(rating)}`:""}</div>
        ${matchExtra}
      </div>
    </div>`;
  }).join("");
  const more=recs.length>_sn5MainLimit;
  main.innerHTML=`<div class="main-content"><div class="grid">${cards}</div>${more?'<div id="sn5-sentinel" style="height:1px"></div>':''}</div>`;
  document.querySelectorAll(".card[data-id]").forEach(c=>c.onclick=()=>openRecipe(c.dataset.id));

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

// ── DETAIL ────────────────────────────────────────────────────────────────
function openRecipe(id){
  S.recipe=RECIPES.find(r=>r.id===id);
  S.portions=S.recipe.bp;S.view="recipe";S.unit_mode="metric";
  addRecent(id);
  ["search-zone","filters-zone","frigo-zone","recent-zone"].forEach(z=>document.getElementById(z).style.display="none");
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

  let stepNum=0;
  const steps=r.et.split("\n").filter(s=>s.trim()).map(s=>{
    const isHead=!s.match(/^\d+[\.\)]/);
    if(isHead)return`<div class="etape-item section-head">${s}</div>`;
    stepNum++;
    const stepText=s.replace(/^\d+[\.\)]\s*/,"");
    const tm=stepText.match(/(\d+)\s*(heures?|h\b|minutes?|min\b)/i);
    let timerBtn="";
    if(tm){const num=parseInt(tm[1]);const isH=/^h/i.test(tm[2]);const sec=isH?num*3600:num*60;const lbl=isH?(num>1?num+" heures":"1 heure"):(num>1?num+" min":"1 min");timerBtn=`<br><button class="step-timer-btn" onclick="ftStart(${sec},'Étape ${stepNum} — ${r.nom.split(' ').slice(0,3).join(' ')}')" aria-label="Lancer minuteur ${lbl}">⏱ ${lbl}</button>`;}
    return`<div class="etape-item"><div class="step-num">${stepNum}</div><div class="step-text">${stepText}${timerBtn}</div></div>`;
  }).join("");

  var variantHtml=buildVariantHtml(r);
  const prepAv=detectPrepAv(r);
  const prepAvHtml=prepAv.length?`<div class="prepav-block"><div class="prepav-title">⏰ À préparer à l'avance</div>${prepAv.map(p=>`<div class="prepav-item"><span>📌</span><span>${p}</span></div>`).join("")}</div>`:"";

  const accords=getAccords(r);
  const accordsHtml=accords.length?`<div class="accords-section"><div class="accords-title">✨ Recettes pour compléter le repas</div><div class="accords-grid">${accords.map(a=>`<div class="accord-card" role="button" tabindex="0" aria-label="Voir la recette ${a.nom}" onclick="openRecipe('${a.id}')">${buildAccordPhoto(a)}<div class="accord-card-info"><div class="accord-card-nom">${a.nom}</div><div class="accord-card-lbl"><span class="cat-badge cat-${catClass(a.cat)}" style="font-size:10px;padding:2px 7px">${a.cat}</span> · ${a.chef.split(' ').slice(-1)[0]}</div></div></div>`).join("")}</div></div>`:"";

  document.getElementById("main").innerHTML=`
    <div class="detail-wrap">
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
          ${r.qual?'<div class="qual-badge" style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.55);border-radius:20px;padding:3px 11px;font-size:11px;color:#fff;letter-spacing:.3px">'+'★'.repeat(r.qual)+' '+(QUAL_LABELS[r.qual]||'')+'</div>':''}

          <div class="detail-rating-bar" role="group" aria-label="Ma note">${[1,2,3,4,5].map(i=>`<span class="rs${i<=rating?" on":""}" role="button" tabindex="0" aria-label="${i} étoile${i>1?'s':''}" aria-pressed="${i<=rating}" onclick="rateRecipe('${r.id}',${i})">★</span>`).join("")}</div>
        </div>
        <div class="detail-info-row">
          <span class="info-pill">${FLAGS[r.co]||""} ${r.co}</span>
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
            <div class="sec-lbl">Étapes de préparation</div>
            <div>${steps}</div>
          </div>
        </div>
        ${accordsHtml}
      </div>
    </div>`;
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
  document.getElementById("nav-browse").classList.add("active");
  renderFilters();renderRecent();renderMain();updateCount();
}
function toggleFav(id){
  if(FAVS.has(id)){FAVS.delete(id);toast("Retiré des favoris");}else{FAVS.add(id);toast("♥ Ajouté aux favoris");}
  saveFavs();updateBadges();
  if(S.view==="recipe")renderDetail();else if(S.view==="favs")renderFavs();else renderMain();
}
function toggleCart(id){
  if(CART.has(id)){CART.delete(id);toast("Retiré de la liste de courses");}else{CART.add(id);toast("🛒 Ajouté à la liste de courses");}
  saveCart();updateBadges();
  if(S.view==="recipe")renderDetail();else if(S.view==="courses")renderCourses();else renderMain();
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
        <div class="cooking-step-text">${step?.replace(/^\d+[\.\)]\s*/,"")}</div>
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
  const {steps}=S.cooking;const next=S.cooking_step+d;
  if(next<0)return;
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
  document.getElementById("main").innerHTML=`
    <div class="menu-wrap">
      <div class="page-title">📅 Menu de la semaine</div>
      <div class="page-sub">Générez un menu équilibré et sa liste de courses en un clic</div>
      <div class="menu-config">
        <div class="config-grp"><label>Personnes</label><input type="number" id="cfg-pers" value="4" min="1" max="20"></div>
        <div class="config-grp"><label>Occasion</label><select id="cfg-occ"><option value="famille">Repas en famille</option><option value="diner">Dîner entre amis</option><option value="romantique">Dîner romantique</option><option value="grande">Grande occasion</option></select></div>
        <div class="config-grp"><label>Régime</label><select id="cfg-regime"><option value="">Aucun</option><option value="vege">Végétarien</option><option value="gluten">Sans gluten</option><option value="lactose">Sans lactose</option><option value="seafood">Sans fruits de mer</option><option value="fish">Sans poissons</option></select></div>
        <div class="config-grp"><label>Jours</label><select id="cfg-jours"><option value="5">5 jours</option><option value="7" selected>7 jours</option></select></div>
        <button class="btn-gen-menu" onclick="generateMenu()">✨ Générer le menu</button>
      </div>
      <div id="menu-result"></div>
    </div>`;
  if(MENU_DATA)renderMenuResult();
}

function renderMenuResult(){
  if(!MENU_DATA){document.getElementById("menu-result").innerHTML="";return;}
  const html=MENU_DATA.jours.map((j,ji)=>{
    const slots=[["Entrée",j.entree],["Plat",j.plat],["Dessert",j.dessert]];
    const allInCart=slots.every(([,r])=>CART.has(r.id));
    return`<div class="menu-day">
      <div class="menu-day-hdr">
        <div class="menu-day-title">${j.day}</div>
        <button class="menu-courses-btn${allInCart?" added":""}" onclick="addMenuToCourses(${ji})">${allInCart?"✓ Dans les courses":"🛒 Ajouter aux courses"}</button>
      </div>
      <div>
        ${slots.map(([type,r])=>`
          <div class="menu-slot">
            <span class="menu-slot-type">${type}</span>
            <div class="menu-slot-recipe" onclick="openRecipe('${r.id}')">
              ${buildMenuPhoto(r)}
              <div class="menu-slot-info">
                <div class="menu-slot-nom">${r.nom}</div>
                <div class="menu-slot-meta">${r.chef.split(' ').slice(-1)[0]} · ${totTime(r)} min · diff ${r.diff}/5</div>
              </div>
            </div>
            <button class="menu-slot-change" onclick="changeMenuSlot(${ji},'${type.toLowerCase()}','${type}')">↺</button>
          </div>`).join("")}
      </div>
    </div>`;
  }).join("");
  document.getElementById("menu-result").innerHTML=html;
}

function addMenuToCourses(ji){const j=MENU_DATA.jours[ji];[j.entree,j.plat,j.dessert].forEach(r=>CART.add(r.id));saveCart();updateBadges();toast("🛒 Ajouté aux courses");renderMenuResult();}
function changeMenuSlot(ji,field,type){
  const current=MENU_DATA.jours[ji][field];
  const usedIds=new Set(MENU_DATA.jours.flatMap(j=>[j.entree?.id,j.plat?.id,j.dessert?.id]).filter(Boolean));
  usedIds.delete(current.id);
  const avail=RECIPES.filter(r=>r.cat===type&&!usedIds.has(r.id));
  if(!avail.length)return;
  MENU_DATA.jours[ji][field]=avail[Math.floor(Math.random()*avail.length)];
  renderMenuResult();
}

// ── FAVORIS ───────────────────────────────────────────────────────────────
function renderFavs(q){
  q=q||"";
  var ql=q.toLowerCase();
  var favRecs=RECIPES.filter(function(r){
    if(!FAVS.has(r.id))return false;
    if(ql&&!r.nom.toLowerCase().includes(ql)&&!r.co.toLowerCase().includes(ql))return false;
    return true;
  });
  var main=document.getElementById("main");
  var searchBar=`<div style="padding:12px 16px 0"><input type="text" value="${q}" placeholder="Rechercher dans mes favoris…" oninput="renderFavs(this.value)" style="width:100%;background:var(--bg3);border:1.5px solid var(--bord);border-radius:var(--rx);padding:8px 14px;font-size:13px;font-family:inherit;color:var(--text);outline:none"></div>`;
  if(!favRecs.length){
    main.innerHTML=searchBar+`<div class="empty"><div class="empty-ico">♡</div><p style="font-size:15px;margin-bottom:6px">${FAVS.size?"Aucun résultat":"Aucun favori pour le moment"}</p><small style="font-size:13px;color:var(--text4)">${FAVS.size?"Essayez un autre terme":"Cliquez ♡ sur une carte pour ajouter ici"}</small></div>`;
    return;
  }
  const cards=favRecs.map(r=>`
    <div class="card" data-id="${r.id}">
      ${buildCardPhoto(r)}
      <button class="card-fav-btn active" onclick="event.stopPropagation();toggleFav('${r.id}')">♥</button>
      <div class="card-body">
        <div class="card-top"><span class="cat-badge cat-${catClass(r.cat)}">${r.cat}</span><div class="diff-dots">${dots(r.diff)}</div></div>
        <div class="card-nom">${r.nom}</div>
        <div class="card-chef">${r.chef}</div>
        <div class="card-meta"><div class="meta-item"><strong>${totTime(r)}</strong> min</div><div class="meta-item"><strong>${r.bp}</strong> pers.</div><div class="meta-item meta-diff-${r.diff}">${diffLabel(r.diff)}</div></div>
        <div class="card-foot">${FLAGS[r.co]||""} ${r.co} ${RATINGS[r.id]?`· ${"★".repeat(RATINGS[r.id])}`:""}</div>
      </div>
    </div>`).join("");
  main.innerHTML=`<div class="page-header"><div class="page-title">Mes favoris</div><div style="font-size:13px;color:var(--text3);margin-bottom:20px">${favRecs.length} recette${favRecs.length>1?"s":""} sauvegardée${favRecs.length>1?"s":""}</div></div><div style="padding:0 20px"><div class="grid">${cards}</div></div>`;
  document.querySelectorAll(".card[data-id]").forEach(c=>c.onclick=()=>openRecipe(c.dataset.id));
}

// ── LISTE DE COURSES ──────────────────────────────────────────────────────
function renderCourses(){
  const {cartRecs,groups,order}=buildCoursesAgg();
  const main=document.getElementById("main");
  const pills=RECIPES.map(r=>{const sel=CART.has(r.id);const col=CAT_COLORS[r.cat]||"#9a6f2a";return`<div class="cs-pill${sel?" selected":""}" onclick="toggleCartFromCourses('${r.id}')"><span class="cs-dot" style="background:${col}"></span>${r.nom}</div>`;}).join("");
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
      <div class="page-title" style="display:flex;align-items:center;justify-content:space-between">
        <span>🛒 Liste de courses</span>
        <div style="display:flex;gap:8px;align-items:center">
          <span id="courses-count" style="font-size:12px;color:var(--text3);font-weight:400"></span>
          <button class="btn-export" onclick="clearAllChecked()" style="font-size:12px">☐ Tout décocher</button>
        </div>
      </div>
      <input type="text" id="courses-search" placeholder="Rechercher un ingrédient..." oninput="filterCoursesDisplay()" style="width:100%;background:var(--bg3);border:1.5px solid var(--bord);border-radius:var(--rx);padding:8px 14px;font-size:13px;font-family:inherit;color:var(--text);outline:none;margin-bottom:12px">
      <div style="font-size:13px;color:var(--text3);margin-bottom:18px">Sélectionnez des recettes — les ingrédients sont consolidés automatiquement</div>
      <div class="cs-selector"><div class="cs-lbl">Choisir les recettes</div><div class="cs-pills">${pills}</div></div>
      <div class="courses-card">
        <div class="courses-card-hdr">
          <span>${cartRecs.length>0?`Ingrédients — ${cartRecs.length} recette${cartRecs.length>1?"s":""}`:""}</span>
          <div class="courses-export-btns">
            <button class="btn-export" onclick="exportCoursesText()">📋 Copier texte</button>
            <button class="btn-export" onclick="shareCoursesText()">🔗 Partager</button>
            <button class="btn-export" onclick="window.print()">🖨 Imprimer</button>
          </div>
        </div>
        ${cartRecs.length>0?html:`<div class="courses-empty">Sélectionnez des recettes ci-dessus pour générer la liste</div>`}
      </div>
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
    navigator.clipboard.writeText(url).then(function(){toast('🔗 Lien copié dans le presse-papiers !',2500,'success');}).catch(function(){_fallbackCopy(url);});
  }else{_fallbackCopy(url);}
}

// ── VUE PARAMETRES ────────────────────────────────────────────────────────
function renderSettings(){
  var lastBk=lsGet('sn5_bk',null);
  var lastBkStr=lastBk
    ?new Date(lastBk).toLocaleDateString('fr-FR')+' a '+new Date(lastBk).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})
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
  document.getElementById('main').innerHTML=`
    <div style="max-width:600px;margin:0 auto;padding:24px 20px">
      <div class="page-title" style="margin-bottom:20px">Parametres</div>
      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">Sauvegarde des donnees</div>
        <div class="setting-section-body">
          <p class="setting-desc">Exporte favoris, notes, evaluations et historique. Restaure sur n'importe quel appareil.</p>
          <div class="setting-last-backup">Derniere sauvegarde : <strong>${lastBkStr}</strong></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="act-btn" onclick="exportBackup()">Exporter</button>
            <button class="act-btn" onclick="importBackup()">Restaurer</button>
          </div>
        </div>
      </div>
      <div class="detail-card" style="margin-bottom:14px">
        <div class="setting-section-head">Catalogue des recettes</div>
        <div class="setting-section-body">
          <p class="setting-desc">${RECIPES.length} recettes au total.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button class="act-btn" onclick="exportCatalogue('csv')">CSV</button>
            <button class="act-btn" onclick="exportCatalogue('json')">JSON</button>
          </div>
        </div>
      </div>
      <div class="detail-card">
        <div class="setting-section-head">Statistiques</div>
        <div class="setting-section-body">
          <div style="margin-bottom:12px;display:flex;flex-wrap:wrap;gap:6px">${catPills}</div>
          ${countryRows}
        </div>
      </div>
    </div>`;
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

