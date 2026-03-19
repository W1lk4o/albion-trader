function normalizeServer(raw) {
  const value = String(raw || 'west').toLowerCase();
  if (value === 'americas' || value === 'west') return 'west';
  if (value === 'asia' || value === 'east') return 'east';
  if (value === 'eu' || value === 'europe') return 'europe';
  return 'west';
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const {
      items = 'T4_BAG',
      item,
      locations = 'Caerleon,Bridgewatch,Martlock,Lymhurst,Fort Sterling,Thetford',
      qualities = '1',
      server = 'west'
    } = req.query || {};

    const serverKey = normalizeServer(server);
    const itemIds = (item || items)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .join(',');

    if (!itemIds) {
      return res.status(400).json({ error: 'Informe ao menos um item.' });
    }

    const host = serverKey === 'europe'
      ? 'https://europe.albion-online-data.com'
      : serverKey === 'east'
        ? 'https://east.albion-online-data.com'
        : 'https://west.albion-online-data.com';

    const endpoint = `${host}/api/v2/stats/prices/${encodeURIComponent(itemIds)}.json?locations=${encodeURIComponent(locations)}&qualities=${encodeURIComponent(qualities)}`;

    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Falha ao consultar a API do Albion.' });
    }

    const data = await response.json();
    return res.status(200).json({
      ok: true,
      data,
      meta: {
        source: 'albion-data',
        server: serverKey,
        itemCount: itemIds.split(',').length,
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar preços do Albion.' });
  }
};
