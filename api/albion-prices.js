export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const payload = req.method === 'POST' ? req.body : req.query;
    const server = String(payload.server || 'west');
    const itemIds = Array.isArray(payload.itemIds) ? payload.itemIds : String(payload.itemIds || '').split(',').filter(Boolean);
    const qualities = Array.isArray(payload.qualities) ? payload.qualities : String(payload.qualities || '1').split(',').filter(Boolean);
    const locations = Array.isArray(payload.locations) ? payload.locations : String(payload.locations || '').split(',').filter(Boolean);

    const hostMap = {
      west: 'https://west.albion-online-data.com',
      europe: 'https://europe.albion-online-data.com',
      east: 'https://east.albion-online-data.com'
    };
    const host = hostMap[server] || hostMap.west;

    const uniqueItems = [...new Set(itemIds)].filter(Boolean).slice(0, 500);
    const uniqueQualities = [...new Set(qualities.map((v) => String(v)).filter(Boolean))];
    const uniqueLocations = [...new Set(locations.map((v) => String(v)).filter(Boolean))];

    if (!uniqueItems.length) return res.status(200).json([]);
    if (!uniqueLocations.length) return res.status(400).json({ error: 'locations ausentes' });

    const chunkSize = 12;
    const out = [];
    for (let i = 0; i < uniqueItems.length; i += chunkSize) {
      const chunk = uniqueItems.slice(i, i + chunkSize);
      const url = `${host}/api/v2/stats/prices/${encodeURIComponent(chunk.join(','))}?locations=${encodeURIComponent(uniqueLocations.join(','))}&qualities=${encodeURIComponent(uniqueQualities.join(','))}`;
      const response = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'AlbionFlipPro/1.0' }
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        return res.status(502).json({ error: `Albion Data falhou (${response.status})`, details: text.slice(0, 300) });
      }
      const rows = await response.json();
      if (Array.isArray(rows)) out.push(...rows);
    }

    return res.status(200).json(out);
  } catch (error) {
    return res.status(500).json({ error: 'Falha interna ao consultar preços', details: error?.message || String(error) });
  }
}
