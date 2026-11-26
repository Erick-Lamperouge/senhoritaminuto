# Teste de regressão rápido

Antes de publicar, vale testar estes fluxos no navegador local.

## 1. Portal e mascotes

1. Abra `/projetos/scratch`.
2. Espere o gato iniciar a fala e a Senhorita Minuto responder.
3. Durante a aproximação, o único portal permitido é o portal que acompanha a Senhorita Minuto.
4. Não deve surgir portal isolado no canto esquerdo/direito da janela.
5. Repita em `/projetos/fernando`.

## 2. Sono

1. Recarregue a página.
2. Não mova o mouse, não pressione teclas e não use a roda por 90 s.
3. A Senhorita Minuto deve interromper a atividade autônoma, ir para a região de patrulha e deitar sobre a cama.
4. Continue sem interação: ela deve permanecer dormindo indefinidamente.
5. Mova o mouse uma vez.
6. Ela deve continuar dormindo por aproximadamente 3 s e só então voltar a patrulhar.

## 3. Cliques

1. Os cliques devem persistir ao navegar entre Home e projetos.
2. Ao recarregar a página, a contagem volta para zero.
3. O contador só aparece nos marcos configurados.
4. As falas dos marcos devem permanecer tempo suficiente para leitura (mínimo 5,2 s).

## 4. Idioma

1. Alterne PT/EN pelo menu do cabeçalho.
2. Confira Home, Scratch, FERNANDO e Jack-UP.
3. Confira também falas dos mascotes e as frases de sono.

## 5. Vitrine de blogs
- Senhorita Minuto e arquivista presentes; saudação com leitura e resposta local, sem portal global.
- Carrossel: setas, clique nas laterais, teclado, escolha de tema planejado sem link, lista somente dos blogs disponíveis. Sem animação quando movimento reduzido.
- Entrar em Futebolando: nenhum mascote do portal; retornar à vitrine; testar PT/EN.

## 6. Temporizadores de diálogo
- Clique novamente perto do desaparecimento do balão: o texto novo não pode desaparecer por callback antigo.
- Troque idioma durante saudação/resposta pendente: não deixar diálogo anterior ou portal órfão.
- O gato deve manter a brincadeira e a magia; FERNANDO preserva poses, dominó, dama e demais props; Jack e arquivista usam controlador comum.
- Sono e despertar: teste Chromium com relógio virtual preserva 90s/3s; testar manualmente os eventos especiais e o marco de 1000 cliques antes de refatoração ampla.

## 7. Eventos especiais e páginas
- A 1000ª interação durante um diálogo deve adiar (não perder) a visita do futuro; confirmar rachaduras zeradas e estado persistido. Navegação mantém contagem, reload zera.
- Confirmar que o portal de futuro fecha após chegada e reabre na partida; travessia bloqueada abre portais e os fecha ao concluir.
- Jack é jacaré azul; confirmar diálogo, iframe intacto, versão em inglês e link externo. Scratch preserva arte e jogo; catálogo permite pausar animação.

## 8. Cenas 05F
- Jack quica a bola, tira o boné, usa muleta e retorna ao idle; arquivista lê sentado, vira página, organiza fichas, levanta/aponta. Click troca pose e balão, não dispara callback anterior. Pausa e prefers-reduced-motion; validar cena automática quando visível.
- Balão absoluto com ponta no desktop e celular; sem moldura do personagem, sem clipping ou deslocamento dos demais blocos. Diálogos PT/EN e resposta da Senhorita Minuto. Jogos e artigos intactos.
