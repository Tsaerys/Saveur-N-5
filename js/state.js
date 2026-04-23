// Saveur N°5 — État global et constantes
// ⚠️ Ne contient PAS de logique métier ni de DOM — variables et constantes uniquement.

// ── CONSTANTES ─────────────────────────────────────────────────────────────
const FLAGS={France:"🇫🇷",Italie:"🇮🇹","Grèce":"🇬🇷",Espagne:"🇪🇸",Asie:"🌏","États-Unis":"🇺🇸",Mexique:"🇲🇽",Maroc:"🇲🇦",Liban:"🇱🇧",Portugal:"🇵🇹",Scandinavie:"🇸🇪",Allemagne:"🇩🇪","Royaume-Uni":"🇬🇧",Argentine:"🇦🇷","Moyen-Orient":"🌍",Tunisie:"🇹🇳","Éthiopie":"🇪🇹",Pérou:"🇵🇪",Brésil:"🇧🇷","Amérique du Sud":"🌎",Cuba:"🇨🇺","Caraïbes":"🌴",Pologne:"🇵🇱",Hongrie:"🇭🇺","Europe Centrale":"🇪🇺",Afrique:"🌍","Sénégal":"🇸🇳",Canada:"🇨🇦",Turquie:"🇹🇷"};
const COUNTRIES=[...new Set(RECIPES.map(r=>r.co))];
const CATS=["Entrée","Plat","Dessert","Sauce / Base","Accompagnement","Assaisonnement"];
const QUAL_LABELS={1:"Source locale",2:"Recette courante",3:"Bonne source",4:"Référence reconnue",5:"Référence absolue"};
const QUAL_COLORS={1:"#aaa",2:"#f39c12",3:"#e67e22",4:"#27ae60",5:"#c0392b"};
const RAYON_ORDER=["Fruits et légumes","Boucherie / Charcuterie","Poissonnerie","Produits laitiers","Épicerie","Vins et spiritueux","Divers"];
const RAYON_MAP={
  "Fruits et légumes":["tomate","tomates","carotte","carottes","oignon","oignons","ail","ail","courgette","courgettes","aubergine","aubergines","poivron","poivrons","céleri","poireau","poireaux","navet","navets","pomme de terre","pommes de terre","ratte","artichaut","fonds d'artichaut","épinard","épinards","champignon","champignons","cèpe","cèpes","girolle","girolles","truffe","truffes","persil","ciboulette","basilic","thym","romarin","laurier","estragon","cerfeuil","aneth","menthe","coriandre","citron","citrons","orange","oranges","lime","pomme","pommes","poire","fraise","fraises","framboise","framboises","cerise","cerises","figue","figues","pêche","abricot","raisin","prune","pruneaux","grenade","ananas","mangue","avocat","concombre","radis","fenouil"],
  "Boucherie / Charcuterie":["boeuf","veau","agneau","porc","poulet","canard","lapin","pintade","dinde","entrecôte","côte","filet","gigot","épaule","jarret","queue","ris","foie","rognon","andouillette","saucisse","merguez","chorizo","lardons","pancetta","guanciale","prosciutto","jambon","lard","magret","aiguillette","blanc de poulet","cuisses de poulet","paleron","plat de côtes","gîte","poularde"],
  "Poissonnerie":["saumon","thon","sole","bar","rascasse","grondin","congre","vive","baudroie","morue","bacalhau","anchois","sardine","truite","brochet","anguille","saint-jacques","homard","langoustine","crevette","palourde","moule","huître","poulpe","calamars","clovis"],
  "Produits laitiers":["beurre","crème","lait","fromage","parmesan","pecorino","gruyère","comté","emmental","roquefort","feta","ricotta","mascarpone","mozzarella","burrata","yaourt","oeuf","oeufs","jaune d'oeuf","blancs d'oeufs","crème fraîche","fromage blanc","cottage"],
  "Épicerie":["farine","maïzena","sucre","sel","poivre","huile","vinaigre","moutarde","concentré","bouillon","vin","cidre","cognac","calvados","armagnac","rhum","pâte feuilletée","pâte brisée","levure","bicarbonate","cacao","chocolat","pépites","riz","pâtes","spaghetti","tagliatelle","penne","linguine","fettuccine","gnocchi","couscous","semoule","quinoa","lentille","pois chiche","haricot","boîte","conserve","tomates pelées","fond de veau","fond de volaille","chapelure","pain","huile d'olive","huile d'arachide","tahini","sauce soja","nuoc","mirin","miso","gochujang","pesto","wasabi"],
  "Vins et spiritueux":["vin rouge","vin blanc","champagne","cognac","calvados","armagnac","rhum","grand marnier","cointreau","marsala","porto","saké"],
  "Divers":["sel","poivre","épice","bouquet garni","noix de muscade","cannelle","cumin","curcuma","safran","paprika","piment","genévrier","clou de girofle","herbes","qs","quantité suffisante"]
};
const CAT_COLORS={Entrée:"#1a5a9a",Plat:"#9a1a1a",Dessert:"#1a6a1a","Sauce / Base":"#8a6010"};
// Teintes par cuisine — accent discret sur les cartes pour différencier les pays
const COUNTRY_COLORS={
  "France":"#1f5aa8",
  "Italie":"#2a8a3b",
  "Grèce":"#0b6ec8",
  "Espagne":"#e8a814",
  "Asie":"#b72a1f",
  "États-Unis":"#2b4f9a",
  "Mexique":"#cc5a1a",
  "Maroc":"#8a3a1a",
  "Liban":"#2a8862",
  "Portugal":"#206a3a",
  "Scandinavie":"#4b7ca8",
  "Allemagne":"#3a3a3a",
  "Royaume-Uni":"#8a1a2a",
  "Argentine":"#4fa0d8",
  "Moyen-Orient":"#a06a1a",
  "Tunisie":"#c04040",
  "Éthiopie":"#c07020",
  "Pérou":"#b02a2a",
  "Brésil":"#3aa06a",
  "Amérique du Sud":"#7a4a10",
  "Cuba":"#c09020",
  "Caraïbes":"#2aa0a0",
  "Pologne":"#a02a3a",
  "Hongrie":"#a06030",
  "Europe Centrale":"#3a5a8a",
  "Afrique":"#b07030",
  "Sénégal":"#5aa050",
  "Canada":"#c0402a",
  "Turquie":"#8a2020"
};
const PHOTO_EMOJIS={"Entrée":"🥗","Plat":"🍽","Dessert":"🍰","Sauce / Base":"🫙"};
const UNIT_DEC=["g","cl","ml","kg","L"];
const UNIT_HALF=["pièces","pièce","cs","cc","gousses","gousse","feuilles","feuille","branches","branche","tiges","tranche","tranches","pincée","bouquet","cm"];
const UNIT_CONV={"g":{"oz":0.0353},"kg":{"lb":2.2046},"cl":{"fl oz":0.338,"verre":0.1},"ml":{"fl oz":0.0338},"cs":{"ml":15,"cl":1.5},"cc":{"ml":5,"cl":0.5}};
const REGIME_KW={
  vege:["bœuf","veau","poulet","porc","agneau","canard","foie","ris","magret","lard","guanciale","pancetta","lardons","saumon","thon","homard","sole","bar","langoustine","crevette","palourde","moule","saint-jacque","poisson","gambas","anchois","sardine","truite","brochet","congre","grondin","vive","rascasse"],
  gluten:["farine","pâte","tagliatelle","spaghetti","linguine","gnocchi","filo","feuilletage","savoiardi","biscuit","pain","maïzena","chapelure","panure"],
  lactose:["beurre","crème","lait","mascarpone","parmesan","fromage","feta","burrata","pecorino","gruyère","comté","roquefort","ricotta"]
};

// ── STATE APPLICATIF ───────────────────────────────────────────────────────
var _wakeLock=null;
// Restauration du frigo depuis localStorage (persistence session)
var _frigoSaved=(function(){try{return JSON.parse(localStorage.getItem('sn5_frigo'))||{};}catch{return{};}})();
let S={view:"browse",recipe:null,portions:4,filters:{co:"",cat:"",diff:"",time:"",q:"",regime:"",qual:"",rayon:"",sort:""},frigo_active:false,frigo_ings:Array.isArray(_frigoSaved.ings)?_frigoSaved.ings.slice():[],frigo_strict:!!_frigoSaved.strict,variant:null,cooking:null,cooking_step:0,timer_interval:null,timer_remaining:0,timer_running:false,unit_mode:"metric",menu_generated:null,_editId:null,view_mode:lsGet('sn5_viewmode','grid')};

// ── MINUTEUR FLOTTANT (état) ────────────────────────────────────────────────
let FT={interval:null,remaining:0,running:false,label:""};

// ── DONNÉES MENU ───────────────────────────────────────────────────────────
let MENU_DATA=null;

// ── RECETTES UTILISATEUR ───────────────────────────────────────────────────
var USER_RECIPES=lsGet('sn5_user_recipes',[]);

// ── PERSISTENCE localStorage ───────────────────────────────────────────────
function lsGet(k,d=null){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

let FAVS=new Set(lsGet("gf",[]));
let CART=new Set(lsGet("gc",[]));
let NOTES=lsGet("gn",{});
let RATINGS=lsGet("gr2",{});
let CHECKED_ITEMS=lsGet("gci",{});
let RECENT=lsGet("grec",[]);
let STEPS_DONE=lsGet("gsd",{});// {recipeId:[stepNum,…]}

function saveCheckedItems(){lsSet("gci",CHECKED_ITEMS);}
const saveFavs=()=>lsSet("gf",[...FAVS]);
const saveCart=()=>lsSet("gc",[...CART]);
const saveNotes=()=>lsSet("gn",NOTES);
const saveRatings=()=>lsSet("gr2",RATINGS);
const saveRecent=()=>lsSet("grec",RECENT);
const saveStepsDone=()=>lsSet("gsd",STEPS_DONE);
const saveFrigo=()=>lsSet("sn5_frigo",{ings:S.frigo_ings,strict:S.frigo_strict});
const saveViewMode=()=>lsSet("sn5_viewmode",S.view_mode);
function getLastBackup(){var d=lsGet("sn5_bk",null);if(!d)return null;return new Date(d);}
function saveUserRecipes(){lsSet('sn5_user_recipes',USER_RECIPES);}

function initUserRecipes(){
  USER_RECIPES=lsGet('sn5_user_recipes',[]);
  USER_RECIPES.forEach(function(r){
    if(!RECIPES.find(function(x){ return x.id === r.id; })){
      RECIPES.push(r);
    }
  });
}
