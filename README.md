# Senhorita Minuto

Portfólio em Astro publicado em `senhoritaminuto.com.br`.

## Refatoração da mascote

A lógica da Senhorita Minuto foi reorganizada para evitar concorrência entre animações, portais e timers.

### Estrutura

- `src/scripts/mascot.js` — controlador principal e estados da mascote.
- `src/scripts/mascot/timing.js` — padrão único de leitura e tempos globais.
- `src/scripts/mascot/timers.js` — registro central de `setTimeout`, permitindo cancelar sequências antigas.
- `src/scripts/mascot/portals.js` — único ponto autorizado a abrir/fechar os portais globais e o portal de interação.
- `src/styles/mascot.css` — estilos exclusivos da Senhorita Minuto.
- `src/styles/global.css` — estilos gerais do site; não contém mais CSS antigo da mascote.

### Regras importantes

- Falas usam como base 150 palavras/minuto.
- Falas normais têm no mínimo 3 s.
- Falas de clique/easter egg têm no mínimo 5,2 s.
- Falas iniciais dos mascotes têm no mínimo 5 s.
- A Senhorita Minuto dorme após 90 s sem atividade real do usuário.
- Ao detectar a primeira atividade enquanto dorme, ela espera 3 s e só então acorda. Movimentos seguintes não reiniciam essa contagem.
- Interações com mascotes usam um portal local preso à própria Senhorita Minuto. Os portais globais ficam reservados para travessias laterais e para a Senhorita Minuto do futuro.
- Toda sequência autônoma usa timers canceláveis. Ao iniciar uma interação ou o sono, callbacks antigos são descartados para impedir "portais fantasmas".

## Rodar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

## Publicar

O GitHub Actions publica automaticamente a branch `main` no GitHub Pages.

## Debug opcional

Para acompanhar apenas as transições importantes da Senhorita Minuto no console do navegador, acrescente `?smdebug=1` ao endereço local. Exemplo: `http://localhost:4321/projetos/fernando?smdebug=1`.

Os logs usam o prefixo `[Senhorita Minuto]` e registram sono, interações e saltos de portal sem poluir a execução normal.
