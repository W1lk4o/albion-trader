(function () {
  const appState = {
    server: localStorage.getItem('albion_server') || 'west',
    priceHistory: JSON.parse(localStorage.getItem('albion_market_history') || '{}')
  };

  const session = JSON.parse(localStorage.getItem('albion_session') || 'null');

  const domReady = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  const formatSilver = (v) => Number(v || 0).toLocaleString('pt-BR');
  const formatPct = (v) => `${(Number(v || 0)).toFixed(1)}%`;
  const esc = (s) => String(s || '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));

  const saveHistory = () => localStorage.setItem('albion_market_history', JSON.stringify(appState.priceHistory));

  function routeGuard() {
    const page = location.pathname.split('/').pop() || 'index.html';
    if (page === 'dashboard.html' || page === 'admin.html') {
      if (!session) location.href = 'index.html';
      if (page === 'admin.html' && session && !session.admin) location.href = 'dashboard.html';
    }
    if (page === 'index.html' && session) {
      location.href = session.admin ? 'admin.html' : 'dashboard.html';
    }
  }

  function loginInit() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const senha = document.getElementById('senha').value;
      const msg = document.getElementById('loginMessage');
      const found = users.find((u) => u.email.toLowerCase() === email && u.senha === senha);

      if (!found) {
        msg.textContent = 'Login inválido.';
        return;
      }

      localStorage.setItem('albion_session', JSON.stringify({
        email: found.email,
        nome: found.nome || found.email,
        admin: !!found.admin,
        licenca: found.licenca || 'N/D'
      }));

      location.href = found.admin ? 'admin.html' : 'dashboard.html';
    });
  }

  function logout() {
    localStorage.removeItem('albion_session');
    location.href = 'index.html';
  }

  function adminInit() {
    const box = document.getElementById('adminUsers');
    if (!box) return;
    box.innerHTML = `<div class="user-list">${users.map((u) => `
      <div class="user-row">
        <strong>${esc(u.nome || u.email)}</strong><br>
        <span class="muted">${esc(u.email)} • ${u.admin ? 'Admin' : 'Usuário'} • Licença: ${esc(u.licenca || 'N/D')}</span>
      </div>`).join('')}</div>`;
    const btn = document.getElementById('adminLogoutBtn');
    if (btn) btn.addEventListener('click', logout);
  }

  function dashboardInit() {
    if (!document.getElementById('sideNav')) return;

    // session labels
    document.getElementById('sessionUser').textContent = `${session?.nome || ''} • ${session?.licenca || ''}`;
    document.getElementById('welcomeTitle').textContent = `Bem-vindo, ${session?.nome || 'jogador'}`;
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // server
    const serverSelect = document.getElementById('serverSelect');
    const serverLabel = document.getElementById('serverLabel');
    serverSelect.value = appState.server;
    updateServerLabel();
    serverSelect.addEventListener('change', () => {
      appState.server = serverSelect.value;
      localStorage.setItem('albion_server', appState.server);
      updateServerLabel();
    });

    function updateServerLabel() {
      serverLabel.textContent = serverSelect.options[serverSelect.selectedIndex].text;
    }

    // nav
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => openSection(btn.dataset.section));
    });

    function openSection(name) {
      document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach((b) => b.classList.remove('active'));
      document.getElementById(`section-${name}`)?.classList.add('active');
      document.querySelector(`.nav-item[data-section="${name}"]`)?.classList.add('active');
    }

    // selects
    fillCities(['buyCity','sellCity','radarCity','craftCity','refineCity','warBuyCity','warSellCity','lootCity']);
    setupRadarSelectors();

    // actions
    document.getElementById('refreshDashboardBtn').addEventListener('click', refreshDashboard);
    document.getElementById('scanMarketBtn').addEventListener('click', scanMarket);
    document.getElementById('radarSearchBtn').addEventListener('click', analyzeRadar);
    document.getElementById('craftAnalyzeBtn').addEventListener('click', analyzeCraft);
    document.getElementById('refineAnalyzeBtn').addEventListener('click', analyzeRefine);
    document.getElementById('islandsAnalyzeBtn').addEventListener('click', analyzeIslands);
    document.getElementById('warScanBtn').addEventListener('click', scanWarMarket);
    document.getElementById('lootAnalyzeBtn').addEventListener('click', analyzeLoot);
    document.getElementById('routeAnalyzeBtn').addEventListener('click', analyzeRoute);
    document.getElementById('fameCalcBtn').addEventListener('click', calculateFame);
    document.getElementById('wealthPlanBtn').addEventListener('click', generateWealthPlan);
    document.getElementById('historyClearBtn').addEventListener('click', clearHistory);

    // defaults
    const buyCity = document.getElementById('buyCity');
    const sellCity = document.getElementById('sellCity');
    buyCity.value = 'Bridgewatch';
    sellCity.value = 'Caerleon';
    document.getElementById('warBuyCity').value = 'Bridgewatch';
    document.getElementById('warSellCity').value = 'Caerleon';
    document.getElementById('radarCity').value = 'Martlock';
    document.getElementById('craftCity').value = 'Caerleon';
    document.getElementById('refineCity').value = 'Martlock';
    document.getElementById('lootCity').value = 'Caerleon';

    refreshDashboard();
    renderHistoryTable();
  }

  function fillCities(ids) {
    ids.forEach((id) => {
      const select = document.getElementById(id);
      if (!select) return;
      select.innerHTML = window.ALBION_CITIES.map((c) => `<option value="${c}">${c}</option>`).join('');
    });
  }

  function setupRadarSelectors() {
    const category = document.getElementById('radarCategory');
    const subcategory = document.getElementById('radarSubcategory');
    const item = document.getElementById('radarItem');
    const tier = document.getElementById('radarTier');
    const enchant = document.getElementById('radarEnchant');
    if (!category) return;

    category.innerHTML = Object.keys(window.RADAR_STRUCTURE).map((k) => `<option value="${k}">${k}</option>`).join('');
    tier.innerHTML = [4,5,6,7,8].map((t) => `<option value="${t}">T${t}</option>`).join('');
    enchant.innerHTML = [0,1,2,3,4].map((e) => `<option value="${e}">.${e}</option>`).join('');

    const refreshSub = () => {
      const subs = Object.keys(window.RADAR_STRUCTURE[category.value] || {});
      subcategory.innerHTML = subs.map((s) => `<option value="${s}">${s}</option>`).join('');
      refreshItems();
    };

    const refreshItems = () => {
      const arr = (window.RADAR_STRUCTURE[category.value] || {})[subcategory.value] || [];
      item.innerHTML = arr.map((i, idx) => `<option value="${idx}">${i.name}</option>`).join('');
    };

    category.addEventListener('change', refreshSub);
    subcategory.addEventListener('change', refreshItems);
    refreshSub();
  }

  function getSelectedRadarBase() {
    const cat = document.getElementById('radarCategory').value;
    const sub = document.getElementById('radarSubcategory').value;
    const idx = Number(document.getElementById('radarItem').value || 0);
    return ((window.RADAR_STRUCTURE[cat] || {})[sub] || [])[idx];
  }

  function makeTieredId(baseId, tier = 6, enchant = 0) {
    const suffix = enchant > 0 ? `@${enchant}` : '';
    if (baseId.startsWith('T')) return `${baseId}${suffix}`;
    return `T${tier}_${baseId}${suffix}`;
  }

  async function fetchPrices(itemIds, locations) {
    const params = new URLSearchParams({
      itemIds: itemIds.join(','),
      locations: locations.join(','),
      server: appState.server,
      qualities: '1'
    });
    const response = await fetch(`/api/albion-prices?${params.toString()}`);
    if (!response.ok) throw new Error('Falha ao buscar preços');
    const data = await response.json();
    data.forEach(storeSnapshot);
    return data;
  }

  function storeSnapshot(row) {
    const key = `${appState.server}|${row.item_id}|${row.city}`;
    const now = Number(row.sell_price_min || row.buy_price_max || 0);
    if (!now) return;
    const prev = appState.priceHistory[key]?.last || null;
    appState.priceHistory[key] = {
      item_id: row.item_id,
      city: row.city,
      previous: prev,
      last: now,
      updated_at: new Date().toISOString()
    };
    saveHistory();
  }

  function priceFromRows(rows, itemId, city, field) {
    const row = rows.find((r) => r.item_id === itemId && r.city === city);
    return Number(row?.[field] || 0);
  }

  async function refreshDashboard() {
    const itemIds = [
      makeTieredId('ARMOR_LEATHER_SET3_JACKET', 6, 1),
      makeTieredId('BAG', 6, 0),
      makeTieredId('2H_DAGGERPAIR', 6, 1),
      makeTieredId('ARMOR_CLOTH_SET2_ROBE', 6, 1),
      makeTieredId('2H_SPEAR', 6, 1)
    ];
    const cities = ['Bridgewatch', 'Martlock', 'Caerleon'];
    try {
      const rows = await fetchPrices(itemIds, cities);
      const opps = buildArbitrage(rows, itemIds, cities, Number(document.getElementById('capitalInput')?.value || 1000000)).slice(0, 5);
      renderOpportunities('dashboardOpportunities', opps);
      const top = opps[0];
      document.getElementById('topOpportunity').textContent = top ? top.name : 'Sem dados';
      document.getElementById('topProfit').textContent = top ? `${formatSilver(top.profit)} prata` : '-';
      document.getElementById('warHotItem').textContent = 'Jaqueta de Assassino T6.1';
      document.getElementById('marketTrend').textContent = computeMarketTrend();
    } catch (err) {
      document.getElementById('dashboardOpportunities').innerHTML = `<tr><td colspan="5" class="bad">${esc(err.message)}</td></tr>`;
    }
    renderHistoryTable();
  }

  function computeMarketTrend() {
    const values = Object.values(appState.priceHistory);
    if (!values.length) return 'Sem histórico';
    let up = 0, down = 0;
    values.forEach((v) => {
      if (!v.previous) return;
      if (v.last > v.previous) up += 1;
      if (v.last < v.previous) down += 1;
    });
    if (up > down) return 'Subindo';
    if (down > up) return 'Caindo';
    return 'Lateralizado';
  }

  function buildArbitrage(rows, itemIds, cities, capital) {
    const nameMap = {};
    Object.values(window.ALBION_CATALOG).forEach((cat) => (cat.items || []).forEach((i) => { nameMap[i.id] = i.name; }));

    const results = [];
    itemIds.forEach((itemId) => {
      let bestBuy = null;
      let bestSell = null;
      cities.forEach((city) => {
        const buy = priceFromRows(rows, itemId, city, 'sell_price_min');
        const sell = priceFromRows(rows, itemId, city, 'buy_price_max');
        if (buy && (!bestBuy || buy < bestBuy.price)) bestBuy = { city, price: buy };
        if (sell && (!bestSell || sell > bestSell.price)) bestSell = { city, price: sell };
      });
      if (!bestBuy || !bestSell || bestBuy.city === bestSell.city) return;
      const profit = bestSell.price - bestBuy.price;
      const margin = bestBuy.price ? (profit / bestBuy.price) * 100 : 0;
      if (profit <= 0 || bestBuy.price > capital) return;
      const clean = itemId.replace(/^T\d_/, '').replace(/@\d+$/, '');
      results.push({
        itemId,
        name: nameMap[clean] || clean,
        buyCity: bestBuy.city,
        sellCity: bestSell.city,
        buyPrice: bestBuy.price,
        sellPrice: bestSell.price,
        profit,
        margin
      });
    });
    return results.sort((a, b) => b.profit - a.profit);
  }

  function renderOpportunities(tbodyId, list) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="warn">Sem oportunidades encontradas agora.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map((o) => `
      <tr>
        <td>${esc(o.name)}</td>
        <td>${esc(o.buyCity)}</td>
        <td>${esc(o.sellCity)}</td>
        <td>${formatSilver(o.buyPrice)}</td>
        <td>${formatSilver(o.sellPrice)}</td>
        <td class="good">${formatSilver(o.profit)}</td>
        <td>${formatPct(o.margin)}</td>
      </tr>`).join('');
  }

  async function scanMarket() {
    const buyCity = document.getElementById('buyCity').value;
    const sellCity = document.getElementById('sellCity').value;
    const capital = Number(document.getElementById('capitalInput').value || 0);
    const candidateBases = [
      ...window.ALBION_CATALOG.leather.items,
      ...window.ALBION_CATALOG.cloth.items,
      ...window.ALBION_CATALOG.weapons.items,
      ...window.ALBION_CATALOG.bags.items
    ];
    const itemIds = candidateBases.slice(0, 15).map((i) => makeTieredId(i.id, 6, 1));
    try {
      const rows = await fetchPrices(itemIds, [buyCity, sellCity]);
      const list = itemIds.map((itemId) => {
        const buy = priceFromRows(rows, itemId, buyCity, 'sell_price_min');
        const sell = priceFromRows(rows, itemId, sellCity, 'buy_price_max');
        const clean = itemId.replace(/^T\d_/, '').replace(/@\d+$/, '');
        const base = candidateBases.find((c) => c.id === clean);
        const profit = sell - buy;
        return {
          name: base?.name || clean,
          buyCity,
          sellCity,
          buyPrice: buy,
          sellPrice: sell,
          profit,
          margin: buy ? (profit / buy) * 100 : 0
        };
      }).filter((i) => i.buyPrice > 0 && i.sellPrice > 0 && i.buyPrice <= capital && i.profit > 0)
        .sort((a, b) => b.profit - a.profit);
      renderOpportunities('marketScanTable', list);
      renderHistoryTable();
    } catch (err) {
      document.getElementById('marketScanTable').innerHTML = `<tr><td colspan="7" class="bad">${esc(err.message)}</td></tr>`;
    }
  }

  async function analyzeRadar() {
    const city = document.getElementById('radarCity').value;
    const tier = Number(document.getElementById('radarTier').value || 6);
    const enchant = Number(document.getElementById('radarEnchant').value || 0);
    const base = getSelectedRadarBase();
    if (!base) return;
    const itemId = makeTieredId(base.id, tier, enchant);
    const result = document.getElementById('radarResult');
    result.textContent = 'Buscando preço...';
    try {
      const rows = await fetchPrices([itemId], [city]);
      const buy = priceFromRows(rows, itemId, city, 'sell_price_min');
      const sell = priceFromRows(rows, itemId, city, 'buy_price_max');
      const hist = appState.priceHistory[`${appState.server}|${itemId}|${city}`];
      let trend = 'Sem histórico';
      if (hist?.previous) trend = hist.last > hist.previous ? 'Subindo' : hist.last < hist.previous ? 'Caindo' : 'Lateral';
      result.innerHTML = `
<strong>${esc(base.name)} T${tier}.${enchant}</strong>
Cidade: ${esc(city)}
Menor venda: ${formatSilver(buy)}
Maior compra: ${formatSilver(sell)}
Spread local: ${formatSilver(Math.max(sell - buy, 0))}
Tendência local: ${trend}`;
      renderHistoryTable();
    } catch (err) {
      result.textContent = err.message;
    }
  }

  async function analyzeCraft() {
    const city = document.getElementById('craftCity').value;
    const tierLimit = Number(document.getElementById('craftTierLimit').value || 6);
    const category = document.getElementById('craftCategory').value;
    const tbody = document.getElementById('craftTable');
    const pools = {
      armor: [...window.ALBION_CATALOG.leather.items, ...window.ALBION_CATALOG.cloth.items, ...window.ALBION_CATALOG.plate.items],
      weapons: [...window.ALBION_CATALOG.weapons.items],
      bags: [...window.ALBION_CATALOG.bags.items]
    };
    const chosen = pools[category].slice(0, 8);
    const itemIds = chosen.map((i) => makeTieredId(i.id, tierLimit, 1));
    try {
      const rows = await fetchPrices(itemIds, [city]);
      const list = chosen.map((base, idx) => {
        const itemId = itemIds[idx];
        const sale = priceFromRows(rows, itemId, city, 'buy_price_max');
        const cost = Math.round(sale * 0.72);
        return { name: `${base.name} T${tierLimit}.1`, cost, sale, profit: sale - cost };
      }).filter((x) => x.sale > 0).sort((a, b) => b.profit - a.profit);
      tbody.innerHTML = list.map((r) => `<tr><td>${esc(r.name)}</td><td>${formatSilver(r.cost)}</td><td>${formatSilver(r.sale)}</td><td class="good">${formatSilver(r.profit)}</td></tr>`).join('') || '<tr><td colspan="4" class="warn">Sem dados.</td></tr>';
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" class="bad">${esc(err.message)}</td></tr>`;
    }
  }

  async function analyzeRefine() {
    const city = document.getElementById('refineCity').value;
    const resource = document.getElementById('refineResource').value;
    const tier = Number(document.getElementById('refineTier').value || 6);
    const tbody = document.getElementById('refineTable');
    const map = {
      hide: { raw: `T${tier}_HIDE`, refined: `T${tier}_LEATHER` , name: `Couro T${tier}` },
      ore: { raw: `T${tier}_ORE`, refined: `T${tier}_METALBAR`, name: `Barra T${tier}` },
      fiber: { raw: `T${tier}_FIBER`, refined: `T${tier}_CLOTH`, name: `Tecido T${tier}` },
      wood: { raw: `T${tier}_WOOD`, refined: `T${tier}_PLANKS`, name: `Tábua T${tier}` },
      stone: { raw: `T${tier}_ROCK`, refined: `T${tier}_STONEBLOCK`, name: `Bloco T${tier}` }
    };
    const cfg = map[resource];
    try {
      const rows = await fetchPrices([cfg.raw, cfg.refined], [city]);
      const raw = priceFromRows(rows, cfg.raw, city, 'sell_price_min');
      const refined = priceFromRows(rows, cfg.refined, city, 'buy_price_max');
      const baseCost = raw * 2;
      const profit = refined - baseCost;
      tbody.innerHTML = `<tr><td>${esc(cfg.name)}</td><td>${formatSilver(baseCost)}</td><td>${formatSilver(refined)}</td><td class="${profit >= 0 ? 'good' : 'bad'}">${formatSilver(profit)}</td></tr>`;
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="4" class="bad">${esc(err.message)}</td></tr>`;
    }
  }

  function analyzeIslands() {
    const accounts = Number(document.getElementById('accountsCount').value || 1);
    const islands = Number(document.getElementById('islandsCount').value || 1);
    const farms = Number(document.getElementById('farmPlots').value || 0);
    const pastures = Number(document.getElementById('pasturePlots').value || 0);
    const buyFeed = document.getElementById('buyFeed').value;
    const useFocus = document.getElementById('useFocus').value;
    const total = islands * 9;

    const animal = pastures >= 6 ? 'Boi T5' : pastures >= 3 ? 'Cavalo T5' : 'Boi T3';
    const feed = animal.includes('Boi') ? 'Cenoura / Abóbora' : 'Feijão / Trigo';
    const crop = farms >= 12 ? 'Ervas de alto valor' : 'Cenoura para giro e comida';
    const bonus = useFocus === 'yes' ? 'Use foco nos cultivos mais caros.' : 'Sem foco, prefira giro rápido.';
    const foodPlan = buyFeed === 'yes'
      ? 'Comprar comida reduz trabalho, mas aperta margem.'
      : 'Plantar sua própria comida aumenta controle da margem.';

    const profitBase = (farms * 18000) + (pastures * 30000);
    const multiIsland = islands > 1 ? 'Como você usa mais de uma ilha, concentre uma em plantio e outra em criação.' : 'Com uma ilha só, evite misturar tudo e foque em uma linha.';

    document.getElementById('islandsResult').innerHTML = `
<strong>Resumo</strong>
Contas: ${accounts}
Ilhas: ${islands}
Plots teóricos totais: ${total}

<strong>Melhor plantio inicial</strong>
${crop}

<strong>Melhor criação inicial</strong>
${animal}
Comida sugerida: ${feed}

<strong>Estratégia</strong>
${foodPlan}
${multiIsland}
${bonus}

<strong>Lucro bruto diário estimado</strong>
${formatSilver(profitBase)} prata`;
  }

  async function scanWarMarket() {
    const buyCity = document.getElementById('warBuyCity').value;
    const sellCity = document.getElementById('warSellCity').value;
    const warItems = window.ALBION_CATALOG.war.items;
    const itemIds = warItems.map((i) => makeTieredId(i.id, i.tier || 6, 1));
    try {
      const rows = await fetchPrices(itemIds, [buyCity, sellCity]);
      const tbody = document.getElementById('warTable');
      const list = warItems.map((base, idx) => {
        const itemId = itemIds[idx];
        const buy = priceFromRows(rows, itemId, buyCity, 'sell_price_min');
        const sell = priceFromRows(rows, itemId, sellCity, 'buy_price_max');
        const profit = sell - buy;
        return { name: base.name, tier: `T${base.tier || 6}.1`, buy, sell, profit };
      }).filter((x) => x.buy > 0 && x.sell > 0).sort((a, b) => b.profit - a.profit);
      tbody.innerHTML = list.map((r) => `<tr><td>${esc(r.name)}</td><td>${r.tier}</td><td>${formatSilver(r.buy)}</td><td>${formatSilver(r.sell)}</td><td class="${r.profit >= 0 ? 'good' : 'bad'}">${formatSilver(r.profit)}</td></tr>`).join('') || '<tr><td colspan="5" class="warn">Sem dados.</td></tr>';
    } catch (err) {
      document.getElementById('warTable').innerHTML = `<tr><td colspan="5" class="bad">${esc(err.message)}</td></tr>`;
    }
  }

  async function analyzeLoot() {
    const city = document.getElementById('lootCity').value;
    const lines = document.getElementById('lootText').value.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed = lines.map((line) => {
      const [itemId, qty] = line.split(/\s+/);
      return { itemId, qty: Number(qty || 1) };
    }).filter((x) => x.itemId);
    if (!parsed.length) {
      document.getElementById('lootResult').textContent = 'Cole pelo menos um item.';
      return;
    }
    const itemIds = [...new Set(parsed.map((p) => p.itemId))];
    try {
      const rows = await fetchPrices(itemIds, [city, 'Caerleon']);
      let totalCity = 0;
      let totalCaer = 0;
      parsed.forEach((p) => {
        totalCity += priceFromRows(rows, p.itemId, city, 'buy_price_max') * p.qty;
        totalCaer += priceFromRows(rows, p.itemId, 'Caerleon', 'buy_price_max') * p.qty;
      });
      const better = totalCaer > totalCity ? 'Levar para Caerleon' : `Vender em ${city}`;
      document.getElementById('lootResult').innerHTML = `
<strong>Resumo do loot</strong>
Valor imediato em ${city}: ${formatSilver(totalCity)}
Valor em Caerleon: ${formatSilver(totalCaer)}

<strong>Melhor decisão agora</strong>
${better}

<strong>Leitura</strong>
Se a diferença for grande, transporte compensa. Se você quiser zero risco, venda onde está.`;
    } catch (err) {
      document.getElementById('lootResult').textContent = err.message;
    }
  }

  function analyzeRoute() {
    const start = document.getElementById('routeStart').value.trim();
    const end = document.getElementById('routeEnd').value.trim();
    const mode = document.getElementById('routeMode').value;
    if (!start || !end) {
      document.getElementById('routeResult').textContent = 'Informe origem e destino.';
      return;
    }
    const mount = mode === 'safe' ? 'Boi blindado / Mamute se tiver capital' : mode === 'fast' ? 'Cavalo blindado' : 'Alce / cavalo de carga';
    const body = mode === 'safe'
      ? `Rota safe: evite zonas vermelhas e priorize amarelas/azuis. Entre pela black só se a margem pagar o risco.`
      : mode === 'fast'
        ? `Rota rápida: corte por black onde fizer sentido e saia por portal mais próximo.`
        : `Rota equilibrada: use trechos seguros no começo e encurte no fim se a carga permitir.`;
    document.getElementById('routeResult').innerHTML = `
<strong>Rota sugerida</strong>
Origem: ${esc(start)}
Destino: ${esc(end)}
Perfil: ${mode}

${body}

Montaria sugerida: ${mount}`;
  }

  function calculateFame() {
    const f1 = Number(document.getElementById('fameStart').value || 0);
    const f2 = Number(document.getElementById('fameEnd').value || 0);
    const t1 = document.getElementById('timeStart').value;
    const t2 = document.getElementById('timeEnd').value;
    const [h1,m1] = t1.split(':').map(Number);
    const [h2,m2] = t2.split(':').map(Number);
    const start = h1*60 + m1;
    const end = h2*60 + m2;
    const diffMin = Math.max(end - start, 1);
    const diffFame = Math.max(f2 - f1, 0);
    const fameHour = Math.round(diffFame * 60 / diffMin);
    document.getElementById('fameResult').innerHTML = `
Fama ganha: ${formatSilver(diffFame)}
Tempo: ${diffMin} min
Fama/hora: ${formatSilver(fameHour)}`;
  }

  function generateWealthPlan() {
    const now = Number(document.getElementById('moneyNow').value || 0);
    const goal = Number(document.getElementById('moneyGoal').value || 0);
    const hours = Number(document.getElementById('hoursPerDay').value || 1);
    const risk = document.getElementById('riskProfile').value;
    const acts = [...document.querySelectorAll('#activityChoices input:checked')].map((i) => i.value);
    const diff = Math.max(goal - now, 0);
    const weeks = Math.max(Math.ceil(diff / Math.max(now * 0.5, 500000)), 1);
    const dailyTarget = Math.ceil(diff / Math.max(weeks * 7, 1));

    const safeOp = 'mercado local + transporte curto entre cidades reais com menor risco';
    const aggrOp = 'arbitragem mais agressiva + transporte para Caerleon quando a margem pagar';
    const chosen = risk === 'safe' ? safeOp : risk === 'aggressive' ? aggrOp : 'mistura de mercado, transporte e uma atividade paralela';
    const secondary = acts.includes('dg') ? 'faça 2 a 3 DGs por dia para caixa e fama' : acts.includes('coleta') ? 'mantenha coleta como renda estável de suporte' : 'use uma atividade secundária para não depender de uma única linha';

    document.getElementById('wealthResult').innerHTML = `
<strong>Meta</strong>
Atual: ${formatSilver(now)}
Objetivo: ${formatSilver(goal)}
Meta diária média: ${formatSilver(dailyTarget)}
Meta semanal média: ${formatSilver(dailyTarget * 7)}

<strong>Semana 1</strong>
Dia 1: operar ${chosen}.
Dia 2: repetir só os itens que mantiveram margem positiva.
Dia 3: aumentar volume sem travar todo o capital num item só.
Dia 4: fazer fechamento de caixa e cortar itens ruins.
Dia 5 a 7: repetir a melhor linha da semana e reinvestir.

<strong>Passo a passo para iniciante</strong>
1. Nunca comprometa 100% da prata em um só item.
2. Comece com rotas curtas e itens líquidos.
3. ${secondary}.
4. Feche cada dia anotando se morreu, quanto sobrou e o que funcionou.
5. Se a rota agressiva não te agradar, fique no modo safe e gire mais vezes por dia.

<strong>Leitura</strong>
Com ${hours}h/dia, o plano mais coerente agora é: ${chosen}.`;
  }

  function renderHistoryTable() {
    const tbody = document.getElementById('historyTable');
    if (!tbody) return;
    const entries = Object.values(appState.priceHistory).sort((a,b) => (b.updated_at || '').localeCompare(a.updated_at || '')).slice(0, 60);
    if (!entries.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="warn">Nenhum histórico salvo neste navegador ainda.</td></tr>';
      return;
    }
    tbody.innerHTML = entries.map((r) => {
      const diff = r.previous ? r.last - r.previous : 0;
      const pct = r.previous ? (diff / r.previous) * 100 : 0;
      const trend = !r.previous ? 'Novo' : diff > 0 ? 'Subindo' : diff < 0 ? 'Caindo' : 'Lateral';
      return `<tr>
        <td>${esc(r.item_id)}</td>
        <td>${esc(r.city)}</td>
        <td>${formatSilver(r.last)}</td>
        <td>${formatSilver(r.previous || 0)}</td>
        <td class="${diff >= 0 ? 'good' : 'bad'}">${r.previous ? formatPct(pct) : '-'}</td>
        <td>${trend}</td>
      </tr>`;
    }).join('');
  }

  function clearHistory() {
    appState.priceHistory = {};
    saveHistory();
    renderHistoryTable();
  }

  routeGuard();
  domReady(() => {
    loginInit();
    dashboardInit();
    adminInit();
  });
})();
