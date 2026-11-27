import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const read=p=>readFileSync(p), text=p=>readFileSync(p,'utf8');
const lock=JSON.parse(text('blog-engine.lock.json'));
const inventory=JSON.parse(text('.blog-core-source/v2/review-shots/seo-inventory.json'));
const expectedPages=new Map(inventory.pages.map(p=>[path.join('dist',p.path,'index.html'),p]));
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const check=(name,fn)=>{fn();console.log('PASS '+name)};
check('portal source protection',()=>{
 const changes=execFileSync('git',['diff','--name-only',lock.portalBaseline,'HEAD'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
 const allow=new Set(['.gitignore','package.json','blog-engine.lock.json','scripts/check-blog-integration.mjs','scripts/build-blog-bundle.mjs','scripts/test-blog-portal-browser.mjs','.github/workflows/blog-integration-ci.yml','.github/workflows/deploy.yml','docs/BLOG-INTEGRATION.md','src/pages/index.astro','src/pages/projetos/blogs.astro','src/components/ArchiveMascot.astro','src/scripts/i18n.js','src/styles/blog-catalog.css','src/components/BlogSelector.astro','src/components/CatalogIcon.astro','src/config/blog-catalog.mjs','src/scripts/blog-selector.mjs','src/scripts/mascot.js','src/scripts/mascot/portals.js','test/portfolio.test.mjs','docs/PORTFOLIO-AUDIT.md','README.md','TESTE-REGRESSAO.md','src/components/JackMascot.astro','src/pages/projetos/jack-up.astro','src/styles/project-mascot.css','src/scripts/mascot/project-dialogue.js','src/scripts/mascot/timers.js','test/mascot.test.mjs','scripts/check-public-surface.mjs','docs/SECURITY.md','src/scripts/mascot/speech.js','src/components/ScratchCat.astro','src/components/FernandoInline.astro','src/components/FernandoTribute.astro','src/pages/projetos/scratch.astro','src/scripts/mascot/progress.js','src/scripts/mascot/audio.js','src/config/portfolio.mjs','src/scripts/portfolio-search.mjs','src/components/ProjectEmbed.astro','src/scripts/mascot/project-scenes.js','docs/MASCOT-SCENES.md']);
 assert.ok(changes.every(p=>allow.has(p)),'Unexpected paths: '+changes.filter(p=>!allow.has(p)).join(', '));
});
check('original routes and mascot preserved',()=>{for(const p of ['dist/index.html','dist/projetos/scratch/index.html','dist/projetos/fernando/index.html','dist/projetos/jack-up/index.html']){const s=text(p);assert.ok(s.includes('id="mascotButton"'),p);assert.ok(!s.includes('class="blog"'),p);}});
check('Jack mascot present',()=>{const h=text('dist/projetos/jack-up/index.html');assert.ok(h.includes('id="jack-character"')&&h.includes('id="mascotButton"')&&h.includes('data-mascot-species="alligator"'));assert.ok(!h.includes('id="archive-character"'));assert.ok(!h.includes('data-mascot-motion')&&!h.includes('project-scene-controls'));assert.ok(h.includes('jack-crutch')&&h.includes('jack-ball')&&h.includes('jack-cap')&&h.includes('project-speech'));});
check('catalog and project search',()=>{const h=text('dist/index.html'),c=text('dist/projetos/blogs/index.html');for(const token of ['id="project-search"','href="/projetos/blogs/"'])assert.ok(h.includes(token));for(const token of ['id="archive-character"','id="blog-search"','href="/futebolando/"','href="/futebolando/en/"'])assert.ok(c.includes(token));assert.ok(c.includes('id="mascotButton"'));assert.ok(c.includes('id="selector-stage"'));assert.ok(!c.includes('data-mascot-motion')&&!c.includes('project-scene-controls'));assert.ok(c.includes('data-character-role="minute-brother"')&&c.includes('archive-legs-seated')&&c.includes('archive-files')&&c.includes('project-speech'));assert.ok(!c.includes('href="/culinaria/"')&&!c.includes('href="/engenharia/"'));});
check('domain and original public assets',()=>{for(const f of walk('public'))assert.deepEqual(read(f),read(path.join('dist',path.relative('public',f))));assert.equal(text('dist/CNAME').trim(),'senhoritaminuto.com.br');});
check('football routes match inventory',()=>{const pages=walk('dist/futebolando').filter(f=>f.endsWith('.html'));assert.deepEqual([...pages].sort(),[...expectedPages.keys()].sort());for(const p of pages){const h=text(p);assert.ok(h.includes('noindex,nofollow')&&h.includes('class="blog"'),p);for(const token of ['id="mascotButton"','id="archive-character"','id="jack-character"','class="mascot-zone"','/assets/characters/','adsbygoogle','googletagmanager.com','pagead2.googlesyndication.com'])assert.ok(!h.includes(token),p+': '+token);}});
check('both languages and all articles present',()=>{const a=JSON.parse(text('.blog-core-source/v2/content/articles.json'));assert.ok(a.length>0);for(const article of a)for(const [locale,ed] of Object.entries(article.editions)){const route=locale==='en'?'en/articles':'artigos';const h=text('dist/futebolando/'+route+'/'+ed.slug+'/index.html');assert.ok(h.includes('lang="'+locale+'"'));}assert.ok(text('dist/futebolando/index.html').includes('href="/futebolando/en/"'));assert.ok(text('dist/futebolando/en/index.html').includes('href="/futebolando/"'));});
check('no unrelated blog or active monetization',()=>{assert.ok(!existsSync('dist/culinaria-demo'));assert.ok(!existsSync('dist/ads.txt'));for(const n of ['barlow-condensed','source-serif-4','inter'])assert.ok(read('dist/blog-font-licenses/'+n+'.txt').length>100);});
check('local Astro assets and football links resolve',()=>{for(const f of walk('dist').filter(f=>f.endsWith('.html'))){const h=text(f);for(const m of h.matchAll(/(?:src|href)="(\/(?:_astro|futebolando|projetos\/blogs)\/[^"?#]*)(?:[?#][^"]*)?"/g)){const p=path.join('dist',m[1].slice(1));assert.ok(existsSync(p)||existsSync(path.join(p,'index.html')),f+': '+m[1]);}}});
check('SEO preserved and publication gate closed',()=>{
 const pages=walk('dist/futebolando').filter(f=>f.endsWith('.html'));
 const byUrl=new Map();
 const tags=(h,t)=>[...h.matchAll(new RegExp('<'+t+'\\b[^>]*>','gi'))].map(m=>Object.fromEntries([...m[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(a=>[a[1],a[2]])));
 for(const file of pages){
  const h=text(file),head=h.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];assert.ok(head,file);
  const canonical='https://senhoritaminuto.com.br/'+file.replace(/^dist\//,'').replace(/index\.html$/,'');
  const links=tags(head,'link'),meta=tags(head,'meta'),alternates=links.filter(x=>x.rel==='alternate'&&x.hreflang);
  assert.deepEqual(links.filter(x=>x.rel==='canonical').map(x=>x.href),[canonical],file);
  assert.deepEqual(alternates.map(a=>({locale:a.hreflang,href:a.href})),expectedPages.get(file).alternates);
  assert.deepEqual(meta.filter(x=>x.name==='robots').map(x=>x.content),['noindex,nofollow']);
  assert.equal(meta.find(x=>x.property==='og:url')?.content,canonical);
  assert.ok(!head.includes('application/ld+json')&&!head.includes('article:published_time'));
  assert.ok(!byUrl.has(canonical));byUrl.set(canonical,alternates);
 }
 for(const [url,links] of byUrl)for(const alt of links){assert.ok(byUrl.get(alt.href)?.some(a=>a.href===url),'Unreciprocal language alternate '+url);}
 assert.ok(!walk('dist/futebolando').some(p=>/sitemap[^/]*\.xml$/i.test(p)));
});
check('trust and privacy notice in both languages',()=>{
 for(const [p,locale] of [['dist/futebolando/transparencia/index.html','pt-BR'],['dist/futebolando/en/transparency/index.html','en']]){
  const h=text(p);assert.ok(h.includes('data-trust-page')&&h.includes('data-contact-pending')&&h.includes('lang="'+locale+'"'));assert.ok(!/<form\b|href="mailto:|<iframe\b|googletagmanager\.com|adsbygoogle/i.test(h));
 }
 for(const p of expectedPages.keys())assert.ok(text(p).includes('data-trust-link'),p);
});
check('sports snapshots and highlights are clearly labelled and isolated',()=>{
 for(const p of ['dist/futebolando/index.html','dist/futebolando/en/index.html']){
  const h=text(p);assert.ok(h.includes('data-highlight-mode="curated-preview"')&&h.includes('data-football-centre')&&h.includes('data-competition="brasileirao"')&&h.includes('data-competition="world-cup"'));
  assert.ok(!h.includes('data-fixture-date=')&&!h.includes('googletagmanager.com'));
  assert.ok(h.includes('2026-09-20')&&h.includes('CC0-1.0'));
 }
 for(const p of ['dist/index.html','dist/projetos/blogs/index.html','dist/projetos/jack-up/index.html','dist/projetos/scratch/index.html','dist/projetos/fernando/index.html'])assert.ok(!text(p).includes('data-football-centre'),p);
});
check('semantic palette scoped to Futebolando',()=>{
 for(const p of expectedPages.keys()){const h=text(p);assert.ok(h.includes('data-color-system="editorial"'),p);assert.ok(h.includes('--blog-light-tone-bronze:#805522')&&h.includes('--blog-dark-tone-plum:#C7B4DF'),p);}
 for(const p of ['dist/index.html','dist/projetos/blogs/index.html','dist/projetos/jack-up/index.html','dist/projetos/scratch/index.html','dist/projetos/fernando/index.html'])assert.ok(!text(p).includes('data-color-system="editorial"'),p);
 for(const [p,tone] of [['artigos/impedimento','steel'],['artigos/real-madrid-historia','bronze'],['artigos/libertadores-formato','wine'],['artigos/xg-gols-esperados','plum']])assert.ok(text('dist/futebolando/'+p+'/index.html').includes('class="article-page" data-tone="'+tone+'"'),p);
});
console.log('13 integration groups passed');
