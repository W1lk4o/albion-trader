
const { users, json, parseBody } = require('./_lib');

module.exports = async (req, res) => {
  if(req.method !== 'POST') return json(res, 405, { ok:false, error:'Método não permitido' });
  try{
    const { email, senha } = await parseBody(req);
    const user = users.find(u => u.email.toLowerCase() === String(email || '').toLowerCase() && u.senha === senha);
    if(!user) return json(res, 401, { ok:false, error:'Email ou senha inválidos.' });
    return json(res, 200, { ok:true, user: { email:user.email, admin:user.admin, name:user.name } });
  }catch{
    return json(res, 500, { ok:false, error:'Falha interna no login.' });
  }
};
