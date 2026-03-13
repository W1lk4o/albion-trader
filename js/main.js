(function () {
  const STORAGE_KEY = 'albionTraderSession';
  const ADMIN_LOCAL_KEY = 'albionTraderAdminLocal';
  const DEFAULT_LOCATIONS = ['Caerleon', 'Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const MARKET_FEE_DEFAULT = 6.5;
  const QUALITY_LABELS = {'1':'Normal','2':'Bom','3':'Excepcional','4':'Excelente','5':'Obra-prima'};
  const CATEGORY_LABELS = {
    utilitarios: 'Utilitários',
    recursoBruto: 'Recursos brutos',
    recursoRefinado: 'Recursos refinados',
    armaduraPano: 'Armadura de pano',
    armaduraCouro: 'Armadura de couro',
    armaduraPlaca: 'Armadura de placa',
    montarias: 'Montarias'
  };
  const MARKET_CATALOG = {
    utilitarios: {
      label: 'Utilitários',
      groups: {
        bolsas: { label: 'Bolsas', items: [
          { base: 'BAG', label: 'Bolsa' }
        ]},
        capas: { label: 'Capas', items: [
          { base: 'CAPE', label: 'Capa comum' }
        ]}
      }
    },
    recursoBruto: {
      label: 'Recursos brutos',
      groups: {
        madeira: { label: 'Madeira', items: [{ base: 'WOOD', label: 'Madeira bruta' }] },
        minerio: { label: 'Minério', items: [{ base: 'ORE', label: 'Minério bruto' }] },
        fibra: { label: 'Fibra', items: [{ base: 'FIBER', label: 'Fibra bruta' }] },
        couro: { label: 'Couro', items: [{ base: 'HIDE', label: 'Couro bruto' }] },
        pedra: { label: 'Pedra', items: [{ base: 'ROCK', label: 'Pedra bruta' }] }
      }
    },
    recursoRefinado: {
      label: 'Recursos refinados',
      groups: {
        madeira: { label: 'Madeira refinada', items: [{ base: 'PLANKS', label: 'Tábuas' }] },
        metal: { label: 'Metal refinado', items: [{ base: 'METALBAR', label: 'Barra de metal' }] },
        tecido: { label: 'Tecido', items: [{ base: 'CLOTH', label: 'Tecido' }] },
        couro: { label: 'Couro refinado', items: [{ base: 'LEATHER', label: 'Couro refinado' }] },
        pedra: { label: 'Pedra refinada', items: [{ base: 'STONEBLOCK', label: 'Bloco de pedra' }] }
      }
    },
    armaduraPano: {
      label: 'Armadura de pano',
      groups: {
        capuzes: { label: 'Capuzes', items: [
          { base: 'HEAD_CLOTH_SET1', label: 'Capuz de estudioso' },
          { base: 'HEAD_CLOTH_SET2', label: 'Capuz clerical' },
          { base: 'HEAD_CLOTH_SET3', label: 'Capuz de mago' }
        ]},
        peitorais: { label: 'Peitorais', items: [
          { base: 'ARMOR_CLOTH_SET1', label: 'Túnica de estudioso' },
          { base: 'ARMOR_CLOTH_SET2', label: 'Manto clerical' },
          { base: 'ARMOR_CLOTH_SET3', label: 'Manto de mago' }
        ]},
        calcados: { label: 'Calçados', items: [
          { base: 'SHOES_CLOTH_SET1', label: 'Sandálias de estudioso' },
          { base: 'SHOES_CLOTH_SET2', label: 'Sandálias clericais' },
          { base: 'SHOES_CLOTH_SET3', label: 'Sandálias de mago' }
        ]}
      }
    },
    armaduraCouro: {
      label: 'Armadura de couro',
      groups: {
        capuzes: { label: 'Capuzes', items: [
          { base: 'HEAD_LEATHER_SET1', label: 'Capuz de mercenário' },
          { base: 'HEAD_LEATHER_SET2', label: 'Capuz de caçador' },
          { base: 'HEAD_LEATHER_SET3', label: 'Capuz de assassino' }
        ]},
        peitorais: { label: 'Peitorais', items: [
          { base: 'ARMOR_LEATHER_SET1', label: 'Casaco de mercenário' },
          { base: 'ARMOR_LEATHER_SET2', label: 'Casaco de caçador' },
          { base: 'ARMOR_LEATHER_SET3', label: 'Casaco de assassino' }
        ]},
        calcados: { label: 'Calçados', items: [
          { base: 'SHOES_LEATHER_SET1', label: 'Sapatos de mercenário' },
          { base: 'SHOES_LEATHER_SET2', label: 'Sapatos de caçador' },
          { base: 'SHOES_LEATHER_SET3', label: 'Sapatos de assassino' }
        ]}
      }
    },
    armaduraPlaca: {
      label: 'Armadura de placa',
      groups: {
        capacetes: { label: 'Capacetes', items: [
          { base: 'HEAD_PLATE_SET1', label: 'Capacete de soldado' },
          { base: 'HEAD_PLATE_SET2', label: 'Capacete de cavaleiro' },
          { base: 'HEAD_PLATE_SET3', label: 'Capacete de guardião' }
        ]},
        peitorais: { label: 'Peitorais', items: [
          { base: 'ARMOR_PLATE_SET1', label: 'Armadura de soldado' },
          { base: 'ARMOR_PLATE_SET2', label: 'Armadura de cavaleiro' },
          { base: 'ARMOR_PLATE_SET3', label: 'Armadura de guardião' }
        ]},
        botas: { label: 'Botas', items: [
          { base: 'SHOES_PLATE_SET1', label: 'Botas de soldado' },
          { base: 'SHOES_PLATE_SET2', label: 'Botas de cavaleiro' },
          { base: 'SHOES_PLATE_SET3', label: 'Botas de guardião' }
        ]}
      }
    },
    montarias: {
      label: 'Montarias',
      groups: {
        bois: { label: 'Bois', items: [{ base: 'MOUNT_OX', label: 'Boi de montaria' }] },
        cavalos: { label: 'Cavalos', items: [{ base: 'MOUNT_HORSE', label: 'Cavalo de montaria' }] }
      }
    }
  };
  const ITEM_ENTRIES = Object.values(MARKET_CATALOG).flatMap(category =>
    Object.values(category.groups).flatMap(group => group.items)
  );
  const ITEM_BY_LABEL = new Map(ITEM_ENTRIES.map(entry => [entry.label.toLowerCase(), entry]));
  const ITEM_BY_BASE = new Map(ITEM_ENTRIES.map(entry => [entry.base.toUpperCase(), entry]));
  const RADAR_CATEGORY_ORDER = Object.keys(MARKET_CATALOG);
  const POPULAR_ITEMS = [
    'T4_BAG','T4_BAG@1','T5_BAG','T5_BAG@1','T6_BAG','T6_BAG@1','T7_BAG','T8_BAG',
    'T4_CAPE','T5_CAPE','T6_CAPE','T7_CAPE','T8_CAPE',
    'T4_WOOD','T5_WOOD','T6_WOOD','T7_WOOD','T8_WOOD','T4_ORE','T5_ORE','T6_ORE','T7_ORE','T8_ORE',
    'T4_FIBER','T5_FIBER','T6_FIBER','T7_FIBER','T8_FIBER','T4_HIDE','T5_HIDE','T6_HIDE','T7_HIDE','T8_HIDE',
    'T4_ROCK','T5_ROCK','T6_ROCK','T7_ROCK','T8_ROCK','T4_PLANKS','T5_PLANKS','T6_PLANKS','T7_PLANKS','T8_PLANKS',
    'T4_METALBAR','T5_METALBAR','T6_METALBAR','T7_METALBAR','T8_METALBAR','T4_CLOTH','T5_CLOTH','T6_CLOTH','T7_CLOTH','T8_CLOTH',
    'T4_LEATHER','T5_LEATHER','T6_LEATHER','T7_LEATHER','T8_LEATHER','T4_STONEBLOCK','T5_STONEBLOCK','T6_STONEBLOCK','T7_STONEBLOCK','T8_STONEBLOCK',
    'T3_MOUNT_OX','T4_MOUNT_OX','T5_MOUNT_OX','T6_MOUNT_OX','T7_MOUNT_OX','T8_MOUNT_OX',
    'T3_MOUNT_HORSE','T4_MOUNT_HORSE','T5_MOUNT_HORSE','T6_MOUNT_HORSE','T7_MOUNT_HORSE','T8_MOUNT_HORSE',
    'T4_ARMOR_LEATHER_SET1','T4_ARMOR_LEATHER_SET2','T4_ARMOR_LEATHER_SET3','T5_ARMOR_LEATHER_SET1','T5_ARMOR_LEATHER_SET2','T5_ARMOR_LEATHER_SET3',
    'T6_ARMOR_LEATHER_SET1','T6_ARMOR_LEATHER_SET2','T6_ARMOR_LEATHER_SET3','T7_ARMOR_LEATHER_SET1','T7_ARMOR_LEATHER_SET2','T7_ARMOR_LEATHER_SET3',
    'T4_ARMOR_CLOTH_SET1','T4_ARMOR_CLOTH_SET2','T4_ARMOR_CLOTH_SET3','T5_ARMOR_CLOTH_SET1','T5_ARMOR_CLOTH_SET2','T5_ARMOR_CLOTH_SET3',
    'T6_ARMOR_CLOTH_SET1','T6_ARMOR_CLOTH_SET2','T6_ARMOR_CLOTH_SET3','T7_ARMOR_CLOTH_SET1','T7_ARMOR_CLOTH_SET2','T7_ARMOR_CLOTH_SET3',
    'T4_ARMOR_PLATE_SET1','T4_ARMOR_PLATE_SET2','T4_ARMOR_PLATE_SET3','T5_ARMOR_PLATE_SET1','T5_ARMOR_PLATE_SET2','T5_ARMOR_PLATE_SET3',
    'T6_ARMOR_PLATE_SET1','T6_ARMOR_PLATE_SET2','T6_ARMOR_PLATE_SET3','T7_ARMOR_PLATE_SET1','T7_ARMOR_PLATE_SET2','T7_ARMOR_PLATE_SET3',
    'T4_HEAD_LEATHER_SET1','T4_HEAD_LEATHER_SET2','T4_HEAD_LEATHER_SET3','T5_HEAD_LEATHER_SET1','T5_HEAD_LEATHER_SET2','T5_HEAD_LEATHER_SET3',
    'T4_HEAD_CLOTH_SET1','T4_HEAD_CLOTH_SET2','T4_HEAD_CLOTH_SET3','T5_HEAD_CLOTH_SET1','T5_HEAD_CLOTH_SET2','T5_HEAD_CLOTH_SET3',
    'T4_HEAD_PLATE_SET1','T4_HEAD_PLATE_SET2','T4_HEAD_PLATE_SET3','T5_HEAD_PLATE_SET1','T5_HEAD_PLATE_SET2','T5_HEAD_PLATE_SET3',
    'T4_SHOES_LEATHER_SET1','T4_SHOES_LEATHER_SET2','T4_SHOES_LEATHER_SET3','T5_SHOES_LEATHER_SET1','T5_SHOES_LEATHER_SET2','T5_SHOES_LEATHER_SET3',
    'T4_SHOES_CLOTH_SET1','T4_SHOES_CLOTH_SET2','T4_SHOES_CLOTH_SET3','T5_SHOES_CLOTH_SET1','T5_SHOES_CLOTH_SET2','T5_SHOES_CLOTH_SET3',
    'T4_SHOES_PLATE_SET1','T4_SHOES_PLATE_SET2','T4_SHOES_PLATE_SET3','T5_SHOES_PLATE_SET1','T5_SHOES_PLATE_SET2','T5_SHOES_PLATE_SET3'
  ];
  const ISLAND_CROPS=[
    {name:'Cenoura',tier:'T3',profit:12000,note:'boa para começar e gira rápido'},
    {name:'Trigo',tier:'T4',profit:17000,note:'boa base para fazer comida e reduzir custo'},
    {name:'Erva medicinal',tier:'T5',profit:21000,note:'mais lucro, mas depende mais do mercado'},
    {name:'Abóbora',tier:'T6',profit:19000,note:'boa quando você já tem caixa'}
  ];
  const ISLAND_ANIMALS=[
    {name:'Galinha',tier:'T3',profit:14000,feed:3500,note:'simples e boa para começar'},
    {name:'Porco',tier:'T5',profit:22000,feed:7000,note:'lucro interessante com alimentação barata'},
    {name:'Cavalo',tier:'T5',profit:28000,feed:12000,note:'bom para quem já tem mais giro'},
    {name:'Boi',tier:'T6',profit:30000,feed:14000,note:'mais capital preso, mas pode render bem'}
  ];
  let lastOpportunities = [];
  let opportunitySort = { key: 'profit', dir: 'desc' };

  function getDeviceId(){let d=localStorage.getItem('albionTraderDeviceId');if(!d){d='device-'+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('albionTraderDeviceId',d);}return d;}
  function saveSession(payload){localStorage.setItem(STORAGE_KEY,JSON.stringify(payload));}
  function getSession(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');}catch{return null;}}
  function clearSession(){localStorage.removeItem(STORAGE_KEY);}
  function getAdminLocal(){try{return JSON.parse(localStorage.getItem(ADMIN_LOCAL_KEY)||'{"users":[],"settings":{"server":"west","marketFee":6.5}}');}catch{return {users:[],settings:{server:'west',marketFee:6.5}};}}
  function saveAdminLocal(data){localStorage.setItem(ADMIN_LOCAL_KEY,JSON.stringify(data));}
  function getMergedUsers(serverUsers=[]){const local=getAdminLocal(); return [...serverUsers, ...(local.users||[])];}
  function daysUntil(dateStr){const diff=new Date(dateStr).getTime()-Date.now(); return Math.ceil(diff/86400000);}
  async function api(url,options={}){const s=getSession();const headers=Object.assign({'Content-Type':'application/json'},options.headers||{});if(s?.token) headers.Authorization=`Bearer ${s.token}`; const response=await fetch(url,Object.assign({},options,{headers})); const data=await response.json().catch(()=>({})); if(!response.ok) throw new Error(data.error||'Erro na requisição.'); return data;}

  async function handleLogin(event){event.preventDefault();const email=document.getElementById('email').value.trim();const senha=document.getElementById('senha').value;const message=document.getElementById('loginMessage');message.textContent='Entrando...'; try{const data=await api('/api/login',{method:'POST',body:JSON.stringify({email,senha,deviceId:getDeviceId()})}); saveSession(data); message.textContent='Login realizado com sucesso.'; window.location.href=data.user.admin?'/admin.html':'/dashboard.html';}catch(error){message.textContent=error.message;}}
  async function requireAuth(){const page=document.body.dataset.page; if(!page) return null; const s=getSession(); if(!s?.token){window.location.href='/'; return null;} try{const data=await api('/api/me'); const user=data.user; if(page==='admin' && !user.admin){window.location.href='/dashboard.html'; return null;} return user;}catch{clearSession(); window.location.href='/'; return null;}}
  function bindLogout(){const btn=document.getElementById('logoutBtn'); if(!btn) return; btn.addEventListener('click',()=>{clearSession();window.location.href='/';});}
  function activateSection(targetId){document.querySelectorAll('.nav-item[data-target]').forEach(i=>i.classList.toggle('active',i.dataset.target===targetId)); document.querySelectorAll('.page-section').forEach(s=>s.classList.toggle('active',s.id===targetId));}
  function bindNav(){document.querySelectorAll('[data-target]').forEach(item=>item.addEventListener('click',()=>activateSection(item.dataset.target)));}
  function formatSilver(v){return new Intl.NumberFormat('pt-BR').format(Math.round(v||0));}
  function setHtml(id,html){const el=document.getElementById(id); if(el) el.innerHTML=html;}
  function getItemEntryFromRaw(raw){
    if(!raw) return null;
    const trimmed=String(raw).trim();
    return ITEM_BY_LABEL.get(trimmed.toLowerCase()) || ITEM_BY_BASE.get(trimmed.toUpperCase()) || null;
  }
  function getSelectedRadarEntry(){
    const base=document.getElementById('radarItem')?.value || '';
    return ITEM_BY_BASE.get(base.toUpperCase()) || null;
  }
  function prettyItemName(itemId){
    const tier=(itemId.match(/^T(\d+)/)||[])[1];
    const enchant=(itemId.match(/@(\d)$/)||[])[1];
    const clean=itemId.replace(/^T\d_/,'').replace(/@\d$/,'');
    const entry=ITEM_BY_BASE.get(clean.toUpperCase());
    const base=entry?.label || clean.split('_').map(w=>w[0]+w.slice(1).toLowerCase()).join(' ');
    return `${base}${tier?` T${tier}`:''}${enchant && enchant!=='0'?'.'+enchant:''}`.trim();
  }
  function itemIdFromSelection(){
    const entry=getSelectedRadarEntry();
    const base=(entry?.base || '');
    const tier=document.getElementById('radarTier').value;
    const enchant=document.getElementById('radarEnchant').value;
    if(!base||!tier) return '';
    return `${tier}_${base}${enchant!=='0'?`@${enchant}`:''}`;
  }
  function populateRadarCategories(){
    const categorySelect=document.getElementById('radarCategory');
    if(!categorySelect) return;
    categorySelect.innerHTML = RADAR_CATEGORY_ORDER.map(key => `<option value="${key}">${MARKET_CATALOG[key].label}</option>`).join('');
    if(!categorySelect.value) categorySelect.value = RADAR_CATEGORY_ORDER[0];
    populateRadarGroups();
  }
  function populateRadarGroups(){
    const categoryKey=document.getElementById('radarCategory')?.value;
    const groupSelect=document.getElementById('radarGroup');
    if(!categoryKey || !groupSelect) return;
    const groups = MARKET_CATALOG[categoryKey]?.groups || {};
    const keys = Object.keys(groups);
    groupSelect.innerHTML = keys.map(key => `<option value="${key}">${groups[key].label}</option>`).join('');
    if(keys.length && !keys.includes(groupSelect.value)) groupSelect.value = keys[0];
    populateRadarItems();
  }
  function populateRadarItems(){
    const categoryKey=document.getElementById('radarCategory')?.value;
    const groupKey=document.getElementById('radarGroup')?.value;
    const itemSelect=document.getElementById('radarItem');
    if(!categoryKey || !groupKey || !itemSelect) return;
    const items = MARKET_CATALOG[categoryKey]?.groups?.[groupKey]?.items || [];
    itemSelect.innerHTML = items.map(item => `<option value="${item.base}">${item.label}</option>`).join('');
  }
  function isStale(dateStr,hours=168){
    if(!dateStr) return true;
    const date=new Date(dateStr);
    if(Number.isNaN(date.getTime())) return true;
    return (Date.now()-date.getTime())/36e5 > hours;
  }
  function looksLikePlaceholder(price){return /^9{6,}$/.test(String(price||''));}
  function median(nums){if(!nums.length) return 0; const arr=[...nums].sort((a,b)=>a-b); const mid=Math.floor(arr.length/2); return arr.length%2?arr[mid]:(arr[mid-1]+arr[mid])/2;}
  function sanitizeRows(rows,{strict=false}={}){
    const valid=rows.filter(r=>{
      const price=Number(r.sell_price_min||0);
      return price>0 && !looksLikePlaceholder(price) && !isStale(r.sell_price_min_date, strict?120:240);
    });
    if(valid.length<=2) return valid;
    const med=median(valid.map(r=>Number(r.sell_price_min)));
    if(med<=0) return valid;
    const low = strict ? med*0.45 : med*0.2;
    const high = strict ? med*2.2 : med*5;
    const filtered = valid.filter(r=>{
      const price=Number(r.sell_price_min||0);
      return price>=low && price<=high;
    });
    return filtered.length ? filtered : valid;
  }
  function calculateArbitrage(rows,{strict=false}={}){
    const cleaned=sanitizeRows(rows,{strict});
    if(!cleaned.length) return null;
    const sorted=[...cleaned].sort((a,b)=>Number(a.sell_price_min||0)-Number(b.sell_price_min||0));
    const bestBuy=sorted[0];
    const bestSell=sorted[sorted.length-1];
    if(!bestBuy || !bestSell) return null;
    const buyPrice=Number(bestBuy.sell_price_min||0);
    const sellPrice=Number(bestSell.sell_price_min||0);
    const tax=Math.round(sellPrice*(MARKET_FEE_DEFAULT/100));
    const transport=Math.round(buyPrice*0.04);
    const profit=sellPrice-buyPrice-tax-transport;
    const margin=buyPrice>0?(profit/buyPrice)*100:0;
    return {
      buyCity:bestBuy.city,
      sellCity:bestSell.city,
      buyPrice,
      sellPrice,
      profit,
      margin,
      tax,
      transport,
      quality:QUALITY_LABELS[String(bestBuy.quality||1)]||'Normal',
      rows:cleaned,
      hasSpread: cleaned.length>1 && bestBuy.city!==bestSell.city,
      profitable: cleaned.length>1 && bestBuy.city!==bestSell.city && profit>0
    };
  }
  async function loadMarket(){
    const itemId=itemIdFromSelection();
    const quality=document.getElementById('radarQuality').value;
    const box=document.getElementById('marketResult');
    if(!itemId){box.textContent='Escolha categoria, grupo, item, tier e qualidade.'; return;}
    box.innerHTML='<div class="muted">Buscando preços do item...</div>';
    try{
      const params=new URLSearchParams({items:itemId,locations:DEFAULT_LOCATIONS.join(','),qualities:quality,server:'west'});
      const data=await api(`/api/albion-prices?${params.toString()}`);
      const rows=data.data||[];
      const cleaned=sanitizeRows(rows,{strict:false}).sort((a,b)=>Number(a.sell_price_min||0)-Number(b.sell_price_min||0));
      if(!cleaned.length){
        box.innerHTML=`<div class="muted">Ainda não apareceu preço confiável para <strong>${prettyItemName(itemId)}</strong> nessa qualidade. Tente outra qualidade ou outro encantamento.</div>`;
        return;
      }
      const arb=calculateArbitrage(rows,{strict:false});
      const first=cleaned[0];
      const last=cleaned[cleaned.length-1];
      const buyCity=arb?.buyCity||first.city;
      const sellCity=arb?.sellCity||last.city;
      const buyPrice=arb?.buyPrice||Number(first.sell_price_min||0);
      const sellPrice=arb?.sellPrice||Number(last.sell_price_min||0);
      const profit=arb?.profit ?? (sellPrice-buyPrice-Math.round(sellPrice*(MARKET_FEE_DEFAULT/100))-Math.round(buyPrice*0.04));
      const margin=buyPrice>0?(profit/buyPrice)*100:0;
      const qualityLabel=QUALITY_LABELS[String(arb?.rows?.[0]?.quality||quality)]||'Normal';
      const statusText = !arb?.hasSpread ? 'Só encontrei preço válido em uma cidade por enquanto.' : (profit>0 ? 'Arbitragem possível agora.' : 'Há spread, mas ele ainda não cobre taxa + transporte.');
      const tableRows=cleaned.map(row=>`<tr><td>${row.city}</td><td>${formatSilver(row.sell_price_min)}</td><td>${QUALITY_LABELS[String(row.quality||quality)]||'Normal'}</td><td>${new Date(row.sell_price_min_date).toLocaleString('pt-BR')}</td></tr>`).join('');
      box.innerHTML=`
        <div class="callout-grid">
          <div class="callout-card success"><span>Cidade mais barata para comprar</span><strong>${buyCity}</strong><small>${formatSilver(buyPrice)} prata</small></div>
          <div class="callout-card success"><span>Melhor cidade para vender</span><strong>${sellCity}</strong><small>${formatSilver(sellPrice)} prata</small></div>
          <div class="callout-card"><span>Qualidade usada</span><strong>${qualityLabel}</strong><small>${prettyItemName(itemId)}</small></div>
          <div class="callout-card"><span>Lucro líquido estimado</span><strong>${formatSilver(profit)} prata</strong><small>${margin.toFixed(1)}% de margem</small></div>
        </div>
        <div class="muted top-gap"><strong>Resumo:</strong> compre em <strong>${buyCity}</strong> e venda em <strong>${sellCity}</strong>. ${statusText}</div>
        <div class="table-wrap compact-gap"><table class="data-table"><thead><tr><th>Cidade</th><th>Preço de venda</th><th>Qualidade</th><th>Atualizado em</th></tr></thead><tbody>${tableRows}</tbody></table></div>`;
    }catch(error){box.textContent=error.message;}
  }
  function setProgress(percent,text){const bar=document.getElementById('marketProgressBar'); const label=document.getElementById('marketProgressText'); if(bar) bar.style.width=`${percent}%`; if(label) label.textContent=text;}
  function buildOpportunityRows(rows){const byItem=new Map(); rows.forEach(row=>{if(!row.item_id) return; if(!byItem.has(row.item_id)) byItem.set(row.item_id,[]); byItem.get(row.item_id).push(row);}); const opportunities=[]; byItem.forEach((itemRows,itemId)=>{const arb=calculateArbitrage(itemRows); if(!arb) return; opportunities.push({itemId,itemName:prettyItemName(itemId),...arb,confidence:arb.rows.length>=4?'Boa':'Média',confidenceRank:arb.rows.length>=4?2:1});}); return opportunities.sort((a,b)=>b.profit-a.profit).slice(0,20);}
  function sortOpportunities(list){
    const {key,dir}=opportunitySort;
    const signal = dir==='asc' ? 1 : -1;
    return [...list].sort((a,b)=>{
      const av = key==='confidence' ? a.confidenceRank : a[key];
      const bv = key==='confidence' ? b.confidenceRank : b[key];
      if (typeof av === 'string') return av.localeCompare(bv,'pt-BR') * signal;
      return ((av||0)-(bv||0)) * signal;
    });
  }
  function sortArrow(key){return opportunitySort.key!==key ? '↕' : (opportunitySort.dir==='asc'?'▲':'▼');}
  function renderOpportunityTable(){
    const box=document.getElementById('opportunityResult');
    if(!box) return;
    if(!lastOpportunities.length){box.innerHTML='<div class="muted">Nenhuma oportunidade confiável encontrada agora. Tente de novo em alguns minutos.</div>'; return;}
    const opportunities = sortOpportunities(lastOpportunities);
    box.innerHTML=`<div class="table-wrap"><table class="data-table sortable-table"><thead><tr>
      <th>Item</th><th>Qualidade</th><th>Comprar</th><th>Vender</th>
      <th class="sortable" data-sort="buyPrice">Custo <span>${sortArrow('buyPrice')}</span></th>
      <th class="sortable" data-sort="sellPrice">Venda <span>${sortArrow('sellPrice')}</span></th>
      <th class="sortable" data-sort="profit">Lucro <span>${sortArrow('profit')}</span></th>
      <th class="sortable" data-sort="margin">Margem <span>${sortArrow('margin')}</span></th>
      <th class="sortable" data-sort="confidence">Confiança <span>${sortArrow('confidence')}</span></th>
    </tr></thead><tbody>${opportunities.map(op=>`<tr><td>${op.itemName}</td><td>${op.quality}</td><td>${op.buyCity}</td><td>${op.sellCity}</td><td>${formatSilver(op.buyPrice)}</td><td>${formatSilver(op.sellPrice)}</td><td>${formatSilver(op.profit)}</td><td>${op.margin.toFixed(1)}%</td><td>${op.confidence}</td></tr>`).join('')}</tbody></table></div>`;
    box.querySelectorAll('[data-sort]').forEach(header=>{
      header.addEventListener('click',()=>{
        const key = header.dataset.sort;
        if(opportunitySort.key===key){opportunitySort.dir = opportunitySort.dir==='asc'?'desc':'asc';}
        else {opportunitySort = {key, dir: key==='confidence' ? 'desc':'desc'};}
        renderOpportunityTable();
      });
    });
  }
  function chunk(list,size){const out=[]; for(let i=0;i<list.length;i+=size) out.push(list.slice(i,i+size)); return out;}
  async function loadOpportunityRadar(fullMarket=false){const box=document.getElementById('opportunityResult'); if(!box) return; const list=fullMarket?POPULAR_ITEMS:POPULAR_ITEMS.slice(0,80); const chunks=chunk(list,12); box.innerHTML='<div class="muted">Consultando mercado...</div>'; const status=document.getElementById('apiStatusBadge'); if(status) status.textContent=`AlbionData consultando ${fullMarket?'mercado completo':'itens populares'}...`; try{let allRows=[]; for(let i=0;i<chunks.length;i++){const params=new URLSearchParams({items:chunks[i].join(','),locations:DEFAULT_LOCATIONS.join(','),qualities:'1',server:'west'}); const data=await api(`/api/albion-prices?${params.toString()}`); allRows=allRows.concat(data.data||[]); const percent=Math.round(((i+1)/chunks.length)*100); setProgress(percent,`Consultando Albion Data: ${percent}%`);} lastOpportunities=buildOpportunityRows(allRows); const summary=document.getElementById('opportunitySummary'); if(status) status.textContent='AlbionData online'; setProgress(100,`${lastOpportunities.length} oportunidades confiáveis encontradas.`); if(!lastOpportunities.length){renderOpportunityTable(); if(summary) summary.textContent='Sem spreads úteis no momento.'; return;} if(summary){const best=sortOpportunities(lastOpportunities)[0]; summary.textContent=`Melhor oportunidade agora: ${best.itemName} comprando em ${best.buyCity} e vendendo em ${best.sellCity}.`;} renderOpportunityTable();}catch(error){if(status) status.textContent='AlbionData com falha'; setProgress(0,'Falha ao consultar a API do Albion.'); box.textContent=error.message;}}
  async function initDashboard(){const user=await requireAuth(); if(!user) return; const welcomeTitle=document.getElementById('welcomeTitle'); const licenseDate=document.getElementById('licenseDate'); if(welcomeTitle) welcomeTitle.textContent=`Olá, ${user.nome||user.email}`; if(licenseDate) licenseDate.textContent=new Date(user.licencaExpiraEm).toLocaleDateString('pt-BR'); const adminBtn=document.getElementById('dashboardAdminBtn'); const adminTopBtn=document.getElementById('dashboardAdminTopBtn'); if(user.admin){adminBtn?.classList.remove('hidden'); adminTopBtn?.classList.remove('hidden'); adminBtn?.addEventListener('click',()=>window.location.href='/admin.html'); adminTopBtn?.addEventListener('click',()=>window.location.href='/admin.html');} bindLogout(); bindNav(); populateRadarCategories(); document.getElementById('radarCategory')?.addEventListener('change',populateRadarGroups); document.getElementById('radarGroup')?.addEventListener('change',populateRadarItems); document.getElementById('loadMarketBtn')?.addEventListener('click',loadMarket); document.getElementById('loadOpportunityBtn')?.addEventListener('click',()=>loadOpportunityRadar(false)); document.getElementById('loadOpportunityAllBtn')?.addEventListener('click',()=>loadOpportunityRadar(true)); loadOpportunityRadar(false);}
  function activateAdminSection(targetId){document.querySelectorAll('.nav-item[data-admin-target]').forEach(i=>i.classList.toggle('active',i.dataset.adminTarget===targetId)); document.querySelectorAll('#adminOverview, #adminUsers, #adminLicenses, #adminSettings').forEach(s=>s.classList.toggle('active',s.id===targetId));}
  function bindAdminNav(){document.querySelectorAll('[data-admin-target]').forEach(item=>item.addEventListener('click',()=>activateAdminSection(item.dataset.adminTarget)));}
  function renderAdminUsers(users){const tbody=document.getElementById('adminUsersTable'); const count=document.getElementById('adminUserCount'); const pending=document.getElementById('adminPendingCount'); if(count) count.textContent=String(users.length); if(pending) pending.textContent=String(users.filter(u=>u.status==='Primeiro acesso').length); if(tbody) tbody.innerHTML=users.map(u=>`<tr><td>${u.nome||'-'}</td><td>${u.email}</td><td>${u.telefone||'-'}</td><td>${u.admin?'Admin':'Usuário'}</td><td>${new Date(u.licencaExpiraEm).toLocaleDateString('pt-BR')}</td><td>${u.status||'Ativo'}</td></tr>`).join('');}
  function renderAdminLicenses(users){const tbody=document.getElementById('adminLicensesTable'); if(!tbody) return; tbody.innerHTML=users.map(u=>`<tr><td>${u.nome||'-'}</td><td>${u.email}</td><td>${new Date(u.licencaExpiraEm).toLocaleDateString('pt-BR')}</td><td>${daysUntil(u.licencaExpiraEm)}</td><td>${u.status||'Ativo'}</td></tr>`).join('');}
  function bindAdminCreateUser(serverUsers){const form=document.getElementById('adminCreateUserForm'); if(!form) return; form.addEventListener('submit',(event)=>{event.preventDefault(); const name=document.getElementById('newUserName').value.trim(); const email=document.getElementById('newUserEmail').value.trim().toLowerCase(); const phone=document.getElementById('newUserPhone').value.trim(); const licenseDays=Number(document.getElementById('newUserLicense').value||30); const role=document.getElementById('newUserRole').value; const message=document.getElementById('adminCreateMessage'); const allUsers=getMergedUsers(serverUsers); if(allUsers.some(u=>String(u.email).toLowerCase()===email)){message.textContent='Esse email já está cadastrado.'; return;} const local=getAdminLocal(); const expires=new Date(Date.now()+licenseDays*86400000).toISOString(); local.users.push({id:'local-'+Date.now(), nome:name, email, telefone:phone, admin:role==='admin', licencaExpiraEm:expires, status:'Primeiro acesso'}); saveAdminLocal(local); message.textContent='Usuário cadastrado nesta base. Primeiro acesso ficou marcado como pendente de senha.'; form.reset(); document.getElementById('newUserLicense').value='30'; document.getElementById('newUserRole').value='user'; const merged=getMergedUsers(serverUsers); renderAdminUsers(merged); renderAdminLicenses(merged);});}
  function bindAdminSettings(){const form=document.getElementById('adminSettingsForm'); if(!form) return; const local=getAdminLocal(); document.getElementById('settingServer').value=local.settings?.server||'west'; document.getElementById('settingMarketFee').value=local.settings?.marketFee||6.5; form.addEventListener('submit',(event)=>{event.preventDefault(); const store=getAdminLocal(); store.settings={server:document.getElementById('settingServer').value, marketFee:Number(document.getElementById('settingMarketFee').value||6.5)}; saveAdminLocal(store); const msg=document.getElementById('adminSettingsMessage'); if(msg) msg.textContent='Configurações salvas nesta base local do projeto.';});}
  async function initAdmin(){const user=await requireAuth(); if(!user) return; const title=document.getElementById('adminTitle'); if(title) title.textContent=`Painel admin — ${user.nome||user.email}`; bindLogout(); bindAdminNav(); bindAdminSettings(); try{const data=await api('/api/users'); const notice=document.getElementById('adminNotice'); if(notice) notice.textContent='Lista combinada entre usuários da API e cadastros feitos neste painel.'; const merged=getMergedUsers(data.users||[]); renderAdminUsers(merged); renderAdminLicenses(merged); bindAdminCreateUser(data.users||[]);}catch(error){const notice=document.getElementById('adminNotice'); if(notice) notice.textContent=error.message;}}
  function calcCraft(){const level=Number(document.getElementById('craftLevel').value||0); const city=document.getElementById('craftCity').value; const cost=Number(document.getElementById('craftCost').value||0); const sell=Number(document.getElementById('craftSell').value||0); const bonus=level>=80?1.07:level>=50?1.04:1.01; const fee=Math.round(sell*0.065); const adjustedCost=cost/bonus; const lucro=sell-adjustedCost-fee; const margem=cost>0?(lucro/cost)*100:0; setHtml('craftResult',`<strong>Resultado do craft em ${city}</strong><br>Lucro estimado: <strong>${formatSilver(lucro)} prata</strong><br>Margem: <strong>${margem.toFixed(1)}%</strong>`);}
  function calcRefine(){const level=Number(document.getElementById('refineLevel').value||0); const city=document.getElementById('refineCity').value; const focus=document.getElementById('refineFocus').value==='sim'; const cost=Number(document.getElementById('refineCost').value||0); const sell=Number(document.getElementById('refineSell').value||0); const efficiency=focus?0.86:1; const xpBonus=level>=75?0.95:1; const fee=Math.round(sell*0.065); const lucro=sell-cost*efficiency*xpBonus-fee; setHtml('refineResult',`<strong>Resultado do refino em ${city}</strong><br>Lucro estimado: <strong>${formatSilver(lucro)} prata</strong> ${focus?'com foco':'sem foco'}`);}
  function calcIsland(){const level=Number(document.getElementById('islandLevel').value||0); const islands=Number(document.getElementById('islandCount').value||1); const plots=Number(document.getElementById('islandPlots').value||0)*islands; const pastures=Number(document.getElementById('islandPastures').value||0)*islands; const focus=document.getElementById('islandFocus').value==='sim'; const feedMode=document.getElementById('islandFeedMode').value; const cropOptions=ISLAND_CROPS.map(c=>({...c,totalProfit:Math.round(c.profit*plots*(1+level*0.03)*(focus?1.12:1))})); const animalOptions=ISLAND_ANIMALS.map(a=>{const feedDiscount=feedMode==='produzir'?0.8:1; return {...a,totalProfit:Math.round((a.profit-a.feed*feedDiscount)*pastures*(1+level*0.025)*(focus?1.08:1))};}); const bestCrop=cropOptions.sort((a,b)=>b.totalProfit-a.totalProfit)[0]; const bestAnimal=animalOptions.sort((a,b)=>b.totalProfit-a.totalProfit)[0]; const total=(bestCrop?.totalProfit||0)+(bestAnimal?.totalProfit||0); setHtml('islandResult',`<strong>Melhor plano para suas ilhas</strong><br><br>Ilhas consideradas: <strong>${islands}</strong><br>Plantações totais: <strong>${plots}</strong><br>Pastos totais: <strong>${pastures}</strong><br><br>Melhor plantação: <strong>${bestCrop.name} ${bestCrop.tier}</strong> — lucro por ciclo: <strong>${formatSilver(bestCrop.totalProfit)}</strong><br>Melhor criação: <strong>${bestAnimal.name} ${bestAnimal.tier}</strong> — lucro por ciclo: <strong>${formatSilver(bestAnimal.totalProfit)}</strong><br>Alimentação: <strong>${feedMode==='produzir'?'produzir a comida':'comprar a comida'}</strong><br>Lucro total estimado: <strong>${formatSilver(total)} prata</strong><br><br>• ${bestCrop.note}.<br>• ${bestAnimal.note}.`);}
  function calcTransport(){const buyCity=document.getElementById('transportBuyCity').value; const sellCity=document.getElementById('transportSellCity').value; const buy=Number(document.getElementById('transportBuyPrice').value||0); const sell=Number(document.getElementById('transportSellPrice').value||0); const cost=Number(document.getElementById('transportCost').value||0); const tax=Math.round(sell*0.065); const lucro=sell-buy-cost-tax; setHtml('transportResult',`<strong>Resultado do transporte</strong><br>Rota: <strong>${buyCity} → ${sellCity}</strong><br>Lucro líquido estimado: <strong>${formatSilver(lucro)} prata</strong>`);}
  function calcWealth(){const current=Number(document.getElementById('wealthCurrent').value||0); const goal=Number(document.getElementById('wealthGoal').value||0); const days=Math.max(1,Number(document.getElementById('wealthDays').value||1)); const faltante=Math.max(0,goal-current); const porDia=faltante/days; setHtml('wealthResult',`<strong>Plano para sair de ${formatSilver(current)} e buscar ${formatSilver(goal)}</strong><br><br>Precisa gerar em média: <strong>${formatSilver(porDia)} prata por dia</strong><br>Dia 1: faça um giro curto em mercado e transporte para levantar caixa sem exagerar no risco.<br>Dia 2: repita o item com melhor saída e reinvista uma parte fixa.<br>Dia 3 em diante: mantenha uma linha estável e uma linha agressiva de lucro.<br>Fechamento diário: anote com quanto terminou o dia para ajustar o próximo passo.`);}
  window.AlbionTrader={calcCraft,calcRefine,calcIsland,calcTransport,calcWealth};
  document.addEventListener('DOMContentLoaded',()=>{const loginForm=document.getElementById('loginForm'); if(loginForm) loginForm.addEventListener('submit',handleLogin); if(document.body.dataset.page==='dashboard') initDashboard(); if(document.body.dataset.page==='admin') initAdmin();});
})();
