(function () {
  const STORAGE_KEY = 'albionTraderSession';

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
    const headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.headers || {}
    );

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

  function bindNav() {
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const sections = document.querySelectorAll('.page-section');
    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        navItems.forEach((i) => i.classList.remove('active'));
        sections.forEach((s) => s.classList.remove('active'));
        item.classList.add('active');
        const target = document.getElementById(item.dataset.target);
        if (target) target.classList.add('active');
      });
    });
  }

  function formatSilver(value) {
    return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0));
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  async function loadMarket() {
    const item = document.getElementById('marketItem').value.trim() || 'T4_BAG';
    const box = document.getElementById('marketResult');
    box.textContent = 'Buscando preços...';

    try {
      const data = await api(`/api/albion-prices?item=${encodeURIComponent(item)}`);
      const rows = (data.data || []).filter((x) => x.sell_price_min || x.buy_price_max);

      if (!rows.length) {
        box.textContent = 'Nenhum preço retornado para esse item.';
        return;
      }

      const html = rows
        .map((row) => `
          <div class="price-row">
            <strong>${row.city || 'Cidade'}</strong>
            <span>Venda mín: ${formatSilver(row.sell_price_min || 0)}</span>
            <span>Compra máx: ${formatSilver(row.buy_price_max || 0)}</span>
          </div>
        `)
        .join('');

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
    const lucro = sell - cost / bonus;

    setHtml('craftResult', `Lucro estimado em <strong>${city}</strong>: <strong>${formatSilver(lucro)} prata</strong>. Melhor foco inicial: itens com rotação média e baixo custo de entrada.`);
  }

  function calcRefine() {
    const level = Number(document.getElementById('refineLevel').value || 0);
    const city = document.getElementById('refineCity').value;
    const focus = document.getElementById('refineFocus').value === 'sim';
    const cost = Number(document.getElementById('refineCost').value || 0);
    const sell = Number(document.getElementById('refineSell').value || 0);
    const efficiency = focus ? 0.86 : 1;
    const xpBonus = level >= 75 ? 0.95 : 1;
    const lucro = sell - cost * efficiency * xpBonus;

    setHtml('refineResult', `Refino em <strong>${city}</strong>: lucro estimado de <strong>${formatSilver(lucro)} prata</strong> ${focus ? 'com foco' : 'sem foco'}.`);
  }

  function calcIsland() {
    const level = Number(document.getElementById('islandLevel').value || 0);
    const plots = Number(document.getElementById('islandPlots').value || 0);
    const pastures = Number(document.getElementById('islandPastures').value || 0);
    const focus = document.getElementById('islandFocus').value === 'sim';
    const farming = plots * 14500 * (focus ? 1.12 : 1);
    const animals = pastures * 22500 * (focus ? 1.08 : 1);
    const total = (farming + animals) * (1 + level * 0.02);

    setHtml('islandResult', `Com ilha nível <strong>${level}</strong>, a projeção está em <strong>${formatSilver(total)} prata</strong> por ciclo. Melhor rota inicial: combinar plantação + criação.`);
  }

  function calcTransport() {
    const buyCity = document.getElementById('transportBuyCity').value;
    const sellCity = document.getElementById('transportSellCity').value;
    const buy = Number(document.getElementById('transportBuyPrice').value || 0);
    const sell = Number(document.getElementById('transportSellPrice').value || 0);
    const cost = Number(document.getElementById('transportCost').value || 0);
    const lucro = sell - buy - cost;

    setHtml('transportResult', `Transportando de <strong>${buyCity}</strong> para <strong>${sellCity}</strong>, o lucro estimado é <strong>${formatSilver(lucro)} prata</strong>.`);
  }

  function calcWealth() {
    const current = Number(document.getElementById('wealthCurrent').value || 0);
    const goal = Number(document.getElementById('wealthGoal').value || 0);
    const days = Math.max(1, Number(document.getElementById('wealthDays').value || 1));
    const faltante = Math.max(0, goal - current);
    const porDia = faltante / days;

    setHtml('wealthResult', `Para sair de <strong>${formatSilver(current)}</strong> e chegar em <strong>${formatSilver(goal)}</strong> em <strong>${days} dias</strong>, você precisa fazer em média <strong>${formatSilver(porDia)} prata por dia</strong>.`);
  }

  window.AlbionTrader = {
    calcCraft,
    calcRefine,
    calcIsland,
    calcTransport,
    calcWealth
  };

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', handleLogin);

    if (document.body.dataset.page === 'dashboard') initDashboard();
    if (document.body.dataset.page === 'admin') initAdmin();
  });
})();
