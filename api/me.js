const { verifyToken } = require('./_lib/auth');

const mockUser = {
  id: 0,
  email: 'teste@albiontrader.local',
  nome: 'Admin teste',
  admin: true,
  telefone: '-',
  licencaDias: 9999,
  licencaExpiraEm: '2027-12-31T00:00:00.000Z',
  firstAccessPending: false
};

module.exports = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(200).json({ ok: true, user: mockUser });
    const payload = verifyToken(token);
    return res.status(200).json({ ok: true, user: payload || mockUser });
  } catch (error) {
    return res.status(200).json({ ok: true, user: mockUser });
  }
};
