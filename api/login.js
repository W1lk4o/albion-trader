const {
  findUserByEmail,
  sanitizeUser,
  isLicenseValid,
  createToken,
  bcrypt
} = require('./_lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { email, senha, deviceId } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ error: 'Informe email e senha.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const senhaOk = await bcrypt.compare(senha, user.senhaHash);
    if (!senhaOk) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

    if (!isLicenseValid(user)) {
      return res.status(403).json({
        error: 'Licença expirada. Entre em contato com o administrador.',
        contact: 'wilkeringracio@gmail.com'
      });
    }

    const token = createToken(user, deviceId || null);

    return res.status(200).json({
      ok: true,
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no login.' });
  }
};
