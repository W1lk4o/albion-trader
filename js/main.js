(function () {
  const STORAGE_KEY = 'albionTraderSession';
  const AI_HISTORY_KEY = 'albionTraderAiHistory';
  const DEFAULT_LOCATIONS = ['Caerleon', 'Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const RADAR_ITEMS = [
    'T4_BAG','T5_BAG','T6_BAG','T7_BAG',
    'T4_CAPE','T5_CAPE','T6_CAPE','T7_CAPE',
    'T4_HIDE','T5_HIDE','T6_HIDE','T7_HIDE',
    'T4_ORE','T5_ORE','T6_ORE','T7_ORE',
    'T4_WOOD','T5_WOOD','T6_WOOD','T7_WOOD',
    'T4_FIBER','T5_FIBER','T6_FIBER','T7_FIBER',
    'T4_ROCK','T5_ROCK','T6_ROCK','T7_ROCK',
    'T4_LEATHER','T5_LEATHER','T6_LEATHER','T7_LEATHER',
    'T4_METALBAR','T5_METALBAR','T6_METALBAR','T7_METALBAR',
    'T4_PLANKS','T5_PLANKS','T6_PLANKS','T7_PLANKS',
    'T4_CLOTH','T5_CLOTH','T6_CLOTH','T7_CLOTH'
  ];

  const MARKET_LIBRARY = {
    equipment: {
      label: 'Equipamentos básicos',
      items: [
        { label: 'Bolsa', code: 'BAG', enchantable: true },
        { label: 'Capa', code: 'CAPE', enchantable: true }
      ]
    },
    raw: {
      label: 'Recursos brutos',
      items: [
        { label: 'Pele', code: 'HIDE', enchantable: true },
        { label: 'Minério', code: 'ORE', enchantable: true },
        { label: 'Madeira', code: 'WOOD', enchantable: true },
        { label: 'Fibra', code: 'FIBER', enchantable: true },
        { label: 'Pedra', code: 'ROCK', enchantable: true }
      ]
    },
    refined: {
      label: 'Recursos refinados',
      items: [
        { label: 'Couro', code: 'LEATHER', enchantable: true },
        { label: 'Barra de metal', code: 'METALBAR', enchantable: true },
        { label: 'Tábua', code: 'PLANKS', enchantable: true },
        { label: 'Tecido', code: 'CLOTH', enchantable: true },
        { label: 'Bloco de pedra', code: 'STONEBLOCK', enchantable: true }
      ]
    }
  };

  const TIER_OPTIONS = [4, 5, 6, 7, 8];
  const ENCHANT_OPTIONS = [0, 1, 2, 3, 4];

  const ISLAND_CROPS = [
    { name: 'Cenoura', profit: 12000, risk: 'Baixo', note: 'boa para caixa curto e revenda simples' },
    { name: 'Feijão', profit: 15000, risk: 'Baixo', note: 'equilibrado e fácil de rodar' },
    { name: 'Trigo', profit: 17000, risk: 'Médio', note: 'bom quando você também usa comida' },
    { name: 'Erva medicinal', profit: 21000, risk: 'Médio', note: 'lucro maior, mas mercado oscila mais' },
    { name: 'Abóbora', profit: 19000, risk: 'Médio', note: 'boa opção intermediária para capital melhor' }
  ];

  const ISLAND_ANIMALS = [
    { name: 'Galinha', profit: 14000, feed: 3500, risk: 'Baixo', note: 'simples e ótima para iniciar' },
    { name: 'Porco', profit: 22000, feed: 7000, risk: 'Médio', note: 'boa relação custo e retorno' },
    { name: 'Cabra', profit: 24000, feed: 8500, risk: 'Médio', note: 'boa margem em mercado aquecido' },
    { name: 'Cavalo', profit: 28000, feed: 12000, risk: 'Médio', note: 'forte quando seu capital já gira bem' },
    { name: 'Boi', profit: 30000, feed: 14000, risk: 'Alto', note: 'mais capital preso, melhor para caixa forte' }
  ];

  const WAR_MODES = {
    zvz: {
      label: 'ZvZ',
      builds: [
        {
          name: 'Frontline de controle',
          role: 'Puxar engage e segurar linha',
          sellFast: ['Heavy Mace', 'Judicator Armor', 'Guardian Helmet', 'Royal Sandals'],
          sellMargin: ['Demon Cape', 'Martlock Cape', 'Resistance Potion'],
          stable: ['Gigantify Potion', 'Pork Omelette', 'Cleric Sandals']
        },
        {
          name: 'DPS de backline',
          role: 'Dano em bloco e pressão em agrupamento',
          sellFast: ['Permafrost Prism', 'Druid Robe', 'Cleric Cowl', 'Scholar Sandals'],
          sellMargin: ['Lymhurst Cape', 'Avalonian Food', 'Energy Potion'],
          stable: ['Cleric Robe', 'Royal Cowl', 'Thetford Cape']
        }
      ]
    },
    smallscale: {
      label: 'Small Scale',
      builds: [
        {
          name: 'Burst mobile',
          role: 'Pickoff rápido e chase',
          sellFast: ['Battle Bracers', 'Cleric Robe', 'Soldier Boots', 'Undead Cape'],
          sellMargin: ['Poison Potion', 'Avalonian Beef Stew', 'Mistcaller'],
          stable: ['Mercenary Hood', 'Assassin Jacket', 'Healing Potion']
        },
        {
          name: 'Suporte utilitário',
          role: 'Reset, peel e sustain da party',
          sellFast: ['Nature Staff', 'Mercenary Hood', 'Cleric Robe', 'Scholar Sandals'],
          sellMargin: ['Lymhurst Cape', 'Energy Potion', 'Pork Omelette'],
          stable: ['Knight Helmet', 'Cleric Cowl', 'Martlock Cape']
        }
      ]
    },
    hellgate: {
      label: 'Hellgate / Crystal Arena',
      builds: [
        {
          name: 'Burst mágico',
          role: 'Troca curta e explosão',
          sellFast: ['Fire Staff', 'Cleric Robe', 'Scholar Cowl', 'Royal Sandals'],
          sellMargin: ['Thetford Cape', 'Poison Potion', 'Beef Stew'],
          stable: ['Cleric Robe', 'Mistcaller', 'Soldier Boots']
        },
        {
          name: 'Pressão corpo a corpo',
          role: 'All-in e zoneamento',
          sellFast: ['Carving Sword', 'Mercenary Jacket', 'Hunter Hood', 'Soldier Boots'],
          sellMargin: ['Martlock Cape', 'Poison Potion', 'Roast Pork'],
          stable: ['Guardian Helmet', 'Cleric Robe', 'Healing Potion']
        }
      ]
    },
    corrupted: {
      label: 'Corrupted / 1v1',
      builds: [
        {
          name: 'Dano consistente',
          role: 'Troca longa e pressão segura',
          sellFast: ['Battleaxe', 'Mercenary Jacket', 'Hunter Hood', 'Soldier Boots'],
          sellMargin: ['Thetford Cape', 'Beef Stew', 'Resistance Potion'],
          stable: ['Torch', 'Guardian Helmet', 'Healing Potion']
        },
        {
          name: 'Kite e controle',
          role: 'Zona, poke e reset',
          sellFast: ['Cursed Staff', 'Cleric Robe', 'Mage Cowl', 'Soldier Boots'],
          sellMargin: ['Lymhurst Cape', 'Poison Potion', 'Beef Stew'],
          stable: ['Cleric Cowl', 'Scholar Sandals', 'Mistcaller']
        }
      ]
    },
    mists: {
      label: 'Mists / Gank',
      builds: [
        {
          name: 'Caça solo',
          role: 'Explodir alvo e sair vivo',
          sellFast: ['Bloodletter', 'Mistcaller', 'Assassin Jacket', 'Mage Cowl'],
          sellMargin: ['Undead Cape', 'Invisibility Potion', 'Roast Pork'],
          stable: ['Soldier Boots', 'Mercenary Hood', 'Cleric Robe']
        },
        {
          name: 'Briga curta de mobilidade',
          role: 'Dano rápido e chase',
          sellFast: ['Double Bladed Staff', 'Assassin Jacket', 'Fiend Cowl', 'Soldier Boots'],
          sellMargin: ['Undead Cape', 'Sticky Potion', 'Pork Omelette'],
          stable: ['Hunter Hood', 'Healing Potion', 'Martlock Cape']
        }
      ]
    }
  };

  const GATHERING_GUIDES = {
    hide: {
      title: 'Coletar pele',
      bestCity: 'Bridgewatch',
      bestZone: 'biomas Steppe com bastante hide',
      why: 'Pele costuma ser uma das coletas mais valiosas quando o giro está bom.',
      steps: ['Use set de skinning + pork pie.', 'Procure mapas mais vazios com muitos animais.', 'Venda bruto se precisar de caixa rápido; refine só quando a conta fechar.']
    },
    ore: {
      title: 'Garimpar minério',
      bestCity: 'Fort Sterling',
      bestZone: 'biomas Mountain com foco em ore',
      why: 'Minério costuma ter boa liquidez e encaixa bem com refino posterior.',
      steps: ['Leve ferramenta no tier da zona.', 'Priorize nós encantados.', 'Se a margem do refino estiver boa, transforme em barra antes de vender.']
    },
    fiber: {
      title: 'Coletar fibra',
      bestCity: 'Thetford',
      bestZone: 'biomas Swamp',
      why: 'Fibra é linha forte para tecido e costuma encaixar bem com craft de pano.',
      steps: ['Use set de fibra e pork pie.', 'Venda parte bruta para caixa e teste parte refinada.', 'Se houver risco alto, foque em rotas curtas até a cidade.']
    },
    wood: {
      title: 'Coletar madeira',
      bestCity: 'Lymhurst',
      bestZone: 'biomas Forest',
      why: 'Madeira tem giro estável e combina com crafts de arma e off-hands.',
      steps: ['Evite ficar pesado demais no mapa.', 'Procure horário com menos disputa.', 'Teste tábua se sua margem de refino estiver saudável.']
    },
    stone: {
      title: 'Coletar pedra',
      bestCity: 'Martlock',
      bestZone: 'biomas Highland',
      why: 'Pedra tem menos hype, mas pode ter janelas boas quando há menos concorrência.',
      steps: ['Só continue se o preço estiver vivo.', 'Use montaria segura para não travar peso.', 'Compare bruto x bloco antes de vender.']
    },
    dg: {
      title: 'DG',
      bestCity: 'Cidade principal mais próxima do seu portal',
      bestZone: 'solo dungeons / open world com baixo risco no começo',
      why: 'Bom para caixa e fama quando você não quer depender só do mercado.',
      steps: ['Entre com set barato e consistente.', 'Quando o caixa subir, migre para conteúdo com melhor loot.', 'Venda rápido os drops medianos para girar capital.']
    },
    mists: {
      title: 'Mists',
      bestCity: 'Portal ou acesso mais confortável para você',
      bestZone: 'Mists com setup móvel e barato no início',
      why: 'Pode render muita prata, mas a variância é alta.',
      steps: ['Comece com set que você pode perder.', 'Evite brigas ruins no início da sessão.', 'Jogue por sobrevivência e pickoffs limpos.']
    },
    transport: {
      title: 'Transporte',
      bestCity: 'Caerleon como destino frequente de teste',
      bestZone: 'rotas entre cidades com spread confirmado',
      why: 'Transporte escala bem quando você já sabe o que gira.',
      steps: ['Nunca transporte no escuro.', 'Valide spread antes de comprar volume.', 'Suba o ticket só depois de repetir a rota com lucro.']
    },
    craft: {
      title: 'Craft',
      bestCity: 'Cidade com bônus da sua linha',
      bestZone: 'mercado com giro alto do item escolhido',
      why: 'Craft cresce muito quando você repete linhas específicas.',
      steps: ['Escolha uma linha só para começar.', 'Compre material barato em lote.', 'Venda onde o item gira rápido, não só onde parece mais caro.']
    },
    refine: {
      title: 'Refino',
      bestCity: 'Cidade com bônus da linha de refino',
      bestZone: 'rota curta entre compra de bruto e venda refinada',
      why: 'Refino fica muito mais forte com foco e repetição.',
      steps: ['Sem foco, só entre com margem sobrando.', 'Com foco, prefira linhas que você vai repetir.', 'Teste o lucro por 100 unidades antes de escalar.']
    },
    market: {
      title: 'Mercado',
      bestCity: 'Caerleon e capitais com spread',
      bestZone: 'mercado mesmo',
      why: 'Mercado puro é ótimo para quem prefere girar capital sem sair tanto para o mapa.',
      steps: ['Olhe spread e volume.', 'Não compre item morto.', 'Prefira repetir 5 giros médios a buscar 1 giro milagroso.']
    }
  };

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
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function getAiHistory() {
    try {
      return JSON.parse(localStorage.getItem(AI_HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveAiHistory(history) {
    localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(history.slice(-12)));
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

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function formatSilver(value) {
    return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0));
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function prettyItemName(itemId) {
    return String(itemId || '')
      .replace(/^T(\d+)_/, 'T$1 ')
      .replace(/@(\d+)/, ' .$1')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function sortByProfitDesc(list) {
    return [...list].sort((a, b) => b.profit - a.profit);
  }

  function getModuleLabel(moduleName) {
    const labels = {
      overview: 'Dashboard',
      craft: 'Craft',
      refino: 'Refino',
      ilhas: 'Ilhas',
      transporte: 'Transporte',
      mercado: 'Mercado',
      guerra: 'Radar de guerra',
      riqueza: 'Planejador de riqueza',
      assistente: 'IA do sistema',
      'admin-overview': 'Admin',
      'admin-users': 'Usuários',
      'admin-licenses': 'Licenças',
      'admin-settings': 'Configurações'
    };
    return labels[moduleName] || moduleName;
  }

  function activateSection(targetId) {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.page-section');

    navItems.forEach((i) => i.classList.toggle('active', i.dataset.target === targetId));
    sections.forEach((s) => s.classList.toggle('active', s.id === targetId));

    const aiModule = document.getElementById('aiModuleSelect');
    const currentAiModule = document.getElementById('currentAiModule');
    if (aiModule && ['overview', 'craft', 'refino', 'ilhas', 'transporte', 'mercado', 'guerra', 'riqueza'].includes(targetId)) {
      aiModule.value = targetId;
      if (currentAiModule) currentAiModule.textContent = `Módulo atual: ${getModuleLabel(targetId)}`;
    }
  }

  function bindNav() {
    document.querySelectorAll('[data-target]').forEach((item) => {
      item.addEventListener('click', () => activateSection(item.dataset.target));
    });
  }

  function fillSelect(selectId, values, formatter) {
    const el = document.getElementById(selectId);
    if (!el) return;
    el.innerHTML = values.map((value) => `<option value="${value}">${formatter ? formatter(value) : value}</option>`).join('');
  }

  function populateMarketSelectors() {
    const category = document.getElementById('marketCategory');
    const item = document.getElementById('marketItemSelect');
    fillSelect('marketTier', TIER_OPTIONS, (value) => `T${value}`);
    fillSelect('marketEnchant', ENCHANT_OPTIONS, (value) => value === 0 ? 'Sem encantamento' : `.${value}`);
    if (!category || !item) return;

    category.innerHTML = Object.entries(MARKET_LIBRARY)
      .map(([key, value]) => `<option value="${key}">${value.label}</option>`)
      .join('');

    const refreshItems = () => {
      const selectedCategory = MARKET_LIBRARY[category.value] || Object.values(MARKET_LIBRARY)[0];
      item.innerHTML = selectedCategory.items.map((entry) => `<option value="${entry.code}">${entry.label}</option>`).join('');
      updateMarketCodePreview();
    };

    category.addEventListener('change', refreshItems);
    item.addEventListener('change', updateMarketCodePreview);
    document.getElementById('marketTier')?.addEventListener('change', updateMarketCodePreview);
    document.getElementById('marketEnchant')?.addEventListener('change', updateMarketCodePreview);
    refreshItems();
  }

  function populateCommonSelectors() {
    fillSelect('craftTier', TIER_OPTIONS, (value) => `T${value}`);
    fillSelect('craftEnchant', ENCHANT_OPTIONS, (value) => value === 0 ? 'Sem encantamento' : `.${value}`);
    fillSelect('refineTier', TIER_OPTIONS, (value) => `T${value}`);

    const warMode = document.getElementById('warMode');
    if (warMode) {
      warMode.innerHTML = Object.entries(WAR_MODES).map(([key, value]) => `<option value="${key}">${value.label}</option>`).join('');
    }
  }

  function buildMarketItemCode() {
    const itemCode = document.getElementById('marketItemSelect')?.value;
    const tier = document.getElementById('marketTier')?.value || 4;
    const enchant = Number(document.getElementById('marketEnchant')?.value || 0);
    if (!itemCode) return '';
    return `T${tier}_${itemCode}${enchant > 0 ? `@${enchant}` : ''}`;
  }

  function updateMarketCodePreview() {
    const preview = document.getElementById('marketCodePreview');
    if (!preview) return;
    const code = buildMarketItemCode();
    preview.textContent = code ? `Código: ${code}` : 'Código: —';
  }

  async function loadMarket() {
    const itemCode = buildMarketItemCode();
    const box = document.getElementById('marketResult');
    if (!box) return;
    if (!itemCode) {
      box.textContent = 'Selecione um item.';
      return;
    }

    box.textContent = 'Buscando preços...';

    try {
      const data = await api(`/api/albion-prices?items=${encodeURIComponent(itemCode)}`);
      const rows = (data.data || []).filter((x) => x.sell_price_min || x.buy_price_max);
      if (!rows.length) {
        box.textContent = 'Nenhum preço retornado para esse item.';
        return;
      }

      const cheapestSell = rows.filter((row) => row.sell_price_min > 0).sort((a, b) => a.sell_price_min - b.sell_price_min)[0];
      const bestBuy = rows.filter((row) => row.buy_price_max > 0).sort((a, b) => b.buy_price_max - a.buy_price_max)[0];

      box.innerHTML = `
        <div class="insight-item">
          <strong>Leitura rápida</strong><br>
          Item: <strong>${prettyItemName(itemCode)}</strong><br>
          Menor venda: <strong>${cheapestSell ? `${cheapestSell.city} — ${formatSilver(cheapestSell.sell_price_min)}` : 'sem oferta'}</strong><br>
          Maior compra: <strong>${bestBuy ? `${bestBuy.city} — ${formatSilver(bestBuy.buy_price_max)}` : 'sem ordem'}</strong>
        </div>
        ${rows
          .sort((a, b) => (a.sell_price_min || Infinity) - (b.sell_price_min || Infinity))
          .map((row) => `
            <div class="price-row">
              <strong>${row.city || 'Cidade'}</strong>
              <span>Venda mín: ${formatSilver(row.sell_price_min || 0)}</span>
              <span>Compra máx: ${formatSilver(row.buy_price_max || 0)}</span>
              <span>Qualidade: ${row.quality || '-'}</span>
            </div>
          `)
          .join('')}
      `;
    } catch (error) {
      box.textContent = error.message;
    }
  }

  function buildOpportunities(prices) {
    const byItem = new Map();
    prices.forEach((row) => {
      if (!row.item_id) return;
      if (!byItem.has(row.item_id)) byItem.set(row.item_id, []);
      byItem.get(row.item_id).push(row);
    });

    const opportunities = [];

    byItem.forEach((rows, itemId) => {
      const sells = rows.filter((r) => (r.sell_price_min || 0) > 0);
      const buys = rows.filter((r) => (r.buy_price_max || 0) > 0);
      if (!sells.length || !buys.length) return;

      const cheapest = sells.reduce((best, row) => ((row.sell_price_min || Infinity) < (best.sell_price_min || Infinity) ? row : best), sells[0]);
      const highest = buys.reduce((best, row) => ((row.buy_price_max || 0) > (best.buy_price_max || 0) ? row : best), buys[0]);
      const buyPrice = cheapest.sell_price_min || 0;
      const sellPrice = highest.buy_price_max || 0;
      const tax = Math.round(sellPrice * 0.065);
      const transport = Math.round(buyPrice * 0.04);
      const profit = sellPrice - buyPrice - tax - transport;
      const margin = buyPrice > 0 ? (profit / buyPrice) * 100 : 0;

      if (profit > 0 && cheapest.city !== highest.city) {
        opportunities.push({
          itemId,
          itemName: prettyItemName(itemId),
          buyCity: cheapest.city,
          sellCity: highest.city,
          buyPrice,
          sellPrice,
          profit,
          margin,
          confidence: rows.length >= 4 ? 'Boa' : 'Média'
        });
      }
    });

    return sortByProfitDesc(opportunities).slice(0, 12);
  }

  async function loadOpportunityRadar() {
    const box = document.getElementById('opportunityResult');
    if (!box) return;
    box.textContent = 'Analisando oportunidades...';

    try {
      const itemIds = RADAR_ITEMS.join(',');
      const locations = DEFAULT_LOCATIONS.join(',');
      const data = await api(`/api/albion-prices?items=${encodeURIComponent(itemIds)}&locations=${encodeURIComponent(locations)}`);
      const opportunities = buildOpportunities(data.data || []);
      const summary = document.getElementById('opportunitySummary');
      const status = document.getElementById('apiStatusBadge');
      const marketCopy = document.getElementById('opportunityResultCopy');
      if (status) status.textContent = data.meta?.source === 'albion-data' ? 'AlbionData online' : 'AlbionData em fallback';

      if (!opportunities.length) {
        box.innerHTML = '<div class="muted">Nenhuma oportunidade clara agora. Tente novamente em alguns minutos.</div>';
        if (summary) summary.textContent = 'Sem spreads úteis no momento.';
        if (marketCopy) marketCopy.innerHTML = 'Sem spreads úteis agora. Aguarde e atualize novamente.';
        return;
      }

      const best = opportunities[0];
      if (summary) summary.textContent = `Melhor spread: ${best.itemName} comprando em ${best.buyCity} e vendendo em ${best.sellCity}.`;

      const table = `
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Comprar</th>
                <th>Vender</th>
                <th>Custo</th>
                <th>Venda</th>
                <th>Lucro</th>
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
                  <td class="badge-positive">${formatSilver(op.profit)}</td>
                  <td>${op.margin.toFixed(1)}%</td>
                  <td>${op.confidence}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      box.innerHTML = table;
      if (marketCopy) {
        marketCopy.innerHTML = `
          <strong>Melhor leitura rápida agora</strong><br>
          Item: <strong>${best.itemName}</strong><br>
          Compra: <strong>${best.buyCity}</strong> por <strong>${formatSilver(best.buyPrice)}</strong><br>
          Venda: <strong>${best.sellCity}</strong> por <strong>${formatSilver(best.sellPrice)}</strong><br>
          Lucro estimado: <strong>${formatSilver(best.profit)}</strong><br>
          Margem: <strong>${best.margin.toFixed(1)}%</strong><br><br>
          Estratégia: valide giro e volume antes de entrar pesado.
        `;
      }
    } catch (error) {
      box.textContent = error.message;
    }
  }

  function getCraftLineMeta(line) {
    const map = {
      bag: { label: 'Bolsa', easy: 'muito boa para começar', risk: 'baixo' },
      cape: { label: 'Capa', easy: 'simples de entender e vender', risk: 'baixo' },
      'cloth-armor': { label: 'Armadura de pano', easy: 'boa, mas depende mais de demanda', risk: 'médio' },
      'leather-armor': { label: 'Armadura de couro', easy: 'boa para PvP, mas varia mais', risk: 'médio' },
      'plate-armor': { label: 'Armadura de placa', easy: 'mercado mais técnico', risk: 'médio' },
      food: { label: 'Comida', easy: 'muito boa para giro rápido', risk: 'baixo' },
      potion: { label: 'Poção', easy: 'boa quando você domina o mercado', risk: 'médio' }
    };
    return map[line] || map.bag;
  }

  function calcCraft() {
    const line = document.getElementById('craftLine').value;
    const tier = Number(document.getElementById('craftTier').value || 4);
    const enchant = Number(document.getElementById('craftEnchant').value || 0);
    const level = Number(document.getElementById('craftLevel').value || 0);
    const city = document.getElementById('craftCity').value;
    const focus = document.getElementById('craftFocus').value === 'sim';
    const cost = Number(document.getElementById('craftCost').value || 0);
    const sell = Number(document.getElementById('craftSell').value || 0);
    const meta = getCraftLineMeta(line);

    const specBonus = level >= 100 ? 0.1 : level >= 75 ? 0.07 : level >= 50 ? 0.04 : 0.02;
    const focusBonus = focus ? 0.08 : 0;
    const effectiveCost = Math.round(cost * (1 - specBonus - focusBonus));
    const fee = Math.round(sell * 0.065);
    const lucro = sell - effectiveCost - fee;
    const margem = cost > 0 ? (lucro / cost) * 100 : 0;

    const lines = [
      `Linha escolhida: <strong>${meta.label} T${tier}${enchant ? `.${enchant}` : ''}</strong>.`,
      `Cidade: <strong>${city}</strong>.`,
      `Lucro estimado: <strong>${formatSilver(lucro)} prata</strong>.`,
      `Margem: <strong>${margem.toFixed(1)}%</strong>.`
    ];

    const steps = [
      'Passo 1: compre ou refine o material no menor custo possível.',
      `Passo 2: craft esse item em ${city} e anote sua margem real por lote.`,
      'Passo 3: venda primeiro em lote pequeno antes de escalar.',
      'Passo 4: se vender rápido, repita a mesma linha; não troque de item toda hora.'
    ];

    let verdict = 'Linha saudável para teste.';
    if (lucro <= 0) verdict = 'Essa conta está ruim. Não entre até melhorar custo ou venda.';
    else if (margem < 8) verdict = 'Dá para rodar, mas está apertado.';
    else if (margem < 18) verdict = 'Boa linha para operar com cuidado.';
    else verdict = 'Linha forte. Vale testar giro e repetir se vender bem.';

    setHtml('craftResult', `
      <strong>Leitura do craft</strong><br><br>
      ${lines.join('<br>')}<br><br>
      <strong>Veredito:</strong> ${verdict}<br>
      <strong>Facilidade:</strong> ${meta.easy}.<br>
      <strong>Risco:</strong> ${meta.risk}.<br><br>
      ${steps.map((step) => `• ${step}`).join('<br>')}
    `);
  }

  function getRefineMeta(line) {
    const map = {
      ore: { label: 'Minério → Barra', beginner: 'ótima linha para quem quer evoluir refino de forma direta' },
      fiber: { label: 'Fibra → Tecido', beginner: 'boa linha quando você quer girar material de pano' },
      wood: { label: 'Madeira → Tábua', beginner: 'simples de entender e comparar preço' },
      hide: { label: 'Pele → Couro', beginner: 'forte quando a pele está barata ou você coleta sua matéria-prima' },
      stone: { label: 'Pedra → Bloco', beginner: 'mais situacional, então exige validar o preço' }
    };
    return map[line] || map.ore;
  }

  function calcRefine() {
    const line = document.getElementById('refineLine').value;
    const tier = Number(document.getElementById('refineTier').value || 4);
    const level = Number(document.getElementById('refineLevel').value || 0);
    const city = document.getElementById('refineCity').value;
    const focus = document.getElementById('refineFocus').value === 'sim';
    const quantity = Number(document.getElementById('refineQuantity').value || 0);
    const cost = Number(document.getElementById('refineCost').value || 0);
    const sell = Number(document.getElementById('refineSell').value || 0);
    const meta = getRefineMeta(line);

    const levelBonus = level >= 100 ? 0.11 : level >= 75 ? 0.08 : level >= 50 ? 0.05 : 0.02;
    const focusBonus = focus ? 0.1 : 0;
    const effectiveCost = Math.round(cost * (1 - levelBonus - focusBonus));
    const fee = Math.round(sell * 0.065);
    const lucro = sell - effectiveCost - fee;
    const porUnidade = quantity > 0 ? lucro / quantity : lucro;

    let verdict = 'Refino aceitável para teste.';
    if (lucro <= 0) verdict = 'Ruim no momento. Sem sobra, melhor não refinar agora.';
    else if (!focus && lucro < cost * 0.08) verdict = 'Sem foco, essa linha está apertada.';
    else if (focus && lucro > cost * 0.12) verdict = 'Com foco, essa linha parece forte.';

    setHtml('refineResult', `
      <strong>Leitura do refino</strong><br><br>
      Linha: <strong>${meta.label} T${tier}</strong><br>
      Cidade: <strong>${city}</strong><br>
      Lucro estimado: <strong>${formatSilver(lucro)} prata</strong><br>
      Lucro por unidade: <strong>${porUnidade.toFixed(1)}</strong><br>
      <strong>Veredito:</strong> ${verdict}<br>
      <strong>Leitura simples:</strong> ${meta.beginner}.<br><br>
      • Passo 1: valide o preço do bruto.<br>
      • Passo 2: refine lote pequeno primeiro.<br>
      • Passo 3: só aumente a quantidade quando a venda estiver rápida.<br>
      • Passo 4: se usar foco, repita a mesma linha em vez de espalhar foco em tudo.
    `);
  }

  function calcIsland() {
    const level = Number(document.getElementById('islandLevel').value || 0);
    const plots = Number(document.getElementById('islandPlots').value || 0);
    const pastures = Number(document.getElementById('islandPastures').value || 0);
    const focus = document.getElementById('islandFocus').value === 'sim';

    const cropOptions = ISLAND_CROPS.map((crop) => {
      const factor = (1 + level * 0.03) * (focus ? 1.12 : 1);
      return { ...crop, totalProfit: Math.round(crop.profit * plots * factor) };
    });

    const animalOptions = ISLAND_ANIMALS.map((animal) => {
      const factor = (1 + level * 0.025) * (focus ? 1.08 : 1);
      return { ...animal, totalProfit: Math.round((animal.profit - animal.feed) * pastures * factor) };
    });

    const sortedCrops = sortByProfitDesc(cropOptions);
    const sortedAnimals = sortByProfitDesc(animalOptions);
    const bestCrop = sortedCrops[0] || { name: 'Nenhuma', totalProfit: 0, note: '-' };
    const reserveCrop = sortedCrops[1] || bestCrop;
    const bestAnimal = sortedAnimals[0] || { name: 'Nenhum', totalProfit: 0, note: '-' };
    const reserveAnimal = sortedAnimals[1] || bestAnimal;
    const total = bestCrop.totalProfit + bestAnimal.totalProfit;

    const strategy = [];
    if (plots > 0) strategy.push(`Plano principal de plantação: <strong>${bestCrop.name}</strong>. Plano reserva: <strong>${reserveCrop.name}</strong>.`);
    if (pastures > 0) strategy.push(`Plano principal de criação: <strong>${bestAnimal.name}</strong>. Plano reserva: <strong>${reserveAnimal.name}</strong>.`);
    strategy.push(focus
      ? 'Como você usa foco, concentre o foco na melhor linha em vez de dividir tudo.'
      : 'Sem foco, prefira linhas mais estáveis e fáceis de revender.');

    setHtml('islandResult', `
      <strong>Melhor plano para sua ilha</strong><br><br>
      Melhor plantação: <strong>${bestCrop.name}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestCrop.totalProfit)}</strong><br>
      Melhor criação: <strong>${bestAnimal.name}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestAnimal.totalProfit)}</strong><br>
      Lucro total estimado: <strong>${formatSilver(total)} prata</strong><br><br>
      ${strategy.map((line) => `• ${line}`).join('<br>')}<br><br>
      Observação da plantação: ${bestCrop.note}.<br>
      Observação do animal: ${bestAnimal.note}.<br><br>
      <strong>Se você não quiser a melhor linha:</strong> use a IA e pergunte, por exemplo, “quero plantar cenoura em vez de erva, ainda compensa?”
    `);
  }

  function calcTransport() {
    const buyCity = document.getElementById('transportBuyCity').value;
    const sellCity = document.getElementById('transportSellCity').value;
    const buy = Number(document.getElementById('transportBuyPrice').value || 0);
    const sell = Number(document.getElementById('transportSellPrice').value || 0);
    const cost = Number(document.getElementById('transportCost').value || 0);
    const tax = Math.round(sell * 0.065);
    const lucro = sell - buy - cost - tax;

    setHtml('transportResult', `
      <strong>Resultado do transporte</strong><br>
      Rota: <strong>${buyCity} → ${sellCity}</strong><br>
      Lucro líquido estimado: <strong>${formatSilver(lucro)} prata</strong><br>
      ${lucro > 0 ? 'Essa rota está saudável. O próximo passo é buscar volume e repetir o ciclo.' : 'Essa rota está fraca. Procure spread maior ou custo logístico menor.'}
    `);
  }

  function getSelectedActivities() {
    return Array.from(document.querySelectorAll('#wealthActivities input[type="checkbox"]:checked')).map((el) => el.value);
  }

  function getActivityRoute(activityKey) {
    return GATHERING_GUIDES[activityKey] || null;
  }

  function calcWealth() {
    const current = Number(document.getElementById('wealthCurrent').value || 0);
    const goal = Number(document.getElementById('wealthGoal').value || 0);
    const days = Math.max(1, Number(document.getElementById('wealthDays').value || 1));
    const mode = document.getElementById('wealthMode').value;
    const selectedActivities = getSelectedActivities();
    const faltante = Math.max(0, goal - current);
    const porDia = faltante / days;

    let bestPath = [];
    let altText = 'Se você não quiser a rota principal, marque as atividades que gosta e gere um plano personalizado.';

    if (mode === 'best') {
      if (current < 1000000) {
        bestPath = [
          'Fase 1: levantar caixa com coleta simples e flipping de ticket baixo.',
          'Fase 2: assim que passar de 3M a 5M, adicionar transporte curto.',
          'Fase 3: quando o caixa ficar estável, entrar em craft ou refino repetível.',
          'Fase 4: escalar com duas frentes ao mesmo tempo: uma estável e uma agressiva.'
        ];
      } else if (current < 10000000) {
        bestPath = [
          'Fase 1: usar mercado + transporte para acelerar o giro do capital.',
          'Fase 2: escolher uma linha de craft ou refino e repetir.',
          'Fase 3: usar ilhas como base estável de lucro e caixa.',
          'Fase 4: reinvestir parte fixa do lucro e parar de operar item ruim.'
        ];
      } else {
        bestPath = [
          'Fase 1: dividir capital entre mercado, craft/refino e renda estável.',
          'Fase 2: aumentar ticket médio apenas nas linhas que já provaram giro.',
          'Fase 3: criar rotina diária de produção + arbitragem + reposição.',
          'Fase 4: usar capital para escala, não só para buscar margem unitária alta.'
        ];
      }
    } else {
      if (!selectedActivities.length) {
        bestPath = ['Você escolheu modo personalizado, mas não marcou nenhuma atividade. Marque pelo menos uma.'];
      } else {
        bestPath = selectedActivities.flatMap((activityKey) => {
          const guide = getActivityRoute(activityKey);
          if (!guide) return [];
          return [
            `<strong>${guide.title}</strong>: cidade sugerida <strong>${guide.bestCity}</strong>; região sugerida <strong>${guide.bestZone}</strong>.`,
            `Por quê: ${guide.why}`,
            ...guide.steps.map((step) => `• ${step}`)
          ];
        });
        altText = `A melhor forma automática talvez não seja a sua favorita. Como você marcou ${selectedActivities.length} atividade(s), o plano foi montado em cima do que você gosta.`;
      }
    }

    let verdict = 'É possível, mas exige execução forte.';
    if (porDia > 30000000) verdict = 'É uma meta muito agressiva; você vai precisar de escala real.';
    if (porDia > 100000000) verdict = 'Do jeito que está, a meta está fora da realidade para a maioria dos jogadores.';

    setHtml('wealthResult', `
      <strong>Plano para sair de ${formatSilver(current)} e buscar ${formatSilver(goal)}</strong><br><br>
      Precisa gerar em média: <strong>${formatSilver(porDia)} prata por dia</strong><br>
      Veredito: <strong>${verdict}</strong><br><br>
      <strong>Melhor caminho agora:</strong><br>
      ${bestPath.join('<br>')}<br><br>
      <strong>Observação importante:</strong> ${altText}<br><br>
      <strong>Mensagem do sistema:</strong> A melhor forma é a forma que tiver mais rentabilidade e você conseguir repetir. Se não quiser seguir a rota principal, marque o que gosta de fazer e eu traço uma rota mais próxima do seu estilo.
    `);
  }

  function renderWarMarket() {
    const mode = document.getElementById('warMode').value;
    const focus = document.getElementById('warFocus').value;
    const box = document.getElementById('warResult');
    const data = WAR_MODES[mode];
    if (!box || !data) return;

    const focusLabel = focus === 'fast' ? 'Itens de giro mais rápido' : focus === 'margin' ? 'Itens para tentar margem maior' : 'Itens mais estáveis';
    const listKey = focus === 'fast' ? 'sellFast' : focus === 'margin' ? 'sellMargin' : 'stable';

    box.innerHTML = `
      <strong>Radar de Guerra — ${data.label}</strong><br><br>
      ${data.builds.map((build) => `
        <div class="war-card">
          <h4>${build.name}</h4>
          <p><strong>Função:</strong> ${build.role}</p>
          <p><strong>${focusLabel}:</strong> ${build[listKey].join(', ')}</p>
        </div>
      `).join('')}
      <br>
      <strong>Como usar:</strong> vigie esses itens no mercado, veja quais aparecem em mais de uma build e dê prioridade ao que gira mais rápido.
    `;
  }

  function getCurrentModuleContext(moduleName) {
    const context = { module: moduleName, deviceId: getDeviceId() };

    if (moduleName === 'craft') {
      context.line = document.getElementById('craftLine')?.value || '';
      context.tier = document.getElementById('craftTier')?.value || '';
      context.enchant = document.getElementById('craftEnchant')?.value || '';
      context.level = Number(document.getElementById('craftLevel')?.value || 0);
      context.city = document.getElementById('craftCity')?.value || '';
      context.focus = document.getElementById('craftFocus')?.value || '';
      context.materialCost = Number(document.getElementById('craftCost')?.value || 0);
      context.sellValue = Number(document.getElementById('craftSell')?.value || 0);
      context.currentResult = document.getElementById('craftResult')?.innerText || '';
    }

    if (moduleName === 'refino') {
      context.line = document.getElementById('refineLine')?.value || '';
      context.tier = document.getElementById('refineTier')?.value || '';
      context.level = Number(document.getElementById('refineLevel')?.value || 0);
      context.city = document.getElementById('refineCity')?.value || '';
      context.focus = document.getElementById('refineFocus')?.value || '';
      context.quantity = Number(document.getElementById('refineQuantity')?.value || 0);
      context.rawCost = Number(document.getElementById('refineCost')?.value || 0);
      context.sellValue = Number(document.getElementById('refineSell')?.value || 0);
      context.currentResult = document.getElementById('refineResult')?.innerText || '';
    }

    if (moduleName === 'ilhas') {
      context.level = Number(document.getElementById('islandLevel')?.value || 0);
      context.plots = Number(document.getElementById('islandPlots')?.value || 0);
      context.pastures = Number(document.getElementById('islandPastures')?.value || 0);
      context.focus = document.getElementById('islandFocus')?.value || '';
      context.currentResult = document.getElementById('islandResult')?.innerText || '';
      context.cropOptions = ISLAND_CROPS;
      context.animalOptions = ISLAND_ANIMALS;
    }

    if (moduleName === 'transporte') {
      context.buyCity = document.getElementById('transportBuyCity')?.value || '';
      context.sellCity = document.getElementById('transportSellCity')?.value || '';
      context.buyPrice = Number(document.getElementById('transportBuyPrice')?.value || 0);
      context.sellPrice = Number(document.getElementById('transportSellPrice')?.value || 0);
      context.transportCost = Number(document.getElementById('transportCost')?.value || 0);
      context.currentResult = document.getElementById('transportResult')?.innerText || '';
    }

    if (moduleName === 'mercado') {
      context.marketCode = buildMarketItemCode();
      context.radarSummary = document.getElementById('opportunitySummary')?.innerText || '';
      context.marketRead = document.getElementById('opportunityResultCopy')?.innerText || '';
    }

    if (moduleName === 'guerra') {
      context.mode = document.getElementById('warMode')?.value || '';
      context.focus = document.getElementById('warFocus')?.value || '';
      context.currentResult = document.getElementById('warResult')?.innerText || '';
    }

    if (moduleName === 'riqueza') {
      context.currentSilver = Number(document.getElementById('wealthCurrent')?.value || 0);
      context.goalSilver = Number(document.getElementById('wealthGoal')?.value || 0);
      context.days = Number(document.getElementById('wealthDays')?.value || 0);
      context.mode = document.getElementById('wealthMode')?.value || '';
      context.activities = getSelectedActivities();
      context.currentResult = document.getElementById('wealthResult')?.innerText || '';
    }

    if (moduleName === 'overview') {
      context.radarSummary = document.getElementById('opportunitySummary')?.innerText || '';
      context.marketQuick = document.getElementById('marketResult')?.innerText || '';
    }

    return context;
  }

  function appendAiMessage(role, text, kind) {
    const box = document.getElementById('aiChatMessages');
    if (!box) return;
    const div = document.createElement('div');
    div.className = `chat-message ${kind || role}`;
    div.innerHTML = `<strong>${role === 'user' ? 'Você' : kind === 'error' ? 'Erro' : 'IA'}</strong><p>${escapeHtml(text)}</p>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function renderAiHistory() {
    const box = document.getElementById('aiChatMessages');
    if (!box) return;
    const history = getAiHistory();
    box.innerHTML = '';
    if (!history.length) {
      appendAiMessage('assistant', 'Estou pronta. Você pode perguntar, por exemplo: “Na minha ilha vale mais plantar cenoura ou erva?”');
      return;
    }
    history.forEach((item) => appendAiMessage(item.role, item.text, item.role === 'assistant' ? 'ai' : 'user'));
  }

  async function askAiQuestion(moduleOverride) {
    const questionEl = document.getElementById('aiQuestion');
    const moduleEl = document.getElementById('aiModuleSelect');
    const status = document.getElementById('aiStatusBadge');
    if (!questionEl || !moduleEl) return;

    const question = questionEl.value.trim();
    if (!question) return;

    const moduleName = moduleOverride || moduleEl.value || 'overview';
    moduleEl.value = moduleName;
    const history = getAiHistory();
    history.push({ role: 'user', text: question });
    saveAiHistory(history);
    appendAiMessage('user', question);
    questionEl.value = '';
    if (status) status.textContent = 'IA pensando...';

    try {
      const data = await api('/api/ai-chat', {
        method: 'POST',
        body: JSON.stringify({
          module: moduleName,
          message: question,
          context: getCurrentModuleContext(moduleName),
          history
        })
      });
      const nextHistory = getAiHistory();
      nextHistory.push({ role: 'assistant', text: data.answer });
      saveAiHistory(nextHistory);
      appendAiMessage('assistant', data.answer, 'ai');
      if (status) status.textContent = 'IA online';
      activateSection('assistente');
    } catch (error) {
      appendAiMessage('assistant', error.message, 'error');
      if (status) status.textContent = 'IA indisponível';
    }
  }

  function bindAi() {
    const sendBtn = document.getElementById('sendAiBtn');
    const clearBtn = document.getElementById('clearAiBtn');
    const questionEl = document.getElementById('aiQuestion');
    const askButtons = document.querySelectorAll('.ask-ai-btn[data-module]');
    const aiModuleSelect = document.getElementById('aiModuleSelect');
    const currentAiModule = document.getElementById('currentAiModule');

    renderAiHistory();

    if (sendBtn) sendBtn.addEventListener('click', () => askAiQuestion());
    if (clearBtn) clearBtn.addEventListener('click', () => {
      localStorage.removeItem(AI_HISTORY_KEY);
      renderAiHistory();
    });
    if (questionEl) {
      questionEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          askAiQuestion();
        }
      });
    }
    if (aiModuleSelect) {
      aiModuleSelect.addEventListener('change', () => {
        if (currentAiModule) currentAiModule.textContent = `Módulo atual: ${getModuleLabel(aiModuleSelect.value)}`;
      });
    }
    askButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const moduleName = btn.dataset.module;
        if (aiModuleSelect) aiModuleSelect.value = moduleName;
        if (currentAiModule) currentAiModule.textContent = `Módulo atual: ${getModuleLabel(moduleName)}`;
        activateSection('assistente');
      });
    });
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
    bindAi();
    populateMarketSelectors();
    populateCommonSelectors();
    renderWarMarket();

    document.getElementById('loadMarketBtn')?.addEventListener('click', loadMarket);
    document.getElementById('loadOpportunityBtn')?.addEventListener('click', loadOpportunityRadar);
    document.getElementById('warMode')?.addEventListener('change', renderWarMarket);
    document.getElementById('warFocus')?.addEventListener('change', renderWarMarket);
    document.getElementById('wealthMode')?.addEventListener('change', calcWealth);
    document.querySelectorAll('#wealthActivities input[type="checkbox"]').forEach((el) => {
      el.addEventListener('change', () => {
        if (document.getElementById('wealthMode')?.value === 'custom') calcWealth();
      });
    });

    loadOpportunityRadar();
    calcWealth();
  }

  async function initAdmin() {
    const user = await requireAuth();
    if (!user) return;

    const title = document.getElementById('adminTitle');
    if (title) title.textContent = `Painel admin — ${user.nome || user.email}`;

    bindLogout();
    bindNav();

    try {
      const data = await api('/api/users');
      const tbody = document.getElementById('adminUsersTable');
      const count = document.getElementById('adminUserCount');
      const notice = document.getElementById('adminNotice');
      const licenseCards = document.getElementById('adminLicenseCards');
      if (notice) notice.textContent = data.notice || '';
      if (count) count.textContent = data.users.length;

      if (tbody) {
        tbody.innerHTML = data.users.map((u) => `
          <tr>
            <td>${escapeHtml(u.nome || '-')}</td>
            <td>${escapeHtml(u.email)}</td>
            <td>${u.admin ? 'Admin' : 'Usuário'}</td>
            <td>${new Date(u.licencaExpiraEm).toLocaleDateString('pt-BR')}</td>
          </tr>
        `).join('');
      }

      if (licenseCards) {
        licenseCards.innerHTML = data.users.map((u) => `
          <article class="card">
            <h3>${escapeHtml(u.nome || u.email)}</h3>
            <p class="muted">${escapeHtml(u.email)}</p>
            <p>Perfil: <strong>${u.admin ? 'Admin' : 'Usuário'}</strong></p>
            <p>Licença até: <strong>${new Date(u.licencaExpiraEm).toLocaleDateString('pt-BR')}</strong></p>
          </article>
        `).join('');
      }
    } catch (error) {
      const notice = document.getElementById('adminNotice');
      if (notice) notice.textContent = error.message;
    }
  }

  function initLogin() {
    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', handleLogin);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'dashboard') initDashboard();
    else if (page === 'admin') initAdmin();
    else initLogin();
  });

  window.AlbionTrader = {
    calcCraft,
    calcRefine,
    calcIsland,
    calcTransport,
    calcWealth,
    askAiQuestion,
    renderWarMarket
  };
})();
