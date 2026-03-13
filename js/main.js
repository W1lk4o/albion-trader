(function () {
  const STORAGE_KEY = 'albionTraderSession';
  const DEFAULT_LOCATIONS = ['Caerleon', 'Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const MARKET_FEE = 0.065;
  const TRANSPORT_FEE = 0.04;

  const RADAR_CATALOG = {
    'Recursos brutos': [
      { name: 'Madeira bruta', code: 'WOOD', tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Pedra bruta', code: 'ROCK', tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Fibra bruta', code: 'FIBER', tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Couro bruto', code: 'HIDE', tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Minério bruto', code: 'ORE', tiers: [2,3,4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Recursos refinados': [
      { name: 'Tábuas', code: 'PLANKS', tiers: [3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Blocos de pedra', code: 'STONEBLOCK', tiers: [3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Tecido', code: 'CLOTH', tiers: [3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Couro refinado', code: 'LEATHER', tiers: [3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Barra de metal', code: 'METALBAR', tiers: [3,4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Utilidade': [
      { name: 'Bolsa', code: 'BAG', tiers: [3,4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Capa', code: 'CAPE', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Couro - Set 1': [
      { name: 'Capuz de mercenário', code: 'HEAD_LEATHER_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Casaco de mercenário', code: 'ARMOR_LEATHER_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Sapatos de mercenário', code: 'SHOES_LEATHER_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Couro - Set 2': [
      { name: 'Capuz de caçador', code: 'HEAD_LEATHER_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Casaco de caçador', code: 'ARMOR_LEATHER_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Sapatos de caçador', code: 'SHOES_LEATHER_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Couro - Set 3': [
      { name: 'Capuz de assassino', code: 'HEAD_LEATHER_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Jaqueta de assassino', code: 'ARMOR_LEATHER_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Sapatos de assassino', code: 'SHOES_LEATHER_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Pano - Set 1': [
      { name: 'Capuz de mago', code: 'HEAD_CLOTH_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Manto de mago', code: 'ARMOR_CLOTH_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Sandálias de mago', code: 'SHOES_CLOTH_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Pano - Set 2': [
      { name: 'Capuz de clérigo', code: 'HEAD_CLOTH_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Manto de clérigo', code: 'ARMOR_CLOTH_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Sandálias de clérigo', code: 'SHOES_CLOTH_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Pano - Set 3': [
      { name: 'Capuz de estudioso', code: 'HEAD_CLOTH_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Manto de estudioso', code: 'ARMOR_CLOTH_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Sandálias de estudioso', code: 'SHOES_CLOTH_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Placa - Set 1': [
      { name: 'Capacete de soldado', code: 'HEAD_PLATE_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Armadura de soldado', code: 'ARMOR_PLATE_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Botas de soldado', code: 'SHOES_PLATE_SET1', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Placa - Set 2': [
      { name: 'Capacete de cavaleiro', code: 'HEAD_PLATE_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Armadura de cavaleiro', code: 'ARMOR_PLATE_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Botas de cavaleiro', code: 'SHOES_PLATE_SET2', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ],
    'Placa - Set 3': [
      { name: 'Capacete de guardião', code: 'HEAD_PLATE_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Armadura de guardião', code: 'ARMOR_PLATE_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] },
      { name: 'Botas de guardião', code: 'SHOES_PLATE_SET3', tiers: [4,5,6,7,8], enchants: [0,1,2,3,4] }
    ]
  };

  const ISLAND_CROPS = [
    { name: 'Cenoura', tier: 'T3', profit: 12000, feedValue: 9000, note: 'opção estável para base simples' },
    { name: 'Feijão', tier: 'T4', profit: 15000, feedValue: 12000, note: 'boa linha para comida' },
    { name: 'Trigo', tier: 'T5', profit: 17000, feedValue: 13500, note: 'ótimo para produção própria de comida' },
    { name: 'Erva medicinal', tier: 'T6', profit: 21000, feedValue: 0, note: 'mais margem, mas depende do mercado' },
    { name: 'Abóbora', tier: 'T7', profit: 19000, feedValue: 16500, note: 'boa para contas maiores' }
  ];

  const ISLAND_ANIMALS = [
    { name: 'Galinha', tier: 'T3', profit: 9000, feedNeed: 2500, note: 'simples e com giro rápido' },
    { name: 'Porco', tier: 'T4', profit: 17000, feedNeed: 6500, note: 'boa linha de lucro com custo controlado' },
    { name: 'Cabra', tier: 'T5', profit: 22000, feedNeed: 8200, note: 'boa quando o mercado está aquecido' },
    { name: 'Cavalo', tier: 'T5', profit: 26000, feedNeed: 11000, note: 'vende bem em épocas de movimentação' },
    { name: 'Boi', tier: 'T5', profit: 30000, feedNeed: 14000, note: 'mais capital preso, mas lucro forte' }
  ];

  const ITEM_NAME_MAP = Object.values(RADAR_CATALOG).flat().reduce((acc, item) => {
    acc[item.code] = item.name;
    return acc;
  }, {});

  const SCAN_ITEM_IDS = buildScanList();
  const POPULAR_SCAN_ITEM_IDS = SCAN_ITEM_IDS.slice(0, 300);

  function buildScanList() {
    const ids = [];
    Object.values(RADAR_CATALOG).forEach((list) => {
      list.forEach((item) => {
        item.tiers.forEach((tier) => {
          const enchants = item.enchants.includes(0) ? [0, 1] : [0];
          enchants.forEach((ench) => ids.push(buildAlbionItemId(item, tier, ench)));
        });
      });
    });
    return Array.from(new Set(ids));
  }

  function getDeviceId() {
    let deviceId = localStorage.getItem('albionTraderDeviceId');
    if (!deviceId) {
      deviceId = 'device-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('albionTraderDeviceId', deviceId);
    }
    return deviceId;
  }

  function saveSession(payload) { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
  }
  function clearSession() { localStorage.removeItem(STORAGE_KEY); }

  async function api(url, options = {}) {
    const session = getSession();
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;
    const response = await fetch(url, Object.assign({}, options, { headers }));
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Erro na requisição.');
    return data;
  }

  async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const message = document.getElementById('loginMessage');
    message.textContent = 'Entrando...';
    try {
      const data = await api('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha, deviceId: getDeviceId() })
      });
      saveSession(data);
      message.textContent = 'Login realizado com sucesso.';
      window.location.href = data.user.admin ? '/admin' : '/dashboard';
    } catch (error) {
      message.textContent = error.message;
    }
  }

  async function requireAuth() {
    const page = document.body.dataset.page;
    if (!page) return null;
    const session = getSession();
    if (!session?.token) {
      window.location.href = '/';
      return null;
    }
    try {
      const data = await api('/api/me');
      const user = data.user;
      if (page === 'admin' && !user.admin) {
        window.location.href = '/dashboard';
        return null;
      }
      return user;
    } catch {
      clearSession();
      window.location.href = '/';
      return null;
    }
  }

  function bindLogout() {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      clearSession();
      window.location.href = '/';
    });
  }

  function activateSection(targetId) {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.page-section');
    navItems.forEach((i) => i.classList.toggle('active', i.dataset.target === targetId));
    sections.forEach((s) => s.classList.toggle('active', s.id === targetId));
  }

  function bindNav() {
    const targets = document.querySelectorAll('[data-target]');
    targets.forEach((item) => item.addEventListener('click', () => activateSection(item.dataset.target)));
  }

  function formatSilver(value) { return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0)); }
  function setHtml(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
  function sortByProfitDesc(list) { return [...list].sort((a, b) => b.profit - a.profit); }
  function chunkArray(list, size) { const out=[]; for (let i=0;i<list.length;i+=size) out.push(list.slice(i,i+size)); return out; }
  function median(values) { if (!values.length) return 0; const arr=[...values].sort((a,b)=>a-b); const mid=Math.floor(arr.length/2); return arr.length%2?arr[mid]:(arr[mid-1]+arr[mid])/2; }
  function setProgress(percent, text) { const fill = document.getElementById('opportunityProgressBar'); const label = document.getElementById('opportunityProgressPercent'); const txt = document.getElementById('opportunityProgressText'); if (fill) fill.style.width = `${percent}%`; if (label) label.textContent = `${percent}%`; if (txt && text) txt.textContent = text; }
  function setApiBadge(text, state='loading') { const badge = document.getElementById('apiStatusBadge'); if (!badge) return; badge.textContent = text; badge.classList.remove('loading','error','success'); badge.classList.add(state); }
  function buildAlbionItemId(itemDef, tier, enchant) { return Number(enchant) > 0 ? `T${tier}_${itemDef.code}@${enchant}` : `T${tier}_${itemDef.code}`; }

  function parseItemId(itemId) {
    const match = itemId.match(/^T(\d+)_([^@]+)(?:@(\d+))?$/);
    if (!match) return null;
    return { tier: Number(match[1]), code: match[2], enchant: Number(match[3] || 0) };
  }

  function prettyItemName(itemId) {
    const parsed = parseItemId(itemId);
    if (!parsed) return itemId;
    const base = ITEM_NAME_MAP[parsed.code] || parsed.code.replace(/_/g, ' ').toLowerCase();
    const cleanBase = base.charAt(0).toUpperCase() + base.slice(1);
    const tierLabel = parsed.enchant > 0 ? `T${parsed.tier}.${parsed.enchant}` : `T${parsed.tier}`;
    return `${cleanBase} ${tierLabel}`;
  }

  function populateRadarSelectors() {
    const categorySelect = document.getElementById('radarCategory');
    const itemSelect = document.getElementById('radarItem');
    const tierSelect = document.getElementById('radarTier');
    const enchantSelect = document.getElementById('radarEnchant');
    if (!categorySelect || !itemSelect || !tierSelect || !enchantSelect) return;

    const categories = Object.keys(RADAR_CATALOG);
    categorySelect.innerHTML = categories.map((name) => `<option value="${name}">${name}</option>`).join('');

    function syncItems() {
      const items = RADAR_CATALOG[categorySelect.value] || [];
      itemSelect.innerHTML = items.map((item, index) => `<option value="${index}">${item.name}</option>`).join('');
      syncTiers();
    }

    function syncTiers() {
      const items = RADAR_CATALOG[categorySelect.value] || [];
      const itemDef = items[Number(itemSelect.value)] || items[0];
      if (!itemDef) return;
      tierSelect.innerHTML = itemDef.tiers.map((tier) => `<option value="${tier}">T${tier}</option>`).join('');
      enchantSelect.innerHTML = itemDef.enchants.map((ench) => `<option value="${ench}">${ench === 0 ? 'Sem encantamento' : `.${ench}`}</option>`).join('');
      refreshRadarPreview();
    }

    categorySelect.addEventListener('change', syncItems);
    itemSelect.addEventListener('change', syncTiers);
    tierSelect.addEventListener('change', refreshRadarPreview);
    enchantSelect.addEventListener('change', refreshRadarPreview);
    syncItems();
  }

  function getCurrentRadarItem() {
    const categorySelect = document.getElementById('radarCategory');
    const itemSelect = document.getElementById('radarItem');
    const tierSelect = document.getElementById('radarTier');
    const enchantSelect = document.getElementById('radarEnchant');
    if (!categorySelect || !itemSelect || !tierSelect || !enchantSelect) return null;
    const itemDef = (RADAR_CATALOG[categorySelect.value] || [])[Number(itemSelect.value)];
    if (!itemDef) return null;
    const tier = Number(tierSelect.value);
    const enchant = Number(enchantSelect.value);
    return { itemDef, tier, enchant, itemId: buildAlbionItemId(itemDef, tier, enchant) };
  }

  function sanitizePriceRows(rows) {
    const allowedCities = new Set(DEFAULT_LOCATIONS);
    const clean = rows.filter((row) => allowedCities.has(row.city) && Number(row.sell_price_min) > 0 && Number(row.sell_price_min) < 50000000);
    if (!clean.length) return [];
    const prices = clean.map((r) => Number(r.sell_price_min)).filter((n) => n > 0);
    const med = median(prices);
    if (!med) return clean;
    const filtered = clean.filter((row) => row.sell_price_min >= med * 0.35 && row.sell_price_min <= med * 3.5);
    return filtered.length >= 2 ? filtered : clean;
  }

  async function fetchPricesChunked(itemIds, onProgress) {
    const groups = chunkArray(itemIds, 35);
    const all = [];
    for (let i = 0; i < groups.length; i += 1) {
      const group = groups[i];
      const data = await api(`/api/albion-prices?items=${encodeURIComponent(group.join(','))}&locations=${encodeURIComponent(DEFAULT_LOCATIONS.join(','))}`);
      all.push(...(data.data || []));
      const percent = Math.max(1, Math.round(((i + 1) / groups.length) * 100));
      if (onProgress) onProgress(percent, i + 1, groups.length);
    }
    return all;
  }

  function refreshRadarPreview() {
    const preview = document.getElementById('radarPreview');
    const current = getCurrentRadarItem();
    if (!preview || !current) return;
    preview.innerHTML = `<strong>${current.itemDef.name}</strong><span>${current.enchant > 0 ? `T${current.tier}.${current.enchant}` : `T${current.tier}`}</span><span class="muted">Código Albion: ${current.itemId}</span>`;
  }

  function buildItemTradeView(rows, itemName) {
    const offers = sanitizePriceRows(rows);
    if (!offers.length) return '<div class="muted">Não foi possível encontrar preços confiáveis para esse item agora.</div>';

    const buyOrder = offers.reduce((best, row) => row.sell_price_min < best.sell_price_min ? row : best, offers[0]);
    const sellCandidates = offers.filter((row) => row.city !== buyOrder.city);
    if (!sellCandidates.length) return '<div class="muted">Só encontramos preço confiável em uma cidade. Tente novamente em alguns minutos.</div>';
    const sellOrder = sellCandidates.reduce((best, row) => row.sell_price_min > best.sell_price_min ? row : best, sellCandidates[0]);

    const buyPrice = Number(buyOrder.sell_price_min || 0);
    const sellPrice = Number(sellOrder.sell_price_min || 0);
    const tax = Math.round(sellPrice * MARKET_FEE);
    const transport = Math.round(buyPrice * TRANSPORT_FEE);
    const profit = sellPrice - buyPrice - tax - transport;
    const margin = buyPrice > 0 ? (profit / buyPrice) * 100 : 0;

    return `
      <div class="highlight-box">
        <div>
          <span class="muted">Melhor compra</span>
          <strong>${buyOrder.city}</strong>
          <small>${formatSilver(buyPrice)} prata</small>
        </div>
        <div>
          <span class="muted">Melhor venda</span>
          <strong>${sellOrder.city}</strong>
          <small>${formatSilver(sellPrice)} prata</small>
        </div>
        <div>
          <span class="muted">Lucro líquido estimado</span>
          <strong>${formatSilver(profit)}</strong>
          <small>${margin.toFixed(1)}% de margem</small>
        </div>
      </div>
      <div class="result-intro"><strong>${itemName}</strong><span>Taxa padrão: 6,5% | Transporte estimado: 4%</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Cidade</th>
              <th>Preço de compra local</th>
              <th>Ordem de compra</th>
              <th>Atualizado em</th>
            </tr>
          </thead>
          <tbody>
            ${offers.sort((a, b) => a.sell_price_min - b.sell_price_min).map((row) => `
              <tr>
                <td>${row.city}</td>
                <td>${formatSilver(row.sell_price_min)}</td>
                <td>${formatSilver(row.buy_price_max || 0)}</td>
                <td>${row.sell_price_min_date ? new Date(row.sell_price_min_date).toLocaleString('pt-BR') : '-'}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="result-note">O radar rápido serve para 1 item só. O sistema já filtrou preços absurdos antes de sugerir a rota.</div>
    `;
  }

  async function loadMarket() {
    const current = getCurrentRadarItem();
    const box = document.getElementById('marketResult');
    if (!box) return;
    if (!current) {
      box.textContent = 'Escolha um item primeiro.';
      return;
    }
    setApiBadge('AlbionData consultando item...', 'loading');
    box.textContent = 'Buscando preços confiáveis do item...';
    try {
      const data = await api(`/api/albion-prices?items=${encodeURIComponent(current.itemId)}`);
      const rows = (data.data || []).filter((x) => x.sell_price_min || x.buy_price_max);
      box.innerHTML = buildItemTradeView(rows, prettyItemName(current.itemId));
      setApiBadge('AlbionData pronto', 'success');
    } catch (error) {
      setApiBadge('AlbionData com erro', 'error');
      box.textContent = error.message;
    }
  }

  function buildOpportunities(rows) {
    const grouped = new Map();
    rows.forEach((row) => {
      if (!row.item_id || !(row.sell_price_min > 0)) return;
      if (!grouped.has(row.item_id)) grouped.set(row.item_id, []);
      grouped.get(row.item_id).push(row);
    });

    const out = [];
    grouped.forEach((itemRows, itemId) => {
      const cleanRows = sanitizePriceRows(itemRows);
      if (cleanRows.length < 2) return;
      const cheapest = cleanRows.reduce((best, row) => row.sell_price_min < best.sell_price_min ? row : best, cleanRows[0]);
      const sellCandidates = cleanRows.filter((row) => row.city !== cheapest.city);
      if (!sellCandidates.length) return;
      const expensive = sellCandidates.reduce((best, row) => row.sell_price_min > best.sell_price_min ? row : best, sellCandidates[0]);
      const buyPrice = Number(cheapest.sell_price_min || 0);
      const sellPrice = Number(expensive.sell_price_min || 0);
      if (!buyPrice || !sellPrice || sellPrice <= buyPrice) return;
      const marketTax = Math.round(sellPrice * MARKET_FEE);
      const transport = Math.round(buyPrice * TRANSPORT_FEE);
      const profit = sellPrice - buyPrice - marketTax - transport;
      const margin = buyPrice > 0 ? (profit / buyPrice) * 100 : 0;
      if (profit > 0) {
        out.push({
          itemId,
          itemName: prettyItemName(itemId),
          buyCity: cheapest.city,
          sellCity: expensive.city,
          buyPrice,
          sellPrice,
          profit,
          margin,
          spread: sellPrice - buyPrice,
          confidence: cleanRows.length >= 4 ? 'Boa' : 'Média'
        });
      }
    });
    return sortByProfitDesc(out).slice(0, 30);
  }

  async function loadOpportunityRadar(mode = 'popular') {
    const box = document.getElementById('opportunityResult');
    if (!box) return;
    const scanList = mode === 'full' ? SCAN_ITEM_IDS : POPULAR_SCAN_ITEM_IDS;
    const modeLabel = mode === 'full' ? 'mercado completo' : '300 itens populares';
    setApiBadge(`AlbionData carregando ${modeLabel}...`, 'loading');
    setProgress(0, `Preparando leitura de ${modeLabel}...`);
    box.textContent = `Escaneando ${modeLabel}...`;
    try {
      const rows = await fetchPricesChunked(scanList, (percent, current, total) => {
        setProgress(percent, `Consultando Albion Data: lote ${current} de ${total}`);
      });
      const opportunities = buildOpportunities(rows || []);
      const summary = document.getElementById('opportunitySummary');
      setProgress(100, `Leitura concluída: ${modeLabel}.`);
      setApiBadge('AlbionData pronto', 'success');
      if (!opportunities.length) {
        box.innerHTML = '<div class="muted">Nenhuma oportunidade confiável encontrada agora. Tente novamente em alguns minutos.</div>';
        if (summary) summary.textContent = 'Sem oportunidade confiável no momento.';
        return;
      }
      if (summary) {
        const best = opportunities[0];
        summary.textContent = `Melhor sugestão do dia: ${best.itemName}, comprar em ${best.buyCity} e vender em ${best.sellCity}, lucro líquido estimado de ${formatSilver(best.profit)} prata.`;
      }
      const html = `
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Comprar em</th>
                <th>Vender em</th>
                <th>Preço compra</th>
                <th>Preço venda</th>
                <th>Spread bruto</th>
                <th>Lucro líquido</th>
                <th>Margem</th>
                <th>Confiança</th>
              </tr>
            </thead>
            <tbody>
              ${opportunities.map((op) => `
                <tr>
                  <td>${op.itemName}</td>
                  <td>${op.buyCity}</td>
                  <td>${op.sellCity}</td>
                  <td>${formatSilver(op.buyPrice)}</td>
                  <td>${formatSilver(op.sellPrice)}</td>
                  <td>${formatSilver(op.spread)}</td>
                  <td>${formatSilver(op.profit)}</td>
                  <td>${op.margin.toFixed(1)}%</td>
                  <td>${op.confidence}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
      box.innerHTML = html;
      const mirror = document.getElementById('opportunityResultCopy');
      if (mirror) mirror.innerHTML = html;
    } catch (error) {
      setApiBadge('AlbionData com erro', 'error');
      setProgress(0, 'Falha ao consultar o mercado.');
      box.textContent = error.message;
    }
  }

  async function initDashboard() {
    const user = await requireAuth();
    if (!user) return;
    const welcomeTitle = document.getElementById('welcomeTitle');
    const licenseDate = document.getElementById('licenseDate');
    if (welcomeTitle) welcomeTitle.textContent = `Olá, ${user.nome || user.email}`;
    if (licenseDate) licenseDate.textContent = new Date(user.licencaExpiraEm).toLocaleDateString('pt-BR');
    bindLogout();
    bindNav();
    populateRadarSelectors();
    document.getElementById('loadMarketBtn')?.addEventListener('click', loadMarket);
    document.getElementById('loadOpportunityBtn')?.addEventListener('click', () => loadOpportunityRadar('popular'));
    document.getElementById('loadOpportunityFullBtn')?.addEventListener('click', () => loadOpportunityRadar('full'));
    loadOpportunityRadar('popular');
  }

  async function initAdmin() {
    const user = await requireAuth();
    if (!user) return;
    const title = document.getElementById('adminTitle');
    if (title) title.textContent = `Painel admin — ${user.nome || user.email}`;
    bindLogout();
    try {
      const data = await api('/api/users');
      const tbody = document.getElementById('adminUsersTable');
      const count = document.getElementById('adminUserCount');
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = data.notice || '';
      if (count) count.textContent = data.users.length;
      if (tbody) {
        tbody.innerHTML = data.users.map((u) => `
          <tr>
            <td>${u.nome || '-'}</td>
            <td>${u.email}</td>
            <td>${u.admin ? 'Admin' : 'Usuário'}</td>
            <td>${new Date(u.licencaExpiraEm).toLocaleDateString('pt-BR')}</td>
          </tr>`).join('');
      }
    } catch (error) {
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = error.message;
    }
  }

  function calcCraft() {
    const level = Number(document.getElementById('craftLevel').value || 0);
    const city = document.getElementById('craftCity').value;
    const cost = Number(document.getElementById('craftCost').value || 0);
    const sell = Number(document.getElementById('craftSell').value || 0);
    const bonus = level >= 80 ? 1.07 : level >= 50 ? 1.04 : 1.01;
    const fee = Math.round(sell * MARKET_FEE);
    const adjustedCost = cost / bonus;
    const lucro = sell - adjustedCost - fee;
    const margem = cost > 0 ? (lucro / cost) * 100 : 0;
    setHtml('craftResult', `<strong>Resultado do craft em ${city}</strong><br>Lucro estimado: <strong>${formatSilver(lucro)} prata</strong><br>Margem: <strong>${margem.toFixed(1)}%</strong><br>Leitura: ${lucro > 0 ? 'vale testar itens de giro rápido, como bolsas e capas.' : 'esse craft está apertado; melhore custo dos materiais ou venda.'}`);
  }

  function calcRefine() {
    const level = Number(document.getElementById('refineLevel').value || 0);
    const city = document.getElementById('refineCity').value;
    const focus = document.getElementById('refineFocus').value === 'sim';
    const cost = Number(document.getElementById('refineCost').value || 0);
    const sell = Number(document.getElementById('refineSell').value || 0);
    const efficiency = focus ? 0.86 : 1;
    const xpBonus = level >= 75 ? 0.95 : 1;
    const fee = Math.round(sell * MARKET_FEE);
    const lucro = sell - cost * efficiency * xpBonus - fee;
    setHtml('refineResult', `<strong>Resultado do refino em ${city}</strong><br>Lucro estimado: <strong>${formatSilver(lucro)} prata</strong> ${focus ? 'com foco' : 'sem foco'}<br>Melhor leitura: ${focus ? 'aproveite itens com retorno de recursos e venda rápida.' : 'sem foco, prefira spreads maiores e muito giro.'}`);
  }

  function calcIsland() {
    const islandCount = Number(document.getElementById('islandCount').value || 1);
    const level = Number(document.getElementById('islandLevel').value || 0);
    const plotsPerIsland = Number(document.getElementById('islandPlots').value || 0);
    const pasturesPerIsland = Number(document.getElementById('islandPastures').value || 0);
    const focus = document.getElementById('islandFocus').value === 'sim';
    const cropChoice = document.getElementById('islandCropChoice').value;
    const animalChoice = document.getElementById('islandAnimalChoice').value;
    const animalTier = Number(document.getElementById('islandAnimalTier').value || 5);
    const feedMode = document.getElementById('islandFeedMode').value;
    const totalPlots = islandCount * plotsPerIsland;
    const totalPastures = islandCount * pasturesPerIsland;

    const cropPool = ISLAND_CROPS.map((crop) => ({
      ...crop,
      cycleProfit: Math.round(crop.profit * totalPlots * (1 + level * 0.03) * (focus ? 1.12 : 1))
    }));
    const animalPool = ISLAND_ANIMALS.map((animal) => {
      const tierFactor = 1 + (animalTier - 3) * 0.15;
      const feedDiscount = feedMode === 'plantar' ? 0.55 : 1;
      const net = (animal.profit - animal.feedNeed * feedDiscount);
      return {
        ...animal,
        cycleProfit: Math.round(net * totalPastures * tierFactor * (focus ? 1.08 : 1)),
        chosenTier: `T${animalTier}`
      };
    });

    const bestCrop = cropChoice === 'auto' ? sortByProfitDesc(cropPool)[0] : cropPool.find((x) => x.name === cropChoice);
    const bestAnimal = animalChoice === 'auto' ? sortByProfitDesc(animalPool)[0] : animalPool.find((x) => x.name === animalChoice);
    const cropText = bestCrop ? `${bestCrop.name} ${bestCrop.tier}` : 'Nenhuma';
    const animalText = bestAnimal ? `${bestAnimal.name} ${bestAnimal.chosenTier}` : 'Nenhum';
    const total = (bestCrop?.cycleProfit || 0) + (bestAnimal?.cycleProfit || 0);

    setHtml('islandResult', `
      <strong>Melhor plano para suas ilhas</strong><br><br>
      Quantidade de ilhas: <strong>${islandCount}</strong><br>
      Plantações totais: <strong>${totalPlots}</strong><br>
      Pastos totais: <strong>${totalPastures}</strong><br><br>
      Melhor plantação: <strong>${cropText}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestCrop?.cycleProfit || 0)}</strong><br>
      Melhor criação: <strong>${animalText}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestAnimal?.cycleProfit || 0)}</strong><br>
      Lucro total estimado: <strong>${formatSilver(total)} prata</strong><br><br>
      • ${bestCrop ? `Com ${totalPlots} plantações, ${bestCrop.name} ${bestCrop.tier} entrega a melhor leitura agora: ${bestCrop.note}.` : 'Sem plantações configuradas.'}<br>
      • ${bestAnimal ? `Com ${totalPastures} pastos, ${bestAnimal.name} ${bestAnimal.chosenTier} fica melhor neste cenário.` : 'Sem pastos configurados.'}<br>
      • Alimentação dos animais: <strong>${feedMode === 'plantar' ? 'produzindo na própria ilha' : 'comprando no mercado'}</strong>.<br>
      • ${feedMode === 'plantar' ? 'Produzir a própria comida reduz custo e tende a melhorar a margem.' : 'Comprar comida deixa a operação mais simples, mas derruba a margem líquida.'}
    `);
  }

  function calcTransport() {
    const buyCity = document.getElementById('transportBuyCity').value;
    const sellCity = document.getElementById('transportSellCity').value;
    const buy = Number(document.getElementById('transportBuyPrice').value || 0);
    const sell = Number(document.getElementById('transportSellPrice').value || 0);
    const cost = Number(document.getElementById('transportCost').value || 0);
    const fee = Math.round(sell * MARKET_FEE);
    const lucro = sell - buy - cost - fee;
    setHtml('transportResult', `<strong>Transporte ${buyCity} → ${sellCity}</strong><br>Lucro estimado: <strong>${formatSilver(lucro)} prata</strong><br>${lucro > 0 ? 'Rota viável. Agora valide risco do caminho antes de sair carregado.' : 'Rota ruim. Ou pagou caro na compra, ou o destino não está compensando.'}`);
  }

  function calcWealth() {
    const current = Number(document.getElementById('wealthCurrent').value || 0);
    const goal = Number(document.getElementById('wealthGoal').value || 0);
    const days = Number(document.getElementById('wealthDays').value || 1);
    const dailyNeed = days > 0 ? (goal - current) / days : 0;
    const verdict = dailyNeed <= current * 0.8 ? 'É possível com execução boa.' : 'É possível, mas exige execução forte.';
    setHtml('wealthResult', `<strong>Plano para sair de ${formatSilver(current)} e buscar ${formatSilver(goal)}</strong><br><br>Precisa gerar em média: <strong>${formatSilver(dailyNeed)} prata por dia</strong><br>Veredito: ${verdict}<br><br><strong>Melhor caminho agora:</strong><br>Fase 1: usar mercado + transporte para acelerar o giro do capital.<br>Fase 2: escolher uma linha de craft ou refino e repetir.<br>Fase 3: usar ilhas como base estável de lucro e caixa.<br>Fase 4: reinvestir parte fixa do lucro e parar de operar item ruim.`);
  }

  const AlbionTrader = { calcCraft, calcRefine, calcIsland, calcTransport, calcWealth };
  window.AlbionTrader = AlbionTrader;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    const page = document.body.dataset.page;
    if (page === 'dashboard') initDashboard();
    if (page === 'admin') initAdmin();
  });
})();
