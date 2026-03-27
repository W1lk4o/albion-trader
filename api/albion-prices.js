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

    const hostMap = {
      west: 'https://west.albion-online-data.com',
      europe: 'https://europe.albion-online-data.com',
      east: 'https://east.albion-online-data.com'
    };
    const base = hostMap[server] || hostMap.west;

    const itemIds = [...new Set(String(item || items).split(',').map(v => v.trim()).filter(Boolean))];
    if (!itemIds.length) {
      return res.status(400).json({ error: 'Informe ao menos um item.' });
    }

    const chunkSize = 40;
    const chunks = [];
    for (let i = 0; i < itemIds.length; i += chunkSize) chunks.push(itemIds.slice(i, i + chunkSize));

    const allData = [];
    for (const chunk of chunks) {
      const endpoint = `${base}/api/v2/stats/prices/${encodeURIComponent(chunk.join(','))}.json?locations=${encodeURIComponent(locations)}&qualities=${encodeURIComponent(qualities)}`;
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip, deflate, br' }
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Falha ao consultar a API do Albion.' });
      }
      const data = await response.json();
      if (Array.isArray(data)) allData.push(...data);
    }

    return res.status(200).json({
      ok: true,
      data: allData,
      meta: {
        source: 'albion-data',
        server,
        itemCount: itemIds.length,
        batches: chunks.length
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar preços do Albion.' });
  }
};
