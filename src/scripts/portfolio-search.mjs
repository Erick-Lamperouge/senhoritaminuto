export function normalizeSearch(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
export function matchesSearch(haystack,query){const text=normalizeSearch(haystack);return normalizeSearch(query).split(/\s+/).filter(Boolean).every(word=>text.includes(word));}
export function mountSearch({controls,input,empty,cards}){
 if(!controls||!input)return;
 function filter(){let count=0;for(const card of cards){card.hidden=!matchesSearch([card.textContent,card.getAttribute('href'),card.dataset.search].filter(Boolean).join(' '),input.value);if(!card.hidden)count++;}if(empty)empty.hidden=count!==0;}
 controls.hidden=false;input.addEventListener('input',filter);window.addEventListener('sm:language-changed',filter);filter();
}
