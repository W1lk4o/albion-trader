module.exports = async (req, res) => {
  try {
    const { itemIds = '', locations = '', qualities = '1', server = 'west' } = req.query;
    if (!itemIds) {
      res.status(400).json({ error: 'itemIds é obrigatório' });
      return;
    }

    const hostMap = {
      west: 'west',
      east: 'east',
      asia: 'asia'
    };

    const host = hostMap[server] || 'west';
    const path = `https://${host}.albion-online-data.com/api/v2/stats/prices/${encodeURIComponent(itemIds)}.json?locations=${encodeURIComponent(locations)}&qualities=${encodeURIComponent(qualities)}`;
    const response = await fetch(path, { headers: { 'User-Agent': 'AlbionTrader/6.0' } });
    const text = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    res.status(response.status).send(text);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao consultar Albion Data', details: String(error) });
  }
};
