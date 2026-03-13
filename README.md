# Albion Trader — Vercel Ready

Este projeto foi organizado para rodar no **Vercel** com:

- páginas estáticas (`index.html`, `dashboard.html`, `admin.html`)
- funções serverless em `api/`
- visual escuro com sidebar
- login por API
- proxy para preços do Albion Data

## Como subir no Vercel

1. Extraia o zip.
2. Envie todos os arquivos para a raiz do seu repositório GitHub.
3. No Vercel, conecte o repositório.
4. Deploy padrão.
5. Pronto.

## Login padrão

Admin:
- email: `wilkeringracio@gmail.com`
- senha: `Wilker12@`

Convidado:
- email: `convidado@albiontrader.com`
- senha: `Albion123`

## Importante

Esta versão foi pensada para **funcionar bem no Vercel sem banco de dados**.
Então ela já entrega um painel forte e com integração inicial com a API do Albion,
mas **cadastro/remoção persistente de usuários ainda depende de banco**.

Se quiser a próxima etapa profissional, o ideal é ligar:
- Vercel Postgres / Supabase / Neon
- autenticação persistente
- licenças reais
- logs de uso

## Estrutura

- `index.html` — login
- `dashboard.html` — painel do usuário
- `admin.html` — painel admin
- `api/login.js` — autenticação
- `api/me.js` — leitura da sessão
- `api/albion-prices.js` — preços do Albion
- `api/users.js` — lista de usuários demo

