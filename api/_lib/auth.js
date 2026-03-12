const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'albion-trader-dev-secret';

const users = [
  {
    id: 1,
    email: 'wilkeringracio@gmail.com',
    nome: 'Wilker',
    admin: true,
    licencaExpiraEm: '2027-12-31T23:59:59.000Z',
    allowedDevice: null,
    senhaHash: bcrypt.hashSync('Wilker12@', 10)
  },
  {
    id: 2,
    email: 'convidado@albiontrader.com',
    nome: 'Convidado',
    admin: false,
    licencaExpiraEm: '2026-12-31T23:59:59.000Z',
    allowedDevice: null,
    senhaHash: bcrypt.hashSync('Albion123', 10)
  }
];

function sanitizeUser(user) {
  const { senhaHash, ...safe } = user;
  return safe;
}

function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
}

function isLicenseValid(user) {
  return new Date(user.licencaExpiraEm).getTime() > Date.now();
}

function createToken(user, deviceId) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      nome: user.nome,
      admin: user.admin,
      licencaExpiraEm: user.licencaExpiraEm,
      deviceId: deviceId || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  users,
  sanitizeUser,
  findUserByEmail,
  isLicenseValid,
  createToken,
  verifyToken,
  bcrypt
};
