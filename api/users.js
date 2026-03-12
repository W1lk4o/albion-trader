const { users, sanitizeUser, verifyToken } = require('./_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: 'Não autorizado.' });
    }

    const payload = verifyToken(token);
    if (!payload.admin) {
      return res.status(403).json({ error: 'Apenas administradores.' });
    }

    return res.status(200).json({
      ok: true,
      users: users.map(sanitizeUser),
      notice: 'Nesta versão Vercel sem banco, a lista de usuários é de demonstração e não persiste alterações.'
    });
  } catch (error) {
    return res.status(401).json({ error: 'Sessão inválida.' });
  }
};
