module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido.' });
  try {
    const { items='T4_BAG', item, locations='Caerleon,Bridgewatch,Martlock,Lymhurst,Fort Sterling,Thetford', qualities='1', server='west' } = req.query || {};
    const unique = Array.from(new Set(String(item || items).split(',').map(v=>v.trim()).filter(Boolean)));
    if (!unique.length) return res.status(400).json({ error: 'Informe ao menos um item.' });
    const hostMap = { west:'https://west.albion-online-data.com', europe:'https://europe.albion-online-data.com', east:'https://east.albion-online-data.com' };
    const base = hostMap[server] || hostMap.west;
    const all = [];
    for (let i = 0; i < unique.length; i += 80) {
      const chunk = unique.slice(i, i + 80);
      const endpoint = `${base}/api/v2/stats/prices/${encodeURIComponent(chunk.join(','))}.json?locations=${encodeURIComponent(locations)}&qualities=${encodeURIComponent(qualities)}`;
      const response = await fetch(endpoint, { headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip, deflate, br' } });
      if (!response.ok) return res.status(response.status).json({ error: 'Falha ao consultar a API do Albion.' });
      all.push(...await response.json());
    }
    return res.status(200).json({ ok: true, data: all, meta: { source: 'albion-data', server, itemCount: unique.length } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar preços do Albion.' });
  }
};
