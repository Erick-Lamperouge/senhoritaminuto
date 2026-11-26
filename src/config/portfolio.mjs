/** Portfolio cards and mascot discovery use the same public registry. */
const entry=(id,title,eyebrow,description,href,cta,status)=>Object.freeze({id,title,eyebrow,description,href,cta,status,eyebrowKey:'card.'+id+'.eyebrow',titleKey:'card.'+id+'.title',descriptionKey:'card.'+id+'.desc',ctaKey:'card.'+id+'.cta',statusKey:'card.'+id+'.status'});
export const portfolioProjects=Object.freeze([
 entry('scratch','Projeto Scratch','JOGO / SCRATCH','Um jogo desenvolvido no Scratch que combina narrativa, interação e uma improvável ameaça felina ao futuro da humanidade.','/projetos/scratch','Jogar e conhecer','PRONTO'),
 entry('fernando','FERNANDO','EDTECH / ACLS','Simulador educacional para treinamento de parada cardiorrespiratória e raciocínio em ACLS.','/projetos/fernando','Conhecer o projeto','PRONTO'),
 entry('jack','Jack-UP','JOGO EDUCACIONAL / SAÚDE','Um jogo educacional em inglês voltado à área da saúde, com desafios e perguntas clínicas sobre fraturas.','/projetos/jack-up','Jogar Jack-UP','PRONTO'),
 entry('blogs','Rede de Blogs','PUBLICAÇÕES / CONHECIMENTO','Uma coleção de publicações independentes sobre diferentes temas, com pesquisa, análise e aprendizado.','/projetos/blogs/','Explorar os blogs','PRÉVIA')
]);
