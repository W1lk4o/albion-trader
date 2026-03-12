const { verifyToken } = require('./_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Token ausente.' });
    }

    const payload = verifyToken(token);
    return res.status(200).json({ ok: true, user: payload });
  } catch (error) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
};
