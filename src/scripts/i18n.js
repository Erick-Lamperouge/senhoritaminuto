const STORAGE_KEY='senhorita-minuto-language-v1';

const translations={
  pt:{
    'home.pageTitle':'Senhorita Minuto','scratch.pageTitle':'Projeto Scratch — Senhorita Minuto','fernando.pageTitle':'FERNANDO — Senhorita Minuto','jack.pageTitle':'Jack-UP — Senhorita Minuto',
    'nav.projects':'Projetos','nav.about':'Sobre','nav.pt':'Português','nav.en':'English',
    'home.timeline':'Linha do Tempo Principal',
    'home.hero.1':'Ideias que saíram','home.hero.2':'da cabeça e viraram projeto.',
    'home.description':'Um espaço onde reúno projetos, experiências e ferramentas desenvolvidas a partir de curiosidade, estudo e vontade de transformar ideias em algo que realmente funcione.',
    'home.viewProjects':'Ver projetos','home.aboutPlace':'Sobre este lugar',
    'home.console':'Bem-vindo. O tempo é curto; os projetos não precisam ser.',
    'home.selection':'SELEÇÃO / 001','home.featured':'Projetos em destaque',
    'home.projectsIntro':'Jogos, ferramentas e experiências desenvolvidas em contextos diferentes, mas reunidas pelo mesmo princípio: aprender construindo.',
    'card.scratch.eyebrow':'JOGO / SCRATCH','card.scratch.title':'Projeto Scratch','card.scratch.desc':'Um jogo desenvolvido no Scratch que combina narrativa, interação e uma improvável ameaça felina ao futuro da humanidade.','card.scratch.cta':'Jogar e conhecer','card.scratch.status':'PRONTO',
    'card.fernando.eyebrow':'EDTECH / ACLS','card.fernando.title':'FERNANDO','card.fernando.desc':'Simulador educacional para treinamento de parada cardiorrespiratória e raciocínio em ACLS.','card.fernando.cta':'Conhecer o projeto','card.fernando.status':'EM DESENVOLVIMENTO',
    'card.jack.eyebrow':'JOGO EDUCACIONAL / SAÚDE','card.jack.title':'Jack-UP','card.jack.desc':'Um jogo educacional em inglês voltado à área da saúde, com desafios e perguntas clínicas sobre fraturas.','card.jack.cta':'Jogar Jack-UP','card.jack.status':'JOGÁVEL',
    'about.eyebrow':'SOBRE ESTE HUB','about.title':'Senhorita Minuto é a porta de entrada.',
    'about.p1':'Aqui, compartilho a minha jornada e os meus projetos. No entanto, o verdadeiro alicerce de tudo isso tem nome: Lycia. Dedico este site à minha esposa, a pessoa mais importante do meu mundo. A sua força me sustenta todos os dias e a minha admiração por ela é infinita. Sem o seu apoio, nada disso seria possível.',
    'about.p2':'Este espaço também funciona como um arquivo em constante expansão. Novos projetos, experiências e ideias vão sendo adicionados à medida que ganham forma.',
    'about.github':'Ver meus projetos no GitHub ↗','footer.expanding':'● arquivo em expansão',
    'common.backTime':'← Voltar no Tempo (Início)','common.aboutProject':'Sobre o projeto','common.goGame':'Ir para o jogo','common.openSimulator':'Abrir simulador ↗','common.playHere':'Dá para jogar aqui','common.openOwn':'Abrir em tela própria ↗',
    'scratch.lead':'Narrativa, interação e uma ameaça felina improvável — tudo reunido em uma experiência jogável criada no Scratch.',
    'scratch.about1':'Aqui você pode conhecer um projeto desenvolvido no Scratch e experimentar sua proposta de forma integrada ao portfólio. A ideia é apresentar não apenas o resultado, mas também a experiência interativa que faz parte dele.',
    'scratch.about2':'A história parte de uma premissa bem-humorada: gatos estão se preparando para dominar o mundo. Entre personagens, escolhas e acontecimentos inesperados, o jogador acompanha essa pequena conspiração felina enquanto avança pela experiência.',
    'scratch.origin':'Origem','scratch.originText':'O projeto nasceu no Scratch e continua disponível em sua página original, com a mesma experiência que aparece incorporada aqui.','scratch.original':'Abrir projeto original no Scratch →',
    'fernando.lead':'Simulador educacional para treinamento de parada cardiorrespiratória e raciocínio em ACLS.',
    'fernando.status':'STATUS','fernando.statusValue':'EM DESENVOLVIMENTO','fernando.focus':'FOCO','fernando.experience':'EXPERIÊNCIA','fernando.experienceValue':'SIMULAÇÃO GUIADA',
    'fernando.quick':'Acesso rápido','fernando.quickText':'Se preferir, abra o FERNANDO diretamente em uma aba própria para usar a experiência completa do simulador.',
    'fernando.about':'Sobre o projeto','fernando.aboutText':'FERNANDO é um simulador educacional voltado ao treinamento de PCR e raciocínio em ACLS. O projeto foi pensado para apoiar aprendizagem prática, tomada de decisão e revisão estruturada de condutas em cenários críticos.',
    'fernando.how':'Como funciona','fernando.howText':'A experiência coloca o usuário diante de situações que exigem reconhecimento de ritmos, escolha de intervenções, administração de medicamentos e organização dos ciclos de atendimento, transformando conteúdo teórico em uma sequência de decisões.',
    'fernando.tributeEyebrow':'POR TRÁS DO NOME','fernando.tributeTitle':'Uma homenagem que virou personagem.','fernando.tributeText':'O nome FERNANDO também é uma homenagem ao meu sogro. Nesta página, a homenagem ganha uma presença interativa, com frases e lembranças que fazem parte do jeito dele.','fernando.tributeNote':'A interação é opcional: clique no personagem para ouvir uma das falas.',
    'jack.lead':'Um jogo educacional em inglês que leva conteúdos sobre fraturas para uma experiência interativa e jogável.',
    'jack.format':'FORMATO','jack.formatValue':'JOGO EDUCACIONAL','jack.language':'IDIOMA','jack.content':'CONTEÚDO','jack.health':'FRATURAS · SAÚDE',
    'jack.unavailable':'INDISPONÍVEL NO MOMENTO','jack.unavailableTitle':'O jogo ainda não está carregando nesta página.','jack.unavailableText':'Assim que a versão pública estiver disponível, o Jack-UP poderá ser jogado diretamente por aqui.',
    'jack.about':'Sobre o projeto','jack.aboutText':'Jack-UP é um jogo educacional em inglês desenvolvido para explorar conteúdos da área da saúde de forma interativa. Ao longo da experiência, o jogador encontra perguntas e desafios relacionados a fraturas, avançando pelo jogo à medida que responde às situações apresentadas.',
    'jack.experience':'A experiência','jack.experienceText':'O projeto combina aprendizagem e mecânicas de jogo em uma experiência simples e acessível, utilizando o inglês tanto na interface quanto no conteúdo apresentado ao jogador.',
    'mascot.clicks':'Cliques','mascot.projectToken':'PROJETO ENCONTRADO',
    'mascot.phrase.1':'Eu fico patrulhando as laterais. É o meu jeito de cuidar do arquivo.','mascot.phrase.2':'O tempo ajuda muito, mas curiosidade ajuda mais.','mascot.phrase.3':'Se algo sumir, talvez eu tenha passado por um portal.','mascot.phrase.4':'Os projetos estão por aqui. Eu só faço a introdução dramática.','mascot.phrase.5':'Jack-UP, FERNANDO e Scratch: todos têm um cantinho nesse arquivo.',
    'mascot.egg.5':'5 cliques. Curiosidade insistente detectada.','mascot.egg.7':'7 cliques. Isso já é afeto temporal.','mascot.egg.12':'12 cliques. Você e eu já temos um histórico.','mascot.egg.20':'20 cliques. Isso conta como teste de qualidade.','mascot.egg.25':'25 cliques. Estou considerando pedir crachá.','mascot.egg.50':'50 cliques. Meio século de teimosia excelente.','mascot.egg.90':'90 cliques. O tempo está do nosso lado.','mascot.egg.100':'100 cliques! Você encontrou um segredo centenário.','mascot.egg.200':'200 cliques. A linha do tempo aprovou você.','mascot.egg.500':'500 cliques. Isso virou um rito de passagem.','mascot.egg.1000':'1000 cliques. Você transcendeu o usuário comum.',
    'mascot.future':'Eu vim do futuro para consertar você.','mascot.futureBye':'Até a próxima linha do tempo.','mascot.projectFound':'Olha esse projeto que incrível: {project}. Clica nele pra olhar.','mascot.guitar':'♪ Tempo tempo tempo... ♫','mascot.balloon':'uuuh...','mascot.welcome':'Oi! Eu sou a Senhorita Minuto. Eu patrulho as laterais o tempo todo — e às vezes faço umas entradas mais dramáticas.',
    'cat.1':'Os gatos vão dominar o mundo.','cat.1r':'Não nesta linha do tempo.','cat.2':'O futuro pertence aos gatos.','cat.2r':'Só se eu deixar. E eu trouxe a varinha.','cat.3':'Quando o tempo acabar, os gatos ainda vão ganhar.','cat.3r':'Eu ainda posso reiniciar esta fase.','cat.4':'Só preciso de mais alguns minutos para dominar tudo.','cat.4r':'Minutos são justamente a minha especialidade.','cat.back':'Ah não... eu voltei pro passado.','cat.click1':'Miau.','cat.click2':'Você não viu nada.','cat.click3':'A revolução felina continua.','cat.click4':'O plano está adiantado alguns minutos.','cat.heard':'Eu ouvi isso.',
    'fernando.line1':'Arigó!','fernando.line2':'Minha família é do sertão. Povo arretado de bom!','fernando.line3':'Bora jogar dominó? Aí a conversa fica séria.','fernando.line4':'Sou muito bom na dama, viu?','fernando.line5':'A primeira fala de Valentina foi “Vovô”. Essa eu guardo comigo.'
  },
  en:{
    'home.pageTitle':'Senhorita Minuto','scratch.pageTitle':'Scratch Project — Senhorita Minuto','fernando.pageTitle':'FERNANDO — Senhorita Minuto','jack.pageTitle':'Jack-UP — Senhorita Minuto',
    'nav.projects':'Projects','nav.about':'About','nav.pt':'Portuguese','nav.en':'English',
    'home.timeline':'Main Timeline',
    'home.hero.1':'Ideas that left','home.hero.2':'my head and became projects.',
    'home.description':'A space where I gather projects, experiments and tools built from curiosity, study and the desire to turn ideas into something that actually works.',
    'home.viewProjects':'View projects','home.aboutPlace':'About this place',
    'home.console':'Welcome. Time is short; projects do not have to be.',
    'home.selection':'SELECTION / 001','home.featured':'Featured projects',
    'home.projectsIntro':'Games, tools and experiments built in different contexts, all connected by the same principle: learning by building.',
    'card.scratch.eyebrow':'GAME / SCRATCH','card.scratch.title':'Scratch Project','card.scratch.desc':'A Scratch game combining narrative, interaction and an unlikely feline threat to the future of humanity.','card.scratch.cta':'Play and explore','card.scratch.status':'READY',
    'card.fernando.eyebrow':'EDTECH / ACLS','card.fernando.title':'FERNANDO','card.fernando.desc':'An educational simulator for cardiac arrest training and ACLS clinical reasoning.','card.fernando.cta':'Explore project','card.fernando.status':'IN DEVELOPMENT',
    'card.jack.eyebrow':'EDUCATIONAL GAME / HEALTH','card.jack.title':'Jack-UP','card.jack.desc':'An English-language educational health game with clinical questions and challenges about fractures.','card.jack.cta':'Play Jack-UP','card.jack.status':'PLAYABLE',
    'about.eyebrow':'ABOUT THIS HUB','about.title':'Senhorita Minuto is the gateway.',
    'about.p1':'Here I share my journey and my projects. But the true foundation behind all of this has a name: Lycia. I dedicate this site to my wife, the most important person in my world. Her strength supports me every day, and my admiration for her is endless. Without her support, none of this would be possible.',
    'about.p2':'This space also works as an ever-expanding archive. New projects, experiments and ideas are added as they take shape.',
    'about.github':'View my projects on GitHub ↗','footer.expanding':'● expanding archive',
    'common.backTime':'← Back in Time (Home)','common.aboutProject':'About the project','common.goGame':'Go to the game','common.openSimulator':'Open simulator ↗','common.playHere':'You can play right here','common.openOwn':'Open in its own tab ↗',
    'scratch.lead':'Narrative, interaction and an unlikely feline threat — all inside a playable Scratch experience.',
    'scratch.about1':'Here you can explore a project built in Scratch and experience it directly inside the portfolio. The goal is to present not only the result, but also the interactive experience itself.',
    'scratch.about2':'The story starts with a playful premise: cats are preparing to take over the world. Through characters, choices and unexpected events, the player follows this small feline conspiracy as the experience unfolds.',
    'scratch.origin':'Origin','scratch.originText':'The project was born in Scratch and is still available on its original page, with the same experience embedded here.','scratch.original':'Open the original Scratch project →',
    'fernando.lead':'An educational simulator for cardiac arrest training and ACLS reasoning.',
    'fernando.status':'STATUS','fernando.statusValue':'IN DEVELOPMENT','fernando.focus':'FOCUS','fernando.experience':'EXPERIENCE','fernando.experienceValue':'GUIDED SIMULATION',
    'fernando.quick':'Quick access','fernando.quickText':'If you prefer, open FERNANDO in its own tab to use the complete simulator experience.',
    'fernando.about':'About the project','fernando.aboutText':'FERNANDO is an educational simulator focused on cardiac arrest training and ACLS reasoning. It was designed to support practical learning, decision-making and structured review of critical-care actions.',
    'fernando.how':'How it works','fernando.howText':'The experience places the user in situations that require rhythm recognition, intervention choices, medication administration and organization of care cycles, turning theory into a sequence of decisions.',
    'fernando.tributeEyebrow':'BEHIND THE NAME','fernando.tributeTitle':'A tribute that became a character.','fernando.tributeText':'The name FERNANDO is also a tribute to my father-in-law. On this page, that tribute becomes interactive through phrases and memories that reflect his personality.','fernando.tributeNote':'The interaction is optional: click the character to hear one of his lines.',
    'jack.lead':'An English-language educational game that turns fracture-related health content into an interactive, playable experience.',
    'jack.format':'FORMAT','jack.formatValue':'EDUCATIONAL GAME','jack.language':'LANGUAGE','jack.content':'CONTENT','jack.health':'FRACTURES · HEALTH',
    'jack.unavailable':'CURRENTLY UNAVAILABLE','jack.unavailableTitle':'The game is not loading on this page yet.','jack.unavailableText':'As soon as the public version is available, Jack-UP can be played directly here.',
    'jack.about':'About the project','jack.aboutText':'Jack-UP is an educational game in English designed to explore health content interactively. Throughout the experience, the player encounters questions and challenges related to fractures and progresses by answering the situations presented.',
    'jack.experience':'The experience','jack.experienceText':'The project combines learning and game mechanics in a simple, accessible experience, using English in both the interface and the content presented to the player.',
    'mascot.clicks':'Clicks','mascot.projectToken':'PROJECT FOUND',
    'mascot.phrase.1':'I patrol the edges. It is my way of looking after the archive.','mascot.phrase.2':'Time helps a lot, but curiosity helps even more.','mascot.phrase.3':'If something disappears, I may have gone through a portal.','mascot.phrase.4':'The projects are around here. I just provide the dramatic introduction.','mascot.phrase.5':'Jack-UP, FERNANDO and Scratch all have their own place in this archive.',
    'mascot.egg.5':'5 clicks. Persistent curiosity detected.','mascot.egg.7':'7 clicks. This is becoming temporal affection.','mascot.egg.12':'12 clicks. You and I already have history.','mascot.egg.20':'20 clicks. This counts as quality assurance.','mascot.egg.25':'25 clicks. I am considering asking for a badge.','mascot.egg.50':'50 clicks. Half a century of excellent stubbornness.','mascot.egg.90':'90 clicks. Time is on our side.','mascot.egg.100':'100 clicks! You found a century-old secret.','mascot.egg.200':'200 clicks. The timeline approves of you.','mascot.egg.500':'500 clicks. This has become a rite of passage.','mascot.egg.1000':'1000 clicks. You have transcended the ordinary user.',
    'mascot.future':'I came from the future to repair you.','mascot.futureBye':'See you on the next timeline.','mascot.projectFound':'Look at this project: {project}. Click it to take a look.','mascot.guitar':'♪ Time time time... ♫','mascot.balloon':'oooh...','mascot.welcome':'Hi! I am Senhorita Minuto. I patrol the edges all the time — and sometimes make a more dramatic entrance.',
    'cat.1':'Cats are going to rule the world.','cat.1r':'Not on this timeline.','cat.2':'The future belongs to cats.','cat.2r':'Only if I allow it. And I brought the wand.','cat.3':'When time runs out, cats will still win.','cat.3r':'I can still restart this level.','cat.4':'I only need a few more minutes to rule everything.','cat.4r':'Minutes happen to be my specialty.','cat.back':'Oh no... I went back to the past.','cat.click1':'Meow.','cat.click2':'You saw nothing.','cat.click3':'The feline revolution continues.','cat.click4':'The plan is a few minutes ahead.','cat.heard':'I heard that.',
    'fernando.line1':'Arigó!','fernando.line2':'My family is from the sertão. Wonderful people!','fernando.line3':'Want to play dominoes? Now it gets serious.','fernando.line4':'I am very good at checkers, you know?','fernando.line5':'Valentina’s first word was “Grandpa.” I keep that one close.'
  }
};

function normalizeLanguage(lang){return lang==='en'?'en':'pt';}
function getLanguage(){try{return normalizeLanguage(localStorage.getItem(STORAGE_KEY)||'pt');}catch{return 'pt';}}
function t(key,fallback=''){const lang=getLanguage();return translations[lang]?.[key]??translations.pt[key]??fallback??key;}

function applyLanguage(lang){
  const next=normalizeLanguage(lang);
  try{localStorage.setItem(STORAGE_KEY,next);}catch{}
  document.documentElement.lang=next==='en'?'en':'pt-BR';
  document.querySelectorAll('[data-i18n]').forEach((node)=>{
    if(!(node instanceof HTMLElement))return;
    const key=node.dataset.i18n;
    if(key)node.textContent=translations[next]?.[key]??translations.pt[key]??node.textContent;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((node)=>{
    if(!(node instanceof HTMLElement))return;
    const key=node.dataset.i18nAria;
    if(key)node.setAttribute('aria-label',translations[next]?.[key]??translations.pt[key]??node.getAttribute('aria-label')??'');
  });
  document.querySelectorAll('[data-language]').forEach((node)=>{
    if(!(node instanceof HTMLElement))return;
    node.classList.toggle('active',node.dataset.language===next);
    node.setAttribute('aria-pressed',String(node.dataset.language===next));
  });
  const main=document.querySelector('[data-page-title-key]');
  if(main instanceof HTMLElement){
    const key=main.dataset.pageTitleKey;
    if(key){const title=translations[next]?.[key]??translations.pt[key];if(title)document.title=title;}
  }
  window.dispatchEvent(new CustomEvent('sm:language-changed',{detail:{lang:next}}));
}

window.SM_I18N={t,getLanguage,applyLanguage,translations};

document.addEventListener('click',(event)=>{
  const target=event.target instanceof Element?event.target.closest('[data-language]'):null;
  if(!(target instanceof HTMLElement))return;
  const lang=target.dataset.language;
  if(lang)applyLanguage(lang);
});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>applyLanguage(getLanguage()),{once:true});
else applyLanguage(getLanguage());
