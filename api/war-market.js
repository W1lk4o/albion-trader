
const { json, fetchPrices } = require('./_lib');

const modeSets = {
  zvz: {
    label: 'ZvZ',
    items: [
      { itemId:'T6_HEAD_CLOTH_SET2', label:'Capuz de Clérigo', reason:'Muito usado em comps organizadas.' },
      { itemId:'T6_ARMOR_CLOTH_SET2', label:'Manto de Clérigo', reason:'Peça-chave em muitas builds de backline.' },
      { itemId:'T6_SHOES_PLATE_SET1', label:'Botas de Soldado', reason:'Mobilidade forte e procura recorrente.' },
      { itemId:'T6_MAIN_HOLYSTAFF_AVALON', label:'Hallowfall', reason:'Staff muito observado em guerras.' }
    ]
  },
  smallscale: {
    label: 'Small Scale',
    items: [
      { itemId:'T6_MAIN_SPEAR', label:'Lança', reason:'Versátil e com boa rotação.' },
      { itemId:'T6_ARMOR_LEATHER_SET1', label:'Jaqueta de Mercenário', reason:'Peça popular em comps menores.' },
      { itemId:'T6_HEAD_CLOTH_SET3', label:'Capuz de Mago', reason:'Excelente utilidade em brigas curtas.' }
    ]
  },
  mists: {
    label: 'Mists',
    items: [
      { itemId:'T6_MAIN_RAPIER_MORGANA', label:'Bloodletter', reason:'Meta constante para mobilidade e execute.' },
      { itemId:'T6_HEAD_LEATHER_SET3', label:'Capuz de Assassino', reason:'Muito usado por solo PvP.' },
      { itemId:'T6_CAPEITEM_FW_THETFORD', label:'Capa de Thetford', reason:'Muito comum em setups agressivas.' }
    ]
  },
  corrupted: {
    label: 'Corrompida',
    items: [
      { itemId:'T6_MAIN_SPEAR', label:'Lança', reason:'Bom desempenho em 1v1.' },
      { itemId:'T6_HEAD_CLOTH_SET3', label:'Capuz de Mago', reason:'Anti-buff e pressão.' },
      { itemId:'T6_POTION_COOLDOWN', label:'Poção de Veneno', reason:'Consumível com giro real.' }
    ]
  },
  hellgate: {
    label: 'Hellgate',
    items: [
      { itemId:'T6_MAIN_FIRESTAFF_KEEPER', label:'Wildfire', reason:'Pressão explosiva.' },
      { itemId:'T6_ARMOR_CLOTH_SET2', label:'Manto de Clérigo', reason:'Backline muito comum.' },
      { itemId:'T6_POTION_HEAL', label:'Poção de Cura', reason:'Consumível recorrente.' }
    ]
  },
  arena: {
    label: 'Arena',
    items: [
      { itemId:'T6_MAIN_BOW', label:'Arco', reason:'Fácil de pilotar e com procura.' },
      { itemId:'T6_HEAD_PLATE_SET1', label:'Capacete de Soldado', reason:'Peça coringa em comps simples.' },
      { itemId:'T6_OMELETTE', label:'Omelete', reason:'Consumível comum em PvP estruturado.' }
    ]
  }
};

module.exports = async (req, res) => {
  try{
    const { searchParams } = new URL(req.url, 'http://localhost');
    const mode = searchParams.get('mode') || 'zvz';
    const city = searchParams.get('city') || 'Caerleon';
    const server = searchParams.get('server') || 'west';
    const set = modeSets[mode] || modeSets.zvz;
    const rows = await fetchPrices({ server, itemIds:set.items.map(i=>i.itemId), locations:[city] });
    const priceById = Object.fromEntries(rows.map(r => [r.item_id, Number(r.buy_price_max || r.sell_price_min || 0)]));
    const items = set.items.map(i => ({ ...i, price: priceById[i.itemId] || 0 }));
    return json(res, 200, { ok:true, modeLabel:set.label, items });
  }catch(err){
    return json(res, 500, { ok:false, error:'Falha ao carregar mercado de guerra.', details:String(err.message || err) });
  }
};
