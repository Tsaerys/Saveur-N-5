// Saveur N°5 — Orchestration (v18)

// ── Mode Partage (détecté avant init) ────────────────────────────────────
(function(){
  if(new URLSearchParams(window.location.search).has('s')){
    document.body.classList.add('shared-mode');
  }
})();

function bindEvents(){
  document.getElementById("logo-home").onclick=()=>{if(S.view==="recipe")goBack();else if(S.view!=="browse")setView("browse");};
}

function render(){
  renderFilters();
  renderRecent();
  var initHash = window.location.hash.replace('#','');
  if (initHash.startsWith('recette/')) {
    var initId = initHash.split('/')[1];
    var initR = RECIPES.find(x => x.id === initId);
    if (initR) { openRecipe(initId); } else { renderMain(); }
  } else {
    renderMain();
  }
}

function initTopbarScroll(){
  var tb=document.querySelector('.topbar');
  if(!tb)return;
  var scrolled=false;
  var onScroll=function(){
    var s=window.scrollY>6;
    if(s!==scrolled){scrolled=s;tb.classList.toggle('topbar--scrolled',s);}
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
}

function init(){
  if(typeof validateRecipes==="function")validateRecipes();
  if(typeof warnRecipeDuplicates==="function")warnRecipeDuplicates();
  if(typeof checkState==="function")checkState();

  if(typeof initUserRecipes==="function")initUserRecipes();
  else console.warn("[SN5] initUserRecipes manquant (cache SW ou script non chargé)");
  if(typeof updateBadges==="function")updateBadges();
  if(typeof initTheme==="function")initTheme();
  if(typeof initScrollTop==="function")initScrollTop();
  initTopbarScroll();
  bindEvents();
  render();
}

window.addEventListener('hashchange', () => {
  const h = window.location.hash.replace('#', '');
  if (h.startsWith('recette/')) {
    const id = h.split('/')[1];
    const r = RECIPES.find(x => x.id === id);
    if (r && S.view !== 'recipe') openRecipe(id);
  } else if (h === '') {
    if (S.view === 'recipe') goBack();
  }
});

// ── SERVICE WORKER ────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('SW registered:', reg.scope);
      reg.addEventListener('updatefound', () => {
        var nw = reg.installing;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            var t = document.getElementById('toast');
            if (t) {
              t.innerHTML = 'Mise à jour disponible <button onclick="location.reload()" style="background:var(--gold-l);color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:12px;margin-left:8px">Recharger</button>';
              t.classList.add('show');
              t.style.pointerEvents = 'auto';
            }
          }
        });
      });
    }).catch(e => console.warn('SW failed:', e));
  });
}

// ── PHOTO UPLOAD ─────────────────────────────────────────────────────────
function uploadRecipePhoto(id){
  var input=document.createElement('input');
  input.type='file'; input.accept='image/*';
  input.onchange=function(e){
    var file=e.target.files[0]; if(!file)return;
    var reader=new FileReader();
    reader.onload=function(ev){
      var img=new Image();
      img.onload=function(){
        var canvas=document.createElement('canvas');
        var maxW=800,maxH=533,w=img.width,h=img.height;
        if(w>maxW){h=Math.round(h*maxW/w);w=maxW;}
        if(h>maxH){w=Math.round(w*maxH/h);h=maxH;}
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        var data=canvas.toDataURL('image/jpeg',0.82);
        try{
          localStorage.setItem('sn5_photo_'+id,data);
          toast('📸 Photo enregistrée !',2500,'success');
          var dp=document.querySelector('.detail-photo,.detail-photo-smart');
          if(dp){
            var ni=document.createElement('img');
            ni.className='detail-photo'; ni.src=data;
            ni.alt=S.recipe?S.recipe.nom:'';
            dp.replaceWith(ni);
          }
        }catch(err){ toast('⚠️ Stockage insuffisant',3000); }
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ── INJECTION BOUTONS FICHE RECETTE ──────────────────────────────────────
function _injectDetailButtons(){
  var bar=document.querySelector('.detail-actions-bar');
  if(!bar||bar.dataset.v18)return;
  bar.dataset.v18='1';

  // Bouton Mode Focus
  var focusBtn=document.createElement('button');
  focusBtn.className='act-btn';
  focusBtn.innerHTML='🔪 Focus';
  focusBtn.title='Cuisine étape par étape (plein écran)';
  focusBtn.onclick=openFocus;
  bar.insertBefore(focusBtn,bar.firstChild);

  // Bouton photo dans l'en-tête photo
  var photoWrap=document.querySelector('.detail-photo-wrap');
  if(photoWrap&&!photoWrap.querySelector('.photo-upload-btn')){
    var photoBtn=document.createElement('button');
    photoBtn.className='photo-upload-btn';
    photoBtn.innerHTML='📸';
    photoBtn.title='Ajouter ma photo';
    photoBtn.setAttribute('aria-label','Ajouter une photo personnelle');
    photoBtn.onclick=function(){if(S.recipe)uploadRecipePhoto(S.recipe.id);};
    photoWrap.appendChild(photoBtn);
  }
}

// ── WRAPPERS D'INTÉGRATION ────────────────────────────────────────────────
(function(){
  var _orig=window.openRecipe;
  window.openRecipe=function(id){ _orig(id); _injectDetailButtons(); };
})();
(function(){
  var _orig=window.renderMain;
  window.renderMain=function(){ _orig(); renderSeasonal(); };
})();

// ── MODE FOCUS ────────────────────────────────────────────────────────────
var _focusSteps=[];
var _focusIdx=0;

function openFocus(){
  if(!S.recipe)return;
  _focusSteps=S.recipe.et.split('\n').filter(function(s){
    return s.trim()&&/^\d+[\.\)]/.test(s);
  }).map(function(s){ return s.replace(/^\d+[\.\)]\s*/,''); });
  if(!_focusSteps.length){ toast('Aucune étape disponible',2200); return; }
  _focusIdx=0;
  document.getElementById('focus-overlay').classList.add('active');
  document.body.style.overflow='hidden';
  renderFocusStep();
  document.addEventListener('keydown',_focusKeyHandler);
}

function closeFocus(){
  if(window.speechSynthesis)speechSynthesis.cancel();
  document.getElementById('focus-overlay').classList.remove('active');
  document.body.style.overflow='';
  document.removeEventListener('keydown',_focusKeyHandler);
}

function _focusKeyHandler(e){
  if(e.key==='Escape')closeFocus();
  else if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key==='PageDown')focusNext();
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='PageUp')focusPrev();
  else if(e.key===' '){e.preventDefault();focusSpeak();}
}

function renderFocusStep(){
  var total=_focusSteps.length;
  var step=_focusSteps[_focusIdx]||'';
  document.getElementById('focus-recipe-title').textContent=S.recipe?S.recipe.nom:'';
  document.getElementById('focus-counter').textContent='Étape '+(_focusIdx+1)+' / '+total;
  document.getElementById('focus-progress-bar').style.width=Math.round(((_focusIdx+1)/total)*100)+'%';
  document.getElementById('focus-step-text').textContent=step;

  var tm=step.match(/(\d+)\s*(heures?|h\b|minutes?|min\b)/i);
  var tb=document.getElementById('focus-timer-bar');
  if(tm&&tb){
    var n=parseInt(tm[1]); var isH=/^h/i.test(tm[2]);
    var sec=isH?n*3600:n*60;
    var lbl=isH?(n>1?n+' h':'1 h'):(n>1?n+' min':'1 min');
    tb.innerHTML='<button class="focus-timer-btn" onclick="ftStart('+sec+',\'Étape '+(_focusIdx+1)+'\')">⏱ '+lbl+'</button>';
  }else if(tb){ tb.innerHTML=''; }

  document.getElementById('focus-prev-btn').disabled=(_focusIdx===0);
  document.getElementById('focus-next-btn').disabled=(_focusIdx===total-1);
}

function focusNext(){
  if(_focusIdx<_focusSteps.length-1){
    if(window.speechSynthesis)speechSynthesis.cancel();
    _focusIdx++;
    renderFocusStep();
    setTimeout(focusSpeak,300);
  }
}

function focusPrev(){
  if(_focusIdx>0){
    if(window.speechSynthesis)speechSynthesis.cancel();
    _focusIdx--;
    renderFocusStep();
  }
}

// ── SOUS-CHEF VOCAL ───────────────────────────────────────────────────────
var _speaking=false;

function speakText(text){
  if(!window.speechSynthesis)return;
  speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(text);
  u.lang='fr-FR'; u.rate=0.88; u.pitch=1;
  var btn=document.getElementById('focus-speak-btn');
  u.onstart=function(){ _speaking=true; if(btn)btn.classList.add('speaking'); };
  u.onend=u.onerror=function(){ _speaking=false; if(btn)btn.classList.remove('speaking'); };
  speechSynthesis.speak(u);
}

function focusSpeak(){
  var step=_focusSteps[_focusIdx];
  if(!step||!window.speechSynthesis)return;
  if(_speaking){ speechSynthesis.cancel(); }else{ speakText(step); }
}

// ── ACCUEIL INTELLIGENT ───────────────────────────────────────────────────
var SEASON_DATA=[
  {label:'Hiver gourmand',   sub:'Les classiques réconfortants de janvier',  tags:['soupe','pot-au-feu','bœuf','gratin','braisé','cassoulet','fondue','terrine','lentille','chou']},
  {label:'Hiver gourmand',   sub:'Recettes chaudes de février',              tags:['soupe','gratin','bœuf','agneau','gibier','veau','daube','ragoût','tartiflette','raclette']},
  {label:'Fin d\'hiver',     sub:'Les premiers signes du printemps',         tags:['asperge','agneau','poisson','poireau','épinard','petit pois','crème','beurre blanc']},
  {label:'Printemps',        sub:'Légèreté et saveurs nouvelles',            tags:['agneau','asperge','artichaut','poisson','petit pois','risotto','salade']},
  {label:'Printemps fleuri', sub:'La fraîcheur de mai dans l\'assiette',     tags:['asperge','fraise','fromage','petits pois','volaille','salade','tarte']},
  {label:'Début d\'été',     sub:'Légèreté et grillades',                    tags:['salade','tomate','courgette','grillades','barbecue','tarte','fraise','framboise']},
  {label:'Plein été',        sub:'Fraîcheur et terrasses',                   tags:['salade','tomate','poivron','aubergine','courgette','sorbet','glace','gaspacho']},
  {label:'Été provençal',    sub:'Les saveurs du Sud',                       tags:['ratatouille','tomate','poivron','aubergine','basilic','melon','figues']},
  {label:'Début d\'automne', sub:'Les premières saveurs d\'automne',         tags:['champignon','courge','potiron','gibier','fromage','foie gras','noix']},
  {label:'Automne',          sub:'Champignons et châtaignes',                tags:['champignon','courge','potiron','châtaigne','gibier','canard','magret','gratin','soupe']},
  {label:'Automne profond',  sub:'Les grands plats mijotés',                 tags:['soupe','gratin','gibier','bœuf','canard','cassoulet','lentille','truffe','foie gras']},
  {label:'Fêtes',            sub:'Les recettes des réveillons',              tags:['foie gras','saumon','homard','truffe','bûche','macaron','chocolat','dinde','chapon']}
];

function getSeasonalRecipes(){
  var m=new Date().getMonth();
  var data=SEASON_DATA[m]; if(!data)return[];
  var scored=RECIPES.map(function(r){
    var h=(r.nom+' '+(r.sous||'')+' '+r.cat+' '+(r.et||'')).toLowerCase();
    var sc=0; data.tags.forEach(function(t){if(h.includes(t))sc++;});
    return{r:r,sc:sc};
  }).filter(function(x){return x.sc>0;});
  if(!scored.length)return RECIPES.slice(0,5);
  scored.sort(function(a,b){ return b.sc!==a.sc?b.sc-a.sc:Math.random()-.5; });
  return scored.slice(0,5).map(function(x){return x.r;});
}

function renderSeasonal(){
  var zone=document.getElementById('seasonal-zone');
  if(!zone)return;
  var f=S.filters;
  var hasFilter=f.co||f.cat||f.diff||f.time||f.q||f.regime||f.qual||f.rayon||S.frigo_active;
  if(S.view!=='browse'||hasFilter){zone.innerHTML='';return;}
  var m=new Date().getMonth();
  var data=SEASON_DATA[m];
  var recs=getSeasonalRecipes();
  if(!data||!recs.length){zone.innerHTML='';return;}
  var cards=recs.map(function(r){
    var url=_userPhoto(r.id)||getPhotoUrl(r);
    return '<div class="seasonal-card" onclick="openRecipe(\''+r.id+'\')">'
      +'<img class="seasonal-photo" src="'+url+'" alt="'+r.nom+'" loading="lazy">'
      +'<div class="seasonal-card-body">'
      +'<div class="seasonal-card-nom">'+r.nom+'</div>'
      +'<div class="seasonal-card-chef">'+r.chef.split(' ').pop()+'</div>'
      +'</div></div>';
  }).join('');
  zone.innerHTML='<div class="seasonal-section">'
    +'<div class="seasonal-header">'
    +'<span class="seasonal-title">🍃 '+data.label+'</span>'
    +'<span class="seasonal-sub"> · '+data.sub+'</span>'
    +'</div>'
    +'<div class="seasonal-scroll">'+cards+'</div>'
    +'</div>';
}

init();
