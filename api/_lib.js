
const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
const scannerItems = JSON.parse(fs.readFileSync(path.join(dataDir, 'scanner-items.json'), 'utf-8'));

const users = [
  { email: "wilkeringracio@gmail.com", senha: "Wilker12@", admin: true, name: "Wilker" },
  { email: "convidado@albiontrader.com", senha: "Albion123", admin: false, name: "Convidado" }
];

function serverHost(server='west'){
  if(server === 'europe') return 'https://europe.albion-online-data.com';
  if(server === 'east') return 'https://east.albion-online-data.com';
  return 'https://west.albion-online-data.com';
}

function json(res, status, data){
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function parseBody(req){
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch(err){ reject(err); }
    });
    req.on('error', reject);
  });
}

async function fetchPrices({ server='west', itemIds=[], locations=[] }){
  const host = serverHost(server);
  const uniqueIds = [...new Set(itemIds)].filter(Boolean);
  const uniqueLocs = [...new Set(locations)].filter(Boolean);
  const out = [];
  const chunkSize = 30;
  for(let i=0;i<uniqueIds.length;i+=chunkSize){
    const chunk = uniqueIds.slice(i, i+chunkSize);
    const url = `${host}/api/v2/stats/prices/${chunk.join(',')}.json?locations=${encodeURIComponent(uniqueLocs.join(','))}`;
    const res = await fetch(url, { headers:{'accept':'application/json'} });
    if(!res.ok) continue;
    const data = await res.json();
    if(Array.isArray(data)) out.push(...data);
  }
  return out;
}

function buildMountSuggestion(profit){
  if(profit >= 1500000) return 'Javali / Mamute se o ticket for alto';
  if(profit >= 500000) return 'Javali ou Urso';
  return 'Swiftclaw ou Cavalo blindado';
}

function buildRouteSuggestion(from, to, margin){
  if(to === 'Caerleon') return `${from} → portal seguro → Caerleon`;
  if(margin > 25) return `${from} → rota curta direta até ${to}`;
  return `${from} → saída limpa → ${to}`;
}

module.exports = {
  users, scannerItems, serverHost, json, parseBody, fetchPrices, buildMountSuggestion, buildRouteSuggestion
};
