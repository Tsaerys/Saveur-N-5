// Saveur N°5 — Carte du monde interactive (D3.js v7)
// Zone #map-zone sur l'accueil : pays colorés par cuisine présente dans RECIPES.
// Survol = tooltip (cuisine + nb recettes) · Clic = filtre la grille (S.filters.co).
// Dégradation : si D3 (CDN) ou geo-data.json indisponibles → zone vide, app intacte.

// ── CUISINE → PAYS (codes ISO3 du geo-data.json) ─────────────────────────
// Les cuisines-régions s'étendent sur plusieurs pays ; les cuisines-pays
// spécifiques (Liban, Cuba, Pérou…) sont appliquées EN DERNIER et priment.
var MAP_CUISINE_GEO={
  // Régions (appliquées d'abord)
  "Asie":["CHN","JPN","KOR","VNM","THA","IND","IDN","MYS","PHL","TWN","KHM","LAO","MMR"],
  "Scandinavie":["SWE","NOR","DNK","FIN","ISL"],
  "Moyen-Orient":["IRN","IRQ","SYR","JOR","ISR","SAU","YEM","OMN","ARE","KWT","QAT"],
  "Europe Centrale":["AUT","CZE","SVK","CHE"],
  "Afrique":["SEN","MLI","CIV","GHA","NGA","CMR","ZAF"],
  "Amérique du Sud":["COL","VEN","CHL","ECU","BOL","URY","PRY"],
  "Caraïbes":["HTI","DOM","JAM","TTO","PRI"],
  // Pays spécifiques (priment sur les régions)
  "France":["FRA"],"Italie":["ITA"],"Grèce":["GRC"],"Espagne":["ESP"],
  "Portugal":["PRT"],"Maroc":["MAR"],"Tunisie":["TUN"],"Éthiopie":["ETH"],
  "Mexique":["MEX"],"États-Unis":["USA"],"Pérou":["PER"],"Argentine":["ARG"],
  "Brésil":["BRA"],"Cuba":["CUB"],"Canada":["CAN"],"Turquie":["TUR"],
  "Liban":["LBN"],"Allemagne":["DEU"],"Royaume-Uni":["GBR"],
  "Pologne":["POL"],"Hongrie":["HUN"]
};
var _MAP_REGIONS=["Asie","Scandinavie","Moyen-Orient","Europe Centrale","Afrique","Amérique du Sud","Caraïbes"];

// ── ÉTAT INTERNE ──────────────────────────────────────────────────────────
var _mapGeo=null;        // GeoJSON chargé
var _mapBuilt=false;     // SVG déjà construit
var _mapFailed=false;    // D3/fetch KO → ne plus réessayer
var _mapIso2Cuisine=null;// ISO3 → nom de cuisine

// ISO3 → cuisine, limité aux cuisines réellement présentes dans RECIPES
function _mapBuildIndex(){
  var byCo=getRecipeCounts().byCo;
  var idx={};
  // Régions d'abord, pays spécifiques ensuite (écrasent les régions)
  _MAP_REGIONS.forEach(function(c){
    if(!byCo[c])return;
    MAP_CUISINE_GEO[c].forEach(function(iso){idx[iso]=c;});
  });
  Object.keys(MAP_CUISINE_GEO).forEach(function(c){
    if(_MAP_REGIONS.indexOf(c)>=0)return;
    if(!byCo[c])return;
    MAP_CUISINE_GEO[c].forEach(function(iso){idx[iso]=c;});
  });
  return idx;
}

// Cuisine actuellement filtrée (mono-sélection uniquement)
function _mapActiveCuisine(){
  var co=S.filters.co||"";
  return co.includes("|")?null:co;
}

// ── TOOLTIP ───────────────────────────────────────────────────────────────
function _mapTooltipShow(evt,cuisine,count){
  var tip=document.getElementById("map-tooltip");
  if(!tip)return;
  var flag=(typeof FLAGS!=="undefined"&&FLAGS[cuisine])||"";
  tip.innerHTML=flag+" <strong>"+attrEscape(cuisine)+"</strong> · "+count+" recette"+(count>1?"s":"");
  tip.style.display="block";
  _mapTooltipMove(evt);
}
function _mapTooltipMove(evt){
  var tip=document.getElementById("map-tooltip");
  var wrap=document.getElementById("map-wrap");
  if(!tip||!wrap)return;
  var r=wrap.getBoundingClientRect();
  var x=evt.clientX-r.left,y=evt.clientY-r.top;
  // Garder le tooltip dans le cadre
  var tw=tip.offsetWidth||140;
  if(x+tw+18>r.width)x=x-tw-14;else x=x+14;
  tip.style.left=x+"px";
  tip.style.top=Math.max(0,y-34)+"px";
}
function _mapTooltipHide(){
  var tip=document.getElementById("map-tooltip");
  if(tip)tip.style.display="none";
}

// ── INTERACTIONS ──────────────────────────────────────────────────────────
function _mapClickCuisine(cuisine){
  // Toggle : re-cliquer la cuisine active efface le filtre
  var next=(_mapActiveCuisine()===cuisine)?"":cuisine;
  S.filters.co=next;
  renderFilters();renderMain();updateCount();
  _mapUpdateSelection();
  if(next){
    var main=document.getElementById("main");
    if(main&&main.scrollIntoView)main.scrollIntoView({behavior:"smooth",block:"start"});
  }
}

// Met à jour les classes sélection/dim sans reconstruire le SVG
function _mapUpdateSelection(){
  var svg=document.getElementById("map-svg");
  if(!svg)return;
  var active=_mapActiveCuisine();
  var paths=svg.querySelectorAll("path[data-cuisine]");
  for(var i=0;i<paths.length;i++){
    var p=paths[i];
    var isActive=!!active&&p.getAttribute("data-cuisine")===active;
    p.classList.toggle("map-selected",isActive);
    p.classList.toggle("map-dimmed",!!active&&!isActive);
  }
  var lbl=document.getElementById("map-active-label");
  if(lbl){
    if(active&&_mapIso2Cuisine){
      var n=getRecipeCounts().byCo[active]||0;
      lbl.innerHTML=((typeof FLAGS!=="undefined"&&FLAGS[active])||"")+" "+attrEscape(active)
        +" · "+n+" recette"+(n>1?"s":"")
        +' <button class="map-clear-btn" onclick="_mapClickCuisine(\''+active.replace(/'/g,"\\'")+'\')" aria-label="Effacer le filtre pays">✕</button>';
      lbl.style.display="";
    }else{
      lbl.innerHTML="";lbl.style.display="none";
    }
  }
}

// ── CONSTRUCTION SVG ──────────────────────────────────────────────────────
function _mapBuildSvg(){
  var zone=document.getElementById("map-zone");
  if(!zone||!_mapGeo||typeof d3==="undefined")return;
  _mapIso2Cuisine=_mapBuildIndex();
  var byCo=getRecipeCounts().byCo;

  var W=960,H=480;
  var feats=_mapGeo.features.filter(function(f){return f.id!=="ATA";}); // sans Antarctique
  var fc={type:"FeatureCollection",features:feats};
  var projection=d3.geoNaturalEarth1();
  projection.fitSize([W,H],fc);
  var path=d3.geoPath(projection);

  zone.innerHTML=
    '<div class="map-section">'
    +'<div class="map-header">'
    +'<span class="map-title">🌍 Voyage culinaire</span>'
    +'<span class="map-sub"> · Cliquez sur un pays pour explorer sa cuisine</span>'
    +'</div>'
    +'<div id="map-active-label" class="map-active-label" style="display:none" aria-live="polite"></div>'
    +'<div id="map-wrap" class="map-wrap">'
    +'<svg id="map-svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Carte du monde des cuisines — les pays colorés ont des recettes"></svg>'
    +'<div id="map-tooltip" class="map-tooltip" role="tooltip" style="display:none"></div>'
    +'</div>'
    +'</div>';

  var svg=d3.select("#map-svg");
  var g=svg.append("g");

  g.selectAll("path")
    .data(feats)
    .enter()
    .append("path")
    .attr("d",path)
    .attr("class",function(f){return _mapIso2Cuisine[f.id]?"map-country map-has-cuisine":"map-country map-neutral";})
    .attr("data-cuisine",function(f){return _mapIso2Cuisine[f.id]||null;})
    .attr("fill",function(f){
      var c=_mapIso2Cuisine[f.id];
      return c?((typeof COUNTRY_COLORS!=="undefined"&&COUNTRY_COLORS[c])||"#9a6f2a"):null;
    })
    .attr("tabindex",function(f){return _mapIso2Cuisine[f.id]?0:null;})
    .attr("role",function(f){return _mapIso2Cuisine[f.id]?"button":null;})
    .attr("aria-label",function(f){
      var c=_mapIso2Cuisine[f.id];
      if(!c)return null;
      var n=byCo[c]||0;
      return"Cuisine : "+c+" — "+n+" recette"+(n>1?"s":"");
    });

  // Délégation d'événements sur le SVG (souris + tactile via Pointer Events)
  var svgEl=document.getElementById("map-svg");

  function cuisineOf(target){
    var t=target&&target.closest?target.closest("path[data-cuisine]"):null;
    var c=t&&t.getAttribute("data-cuisine");
    return c?{el:t,cuisine:c}:null;
  }

  svgEl.addEventListener("pointermove",function(e){
    var hit=cuisineOf(e.target);
    if(hit){_mapTooltipShow(e,hit.cuisine,byCo[hit.cuisine]||0);}
    else{_mapTooltipHide();}
  },{passive:true});
  svgEl.addEventListener("pointerleave",_mapTooltipHide,{passive:true});

  // Tactile : un tap affiche le tooltip ET filtre (le click suit le touchend)
  svgEl.addEventListener("touchstart",function(e){
    var t=e.touches&&e.touches[0];
    if(!t)return;
    var el=document.elementFromPoint(t.clientX,t.clientY);
    var hit=cuisineOf(el);
    if(hit)_mapTooltipShow({clientX:t.clientX,clientY:t.clientY},hit.cuisine,byCo[hit.cuisine]||0);
    else _mapTooltipHide();
  },{passive:true});

  svgEl.addEventListener("click",function(e){
    var hit=cuisineOf(e.target);
    if(hit)_mapClickCuisine(hit.cuisine);
  });
  svgEl.addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!==" ")return;
    var hit=cuisineOf(e.target);
    if(hit){e.preventDefault();_mapClickCuisine(hit.cuisine);}
  });

  _mapBuilt=true;
  _mapUpdateSelection();
}

// ── POINT D'ENTRÉE (appelé depuis le wrapper renderMain, comme renderHelix) ─
function renderWorldMap(){
  var zone=document.getElementById("map-zone");
  if(!zone)return;

  // Carte visible uniquement sur l'accueil (browse)
  if(S.view!=="browse"){zone.style.display="none";return;}
  zone.style.display="";

  if(_mapFailed)return;
  if(typeof d3==="undefined"){_mapFailed=true;zone.innerHTML="";return;} // CDN absent (hors-ligne 1re visite)

  if(_mapBuilt){_mapUpdateSelection();return;}

  if(_mapGeo){_mapBuildSvg();return;}
  if(_mapGeo===false)return; // fetch en cours

  _mapGeo=false;
  fetch("geo-data.json")
    .then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json();})
    .then(function(json){
      _mapGeo=json;
      if(S.view==="browse")_mapBuildSvg();
    })
    .catch(function(e){
      console.warn("[SN5] Carte indisponible :",e);
      _mapFailed=true;_mapGeo=null;zone.innerHTML="";
    });
}
