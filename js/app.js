// Saveur N°5 — Orchestration
// ── VERSION (à incrémenter à chaque déploiement, synchronisée avec sw.js) ─
// Workflow à chaque mise à jour :
//   1. Bumper CACHE_NAME dans sw.js
//   2. Mettre à jour _SN5_VER ci-dessous à la même valeur
//   3. Ajouter un bloc en tête de _SN5_LOG (plus récent d'abord)
//   4. Mettre à jour CHANGELOG.md à la racine du projet
var _SN5_VER = 'v27';
var _SN5_LOG = [
  {
    v: 'v27', date: '26 avril 2026', titre: 'Vague B — 9 frictions UX résolues',
    items: [
      '🟠 Barre d\'actions fiche recette : hiérarchie claire (primaires/secondaires/menu ⋯)',
      '🟠 Plus de double scroll sur la fiche : ingrédients en sticky simple',
      '🟠 Étoiles de notation : contour doré visible en mode clair',
      '🟠 Filtres : labels en majuscules typés vs valeurs sélectionnées en gold',
      '🟠 Carrousel hélix : flèches latérales ‹/› + dots de pagination cliquables',
      '🟠 Cartes "Récemment consultées" : badge cat + temps + difficulté',
      '🟠 Page Menu vide : 3 jours-exemples + features + illustration',
      '🟠 Page Favoris vide : 3 « coups de cœur du jour » qual=5',
      '🟠 Recherche avancée : tip flottant qui apparaît au focus du champ',
      '🐛 Bug helix : référence à _PH disparu réparée (utilise art CSS)',
      '⚫ SW v27'
    ]
  },
  {
    v: 'v26', date: '25 avril 2026', titre: 'Vague A — 5 bugs critiques UI corrigés',
    items: [
      '🔴 Cartes recettes : visuels uniques par recette (gradient + emoji catégorie + drapeau pays) — fini la cloche dorée pour les 794 recettes',
      '🔴 Bouton « Créer » : routing nettoyé en switch explicite, sécurisation des références DOM',
      '🔴 Titre fantôme sur hero supprimé (plus d\'image cassée, donc plus d\'attribut alt rendu)',
      '🔴 Contraste hero recette : gradient sombre intensifié (0.85 → 0.18) + double text-shadow sur le titre',
      '🔴 Filtre Chef : dropdown 300+ entrées remplacé par autocomplete avec recherche live',
      '⚫ SW v26'
    ]
  },
  {
    v: 'v25', date: '25 avril 2026', titre: 'Audit qualité recettes — versions chef étoilé',
    items: [
      '🔵 23 recettes réécrites en versions chef étoilé élaborées (FR039 à FR056 + IT023 à IT027)',
      '👨‍🍳 Attributions : Louis Diat (Vichyssoise), Anne-Sophie Pic (Gratin Dauphinois, Clafoutis), Alain Ducasse (Ratatouille confite), Pierre Gagnaire (Brandade), Joël Robuchon (Poulet rôti), Christian Constant (Cassoulet 3 jours), Henri Charpentier (Crêpes Suzette 1895), Cédric Grolet (Tarte aux fraises), Michel Roux (Soufflé), Bernard Loiseau (Œufs en meurette), Massimo Bottura (Aglio e olio, Risotto porcini), Enzo Coccia (Pizza Margherita STG)…',
      '📖 Étapes développées avec techniques professionnelles : confit séparé, mantecatura, salaison, fermentation longue, repos brechet en bas, beurre manié, etc.',
      '🌟 Champ qualité (qual:5) ajouté aux 23 recettes',
      '⚫ SW v25'
    ]
  },
  {
    v: 'v24', date: '25 avril 2026', titre: '+142 nouvelles recettes internationales',
    items: [
      '🌍 142 nouvelles recettes ajoutées (Japon, Mexique, Corée, Vietnam, Thaïlande, Inde, Pérou, Brésil, Argentine, Maroc, Tunisie, Éthiopie, Sénégal, Turquie, Liban, Iran, Scandinavie…)',
      '📊 Base portée à 794 recettes au total',
      '⚫ SW v24'
    ]
  },
  {
    v: 'v23', date: '24 avril 2026', titre: 'Lisibilité, navigation & organisation',
    items: [
      '🔴 Carrousel Hélice : titres latéraux désormais lisibles (fond opaque, plus de flou)',
      '🔴 Fiche recette : suppression du « titre fantôme » dupliqué en arrière-plan',
      '🟠 Aide à la recherche : bouton « ? » avec exemples cliquables (chef: / pays: / cat: / "phrase" / -exclusion)',
      '🟠 Filtres saison (Printemps / Été / Automne / Hiver) et chef',
      '🟠 Fil d\'Ariane sur la fiche recette pour revenir aux filtres pays/catégorie',
      '🟡 Vue Favoris : onglets « Tous » / « Notés », filtre par tag, édition de tags par carte',
      '🟡 Vue Courses : recherche interne, import depuis Favoris ou Menu',
      '🟡 Filtre multi-sélection : pays/cat/chef cumulables via modale dédiée',
      '🟡 Transfert QR : exporter ses favoris/notes/tags vers un autre appareil par scan',
      '⚫ SW v23'
    ]
  },
  {
    v: 'v22', date: '22 avril 2026', titre: 'Historique des mises à jour',
    items: [
      '📋 Notes de mise à jour complètes désormais visibles dans Réglages → « 📋 Nouveautés »',
      '🆕 Popup automatique : affiche toutes les versions non vues depuis votre dernière visite',
      '📄 CHANGELOG.md ajouté à la racine du projet'
    ]
  },
  {
    v: 'v21', date: '22 avril 2026', titre: 'Ajustement Courses',
    items: [
      '🟠 Vue Courses : ingrédients tout en haut, sélecteur de recettes en dessous'
    ]
  },
  {
    v: 'v20', date: '22 avril 2026', titre: 'UX, A11y, recherche avancée & impression',
    items: [
      '🔴 Carrousel Printemps : plus de chevauchement visuel',
      '🔴 Titres sur 3 lignes avec coupure propre (fini l\'ellipse sauvage)',
      '🔴 Contraste WCAG AA respecté partout',
      '🟠 Animation pop sur ♥ / 🛒, pulse du badge, vibration haptique',
      '🟠 Recherche avancée : chef: / pays: / cat: / ing: / -exclusion / "phrase"',
      '🟡 Checkbox par étape (fiche + mode cuisine) avec persistence',
      '🟡 Auto-cochage de l\'étape en avançant en mode cuisine',
      '🟡 Impression A4 totalement refaite (typo serif, 2 colonnes, pied de page)',
      '🟢 Focus clavier visible sur tout élément interactif',
      '🟢 Skip link « Aller au contenu », labels ARIA drapeaux/notes',
      '🔵 Bannière reformulée, modale ℹ « Échelle de qualité »'
    ]
  },
  {
    v: 'v19', date: '22 avril 2026', titre: 'Dev mode & mises à jour immédiates',
    items: [
      '🔵 Dev mode : ?dev=1 dans l\'URL pour débloquer DevTools',
      '⚫ index.html en Network First — mises à jour immédiates en ligne',
      '⚫ Bouton « 🔄 Forcer la mise à jour » dans Réglages → Maintenance'
    ]
  },
  {
    v: 'v18', date: 'Avril 2025', titre: 'Grande mise à jour',
    items: [
      '🎠 Carrousel Hélice 3D — navigation en spirale',
      '✨ Tilt 3D et spotlight doré sur les cartes',
      '🔄 Transitions de page fluides (View Transitions API)',
      '🌊 Ripple + boutons magnétiques',
      '🔊 Sous-Chef Vocal — lecture étape par étape',
      '🔪 Mode Focus — cuisine plein écran',
      '🦐 Filtres Sans fruits de mer & Sans poissons',
      '📸 Photo personnalisée par recette',
      '🔗 Mode Partage — lien direct vers une recette',
      '🍃 Accueil saisonnier intelligent',
      '♿ Accessibilité ARIA enrichie sur tous les contrôles'
    ]
  }
];
// Rend le HTML d'une entrée de changelog (réutilisé par l'auto-popup et showChangelog)
function _sn5LogEntryHTML(entry){
  return'<div class="changelog-version-tag">'+entry.v+' · '+entry.date+'</div>'
    +'<div class="changelog-titre">'+entry.titre+'</div>'
    +'<ul class="changelog-list">'
    +entry.items.map(function(i){return'<li>'+i+'</li>';}).join('')
    +'</ul>';
}

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
  if(typeof handleImportHash==="function")handleImportHash();
  if(typeof updateBadges==="function")updateBadges();
  if(typeof initTheme==="function")initTheme();
  if(typeof initScrollTop==="function")initScrollTop();
  initTopbarScroll();
  bindEvents();
  _initCardEffects();
  _initMagnetic();
  _initRipple();
  _initKeyboardShortcuts();
  render();

  // Si le frigo contient des ingrédients sauvegardés, réactiver la zone
  if(S.frigo_ings&&S.frigo_ings.length){
    S.frigo_active=true;
    var nf=document.getElementById('nav-frigo');if(nf)nf.classList.add('active');
    var fz=document.getElementById('frigo-zone');if(fz){fz.style.display='';renderFrigo();}
  }

  setTimeout(checkChangelog, 500);
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

// Force mise à jour : vide tous les caches, désenregistre le SW, recharge (contourne le cache SW cache-first)
function forceUpdate(){
  if(typeof toast==='function')toast('🔄 Mise à jour en cours…',4000);
  var tasks=[];
  if('caches' in window){
    tasks.push(caches.keys().then(function(keys){return Promise.all(keys.map(function(k){return caches.delete(k);}));}));
  }
  if('serviceWorker' in navigator){
    tasks.push(navigator.serviceWorker.getRegistrations().then(function(regs){return Promise.all(regs.map(function(r){return r.unregister();}));}));
  }
  Promise.all(tasks).catch(function(){}).then(function(){
    // Cache-bust le reload pour forcer le navigateur à refetch index.html depuis le réseau
    var u=new URL(window.location.href);
    u.searchParams.set('_v',Date.now());
    window.location.replace(u.toString());
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
/* ── View Transition : Carte → Détail ── */
(function(){
  var _orig=window.openRecipe;
  window.openRecipe=function(id){
    var doOpen=function(){
      _orig(id);
      _injectDetailButtons();
      var dp=document.querySelector('.detail-photo');
      if(dp) dp.style.viewTransitionName='recipe-hero';
    };
    var cp=document.querySelector('.card[data-id="'+id+'"] .card-photo');
    if(cp&&'startViewTransition'in document){
      cp.style.viewTransitionName='recipe-hero';
      document.startViewTransition(function(){ cp.style.viewTransitionName=''; doOpen(); });
    }else{ doOpen(); }
  };
})();
/* ── View Transition : Détail → Liste ── */
(function(){
  var _orig=window.goBack;
  window.goBack=function(){
    if(!('startViewTransition'in document)){ _orig(); return; }
    var dp=document.querySelector('.detail-photo');
    var prevId=S.recipe&&S.recipe.id;
    if(dp) dp.style.viewTransitionName='recipe-hero';
    document.startViewTransition(function(){
      if(dp) dp.style.viewTransitionName='';
      _orig();
      if(prevId){
        var cp=document.querySelector('.card[data-id="'+prevId+'"] .card-photo');
        if(cp) cp.style.viewTransitionName='recipe-hero';
      }
    });
  };
})();
(function(){
  var _orig=window.renderMain;
  window.renderMain=function(){ _orig(); renderSeasonal(); renderHelix(); };
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
  if(S.view!=='browse'||hasAnyFilter(true)){zone.innerHTML='';return;}
  var m=new Date().getMonth();
  var data=SEASON_DATA[m];
  var recs=getSeasonalRecipes();
  if(!data||!recs.length){zone.innerHTML='';return;}
  var cards=recs.map(function(r){
    var url=_userPhoto(r.id);
    var photo = url
      ? '<img class="seasonal-photo" src="'+url+'" alt="'+r.nom+'" loading="lazy">'
      : (typeof _artHtml==='function'
          ? _artHtml(r,'seasonal-photo recipe-art-seasonal','40px')
          : '<div class="seasonal-photo" style="background:'+(COUNTRY_COLORS[r.co]||'#9a6f2a')+'"></div>');
    return '<div class="seasonal-card" onclick="openRecipe(\''+r.id+'\')">'
      +photo
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

// ── CHANGELOG ─────────────────────────────────────────────────────────────
// Affiche automatiquement toutes les versions non vues depuis `sn5_version_seen`.
function checkChangelog(){
  try{
    var seen=lsGet('sn5_version_seen','');
    if(seen===_SN5_VER) return;
    lsSet('sn5_version_seen',_SN5_VER);
    var seenIdx=_SN5_LOG.findIndex(function(e){return e.v===seen;});
    // Si inconnu (nouveau user ou version disparue) → montre uniquement la plus récente
    var entries=(seenIdx<0)?_SN5_LOG.slice(0,1):_SN5_LOG.slice(0,seenIdx);
    if(!entries.length) return;
    var body=document.getElementById('changelog-body');
    if(!body) return;
    body.innerHTML=entries.map(_sn5LogEntryHTML).join('<hr class="changelog-sep">');
    var ov=document.getElementById('changelog-overlay');
    if(ov) ov.classList.add('active');
  }catch(e){}
}

function closeChangelog(){
  var ov=document.getElementById('changelog-overlay');
  if(ov) ov.classList.remove('active');
}

// ── EFFETS VISUELS AVANCÉS ────────────────────────────────────────────────

/* Détection tactile (calculée une seule fois) */
var _isTouch = window.matchMedia('(hover:none)').matches;

/* ─ Tilt 3D + Spotlight (event delegation, rAF-throttlé) ─ */
function _initCardEffects(){
  if(_isTouch) return;

  var _spotCard=null, _spotRect=null;
  var _rafId=null, _mx=0, _my=0, _ac=null;

  // Injection du glare au premier survol (lazy)
  document.addEventListener('mouseover', function(e){
    var c=e.target.closest?e.target.closest('.card[data-id]'):null;
    if(!c||c._glareAdded) return;
    c._glareAdded=true;
    var g=document.createElement('div'); g.className='card-glare';
    c.appendChild(g); c._glare=g;
    c.addEventListener('mouseenter',function(){
      c.style.transition='none'; c.style.willChange='transform';
    });
    c.addEventListener('mouseleave',function(){
      c.style.willChange='';
      c.style.transition='transform .5s cubic-bezier(.23,1,.32,1),box-shadow .3s,border-color .2s';
      c.style.transform='';
      if(c._glare) c._glare.style.backgroundImage='';
      c.style.removeProperty('--card-mx'); c.style.removeProperty('--card-my');
      setTimeout(function(){ c.style.transition=''; },520);
    });
  },{passive:true});

  // mousemove combiné : spotlight CSS vars + tilt transform (rAF)
  document.addEventListener('mousemove',function(e){
    var c=e.target.closest?e.target.closest('.card[data-id]'):null;
    if(c!==_spotCard){ _spotCard=c; _spotRect=c?c.getBoundingClientRect():null; }
    if(!c||!_spotRect) return;
    _mx=e.clientX-_spotRect.left; _my=e.clientY-_spotRect.top; _ac=c;
    if(_rafId) return;
    _rafId=requestAnimationFrame(function(){
      _rafId=null;
      if(!_ac||!_spotRect) return;
      var dx=_mx/_spotRect.width*2-1;
      var dy=_my/_spotRect.height*2-1;
      _ac.style.setProperty('--card-mx',_mx+'px');
      _ac.style.setProperty('--card-my',_my+'px');
      _ac.style.transform=
        'perspective(900px) rotateX('+(-dy*7).toFixed(2)+'deg)'
        +' rotateY('+(dx*7).toFixed(2)+'deg) scale(1.02)';
      if(_ac._glare){
        _ac._glare.style.backgroundImage=
          'radial-gradient(circle at '+((dx+1)*50).toFixed(0)+'% '
          +((dy+1)*50).toFixed(0)+'%,rgba(255,255,255,.18) 0%,transparent 65%)';
      }
    });
  },{passive:true});

  // Invalide le cache rect au scroll (positions stales)
  window.addEventListener('scroll',function(){ _spotCard=null; _spotRect=null; },{passive:true});
}

/* ─ Boutons Magnétiques (nav buttons) ─ */
function _initMagnetic(){
  // mouseleave ne se déclenche pas correctement sur tactile
  if(_isTouch) return;

  document.querySelectorAll('.nav-btn').forEach(function(btn){
    btn.addEventListener('mouseenter',function(){ btn.style.transition='none'; });
    btn.addEventListener('mousemove',function(e){
      var r=btn.getBoundingClientRect();
      var dx=e.clientX-(r.left+r.width/2);
      var dy=e.clientY-(r.top+r.height/2);
      btn.style.transform='translate('+(dx*.22).toFixed(1)+'px,'+(dy*.22).toFixed(1)+'px)';
    },{passive:true});
    btn.addEventListener('mouseleave',function(){
      btn.style.transition='transform .38s cubic-bezier(.23,1,.32,1)';
      btn.style.transform='';
      setTimeout(function(){ btn.style.transition=''; },400);
    });
  });
}

/* ─ Raccourcis clavier globaux ─ */
function showShortcuts(){var ov=document.getElementById('shortcuts-overlay');if(ov)ov.classList.add('active');}
function hideShortcuts(){var ov=document.getElementById('shortcuts-overlay');if(ov)ov.classList.remove('active');}

function _initKeyboardShortcuts(){
  var _gPressed=false; var _gTimer=null;
  document.addEventListener('keydown',function(e){
    // Ignorer si on tape dans un champ
    var t=e.target;
    var inField=t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable);
    // Ignorer si overlay modal ouvert (sauf Esc pour le fermer)
    var anyModalOpen=document.querySelector('#focus-overlay.active,#shortcuts-overlay.active,#changelog-overlay.active');

    if(e.key==='Escape'){
      if(anyModalOpen){
        document.querySelectorAll('#shortcuts-overlay.active,#changelog-overlay.active').forEach(function(o){o.classList.remove('active');});
        return;
      }
      if(S.view==='recipe'){goBack();return;}
    }

    if(inField){
      // En champ : laisser passer Escape pour blur
      if(e.key==='Escape')t.blur();
      return;
    }
    if(anyModalOpen)return;

    // Touche "?" (Shift+/ sur AZERTY/QWERTY FR) affiche les raccourcis
    if(e.key==='?'||(e.shiftKey&&e.key==='/')){ e.preventDefault(); showShortcuts(); return; }

    // "/" met le focus sur la recherche
    if(e.key==='/'&&!e.shiftKey){
      var qi=document.getElementById('qi');
      if(qi){e.preventDefault();qi.focus();qi.select&&qi.select();}
      return;
    }

    // "r" : recette aléatoire
    if(e.key==='r'||e.key==='R'){ if(typeof openRandom==='function'){e.preventDefault();openRandom();} return; }
    // "t" : thème
    if(e.key==='t'||e.key==='T'){ if(typeof toggleTheme==='function'){e.preventDefault();toggleTheme();} return; }

    // Mode Gmail-like : "g" puis lettre
    if(e.key==='g'||e.key==='G'){
      _gPressed=true;
      clearTimeout(_gTimer);
      _gTimer=setTimeout(function(){_gPressed=false;},1200);
      return;
    }
    if(_gPressed){
      _gPressed=false;clearTimeout(_gTimer);
      if(e.key==='r'||e.key==='R'){e.preventDefault();setView('browse');}
      else if(e.key==='f'||e.key==='F'){e.preventDefault();setView('favs');}
      else if(e.key==='c'||e.key==='C'){e.preventDefault();setView('courses');}
      else if(e.key==='m'||e.key==='M'){e.preventDefault();setView('menu');}
      else if(e.key==='s'||e.key==='S'){e.preventDefault();setView('settings');}
    }
  });

  // Fermer overlay shortcuts au clic extérieur
  var ov=document.getElementById('shortcuts-overlay');
  if(ov){
    ov.addEventListener('click',function(e){if(e.target===ov)hideShortcuts();});
  }
}

/* ─ Ripple au clic ─ */
function _initRipple(){
  var SEL='.nav-btn,.regime-btn,.act-btn,.helix-ctrl-btn'
    +',.focus-nav-btn,.focus-speak-btn,.qty-btn,.unit-toggle-btn'
    +',.pnotes-save,.back-btn,.cook-nav-btn,.step-timer-btn,.btn-add-ing';
  document.addEventListener('click',function(e){
    var btn=e.target.closest?e.target.closest(SEL):null;
    if(!btn) return;
    var r=btn.getBoundingClientRect();
    var sz=Math.min(Math.max(r.width,r.height)*2.0, 180);
    var sp=document.createElement('span');
    sp.className='ripple';
    sp.style.cssText='width:'+sz+'px;height:'+sz+'px;'
      +'left:'+(e.clientX-r.left-sz/2)+'px;'
      +'top:' +(e.clientY-r.top -sz/2)+'px';
    btn.appendChild(sp);
    sp.addEventListener('animationend',function(){ sp.remove(); },{once:true});
  });
}

// ── CARROUSEL HÉLICE 3D ──────────────────────────────────────────────────
var _HLX_SLOTS = 9;    // nombre de cartes DOM dans le carousel
var _HLX_DEG   = 50;   // angle (degrés) entre deux positions consécutives
var _HLX_PY    = 70;   // décalage vertical (px) par position (recalculé mobile)
var _HLX_R     = 200;  // rayon du cylindre hélicoïdal (px, recalculé mobile)
var _hlxPool   = [];   // pool de recettes (12 max)
var _hlxPos    = 0;    // position courante (flottant, interpolé)
var _hlxTarget = 0;    // position cible (entier, après snap)
var _hlxRaf    = null; // handle requestAnimationFrame
var _hlxLive   = false;
var _hlxDrag   = false;
var _hlxTouchY0 = 0;
var _hlxTgt0   = 0;

/* ── Pool de recettes ── */
function _hlxPoolBuild(){
  var seasonal = getSeasonalRecipes().slice(0, 5);
  var pool = seasonal.slice();
  var ids = new Set(pool.map(function(r){ return r.id; }));
  var shuffled = RECIPES.slice().sort(function(){ return Math.random() - 0.5; });
  for(var i = 0; i < shuffled.length && pool.length < 12; i++){
    if(!ids.has(shuffled[i].id)){ pool.push(shuffled[i]); ids.add(shuffled[i].id); }
  }
  return pool;
}

/* ── HTML d'une carte ── */
function _hlxCardHTML(r){
  var url = _userPhoto(r.id);
  var photoHtml;
  if(url){
    photoHtml = '<img class="helix-card-photo" src="'+url+'" alt="'+r.nom+'" loading="lazy">';
  } else if(typeof _artHtml === 'function'){
    photoHtml = _artHtml(r, 'helix-card-photo recipe-art-helix', '54px');
  } else {
    photoHtml = '<div class="helix-card-photo" style="background:'+(COUNTRY_COLORS[r.co]||'#9a6f2a')+'"></div>';
  }
  return photoHtml
    +'<div class="helix-card-body">'
    +'<span class="helix-card-cat">'+r.cat+'</span>'
    +'<div class="helix-card-nom">'+r.nom+'</div>'
    +'<div class="helix-card-chef">'+r.chef.split(' ').pop()+'</div>'
    +'</div>';
}

/* ── Rendu 3D (appelé à chaque frame) ── */
function _hlxRender(){
  var car = document.getElementById('helix-carousel');
  if(!car || !_hlxLive) return;
  var N = _hlxPool.length;
  if(!N) return;
  var iPos = Math.round(_hlxPos);
  var frac = _hlxPos - iPos;
  var half = Math.floor(_HLX_SLOTS / 2); // 4

  for(var s = -half; s <= half; s++){
    var card = car.querySelector('.helix-card[data-slot="'+(s+half)+'"]');
    if(!card) continue;

    /* recette cyclique pour ce slot */
    var rIdx = ((iPos + s) % N + N) % N;
    var rec  = _hlxPool[rIdx];
    if(rec && card.dataset.id !== rec.id){
      card.dataset.id = rec.id;
      card.innerHTML  = _hlxCardHTML(rec);
    }

    /* position visuelle continue */
    var vp   = s - frac;           // flottant dans [-4.5 ; +4.5]
    var ang  = vp * _HLX_DEG;     // rotation Y en degrés
    var yPx  = -vp * _HLX_PY;     // décalage vertical (px)
    var cosA = Math.cos(ang * Math.PI / 180);

    /* profondeur normalisée [0 ; 1] : 1 = face au spectateur */
    var depth = (1 + cosA) / 2;

    /* masquer cartes trop loin ou tournées derrière */
    if(depth < 0.20 || Math.abs(vp) > 3.5){
      card.style.opacity      = '0';
      card.style.visibility   = 'hidden';
      card.style.pointerEvents= 'none';
      continue;
    }

    /* titres latéraux lisibles : pas de blur, plancher d'opacité élevé */
    var opacity  = (0.78 + 0.22 * depth).toFixed(2);
    var scaleFac = (0.80 + 0.20 * depth).toFixed(3);
    var zIdx     = Math.round(depth * 100);

    card.style.visibility   = 'visible';
    card.style.opacity      = opacity;
    card.style.filter       = 'none';
    card.style.zIndex       = ''+zIdx;
    card.style.pointerEvents= depth > 0.14 ? 'auto' : 'none';
    card.style.transform    =
      'rotateY('+ang.toFixed(2)+'deg)'
      +' translateZ('+_HLX_R+'px)'
      +' translateY('+yPx.toFixed(1)+'px)'
      +' scale('+scaleFac+')';

    /* surbrillance carte centrale */
    card.classList.toggle('helix-center', depth > 0.95);
  }

  /* Mise à jour des dots de pagination */
  var dots = document.querySelectorAll('.helix-dot');
  if(dots.length){
    var activeIdx = ((iPos % N) + N) % N;
    dots.forEach(function(d, i){ d.classList.toggle('active', i === activeIdx); });
  }
}

/* ── Boucle d'animation (easing exponentiel) ── */
function _hlxStep(){
  var d = _hlxTarget - _hlxPos;
  if(Math.abs(d) < 0.002){
    _hlxPos = _hlxTarget;
    _hlxRender();
    _hlxRaf = null;
    _hlxSetTr(true);   // réactive transitions CSS à la fin
    return;
  }
  _hlxPos += d * 0.14;
  _hlxRender();
  _hlxRaf = requestAnimationFrame(_hlxStep);
}

/* ── Transitions CSS (off pendant l'animation, on au repos) ── */
function _hlxSetTr(on){
  var cards = document.querySelectorAll('.helix-card');
  var v = on ? 'opacity .28s, filter .28s, box-shadow .28s' : 'none';
  for(var i = 0; i < cards.length; i++) cards[i].style.transition = v;
}

/* ── Démarre une animation vers _hlxTarget ── */
function _hlxGo(){
  _hlxSetTr(false);
  if(_hlxRaf) cancelAnimationFrame(_hlxRaf);
  _hlxRaf = requestAnimationFrame(_hlxStep);
}

/* ── Navigation publique (boutons, clavier) ── */
function helixNavigate(dir){
  _hlxTarget += dir;
  _hlxGo();
}

/* ── Arrêt propre ── */
function _hlxStop(){
  if(_hlxRaf){ cancelAnimationFrame(_hlxRaf); _hlxRaf = null; }
  _hlxLive = false;
}

/* ── Liaison des événements (une seule fois par rendu) ── */
function _hlxBind(){
  var cont = document.getElementById('helix-container');
  if(!cont) return;

  /* Molette */
  cont.addEventListener('wheel', function(e){
    e.preventDefault();
    _hlxTarget += e.deltaY > 0 ? 1 : -1;
    _hlxGo();
  }, { passive: false });

  /* Tactile */
  cont.addEventListener('touchstart', function(e){
    _hlxDrag    = true;
    _hlxTouchY0 = e.touches[0].clientY;
    _hlxTgt0    = _hlxTarget;
    _hlxSetTr(false);
  }, { passive: true });

  cont.addEventListener('touchmove', function(e){
    if(!_hlxDrag) return;
    var dy      = _hlxTouchY0 - e.touches[0].clientY;
    _hlxTarget  = _hlxTgt0 + dy / _HLX_PY;
    _hlxPos     = _hlxTarget;          // mise à jour directe (pas d'easing pendant le drag)
    _hlxRender();
  }, { passive: true });

  cont.addEventListener('touchend', function(){
    if(!_hlxDrag) return;
    _hlxDrag   = false;
    _hlxTarget = Math.round(_hlxTarget); // snap à l'entier le plus proche
    _hlxGo();
  }, { passive: true });

  /* Clavier */
  cont.setAttribute('tabindex', '0');
  cont.addEventListener('keydown', function(e){
    if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){ e.preventDefault(); helixNavigate(1); }
    else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ e.preventDefault(); helixNavigate(-1); }
  });

  /* Clic sur une carte → ouvrir la recette */
  var car = document.getElementById('helix-carousel');
  if(car) car.addEventListener('click', function(e){
    var c = e.target.closest('.helix-card');
    if(c && c.dataset.id) openRecipe(c.dataset.id);
  });
}

/* ── Point d'entrée principal ── */
function renderHelix(){
  var zone = document.getElementById('helix-zone');
  if(!zone) return;

  /* Masquer si filtres actifs ou vue différente */
  if(S.view !== 'browse' || hasAnyFilter(true)){
    if(_hlxLive){ _hlxStop(); zone.innerHTML = ''; }
    return;
  }

  /* Si déjà vivant et carousel présent → simple re-rendu */
  if(_hlxLive && document.getElementById('helix-carousel')){
    _hlxRender();
    return;
  }

  /* Construction */
  _hlxPool   = _hlxPoolBuild();
  _hlxLive   = true;
  _hlxPos    = 0;
  _hlxTarget = 0;

  /* Paramètres adaptatifs mobile */
  var mob = window.innerWidth < 640;
  _HLX_R  = mob ? 130 : 200;
  _HLX_PY = mob ? 58  : 70;

  /* En-tête saisonnier */
  var m  = new Date().getMonth();
  var sd = SEASON_DATA[m];

  /* Slots de cartes */
  var cardsHtml = '';
  for(var i = 0; i < _HLX_SLOTS; i++){
    cardsHtml += '<div class="helix-card" data-slot="'+i+'" data-id=""'
      +' role="button" tabindex="-1" aria-label="Recette"></div>';
  }

  /* Dots de pagination — un par recette du pool */
  var dotsHtml = '';
  for(var d = 0; d < _hlxPool.length; d++){
    dotsHtml += '<button class="helix-dot" data-idx="'+d+'" aria-label="Aller à la recette '+(d+1)+'"></button>';
  }

  zone.innerHTML =
    '<div id="helix-container">'
    +'<div class="helix-header">'
    +'<div class="helix-title">◆ '+(sd ? sd.label : 'À la une')+'</div>'
    +'<div class="helix-subtitle">'+(sd ? sd.sub : 'Recettes du moment')+'</div>'
    +'</div>'
    +'<button class="helix-side-arrow helix-side-prev" onclick="helixNavigate(-1)" aria-label="Recette précédente">‹</button>'
    +'<div id="helix-scene"><div id="helix-carousel">'+cardsHtml+'</div></div>'
    +'<button class="helix-side-arrow helix-side-next" onclick="helixNavigate(1)" aria-label="Recette suivante">›</button>'
    +'<div class="helix-dots" role="tablist">'+dotsHtml+'</div>'
    +'<div class="helix-controls">'
    +'<button class="helix-ctrl-btn" onclick="helixNavigate(-1)" aria-label="Recette précédente">↑</button>'
    +'<button class="helix-ctrl-btn" onclick="helixNavigate(1)"  aria-label="Recette suivante">↓</button>'
    +'</div>'
    +'<div class="helix-hint">Flèches · Molette · Swipe · ↑↓</div>'
    +'</div>';

  /* Click sur un dot → naviguer directement à cette position */
  var dotsContainer = zone.querySelector('.helix-dots');
  if(dotsContainer) dotsContainer.addEventListener('click', function(e){
    var btn = e.target.closest('.helix-dot');
    if(!btn) return;
    var idx = parseInt(btn.dataset.idx, 10);
    if(isNaN(idx)) return;
    _hlxTarget = idx;
    if(typeof _hlxAnimate === 'function') _hlxAnimate();
    else _hlxRender();
  });

  _hlxRender();
  _hlxSetTr(true);
  _hlxBind();
}

init();
