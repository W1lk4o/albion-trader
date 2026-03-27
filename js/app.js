(() => {
  const { families, allItems, QUALITY_NAMES, ENCHANTMENT_NAMES, buildItemId, renderName, iconUrl, getScannerBaseItems, getFullScannerItems } = window.ALBION_CATALOG;
  const LOCATIONS = ['Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford', 'Caerleon'];
  const SAFE_LOCATIONS = ['Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const SERVER_OPTIONS = [{ value: 'west', label: 'Americas' }, { value: 'europe', label: 'Europe' }, { value: 'east', label: 'Asia' }];
  const SALE_MODES = { auto: 'Melhor dos dois', direct: 'Revenda direta', buy: 'Pedido de compra' };
  const FEE_PERCENT = 6.5;
  const MAX_SELL_AGE_HOURS = 10;
  const MAX_BUY_AGE_HOURS = 8;
  const RADAR_SELL_AGE_HOURS = 24;
  const RADAR_BUY_AGE_HOURS = 24;

  const state = { lastScannerResults: [], sortKey: 'totalProfit', sortDir: 'desc', isScanning: false };
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const fmtNumber = (v) => new Intl.NumberFormat('pt-BR').format(Math.round(v || 0));
  const fmtPrice = (v) => (!Number.isFinite(v) || v <= 0 ? '—' : `${fmtNumber(v)} prata`);
  const fmtPercent = (v) => (!Number.isFinite(v) ? '—' : `${v.toFixed(1).replace('.', ',')}%`);
  function formatDateBR(value) { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false }); }
  function hoursSince(value) { if (!value) return Number.POSITIVE_INFINITY; const d = new Date(value); return Number.isNaN(d.getTime()) ? Number.POSITIVE_INFINITY : (Date.now() - d.getTime()) / 36e5; }
  function median(values) { if (!values.length) return 0; const s = [...values].sort((a,b)=>a-b); const m = Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; }
  function percentile(values, p) { if (!values.length) return 0; const s=[...values].sort((a,b)=>a-b); const i=(s.length-1)*p; const lo=Math.floor(i), hi=Math.ceil(i); return lo===hi?s[lo]:s[lo]+(s[hi]-s[lo])*(i-lo); }

  function getCategoryProfile(itemId) {
    if (/_WOOD|_FIBER|_ORE|_HIDE|_ROCK/.test(itemId)) return { low: 0.86, high: 1.14, maxMargin: 16, minSell: 3, minBuy: 2, maxDirectMultiple: 1.15, maxBuyMultiple: 1.10 };
    if (/_PLANKS|_CLOTH|_METALBAR|_LEATHER|_STONEBLOCK/.test(itemId)) return { low: 0.87, high: 1.13, maxMargin: 14, minSell: 3, minBuy: 2, maxDirectMultiple: 1.14, maxBuyMultiple: 1.08 };
    if (/_BAG|_CAPE/.test(itemId)) return { low: 0.90, high: 1.10, maxMargin: 10, minSell: 3, minBuy: 2, maxDirectMultiple: 1.10, maxBuyMultiple: 1.06 };
    return { low: 0.88, high: 1.12, maxMargin: 12, minSell: 3, minBuy: 2, maxDirectMultiple: 1.12, maxBuyMultiple: 1.07 };
  }
  const getCityScope = (routeMode) => routeMode === 'safe' ? SAFE_LOCATIONS : LOCATIONS;

  async function apiFetchPrices({ itemIds, qualities, server, routeMode, onProgress }) {
    const uniqueIds = [...new Set(itemIds.filter(Boolean))];
    const chunks = [];
    const chunkSize = 24;
    for (let i = 0; i < uniqueIds.length; i += chunkSize) chunks.push(uniqueIds.slice(i, i + chunkSize));
    const out = [];
    for (let index = 0; index < chunks.length; index += 1) {
      const response = await fetch('/api/albion-prices', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ itemIds: chunks[index], qualities, server, locations: getCityScope(routeMode) })
      });
      const payload = await response.json().catch(() => ([]));
      if (!response.ok) throw new Error(payload?.error || 'Falha ao consultar o Albion Data.');
      if (Array.isArray(payload)) out.push(...payload);
      if (onProgress) onProgress(index + 1, chunks.length);
    }
    return out;
  }

  function normalizeMarketRows(rows) {
    return rows.map((row) => ({ itemId: row.item_id, city: row.city, quality: Number(row.quality || 1), sell: Number(row.sell_price_min || 0), sellDate: row.sell_price_min_date || null, buy: Number(row.buy_price_max || 0), buyDate: row.buy_price_max_date || null })).filter((r) => r.itemId && r.city && r.quality);
  }

  function filterRowsByPlausibility(rows, type, maxAgeHours, itemId) {
    const priceKey = type === 'sell' ? 'sell' : 'buy';
    const dateKey = type === 'sell' ? 'sellDate' : 'buyDate';
    const fresh = rows.filter((r) => r[priceKey] > 0 && hoursSince(r[dateKey]) <= maxAgeHours);
    const values = fresh.map((r) => r[priceKey]).filter(Boolean);
    if (values.length < 3) return [];
    const med = median(values), q1 = percentile(values, .25), q3 = percentile(values, .75), iqr = Math.max(1, q3-q1);
    const profile = getCategoryProfile(itemId);
    const lower = Math.max(q1 - iqr * .35, med * profile.low);
    const upper = Math.min(q3 + iqr * .35, med * profile.high);
    return fresh.filter((r) => r[priceKey] >= lower && r[priceKey] <= upper);
  }

  function computeConfidence({ sellCount, buyCount, margin, sourceType }) {
    let score = 0; score += Math.min(sellCount,5)*10; score += Math.min(buyCount,4)*8; score += Math.min(margin,18)*2; if (sourceType==='buy') score += 10;
    return score >= 70 ? 'Alta' : score >= 50 ? 'Média' : 'Baixa';
  }

  function computeOpportunity(itemMeta, itemRows, saleMode='auto', capital=300000, forRadar=false) {
    const maxSellAge = forRadar ? RADAR_SELL_AGE_HOURS : MAX_SELL_AGE_HOURS;
    const maxBuyAge = forRadar ? RADAR_BUY_AGE_HOURS : MAX_BUY_AGE_HOURS;
    const profile = getCategoryProfile(itemMeta.itemId);
    const validSellRows = filterRowsByPlausibility(itemRows, 'sell', maxSellAge, itemMeta.itemId);
    const validBuyRows = filterRowsByPlausibility(itemRows, 'buy', maxBuyAge, itemMeta.itemId);
    if (validSellRows.length < profile.minSell) return { ok:false, reason:'Poucas vendas coerentes para leitura segura.', rawRows:itemRows };
    const sellMedian = median(validSellRows.map(r=>r.sell));
    const buyBand = validSellRows.filter(r => r.sell <= sellMedian * 1.05).sort((a,b)=>a.sell-b.sell);
    const buyFrom = buyBand[0] || [...validSellRows].sort((a,b)=>a.sell-b.sell)[0];
    if (!buyFrom) return { ok:false, reason:'Sem compra plausível.', rawRows:itemRows };

    const directCandidates = validSellRows.filter(r => r.city !== buyFrom.city).map((r) => {
      const cappedSale = Math.min(r.sell, sellMedian * profile.maxDirectMultiple);
      const netSale = cappedSale * (1 - FEE_PERCENT/100);
      const unitProfit = netSale - buyFrom.sell;
      const margin = unitProfit > 0 ? unitProfit / buyFrom.sell * 100 : 0;
      return { sourceType:'direct', buyFrom, sellTo:r, salePrice:cappedSale, netSale, unitProfit, margin, updatedBuy:buyFrom.sellDate, updatedSell:r.sellDate };
    }).filter(c => c.unitProfit > 0 && c.margin > 1.5 && c.margin <= profile.maxMargin && c.salePrice <= buyFrom.sell * profile.maxDirectMultiple);

    const buyCandidates = validBuyRows.length >= profile.minBuy ? validBuyRows.filter(r => r.city !== buyFrom.city).map((r) => {
      const cappedBuy = Math.min(r.buy, buyFrom.sell * profile.maxBuyMultiple);
      const unitProfit = cappedBuy - buyFrom.sell;
      const margin = unitProfit > 0 ? unitProfit / buyFrom.sell * 100 : 0;
      return { sourceType:'buy', buyFrom, sellTo:r, salePrice:cappedBuy, netSale:cappedBuy, unitProfit, margin, updatedBuy:buyFrom.sellDate, updatedSell:r.buyDate };
    }).filter(c => c.unitProfit > 0 && c.margin > 1 && c.margin <= Math.min(profile.maxMargin, 10)) : [];

    let candidates = saleMode==='direct' ? directCandidates : saleMode==='buy' ? buyCandidates : [...buyCandidates, ...directCandidates];
    candidates = candidates.filter(c => c.unitProfit <= buyFrom.sell * .25);
    if (!candidates.length) return { ok:false, reason:'Sem arbitragem segura no momento.', rawRows:itemRows, buyFrom, validSellRows, validBuyRows };
    candidates.sort((a,b)=>b.unitProfit-a.unitProfit || b.margin-a.margin);
    const best = candidates[0];
    const safeQtyLimit = buyFrom.sell < 5000 ? 300 : buyFrom.sell < 20000 ? 120 : 40;
    const affordableQty = Math.max(1, Math.floor(capital / Math.max(buyFrom.sell, 1)));
    const safeQty = Math.max(1, Math.min(affordableQty, safeQtyLimit));
    const totalProfit = best.unitProfit * safeQty;
    const confidence = computeConfidence({ sellCount: validSellRows.length, buyCount: validBuyRows.length, margin: best.margin, sourceType: best.sourceType });
    return { ok:true, ...best, safeQty, totalProfit, confidence, validSellRows, validBuyRows, rawRows:itemRows };
  }

  const createMarketEntries = (mode) => mode === 'full' ? getFullScannerItems() : getScannerBaseItems();
  function fillSelect(select, options) { select.innerHTML = options.map((o)=>`<option value="${o.value}">${o.label}</option>`).join(''); }
  function initStaticSelects() {
    fillSelect($('#serverSelect'), SERVER_OPTIONS);
    fillSelect($('#routeModeSelect'), [{value:'safe',label:'Azul / Amarela'},{value:'all',label:'Tudo'}]);
    fillSelect($('#saleModeScanner'), [{value:'auto',label:'Melhor dos dois'},{value:'direct',label:'Revenda direta'},{value:'buy',label:'Pedido de compra'}]);
    fillSelect($('#saleModeRadar'), [{value:'auto',label:'Melhor dos dois'},{value:'direct',label:'Revenda direta'},{value:'buy',label:'Pedido de compra'}]);
    fillSelect($('#scannerQualityRange'), [{value:'1',label:'Somente Normal'},{value:'12',label:'Normal + Bom'},{value:'123',label:'Normal + Bom + Excelente'},{value:'12345',label:'Todas as qualidades'}]);
  }

  function initRadarCatalog() {
    const familySelect = $('#radarFamily'), groupSelect = $('#radarGroup'), itemSelect = $('#radarItem'), tierSelect = $('#radarTier'), enchantSelect = $('#radarEnchant'), qualitySelect = $('#radarQuality');
    fillSelect(familySelect, families.map((f)=>({value:f.key,label:f.label})));
    function refreshGroups() { const family = families.find((e)=>e.key===familySelect.value) || families[0]; fillSelect(groupSelect, family.groups.map((g)=>({value:g.key,label:g.label}))); refreshItems(); }
    function refreshItems() { const family = families.find((e)=>e.key===familySelect.value) || families[0]; const group = family.groups.find((e)=>e.key===groupSelect.value) || family.groups[0]; fillSelect(itemSelect, group.items.map((i)=>({value:i.key,label:i.label}))); refreshVariants(); }
    function refreshVariants() { const item = allItems.find((e)=>e.key===itemSelect.value); if (!item) return; fillSelect(tierSelect, item.tiers.map((t)=>({value:String(t),label:`T${t}`}))); fillSelect(enchantSelect, item.enchants.map((e)=>({value:String(e),label:ENCHANTMENT_NAMES[e]}))); const qualities = item.qualities===false?[1]:[1,2,3,4,5]; fillSelect(qualitySelect, qualities.map((q)=>({value:String(q),label:QUALITY_NAMES[q]}))); }
    familySelect.addEventListener('change', refreshGroups); groupSelect.addEventListener('change', refreshItems); itemSelect.addEventListener('change', refreshVariants); refreshGroups();
  }

  function setStatus(text, tone='neutral') { const n = $('#scannerStatus'); n.textContent = text; n.dataset.tone = tone; }
  const getSelectedQualitiesFromRange = (value) => [...new Set(value.split('').map(Number).filter(Boolean))];
  const applyQualityRange = (entries, selected) => entries.map((e)=>({ ...e, qualityRange:e.qualityRange.filter((q)=>selected.includes(q)) })).filter((e)=>e.qualityRange.length);

  async function runScanner(mode) {
    const server = $('#serverSelect').value;
    const routeMode = $('#routeModeSelect').value;
    const saleMode = $('#saleModeScanner').value;
    const capital = Number($('#capitalInput').value || 0);
    const qualityRange = getSelectedQualitiesFromRange($('#scannerQualityRange').value);
    setStatus('Varrendo mercado...', 'loading');
    updateScanProgress(0, 1, 'Preparando catálogo...');
    $('#opportunityTableBody').innerHTML = '<tr><td colspan="12" class="table-empty">Carregando...</td></tr>';
    $('#bestOpportunityTitle').textContent = 'Lendo mercado...';
    $('#bestOpportunityText').textContent = 'Filtrando oportunidades seguras.';
    state.isScanning = true;
    try {
      const entries = applyQualityRange(createMarketEntries(mode), qualityRange);
      const rawRows = await apiFetchPrices({
        itemIds: entries.map((e) => e.itemId),
        qualities: [...new Set(entries.flatMap((e) => e.qualityRange))],
        server,
        routeMode,
        onProgress: (current, total) => updateScanProgress(current, total, `Consultando Albion Data (${current}/${total} lotes)...`)
      });
      updateScanProgress(1, 1, 'Processando oportunidades...');
      const rows = normalizeMarketRows(rawRows);
      const byKey = new Map();
      rows.forEach((row) => {
        const key = `${row.itemId}__${row.quality}`;
        if (!byKey.has(key)) byKey.set(key, []);
        byKey.get(key).push(row);
      });
      const results = [];
      for (const entry of entries) {
        for (const quality of entry.qualityRange) {
          const itemRows = byKey.get(`${entry.itemId}__${quality}`) || [];
          if (!itemRows.length) continue;
          const result = computeOpportunity({ ...entry, quality }, itemRows, saleMode, capital, false);
          if (!result.ok) continue;
          results.push({
            ...result,
            quality,
            itemId: entry.itemId,
            item: entry.item,
            tier: entry.tier,
            enchantment: entry.enchantment,
            displayName: renderName({ item: entry.item, tier: entry.tier, enchantment: entry.enchantment, quality })
          });
        }
      }
      state.lastScannerResults = results;
      renderScanner(results);
      hideScanProgress();
      setStatus(results.length ? `Varredura concluída: ${results.length} oportunidades seguras.` : 'Nenhuma oportunidade segura encontrada com os filtros atuais.', results.length ? 'success' : 'warning');
    } catch (error) {
      console.error(error);
      state.lastScannerResults = [];
      hideScanProgress();
      setStatus(error.message || 'Erro ao consultar o mercado.', 'error');
      $('#bestOpportunityTitle').textContent = 'Mercado indisponível';
      $('#bestOpportunityText').textContent = 'Revise a conexão e tente novamente.';
      $('#opportunityTableBody').innerHTML = '<tr><td colspan="12" class="table-empty">Erro na requisição.</td></tr>';
    } finally {
      state.isScanning = false;
    }
  }

  const confidenceRank = (v) => v==='Alta'?3:v==='Média'?2:1;
  function sortScannerResults(results) {
    const direction = state.sortDir === 'asc' ? 1 : -1, key = state.sortKey;
    const getters = { displayName:r=>r.displayName||'', quality:r=>r.quality||0, buyCity:r=>r.buyFrom?.city||'', buyPrice:r=>r.buyFrom?.sell||0, sellCity:r=>r.sellTo?.city||'', sourceType:r=>SALE_MODES[r.sourceType]||'', salePrice:r=>r.salePrice||0, unitProfit:r=>r.unitProfit||0, safeQty:r=>r.safeQty||0, totalProfit:r=>r.totalProfit||0, margin:r=>r.margin||0, confidenceRank:r=>confidenceRank(r.confidence) };
    const getter = getters[key] || getters.totalProfit;
    return [...results].sort((a,b)=>{ const av=getter(a), bv=getter(b); if (typeof av==='string' || typeof bv==='string') return String(av).localeCompare(String(bv),'pt-BR')*direction; return ((av||0)-(bv||0))*direction; });
  }
  function updateSortHeaders() { $$('#opportunityTable th[data-sort]').forEach((th)=>{ const base = th.dataset.label || th.textContent.replace(/[↑↓]/g,'').trim(); th.dataset.label=base; const active = th.dataset.sort===state.sortKey; th.textContent = `${base}${active ? (state.sortDir==='asc'?' ↑':' ↓') : ''}`; }); }

  function renderScanner(results) {
    const tbody = $('#opportunityTableBody'); updateSortHeaders();
    if (!results.length) { tbody.innerHTML='<tr><td colspan="12" class="table-empty">Nenhuma oportunidade segura encontrada.</td></tr>'; $('#bestOpportunityTitle').textContent='Sem flip seguro agora'; $('#bestOpportunityText').textContent='Com os filtros atuais, o sistema preferiu não inventar lucro.'; $('#marketHealthPill').textContent='AlbionData online · 0 oportunidades seguras'; return; }
    const sorted = sortScannerResults(results), best = [...results].sort((a,b)=>b.totalProfit-a.totalProfit || b.unitProfit-a.unitProfit)[0];
    $('#bestOpportunityTitle').textContent = best.displayName;
    $('#bestOpportunityText').textContent = `Comprar em ${best.buyFrom.city} por ${fmtNumber(best.buyFrom.sell)} e vender em ${best.sellTo.city} via ${SALE_MODES[best.sourceType]} com lucro estimado de ${fmtNumber(best.unitProfit)} por unidade.`;
    $('#marketHealthPill').textContent = `AlbionData online · ${results.length} oportunidades seguras`;
    tbody.innerHTML = sorted.slice(0,120).map((r)=>`<tr><td><div class="item-cell"><img src="${iconUrl(r.itemId, r.quality)}" alt="${r.displayName}" loading="lazy" onerror="this.style.visibility='hidden'" /><div><div class="item-title">${r.displayName}</div><div class="item-sub">${r.itemId}</div></div></div></td><td>${QUALITY_NAMES[r.quality]}</td><td>${r.buyFrom.city}</td><td>${fmtNumber(r.buyFrom.sell)}</td><td>${r.sellTo.city}</td><td>${SALE_MODES[r.sourceType]}</td><td>${fmtNumber(r.salePrice)}</td><td>${fmtNumber(r.unitProfit)}</td><td>${fmtNumber(r.safeQty)}</td><td>${fmtNumber(r.totalProfit)}</td><td>${fmtPercent(r.margin)}</td><td><span class="confidence confidence-${r.confidence.toLowerCase()}">${r.confidence}</span></td></tr>`).join('');
  }

  async function runRadar() {
    const server=$('#serverSelect').value, routeMode=$('#routeModeSelect').value, saleMode=$('#saleModeRadar').value, capital=Number($('#capitalInput').value||0), familyKey=$('#radarFamily').value, groupKey=$('#radarGroup').value, itemKey=$('#radarItem').value, tier=Number($('#radarTier').value), enchantment=Number($('#radarEnchant').value), quality=Number($('#radarQuality').value);
    const item = allItems.find((e)=>e.familyKey===familyKey && e.groupKey===groupKey && e.key===itemKey); if (!item) return; const itemId = buildItemId(item, tier, enchantment); $('#radarResult').innerHTML='<div class="empty-state">Consultando o item...</div>';
    try { const rows = normalizeMarketRows(await apiFetchPrices({ itemIds:[itemId], qualities:[quality], server, routeMode })); const filtered = rows.filter((r)=>r.quality===quality); const result = computeOpportunity({ item, itemId, tier, enchantment, quality }, filtered, saleMode, capital, true); renderRadar(item, itemId, tier, enchantment, quality, filtered, result); }
    catch (error) { $('#radarResult').innerHTML=`<div class="error-box">${error.message || 'Erro ao consultar o item.'}</div>`; }
  }

  function renderRadar(item, itemId, tier, enchantment, quality, rows, result) {
    const title = renderName({ item, tier, enchantment, quality }); if (!rows.length) { $('#radarResult').innerHTML='<div class="warning-box">Nenhum dado encontrado para esse item e qualidade.</div>'; return; }
    const tableRows = [...rows].sort((a,b)=>LOCATIONS.indexOf(a.city)-LOCATIONS.indexOf(b.city)).map((row)=>`<tr><td>${row.city}</td><td>${fmtPrice(row.sell)}</td><td>${fmtPrice(row.buy)}</td><td>${formatDateBR(row.sellDate)}</td><td>${formatDateBR(row.buyDate)}</td></tr>`).join('');
    const summary = result.ok ? `<div class="summary-grid"><div class="metric-card"><span>Compra segura</span><strong>${result.buyFrom.city} · ${fmtPrice(result.buyFrom.sell)}</strong></div><div class="metric-card"><span>Saída segura</span><strong>${result.sellTo.city} · ${fmtPrice(result.salePrice)}</strong></div><div class="metric-card"><span>Modo usado</span><strong>${SALE_MODES[result.sourceType]}</strong></div><div class="metric-card"><span>Lucro por unidade</span><strong>${fmtPrice(result.unitProfit)}</strong></div><div class="metric-card"><span>Margem</span><strong>${fmtPercent(result.margin)}</strong></div><div class="metric-card"><span>Confiança</span><strong>${result.confidence}</strong></div></div><div class="success-box">Leitura segura: comprar em ${result.buyFrom.city} e sair em ${result.sellTo.city} via ${SALE_MODES[result.sourceType]}.</div>` : `<div class="warning-box">${result.reason || 'Sem arbitragem segura no momento.'}</div>`;
    $('#radarResult').innerHTML = `<div class="radar-header-card"><div class="item-cell large"><img src="${iconUrl(itemId, quality)}" alt="${title}" onerror="this.style.visibility='hidden'" /><div><div class="item-title">${title}</div><div class="item-sub">${itemId}</div></div></div>${summary}</div><div class="table-wrap small-top-gap"><table><thead><tr><th>Cidade</th><th>Menor venda</th><th>Maior pedido</th><th>Atualização venda (BR)</th><th>Atualização compra (BR)</th></tr></thead><tbody>${tableRows}</tbody></table></div>`;
  }

  function setupTabs() { $$('[data-tab]').forEach((button)=>button.addEventListener('click',()=>{ const target=button.dataset.tab; $$('[data-tab]').forEach((i)=>i.classList.toggle('active', i===button)); $$('[data-panel]').forEach((p)=>p.classList.toggle('active', p.dataset.panel===target)); })); }
  function bindTableSorting() { $$('#opportunityTable th[data-sort]').forEach((th)=>{ th.addEventListener('click',()=>{ const key=th.dataset.sort; if (state.sortKey===key) state.sortDir = state.sortDir==='asc'?'desc':'asc'; else { state.sortKey=key; state.sortDir=['displayName','buyCity','sellCity','sourceType'].includes(key)?'asc':'desc'; } renderScanner(state.lastScannerResults); }); }); }
  function wireEvents() { $('#scanBaseButton').addEventListener('click',()=>runScanner('base')); $('#scanFullButton').addEventListener('click',()=>runScanner('full')); $('#radarButton').addEventListener('click', runRadar); }
  function initRoadmap() { $('#roadmapNext').innerHTML = `<li>Fase 1 agora: núcleo de flips + radar de item.</li><li>Fase 2: filtros extras, imagens melhores e score refinado.</li><li>Fase 3: craft profissional ligado ao mercado.</li><li>Fase 4: Supabase e histórico.</li><li>Fase 5: IA do Google para explicação e estratégia.</li>`; }
  function init() { initStaticSelects(); initRadarCatalog(); setupTabs(); bindTableSorting(); wireEvents(); initRoadmap(); $('#capitalInput').value='300000'; $('#serverSelect').value='west'; $('#routeModeSelect').value='safe'; $('#saleModeScanner').value='auto'; $('#saleModeRadar').value='auto'; $('#scannerQualityRange').value='1'; setStatus('Pronto para varrer o mercado.','neutral'); }
  document.addEventListener('DOMContentLoaded', init);
})();
