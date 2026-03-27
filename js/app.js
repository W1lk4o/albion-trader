(() => {
  const { families, allItems, QUALITY_NAMES, ENCHANTMENT_NAMES, buildItemId, renderName, iconUrl, getScannerBaseItems, getFullScannerItems } = window.ALBION_CATALOG;

  const LOCATIONS = ['Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford', 'Caerleon'];
  const SAFE_LOCATIONS = ['Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const SERVER_OPTIONS = [
    { value: 'west', label: 'Americas' },
    { value: 'europe', label: 'Europe' },
    { value: 'east', label: 'Asia' }
  ];
  const SALE_MODES = {
    auto: 'Melhor dos dois',
    direct: 'Revenda direta',
    buy: 'Pedido de compra'
  };
  const FEE_PERCENT = 6.5;
  const MAX_SELL_AGE_HOURS = 12;
  const MAX_BUY_AGE_HOURS = 12;
  const MAX_SELL_AGE_HOURS_RADAR = 24;
  const MAX_BUY_AGE_HOURS_RADAR = 24;
  const CHUNK_SIZE = 35;

  const state = {
    lastScannerResults: [],
    lastScannerMode: 'base'
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  function fmtNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0));
  }

  function fmtPrice(value) {
    if (!Number.isFinite(value) || value <= 0) return '—';
    return `${fmtNumber(value)} prata`;
  }

  function fmtPercent(value) {
    if (!Number.isFinite(value)) return '—';
    return `${value.toFixed(1).replace('.', ',')}%`;
  }

  function formatDateBR(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false });
  }

  function hoursSince(value) {
    if (!value) return Number.POSITIVE_INFINITY;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY;
    return (Date.now() - date.getTime()) / 36e5;
  }

  function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
  }

  function percentile(values, p) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const idx = (sorted.length - 1) * p;
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
  }

  function getCategoryProfile(itemId) {
    if (/_WOOD|_FIBER|_ORE|_HIDE|_ROCK/.test(itemId)) return { low: 0.55, high: 1.65, maxMargin: 45 };
    if (/_PLANKS|_CLOTH|_METALBAR|_LEATHER|_STONEBLOCK/.test(itemId)) return { low: 0.6, high: 1.6, maxMargin: 42 };
    if (/_BAG|_CAPE/.test(itemId)) return { low: 0.5, high: 1.7, maxMargin: 55 };
    if (/_MEAL_|_POTION_/.test(itemId)) return { low: 0.55, high: 1.75, maxMargin: 60 };
    return { low: 0.55, high: 1.6, maxMargin: 50 };
  }

  function getCityScope(routeMode) {
    return routeMode === 'safe' ? SAFE_LOCATIONS : LOCATIONS;
  }

  async function apiFetchPrices({ itemIds, qualities, server, routeMode }) {
    if (!itemIds.length) return [];
    const params = new URLSearchParams({
      items: itemIds.join(','),
      qualities: qualities.join(','),
      server,
      locations: getCityScope(routeMode).join(',')
    });
    const response = await fetch(`/api/albion-prices?${params.toString()}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok) {
      throw new Error(payload.error || 'Falha ao consultar o mercado.');
    }
    return payload.data || [];
  }

  async function fetchInChunks({ entries, server, routeMode }) {
    const itemIds = [...new Set(entries.map((entry) => entry.itemId))];
    const qualities = [...new Set(entries.flatMap((entry) => entry.qualityRange))];
    const chunks = [];
    for (let i = 0; i < itemIds.length; i += CHUNK_SIZE) {
      chunks.push(itemIds.slice(i, i + CHUNK_SIZE));
    }
    const combined = [];
    for (const chunk of chunks) {
      const rows = await apiFetchPrices({ itemIds: chunk, qualities, server, routeMode });
      combined.push(...rows);
    }
    return combined;
  }

  function normalizeMarketRows(rows) {
    return rows
      .map((row) => ({
        itemId: row.item_id,
        city: row.city,
        quality: Number(row.quality || 1),
        sell: Number(row.sell_price_min || 0),
        sellDate: row.sell_price_min_date || null,
        buy: Number(row.buy_price_max || 0),
        buyDate: row.buy_price_max_date || null
      }))
      .filter((row) => row.itemId && row.city && row.quality);
  }

  function filterRowsByPlausibility(rows, type, maxAgeHours, itemId) {
    const values = rows
      .map((row) => type === 'sell' ? row.sell : row.buy)
      .filter((value) => Number.isFinite(value) && value > 0);

    if (values.length < 2) return [];

    const med = median(values);
    const q1 = percentile(values, 0.25);
    const q3 = percentile(values, 0.75);
    const iqr = Math.max(1, q3 - q1);
    const profile = getCategoryProfile(itemId);

    const lower = Math.max(med * profile.low, q1 - (1.2 * iqr));
    const upper = Math.min(med * profile.high, q3 + (1.4 * iqr));

    return rows.filter((row) => {
      const price = type === 'sell' ? row.sell : row.buy;
      const age = type === 'sell' ? hoursSince(row.sellDate) : hoursSince(row.buyDate);
      if (!Number.isFinite(price) || price <= 0) return false;
      if (age > maxAgeHours) return false;
      return price >= lower && price <= upper;
    });
  }

  function computeConfidence({ sellCount, buyCount, margin, sourceType, directCities, buyCities }) {
    let score = 0;
    score += Math.min(sellCount, 5) * 12;
    score += Math.min(buyCount, 5) * 8;
    score += Math.max(0, Math.min(margin, 30));
    if (sourceType === 'direct' && directCities >= 3) score += 10;
    if (sourceType === 'buy' && buyCities >= 2) score += 8;
    if (score >= 75) return 'Alta';
    if (score >= 55) return 'Média';
    return 'Baixa';
  }

  function computeOpportunity(itemMeta, itemRows, saleMode = 'auto', capital = 300000, forRadar = false) {
    const maxSellAge = forRadar ? MAX_SELL_AGE_HOURS_RADAR : MAX_SELL_AGE_HOURS;
    const maxBuyAge = forRadar ? MAX_BUY_AGE_HOURS_RADAR : MAX_BUY_AGE_HOURS;

    const sellRowsFresh = itemRows.filter((row) => row.sell > 0 && hoursSince(row.sellDate) <= maxSellAge);
    const buyRowsFresh = itemRows.filter((row) => row.buy > 0 && hoursSince(row.buyDate) <= maxBuyAge);
    const validSellRows = filterRowsByPlausibility(sellRowsFresh, 'sell', maxSellAge, itemMeta.itemId);
    const validBuyRows = filterRowsByPlausibility(buyRowsFresh, 'buy', maxBuyAge, itemMeta.itemId);

    if (!validSellRows.length) {
      return { ok: false, reason: 'Sem vendas válidas recentes.', rawRows: itemRows };
    }

    const buyFrom = [...validSellRows].sort((a, b) => a.sell - b.sell)[0];
    const directCandidates = validSellRows
      .filter((row) => row.city !== buyFrom.city)
      .map((row) => {
        const grossSale = row.sell;
        const netSale = grossSale * (1 - (FEE_PERCENT / 100));
        const profit = netSale - buyFrom.sell;
        const margin = profit > 0 ? (profit / buyFrom.sell) * 100 : 0;
        return {
          sourceType: 'direct',
          buyFrom,
          sellTo: row,
          salePrice: grossSale,
          netSale,
          unitProfit: profit,
          margin,
          updatedBuy: buyFrom.sellDate,
          updatedSell: row.sellDate
        };
      })
      .filter((candidate) => candidate.unitProfit > 0);

    const buyCandidates = validBuyRows
      .filter((row) => row.city !== buyFrom.city)
      .map((row) => {
        const profit = row.buy - buyFrom.sell;
        const margin = profit > 0 ? (profit / buyFrom.sell) * 100 : 0;
        return {
          sourceType: 'buy',
          buyFrom,
          sellTo: row,
          salePrice: row.buy,
          netSale: row.buy,
          unitProfit: profit,
          margin,
          updatedBuy: buyFrom.sellDate,
          updatedSell: row.buyDate
        };
      })
      .filter((candidate) => candidate.unitProfit > 0);

    const profile = getCategoryProfile(itemMeta.itemId);
    const plausibleDirect = directCandidates.filter((candidate) => candidate.margin <= profile.maxMargin && validSellRows.length >= 3);
    const plausibleBuy = buyCandidates.filter((candidate) => candidate.margin <= Math.min(32, profile.maxMargin) && validBuyRows.length >= 2);

    let candidates = [];
    if (saleMode === 'direct') candidates = plausibleDirect;
    else if (saleMode === 'buy') candidates = plausibleBuy;
    else candidates = [...plausibleBuy, ...plausibleDirect];

    if (!candidates.length) {
      return {
        ok: false,
        reason: 'Sem arbitragem segura no momento.',
        rawRows: itemRows,
        buyFrom,
        validSellRows,
        validBuyRows
      };
    }

    candidates.sort((a, b) => b.unitProfit - a.unitProfit || b.margin - a.margin);
    const best = candidates[0];

    const safeQtyLimit = best.buyFrom.sell < 3000 ? 999 : best.buyFrom.sell < 15000 ? 350 : 120;
    const affordableQty = Math.max(1, Math.floor(capital / Math.max(best.buyFrom.sell, 1)));
    const safeQty = Math.max(1, Math.min(affordableQty, safeQtyLimit));
    const totalProfit = best.unitProfit * safeQty;
    const confidence = computeConfidence({
      sellCount: validSellRows.length,
      buyCount: validBuyRows.length,
      margin: best.margin,
      sourceType: best.sourceType,
      directCities: validSellRows.length,
      buyCities: validBuyRows.length
    });

    return {
      ok: true,
      ...best,
      safeQty,
      totalProfit,
      confidence,
      validSellRows,
      validBuyRows,
      rawRows: itemRows
    };
  }

  function createMarketEntries(mode) {
    return mode === 'full' ? getFullScannerItems() : getScannerBaseItems();
  }

  function fillSelect(select, options) {
    select.innerHTML = options.map((option) => `<option value="${option.value}">${option.label}</option>`).join('');
  }

  function initStaticSelects() {
    fillSelect($('#serverSelect'), SERVER_OPTIONS);
    fillSelect($('#routeModeSelect'), [
      { value: 'safe', label: 'Somente azul/amarela' },
      { value: 'all', label: 'Aceita RED + Black Market' }
    ]);
    fillSelect($('#saleModeScanner'), [
      { value: 'auto', label: 'Melhor dos dois' },
      { value: 'direct', label: 'Revenda direta' },
      { value: 'buy', label: 'Pedido de compra' }
    ]);
    fillSelect($('#saleModeRadar'), [
      { value: 'auto', label: 'Melhor dos dois' },
      { value: 'direct', label: 'Revenda direta' },
      { value: 'buy', label: 'Pedido de compra' }
    ]);
    fillSelect($('#scannerQualityRange'), [
      { value: '123', label: 'Normal + Bom + Excelente' },
      { value: '1', label: 'Somente Normal' },
      { value: '12', label: 'Normal + Bom' },
      { value: '12345', label: 'Todas as qualidades' }
    ]);
  }

  function initRadarCatalog() {
    const familySelect = $('#radarFamily');
    const groupSelect = $('#radarGroup');
    const itemSelect = $('#radarItem');
    const tierSelect = $('#radarTier');
    const enchantSelect = $('#radarEnchant');
    const qualitySelect = $('#radarQuality');

    fillSelect(familySelect, families.map((family) => ({ value: family.key, label: family.label })));

    function refreshGroups() {
      const family = families.find((entry) => entry.key === familySelect.value) || families[0];
      fillSelect(groupSelect, family.groups.map((group) => ({ value: group.key, label: group.label })));
      refreshItems();
    }

    function refreshItems() {
      const family = families.find((entry) => entry.key === familySelect.value) || families[0];
      const group = family.groups.find((entry) => entry.key === groupSelect.value) || family.groups[0];
      fillSelect(itemSelect, group.items.map((item) => ({ value: item.key, label: item.label })));
      refreshVariants();
    }

    function refreshVariants() {
      const item = allItems.find((entry) => entry.key === itemSelect.value);
      if (!item) return;
      fillSelect(tierSelect, item.tiers.map((tier) => ({ value: String(tier), label: `T${tier}` })));
      fillSelect(enchantSelect, item.enchants.map((enchant) => ({ value: String(enchant), label: ENCHANTMENT_NAMES[enchant] })));
      const qualities = item.qualities === false ? [1] : [1,2,3,4,5];
      fillSelect(qualitySelect, qualities.map((quality) => ({ value: String(quality), label: QUALITY_NAMES[quality] })));
    }

    familySelect.addEventListener('change', refreshGroups);
    groupSelect.addEventListener('change', refreshItems);
    itemSelect.addEventListener('change', refreshVariants);

    refreshGroups();
  }

  function setStatus(text, tone = 'neutral') {
    const node = $('#scannerStatus');
    node.textContent = text;
    node.dataset.tone = tone;
  }

  function getSelectedQualitiesFromRange(value) {
    return [...new Set(value.split('').map((char) => Number(char)).filter(Boolean))];
  }

  function applyQualityRange(entries, selectedQualities) {
    return entries.map((entry) => ({ ...entry, qualityRange: entry.qualityRange.filter((quality) => selectedQualities.includes(quality)) })).filter((entry) => entry.qualityRange.length);
  }

  async function runScanner(mode) {
    const server = $('#serverSelect').value;
    const routeMode = $('#routeModeSelect').value;
    const saleMode = $('#saleModeScanner').value;
    const capital = Number($('#capitalInput').value || 0);
    const qualityRange = getSelectedQualitiesFromRange($('#scannerQualityRange').value);

    state.lastScannerMode = mode;
    setStatus('Varrendo mercado...', 'loading');
    $('#opportunityTableBody').innerHTML = '';
    $('#bestOpportunityTitle').textContent = 'Lendo mercado...';
    $('#bestOpportunityText').textContent = 'Aguarde, estou filtrando dados plausíveis.';

    try {
      let entries = createMarketEntries(mode);
      entries = applyQualityRange(entries, qualityRange);
      const rows = normalizeMarketRows(await fetchInChunks({ entries, server, routeMode }));
      const byKey = new Map();
      rows.forEach((row) => {
        const key = `${row.itemId}__${row.quality}`;
        if (!byKey.has(key)) byKey.set(key, []);
        byKey.get(key).push(row);
      });

      const results = [];
      entries.forEach((entry) => {
        entry.qualityRange.forEach((quality) => {
          const key = `${entry.itemId}__${quality}`;
          const itemRows = byKey.get(key) || [];
          if (!itemRows.length) return;
          const result = computeOpportunity({ ...entry, quality }, itemRows, saleMode, capital, false);
          if (!result.ok) return;
          if (result.confidence === 'Baixa') return;
          if (result.unitProfit <= 0 || result.totalProfit <= 0) return;
          results.push({
            ...result,
            quality,
            itemId: entry.itemId,
            item: entry.item,
            tier: entry.tier,
            enchantment: entry.enchantment,
            displayName: renderName({ item: entry.item, tier: entry.tier, enchantment: entry.enchantment, quality })
          });
        });
      });

      results.sort((a, b) => b.totalProfit - a.totalProfit || b.unitProfit - a.unitProfit);
      state.lastScannerResults = results;
      renderScanner(results);

      if (!results.length) {
        setStatus('Nenhuma oportunidade segura encontrada com os filtros atuais.', 'warning');
      } else {
        setStatus(`Varredura concluída: ${results.length} oportunidades seguras.`, 'success');
      }
    } catch (error) {
      console.error(error);
      state.lastScannerResults = [];
      setStatus(error.message || 'Erro ao consultar o mercado.', 'error');
      $('#bestOpportunityTitle').textContent = 'Mercado indisponível';
      $('#bestOpportunityText').textContent = 'Revise a conexão ou tente novamente em alguns segundos.';
      $('#opportunityTableBody').innerHTML = '<tr><td colspan="12" class="table-empty">Erro na requisição.</td></tr>';
    }
  }

  function renderScanner(results) {
    const tbody = $('#opportunityTableBody');
    if (!results.length) {
      tbody.innerHTML = '<tr><td colspan="12" class="table-empty">Nenhuma oportunidade segura encontrada.</td></tr>';
      $('#bestOpportunityTitle').textContent = 'Sem flip seguro agora';
      $('#bestOpportunityText').textContent = 'Com os filtros atuais, o sistema preferiu não inventar lucro.';
      return;
    }

    const best = results[0];
    $('#bestOpportunityTitle').textContent = best.displayName;
    $('#bestOpportunityText').textContent = `Comprar em ${best.buyFrom.city} por ${fmtNumber(best.buyFrom.sell)} e vender em ${best.sellTo.city} via ${SALE_MODES[best.sourceType]} para buscar ${fmtNumber(best.totalProfit)} de lucro seguro.`;
    $('#marketHealthPill').textContent = `AlbionData online · ${results.length} oportunidades seguras`;

    tbody.innerHTML = results.slice(0, 120).map((result) => {
      const image = iconUrl(result.itemId, result.quality);
      return `
        <tr>
          <td>
            <div class="item-cell">
              <img src="${image}" alt="${result.displayName}" loading="lazy" />
              <div>
                <div class="item-title">${result.displayName}</div>
                <div class="item-sub">${result.itemId}</div>
              </div>
            </div>
          </td>
          <td>${QUALITY_NAMES[result.quality]}</td>
          <td>${result.buyFrom.city}</td>
          <td>${fmtNumber(result.buyFrom.sell)}</td>
          <td>${result.sellTo.city}</td>
          <td>${SALE_MODES[result.sourceType]}</td>
          <td>${fmtNumber(result.salePrice)}</td>
          <td>${fmtNumber(result.unitProfit)}</td>
          <td>${fmtNumber(result.safeQty)}</td>
          <td>${fmtNumber(result.totalProfit)}</td>
          <td>${fmtPercent(result.margin)}</td>
          <td><span class="confidence confidence-${result.confidence.toLowerCase()}">${result.confidence}</span></td>
        </tr>
      `;
    }).join('');
  }

  async function runRadar() {
    const server = $('#serverSelect').value;
    const routeMode = $('#routeModeSelect').value;
    const saleMode = $('#saleModeRadar').value;
    const capital = Number($('#capitalInput').value || 0);
    const familyKey = $('#radarFamily').value;
    const groupKey = $('#radarGroup').value;
    const itemKey = $('#radarItem').value;
    const tier = Number($('#radarTier').value);
    const enchantment = Number($('#radarEnchant').value);
    const quality = Number($('#radarQuality').value);

    const item = allItems.find((entry) => entry.familyKey === familyKey && entry.groupKey === groupKey && entry.key === itemKey);
    if (!item) return;
    const itemId = buildItemId(item, tier, enchantment);

    const resultNode = $('#radarResult');
    resultNode.innerHTML = '<div class="empty-state">Consultando o item...</div>';

    try {
      const rows = normalizeMarketRows(await apiFetchPrices({ itemIds: [itemId], qualities: [quality], server, routeMode }));
      const filtered = rows.filter((row) => row.quality === quality);
      const result = computeOpportunity({ item, itemId, tier, enchantment, quality }, filtered, saleMode, capital, true);
      renderRadar(item, itemId, tier, enchantment, quality, filtered, result);
    } catch (error) {
      console.error(error);
      resultNode.innerHTML = `<div class="error-box">${error.message || 'Erro ao consultar o item.'}</div>`;
    }
  }

  function renderRadar(item, itemId, tier, enchantment, quality, rows, result) {
    const resultNode = $('#radarResult');
    const title = renderName({ item, tier, enchantment, quality });
    const tableRows = [...rows]
      .sort((a, b) => LOCATIONS.indexOf(a.city) - LOCATIONS.indexOf(b.city))
      .map((row) => `
        <tr>
          <td>${row.city}</td>
          <td>${fmtPrice(row.sell)}</td>
          <td>${fmtPrice(row.buy)}</td>
          <td>${formatDateBR(row.sellDate)}</td>
          <td>${formatDateBR(row.buyDate)}</td>
        </tr>
      `).join('');

    if (!rows.length) {
      resultNode.innerHTML = '<div class="warning-box">Nenhum dado encontrado para esse item e qualidade.</div>';
      return;
    }

    const cheapestSell = [...rows].filter((row) => row.sell > 0).sort((a, b) => a.sell - b.sell)[0];
    const highestDirect = [...rows].filter((row) => row.sell > 0).sort((a, b) => b.sell - a.sell)[0];
    const highestBuy = [...rows].filter((row) => row.buy > 0).sort((a, b) => b.buy - a.buy)[0];
    const image = iconUrl(itemId, quality);

    const summary = result.ok ? `
      <div class="summary-grid">
        <div class="metric-card"><span>Compra segura</span><strong>${cheapestSell ? `${cheapestSell.city} · ${fmtPrice(cheapestSell.sell)}` : '—'}</strong></div>
        <div class="metric-card"><span>Saída segura</span><strong>${result.sellTo.city} · ${fmtPrice(result.salePrice)}</strong></div>
        <div class="metric-card"><span>Modo usado</span><strong>${SALE_MODES[result.sourceType]}</strong></div>
        <div class="metric-card"><span>Lucro por unidade</span><strong>${fmtPrice(result.unitProfit)}</strong></div>
        <div class="metric-card"><span>Margem</span><strong>${fmtPercent(result.margin)}</strong></div>
        <div class="metric-card"><span>Confiança</span><strong>${result.confidence}</strong></div>
      </div>
      <div class="success-box">Leitura segura: comprar em ${result.buyFrom.city} por ${fmtNumber(result.buyFrom.sell)} e sair em ${result.sellTo.city} via ${SALE_MODES[result.sourceType]}.</div>
    ` : `
      <div class="summary-grid">
        <div class="metric-card"><span>Menor venda vista</span><strong>${cheapestSell ? `${cheapestSell.city} · ${fmtPrice(cheapestSell.sell)}` : '—'}</strong></div>
        <div class="metric-card"><span>Maior revenda vista</span><strong>${highestDirect ? `${highestDirect.city} · ${fmtPrice(highestDirect.sell)}` : '—'}</strong></div>
        <div class="metric-card"><span>Maior pedido visto</span><strong>${highestBuy ? `${highestBuy.city} · ${fmtPrice(highestBuy.buy)}` : '—'}</strong></div>
        <div class="metric-card"><span>Leitura segura</span><strong>Sem arbitragem</strong></div>
      </div>
      <div class="warning-box">${result.reason || 'Sem arbitragem segura no momento.'} O mercado bruto abaixo continua visível para consulta.</div>
    `;

    resultNode.innerHTML = `
      <div class="radar-header-card">
        <div class="item-cell large">
          <img src="${image}" alt="${title}" />
          <div>
            <div class="item-title">${title}</div>
            <div class="item-sub">${itemId}</div>
          </div>
        </div>
        ${summary}
      </div>
      <div class="table-wrap small-top-gap">
        <table>
          <thead>
            <tr>
              <th>Cidade</th>
              <th>Menor venda</th>
              <th>Maior pedido</th>
              <th>Atualização venda (BR)</th>
              <th>Atualização compra (BR)</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    `;
  }

  function setupTabs() {
    $$('[data-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.tab;
        $$('[data-tab]').forEach((item) => item.classList.toggle('active', item === button));
        $$('[data-panel]').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === target));
      });
    });
  }

  function wireEvents() {
    $('#scanBaseButton').addEventListener('click', () => runScanner('base'));
    $('#scanFullButton').addEventListener('click', () => runScanner('full'));
    $('#radarButton').addEventListener('click', runRadar);
  }

  function initRoadmap() {
    $('#roadmapNext').innerHTML = `
      <li>Fase 1 agora: núcleo de flips + radar de item.</li>
      <li>Fase 2: filtros extras, imagens melhores e score refinado.</li>
      <li>Fase 3: craft profissional ligado ao mercado.</li>
      <li>Fase 4: Supabase e histórico.</li>
      <li>Fase 5: IA do Google para explicação e estratégia.</li>
    `;
  }

  function init() {
    initStaticSelects();
    initRadarCatalog();
    setupTabs();
    wireEvents();
    initRoadmap();
    $('#capitalInput').value = '300000';
    $('#serverSelect').value = 'west';
    $('#routeModeSelect').value = 'safe';
    $('#saleModeScanner').value = 'auto';
    $('#saleModeRadar').value = 'auto';
    $('#scannerQualityRange').value = '123';
    setStatus('Pronto para varrer o mercado.', 'neutral');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
