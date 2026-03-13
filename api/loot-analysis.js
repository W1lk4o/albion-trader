
const { json, parseBody, fetchPrices } = require('./_lib');

function parseLootLine(line){
  const parts = line.trim().split(/\s+/);
  if(parts.length < 2) return null;
  const qty = Number(parts.pop());
  const itemId = parts.join(' ').trim();
  if(!itemId || !qty) return null;
  return { itemId, qty };
}

module.exports = async (req, res) => {
  if(req.method !== 'POST') return json(res, 405, { ok:false, error:'Método não permitido' });
  try{
    const { lines = [], city='Caerleon', server='west' } = await parseBody(req);
    const parsed = lines.map(parseLootLine).filter(Boolean);
    if(!parsed.length) return json(res, 400, { ok:false, error:'Envie pelo menos uma linha válida de loot.' });

    const cities = ['Bridgewatch','Caerleon','Fort Sterling','Lymhurst','Martlock','Thetford','Brecilien'];
    const rows = await fetchPrices({ server, itemIds: parsed.map(i => i.itemId), locations: cities });
    const byItem = {};
    for(const r of rows){
      if(!byItem[r.item_id]) byItem[r.item_id] = [];
      byItem[r.item_id].push(r);
    }

    let rawValue = 0;
    let bestCityValue = 0;
    const items = parsed.map(item => {
      const arr = byItem[item.itemId] || [];
      const current = arr.find(r => r.city === city) || arr[0] || {};
      const currentValue = Number(current.buy_price_max || current.sell_price_min || 0) * item.qty;
      rawValue += currentValue;

      let bestCity = city;
      let bestValue = currentValue;
      for(const row of arr){
        const v = Number(row.buy_price_max || row.sell_price_min || 0) * item.qty;
        if(v > bestValue){
          bestValue = v;
          bestCity = row.city;
        }
      }
      bestCityValue += bestValue;
      const refineSuggestion = /ORE|WOOD|FIBER|HIDE|ROCK/.test(item.itemId) ? 'Considere comparar com refino antes de vender.' : 'Venda direto se o giro estiver alto.';
      return {
        itemId: item.itemId,
        qty: item.qty,
        currentValue,
        bestCity,
        bestValue,
        bestAction: bestCity !== city ? `Levar para ${bestCity}` : refineSuggestion
      };
    });

    return json(res, 200, {
      ok:true,
      items,
      summary: {
        rawValue,
        bestCity: items.sort((a,b)=>b.bestValue-a.bestValue)[0]?.bestCity || city,
        bestCityValue,
        extraByTravel: Math.max(bestCityValue - rawValue, 0),
        refineSuggestion: parsed.some(p => /ORE|WOOD|FIBER|HIDE|ROCK/.test(p.itemId)) ? 'Para recursos brutos, compare venda x refino antes de decidir.' : 'Seu loot está mais orientado à venda direta.'
      }
    });
  }catch(err){
    return json(res, 500, { ok:false, error:'Falha ao analisar loot.', details:String(err.message || err) });
  }
};
