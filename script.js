const API_BASE = 'https://raw.githubusercontent.com/komed3/rtb-api/main/api';
const FALLBACK_DATE = '2026-09-11';
const FALLBACK = [
  {rank:1,uri:'elon-musk',name:'Elon Musk',age:55,networth:913100,citizenship:'us',industry:['technology'],source:['Tesla','SpaceX'],change:{pct:.17}},
  {rank:2,uri:'larry-page',name:'Larry Page',age:53,networth:273700,citizenship:'us',industry:['technology'],source:['Google'],change:{pct:.57}},
  {rank:3,uri:'jeff-bezos',name:'Jeff Bezos',age:62,networth:268700,citizenship:'us',industry:['technology'],source:['Amazon'],change:{pct:-.17}},
  {rank:4,uri:'michael-dell',name:'Michael Dell',age:61,networth:258400,citizenship:'us',industry:['technology'],source:['Dell Technologies'],change:{pct:-3.37}},
  {rank:5,uri:'sergey-brin',name:'Sergey Brin',age:53,networth:251900,citizenship:'us',industry:['technology'],source:['Google'],change:{pct:.57}},
  {rank:6,uri:'mark-zuckerberg',name:'Mark Zuckerberg',age:42,networth:221300,citizenship:'us',industry:['technology'],source:['Meta / Facebook'],change:{pct:-1.40}},
  {rank:7,uri:'larry-ellison',name:'Larry Ellison',age:82,networth:198000,citizenship:'us',industry:['technology'],source:['Oracle'],change:{pct:-4.51}},
  {rank:8,uri:'jensen-huang',name:'Jensen Huang',age:63,networth:189200,citizenship:'us',industry:['technology'],source:['Nvidia / semiconducteurs'],change:{pct:-2.33}},
  {rank:9,uri:'steve-ballmer',name:'Steve Ballmer',age:70,networth:154200,citizenship:'us',industry:['technology'],source:['Microsoft'],change:{pct:.13}},
  {rank:10,uri:'warren-buffett',name:'Warren Buffett',age:96,networth:144200,citizenship:'us',industry:['finance-investments'],source:['Berkshire Hathaway'],change:{pct:.28}},
  {rank:11,uri:'amancio-ortega',name:'Amancio Ortega',age:90,networth:141200,citizenship:'es',industry:['fashion-retail'],source:['Zara / Inditex']},
  {rank:12,uri:'rob-walton',name:'Rob Walton & family',age:81,networth:130300,citizenship:'us',industry:['fashion-retail'],source:['Walmart']},
  {rank:13,uri:'bernard-arnault',name:'Bernard Arnault & family',age:77,networth:128200,citizenship:'fr',industry:['fashion-retail'],source:['LVMH']},
  {rank:14,uri:'jim-walton',name:'Jim Walton & family',age:78,networth:127100,citizenship:'us',industry:['fashion-retail'],source:['Walmart']},
  {rank:15,uri:'carlos-slim-helu',name:'Carlos Slim Helu & family',age:86,networth:122400,citizenship:'mx',industry:['telecom'],source:['Telecom']},
  {rank:16,uri:'alice-walton',name:'Alice Walton',age:76,networth:117000,citizenship:'us',industry:['fashion-retail'],source:['Walmart']},
  {rank:17,uri:'bill-gates',name:'Bill Gates',age:70,networth:114800,citizenship:'us',industry:['technology'],source:['Microsoft']},
  {rank:18,uri:'changpeng-zhao',name:'Changpeng Zhao',age:49,networth:114600,citizenship:'ca',industry:['finance-investments'],source:['Binance / crypto']},
  {rank:19,uri:'thomas-peterffy',name:'Thomas Peterffy',age:81,networth:103700,citizenship:'us',industry:['finance-investments'],source:['Interactive Brokers']},
  {rank:20,uri:'michael-bloomberg',name:'Michael Bloomberg',age:84,networth:94900,citizenship:'us',industry:['finance-investments'],source:['Bloomberg LP']}
];

const INDUSTRY_FR = {
  'automotive':'Automobile','construction-engineering':'Construction & ingénierie','diversified':'Diversifié','energy':'Énergie',
  'fashion-retail':'Mode & distribution','finance-investments':'Finance & investissements','food-beverage':'Alimentation & boissons',
  'gambling-casinos':'Jeux & casinos','healthcare':'Santé','logistics':'Logistique','manufacturing':'Industrie','media-entertainment':'Médias & divertissement',
  'metals-mining':'Métaux & mines','real-estate':'Immobilier','service':'Services','sports':'Sport','technology':'Technologie','telecom':'Télécoms'
};

const state = { all: [], filtered: [], page: 1, perPage: 50, date: '', live: false, max: 1 };
const $ = (s) => document.querySelector(s);
const els = {
  rows: $('#rankingRows'), pagination: $('#pagination'), search: $('#searchInput'), country: $('#countryFilter'), industry: $('#industryFilter'), worth: $('#worthFilter'),
  resultCount: $('#resultCount'), dataStatus: $('#dataStatus'), statCount: $('#statCount'), statTotal: $('#statTotal'), statCountries: $('#statCountries'), statDate: $('#statDate'), heroCount: $('#heroCount'), heroTopName: $('#heroTopName'), heroTopWorth: $('#heroTopWorth')
};

const countryNames = typeof Intl.DisplayNames !== 'undefined' ? new Intl.DisplayNames(['fr'], {type:'region'}) : null;
function countryName(code){
  if(!code) return '—';
  try { return countryNames ? countryNames.of(String(code).toUpperCase()) : String(code).toUpperCase(); } catch { return String(code).toUpperCase(); }
}
function countryFlag(code){
  if(!code || String(code).length!==2) return '🌍';
  return String(code).toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt()));
}
function industryName(v){ return INDUSTRY_FR[v] || String(v||'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }
function billionValue(v){ return Number(v||0)/1000; }
function formatWorth(v){
  const b=billionValue(v);
  return new Intl.NumberFormat('fr-FR',{maximumFractionDigits:b>=100?1:2}).format(b)+' Md$';
}
function formatTotal(v){
  const t=billionValue(v);
  return t>=1000 ? new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2}).format(t/1000)+' T$' : new Intl.NumberFormat('fr-FR',{maximumFractionDigits:0}).format(t)+' Md$';
}
function initials(name){ return String(name).replace(/&.*$/,'').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
function formatDate(date){
  if(!date) return '—';
  const d=new Date(date+'T12:00:00');
  return new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'short',year:'numeric'}).format(d);
}
function escapeHTML(s=''){ return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

async function loadData(){
  try{
    const r=await fetch(`${API_BASE}/list/rtb/latest`,{cache:'no-store'});
    if(!r.ok) throw new Error('API indisponible');
    const data=await r.json();
    if(!data || !Array.isArray(data.list) || !data.list.length) throw new Error('Réponse vide');
    state.all=data.list.map(x=>({...x,networth:Number(x.networth)||0}));
    state.date=data.date || '';
    state.live=true;
    els.dataStatus.className='status ok';
    els.dataStatus.innerHTML='<i></i> Données chargées · '+formatDate(state.date);
  }catch(err){
    state.all=FALLBACK;
    state.date=FALLBACK_DATE;
    state.live=false;
    els.dataStatus.className='status warn';
    els.dataStatus.innerHTML='<i></i> Mode secours · Top 20 embarqué';
  }
  // Fortune la plus élevée : sert d'étalon aux barres du classement
  state.max = Math.max(1, ...state.all.map(x => x.networth));
  populateFilters();
  updateHero();
  applyFilters();
}

function populateFilters(){
  const countries=[...new Set(state.all.map(x=>x.citizenship).filter(Boolean))].sort((a,b)=>countryName(a).localeCompare(countryName(b),'fr'));
  els.country.innerHTML='<option value="all">Tous les pays</option>'+countries.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(countryName(c))}</option>`).join('');
  const industries=[...new Set(state.all.flatMap(x=>Array.isArray(x.industry)?x.industry:[]).filter(Boolean))].sort((a,b)=>industryName(a).localeCompare(industryName(b),'fr'));
  els.industry.innerHTML='<option value="all">Tous les secteurs</option>'+industries.map(i=>`<option value="${escapeHTML(i)}">${escapeHTML(industryName(i))}</option>`).join('');
}

function applyFilters(){
  const q=els.search.value.trim().toLowerCase();
  const country=els.country.value;
  const industry=els.industry.value;
  const minWorth=Number(els.worth.value)*1000;
  state.filtered=state.all.filter(x=>{
    const hay=[x.name,...(x.source||[]),...(x.industry||[]),countryName(x.citizenship)].join(' ').toLowerCase();
    return x.networth>=minWorth && (!q || hay.includes(q)) && (country==='all'||x.citizenship===country) && (industry==='all'||(x.industry||[]).includes(industry));
  }).sort((a,b)=>a.rank-b.rank);
  state.page=1;
  render();
}

function updateHero(){
  const top=state.all[0];
  if(top){ els.heroTopName.textContent=top.name; els.heroTopWorth.textContent='≈ '+formatWorth(top.networth); }
  els.heroCount.textContent=new Intl.NumberFormat('fr-FR').format(state.all.length);
}

function render(){
  renderStats();
  const pages=Math.max(1,Math.ceil(state.filtered.length/state.perPage));
  if(state.page>pages) state.page=pages;
  const start=(state.page-1)*state.perPage;
  const current=state.filtered.slice(start,start+state.perPage);
  els.resultCount.textContent=`${new Intl.NumberFormat('fr-FR').format(state.filtered.length)} résultat${state.filtered.length>1?'s':''} · page ${state.page}/${pages}`;
  if(!current.length){ els.rows.innerHTML='<div class="empty">Aucun multimilliardaire ne correspond à ces filtres.</div>'; }
  else { els.rows.innerHTML=current.map(rowHTML).join(''); }
  renderPagination(pages);
}

function renderStats(){
  const total=state.filtered.reduce((s,x)=>s+x.networth,0);
  const countries=new Set(state.filtered.map(x=>x.citizenship).filter(Boolean));
  els.statCount.textContent=new Intl.NumberFormat('fr-FR').format(state.filtered.length);
  els.statTotal.textContent=formatTotal(total);
  els.statCountries.textContent=countries.size;
  els.statDate.textContent=formatDate(state.date);
}

function rowHTML(x){
  const change=x.change && typeof x.change.pct==='number' ? x.change.pct : null;
  const chClass=change===null?'flat':change>0?'up':change<0?'down':'flat';
  const chText=change===null?'—':`${change>0?'▲ ':change<0?'▼ ':''}${Math.abs(change).toLocaleString('fr-FR',{maximumFractionDigits:2})}%`;
  const sectors=(x.industry||[]).map(industryName).join(' · ') || 'Secteur non renseigné';
  const source=(x.source||[]).join(' · ') || sectors;
  const share = Math.min(100, x.networth / state.max * 100);
  return `<article class="rank-row${Number(x.rank)<=3?' podium':''}" data-uri="${escapeHTML(x.uri||'')}">
    <div class="rank-num">#${escapeHTML(x.rank)}</div>
    <div class="person"><div class="avatar">${escapeHTML(initials(x.name))}</div><div class="person-text"><div class="person-name">${escapeHTML(x.name)}</div><div class="person-sub">${escapeHTML(sectors)}${x.age?` · ${escapeHTML(x.age)} ans`:''}</div></div></div>
    <div class="worth"><strong>${escapeHTML(formatWorth(x.networth))}</strong><small>fortune estimée</small></div>
    <div class="worth-bar" style="--w:${share.toFixed(2)}%" aria-hidden="true"></div>
    <div class="business">${escapeHTML(source)}</div>
    <div class="country"><span class="flag">${countryFlag(x.citizenship)}</span><span>${escapeHTML(countryName(x.citizenship))}</span></div>
    <div class="change ${chClass}">${chText}</div>
  </article>`;
}

function renderPagination(pages){
  if(pages<=1){els.pagination.innerHTML='';return;}
  const max=7, items=[];
  let a=Math.max(1,state.page-3),b=Math.min(pages,a+max-1); a=Math.max(1,b-max+1);
  items.push(`<button ${state.page===1?'disabled':''} data-page="${state.page-1}" aria-label="Page précédente">←</button>`);
  if(a>1) items.push(`<button data-page="1">1</button>${a>2?'<span>…</span>':''}`);
  for(let p=a;p<=b;p++) items.push(`<button class="${p===state.page?'active':''}" data-page="${p}">${p}</button>`);
  if(b<pages) items.push(`${b<pages-1?'<span>…</span>':''}<button data-page="${pages}">${pages}</button>`);
  items.push(`<button ${state.page===pages?'disabled':''} data-page="${state.page+1}" aria-label="Page suivante">→</button>`);
  els.pagination.innerHTML=items.join('');
}

els.pagination.addEventListener('click',e=>{ const b=e.target.closest('button[data-page]'); if(!b||b.disabled)return; state.page=Number(b.dataset.page); render(); document.querySelector('#classement').scrollIntoView({behavior:'smooth',block:'start'}); });
let timer; els.search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(applyFilters,120)});
[els.country,els.industry,els.worth].forEach(el=>el.addEventListener('change',applyFilters));
document.querySelector('#year').textContent=new Date().getFullYear();
loadData();
