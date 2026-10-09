# Site da Led Marketing (LEDM)

Site institucional da Led Marketing, agência digital para o mercado imobiliário do litoral de São Paulo.

## Tecnologia

Next.js 16 (App Router), TypeScript e Tailwind CSS 4. Páginas estáticas, prontas para a Vercel.

## Rodar no computador

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera a versão de produção
```

## Onde mudar cada coisa

| O que | Arquivo |
|---|---|
| Textos da página inicial | `src/content/inicio.json` |
| Perguntas frequentes | `src/content/duvidas.json` |
| Menu, botões, rodapé e formulário | `src/content/comum.json` |
| Contatos, cidades e opções do site | `src/data/site.json` |
| Cores e fontes da marca | `src/app/globals.css` |
| Logos e fotos | `public/brand/` e `public/img/` |

## Antes de publicar

- Os cases estão como rascunho (`opcoes.casesProntos: false` em `src/data/site.json`) e com textos `[PREENCHER]` em `src/content/inicio.json`.
- As fotos de `public/img/` são provisórias, do Unsplash. Créditos em `src/data/creditos-fotos.json`.

## Publicar na Vercel

1. Em vercel.com, **Add New → Project** e importe este repositório.
2. A Vercel detecta o Next.js sozinha. Não precisa mudar nenhuma configuração.
3. Variáveis de ambiente (opcionais, de medição): `NEXT_PUBLIC_GA4_ID` e `NEXT_PUBLIC_META_PIXEL_ID`. Veja `.env.example`.
4. Clique em **Deploy**.
