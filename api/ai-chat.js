module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'A IA ainda não foi ativada. Configure OPENAI_API_KEY no projeto da Vercel.'
      });
    }

    const {
      module: moduleName = 'overview',
      message = '',
      context = {},
      history = []
    } = req.body || {};

    if (!String(message || '').trim()) {
      return res.status(400).json({ error: 'Envie uma pergunta para a IA.' });
    }

    const systemPrompt = [
      'Você é o assistente do Albion Trader.',
      'Responda em português do Brasil.',
      'Seja objetivo, útil e prático.',
      'Sempre entregue recomendação acionável, não só teoria.',
      'Quando houver números no contexto, use-os.',
      'Quando o módulo for ilhas, explique claramente o que plantar, o que criar e por quê.',
      'Quando o módulo for riqueza, responda em etapas claras e respeite as atividades favoritas do jogador quando elas existirem.',
      'Quando o módulo for mercado, priorize margem, giro e risco.',
      'Quando o módulo for guerra, transforme a leitura em itens que valem vigiar no mercado.',
      'Nunca invente que viu dados que não estão no contexto. Se faltar dado, diga o que falta.'
    ].join(' ');

    const limitedHistory = Array.isArray(history) ? history.slice(-6) : [];
    const input = [
      {
        role: 'system',
        content: [{ type: 'input_text', text: systemPrompt }]
      },
      ...limitedHistory.map((item) => ({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: [{ type: 'input_text', text: String(item.text || '').slice(0, 2000) }]
      })),
      {
        role: 'user',
        content: [{
          type: 'input_text',
          text: JSON.stringify({ module: moduleName, context, question: message })
        }]
      }
    ];

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input,
        max_output_tokens: 500
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.error?.message || 'Falha ao consultar a IA.';
      return res.status(response.status).json({ error: message });
    }

    const text = typeof data.output_text === 'string'
      ? data.output_text
      : Array.isArray(data.output)
        ? data.output
            .flatMap((item) => item.content || [])
            .filter((item) => item.type === 'output_text' || item.type === 'text')
            .map((item) => item.text || '')
            .join('\n')
        : '';

    return res.status(200).json({ ok: true, answer: text || 'A IA respondeu, mas sem texto retornado.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao consultar a IA.' });
  }
};
