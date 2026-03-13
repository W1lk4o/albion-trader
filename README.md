# Albion Trader — Vercel

Projeto pronto para Vercel com frontend estático + API Functions.

## Login padrão

Admin:
- email: wilkeringracio@gmail.com
- senha: Wilker12@

Teste:
- email: convidado@albiontrader.com
- senha: Albion123

## Variáveis de ambiente no Vercel

Obrigatórias para produção séria:
- `JWT_SECRET`

Para ativar a IA:
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (opcional, padrão: `gpt-4.1-mini`)

## Rotas da API

- `/api/login`
- `/api/me`
- `/api/users`
- `/api/albion-prices`
- `/api/ai-chat`
