module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }
  return res.status(200).json({
    ok: true,
    testMode: true,
    user: {
      nome: 'Wilker',
      email: 'teste@albiontrader.local',
      admin: true,
      telefone: '-',
      licencaExpiraEm: '2027-12-31T00:00:00.000Z',
      primeiroAcesso: false
    }
  });
};
