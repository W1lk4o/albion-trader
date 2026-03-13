
const AppState = {
  user: null,
  catalog: [],
  selectedActivities: new Set(['mercado']),
  aiContext: {},
  cityList: ["Bridgewatch","Caerleon","Fort Sterling","Lymhurst","Martlock","Thetford","Brecilien"]
};

const LS_KEYS = {
  session: 'albionTraderSession',
  settings: 'albionTraderSettings',
  users: 'albionTraderUsers',
  aiMemory: 'albionTraderAiMemory'
};

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }
function fmt(n){ return new Intl.NumberFormat('pt-BR').format(Math.round(Number(n || 0))); }
function money(n){ return `Prata ${fmt(n)}`; }
function nowTime(){ return new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}); }

function getStoredUsers(){
  const raw = localStorage.getItem(LS_KEYS.users);
  if(raw){
    try { return JSON.parse(raw); } catch {}
  }
  const seeded = (window.ALBI_TRADER_USERS || []).map(u => ({
    ...u,
    licenseExpiresAt: Date.now() + ((u.licenseDays || 30) * 86400000),
    whatsapp: u.email.includes('wilker') ? '(31) 99999-0000' : '(31) 98888-0000'
  }));
  localStorage.setItem(LS_KEYS.users, JSON.stringify(seeded));
  return seeded;
}
function saveUsers(users){ localStorage.setItem(LS_KEYS.users, JSON.stringify(users)); }
function getSettings(){
  const defaults = { server: 'west', risk: 'balanced' };
  try { return { ...defaults, ...(JSON.parse(localStorage.getItem(LS_KEYS.settings)) || {}) }; } catch { return defaults; }
}
function saveSettings(next){ localStorage.setItem(LS_KEYS.settings, JSON.stringify(next)); }

function setSession(user){
  localStorage.setItem(LS_KEYS.session, JSON.stringify({
    email: user.email, admin: user.admin, name: user.name || user.email.split('@')[0]
  }));
}
function getSession(){
  try { return JSON.parse(localStorage.getItem(LS_KEYS.session)); } catch { return null; }
}
function clearSession(){ localStorage.removeItem(LS_KEYS.session); }

async function apiPost(url, body){
  const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  return res.json();
}
async function apiGet(url){
  const res = await fetch(url);
  return res.json();
}

async function handleLogin(e){
  e.preventDefault();
  const email = qs('#email').value.trim();
  const senha = qs('#senha').value;
  const status = qs('#loginStatus');
  status.textContent = 'Validando login...';
  try {
    const data = await apiPost('/api/login', { email, senha });
    if(!data.ok) throw new Error(data.error || 'Falha no login');
    setSession(data.user);
    window.location.href = data.user.admin ? 'admin.html' : 'dashboard.html';
  } catch(err){
    status.textContent = err.message || 'Não foi possível entrar.';
  }
}

function bindLogout(){
  const btn = qs('#logoutBtn');
  if(btn){
    btn.addEventListener('click', () => {
      clearSession();
      window.location.href = 'index.html';
    });
  }
}

function protectPage(adminOnly=false){
  const session = getSession();
  if(!session){ window.location.href = 'index.html'; return null; }
  if(adminOnly && !session.admin){ window.location.href = 'dashboard.html'; return null; }
  AppState.user = session;
  return session;
}

function fillCitySelects(){
  qsa('select').forEach(sel => {
    if(sel.id.toLowerCase().includes('city') || ['marketFrom','marketTo'].includes(sel.id)){
      if(sel.options.length === 0){
        AppState.cityList.forEach(city => {
          const o = document.createElement('option');
          o.value = city; o.textContent = city;
          sel.appendChild(o);
        });
      }
    }
  });
  const marketFrom = qs('#marketFrom');
  const marketTo = qs('#marketTo');
  if(marketFrom) marketFrom.value = 'Bridgewatch';
  if(marketTo) marketTo.value = 'Caerleon';
}

async function loadCatalog(){
  const res = await fetch('/data/item-catalog.json');
  AppState.catalog = await res.json();
}

function initQuickRadar(){
  const catSel = qs('#quickCategory');
  if(!catSel) return;
  const subSel = qs('#quickSubcategory');
  const itemSel = qs('#quickItem');
  const tierSel = qs('#quickTier');
  const enchantSel = qs('#quickEnchant');
  const citySel = qs('#quickCity');

  AppState.cityList.forEach(city => {
    const o = document.createElement('option');
    o.value = city; o.textContent = city;
    citySel.appendChild(o);
  });

  const categories = [...new Set(AppState.catalog.map(i => i.category))];
  catSel.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');

  const updateSubs = () => {
    const subs = [...new Set(AppState.catalog.filter(i => i.category === catSel.value).map(i => i.subcategory))];
    subSel.innerHTML = subs.map(s => `<option value="${s}">${s}</option>`).join('');
    updateItems();
  };
  const updateItems = () => {
    const items = AppState.catalog.filter(i => i.category === catSel.value && i.subcategory === subSel.value);
    itemSel.innerHTML = items.map((i,idx) => `<option value="${idx}">${i.labelPt}</option>`).join('');
    const item = items[0];
    if(item){
      tierSel.innerHTML = item.tiers.map(t => `<option value="${t}">T${t}</option>`).join('');
      enchantSel.innerHTML = item.enchants.map(e => `<option value="${e}">.${e}</option>`).join('');
    }
    itemSel.dataset.items = JSON.stringify(items);
  };
  const updateTiersForItem = () => {
    const items = JSON.parse(itemSel.dataset.items || '[]');
    const item = items[itemSel.value] || items[0];
    if(!item) return;
    tierSel.innerHTML = item.tiers.map(t => `<option value="${t}">T${t}</option>`).join('');
    enchantSel.innerHTML = item.enchants.map(e => `<option value="${e}">.${e}</option>`).join('');
  };

  catSel.addEventListener('change', updateSubs);
  subSel.addEventListener('change', updateItems);
  itemSel.addEventListener('change', updateTiersForItem);
  updateSubs();

  qs('#quickSearchBtn').addEventListener('click', async () => {
    const items = JSON.parse(itemSel.dataset.items || '[]');
    const item = items[itemSel.value] || items[0];
    if(!item) return;
    const tier = tierSel.value;
    const ench = enchantSel.value;
    const city = citySel.value;
    const itemId = `T${tier}_${item.itemIdBase}${Number(ench) ? '@' + ench : ''}`;
    const data = await apiGet(`/api/albion-prices?itemId=${encodeURIComponent(itemId)}&locations=${encodeURIComponent(city)}&server=${getSettings().server}`);
    renderQuickResults(item, itemId, city, data);
    rememberAiContext({ module:'quick', lastItemId:itemId, city });
  });
}

function renderQuickResults(item, itemId, city, data){
  const wrap = qs('#quickResults');
  const rows = data?.prices || [];
  if(!rows.length){
    wrap.innerHTML = `<div class="result-stack"><div class="result-card"><h4>${item.labelPt}</h4><p>Nenhum preço recente encontrado para ${itemId} em ${city}.</p></div></div>`;
    return;
  }
  const best = rows[0];
  wrap.innerHTML = `
    <div class="result-stack">
      <div class="result-card">
        <h4>${item.labelPt}</h4>
        <div class="kv"><strong>Item ID</strong><span>${itemId}</span></div>
        <div class="kv"><strong>Cidade</strong><span>${best.city || city}</span></div>
        <div class="kv"><strong>Compra</strong><span class="pos">${money(best.sell_price_min || 0)}</span></div>
        <div class="kv"><strong>Venda</strong><span>${money(best.buy_price_max || 0)}</span></div>
        <div class="kv"><strong>Atualizado</strong><span>${best.quality || 'Normal'} • ${best.sell_price_min_date || '-'}</span></div>
      </div>
    </div>`;
}

async function initHome(){
  const settings = getSettings();
  qs('#serverSelect').value = settings.server;
  const refresh = async () => {
    qs('#metricUpdatedAt').textContent = 'Atualizando...';
    const cap = Number(qs('#capitalPreset').value || 0);
    const data = await apiGet(`/api/arbitrage?server=${settings.server}&from=Bridgewatch&to=Caerleon&capital=${cap}&limit=8`);
    renderHome(data);
  };
  qs('#refreshHomeBtn').addEventListener('click', refresh);
  qs('#serverSelect').addEventListener('change', (e)=>{
    const next = {...settings, server:e.target.value};
    saveSettings(next);
    qs('#settingsServer') && (qs('#settingsServer').value = e.target.value);
    refresh();
  });
  refresh();
}

function renderHome(data){
  const opps = data?.results || [];
  qs('#metricUpdatedAt').textContent = nowTime();
  qs('#metricTopProfit').textContent = opps[0] ? money(opps[0].estimatedProfit) : '-';
  qs('#metricTopRoute').textContent = opps[0] ? `${opps[0].from} → ${opps[0].to}` : '-';
  qs('#metricTopCategory').textContent = opps[0] ? opps[0].category : '-';

  const home = qs('#homeOpportunities');
  if(!opps.length){ home.innerHTML = '<p class="muted">Ainda sem resultados. Tente atualizar agora.</p>'; }
  else{
    home.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Item</th><th>Compra</th><th>Venda</th><th>Lucro</th><th>Margem</th></tr></thead>
      <tbody>${opps.map(o => `
        <tr>
          <td>${o.label}</td>
          <td>${o.from} • ${money(o.buyPrice)}</td>
          <td>${o.to} • ${money(o.sellPrice)}</td>
          <td class="pos">${money(o.estimatedProfit)}</td>
          <td>${o.marginPct.toFixed(1)}%</td>
        </tr>`).join('')}
      </tbody></table></div>`;
  }
  const war = qs('#homeWar');
  const preview = [
    { build:'ZvZ', items:'Capuz de Clérigo, Manto de Clérigo, Botas de Soldado, Hallowfall' },
    { build:'Mists', items:'Capuz de Assassino, Jaqueta de Mercenário, Bloodletter, Capa de Thetford' },
    { build:'Corrompida', items:'Capuz de Mago, Jaqueta de Assassino, 1h Spear, Poções de Veneno' }
  ];
  war.innerHTML = `<ul class="list-clean">${preview.map(p=>`<li><strong>${p.build}</strong><br><span class="muted">${p.items}</span></li>`).join('')}</ul>`;
}

async function initMarket(){
  const btn = qs('#scanMarketBtn');
  if(!btn) return;
  btn.addEventListener('click', async () => {
    const from = qs('#marketFrom').value;
    const to = qs('#marketTo').value;
    const capital = Number(qs('#marketCapital').value || 0);
    const limit = Number(qs('#marketLimit').value || 20);
    const status = qs('#marketScanStatus');
    status.textContent = 'Escaneando centenas de itens...';
    const data = await apiGet(`/api/arbitrage?server=${getSettings().server}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&capital=${capital}&limit=${limit}`);
    renderMarketResults(data);
    status.textContent = `${data.results?.length || 0} oportunidades carregadas.`;
    rememberAiContext({ module:'market', from, to, capital });
  });
}

function renderMarketResults(data){
  const wrap = qs('#marketResults');
  const rows = data.results || [];
  if(!rows.length){ wrap.innerHTML = '<p class="muted">Nenhuma oportunidade encontrada com os filtros atuais.</p>'; return; }
  wrap.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>Item</th><th>Comprar</th><th>Vender</th><th>Lucro</th><th>Margem</th><th>Montaria</th><th>Rota sugerida</th></tr></thead>
    <tbody>${rows.map(o => `
      <tr>
        <td>${o.label}</td>
        <td>${o.from} • ${money(o.buyPrice)}</td>
        <td>${o.to} • ${money(o.sellPrice)}</td>
        <td class="pos">${money(o.estimatedProfit)}</td>
        <td>${o.marginPct.toFixed(1)}%</td>
        <td>${o.mountSuggestion}</td>
        <td>${o.routeSuggestion}</td>
      </tr>`).join('')}</tbody></table></div>`;
}

async function initLoot(){
  const btn = qs('#analyzeLootBtn');
  if(!btn) return;
  btn.addEventListener('click', async () => {
    const lines = qs('#lootInput').value.split('\n').map(s => s.trim()).filter(Boolean);
    const city = qs('#lootCity').value;
    const server = getSettings().server;
    const payload = { lines, city, server };
    const data = await apiPost('/api/loot-analysis', payload);
    const wrap = qs('#lootResults');
    if(!data.ok){ wrap.innerHTML = `<p class="muted">${data.error || 'Não foi possível analisar.'}</p>`; return; }
    wrap.innerHTML = `
      <div class="result-stack">
        <div class="result-card">
          <h4>Resumo do loot</h4>
          <div class="kv"><strong>Valor bruto em ${city}</strong><span>${money(data.summary.rawValue)}</span></div>
          <div class="kv"><strong>Melhor cidade de venda</strong><span>${data.summary.bestCity} • ${money(data.summary.bestCityValue)}</span></div>
          <div class="kv"><strong>Ganho extra estimado</strong><span class="pos">${money(data.summary.extraByTravel)}</span></div>
          <div class="kv"><strong>Refinar antes?</strong><span>${data.summary.refineSuggestion}</span></div>
        </div>
        ${data.items.map(i => `<div class="result-card"><h4>${i.itemId}</h4>
          <div class="kv"><strong>Quantidade</strong><span>${fmt(i.qty)}</span></div>
          <div class="kv"><strong>Melhor ação</strong><span>${i.bestAction}</span></div>
          <div class="kv"><strong>Melhor cidade</strong><span>${i.bestCity}</span></div>
          <div class="kv"><strong>Valor estimado</strong><span>${money(i.bestValue)}</span></div>
        </div>`).join('')}
      </div>`;
    rememberAiContext({ module:'loot', city, lootLines: lines.slice(0, 10) });
  });
}

function initPlanner(){
  const btn = qs('#runPlannerBtn');
  if(!btn) return;
  qsa('.chip').forEach(ch => {
    ch.addEventListener('click', () => {
      ch.classList.toggle('active');
      const key = ch.dataset.activity;
      if(ch.classList.contains('active')) AppState.selectedActivities.add(key);
      else AppState.selectedActivities.delete(key);
    });
  });
  btn.addEventListener('click', () => {
    const current = Number(qs('#plannerCurrent').value || 0);
    const goal = Number(qs('#plannerGoal').value || 0);
    const hours = Number(qs('#plannerHours').value || 1);
    const city = qs('#plannerCity').value;
    const acts = [...AppState.selectedActivities];
    const res = buildWealthPlan(current, goal, hours, city, acts);
    qs('#plannerResults').innerHTML = res;
    rememberAiContext({ module:'planner', current, goal, hours, city, acts });
  });
}
function buildWealthPlan(current, goal, hours, city, acts){
  const delta = Math.max(goal - current, 0);
  const perDay = delta / 30;
  const all = [
    { key:'mercado', name:'Mercado', reason:'alto giro, risco controlável, muito bom para capital médio e alto' },
    { key:'transporte', name:'Transporte', reason:'spread entre cidades pode abrir lucro forte se a rota for bem escolhida' },
    { key:'pele', name:'Coletar pele', reason:'boa liquidez e boa sinergia com refino/couro' },
    { key:'minerio', name:'Garimpar minério', reason:'muito forte para escalar em refino e metalbar' },
    { key:'fibra', name:'Coletar fibra', reason:'boa rotação para tecido, armaduras e consumíveis' },
    { key:'madeira', name:'Coletar madeira', reason:'mercado estável para tábuas e armas' },
    { key:'pedra', name:'Coletar pedra', reason:'mais nichado, mas pode render em blocos específicos' },
    { key:'dg', name:'DG', reason:'fama + loot, boa para quem quer evolução junto do silver' },
    { key:'mists', name:'Mists', reason:'mobilidade, PvP e loot com potencial alto' },
    { key:'craft', name:'Craft', reason:'escala muito bem com foco e mercado' },
    { key:'refino', name:'Refino', reason:'simples de operar e bom para lucro recorrente' }
  ];
  const chosen = all.filter(a => acts.includes(a.key));
  const best = chosen[0] || all[0];
  let route = [
    `Fase 1 — ${money(current)} → ${money(Math.min(goal, current * 5 || 5000000))}: concentre em ${best.name.toLowerCase()} em ${city}. Meta: ${money(Math.max(150000, perDay * 0.25))}/dia.`,
    `Fase 2 — escalar caixa: reinvista 50% do lucro em operações maiores. Priorize itens com giro mais rápido e margem acima de 12%.`,
    `Fase 3 — capital intermediário: combine ${acts.includes('mercado') ? 'mercado' : best.name.toLowerCase()} + ${acts.includes('transporte') ? 'transporte' : 'outra atividade de giro'} para aumentar ticket médio.`,
    `Fase 4 — rumo à meta: monte rotina fixa de ${hours}h/dia com registro de prata/hora e descarte tudo que renda menos que sua média atual.`
  ];
  const alternatives = chosen.slice(1,4).map(a => `<li>Se você não quiser seguir a rota principal, a melhor alternativa é <strong>${a.name}</strong>, porque ${a.reason}.</li>`).join('');
  return `
    <div class="result-stack">
      <div class="result-card">
        <h4>Melhor rota sugerida agora</h4>
        <p>A melhor forma hoje é <strong>${best.name}</strong>. Se você não quiser fazer isso, me diga no chat da IA o que prefere e eu traço outra rota.</p>
        <div class="kv"><strong>Meta mensal necessária</strong><span>${money(delta)}</span></div>
        <div class="kv"><strong>Meta por dia</strong><span>${money(perDay)}</span></div>
        <div class="kv"><strong>Cidade base</strong><span>${city}</span></div>
      </div>
      <div class="result-card">
        <h4>Passo a passo</h4>
        <div class="route-steps">${route.map(r => `<div class="route-step">${r}</div>`).join('')}</div>
      </div>
      <div class="result-card">
        <h4>Alternativas baseadas no que você gosta</h4>
        <ul>${alternatives || '<li>Você selecionou poucas atividades. Marque mais opções se quiser mais alternativas.</li>'}</ul>
      </div>
    </div>`;
}

function initRoutes(){
  const btn = qs('#planRouteBtn');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const from = qs('#routeFrom').value.trim();
    const to = qs('#routeTo').value.trim();
    const mode = qs('#routeMode').value;
    const weight = Number(qs('#routeWeight').value || 0);
    const mount = suggestMount(weight, mode);
    const route = buildRouteAdvice(from, to, mode);
    qs('#routeResults').innerHTML = `
      <div class="result-stack">
        <div class="result-card">
          <h4>Resumo da rota</h4>
          <div class="kv"><strong>Tipo</strong><span>${labelRouteMode(mode)}</span></div>
          <div class="kv"><strong>Montaria sugerida</strong><span>${mount}</span></div>
          <div class="kv"><strong>Observação</strong><span>${route.summary}</span></div>
        </div>
        <div class="result-card">
          <h4>Passo a passo</h4>
          <div class="route-steps">${route.steps.map(s => `<div class="route-step">${s}</div>`).join('')}</div>
        </div>
      </div>`;
    rememberAiContext({ module:'routes', from, to, mode, weight, mount });
  });
}
function labelRouteMode(mode){
  return { safe:'Mais safe', fast:'Mais rápida', black:'Só black', yellow:'Só amarela', avalon:'Usando Avalon/Roads' }[mode] || mode;
}
function suggestMount(weight, mode){
  if(mode === 'safe') return weight > 1200 ? 'Mamute ou Boi blindado' : 'Javali ou Urso';
  if(mode === 'fast') return weight > 800 ? 'Javali' : 'Swiftclaw';
  if(mode === 'avalon') return weight > 1000 ? 'Javali ou Alce' : 'Swiftclaw';
  return weight > 1500 ? 'Mamute' : 'Javali';
}
function buildRouteAdvice(from, to, mode){
  const base = [
    `Saia de ${from} com o inventário já separado por valor e peso.`,
    `Evite horários de pico e mapas com choke points evidentes.`,
    `Faça uma parada intermediária curta para checar scout e portal.`,
    `Entre no trecho final para ${to} só quando o caminho estiver limpo.`
  ];
  if(mode === 'avalon'){
    return {
      summary:'Use Roads como atalho e só atravesse conexão de alto risco se o ganho compensar.',
      steps:[
        `Parta de ${from} até a primeira entrada de Roads/Avalon disponível.`,
        'Prefira conexões de 2 saídas e ignore rotas com muita movimentação recente.',
        'Procure caminho encadeando 2 ou 3 roads curtas em vez de forçar um corredor longo.',
        `Saia o mais perto possível de ${to} e finalize pela rota mais limpa.`
      ]
    };
  }
  if(mode === 'yellow'){
    return { summary:'Mais segura, mas geralmente mais longa.', steps: base.map(s => s.replace('Evite','Prefira')) };
  }
  if(mode === 'black'){
    return { summary:'Mais arriscada e normalmente mais curta.', steps: [...base, 'Leve apenas carga que justifique o risco.'] };
  }
  if(mode === 'fast'){
    return { summary:'Prioriza tempo e giros curtos.', steps: [...base.slice(0,2), 'Corte desvios longos e use montaria veloz.', `Finalize o trajeto em ${to} sem paradas extras.`] };
  }
  return { summary:'Prioriza consistência e sobrevivência.', steps: base };
}

function initAvalon(){
  const btn = qs('#scanAvalonBtn');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const map = qs('#avalonMap').value.trim() || 'Mapa atual';
    const goal = qs('#avalonGoal').value;
    const blocks = {
      farmt8: {
        title:'Estratégia para buscar Avalon T8',
        text:'Entre em uma Road próxima, priorize conexões com menos tráfego, avance por 2 ou 3 mapas e descarte caminhos sem recurso relevante. Mantenha rota de saída definida antes de avançar.',
        steps:['Entrar na primeira Road com baixo tráfego.','Checar recursos, baús e densidade de jogadores.','Se estiver fraca, avançar para a próxima conexão curta.','Parar quando encontrar densidade e recursos de alto tier.']
      },
      safeexit: {
        title:'Estratégia de saída segura',
        text:'O foco é minimizar exposição. Caminho mais curto até uma saída para Royal ou mapa com tráfego menor.',
        steps:['Evitar portais muito disputados.','Não lutar por baú no caminho.','Sair para região amarela se possível.']
      },
      royal: {
        title:'Volta para Royal',
        text:'Encadear roads curtas até uma saída próxima de cidade real e depois finalizar por rota segura.',
        steps:['Buscar 2 ou 3 conexões com saída previsível.','Priorizar clareza de rota sobre ganho extra.','Chegar em cidade real para descarregar loot.']
      }
    }[goal];
    qs('#avalonResults').innerHTML = `
      <div class="result-stack">
        <div class="result-card">
          <h4>${blocks.title}</h4>
          <p>Origem: <strong>${map}</strong></p>
          <p>${blocks.text}</p>
        </div>
        <div class="result-card">
          <h4>Passos sugeridos</h4>
          <div class="route-steps">${blocks.steps.map(s=>`<div class="route-step">${s}</div>`).join('')}</div>
        </div>
      </div>`;
    rememberAiContext({ module:'avalon', map, goal });
  });
}

function initCraftRefine(){
  const craftBtn = qs('#craftSuggestBtn');
  if(craftBtn){
    craftBtn.addEventListener('click', () => {
      const city = qs('#craftCity').value;
      const level = qs('#craftLevel').value;
      const category = qs('#craftCategory').value;
      const focus = qs('#craftFocus').value;
      qs('#craftResults').innerHTML = `
        <div class="result-stack">
          <div class="result-card">
            <h4>Craft mais simples para começar</h4>
            <p>Para <strong>${category}</strong> em <strong>${city}</strong>, comece por itens de giro rápido no ${level}. Com foco: <strong>${focus}</strong>.</p>
            <ul>
              <li>Bolsas e capas para giro simples.</li>
              <li>Itens sem encantamento para reduzir risco de travar capital.</li>
              <li>Venda onde o giro está mais forte antes de escalar para itens caros.</li>
            </ul>
          </div>
        </div>`;
      rememberAiContext({ module:'craft', city, level, category, focus });
    });
  }
  const refineBtn = qs('#refineSuggestBtn');
  if(refineBtn){
    refineBtn.addEventListener('click', () => {
      const city = qs('#refineCity').value;
      const resource = qs('#refineResource').value;
      const level = qs('#refineLevel').value;
      const focus = qs('#refineFocus').value;
      qs('#refineResults').innerHTML = `
        <div class="result-stack">
          <div class="result-card">
            <h4>Refino mais simples para executar</h4>
            <p>Para <strong>${resource}</strong> em <strong>${city}</strong>, comece no <strong>${level}</strong> e valide a margem sem comprometer caixa grande. Foco: <strong>${focus}</strong>.</p>
            <ul>
              <li>Compare preço bruto x refinado antes de comprar lote grande.</li>
              <li>Teste 1 ou 2 lotes e só depois escale.</li>
              <li>Se a margem cair, volte para arbitragem entre cidades.</li>
            </ul>
          </div>
        </div>`;
      rememberAiContext({ module:'refine', city, resource, level, focus });
    });
  }
}

function initFame(){
  const btn = qs('#calcFameBtn');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const fameStart = Number(qs('#fameStart').value || 0);
    const fameEnd = Number(qs('#fameEnd').value || 0);
    const loot = Number(qs('#lootSilver').value || 0);
    const t1 = qs('#timeStart').value;
    const t2 = qs('#timeEnd').value;
    const h = diffHours(t1, t2);
    const famePerHour = h > 0 ? (fameEnd - fameStart)/h : 0;
    const silverPerHour = h > 0 ? loot/h : loot;
    qs('#fameResults').innerHTML = `
      <div class="result-stack">
        <div class="result-card">
          <h4>Resultado</h4>
          <div class="kv"><strong>Tempo total</strong><span>${h.toFixed(2)}h</span></div>
          <div class="kv"><strong>Fama por hora</strong><span>${fmt(famePerHour)}</span></div>
          <div class="kv"><strong>Prata por hora</strong><span>${money(silverPerHour)}</span></div>
          <div class="kv"><strong>Eficiência</strong><span>${silverPerHour > 700000 ? 'Boa' : 'Precisa melhorar'}</span></div>
        </div>
      </div>`;
      rememberAiContext({ module:'fame', fameStart, fameEnd, loot, hours:h });
    });
}
function diffHours(a,b){
  const [ah,am] = a.split(':').map(Number), [bh,bm] = b.split(':').map(Number);
  let mins = (bh*60+bm) - (ah*60+am);
  if(mins <= 0) mins += 24*60;
  return mins/60;
}

async function initWar(){
  const btn = qs('#loadWarBtn');
  if(!btn) return;
  btn.addEventListener('click', async () => {
    const mode = qs('#warMode').value;
    const city = qs('#warCity').value;
    const data = await apiGet(`/api/war-market?mode=${mode}&city=${encodeURIComponent(city)}&server=${getSettings().server}`);
    const wrap = qs('#warResults');
    wrap.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Modo</th><th>Item</th><th>Preço foco</th><th>Justificativa</th></tr></thead>
      <tbody>${(data.items || []).map(i => `<tr><td>${data.modeLabel}</td><td>${i.label}</td><td>${money(i.price)}</td><td>${i.reason}</td></tr>`).join('')}</tbody>
    </table></div>`;
    rememberAiContext({ module:'war', mode, city });
  });
}

function initSettingsPanel(){
  const settings = getSettings();
  const server = qs('#settingsServer');
  if(server) server.value = settings.server;
  const risk = qs('#riskProfile');
  if(risk) risk.value = settings.risk;
  const saveBtn = qs('#saveSettingsBtn');
  if(saveBtn){
    saveBtn.addEventListener('click', () => {
      saveSettings({ server: server.value, risk: risk.value });
      qs('#serverSelect') && (qs('#serverSelect').value = server.value);
      alert('Configurações salvas.');
    });
  }
}

function switchPanel(next){
  qsa('.panel-section').forEach(s => s.classList.toggle('hidden', s.dataset.panel !== next));
  qsa('.nav-btn[data-section]').forEach(btn => btn.classList.toggle('active', btn.dataset.section === next));
  rememberAiContext({ currentSection: next });
}
function bindNavigation(){
  qsa('.nav-btn[data-section]').forEach(btn => btn.addEventListener('click', ()=> switchPanel(btn.dataset.section)));
  qsa('[data-jump]').forEach(btn => btn.addEventListener('click', ()=> switchPanel(btn.dataset.jump)));
}

function initAi(){
  const drawer = qs('#aiDrawer');
  const btn = qs('#toggleAiBtn');
  const close = qs('#closeAiBtn');
  if(!drawer || !btn || !close) return;
  const messages = qs('#aiMessages');
  const addMsg = (role, text) => {
    const div = document.createElement('div');
    div.className = `ai-msg ${role}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };
  btn.addEventListener('click', () => drawer.classList.add('open'));
  close.addEventListener('click', () => drawer.classList.remove('open'));
  qs('#sendAiBtn').addEventListener('click', async () => {
    const input = qs('#aiInput');
    const message = input.value.trim();
    if(!message) return;
    addMsg('user', message);
    input.value = '';
    const memory = JSON.parse(localStorage.getItem(LS_KEYS.aiMemory) || '[]');
    memory.push({ role:'user', content: message, at: Date.now() });
    localStorage.setItem(LS_KEYS.aiMemory, JSON.stringify(memory.slice(-20)));
    try{
      const payload = {
        message,
        memory: memory.slice(-8),
        context: {
          ...AppState.aiContext,
          settings: getSettings(),
          user: AppState.user
        }
      };
      const data = await apiPost('/api/ai-chat', payload);
      addMsg('assistant', data.reply || 'Sem resposta da IA.');
    }catch{
      addMsg('assistant', 'Não consegui responder agora. Tente novamente em alguns segundos.');
    }
  });
  addMsg('assistant', 'Estou pronto. Pergunte sobre mercado, loot, rotas, craft, refino ou estratégia de prata.');
}
function rememberAiContext(next){ AppState.aiContext = { ...AppState.aiContext, ...next }; }

function initAdmin(){
  const session = protectPage(true);
  if(!session) return;
  bindLogout();
  qs('#adminWelcome').textContent = `Olá, ${session.name}.`;
  qsa('.nav-btn[data-admin-section]').forEach(btn => btn.addEventListener('click', () => {
    qsa('.nav-btn[data-admin-section]').forEach(b => b.classList.toggle('active', b === btn));
    qsa('.admin-section').forEach(s => s.classList.toggle('hidden', s.dataset.adminPanel !== btn.dataset.adminSection));
  }));
  renderAdminTables();
  qs('#seedUsersBtn')?.addEventListener('click', () => {
    const users = getStoredUsers();
    users.push({
      email: `novo${Math.floor(Math.random()*1000)}@albiontrader.com`,
      senha: 'Albion123', admin:false, name:'Novo usuário', whatsapp:'(31) 97777-0000',
      licenseExpiresAt: Date.now() + (30 * 86400000)
    });
    saveUsers(users);
    renderAdminTables();
  });
  const defaultServer = qs('#defaultServerSelect');
  if(defaultServer){
    defaultServer.value = getSettings().server;
    defaultServer.addEventListener('change', ()=> {
      saveSettings({ ...getSettings(), server: defaultServer.value });
      renderAdminTables();
    });
  }
}
function renderAdminTables(){
  const users = getStoredUsers();
  qs('#statUsers').textContent = users.length;
  qs('#statLicenses').textContent = users.filter(u => (u.licenseExpiresAt || 0) > Date.now()).length;
  qs('#statServer').textContent = {west:'Americas', europe:'Europe', east:'Asia'}[getSettings().server] || 'Americas';
  qs('#usersTableWrap').innerHTML = `<div class="table-wrap"><table><thead><tr><th>Email</th><th>Nome</th><th>Tipo</th><th>WhatsApp</th></tr></thead><tbody>
    ${users.map(u=>`<tr><td>${u.email}</td><td>${u.name || '-'}</td><td>${u.admin?'Admin':'Usuário'}</td><td>${u.whatsapp || '-'}</td></tr>`).join('')}
  </tbody></table></div>`;
  qs('#licensesTableWrap').innerHTML = `<div class="table-wrap"><table><thead><tr><th>Email</th><th>Status</th><th>Expira em</th></tr></thead><tbody>
    ${users.map(u=>`<tr><td>${u.email}</td><td>${(u.licenseExpiresAt || 0) > Date.now() ? 'Ativa' : 'Expirada'}</td><td>${new Date(u.licenseExpiresAt || Date.now()).toLocaleDateString('pt-BR')}</td></tr>`).join('')}
  </tbody></table></div>`;
}

async function initDashboard(){
  const session = protectPage(false);
  if(!session) return;
  qs('#sidebarUser').textContent = session.name;
  qs('#welcomeTitle').textContent = `Bem-vindo, ${session.name}`;
  bindLogout();
  await loadCatalog();
  bindNavigation();
  fillCitySelects();
  initQuickRadar();
  initHome();
  initMarket();
  initLoot();
  initPlanner();
  initRoutes();
  initAvalon();
  initCraftRefine();
  initFame();
  initWar();
  initSettingsPanel();
  initAi();
}

document.addEventListener('DOMContentLoaded', () => {
  if(qs('#loginForm')) handleLogin && qs('#loginForm').addEventListener('submit', handleLogin);
  if(document.body.classList.contains('app-body') && location.pathname.endsWith('dashboard.html')) initDashboard();
  if(location.pathname.endsWith('admin.html')) initAdmin();
});
