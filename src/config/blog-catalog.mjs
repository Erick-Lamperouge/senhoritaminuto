/** Single registry for the portfolio showcase and available links.
 * Planned themes are visual placeholders, not released blogs.
 */
export const blogCatalog=Object.freeze([
  {id:'futebolando',name:'Futebolando',icon:'football',color:'#22c55e',status:'preview',href:'/futebolando/',englishHref:'/futebolando/en/',topicKey:'blogs.football.topic',descriptionKey:'blogs.football.description',topic:'FUTEBOL / ESPORTE',description:'Futebol além do placar: regras, clubes, campeonatos, tática e estatísticas.',search:'futebolando futebol esporte football sport soccer rules statistics estatística tática'},
  {id:'culinaria',name:'Culinária',nameKey:'blogs.concept.food',icon:'food',color:'#e5ad55',status:'planned',href:null,englishHref:null,topicKey:'blogs.concept.foodTopic',descriptionKey:'blogs.concept.foodDesc',topic:'TEMA EM PLANEJAMENTO',description:'Receitas e culturas gastronômicas. Nome provisório.',search:'culinaria food'},
  {id:'engenharia',name:'Engenharia',nameKey:'blogs.concept.engineering',icon:'engineering',color:'#6db8ad',status:'planned',href:null,englishHref:null,topicKey:'blogs.concept.engTopic',descriptionKey:'blogs.concept.engDesc',topic:'TEMA EM PLANEJAMENTO',description:'Construção, técnicas e conhecimento aplicado. Nome provisório.',search:'engenharia engineering'}
].map(Object.freeze));
export const availableBlogs=Object.freeze(blogCatalog.filter(entry=>entry.href&&entry.status==='preview'));
