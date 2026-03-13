
const { json, fetchPrices, scannerItems, buildMountSuggestion, buildRouteSuggestion } = require('./_lib');

module.exports = async (req, res) => {
  try{
    const { searchParams } = new URL(req.url, 'http://localhost');
    const server = searchParams.get('server') || 'west';
    const from = searchParams.get('from') || 'Bridgewatch';
    const to = searchParams.get('to') || 'Caerleon';
    const capital = Number(searchParams.get('capital') || 0);
    const limit = Number(searchParams.get('limit') || 20);

    const itemIds = scannerItems.map(i => i.item_id);
    const rows = await fetchPrices({ server, itemIds, locations:[from, to] });

    const grouped = new Map();
    for(const row of rows){
      if(!grouped.has(row.item_id)) grouped.set(row.item_id, []);
      grouped.get(row.item_id).push(row);
    }

    const results = [];
    for(const item of scannerItems){
      const arr = grouped.get(item.item_id) || [];
      const a = arr.find(r => r.city === from) || arr[0];
      const b = arr.find(r => r.city === to) || arr[1];
      if(!a || !b) continue;
      const buyPrice = Number(a.sell_price_min || 0);
      const sellPrice = Number(b.buy_price_max || 0);
      if(!buyPrice || !sellPrice || sellPrice <= buyPrice) continue;
      if(capital && buyPrice > capital) continue;
      const estimatedProfit = sellPrice - buyPrice;
      const marginPct = (estimatedProfit / buyPrice) * 100;
      results.push({
        itemId: item.item_id,
        label: item.label,
        category: item.label.split(' ')[0],
        from, to,
        buyPrice, sellPrice, estimatedProfit, marginPct,
        mountSuggestion: buildMountSuggestion(estimatedProfit),
        routeSuggestion: buildRouteSuggestion(from, to, marginPct)
      });
    }

    results.sort((a,b) => (b.estimatedProfit - a.estimatedProfit) || (b.marginPct - a.marginPct));
    return json(res, 200, { ok:true, results: results.slice(0, limit) });
  }catch(err){
    return json(res, 500, { ok:false, error:'Falha ao escanear arbitragem.', details:String(err.message || err) });
  }
};
