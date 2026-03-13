(function () {
  const STORAGE_KEY = 'albionTraderSession';
  const DEFAULT_LOCATIONS = ['Caerleon', 'Bridgewatch', 'Martlock', 'Lymhurst', 'Fort Sterling', 'Thetford'];
  const RADAR_ITEMS = [
    'T4_BAG','T5_BAG','T6_BAG',
    'T4_CAPE','T5_CAPE','T6_CAPE',
    'T4_ORE','T5_ORE','T4_WOOD','T5_WOOD','T4_FIBER','T5_FIBER',
    'T4_HIDE','T5_HIDE','T4_ROCK','T5_ROCK',
    'T4_METALBAR','T5_METALBAR','T4_PLANKS','T5_PLANKS',
    'T4_CLOTH','T5_CLOTH','T4_LEATHER','T5_LEATHER'
  ];

  const ISLAND_CROPS = [
    { name: 'Cenoura', profit: 12000, risk: 'Baixo', note: 'ótima para começar e girar rápido' },
    { name: 'Feijão', profit: 15000, risk: 'Baixo', note: 'boa margem e giro estável' },
    { name: 'Trigo', profit: 17000, risk: 'Médio', note: 'boa combinação com produção de comida' },
    { name: 'Erva medicinal', profit: 21000, risk: 'Médio', note: 'mais lucro, mas depende mais do mercado' },
    { name: 'Abóbora', profit: 19000, risk: 'Médio', note: 'opção equilibrada para quem já tem capital' }
  ];

  const ISLAND_ANIMALS = [
    { name: 'Galinha', profit: 14000, feed: 3500, risk: 'Baixo', note: 'simples e boa para começar' },
    { name: 'Porco', profit: 22000, feed: 7000, risk: 'Médio', note: 'lucro interessante com alimentação barata' },
    { name: 'Cabra', profit: 24000, feed: 8500, risk: 'Médio', note: 'boa margem quando o mercado está aquecido' },
    { name: 'Cavalo', profit: 28000, feed: 12000, risk: 'Médio', note: 'bom para quem já tem mais giro' },
    { name: 'Boi', profit: 30000, feed: 14000, risk: 'Alto', note: 'mais capital preso, mas pode render bem' }
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

    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }

    const response = await fetch(url, Object.assign({}, options, { headers }));
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição.');
    }

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

    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function bindNav() {
    const targets = document.querySelectorAll('[data-target]');
    targets.forEach((item) => {
      item.addEventListener('click', () => activateSection(item.dataset.target));
    });
  }

  function formatSilver(value) {
    return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0));
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function prettyItemName(itemId) {
    return itemId
      .replace(/^T(\d+)_/, 'T$1 ')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  function sortByProfitDesc(list) {
    return list.sort((a, b) => b.profit - a.profit);
  }

  async function loadMarket() {
    const item = document.getElementById('marketItem').value.trim() || 'T4_BAG';
    const box = document.getElementById('marketResult');
    box.textContent = 'Buscando preços...';

    try {
      const data = await api(`/api/albion-prices?items=${encodeURIComponent(item)}`);
      const rows = (data.data || []).filter((x) => x.sell_price_min || x.buy_price_max);

      if (!rows.length) {
        box.textContent = 'Nenhum preço retornado para esse item.';
        return;
      }

      const html = rows
        .sort((a, b) => (a.sell_price_min || Infinity) - (b.sell_price_min || Infinity))
        .map((row) => `
          <div class="price-row">
            <strong>${row.city || 'Cidade'}</strong>
            <span>Venda mín: ${formatSilver(row.sell_price_min || 0)}</span>
            <span>Compra máx: ${formatSilver(row.buy_price_max || 0)}</span>
            <span>Qualidade: ${row.quality || '-'}</span>
          </div>
        `)
        .join('');

      box.innerHTML = html;
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
          tax,
          transport,
          confidence: rows.length >= 4 ? 'Boa' : 'Média'
        });
      }
    });

    return sortByProfitDesc(opportunities).slice(0, 10);
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
      if (status) status.textContent = data.meta?.source === 'albion-data' ? 'AlbionData online' : 'AlbionData em fallback';

      if (!opportunities.length) {
        box.innerHTML = '<div class="muted">Nenhuma oportunidade clara agora. Tente novamente em alguns minutos.</div>';
        if (summary) summary.textContent = 'Sem spreads úteis no momento.';
        return;
      }

      if (summary) {
        const best = opportunities[0];
        summary.textContent = `Melhor spread agora: ${best.itemName} comprando em ${best.buyCity} e vendendo em ${best.sellCity}.`;
      }

      const html = `
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
                  <td>${formatSilver(op.profit)}</td>
                  <td>${op.margin.toFixed(1)}%</td>
                  <td>${op.confidence}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      box.innerHTML = html;
    } catch (error) {
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

    const loadBtn = document.getElementById('loadMarketBtn');
    if (loadBtn) loadBtn.addEventListener('click', loadMarket);

    const radarBtn = document.getElementById('loadOpportunityBtn');
    if (radarBtn) radarBtn.addEventListener('click', loadOpportunityRadar);

    loadOpportunityRadar();
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
        tbody.innerHTML = data.users
          .map(
            (u) => `
            <tr>
              <td>${u.nome || '-'}</td>
              <td>${u.email}</td>
              <td>${u.admin ? 'Admin' : 'Usuário'}</td>
              <td>${new Date(u.licencaExpiraEm).toLocaleDateString('pt-BR')}</td>
            </tr>
          `
          )
          .join('');
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
    const fee = Math.round(sell * 0.065);
    const adjustedCost = cost / bonus;
    const lucro = sell - adjustedCost - fee;
    const margem = cost > 0 ? (lucro / cost) * 100 : 0;

    setHtml(
      'craftResult',
      `
      <strong>Resultado do craft em ${city}</strong><br>
      Lucro estimado: <strong>${formatSilver(lucro)} prata</strong><br>
      Margem: <strong>${margem.toFixed(1)}%</strong><br>
      Leitura: ${lucro > 0 ? 'vale testar itens de giro rápido, como bolsas e capas.' : 'esse craft está apertado; melhore custo dos materiais ou venda.'}
      `
    );
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

    setHtml(
      'refineResult',
      `
      <strong>Resultado do refino em ${city}</strong><br>
      Lucro estimado: <strong>${formatSilver(lucro)} prata</strong> ${focus ? 'com foco' : 'sem foco'}<br>
      Melhor leitura: ${focus ? 'aproveite itens com retorno de recursos e venda rápida.' : 'sem foco, prefira spreads maiores e muito giro.'}
      `
    );
  }

  function calcIsland() {
    const level = Number(document.getElementById('islandLevel').value || 0);
    const plots = Number(document.getElementById('islandPlots').value || 0);
    const pastures = Number(document.getElementById('islandPastures').value || 0);
    const focus = document.getElementById('islandFocus').value === 'sim';

    const cropOptions = ISLAND_CROPS.map((crop) => {
      const factor = (1 + level * 0.03) * (focus ? 1.12 : 1);
      const totalProfit = Math.round(crop.profit * plots * factor);
      return { ...crop, totalProfit };
    });

    const animalOptions = ISLAND_ANIMALS.map((animal) => {
      const factor = (1 + level * 0.025) * (focus ? 1.08 : 1);
      const totalProfit = Math.round((animal.profit - animal.feed) * pastures * factor);
      return { ...animal, totalProfit };
    });

    const bestCrop = sortByProfitDesc(cropOptions)[0] || { name: 'Nenhuma', totalProfit: 0, note: '-' };
    const bestAnimal = sortByProfitDesc(animalOptions)[0] || { name: 'Nenhum', totalProfit: 0, note: '-' };
    const total = bestCrop.totalProfit + bestAnimal.totalProfit;

    const strategy = [];
    if (plots > 0) strategy.push(`Use as plantações para <strong>${bestCrop.name}</strong>, porque hoje é a melhor linha de giro dentro do modelo do sistema.`);
    if (pastures > 0) strategy.push(`Nos pastos, priorize <strong>${bestAnimal.name}</strong>, porque sobra mais prata líquida depois da alimentação.`);
    if (focus) strategy.push('Como você usa foco, vale concentrar a produção no que tiver maior margem em vez de espalhar demais.');
    else strategy.push('Sem foco, prefira opções estáveis e simples de revender para não travar capital.');

    setHtml(
      'islandResult',
      `
      <strong>Melhor plano para sua ilha</strong><br><br>
      Melhor plantação: <strong>${bestCrop.name}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestCrop.totalProfit)}</strong><br>
      Melhor criação: <strong>${bestAnimal.name}</strong> — lucro estimado por ciclo: <strong>${formatSilver(bestAnimal.totalProfit)}</strong><br>
      Lucro total estimado: <strong>${formatSilver(total)} prata</strong><br><br>
      ${strategy.map((line) => `• ${line}`).join('<br>')}<br><br>
      Observação da plantação: ${bestCrop.note}.<br>
      Observação do animal: ${bestAnimal.note}.
      `
    );
  }

  function calcTransport() {
    const buyCity = document.getElementById('transportBuyCity').value;
    const sellCity = document.getElementById('transportSellCity').value;
    const buy = Number(document.getElementById('transportBuyPrice').value || 0);
    const sell = Number(document.getElementById('transportSellPrice').value || 0);
    const cost = Number(document.getElementById('transportCost').value || 0);
    const tax = Math.round(sell * 0.065);
    const lucro = sell - buy - cost - tax;

    setHtml(
      'transportResult',
      `
      <strong>Resultado do transporte</strong><br>
      Rota: <strong>${buyCity} → ${sellCity}</strong><br>
      Lucro líquido estimado: <strong>${formatSilver(lucro)} prata</strong><br>
      ${lucro > 0 ? 'Essa rota está saudável. O próximo passo é buscar volume e repetir o ciclo.' : 'Essa rota está fraca. Procure spread maior ou custo logístico menor.'}
      `
    );
  }

  function calcWealth() {
    const current = Number(document.getElementById('wealthCurrent').value || 0);
    const goal = Number(document.getElementById('wealthGoal').value || 0);
    const days = Math.max(1, Number(document.getElementById('wealthDays').value || 1));
    const faltante = Math.max(0, goal - current);
    const porDia = faltante / days;
    const ratio = current > 0 ? goal / current : Infinity;

    const phases = [];

    if (current < 500000) {
      phases.push('Fase 1: levantar capital com flipping simples, transporte curto e craft barato de alto giro.');
      phases.push('Meta dessa fase: sair do capital baixo e chegar pelo menos em 5M a 10M para parar de jogar no limite.');
    } else if (current < 10000000) {
      phases.push('Fase 1: usar capital para arbitragem entre cidades, refino com foco e itens com rotação diária.');
      phases.push('Meta dessa fase: transformar caixa pequeno em capital operacional consistente.');
    } else {
      phases.push('Fase 1: operar múltiplas frentes ao mesmo tempo: craft, refino, ilhas e mercado.');
      phases.push('Meta dessa fase: crescer por escala, não só por margem unitária.');
    }

    phases.push('Fase 2: estabilizar uma rotina diária com uma fonte segura e uma fonte agressiva de lucro.');
    phases.push('Fase 3: reinvestir parte fixa do lucro, em vez de sacar tudo, para acelerar o crescimento composto.');

    let verdict = 'É possível, mas exige execução forte.';
    if (porDia > 30000000) verdict = 'É muito agressivo. Só fica plausível com capital alto, escala e várias frentes ao mesmo tempo.';
    if (porDia > 100000000) verdict = 'Do jeito que está, a meta está fora da realidade para a maioria dos jogadores.';

    let recommendation = 'Estratégia sugerida: combine mercado + transporte + uma linha de produção previsível.';
    if (ratio >= 100 && current < 10000000) {
      recommendation = 'Seu erro seria tentar ficar rico só com uma atividade. Você precisa de escada: caixa curto prazo, produção média e escala longa.';
    } else if (current >= 50000000) {
      recommendation = 'Com esse capital, faz sentido diversificar: ilhas para base estável, craft/refino para margem e mercado para giro.';
    }

    setHtml(
      'wealthResult',
      `
      <strong>Plano para sair de ${formatSilver(current)} e buscar ${formatSilver(goal)}</strong><br><br>
      Precisa gerar em média: <strong>${formatSilver(porDia)} prata por dia</strong><br>
      Veredito: <strong>${verdict}</strong><br><br>
      ${phases.map((phase) => `• ${phase}`).join('<br>')}<br><br>
      <strong>Estratégia clara:</strong> ${recommendation}
      `
    );
  }

  window.AlbionTrader = {
    calcCraft,
    calcRefine,
    calcIsland,
    calcTransport,
    calcWealth,
    loadOpportunityRadar,
    activateSection
  };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', handleLogin);

    if (document.body.dataset.page === 'dashboard') initDashboard();
    if (document.body.dataset.page === 'admin') initAdmin();
  });
})();
