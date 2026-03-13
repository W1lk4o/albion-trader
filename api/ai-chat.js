
const { json, parseBody } = require('./_lib');

function heuristicReply(message, context = {}){
  const msg = String(message || '').toLowerCase();
  const sec = context.currentSection || context.module || 'dashboard';

  if(msg.includes('pele')){
    return `Se o foco é pele, eu começaria comparando Bridgewatch, Martlock e Caerleon. Normalmente a decisão certa vem em 3 passos: ver preço bruto da pele, comparar couro refinado e medir spread entre cidades. Se você quiser, me diga seu tier, cidade atual e capital que eu te monto a rota.`;
  }
  if(msg.includes('cenoura') || msg.includes('erva') || msg.includes('ilha')){
    return `Para ilha, cenoura costuma ser rota simples e líquida. Ervas podem dar mais margem em momentos específicos, mas exigem comparar preço de semente, colheita e velocidade de venda. Me diga quantos plots você tem, se usa foco e sua cidade.`;
  }
  if(msg.includes('rota') || msg.includes('transport')){
    return `Para rota, eu preciso de origem, destino, peso da carga e se você quer o caminho mais seguro ou mais rápido. Para ticket alto, normalmente recomendo montaria mais resistente; para giros leves, montaria veloz.`;
  }
  if(msg.includes('loot') || msg.includes('drop')){
    return `Me mande o loot em linhas do tipo ITEM_ID quantidade e a cidade atual. Eu vou comparar venda direta, melhor cidade e se faz sentido refinar antes.`;
  }
  if(msg.includes('prata') || msg.includes('1 bilh') || msg.includes('milhão')){
    return `Para rota de prata, o importante não é só a meta. É sua preferência, horas por dia, capital atual e tolerância a risco. Se você não quiser a rota mais rentável, me diga o que gosta de fazer que eu traço um plano alternativo.`;
  }

  return `Entendi sua pergunta sobre ${sec}. Eu consigo ajudar com mercado, loot, rotas, craft, refino, ilhas e planejamento de prata. Me mande mais contexto: cidade, capital, item ou atividade preferida.`;
}

module.exports = async (req, res) => {
  if(req.method !== 'POST') return json(res, 405, { ok:false, error:'Método não permitido' });
  try{
    const { message, memory = [], context = {} } = await parseBody(req);
    const apiKey = process.env.OPENAI_API_KEY;
    if(!apiKey){
      const reply = heuristicReply(message, context);
      return json(res, 200, { ok:true, mode:'fallback', reply });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    const input = [
      {
        role: 'system',
        content: [
          { type: 'input_text', text:
`Você é a IA do Albion Trader. Responda em português do Brasil, direto ao ponto, com foco em lucro, mercado, loot, rotas, craft, refino, ilhas e estratégia de prata no Albion Online.
Use o contexto do usuário para responder. Se o contexto estiver incompleto, peça só o mínimo necessário. Sempre entregue uma recomendação prática primeiro.`
          }
        ]
      },
      ...memory.slice(-8).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: [{ type:'input_text', text:String(m.content || '') }]
      })),
      {
        role: 'user',
        content: [{ type:'input_text', text: `Contexto atual: ${JSON.stringify(context)}\n\nPergunta: ${message}` }]
      }
    ];

    const response = await fetch('https://api.openai.com/v1/responses', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, input, temperature: 0.4, max_output_tokens: 600 })
    });
    const data = await response.json();
    const reply = data.output_text || (data.output && JSON.stringify(data.output)) || 'Sem resposta.';
    return json(res, 200, { ok:true, mode:'openai', reply });
  }catch(err){
    return json(res, 500, { ok:false, error:'Falha no chat de IA.', details:String(err.message || err) });
  }
};
