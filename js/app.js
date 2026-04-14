// Saveur N°5 — Orchestration (v14)

function bindEvents(){
  document.getElementById("logo-home").onclick=()=>{if(S.view==="recipe")goBack();else if(S.view!=="browse")setView("browse");};
}

function render(){
  renderFilters();
  renderRecent();
  // Restore from hash on load
  var initHash = window.location.hash.replace('#','');
  if (initHash.startsWith('recette/')) {
    var initId = initHash.split('/')[1];
    var initR = RECIPES.find(x => x.id === initId);
    if (initR) { openRecipe(initId); } else { renderMain(); }
  } else {
    renderMain();
  }
}

function init(){
  validateRecipes();
  warnRecipeDuplicates();
  checkState();

  initUserRecipes();
  updateBadges();
  initTheme();
  initScrollTop();
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
              t.innerHTML = 'Mise a jour disponible <button onclick="location.reload()" style="background:var(--gold-l);color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:12px;margin-left:8px">Recharger</button>';
              t.classList.add('show');
              t.style.pointerEvents = 'auto';
            }
          }
        });
      });
    }).catch(e => console.warn('SW failed:', e));
  });
}

init();

