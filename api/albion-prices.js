
const { json, fetchPrices } = require('./_lib');

module.exports = async (req, res) => {
  try{
    const { searchParams } = new URL(req.url, 'http://localhost');
    const server = searchParams.get('server') || 'west';
    const itemId = searchParams.get('itemId') || '';
    const locations = (searchParams.get('locations') || '').split(',').filter(Boolean);
    if(!itemId || !locations.length) return json(res, 400, { ok:false, error:'Informe itemId e locations.' });
    const prices = await fetchPrices({ server, itemIds:[itemId], locations });
    return json(res, 200, { ok:true, prices });
  }catch(err){
    return json(res, 500, { ok:false, error:'Falha ao consultar Albion Data.', details:String(err.message || err) });
  }
};
