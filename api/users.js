const demoUsers = [
  { nome: 'Wilker', email: 'teste@albiontrader.local', telefone: '-', admin: true, licencaExpiraEm: '2027-12-31T00:00:00.000Z', primeiroAcesso: false },
  { nome: 'Convidado', email: 'convidado@albiontrader.local', telefone: '-', admin: false, licencaExpiraEm: '2027-08-31T00:00:00.000Z', primeiroAcesso: true }
];

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido nesta fase de teste.' });
  }
  return res.status(200).json({
    ok: true,
    testMode: true,
    users: demoUsers,
    notice: 'Modo de teste ativo. Login foi desligado temporariamente para validar mercado e radar primeiro.'
  });
};
