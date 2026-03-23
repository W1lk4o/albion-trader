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

    const itemIds = Array.from(new Set(
      String(item || items)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    ));

    if (!itemIds.length) {
      return res.status(400).json({ error: 'Informe ao menos um item.' });
    }

    if (itemIds.length > 400) {
      return res.status(400).json({ error: 'Consulta muito grande. Reduza a quantidade de itens por vez.' });
    }

    const hostMap = {
      west: 'https://west.albion-online-data.com',
      europe: 'https://europe.albion-online-data.com',
      east: 'https://east.albion-online-data.com'
    };

    const base = hostMap[server] || hostMap.west;
    const endpoint = `${base}/api/v2/stats/prices/${encodeURIComponent(itemIds.join(','))}.json?locations=${encodeURIComponent(locations)}&qualities=${encodeURIComponent(qualities)}`;

    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Falha ao consultar a API do Albion.' });
    }

    const raw = await response.json();
    const data = Array.isArray(raw)
      ? raw.map((row) => ({
          item_id: row.item_id || null,
          city: row.city || null,
          quality: Number(row.quality || 0),
          sell_price_min: Number(row.sell_price_min || 0),
          sell_price_min_date: row.sell_price_min_date || null,
          buy_price_max: Number(row.buy_price_max || 0),
          buy_price_max_date: row.buy_price_max_date || null
        }))
      : [];

    return res.status(200).json({
      ok: true,
      data,
      meta: {
        source: 'albion-data',
        server,
        itemCount: itemIds.length,
        locationCount: String(locations).split(',').map((value) => value.trim()).filter(Boolean).length,
        qualityCount: String(qualities).split(',').map((value) => value.trim()).filter(Boolean).length
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar preços do Albion.' });
  }
};
