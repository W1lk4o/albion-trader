
(function () {
  const STORAGE_KEY = 'albionTraderSession';
  const DEFAULT_LOCATIONS = ['Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford', 'Caerleon'];
  const SAFE_LOCATIONS = ['Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const BM_LOCATION = 'Black Market';
  const SERVER_HOSTS = {
    west: 'https://west.albion-online-data.com',
    europe: 'https://europe.albion-online-data.com',
    east: 'https://east.albion-online-data.com'
  };
  const DEFAULT_FEE = 6.5;
  const opportunityState = { list: [], sortKey: 'totalSafeProfit', sortDir: 'desc', lastMode: 'popular' };

  const ITEM_CATALOG = {
    'Bolsas e capas': {
      'Bolsas': [
        { label: 'Bolsa', template: 'T{tier}_BAG' }
      ],
      'Capas comuns': [
        { label: 'Capa', template: 'T{tier}_CAPE' }
      ],
      'Capas de cidade': [
        { label: 'Capa de Caerleon', template: 'T{tier}_CAPEITEM_FW_CAERLEON' },
        { label: 'Capa de Bridgewatch', template: 'T{tier}_CAPEITEM_FW_BRIDGEWATCH' },
        { label: 'Capa de Fort Sterling', template: 'T{tier}_CAPEITEM_FW_FORTSTERLING' },
        { label: 'Capa de Lymhurst', template: 'T{tier}_CAPEITEM_FW_LYMHURST' },
        { label: 'Capa de Martlock', template: 'T{tier}_CAPEITEM_FW_MARTLOCK' },
        { label: 'Capa de Thetford', template: 'T{tier}_CAPEITEM_FW_THETFORD' }
      ]
    },
    'Recursos brutos': {
      'Coleta': [
        { label: 'Madeira bruta', template: 'T{tier}_WOOD' },
        { label: 'Fibra bruta', template: 'T{tier}_FIBER' },
        { label: 'Minério bruto', template: 'T{tier}_ORE' },
        { label: 'Couro bruto', template: 'T{tier}_HIDE' },
        { label: 'Pedra bruta', template: 'T{tier}_ROCK' }
      ]
    },
    'Recursos refinados': {
      'Refino': [
        { label: 'Tábuas', template: 'T{tier}_PLANKS' },
        { label: 'Tecido', template: 'T{tier}_CLOTH' },
        { label: 'Barra de metal', template: 'T{tier}_METALBAR' },
        { label: 'Couro refinado', template: 'T{tier}_LEATHER' },
        { label: 'Bloco de pedra', template: 'T{tier}_STONEBLOCK' }
      ]
    },
    'Armadura de placa': {
      'Capuzes e elmos': [
        { label: 'Capuz de soldado', template: 'T{tier}_HEAD_PLATE_SET1' },
        { label: 'Capuz de guardião', template: 'T{tier}_HEAD_PLATE_SET2' },
        { label: 'Capuz de cavaleiro', template: 'T{tier}_HEAD_PLATE_SET3' }
      ],
      'Armaduras': [
        { label: 'Armadura de soldado', template: 'T{tier}_ARMOR_PLATE_SET1' },
        { label: 'Armadura de guardião', template: 'T{tier}_ARMOR_PLATE_SET2' },
        { label: 'Armadura de cavaleiro', template: 'T{tier}_ARMOR_PLATE_SET3' }
      ],
      'Botas': [
        { label: 'Botas de soldado', template: 'T{tier}_SHOES_PLATE_SET1' },
        { label: 'Botas de guardião', template: 'T{tier}_SHOES_PLATE_SET2' },
        { label: 'Botas de cavaleiro', template: 'T{tier}_SHOES_PLATE_SET3' }
      ]
    },
    'Armadura de couro': {
      'Capuzes': [
        { label: 'Capuz de mercenário', template: 'T{tier}_HEAD_LEATHER_SET1' },
        { label: 'Capuz de caçador', template: 'T{tier}_HEAD_LEATHER_SET2' },
        { label: 'Capuz de assassino', template: 'T{tier}_HEAD_LEATHER_SET3' }
      ],
      'Casacos': [
        { label: 'Casaco de mercenário', template: 'T{tier}_ARMOR_LEATHER_SET1' },
        { label: 'Casaco de caçador', template: 'T{tier}_ARMOR_LEATHER_SET2' },
        { label: 'Casaco de assassino', template: 'T{tier}_ARMOR_LEATHER_SET3' }
      ],
      'Botas': [
        { label: 'Botas de mercenário', template: 'T{tier}_SHOES_LEATHER_SET1' },
        { label: 'Botas de caçador', template: 'T{tier}_SHOES_LEATHER_SET2' },
        { label: 'Botas de assassino', template: 'T{tier}_SHOES_LEATHER_SET3' }
      ]
    },
    'Armadura de pano': {
      'Capuzes': [
        { label: 'Capuz de estudioso', template: 'T{tier}_HEAD_CLOTH_SET1' },
        { label: 'Capuz de clérigo', template: 'T{tier}_HEAD_CLOTH_SET2' },
        { label: 'Capuz de mago', template: 'T{tier}_HEAD_CLOTH_SET3' }
      ],
      'Túnicas': [
        { label: 'Túnica de estudioso', template: 'T{tier}_ARMOR_CLOTH_SET1' },
        { label: 'Túnica de clérigo', template: 'T{tier}_ARMOR_CLOTH_SET2' },
        { label: 'Túnica de mago', template: 'T{tier}_ARMOR_CLOTH_SET3' }
      ],
      'Sandálias': [
        { label: 'Sandálias de estudioso', template: 'T{tier}_SHOES_CLOTH_SET1' },
        { label: 'Sandálias de clérigo', template: 'T{tier}_SHOES_CLOTH_SET2' },
        { label: 'Sandálias de mago', template: 'T{tier}_SHOES_CLOTH_SET3' }
      ]
    },
    'Armas': {
      'Lanças': [
        { label: 'Lança', template: 'T{tier}_MAIN_SPEAR' },
        { label: 'Arpão', template: 'T{tier}_2H_HARPOON' },
        { label: 'Espírito de 1 mão', template: 'T{tier}_MAIN_SPEAR_KEEPER' }
      ],
      'Machados': [
        { label: 'Machado de batalha', template: 'T{tier}_MAIN_AXE' },
        { label: 'Machado grande', template: 'T{tier}_2H_AXE' },
        { label: 'Machadinha', template: 'T{tier}_2H_HALBERD' }
      ],
      'Arcos': [
        { label: 'Arco', template: 'T{tier}_2H_BOW' },
        { label: 'Arco longo', template: 'T{tier}_2H_LONGBOW' },
        { label: 'Arco sussurrante', template: 'T{tier}_2H_BOW_HELL' }
      ]
    },
    'Consumíveis': {
      'Comidas': [
        { label: 'Omelete', template: 'T{tier}_MEAL_OMELETTE' },
        { label: 'Ensopado', template: 'T{tier}_MEAL_STEW' },
        { label: 'Sopa', template: 'T{tier}_MEAL_SOUP' }
      ],
      'Poções': [
        { label: 'Poção venenosa', template: 'T{tier}_POTION_POISON' },
        { label: 'Poção de cura', template: 'T{tier}_POTION_HEAL' },
        { label: 'Poção de resistência', template: 'T{tier}_POTION_REVIVE' }
      ]
    }
  };

  const POPULAR_ITEMS = Array.from(new Set([
    'T4_BAG','T5_BAG','T6_BAG','T7_BAG',
    'T4_CAPE','T5_CAPE','T6_CAPE',
    'T4_WOOD','T5_WOOD','T6_WOOD','T4_FIBER','T5_FIBER','T6_FIBER',
    'T4_ORE','T5_ORE','T6_ORE','T4_HIDE','T5_HIDE','T6_HIDE','T4_ROCK','T5_ROCK',
    'T4_PLANKS','T5_PLANKS','T6_PLANKS','T4_CLOTH','T5_CLOTH','T6_CLOTH',
    'T4_METALBAR','T5_METALBAR','T6_METALBAR','T4_LEATHER','T5_LEATHER','T6_LEATHER',
    'T4_ARMOR_PLATE_SET1','T5_ARMOR_PLATE_SET1','T6_ARMOR_PLATE_SET1',
    'T4_SHOES_PLATE_SET1','T5_SHOES_PLATE_SET1','T6_SHOES_PLATE_SET1',
    'T4_ARMOR_LEATHER_SET2','T5_ARMOR_LEATHER_SET2','T6_ARMOR_LEATHER_SET2',
    'T4_SHOES_LEATHER_SET2','T5_SHOES_LEATHER_SET2','T6_SHOES_LEATHER_SET2',
    'T4_ARMOR_CLOTH_SET2','T5_ARMOR_CLOTH_SET2','T6_ARMOR_CLOTH_SET2',
    'T4_2H_BOW','T5_2H_BOW','T6_2H_BOW',
    'T4_MAIN_SPEAR','T5_MAIN_SPEAR','T6_MAIN_SPEAR',
    'T4_MAIN_AXE','T5_MAIN_AXE','T6_MAIN_AXE',
    'T4_POTION_POISON','T5_POTION_POISON','T6_POTION_POISON',
    'T4_MEAL_OMELETTE','T5_MEAL_OMELETTE','T6_MEAL_OMELETTE'
  ]));

  const ISLAND_CROPS = [
    { name: 'Cenoura', profit: 12000, risk: 'Baixo', note: 'ótima para começar e girar rápido' },
    { name: 'Feijão', profit: 15000, risk: 'Baixo', note: 'boa margem e giro estável' },
    { name: 'Trigo', profit: 17000, risk: 'Médio', note: 'boa combinação com produção de comida' },
    { name: 'Erva medicinal', profit: 21000, risk: 'Médio', note: 'mais lucro, mas depende mais do mercado' },
    { name: 'Abóbora', profit: 19000, risk: 'Médio', note: 'opção equilibrada para quem já tem capital' }
  ];

  const ISLAND_ANIMALS = [
    { name: 'Galinha T3', profit: 14000, feed: 3500, risk: 'Baixo', note: 'simples e boa para começar' },
    { name: 'Porco T5', profit: 22000, feed: 7000, risk: 'Médio', note: 'lucro interessante com alimentação barata' },
    { name: 'Cabra T6', profit: 24000, feed: 8500, risk: 'Médio', note: 'boa margem quando o mercado está aquecido' },
    { name: 'Cavalo T5', profit: 28000, feed: 12000, risk: 'Médio', note: 'bom para quem já tem mais giro' },
    { name: 'Boi T4', profit: 30000, feed: 14000, risk: 'Alto', note: 'mais capital preso, mas pode render bem' }
  ];

  function getDeviceId() {
    let deviceId = localStorage.getItem('albionTraderDeviceId');
    if (!deviceId) {
      deviceId = 'device-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('albionTraderDeviceId', deviceId);
    }
    return deviceId;
  }

  function saveSession(payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

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
      const data = await api('/api/login', { method: 'POST', body: JSON.stringify({ email, senha, deviceId: getDeviceId() }) });
      saveSession(data);
      window.location.href = data.user.admin ? '/admin' : '/dashboard';
    } catch (error) {
      message.textContent = error.message;
    }
  }

  async function requireAuth() {
    const page = document.body.dataset.page;
    if (!page) return null;
    const session = getSession();
    if (!session?.token) { window.location.href = '/'; return null; }
    try {
      const data = await api('/api/me');
      const user = data.user;
      if (page === 'admin' && !user.admin) { window.location.href = '/dashboard'; return null; }
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
    btn.addEventListener('click', () => { clearSession(); window.location.href = '/'; });
  }

  function activateSection(targetId) {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.page-section');
    navItems.forEach((i) => i.classList.toggle('active', i.dataset.target === targetId));
    sections.forEach((s) => s.classList.toggle('active', s.id === targetId));
  }

  function bindNav() {
    document.querySelectorAll('[data-target]').forEach((item) => item.addEventListener('click', () => activateSection(item.dataset.target)));
  }

  function formatSilver(value) {
    return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0));
  }

  function formatPercent(value) {
    return `${(value || 0).toFixed(1)}%`;
  }

  function formatBrazilTime(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  }

  function parseTime(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 2000) return null;
    return date;
  }

  function hoursSince(date) {
    if (!date) return Infinity;
    return (Date.now() - date.getTime()) / 36e5;
  }

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

  function sanitizeRows(rows) {
    const grouped = new Map();
    (rows || []).forEach((row) => {
      if (!row.city) return;
      if (!grouped.has(row.city)) grouped.set(row.city, []);
      grouped.get(row.city).push(row);
    });

    const cleaned = [];
    grouped.forEach((cityRows, city) => {
      // one row per city/item/quality expected, but keep latest/most complete
      cityRows.sort((a, b) => {
        const ta = parseTime(a.sell_price_min_date)?.getTime() || 0;
        const tb = parseTime(b.sell_price_min_date)?.getTime() || 0;
        return tb - ta;
      });
      cleaned.push(cityRows[0]);
    });

    const validSellValues = cleaned.map(r => Number(r.sell_price_min || 0)).filter(v => v > 0);
    const validBuyValues = cleaned.map(r => Number(r.buy_price_max || 0)).filter(v => v > 0);
    const sellMedian = median(validSellValues);
    const buyMedian = median(validBuyValues);

    return cleaned.filter((row) => {
      const sell = Number(row.sell_price_min || 0);
      const buy = Number(row.buy_price_max || 0);
      const sellFresh = hoursSince(parseTime(row.sell_price_min_date)) <= 72;
      const buyFresh = hoursSince(parseTime(row.buy_price_max_date)) <= 72;

      const sellOk = sell > 0 && sellFresh && (!sellMedian || (sell >= sellMedian * 0.2 && sell <= sellMedian * 4));
      const buyOk = buy > 0 && buyFresh && (!buyMedian || (buy >= buyMedian * 0.2 && buy <= buyMedian * 4));

      // keep row if at least one side is valid
      return sellOk || buyOk;
    });
  }

  function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function confidenceLabel(spreadPct, validCities) {
    if (validCities >= 5 && spreadPct >= 8) return 'Alta';
    if (validCities >= 4 && spreadPct >= 4) return 'Boa';
    if (validCities >= 3 && spreadPct >= 2) return 'Média';
    return 'Baixa';
  }

  function confidenceScore(label) {
    return label === 'Alta' ? 4 : label === 'Boa' ? 3 : label === 'Média' ? 2 : 1;
  }

  function currentRouteMode() {
    return document.getElementById('marketRoute')?.value || 'safe';
  }

  function currentLocations() {
    const route = currentRouteMode();
    if (route === 'safe') return SAFE_LOCATIONS;
    if (route === 'red') return [...SAFE_LOCATIONS, 'Caerleon'];
    return [...SAFE_LOCATIONS, 'Caerleon', BM_LOCATION];
  }

  function estimateDailyVolume(itemId, route) {
    const id = String(itemId || '').toUpperCase();
    let base = 200;
    if (/(WOOD|FIBER|ORE|HIDE|ROCK)$/.test(id)) base = 9000;
    else if (/(PLANKS|CLOTH|METALBAR|LEATHER|STONEBLOCK)$/.test(id)) base = 5000;
    else if (/(BAG|CAPE|MEAL|POTION)/.test(id)) base = 1800;
    else if (/(ARMOR|SHOES|HEAD|MAIN_|2H_)/.test(id)) base = 700;
    if (route === 'black') base *= 0.55;
    else if (route === 'red') base *= 0.8;
    return Math.max(50, Math.round(base));
  }

  function estimateSafeUnits({ itemId, buyPrice, capital, profile, route }) {
    const capitalUnits = Math.floor(capital / Math.max(1, buyPrice));
    const dailyVolume = estimateDailyVolume(itemId, route);
    let fraction = 0.25;
    if (profile === 'consistent') fraction = route === 'safe' ? 0.35 : 0.2;
    else if (profile === 'balanced') fraction = route === 'safe' ? 0.55 : 0.35;
    else fraction = route === 'safe' ? 0.8 : 0.55;
    const packFloor = /(WOOD|FIBER|ORE|HIDE|ROCK|PLANKS|CLOTH|METALBAR|LEATHER|STONEBLOCK)/.test(String(itemId || '').toUpperCase()) ? 999 : 50;
    let safeUnits = Math.min(capitalUnits, Math.floor(dailyVolume * fraction));
    if (capitalUnits >= packFloor && safeUnits < packFloor * 0.5) safeUnits = Math.min(capitalUnits, packFloor);
    return Math.max(0, safeUnits);
  }

  function getSortArrow(key) {
    if (opportunityState.sortKey !== key) return '↕';
    return opportunityState.sortDir === 'asc' ? '↑' : '↓';
  }

  function buildSingleItemAnalysis(rows, feePct = DEFAULT_FEE) {
    const cleaned = sanitizeRows(rows);
    const validSells = cleaned.filter(r => Number(r.sell_price_min || 0) > 0);
    const validBuys = cleaned.filter(r => Number(r.buy_price_max || 0) > 0);

    if (!validSells.length || !validBuys.length) {
      return { ok: false, reason: 'Os preços vieram muito velhos, inconsistentes ou sem spread útil.' };
    }

    const cheapest = validSells.reduce((best, row) => Number(row.sell_price_min) < Number(best.sell_price_min) ? row : best, validSells[0]);
    const highest = validBuys.reduce((best, row) => Number(row.buy_price_max) > Number(best.buy_price_max) ? row : best, validBuys[0]);

    const buyPrice = Number(cheapest.sell_price_min || 0);
    const sellPrice = Number(highest.buy_price_max || 0);
    const netSell = sellPrice * (1 - feePct / 100);
    const profit = netSell - buyPrice;
    const margin = buyPrice > 0 ? (profit / buyPrice) * 100 : 0;

    return {
      ok: true,
      cleaned,
      buyCity: cheapest.city,
      sellCity: highest.city,
      buyPrice,
      sellPrice,
      netSell,
      profit,
      margin,
      confidence: confidenceLabel(margin, cleaned.length)
    };
  }

  function buildOpportunities(prices, capital = 3000000, profile = 'balanced', feePct = DEFAULT_FEE, route = 'safe') {
    const byItem = new Map();
    prices.forEach((row) => {
      if (!row.item_id) return;
      if (!byItem.has(row.item_id)) byItem.set(row.item_id, []);
      byItem.get(row.item_id).push(row);
    });

    const opportunities = [];
    byItem.forEach((rows, itemId) => {
      const analysis = buildSingleItemAnalysis(rows, feePct);
      if (!analysis.ok) return;
      if (analysis.buyCity === analysis.sellCity) return;
      if (route === 'safe' && (analysis.buyCity === 'Caerleon' || analysis.sellCity === 'Caerleon' || analysis.sellCity === BM_LOCATION)) return;
      if (route === 'red' && analysis.sellCity === BM_LOCATION) return;
      if (analysis.profit <= 0) return;

      const safeUnits = estimateSafeUnits({ itemId, buyPrice: analysis.buyPrice, capital, profile, route });
      if (safeUnits <= 0) return;

      const totalSafeProfit = analysis.profit * safeUnits;
      const minimumProfit = profile === 'max' ? 100000 : profile === 'balanced' ? 50000 : 25000;
      if (totalSafeProfit < minimumProfit) return;

      opportunities.push({
        itemId,
        itemName: prettyItemName(itemId),
        buyCity: analysis.buyCity,
        sellCity: analysis.sellCity,
        buyPrice: analysis.buyPrice,
        sellPrice: analysis.sellPrice,
        netSell: analysis.netSell,
        profit: analysis.profit,
        margin: analysis.margin,
        confidence: analysis.confidence,
        confidenceScore: confidenceScore(analysis.confidence),
        safeUnits,
        totalSafeProfit,
        estimatedDailyVolume: estimateDailyVolume(itemId, route)
      });
    });

    return opportunities;
  }

  function prettyItemName(itemId) {
    const clean = itemId.replace(/@(\d)/, '');
    for (const [family, groups] of Object.entries(ITEM_CATALOG)) {
      for (const [group, items] of Object.entries(groups)) {
        for (const item of items) {
          for (let tier = 4; tier <= 8; tier++) {
            if (buildItemId(item.template, tier, 0) === clean) return `${item.label} T${tier}`;
          }
        }
      }
    }
    return clean
      .replace(/^T(\d+)_/, 'T$1 ')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function buildItemId(template, tier, enchant) {
    let id = template.replace('{tier}', tier);
    if (Number(enchant) > 0) id += `@${enchant}`;
    return id;
  }


  function getAllCatalogItems(options = {}) {
    const tiers = options.tiers || [4, 5, 6, 7, 8];
    const enchants = options.enchants || [0, 1, 2, 3, 4];
    const items = [];
    for (const groups of Object.values(ITEM_CATALOG)) {
      for (const groupItems of Object.values(groups)) {
        for (const item of groupItems) {
          for (const tier of tiers) {
            for (const enchant of enchants) {
              items.push(buildItemId(item.template, tier, enchant));
            }
          }
        }
      }
    }
    return [...new Set(items)];
  }

  function currentServer() {
    return document.getElementById('marketServer')?.value || 'west';
  }

  async function loadMarket() {
    const family = document.getElementById('itemFamily').value;
    const group = document.getElementById('itemGroup').value;
    const idx = Number(document.getElementById('itemSelect').value);
    const tier = Number(document.getElementById('itemTier').value || 4);
    const enchant = Number(document.getElementById('itemEnchant').value || 0);
    const quality = document.getElementById('itemQuality').value || '1';
    const manual = document.getElementById('marketItemId').value.trim();
    const box = document.getElementById('marketResult');
    box.textContent = 'Buscando preços do item...';
    setStatus('Consultando AlbionData para o item...', true);

    try {
      let itemId = manual;
      if (!itemId) {
        const item = ITEM_CATALOG[family]?.[group]?.[idx];
        if (!item) throw new Error('Escolha um item válido.');
        itemId = buildItemId(item.template, tier, enchant);
      }

      const data = await api(`/api/albion-prices?items=${encodeURIComponent(itemId)}&locations=${encodeURIComponent(DEFAULT_LOCATIONS.join(','))}&qualities=${quality}&server=${currentServer()}`);
      const rows = data.data || [];
      const analysis = buildSingleItemAnalysis(rows, DEFAULT_FEE);

      if (!analysis.ok) {
        box.innerHTML = `<div class="warning-box">Não encontrei arbitragem confiável agora para <strong>${prettyItemName(itemId)}</strong>. ${analysis.reason}</div>`;
        setStatus('Item consultado, mas sem spread confiável', false);
        return;
      }

      const itemName = prettyItemName(itemId);
      const tableRows = analysis.cleaned.map((row) => {
        const sell = Number(row.sell_price_min || 0);
        const buy = Number(row.buy_price_max || 0);
        const askValid = sell > 0 && hoursSince(parseTime(row.sell_price_min_date)) <= 72;
        const buyValid = buy > 0 && hoursSince(parseTime(row.buy_price_max_date)) <= 72;
        return `
          <tr>
            <td>${row.city}</td>
            <td>${askValid ? formatSilver(sell) : '—'}</td>
            <td>${buyValid ? formatSilver(buy) : '—'}</td>
            <td>${buyValid ? formatSilver(buy * (1 - DEFAULT_FEE / 100)) : '—'}</td>
            <td>${formatBrazilTime(row.sell_price_min_date)}</td>
            <td>${formatBrazilTime(row.buy_price_max_date)}</td>
          </tr>
        `;
      }).join('');

      box.innerHTML = `
        <div class="market-summary">
          <div><strong>${itemName}</strong></div>
          <div><span class="label">Cidade mais barata para comprar:</span> ${analysis.buyCity}</div>
          <div><span class="label">Valor de compra:</span> ${formatSilver(analysis.buyPrice)} prata</div>
          <div><span class="label">Melhor cidade para vender:</span> ${analysis.sellCity}</div>
          <div><span class="label">Pedido de compra atual:</span> ${formatSilver(analysis.sellPrice)} prata</div>
          <div><span class="label">Venda líquida estimada após taxa:</span> ${formatSilver(analysis.netSell)} prata</div>
          <div><span class="label">Lucro líquido estimado por unidade:</span> ${formatSilver(analysis.profit)} prata</div>
          <div><span class="label">Margem estimada:</span> ${formatPercent(analysis.margin)}</div>
          <div><span class="label">Qualidade analisada:</span> ${document.getElementById('itemQuality').selectedOptions[0].textContent}</div>
          <div><span class="label">Confiança:</span> ${analysis.confidence}</div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Cidade</th>
                <th>Menor preço de venda</th>
                <th>Maior pedido de compra</th>
                <th>Venda líquida estimada</th>
                <th>Atualização venda (Brasil)</th>
                <th>Atualização compra (Brasil)</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      `;
      setStatus(`AlbionData online · item ${itemName}`, true);
    } catch (error) {
      box.innerHTML = `<div class="warning-box">${error.message}</div>`;
      setStatus('Falha ao consultar item', false);
    }
  }

  async function loadOpportunityRadar(mode = 'popular') {
    const box = document.getElementById('opportunityResult');
    if (!box) return;
    const capital = Number(document.getElementById('marketCapital').value || 0) || 3000000;
    const profile = document.getElementById('marketProfile').value || 'balanced';
    const route = currentRouteMode();
    const locations = currentLocations();
    const routeLabel = route === 'safe' ? 'Somente zona safe' : route === 'red' ? 'Pode usar rota vermelha / Caerleon' : 'Aceita Black Market';
    document.getElementById('profileLabel').textContent =
      profile === 'consistent' ? 'Lucro seguro' : profile === 'max' ? 'Lucro máximo' : 'Equilibrado';

    const items = mode === 'all'
      ? getAllCatalogItems({ tiers: [4, 5, 6, 7, 8], enchants: [0, 1, 2, 3, 4] })
      : POPULAR_ITEMS;
    opportunityState.lastMode = mode;
    setProgress(5, 'Preparando consulta do mercado...');
    box.textContent = 'Consultando mercado...';
    setStatus(`AlbionData consultando oportunidades · ${routeLabel}`, true);

    try {
      setProgress(25, `Consultando ${items.length} itens em ${locations.length} cidades...`);
      const chunkSize = 120;
      const rows = [];
      for (let index = 0; index < items.length; index += chunkSize) {
        const chunk = items.slice(index, index + chunkSize);
        const pct = 25 + Math.round((index / Math.max(items.length, 1)) * 35);
        setProgress(pct, `Consultando mercado... lote ${Math.floor(index / chunkSize) + 1}/${Math.ceil(items.length / chunkSize)}`);
        const data = await api(`/api/albion-prices?items=${encodeURIComponent(chunk.join(','))}&locations=${encodeURIComponent(locations.join(','))}&qualities=1&server=${currentServer()}`);
        rows.push(...(data.data || []));
      }
      setProgress(65, 'Filtrando preços estranhos, dados velhos e rota ruim...');
      const opportunities = buildOpportunities(rows, capital, profile, DEFAULT_FEE, route);
      opportunityState.list = opportunities;
      opportunityState.sortKey = 'totalSafeProfit';
      opportunityState.sortDir = 'desc';
      setProgress(100, opportunities.length ? `Varredura concluída · ${opportunities.length} oportunidades` : 'Varredura concluída · sem oportunidade confiável');

      if (!opportunities.length) {
        box.innerHTML = '<div class="warning-box">Nenhuma oportunidade confiável apareceu agora. Isso normalmente significa dado velho, pouco spread real ou rota incompatível com o filtro escolhido.</div>';
        document.getElementById('bestOpportunityName').textContent = '—';
        document.getElementById('bestOpportunityText').textContent = 'Sem oportunidade confiável agora.';
        document.getElementById('priorityPlan').textContent = 'Sem rota forte agora. Troque o perfil, aumente o capital, ou permita rota vermelha / Black Market.';
        setStatus('Sem oportunidade confiável agora', false);
        return;
      }

      const best = opportunities.slice().sort((a,b)=>b.totalSafeProfit-a.totalSafeProfit)[0];
      document.getElementById('bestOpportunityName').textContent = best.itemName;
      document.getElementById('bestOpportunityText').textContent =
        `Comprar em ${best.buyCity}, vender em ${best.sellCity} e mirar ${formatSilver(best.totalSafeProfit)} de lucro total seguro (${opportunityState.lastMode === 'all' ? 'mercado completo' : 'itens populares'}).`;
      document.getElementById('priorityPlan').innerHTML =
        `Melhor rota agora: <strong>${best.itemName}</strong>.<br>
         Compre em <strong>${best.buyCity}</strong> por <strong>${formatSilver(best.buyPrice)}</strong> e venda em <strong>${best.sellCity}</strong> pelo pedido de compra atual de <strong>${formatSilver(best.sellPrice)}</strong>.<br>
         Quantidade segura estimada: <strong>${formatSilver(best.safeUnits)}</strong> unidades. Lucro por unidade: <strong>${formatSilver(best.profit)}</strong>. Lucro total seguro: <strong>${formatSilver(best.totalSafeProfit)}</strong>.<br>
         Estratégia sugerida: ${route === 'safe' ? 'rotas entre cidades reais, sem entrar em zona vermelha.' : route === 'red' ? 'aceita passar por rota vermelha/Caerleon para ganhar mais.' : 'aceita rota até o Black Market para buscar o melhor spread possível.'}`;

      renderOpportunityTable();
      setStatus(`AlbionData online · ${opportunities.length} oportunidades confiáveis`, true);
    } catch (error) {
      setProgress(100, 'Falha ao consultar o mercado.');
      box.innerHTML = `<div class="warning-box">${error.message}</div>`;
      setStatus('Falha ao consultar o mercado', false);
    }
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
    list.sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (typeof av === 'string') return av.localeCompare(bv, 'pt-BR') * dir;
      return ((av || 0) - (bv || 0)) * dir;
    });
    box.innerHTML = `
      <div class="table-wrap">
        <table class="data-table sortable-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Comprar em</th>
              <th><button class="sort-btn" data-sort="buyPrice">Custo ${getSortArrow('buyPrice')}</button></th>
              <th>Vender em</th>
              <th><button class="sort-btn" data-sort="sellPrice">Pedido ${getSortArrow('sellPrice')}</button></th>
              <th><button class="sort-btn" data-sort="profit">Lucro/unid. ${getSortArrow('profit')}</button></th>
              <th><button class="sort-btn" data-sort="safeUnits">Qtde segura ${getSortArrow('safeUnits')}</button></th>
              <th><button class="sort-btn" data-sort="totalSafeProfit">Lucro total ${getSortArrow('totalSafeProfit')}</button></th>
              <th><button class="sort-btn" data-sort="margin">Margem ${getSortArrow('margin')}</button></th>
              <th><button class="sort-btn" data-sort="confidenceScore">Confiança ${getSortArrow('confidenceScore')}</button></th>
            </tr>
          </thead>
          <tbody>
            ${list.map(op => `
              <tr>
                <td>${op.itemName}</td>
                <td>${op.buyCity}</td>
                <td>${formatSilver(op.buyPrice)}</td>
                <td>${op.sellCity}</td>
                <td>${formatSilver(op.sellPrice)}</td>
                <td>${formatSilver(op.profit)}</td>
                <td>${formatSilver(op.safeUnits)}</td>
                <td>${formatSilver(op.totalSafeProfit)}</td>
                <td>${formatPercent(op.margin)}</td>
                <td>${op.confidence}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
    box.querySelectorAll('.sort-btn').forEach((btn) => btn.addEventListener('click', () => sortOpportunitiesBy(btn.dataset.sort)));
  }

  function populateItemSelectors() {
    const familyEl = document.getElementById('itemFamily');
    const groupEl = document.getElementById('itemGroup');
    const itemEl = document.getElementById('itemSelect');
    if (!familyEl || !groupEl || !itemEl) return;

    familyEl.innerHTML = Object.keys(ITEM_CATALOG).map(f => `<option value="${f}">${f}</option>`).join('');

    function updateGroups() {
      const family = familyEl.value;
      const groups = Object.keys(ITEM_CATALOG[family] || {});
      groupEl.innerHTML = groups.map(g => `<option value="${g}">${g}</option>`).join('');
      updateItems();
    }
    function updateItems() {
      const family = familyEl.value;
      const group = groupEl.value;
      const items = ITEM_CATALOG[family]?.[group] || [];
      itemEl.innerHTML = items.map((it, idx) => `<option value="${idx}">${it.label}</option>`).join('');
    }
    familyEl.addEventListener('change', updateGroups);
    groupEl.addEventListener('change', updateItems);
    updateGroups();
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
    populateItemSelectors();

    const loadBtn = document.getElementById('loadMarketBtn');
    if (loadBtn) loadBtn.addEventListener('click', loadMarket);
    const popularBtn = document.getElementById('scanPopularBtn');
    if (popularBtn) popularBtn.addEventListener('click', () => loadOpportunityRadar('popular'));
    const allBtn = document.getElementById('scanAllBtn');
    if (allBtn) allBtn.addEventListener('click', () => loadOpportunityRadar('all'));

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
            <td>${u.licenca || '-'}</td>
          </tr>`).join('');
      }
    } catch (error) {
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = error.message;
    }
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function sortByProfitDesc(list) { return list.sort((a, b) => b.profit - a.profit); }

  function calcCraft() {
    const level = Number(document.getElementById('craftLevel').value || 0);
    const city = document.getElementById('craftCity').value;
    const cost = Number(document.getElementById('craftCost').value || 0);
    const sell = Number(document.getElementById('craftSell').value || 0);
    const bonus = level >= 80 ? 1.07 : level >= 50 ? 1.04 : 1.01;
    const fee = Math.round(sell * 0.065);
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
    const fee = Math.round(sell * 0.065);
    const lucro = sell - cost * efficiency * xpBonus - fee;
    setHtml('refineResult', `<strong>Resultado do refino em ${city}</strong><br>Lucro estimado: <strong>${formatSilver(lucro)} prata</strong> ${focus ? 'com foco' : 'sem foco'}<br>Melhor leitura: ${focus ? 'aproveite itens com retorno de recursos e venda rápida.' : 'sem foco, prefira spreads maiores e muito giro.'}`);
  }

  function calcIsland() {
    const level = Number(document.getElementById('islandLevel').value || 0);
    const plots = Number(document.getElementById('islandPlots').value || 0);
    const pastures = Number(document.getElementById('islandPastures').value || 0);
    const focus = document.getElementById('islandFocus').value === 'sim';
    const cropOptions = ISLAND_CROPS.map((crop) => ({ ...crop, totalProfit: Math.round(crop.profit * plots * (1 + level * 0.03) * (focus ? 1.12 : 1)) }));
    const animalOptions = ISLAND_ANIMALS.map((animal) => ({ ...animal, totalProfit: Math.round((animal.profit - animal.feed) * pastures * (1 + level * 0.025) * (focus ? 1.08 : 1)) }));
    const bestCrop = sortByProfitDesc(cropOptions)[0] || { name: 'Nenhuma', totalProfit: 0, note: '-' };
    const bestAnimal = sortByProfitDesc(animalOptions)[0] || { name: 'Nenhum', totalProfit: 0, note: '-' };
    const total = bestCrop.totalProfit + bestAnimal.totalProfit;
    setHtml('islandResult', `<strong>Melhor plano para sua ilha</strong><br><br>Melhor plantação: <strong>${bestCrop.name}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestCrop.totalProfit)}</strong><br>Melhor criação: <strong>${bestAnimal.name}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestAnimal.totalProfit)}</strong><br>Lucro total estimado: <strong>${formatSilver(total)} prata</strong><br><br>• Use as plantações para <strong>${bestCrop.name}</strong>.<br>• Nos pastos, priorize <strong>${bestAnimal.name}</strong>.<br>• ${focus ? 'Como você usa foco, vale concentrar a produção no que tiver maior margem.' : 'Sem foco, prefira opções estáveis e simples de revender.'}<br><br>Observação da plantação: ${bestCrop.note}.<br>Observação do animal: ${bestAnimal.note}.`);
  }

  function calcTransport() {
    const buyCity = document.getElementById('transportBuyCity').value;
    const sellCity = document.getElementById('transportSellCity').value;
    const buy = Number(document.getElementById('transportBuyPrice').value || 0);
    const sell = Number(document.getElementById('transportSellPrice').value || 0);
    const cost = Number(document.getElementById('transportCost').value || 0);
    const tax = Math.round(sell * 0.065);
    const lucro = sell - buy - cost - tax;
    setHtml('transportResult', `<strong>Resultado do transporte</strong><br>Rota: <strong>${buyCity} → ${sellCity}</strong><br>Lucro líquido estimado: <strong>${formatSilver(lucro)} prata</strong><br>Leitura: ${lucro > 0 ? 'boa rota para testar em volume controlado.' : 'não vale essa operação nesse formato.'}`);
  }

  function calcWealth() {
    const current = Number(document.getElementById('wealthCurrent').value || 0);
    const goal = Number(document.getElementById('wealthGoal').value || 0);
    const days = Math.max(1, Number(document.getElementById('wealthDays').value || 1));
    const died = document.getElementById('wealthDied').value === 'sim';
    const close = Number(document.getElementById('wealthClose').value || current);
    const diff = Math.max(0, goal - close);
    const daily = diff / days;
    const plans = opportunityState.list.slice(0, 3);
    if (!plans.length) {
      setHtml('wealthResult', 'Rode o mercado primeiro. O planejador agora depende das melhores oportunidades do dia para montar um plano de verdade.');
      return;
    }
    const entries = [];
    let running = close;
    for (let day = 1; day <= Math.min(days, 7); day++) {
      const op = plans[(day - 1) % plans.length];
      const baseProfit = Math.max(op.totalSafeProfit, op.profit * Math.min(op.safeUnits, 2000));
      const adjusted = died && day === 1 ? Math.max(0, baseProfit - current * 0.08) : baseProfit;
      running += adjusted;
      entries.push(`<div class="plan-day"><strong>Dia ${day}</strong><br>Hoje foque em <strong>${op.itemName}</strong>.<br>Compre em <strong>${op.buyCity}</strong> por <strong>${formatSilver(op.buyPrice)}</strong> e venda em <strong>${op.sellCity}</strong> por <strong>${formatSilver(op.sellPrice)}</strong> no pedido atual.<br>Quantidade segura sugerida: <strong>${formatSilver(op.safeUnits)}</strong> unidades.<br>Lucro esperado do dia: <strong>${formatSilver(adjusted)}</strong>.<br>Fechamento estimado do dia: <strong>${formatSilver(running)}</strong>.</div>`);
    }
    setHtml('wealthResult', `<strong>Plano para sair de ${formatSilver(close)} e buscar ${formatSilver(goal)}</strong><br><br>Precisa gerar em média: <strong>${formatSilver(daily)} prata por dia</strong>.<br>Se você morreu hoje: <strong>${died ? 'sim, o plano ficou mais agressivo para recuperar.' : 'não, seguimos com crescimento normal.'}</strong><br><br>${entries.join('')}<br><div class="helper-box"><strong>Como usar esse plano</strong><span>Faça a operação do dia, volte amanhã e preencha o saldo real de fechamento. Se morreu ou perdeu dinheiro, marque isso no formulário para o próximo plano reagir.</span></div>`);
  }

  window.AlbionTrader = { calcCraft, calcRefine, calcIsland, calcTransport, calcWealth, loadOpportunityRadar, activateSection };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', handleLogin);
    if (document.body.dataset.page === 'dashboard') initDashboard();
    if (document.body.dataset.page === 'admin') initAdmin();
  });
})();
