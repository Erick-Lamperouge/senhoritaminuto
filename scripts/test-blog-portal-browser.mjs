import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {chromium} from 'playwright';
const origin='http://127.0.0.1:4321';
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'inherit'});
let browser;
try{
 for(let i=0;i<60;i++){try{if((await fetch(origin+'/')).ok)break;}catch{}await new Promise(r=>setTimeout(r,500));}
 browser=await chromium.launch({headless:true});mkdirSync('review-shots',{recursive:true});
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const p=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.abort());
  await p.goto(origin+'/',{waitUntil:'networkidle'});
  assert.equal(await p.locator('#mascotButton').count(),1);
  assert.equal(await p.locator('#portfolio-projects .project-card-link:visible').count(),4);
  await p.locator('#project-search').fill('blogs');assert.equal(await p.locator('#portfolio-projects .project-card-link:visible').count(),1);
  await p.locator('#portfolio-projects a[href="/projetos/blogs/"]').click();
  await p.waitForURL('**/projetos/blogs/');
  assert.equal(await p.locator('#archive-character').count(),1);assert.equal(await p.locator('#mascotButton').count(),0);
  const initial=await p.locator('#archive-speech').textContent();await p.locator('#archive-character').click();assert.notEqual(await p.locator('#archive-speech').textContent(),initial);
  await p.locator('#blog-search').fill('unknown-test');assert.equal(await p.locator('[data-blog-entry]:visible').count(),0);
  await p.locator('#blog-search').fill('futebol');assert.equal(await p.locator('[data-blog-entry]:visible').count(),1);
  await p.locator('#blog-search').fill('');
  await p.locator('#languageTrigger').click();await p.locator('[data-language="en"]').click();assert.equal(await p.locator('html').getAttribute('lang'),'en');
  assert.equal(await p.locator('h1').textContent(),'Blog Network');await p.locator('#archive-character').click();assert.match(await p.locator('#archive-speech').textContent(),/Futebolando is in preview/);
  await p.locator('#languageTrigger').click();await p.locator('[data-language="pt"]').click();
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'catalog overflow');
  await p.screenshot({path:'review-shots/catalog-'+name+'.png',fullPage:true,animations:'disabled'});
  await p.locator('a[href="/futebolando/"]').click();await p.waitForURL('**/futebolando/');assert.equal(await p.locator('[data-article-id]:visible').count(),8);
  assert.equal(await p.locator('#archive-character,#mascotButton').count(),0);
  await p.locator('#blog-theme').selectOption('dark');assert.equal(await p.locator('html').getAttribute('data-blog-theme'),'dark');
  await p.locator('[data-article-id="expected-goals"] a').click();assert.equal(await p.locator('[data-stat-example]').count(),1);
  await p.locator('.blog-languages a[hreflang="en"]').click();assert.equal(await p.locator('html').getAttribute('lang'),'en');
  assert.equal(await p.locator('#archive-character,#mascotButton').count(),0);
  await p.screenshot({path:'review-shots/blog-'+name+'.png',fullPage:true,animations:'disabled'});
  assert.deepEqual(errors,[]);await p.close();console.log('PASS portal and blog '+name);
 }
}finally{await browser?.close();server.kill();}
