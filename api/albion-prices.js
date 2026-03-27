const HOSTS = {
  west: 'https://west.albion-online-data.com',
  europe: 'https://europe.albion-online-data.com',
  east: 'https://east.albion-online-data.com'
};

const MAX_ITEMS_PER_CALL = 40;

async function fetchChunk({ itemIds, locations, qualities, server }) {
  const base = HOSTS[server] || HOSTS.west;
  const endpoint = `${base}/api/v2/stats/prices/${encodeURIComponent(itemIds.join(','))}.json?locations=${encodeURIComponent(locations.join(','))}&qualities=${encodeURIComponent(qualities.join(','))}`;

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br'
    }
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Albion Data respondeu ${response.status}. ${text}`.trim());
  }

  return response.json();
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Método não permitido.' });
  }

  try {
    const rawItems = String(req.query.items || req.query.item || '').split(',').map((item) => item.trim()).filter(Boolean);
    const itemIds = [...new Set(rawItems)];

    if (!itemIds.length) {
      return res.status(400).json({ ok: false, error: 'Informe ao menos um item.' });
    }

    const qualities = [...new Set(String(req.query.qualities || '1').split(',').map((value) => Number(value.trim())).filter((value) => value >= 1 && value <= 5))];
    const locations = [...new Set(String(req.query.locations || 'Bridgewatch,Martlock,Lymhurst,Fort Sterling,Thetford,Caerleon').split(',').map((value) => value.trim()).filter(Boolean))];
    const server = String(req.query.server || 'west').trim();

    const chunks = [];
    for (let i = 0; i < itemIds.length; i += MAX_ITEMS_PER_CALL) {
      chunks.push(itemIds.slice(i, i + MAX_ITEMS_PER_CALL));
    }

    const allRows = [];
    for (const chunk of chunks) {
      const rows = await fetchChunk({ itemIds: chunk, locations, qualities, server });
      allRows.push(...rows);
    }

    return res.status(200).json({
      ok: true,
      data: allRows,
      meta: {
        source: 'albion-data',
        server,
        items: itemIds.length,
        qualities,
        locations
      }
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Erro ao consultar Albion Data.' });
  }
};
