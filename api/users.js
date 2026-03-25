const { users, sanitizeUser, verifyToken } = require('./_lib/auth');
const bcrypt = require('bcryptjs');

function getToken(req) {
  const authHeader = req.headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
}

function requireAdmin(req, res) {
  const token = getToken(req);
  if (!token) {
    res.status(401).json({ error: 'Não autorizado.' });
    return null;
  }
  try {
    const payload = verifyToken(token);
    if (!payload.admin) {
      res.status(403).json({ error: 'Apenas administradores.' });
      return null;
    }
    return payload;
  } catch (error) {
    res.status(401).json({ error: 'Sessão inválida.' });
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const payload = requireAdmin(req, res);
    if (!payload) return;

    return res.status(200).json({
      ok: true,
      users: users.map(sanitizeUser),
      notice: 'Nesta versão sem banco, os novos usuários ficam ativos enquanto o deploy atual estiver rodando. O próximo passo profissional é Supabase.'
    });
  }

  if (req.method === 'POST') {
    const payload = requireAdmin(req, res);
    if (!payload) return;

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const nome = String(body.nome || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const telefone = String(body.telefone || '').trim();
    const licencaDias = Math.max(1, Number(body.licencaDias || 30));
    const admin = Boolean(body.admin);

    if (!nome || !email || !telefone) {
      return res.status(400).json({ error: 'Preencha nome, email e telefone.' });
    }

    if (users.some((user) => user.email.toLowerCase() === email)) {
      return res.status(400).json({ error: 'Já existe um usuário com esse email.' });
    }

    const expireAt = new Date(Date.now() + licencaDias * 86400000).toISOString();
    const tempPassword = `Albion${Math.random().toString(36).slice(2, 8)}!`;
    const newUser = {
      id: users.length ? Math.max(...users.map((user) => Number(user.id) || 0)) + 1 : 1,
      email,
      nome,
      telefone,
      admin,
      licencaDias,
      licencaExpiraEm: expireAt,
      allowedDevice: null,
      firstAccessPending: true,
      senhaHash: bcrypt.hashSync(tempPassword, 10)
    };

    users.push(newUser);

    return res.status(200).json({
      ok: true,
      user: sanitizeUser(newUser),
      message: `Usuário cadastrado. Senha temporária gerada nesta base: ${tempPassword}`
    });
  }

  return res.status(405).json({ error: 'Método não permitido.' });
};
