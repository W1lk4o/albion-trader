(() => {
  const STORAGE_KEY = 'albionTraderSession';
  const DEVICE_KEY = 'albionTraderDeviceId';
  const DEFAULT_LOCATIONS = ['Caerleon', 'Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const QUALITY_LABELS = { 1: 'Normal', 2: 'Boa', 3: 'Excelente', 4: 'Obra-prima', 5: 'Obra-prima' };
  const SERVER_LABELS = { west: 'Americas', east: 'Asia', europe: 'Europe' };
  const PROFILE_LABELS = { safe: 'Lucro consistente', balanced: 'Equilibrado', max: 'Máximo lucro' };
  const MARKET_SCAN_LIMIT = 300;

  const MARKET_FAMILIES = [
    {
      key: 'bag_cape',
      name: 'Bolsas e capas',
      tiers: [4, 5, 6, 7, 8],
      items: [
        { id: 'T4_BAG', label: 'Bolsa', familyLabel: 'Bolsa' },
        { id: 'T4_CAPE', label: 'Capa', familyLabel: 'Capa' }
      ]
    },
    {
      key: 'raw',
      name: 'Recursos brutos',
      tiers: [4, 5, 6, 7, 8],
      items: [
        { id: 'T4_ORE', label: 'Minério bruto', familyLabel: 'Minério bruto' },
        { id: 'T4_WOOD', label: 'Madeira bruta', familyLabel: 'Madeira bruta' },
        { id: 'T4_FIBER', label: 'Fibra bruta', familyLabel: 'Fibra bruta' },
        { id: 'T4_HIDE', label: 'Couro bruto', familyLabel: 'Couro bruto' },
        { id: 'T4_ROCK', label: 'Pedra bruta', familyLabel: 'Pedra bruta' }
      ]
    },
    {
      key: 'refined',
      name: 'Refinados',
      tiers: [4, 5, 6, 7, 8],
      items: [
        { id: 'T4_METALBAR', label: 'Barra de metal', familyLabel: 'Barra de metal' },
        { id: 'T4_PLANKS', label: 'Tábua', familyLabel: 'Tábua' },
        { id: 'T4_CLOTH', label: 'Tecido', familyLabel: 'Tecido' },
        { id: 'T4_LEATHER', label: 'Couro refinado', familyLabel: 'Couro refinado' },
        { id: 'T4_STONEBLOCK', label: 'Bloco de pedra', familyLabel: 'Bloco de pedra' }
      ]
    }
  ];

  const ITEM_NAME_OVERRIDES = {
    T4_BAG: 'Bolsa T4', T5_BAG: 'Bolsa T5', T6_BAG: 'Bolsa T6', T7_BAG: 'Bolsa T7', T8_BAG: 'Bolsa T8',
    T4_CAPE: 'Capa T4', T5_CAPE: 'Capa T5', T6_CAPE: 'Capa T6', T7_CAPE: 'Capa T7', T8_CAPE: 'Capa T8',
    T4_ORE: 'Minério bruto T4', T5_ORE: 'Minério bruto T5', T6_ORE: 'Minério bruto T6', T7_ORE: 'Minério bruto T7', T8_ORE: 'Minério bruto T8',
    T4_WOOD: 'Madeira bruta T4', T5_WOOD: 'Madeira bruta T5', T6_WOOD: 'Madeira bruta T6', T7_WOOD: 'Madeira bruta T7', T8_WOOD: 'Madeira bruta T8',
    T4_FIBER: 'Fibra bruta T4', T5_FIBER: 'Fibra bruta T5', T6_FIBER: 'Fibra bruta T6', T7_FIBER: 'Fibra bruta T7', T8_FIBER: 'Fibra bruta T8',
    T4_HIDE: 'Couro bruto T4', T5_HIDE: 'Couro bruto T5', T6_HIDE: 'Couro bruto T6', T7_HIDE: 'Couro bruto T7', T8_HIDE: 'Couro bruto T8',
    T4_ROCK: 'Pedra bruta T4', T5_ROCK: 'Pedra bruta T5', T6_ROCK: 'Pedra bruta T6', T7_ROCK: 'Pedra bruta T7', T8_ROCK: 'Pedra bruta T8',
    T4_METALBAR: 'Barra de metal T4', T5_METALBAR: 'Barra de metal T5', T6_METALBAR: 'Barra de metal T6', T7_METALBAR: 'Barra de metal T7', T8_METALBAR: 'Barra de metal T8',
    T4_PLANKS: 'Tábua T4', T5_PLANKS: 'Tábua T5', T6_PLANKS: 'Tábua T6', T7_PLANKS: 'Tábua T7', T8_PLANKS: 'Tábua T8',
    T4_CLOTH: 'Tecido T4', T5_CLOTH: 'Tecido T5', T6_CLOTH: 'Tecido T6', T7_CLOTH: 'Tecido T7', T8_CLOTH: 'Tecido T8',
    T4_LEATHER: 'Couro refinado T4', T5_LEATHER: 'Couro refinado T5', T6_LEATHER: 'Couro refinado T6', T7_LEATHER: 'Couro refinado T7', T8_LEATHER: 'Couro refinado T8',
    T4_STONEBLOCK: 'Bloco de pedra T4', T5_STONEBLOCK: 'Bloco de pedra T5', T6_STONEBLOCK: 'Bloco de pedra T6', T7_STONEBLOCK: 'Bloco de pedra T7', T8_STONEBLOCK: 'Bloco de pedra T8'
  };

  const MARKET_ITEM_IDS = (() => {
    const ids = [];
    MARKET_FAMILIES.forEach((family) => {
      family.items.forEach((item) => {
        family.tiers.forEach((tier) => ids.push(item.id.replace(/^T\d+_/, `T${tier}_`)));
      });
    });
    return [...new Set(ids)];
  })();

  let sortKey = 'profitTotal';
  let sortDirection = 'desc';
  let latestOpportunities = [];

  function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_KEY);
    if (!deviceId) {
      deviceId = `device-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(DEVICE_KEY, deviceId);
    }
    return deviceId;
  }

  function saveSession(payload) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

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
    const email = document.getElementById('email')?.value.trim();
    const senha = document.getElementById('senha')?.value;
    const message = document.getElementById('loginMessage');
    if (message) message.textContent = 'Entrando...';

    try {
      const data = await api('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha, deviceId: getDeviceId() })
      });
      saveSession(data);
      if (message) message.textContent = 'Login realizado com sucesso.';
      window.location.href = data.user.admin ? '/admin' : '/dashboard';
    } catch (error) {
      if (message) message.textContent = error.message;
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
    navItems.forEach((node) => node.classList.toggle('active', node.dataset.target === targetId));
    sections.forEach((node) => node.classList.toggle('active', node.id === targetId));
  }

  function bindNav() {
    document.querySelectorAll('[data-target]').forEach((node) => {
      node.addEventListener('click', () => activateSection(node.dataset.target));
    });
  }

  function formatSilver(value) {
    return new Intl.NumberFormat('pt-BR').format(Math.round(Number(value) || 0));
  }

  function formatPercent(value) {
    return `${(Number(value) || 0).toFixed(1)}%`;
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function updateStatus(text, secondary = false) {
    setText(secondary ? 'scanStatusBadge' : 'apiStatusBadge', text);
  }

  function qualityLabel(value) {
    return QUALITY_LABELS[String(value)] || QUALITY_LABELS[value] || 'Normal';
  }

  function profileLabel(key) {
    return PROFILE_LABELS[key] || 'Equilibrado';
  }

  function normalizeServer(value) {
    return ['west', 'east', 'europe'].includes(value) ? value : 'west';
  }

  function parseNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function parseDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function ageHours(date) {
    if (!date) return Infinity;
    return Math.abs(Date.now() - date.getTime()) / 36e5;
  }

  function buildItemId(baseId, tier, enchant) {
    const clean = (baseId || '').split('@')[0].replace(/^T\d+_/, `T${tier}_`);
    return Number(enchant) > 0 ? `${clean}@${Number(enchant)}` : clean;
  }

  function displayItemName(itemId) {
    const [base, enchantRaw] = String(itemId || '').split('@');
    const enchant = Number(enchantRaw || 0);
    const baseName = ITEM_NAME_OVERRIDES[base] || base.replace(/_/g, ' ');
    return enchant > 0 ? `${baseName}.${enchant}` : baseName;
  }

  function recencyScore(hours) {
    if (hours <= 3) return 1;
    if (hours <= 8) return 0.85;
    if (hours <= 18) return 0.65;
    if (hours <= 36) return 0.4;
    return 0;
  }

  function deriveExitPrice(row, profile, taxRate) {
    const buyMax = parseNumber(row.buy_price_max);
    const sellMin = parseNumber(row.sell_price_min);
    const buyAge = ageHours(parseDate(row.buy_price_max_date));
    const sellAge = ageHours(parseDate(row.sell_price_min_date));

    const recentBuy = buyMax > 0 && buyAge <= 24;
    const recentSell = sellMin > 0 && sellAge <= 24;

    if (profile === 'safe') {
      if (!recentBuy) return null;
      return { method: 'buy-order', gross: buyMax, net: buyMax * (1 - taxRate), score: recencyScore(buyAge) };
    }

    if (profile === 'max') {
      if (recentSell) {
        const undercut = 0.01;
        return { method: 'sell-order', gross: sellMin, net: sellMin * (1 - taxRate - undercut), score: recencyScore(sellAge) * 0.95 };
      }
      if (recentBuy) return { method: 'buy-order', gross: buyMax, net: buyMax * (1 - taxRate), score: recencyScore(buyAge) * 0.8 };
      return null;
    }

    if (recentBuy && recentSell) {
      const sellNet = sellMin * (1 - taxRate - 0.015);
      const buyNet = buyMax * (1 - taxRate);
      if (sellNet >= buyNet) return { method: 'sell-order', gross: sellMin, net: sellNet, score: Math.min(recencyScore(sellAge), 0.9) };
      return { method: 'buy-order', gross: buyMax, net: buyNet, score: recencyScore(buyAge) };
    }

    if (recentSell) return { method: 'sell-order', gross: sellMin, net: sellMin * (1 - taxRate - 0.02), score: recencyScore(sellAge) * 0.8 };
    if (recentBuy) return { method: 'buy-order', gross: buyMax, net: buyMax * (1 - taxRate), score: recencyScore(buyAge) * 0.9 };
    return null;
  }

  function deriveBuyCost(row) {
    const sellMin = parseNumber(row.sell_price_min);
    const sellDate = parseDate(row.sell_price_min_date);
    const hours = ageHours(sellDate);
    if (!(sellMin > 0) || hours > 36) return null;
    return { gross: sellMin, hours, score: recencyScore(hours) };
  }

  function computeConfidence(buyCost, exitInfo, spread) {
    const baseScore = ((buyCost?.score || 0) + (exitInfo?.score || 0)) / 2;
    const spreadScore = spread >= 0.15 ? 1 : spread >= 0.08 ? 0.75 : spread >= 0.03 ? 0.5 : 0.2;
    const total = (baseScore * 0.7 + spreadScore * 0.3) * 100;
    if (total >= 80) return { label: 'Alta', value: total };
    if (total >= 55) return { label: 'Média', value: total };
    return { label: 'Baixa', value: total };
  }

  function getMarketSettings() {
    return {
      server: normalizeServer(document.getElementById('marketServer')?.value || 'west'),
      capital: parseNumber(document.getElementById('marketCapital')?.value || 0),
      profile: document.getElementById('marketProfile')?.value || 'balanced',
      taxRate: parseNumber(document.getElementById('marketTax')?.value || 6.5) / 100,
      quality: document.getElementById('marketQuality')?.value || '1'
    };
  }

  function buildOpportunities(prices, settings) {
    const byItem = new Map();
    prices.forEach((row) => {
      if (!row.item_id) return;
      const key = `${row.item_id}|${row.quality || settings.quality}`;
      if (!byItem.has(key)) byItem.set(key, []);
      byItem.get(key).push(row);
    });

    const opportunities = [];
    byItem.forEach((rows) => {
      const itemId = rows[0].item_id;
      let best = null;

      rows.forEach((buyRow) => {
        const buyCost = deriveBuyCost(buyRow);
        if (!buyCost) return;

        rows.forEach((sellRow) => {
          if (buyRow.city === sellRow.city) return;
          const exitInfo = deriveExitPrice(sellRow, settings.profile, settings.taxRate);
          if (!exitInfo) return;

          const units = buyCost.gross > 0 ? Math.max(1, Math.floor(settings.capital / buyCost.gross)) : 0;
          const profitUnit = exitInfo.net - buyCost.gross;
          const spread = buyCost.gross > 0 ? profitUnit / buyCost.gross : 0;
          if (profitUnit <= 0 || spread <= 0.01) return;

          const confidence = computeConfidence(buyCost, exitInfo, spread);
          const candidate = {
            itemId,
            itemName: displayItemName(itemId),
            qualityLabel: qualityLabel(rows[0].quality || settings.quality),
            buyCity: buyRow.city,
            sellCity: sellRow.city,
            buyPrice: buyCost.gross,
            sellGross: exitInfo.gross,
            sellNet: exitInfo.net,
            method: exitInfo.method,
            profitUnit,
            profitTotal: profitUnit * units,
            margin: spread * 100,
            units,
            confidence: confidence.label,
            confidenceValue: confidence.value,
            updatedBuy: buyRow.sell_price_min_date,
            updatedSell: exitInfo.method === 'buy-order' ? sellRow.buy_price_max_date : sellRow.sell_price_min_date
          };

          if (!best || candidate.profitTotal > best.profitTotal) best = candidate;
        });
      });

      if (best) opportunities.push(best);
    });

    return opportunities;
  }

  function sortOpportunities(list) {
    const factor = sortDirection === 'desc' ? -1 : 1;
    return [...list].sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      if (typeof left === 'string') return left.localeCompare(right, 'pt-BR') * factor;
      return (left - right) * factor;
    });
  }

  function renderOpportunities(opportunities, settings) {
    latestOpportunities = opportunities;
    const sorted = sortOpportunities(opportunities);
    const summary = sorted[0];
    const target = document.getElementById('marketOpportunities');
    if (!target) return;

    if (!sorted.length) {
      target.innerHTML = '<div class="muted">Nenhuma oportunidade confiável apareceu agora. Tente novamente em alguns minutos ou mude o perfil para Equilibrado.</div>';
      setText('heroOpportunityTitle', 'Sem oportunidade clara');
      setText('heroOpportunityText', 'Os preços recentes não formaram spread confiável suficiente.');
      setText('marketAdviceBox', 'Sem spread útil agora. Foque em giro e espere uma leitura melhor do mercado.');
      return;
    }

    setText('heroOpportunityTitle', summary.itemName);
    setText('heroOpportunityText', `Comprar em ${summary.buyCity}, vender em ${summary.sellCity} e mirar ${formatSilver(summary.profitTotal)} de lucro total.`);
    setText('heroProfile', profileLabel(settings.profile));
    setText('marketAdviceBox', `Melhor rota agora: ${summary.itemName}. Compre em ${summary.buyCity} por ${formatSilver(summary.buyPrice)} e venda em ${summary.sellCity} usando ${summary.method === 'buy-order' ? 'compra imediata' : 'ordem de venda'}. Dentro do seu capital, o lucro total estimado fica em ${formatSilver(summary.profitTotal)}.`);

    target.innerHTML = `
      <div class="table-wrap">
        <table class="data-table compact-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Cidade compra</th>
              <th>Cidade venda</th>
              <th>Custo un.</th>
              <th>Saída un.</th>
              <th>Lucro un.</th>
              <th>Lucro total</th>
              <th>Margem</th>
              <th>Confiança</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map((row) => `
              <tr>
                <td><strong>${row.itemName}</strong><div class="table-sub">Qualidade ${row.qualityLabel}</div></td>
                <td>${row.buyCity}</td>
                <td>${row.sellCity}</td>
                <td>${formatSilver(row.buyPrice)}</td>
                <td>${formatSilver(row.sellNet)}</td>
                <td>${formatSilver(row.profitUnit)}</td>
                <td>${formatSilver(row.profitTotal)}<div class="table-sub">${row.units} un.</div></td>
                <td>${formatPercent(row.margin)}</td>
                <td>${row.confidence}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  async function scanMarket(mode = 'popular') {
    const settings = getMarketSettings();
    const itemIds = MARKET_ITEM_IDS.slice(0, mode === 'popular' ? MARKET_SCAN_LIMIT : MARKET_ITEM_IDS.length);
    const chunkSize = 30;
    const allRows = [];

    updateStatus(`AlbionData consultando ${SERVER_LABELS[settings.server]}`, false);
    updateStatus('Varredura iniciada', true);
    document.getElementById('scanProgressShell')?.classList.remove('hidden');

    for (let index = 0; index < itemIds.length; index += chunkSize) {
      const chunk = itemIds.slice(index, index + chunkSize);
      const pct = Math.min(100, Math.round(((index + chunk.length) / itemIds.length) * 100));
      const progressText = `Consultando mercado: ${pct}%`;
      setText('scanProgressText', progressText);
      const bar = document.getElementById('scanProgressBar');
      if (bar) bar.style.width = `${pct}%`;
      updateStatus(progressText, true);

      const query = new URLSearchParams({
        items: chunk.join(','),
        locations: DEFAULT_LOCATIONS.join(','),
        qualities: settings.quality,
        server: settings.server
      });

      const response = await api(`/api/albion-prices?${query.toString()}`);
      allRows.push(...(response.data || []));
    }

    const opportunities = buildOpportunities(allRows, settings);
    renderOpportunities(opportunities, settings);
    updateStatus(`AlbionData online · ${allRows.length} preços lidos`, false);
    updateStatus(`Varredura concluída · ${opportunities.length} oportunidades`, true);
  }

  function buildRadarRows(rows, settings, itemId) {
    const candidates = rows
      .map((row) => {
        const buyCost = deriveBuyCost(row);
        const exitInfo = deriveExitPrice(row, settings.profile, settings.taxRate);
        return {
          city: row.city,
          quality: qualityLabel(row.quality || settings.quality),
          sellPrice: parseNumber(row.sell_price_min),
          buyPrice: parseNumber(row.buy_price_max),
          sellDate: row.sell_price_min_date,
          buyDate: row.buy_price_max_date,
          buyCost,
          exitInfo
        };
      })
      .filter((row) => row.sellPrice > 0 || row.buyPrice > 0);

    const cheapest = [...candidates].filter((row) => row.buyCost).sort((a, b) => a.sellPrice - b.sellPrice)[0] || null;
    let bestSell = null;
    candidates.forEach((row) => {
      if (row.city === cheapest?.city) return;
      if (!row.exitInfo) return;
      if (!bestSell || row.exitInfo.net > bestSell.exitInfo.net) bestSell = row;
    });

    return {
      itemName: displayItemName(itemId),
      cheapest,
      bestSell,
      rows: candidates.sort((a, b) => a.sellPrice - b.sellPrice)
    };
  }

  function renderItemRadar(result, settings) {
    const target = document.getElementById('itemRadarResult');
    if (!target) return;

    if (!result.cheapest) {
      target.innerHTML = '<div class="muted">Esse item não retornou venda mínima recente nas cidades monitoradas. Tente outra qualidade ou outro servidor.</div>';
      return;
    }

    const cheapest = result.cheapest;
    const sell = result.bestSell;
    const profitUnit = sell ? sell.exitInfo.net - cheapest.sellPrice : 0;
    const margin = cheapest.sellPrice > 0 ? (profitUnit / cheapest.sellPrice) * 100 : 0;

    target.innerHTML = `
      <div class="result-grid">
        <div>
          <h3>${result.itemName}</h3>
          <p><strong>Cidade mais barata para comprar:</strong> ${cheapest.city}</p>
          <p><strong>Preço de compra:</strong> ${formatSilver(cheapest.sellPrice)} prata</p>
          <p><strong>Qualidade analisada:</strong> ${qualityLabel(document.getElementById('itemQuality')?.value || settings.quality)}</p>
        </div>
        <div>
          <p><strong>Melhor cidade para vender:</strong> ${sell ? sell.city : 'Sem saída confiável agora'}</p>
          <p><strong>Preço de saída estimado:</strong> ${sell ? `${formatSilver(sell.exitInfo.net)} prata` : '—'}</p>
          <p><strong>Lucro líquido estimado por unidade:</strong> ${sell ? `${formatSilver(profitUnit)} prata` : '—'}</p>
          <p><strong>Margem estimada:</strong> ${sell ? formatPercent(margin) : '—'}</p>
        </div>
      </div>
      <div class="table-wrap mt-16">
        <table class="data-table compact-table">
          <thead>
            <tr>
              <th>Cidade</th>
              <th>Venda mínima</th>
              <th>Compra máxima</th>
              <th>Saída estimada</th>
              <th>Atualização venda</th>
              <th>Atualização compra</th>
            </tr>
          </thead>
          <tbody>
            ${result.rows.map((row) => `
              <tr>
                <td>${row.city}</td>
                <td>${row.sellPrice ? formatSilver(row.sellPrice) : '—'}</td>
                <td>${row.buyPrice ? formatSilver(row.buyPrice) : '—'}</td>
                <td>${row.exitInfo ? formatSilver(row.exitInfo.net) : '—'}</td>
                <td>${row.sellDate ? new Date(row.sellDate).toLocaleString('pt-BR') : '—'}</td>
                <td>${row.buyDate ? new Date(row.buyDate).toLocaleString('pt-BR') : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  async function loadItemRadar() {
    const settings = getMarketSettings();
    const familyKey = document.getElementById('itemFamily')?.value;
    const baseSelect = document.getElementById('itemBase');
    const tier = Number(document.getElementById('itemTier')?.value || 4);
    const enchant = Number(document.getElementById('itemEnchant')?.value || 0);
    const quality = document.getElementById('itemQuality')?.value || settings.quality;
    const custom = document.getElementById('customItemId')?.value.trim();
    const family = MARKET_FAMILIES.find((entry) => entry.key === familyKey) || MARKET_FAMILIES[0];
    const baseId = custom || baseSelect?.value || family.items[0].id;
    const itemId = custom || buildItemId(baseId, tier, enchant);

    updateStatus(`Consultando item ${displayItemName(itemId)}`, false);
    const query = new URLSearchParams({
      items: itemId,
      locations: DEFAULT_LOCATIONS.join(','),
      qualities: quality,
      server: settings.server
    });

    const response = await api(`/api/albion-prices?${query.toString()}`);
    const rows = (response.data || []).filter((row) => row.item_id === itemId);
    const result = buildRadarRows(rows, Object.assign({}, settings, { quality }), itemId);
    renderItemRadar(result, Object.assign({}, settings, { quality }));
    updateStatus(`AlbionData online · item ${displayItemName(itemId)}`, false);
  }

  function fillRadarSelectors() {
    const familySelect = document.getElementById('itemFamily');
    const baseSelect = document.getElementById('itemBase');
    const tierSelect = document.getElementById('itemTier');
    const enchantSelect = document.getElementById('itemEnchant');
    if (!familySelect || !baseSelect || !tierSelect || !enchantSelect) return;

    familySelect.innerHTML = MARKET_FAMILIES.map((family) => `<option value="${family.key}">${family.name}</option>`).join('');
    tierSelect.innerHTML = [4, 5, 6, 7, 8].map((tier) => `<option value="${tier}">T${tier}</option>`).join('');
    enchantSelect.innerHTML = [0, 1, 2, 3, 4].map((value) => `<option value="${value}">${value === 0 ? 'Sem encantamento' : `.${value}`}</option>`).join('');

    const refillBase = () => {
      const family = MARKET_FAMILIES.find((entry) => entry.key === familySelect.value) || MARKET_FAMILIES[0];
      baseSelect.innerHTML = family.items.map((item) => `<option value="${item.id}">${item.label}</option>`).join('');
    };

    refillBase();
    familySelect.addEventListener('change', refillBase);
  }

  function toggleSort(key) {
    if (sortKey === key) sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    else {
      sortKey = key;
      sortDirection = 'desc';
    }
    if (latestOpportunities.length) renderOpportunities(latestOpportunities, getMarketSettings());
  }

  async function initDashboard() {
    const user = await requireAuth();
    if (!user) return;

    setText('welcomeTitle', `Olá, ${user.nome || user.email}`);
    setText('licenseDate', new Date(user.licencaExpiraEm).toLocaleDateString('pt-BR'));
    setText('heroProfile', profileLabel(getMarketSettings().profile));

    if (user.admin) document.getElementById('goAdminBtn')?.classList.remove('hidden');

    bindLogout();
    bindNav();
    fillRadarSelectors();

    document.getElementById('scanPopularBtn')?.addEventListener('click', () => scanMarket('popular').catch((error) => {
      updateStatus('Erro ao consultar AlbionData', false);
      updateStatus(error.message, true);
      setHtml('marketOpportunities', `<div class="muted">${error.message}</div>`);
    }));
    document.getElementById('scanFastBtn')?.addEventListener('click', () => scanMarket('popular').catch((error) => {
      updateStatus('Erro ao consultar AlbionData', false);
      updateStatus(error.message, true);
      setHtml('marketOpportunities', `<div class="muted">${error.message}</div>`);
    }));
    document.getElementById('refreshMarketBtn')?.addEventListener('click', () => scanMarket('popular').catch((error) => {
      updateStatus('Erro ao consultar AlbionData', false);
      updateStatus(error.message, true);
      setHtml('marketOpportunities', `<div class="muted">${error.message}</div>`);
    }));
    document.getElementById('sortProfitBtn')?.addEventListener('click', () => toggleSort('profitTotal'));
    document.getElementById('loadItemRadarBtn')?.addEventListener('click', () => loadItemRadar().catch((error) => {
      updateStatus('Erro ao consultar item', false);
      setHtml('itemRadarResult', `<div class="muted">${error.message}</div>`);
    }));
    document.getElementById('marketProfile')?.addEventListener('change', (event) => {
      setText('heroProfile', profileLabel(event.target.value));
    });

    await scanMarket('popular').catch((error) => {
      updateStatus('Erro ao consultar AlbionData', false);
      updateStatus(error.message, true);
      setHtml('marketOpportunities', `<div class="muted">${error.message}</div>`);
    });
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
          </tr>
        `).join('');
      }
    } catch (error) {
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = error.message;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const page = document.body.dataset.page;
    if (page === 'dashboard') initDashboard();
    if (page === 'admin') initAdmin();
  });
})();
