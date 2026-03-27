(function () {
  const DEFAULT_FEE = 6.5;
  const STORAGE_KEY = 'albionTraderSession';
  const SAFE_LOCATIONS = ['Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const RED_LOCATIONS = [...SAFE_LOCATIONS, 'Caerleon'];
  const ALL_LOCATIONS = [...RED_LOCATIONS];
  const TEST_USER = {
    nome: 'Wilker',
    email: 'teste@albiontrader.local',
    admin: true,
    licencaExpiraEm: '2027-12-31T00:00:00.000Z'
  };
  const opportunityState = { list: [], sortKey: 'totalSafeProfit', sortDir: 'desc', lastMode: 'popular' };

  const ITEM_CATALOG = {
    'Bolsas e capas': {
      'Bolsas': [
        { label: 'Bolsa', template: 'T{tier}_BAG', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Capas comuns': [
        { label: 'Capa', template: 'T{tier}_CAPE', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Capas especiais': [
        { label: 'Capa de Contrabandista', template: 'T{tier}_CAPEITEM_SMUGGLER', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capa de Morgana', template: 'T{tier}_CAPEITEM_MORGANA', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capa de Mortos-vivos', template: 'T{tier}_CAPEITEM_UNDEAD', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capa de Herege', template: 'T{tier}_CAPEITEM_HERETIC', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Capas de cidade': [
        { label: 'Capa de Caerleon', template: 'T{tier}_CAPEITEM_FW_CAERLEON', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capa de Bridgewatch', template: 'T{tier}_CAPEITEM_FW_BRIDGEWATCH', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capa de Fort Sterling', template: 'T{tier}_CAPEITEM_FW_FORTSTERLING', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capa de Lymhurst', template: 'T{tier}_CAPEITEM_FW_LYMHURST', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capa de Martlock', template: 'T{tier}_CAPEITEM_FW_MARTLOCK', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capa de Thetford', template: 'T{tier}_CAPEITEM_FW_THETFORD', qualities: true, enchants: [0,1,2,3,4] }
      ]
    },
    'Recursos brutos': {
      'Coleta': [
        { label: 'Madeira bruta', template: 'T{tier}_WOOD', qualities: false, enchants: [0] },
        { label: 'Fibra bruta', template: 'T{tier}_FIBER', qualities: false, enchants: [0] },
        { label: 'Minério bruto', template: 'T{tier}_ORE', qualities: false, enchants: [0] },
        { label: 'Couro bruto', template: 'T{tier}_HIDE', qualities: false, enchants: [0] },
        { label: 'Pedra bruta', template: 'T{tier}_ROCK', qualities: false, enchants: [0] }
      ]
    },
    'Recursos refinados': {
      'Refino': [
        { label: 'Tábuas', template: 'T{tier}_PLANKS', qualities: false, enchants: [0,1,2,3,4] },
        { label: 'Tecido', template: 'T{tier}_CLOTH', qualities: false, enchants: [0,1,2,3,4] },
        { label: 'Barra de metal', template: 'T{tier}_METALBAR', qualities: false, enchants: [0,1,2,3,4] },
        { label: 'Couro refinado', template: 'T{tier}_LEATHER', qualities: false, enchants: [0,1,2,3,4] },
        { label: 'Bloco de pedra', template: 'T{tier}_STONEBLOCK', qualities: false, enchants: [0,1,2,3,4] }
      ]
    },
    'Armadura de placa': {
      'Capuzes e elmos': [
        { label: 'Capuz de soldado', template: 'T{tier}_HEAD_PLATE_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capuz de guardião', template: 'T{tier}_HEAD_PLATE_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capuz de cavaleiro', template: 'T{tier}_HEAD_PLATE_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Armaduras': [
        { label: 'Armadura de soldado', template: 'T{tier}_ARMOR_PLATE_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Armadura de guardião', template: 'T{tier}_ARMOR_PLATE_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Armadura de cavaleiro', template: 'T{tier}_ARMOR_PLATE_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Botas': [
        { label: 'Botas de soldado', template: 'T{tier}_SHOES_PLATE_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Botas de guardião', template: 'T{tier}_SHOES_PLATE_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Botas de cavaleiro', template: 'T{tier}_SHOES_PLATE_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ]
    },
    'Armadura de couro': {
      'Capuzes': [
        { label: 'Capuz de mercenário', template: 'T{tier}_HEAD_LEATHER_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capuz de caçador', template: 'T{tier}_HEAD_LEATHER_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capuz de assassino', template: 'T{tier}_HEAD_LEATHER_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Casacos': [
        { label: 'Casaco de mercenário', template: 'T{tier}_ARMOR_LEATHER_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Casaco de caçador', template: 'T{tier}_ARMOR_LEATHER_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Casaco de assassino', template: 'T{tier}_ARMOR_LEATHER_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Botas': [
        { label: 'Botas de mercenário', template: 'T{tier}_SHOES_LEATHER_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Botas de caçador', template: 'T{tier}_SHOES_LEATHER_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Botas de assassino', template: 'T{tier}_SHOES_LEATHER_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ]
    },
    'Armadura de pano': {
      'Capuzes': [
        { label: 'Capuz de estudioso', template: 'T{tier}_HEAD_CLOTH_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capuz de clérigo', template: 'T{tier}_HEAD_CLOTH_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Capuz de mago', template: 'T{tier}_HEAD_CLOTH_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Túnicas': [
        { label: 'Túnica de estudioso', template: 'T{tier}_ARMOR_CLOTH_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Túnica de clérigo', template: 'T{tier}_ARMOR_CLOTH_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Túnica de mago', template: 'T{tier}_ARMOR_CLOTH_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Sandálias': [
        { label: 'Sandálias de estudioso', template: 'T{tier}_SHOES_CLOTH_SET1', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Sandálias de clérigo', template: 'T{tier}_SHOES_CLOTH_SET2', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Sandálias de mago', template: 'T{tier}_SHOES_CLOTH_SET3', qualities: true, enchants: [0,1,2,3,4] }
      ]
    },
    'Armas': {
      'Lanças': [
        { label: 'Lança', template: 'T{tier}_MAIN_SPEAR', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Arpão', template: 'T{tier}_2H_HARPOON', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Machados': [
        { label: 'Machado de batalha', template: 'T{tier}_MAIN_AXE', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Machado grande', template: 'T{tier}_2H_AXE', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Alabarda', template: 'T{tier}_2H_HALBERD', qualities: true, enchants: [0,1,2,3,4] }
      ],
      'Arcos': [
        { label: 'Arco', template: 'T{tier}_2H_BOW', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Arco longo', template: 'T{tier}_2H_LONGBOW', qualities: true, enchants: [0,1,2,3,4] },
        { label: 'Arco sussurrante', template: 'T{tier}_2H_BOW_HELL', qualities: true, enchants: [0,1,2,3,4] }
      ]
    },
    'Consumíveis': {
      'Comidas': [
        { label: 'Omelete', template: 'T{tier}_MEAL_OMELETTE', qualities: true, enchants: [0] },
        { label: 'Ensopado', template: 'T{tier}_MEAL_STEW', qualities: true, enchants: [0] },
        { label: 'Sopa', template: 'T{tier}_MEAL_SOUP', qualities: true, enchants: [0] }
      ],
      'Poções': [
        { label: 'Poção venenosa', template: 'T{tier}_POTION_POISON', qualities: true, enchants: [0] },
        { label: 'Poção de cura', template: 'T{tier}_POTION_HEAL', qualities: true, enchants: [0] },
        { label: 'Poção de resistência', template: 'T{tier}_POTION_REVIVE', qualities: true, enchants: [0] }
      ]
    }
  };

  function getSession() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
  }
  function saveSession(payload) { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); }
  function clearSession() { localStorage.removeItem(STORAGE_KEY); }

  function ensureTestSession() {
    const session = getSession();
    if (session?.user) return session;
    const next = { token: 'test-mode', user: TEST_USER };
    saveSession(next);
    return next;
  }

  async function api(url, options = {}) {
    ensureTestSession();
    const session = getSession();
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (session?.token) headers.Authorization = `Bearer ${session.token}`;
    const response = await fetch(url, Object.assign({}, options, { headers }));
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Erro na requisição.');
    return data;
  }

  function requireAuth() {
    const page = document.body.dataset.page;
    if (!page) return Promise.resolve(null);
    ensureTestSession();
    return Promise.resolve(TEST_USER);
  }

  function bindLogout() {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      clearSession();
      ensureTestSession();
      window.location.href = '/dashboard.html';
    });
  }

  function activateSection(targetId) {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.page-section');
    navItems.forEach((i) => i.classList.toggle('active', i.dataset.target === targetId));
    sections.forEach((s) => s.classList.toggle('active', s.id === targetId));
  }

  function bindNav() {
    document.querySelectorAll('[data-target]').forEach((item) => item.addEventListener('click', () => activateSection(item.dataset.target)));
    document.querySelectorAll('[data-admin-target]').forEach((item) => item.addEventListener('click', () => {
      const targetId = item.dataset.adminTarget;
      document.querySelectorAll('.nav-item[data-admin-target]').forEach(btn => btn.classList.toggle('active', btn.dataset.adminTarget === targetId));
      document.querySelectorAll('.page-section').forEach(sec => sec.classList.toggle('active', sec.id === targetId));
    }));
  }

  function formatSilver(value) { return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0)); }
  function formatPercent(value) { return `${(value || 0).toFixed(1)}%`; }
  function qualityLabel(q) { return ({1:'Normal',2:'Bom',3:'Excelente',4:'Excepcional',5:'Obra-prima'})[Number(q)] || 'Normal'; }
  function strategyLabel(mode) { return ({direct:'Revenda direta', buy:'Pedido de compra', best:'Melhor dos dois'})[mode] || 'Melhor dos dois'; }
  function formatBrazilTime(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000) return '—';
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(date);
  }
  function parseTime(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000) return null;
    return date;
  }
  function hoursSince(date) { return !date ? Infinity : (Date.now() - date.getTime()) / 36e5; }
  function setStatus(text, positive = true) {
    const badge = document.getElementById('apiStatusBadge');
    if (!badge) return;
    badge.textContent = text;
    badge.classList.toggle('status-warning', !positive);
  }
  function setProgress(percent, text) {
    const bar = document.getElementById('marketProgressBar');
    const line = document.getElementById('marketProgressText');
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    if (line) line.textContent = text;
  }
  function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a,b)=>a-b);
    const mid = Math.floor(sorted.length/2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid-1] + sorted[mid]) / 2;
  }
  function classifyItem(itemId) {
    const id = String(itemId || '').toUpperCase();
    if (/(WOOD|FIBER|ORE|HIDE|ROCK)$/.test(id)) return 'raw';
    if (/(PLANKS|CLOTH|METALBAR|LEATHER|STONEBLOCK)/.test(id)) return 'refined';
    if (/(BAG|CAPE)/.test(id)) return 'bagcape';
    if (/(MEAL|POTION)/.test(id)) return 'consumable';
    return 'gear';
  }
  function outlierBounds(category) {
    return {
      raw: [0.55, 1.8],
      refined: [0.45, 2.0],
      bagcape: [0.35, 1.9],
      consumable: [0.4, 2.0],
      gear: [0.35, 2.2]
    }[category] || [0.35, 2.0];
  }
  function pickFreshestBySide(rows) {
    const best = { sell: null, buy: null };
    rows.forEach((row) => {
      const sell = Number(row.sell_price_min || 0);
      const buy = Number(row.buy_price_max || 0);
      const sellDate = parseTime(row.sell_price_min_date);
      const buyDate = parseTime(row.buy_price_max_date);
      if (sell > 0 && hoursSince(sellDate) <= 24) {
        if (!best.sell || sell < best.sell.sell_price_min || (sell === best.sell.sell_price_min && sellDate > parseTime(best.sell.sell_price_min_date))) {
          best.sell = row;
        }
      }
      if (buy > 0 && hoursSince(buyDate) <= 24) {
        if (!best.buy || buy > best.buy.buy_price_max || (buy === best.buy.buy_price_max && buyDate > parseTime(best.buy.buy_price_max_date))) {
          best.buy = row;
        }
      }
    });
    return best;
  }

  function sanitizeRows(rows) {
    const grouped = new Map();
    (rows || []).forEach((row) => {
      const itemId = row.item_id;
      const city = row.city;
      const quality = Number(row.quality || 1);
      if (!itemId || !city) return;
      const key = `${itemId}|${quality}|${city}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(row);
    });

    const cityRows = [];
    grouped.forEach((list) => {
      const picked = pickFreshestBySide(list);
      const base = list[0];
      cityRows.push({
        item_id: base.item_id,
        quality: Number(base.quality || 1),
        city: base.city,
        sell_price_min: Number(picked.sell?.sell_price_min || 0),
        sell_price_min_date: picked.sell?.sell_price_min_date || null,
        buy_price_max: Number(picked.buy?.buy_price_max || 0),
        buy_price_max_date: picked.buy?.buy_price_max_date || null
      });
    });

    const byItemQuality = new Map();
    cityRows.forEach((row) => {
      const key = `${row.item_id}|${row.quality}`;
      if (!byItemQuality.has(key)) byItemQuality.set(key, []);
      byItemQuality.get(key).push(row);
    });

    const cleaned = [];
    byItemQuality.forEach((list, key) => {
      const category = classifyItem(list[0].item_id);
      const [minMul, maxMul] = outlierBounds(category);
      const sellValues = list.map(r => r.sell_price_min).filter(v => v > 0);
      const buyValues = list.map(r => r.buy_price_max).filter(v => v > 0);
      const sellMedian = median(sellValues);
      const buyMedian = median(buyValues);

      list.forEach((row) => {
        const sellOk = row.sell_price_min > 0 && sellMedian > 0 && row.sell_price_min >= sellMedian * minMul && row.sell_price_min <= sellMedian * maxMul;
        const buyOk = row.buy_price_max > 0 && buyMedian > 0 && row.buy_price_max >= buyMedian * minMul && row.buy_price_max <= buyMedian * maxMul;
        if (sellOk || buyOk) cleaned.push(row);
      });
    });

    return cleaned;
  }

  function confidenceLabel(validCities, bestMargin, strategy) {
    if (validCities >= 5 && bestMargin >= 10) return 'Alta';
    if (validCities >= 4 && bestMargin >= 6) return 'Boa';
    if (validCities >= 3 && bestMargin >= 3) return 'Média';
    if (strategy === 'buy' && validCities >= 2 && bestMargin >= 2) return 'Média';
    return 'Baixa';
  }
  function confidenceScore(label) { return { Alta:4, Boa:3, Média:2, Baixa:1 }[label] || 0; }
  function currentRouteMode() { return document.getElementById('marketRoute')?.value || 'safe'; }
  function currentLocations() {
    const route = currentRouteMode();
    if (route === 'safe') return SAFE_LOCATIONS;
    return RED_LOCATIONS;
  }
  function currentSellMode() { return document.getElementById('marketSellMode')?.value || 'best'; }
  function currentItemSellMode() { return document.getElementById('itemSellMode')?.value || currentSellMode(); }
  function currentServer() { return document.getElementById('marketServer')?.value || 'west'; }

  function estimateSafeUnits({ itemId, buyPrice, capital, profile }) {
    const category = classifyItem(itemId);
    const caps = {
      raw: 9999,
      refined: 4999,
      bagcape: 300,
      consumable: 1000,
      gear: 120
    };
    let factor = profile === 'max' ? 1 : profile === 'consistent' ? 0.35 : 0.6;
    const capitalUnits = Math.floor(capital / Math.max(1, buyPrice));
    return Math.max(1, Math.min(capitalUnits, Math.floor((caps[category] || 100) * factor)));
  }

  function prettyItemName(itemId) {
    const id = String(itemId || '').toUpperCase();
    for (const family of Object.values(ITEM_CATALOG)) {
      for (const group of Object.values(family)) {
        for (const item of group) {
          const m = item.template.match(/^T\{tier\}_(.+)$/);
          if (!m) continue;
          const core = m[1];
          const idCore = id.replace(/^T\d_/, '').replace(/@\d$/, '');
          if (idCore === core) {
            const tier = id.match(/^T(\d)_/)?.[1] || '';
            const enchant = id.match(/@(\d)$/)?.[1];
            return `${item.label} T${tier}${enchant && enchant !== '0' ? `.${enchant}` : ''}`;
          }
        }
      }
    }
    return id;
  }

  function buildItemId(template, tier, enchant) {
    const base = template.replace('{tier}', tier);
    return String(enchant) !== '0' ? `${base}@${enchant}` : base;
  }

  function analyzeItem(rows, feePct = DEFAULT_FEE, sellMode = 'best') {
    const cleaned = sanitizeRows(rows);
    const byCity = new Map();
    cleaned.forEach((row) => byCity.set(row.city, row));
    const cities = [...byCity.values()];
    const validSells = cities.filter(r => r.sell_price_min > 0);
    if (!validSells.length) return { ok:false, reason:'Sem preços de venda confiáveis.' };

    let best = null;
    validSells.forEach((buyRow) => {
      const buyPrice = buyRow.sell_price_min;
      cities.forEach((sellRow) => {
        if (sellRow.city === buyRow.city) return;
        const directNet = sellRow.sell_price_min > 0 ? sellRow.sell_price_min * (1 - feePct / 100) : 0;
        const buyNet = sellRow.buy_price_max > 0 ? sellRow.buy_price_max * (1 - feePct / 100) : 0;
        const strategies = [];
        if (sellMode === 'direct' || sellMode === 'best') strategies.push({ mode:'direct', gross:sellRow.sell_price_min, net: directNet, date:sellRow.sell_price_min_date });
        if (sellMode === 'buy' || sellMode === 'best') strategies.push({ mode:'buy', gross:sellRow.buy_price_max, net: buyNet, date:sellRow.buy_price_max_date });
        strategies.forEach((strategy) => {
          if (!strategy.gross || strategy.net <= 0) return;
          const profit = strategy.net - buyPrice;
          const margin = buyPrice > 0 ? (profit / buyPrice) * 100 : 0;
          if (!best || profit > best.profit) {
            best = {
              buyCity: buyRow.city,
              buyPrice,
              buyUpdatedAt: buyRow.sell_price_min_date,
              sellCity: sellRow.city,
              sellPrice: strategy.gross,
              netSell: strategy.net,
              sellUpdatedAt: strategy.date,
              profit,
              margin,
              strategy: strategy.mode,
              cleaned
            };
          }
        });
      });
    });

    if (!best) return { ok:false, reason:'Sem rota de venda confiável.' };
    const validCities = cities.filter(r => r.sell_price_min > 0 || r.buy_price_max > 0).length;
    const confidence = confidenceLabel(validCities, best.margin, best.strategy);
    return Object.assign({ ok:true, validCities, confidence, confidenceScore: confidenceScore(confidence) }, best);
  }

  function buildOpportunities(rows, capital, profile, feePct, route, sellMode) {
    const byItem = new Map();
    sanitizeRows(rows).forEach((row) => {
      const key = `${row.item_id}|${row.quality || 1}`;
      if (!byItem.has(key)) byItem.set(key, []);
      byItem.get(key).push(row);
    });

    const opportunities = [];
    byItem.forEach((list) => {
      const analysis = analyzeItem(list, feePct, sellMode);
      if (!analysis.ok) return;
      if (analysis.profit <= 0 || analysis.margin < 2 || analysis.confidenceScore < 2) return;
      if (route === 'safe' && (analysis.buyCity === 'Caerleon' || analysis.sellCity === 'Caerleon')) return;
      const safeUnits = estimateSafeUnits({ itemId: list[0].item_id, buyPrice: analysis.buyPrice, capital, profile });
      const totalSafeProfit = analysis.profit * safeUnits;
      opportunities.push({
        itemId: list[0].item_id,
        itemName: prettyItemName(list[0].item_id),
        quality: qualityLabel(list[0].quality || 1),
        buyCity: analysis.buyCity,
        buyPrice: analysis.buyPrice,
        buyUpdatedAt: analysis.buyUpdatedAt,
        sellCity: analysis.sellCity,
        sellPrice: analysis.sellPrice,
        sellUpdatedAt: analysis.sellUpdatedAt,
        profit: analysis.profit,
        margin: analysis.margin,
        safeUnits,
        totalSafeProfit,
        confidence: analysis.confidence,
        confidenceScore: analysis.confidenceScore,
        strategy: strategyLabel(analysis.strategy)
      });
    });

    return opportunities.sort((a,b) => b.totalSafeProfit - a.totalSafeProfit);
  }

  function injectSellModeSelectors() {
    const filters = document.querySelector('.market-filters-grid');
    if (filters && !document.getElementById('marketSellMode')) {
      const label = document.createElement('label');
      label.innerHTML = `<span>Modo de venda</span><select id="marketSellMode"><option value="best">Melhor dos dois</option><option value="direct">Revenda direta</option><option value="buy">Pedido de compra atual</option></select>`;
      filters.appendChild(label);
    }
    const radarGrid = document.querySelector('.radar-grid');
    if (radarGrid && !document.getElementById('itemSellMode')) {
      const label = document.createElement('label');
      label.innerHTML = `<span>Saída</span><select id="itemSellMode"><option value="best">Melhor dos dois</option><option value="direct">Revenda direta</option><option value="buy">Pedido de compra atual</option></select>`;
      radarGrid.appendChild(label);
    }
    const route = document.getElementById('marketRoute');
    if (route) {
      route.innerHTML = `<option value="safe">Somente zona azul/amarela</option><option value="red">Aceita RED + Caerleon</option>`;
    }
  }

  function allCatalogItems({ full = false } = {}) {
    const list = [];
    Object.values(ITEM_CATALOG).forEach((groups) => {
      Object.values(groups).forEach((items) => {
        items.forEach((item) => {
          const tiers = full ? [4,5,6,7,8] : [4,5,6];
          const enchants = full ? (item.enchants || [0]) : [0];
          tiers.forEach((tier) => {
            enchants.forEach((enchant) => list.push(buildItemId(item.template, tier, enchant)));
          });
        });
      });
    });
    return [...new Set(list)];
  }

  async function queryPrices(items, qualities, locations) {
    const chunks = [];
    const size = 40;
    for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
    const all = [];
    for (let i = 0; i < chunks.length; i++) {
      setProgress(10 + Math.round((i / Math.max(1, chunks.length)) * 60), `Consultando lote ${i + 1} de ${chunks.length}...`);
      const data = await api(`/api/albion-prices?items=${encodeURIComponent(chunks[i].join(','))}&locations=${encodeURIComponent(locations.join(','))}&qualities=${encodeURIComponent(qualities.join(','))}&server=${currentServer()}`);
      all.push(...(data.data || []));
    }
    return all;
  }

  async function loadMarket() {
    const box = document.getElementById('marketResult');
    const directInput = document.getElementById('marketItemId');
    const family = document.getElementById('itemFamily')?.value;
    const group = document.getElementById('itemGroup')?.value;
    const itemIndex = Number(document.getElementById('itemSelect')?.value || 0);
    const tier = document.getElementById('itemTier')?.value || '4';
    const enchant = document.getElementById('itemEnchant')?.value || '0';
    const quality = Number(document.getElementById('itemQuality')?.value || 1);
    const sellMode = currentItemSellMode();
    try {
      box.textContent = 'Consultando item...';
      const chosen = directInput?.value?.trim() ? { label: directInput.value.trim(), id: directInput.value.trim() } : null;
      const selected = chosen || (() => {
        const item = ITEM_CATALOG[family]?.[group]?.[itemIndex];
        return item ? { label: item.label, id: buildItemId(item.template, tier, enchant) } : null;
      })();
      if (!selected) throw new Error('Selecione um item válido.');
      const rows = await queryPrices([selected.id], [quality], currentLocations());
      const analysis = analyzeItem(rows, DEFAULT_FEE, sellMode);
      if (!analysis.ok) {
        box.innerHTML = `<div class="warning-box">${analysis.reason}</div>`;
        return;
      }
      const itemName = prettyItemName(selected.id);
      const cityRows = sanitizeRows(rows).filter(r => r.item_id === selected.id && Number(r.quality || 1) === quality).sort((a,b) => a.city.localeCompare(b.city));
      box.innerHTML = `
        ${analysis.profit <= 0 ? `<div class="warning-box">Sem arbitragem lucrativa no momento para <strong>${itemName}</strong>. O mercado foi lido corretamente, mas a melhor rota válida ainda dá prejuízo ou margem fraca.</div>` : ''}
        <div><strong>${itemName}</strong></div>
        <div>Cidade mais barata para comprar: <strong>${analysis.buyCity}</strong></div>
        <div>Valor de compra: <strong>${formatSilver(analysis.buyPrice)}</strong> prata</div>
        <div>Melhor cidade para vender: <strong>${analysis.sellCity}</strong></div>
        <div>Saída usada: <strong>${strategyLabel(analysis.strategy)}</strong></div>
        <div>Preço bruto de saída: <strong>${formatSilver(analysis.sellPrice)}</strong> prata</div>
        <div>Venda líquida estimada após taxa: <strong>${formatSilver(analysis.netSell)}</strong> prata</div>
        <div>Lucro líquido estimado por unidade: <strong>${formatSilver(analysis.profit)}</strong> prata</div>
        <div>Margem estimada: <strong>${formatPercent(analysis.margin)}</strong></div>
        <div>Qualidade analisada: <strong>${qualityLabel(quality)}</strong></div>
        <div>Confiança: <strong>${analysis.confidence}</strong></div>
        <div>Servidor consultado: <strong>Americas</strong></div>
        <div class="table-wrap" style="margin-top:16px">
          <table class="data-table">
            <thead><tr><th>Cidade</th><th>Menor preço de venda</th><th>Maior pedido de compra</th><th>Atualização venda (Brasil)</th><th>Atualização compra (Brasil)</th></tr></thead>
            <tbody>
              ${cityRows.map(r => `<tr><td>${r.city}</td><td>${r.sell_price_min ? formatSilver(r.sell_price_min) : '—'}</td><td>${r.buy_price_max ? formatSilver(r.buy_price_max) : '—'}</td><td>${formatBrazilTime(r.sell_price_min_date)}</td><td>${formatBrazilTime(r.buy_price_max_date)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>`;
      setStatus(`AlbionData online · item ${itemName}`, true);
    } catch (error) {
      box.innerHTML = `<div class="warning-box">${error.message}</div>`;
      setStatus('Falha ao consultar item', false);
    }
  }

  async function loadOpportunityRadar(mode = 'popular') {
    const box = document.getElementById('opportunityResult');
    if (!box) return;
    const capital = Number(document.getElementById('marketCapital')?.value || 0) || 3000000;
    const profile = document.getElementById('marketProfile')?.value || 'balanced';
    const route = currentRouteMode();
    const sellMode = currentSellMode();
    const locations = currentLocations();
    const items = mode === 'all' ? allCatalogItems({ full: true }) : allCatalogItems({ full: false });
    const qualities = [1,2,3,4,5];
    opportunityState.lastMode = mode;
    box.textContent = 'Consultando mercado...';
    setProgress(5, 'Preparando consulta do mercado...');
    setStatus(`AlbionData consultando ${mode === 'all' ? 'mercado completo' : 'itens populares'}`, true);
    try {
      const rows = await queryPrices(items, qualities, locations);
      setProgress(80, 'Filtrando preços ruins e montando scanner...');
      const opportunities = buildOpportunities(rows, capital, profile, DEFAULT_FEE, route, sellMode).slice(0, 120);
      opportunityState.list = opportunities;
      opportunityState.sortKey = 'totalSafeProfit';
      opportunityState.sortDir = 'desc';
      if (!opportunities.length) {
        box.innerHTML = '<div class="warning-box">Nenhuma oportunidade confiável apareceu agora. Isso significa que o filtro descartou spreads ruins, dados velhos ou preços absurdos.</div>';
        setProgress(100, 'Varredura concluída · sem oportunidade confiável');
        setStatus('Sem oportunidade confiável agora', false);
        return;
      }
      const best = opportunities[0];
      document.getElementById('bestOpportunityName').textContent = `${best.itemName} · ${best.quality}`;
      document.getElementById('bestOpportunityText').textContent = `Comprar em ${best.buyCity}, vender em ${best.sellCity} via ${best.strategy.toLowerCase()} e mirar ${formatSilver(best.totalSafeProfit)} de lucro total seguro.`;
      document.getElementById('priorityPlan').innerHTML = `Melhor rota agora: <strong>${best.itemName}</strong> · <strong>${best.quality}</strong>.<br>Compre em <strong>${best.buyCity}</strong> por <strong>${formatSilver(best.buyPrice)}</strong> e venda em <strong>${best.sellCity}</strong> usando <strong>${best.strategy.toLowerCase()}</strong> por <strong>${formatSilver(best.sellPrice)}</strong>.<br>Quantidade segura estimada: <strong>${formatSilver(best.safeUnits)}</strong>. Lucro por unidade: <strong>${formatSilver(best.profit)}</strong>. Lucro total seguro: <strong>${formatSilver(best.totalSafeProfit)}</strong>.`;
      renderOpportunityTable();
      setProgress(100, `Varredura concluída · ${opportunities.length} oportunidades confiáveis`);
      setStatus(`AlbionData online · ${opportunities.length} oportunidades confiáveis`, true);
    } catch (error) {
      box.innerHTML = `<div class="warning-box">${error.message}</div>`;
      setProgress(100, 'Falha ao consultar o mercado.');
      setStatus('Falha ao consultar o mercado', false);
    }
  }

  function getSortArrow(key) {
    if (opportunityState.sortKey !== key) return '↕';
    return opportunityState.sortDir === 'asc' ? '↑' : '↓';
  }
  function sortOpportunitiesBy(key) {
    if (opportunityState.sortKey === key) opportunityState.sortDir = opportunityState.sortDir === 'asc' ? 'desc' : 'asc';
    else { opportunityState.sortKey = key; opportunityState.sortDir = 'desc'; }
    renderOpportunityTable();
  }
  function renderOpportunityTable() {
    const box = document.getElementById('opportunityResult');
    if (!box) return;
    const list = [...opportunityState.list];
    if (!list.length) { box.innerHTML = '<div class="warning-box">Nenhuma oportunidade carregada.</div>'; return; }
    const key = opportunityState.sortKey;
    const dir = opportunityState.sortDir === 'asc' ? 1 : -1;
    list.sort((a,b) => typeof a[key] === 'string' ? a[key].localeCompare(b[key], 'pt-BR') * dir : ((a[key] || 0) - (b[key] || 0)) * dir);
    box.innerHTML = `
      <div class="table-wrap"><table class="data-table sortable-table">
      <thead><tr>
        <th>Item</th><th>Qualidade</th><th>Comprar em</th><th><button class="sort-btn" data-sort="buyPrice">Custo ${getSortArrow('buyPrice')}</button></th><th>Vender em</th><th>Saída</th><th><button class="sort-btn" data-sort="sellPrice">Preço ${getSortArrow('sellPrice')}</button></th><th><button class="sort-btn" data-sort="profit">Lucro/unid. ${getSortArrow('profit')}</button></th><th><button class="sort-btn" data-sort="safeUnits">Qtde segura ${getSortArrow('safeUnits')}</button></th><th><button class="sort-btn" data-sort="totalSafeProfit">Lucro total ${getSortArrow('totalSafeProfit')}</button></th><th><button class="sort-btn" data-sort="margin">Margem ${getSortArrow('margin')}</button></th><th><button class="sort-btn" data-sort="confidenceScore">Confiança ${getSortArrow('confidenceScore')}</button></th></tr></thead>
      <tbody>${list.map(op => `<tr><td>${op.itemName}</td><td>${op.quality}</td><td>${op.buyCity}</td><td>${formatSilver(op.buyPrice)}</td><td>${op.sellCity}</td><td>${op.strategy}</td><td>${formatSilver(op.sellPrice)}</td><td>${formatSilver(op.profit)}</td><td>${formatSilver(op.safeUnits)}</td><td>${formatSilver(op.totalSafeProfit)}</td><td>${formatPercent(op.margin)}</td><td>${op.confidence}</td></tr>`).join('')}</tbody></table></div>`;
    box.querySelectorAll('.sort-btn').forEach((btn) => btn.addEventListener('click', () => sortOpportunitiesBy(btn.dataset.sort)));
  }

  function populateItemSelectors() {
    const familyEl = document.getElementById('itemFamily');
    const groupEl = document.getElementById('itemGroup');
    const itemEl = document.getElementById('itemSelect');
    if (!familyEl || !groupEl || !itemEl) return;
    familyEl.innerHTML = Object.keys(ITEM_CATALOG).map(f => `<option value="${f}">${f}</option>`).join('');
    function updateGroups() {
      const groups = Object.keys(ITEM_CATALOG[familyEl.value] || {});
      groupEl.innerHTML = groups.map(g => `<option value="${g}">${g}</option>`).join('');
      updateItems();
    }
    function updateItems() {
      const items = ITEM_CATALOG[familyEl.value]?.[groupEl.value] || [];
      itemEl.innerHTML = items.map((it, idx) => `<option value="${idx}">${it.label}</option>`).join('');
    }
    familyEl.addEventListener('change', updateGroups);
    groupEl.addEventListener('change', updateItems);
    updateGroups();
  }

  function setHtml(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
  function calcCraft() {
    const level = Number(document.getElementById('craftLevel')?.value || 0);
    const cost = Number(document.getElementById('craftCost')?.value || 0);
    const sell = Number(document.getElementById('craftSell')?.value || 0);
    const fee = sell * (DEFAULT_FEE / 100);
    const profit = sell - fee - cost;
    const margin = cost > 0 ? (profit / cost) * 100 : 0;
    setHtml('craftResult', `Craft manual estável.<br>Nível informado: <strong>${level}</strong><br>Lucro líquido estimado: <strong>${formatSilver(profit)}</strong> prata<br>Margem: <strong>${formatPercent(margin)}</strong><br><span class="muted">Nesta fase do plano, o craft ficou congelado e estável enquanto o scanner de mercado é blindado.</span>`);
  }
  function calcRefine() {
    const cost = Number(document.getElementById('refineCost')?.value || 0);
    const sell = Number(document.getElementById('refineSell')?.value || 0);
    const profit = sell * (1 - DEFAULT_FEE / 100) - cost;
    setHtml('refineResult', `Lucro líquido estimado no refino: <strong>${formatSilver(profit)}</strong> prata`);
  }
  function calcIsland() { setHtml('islandResult', 'Módulo de ilhas congelado nesta fase para focar no mercado.'); }
  function calcTransport() {
    const buy = Number(document.getElementById('transportBuyPrice')?.value || 0);
    const sell = Number(document.getElementById('transportSellPrice')?.value || 0);
    const extra = Number(document.getElementById('transportCost')?.value || 0);
    const profit = sell * (1 - DEFAULT_FEE / 100) - buy - extra;
    setHtml('transportResult', `Lucro estimado no transporte: <strong>${formatSilver(profit)}</strong> prata`);
  }
  function calcWealth() { setHtml('wealthResult', 'Planejador congelado nesta fase. Primeiro vamos blindar mercado e radar.'); }

  async function initDashboard() {
    const user = await requireAuth();
    if (!user) return;
    const welcomeTitle = document.getElementById('welcomeTitle');
    const licenseDate = document.getElementById('licenseDate');
    if (welcomeTitle) welcomeTitle.textContent = `Olá, ${user.nome || user.email}`;
    if (licenseDate) licenseDate.textContent = new Date(user.licencaExpiraEm).toLocaleDateString('pt-BR');
    bindLogout();
    bindNav();
    injectSellModeSelectors();
    populateItemSelectors();
    document.getElementById('loadMarketBtn')?.addEventListener('click', loadMarket);
    document.getElementById('scanPopularBtn')?.addEventListener('click', () => loadOpportunityRadar('popular'));
    document.getElementById('scanAllBtn')?.addEventListener('click', () => loadOpportunityRadar('all'));
    setProgress(0, 'Pronto para varredura.');
    setStatus('Modo de teste ativo · sem login', true);
    loadOpportunityRadar('popular');
  }

  async function initAdmin() {
    const user = await requireAuth();
    if (!user) return;
    bindLogout();
    bindNav();
    const title = document.getElementById('adminTitle');
    if (title) title.textContent = `Painel admin — ${user.nome}`;
    try {
      const data = await api('/api/users');
      const tbody = document.getElementById('adminUsersTable');
      const count = document.getElementById('adminUserCount');
      const pending = document.getElementById('adminPendingCount');
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = data.notice || '';
      if (count) count.textContent = String((data.users || []).length);
      if (pending) pending.textContent = String((data.users || []).filter(u => u.primeiroAcesso).length);
      if (tbody) tbody.innerHTML = (data.users || []).map((u) => `<tr><td>${u.nome || '-'}</td><td>${u.email}</td><td>${u.telefone || '-'}</td><td>${u.admin ? 'Admin' : 'Usuário'}</td><td>${new Date(u.licencaExpiraEm).toLocaleDateString('pt-BR')}</td><td>${u.primeiroAcesso ? 'Primeiro acesso' : 'Ativo'}</td></tr>`).join('');
      const licTbody = document.getElementById('adminLicensesTable');
      if (licTbody) licTbody.innerHTML = (data.users || []).map((u) => {
        const days = Math.max(0, Math.ceil((new Date(u.licencaExpiraEm).getTime() - Date.now()) / 86400000));
        return `<tr><td>${u.nome || '-'}</td><td>${u.email}</td><td>${new Date(u.licencaExpiraEm).toLocaleDateString('pt-BR')}</td><td>${days}</td><td>${u.primeiroAcesso ? 'Primeiro acesso' : 'Ativa'}</td></tr>`;
      }).join('');
    } catch (error) {
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = error.message;
    }
  }

  function initIndex() {
    ensureTestSession();
    window.location.href = '/dashboard.html';
  }

  window.AlbionTrader = { calcCraft, calcRefine, calcIsland, calcTransport, calcWealth, loadOpportunityRadar, activateSection };
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'dashboard') initDashboard();
    else if (page === 'admin') initAdmin();
    else initIndex();
  });
})();
