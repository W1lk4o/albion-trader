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

    const itemIds = (item || items)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .join(',');

    if (!itemIds) {
      return res.status(400).json({ error: 'Informe ao menos um item.' });
    }

    const allowedServers = new Set(['west', 'europe', 'east']);
    const host = allowedServers.has(server) ? server : 'west';

    const endpoint = `https://${host}.albion-online-data.com/api/v2/stats/prices/${encodeURIComponent(itemIds)}.json?locations=${encodeURIComponent(locations)}&qualities=${encodeURIComponent(qualities)}`;

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
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ ok: true, data, meta: { source: 'albion-data', itemCount: itemIds.split(',').length, server: host } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar preços do Albion.' });
  }
};
