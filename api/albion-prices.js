module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { item = 'T4_BAG', locations = 'Caerleon,Bridgewatch,Martlock,Lymhurst,Fort Sterling,Thetford' } = req.query || {};
    const endpoint = `https://west.albion-online-data.com/api/v2/stats/prices/${encodeURIComponent(item)}.json?locations=${encodeURIComponent(locations)}`;

    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Falha ao consultar a API do Albion.' });
    }

    const data = await response.json();
    return res.status(200).json({ ok: true, data });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar preços do Albion.' });
  }
};
