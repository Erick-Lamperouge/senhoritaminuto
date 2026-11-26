import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const lock=JSON.parse(readFileSync('blog-engine.lock.json','utf8'));
const check=(name,fn)=>{fn();console.log('PASS '+name)};
const read=p=>readFileSync(p);
const text=p=>readFileSync(p,'utf8');
const git=(args,cwd=process.cwd())=>execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
const blob=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const sourceCheckout=process.env.BLOG_CORE_CHECKOUT;
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const checks=[
['Pinned upstream snapshot',()=>{
  assert.match(lock.commit,/^[a-f0-9]{40}$/);
  assert.equal(lock.stage,'integration-preview-only');
  assert.equal(lock.files.length,7);
  const targets=new Set();
  if(sourceCheckout)assert.equal(git(['rev-parse','HEAD'],sourceCheckout),lock.commit);
  for(const file of lock.files){
    assert.ok(file.source.startsWith('v2/')&&file.target.startsWith('src/blog-engine/'));
    assert.ok(!file.source.includes('..')&&!file.target.includes('..')&&!targets.has(file.target));
    targets.add(file.target);
    const bytes=read(file.target);
    assert.equal(blob(bytes),file.blob,file.target);
    if(sourceCheckout){
      assert.equal(git(['rev-parse',lock.commit+':'+file.source],sourceCheckout),file.blob);
      assert.deepEqual(bytes,read(path.join(sourceCheckout,file.source)));
    }
  }
}],
['Portal sources and deploy workflow unchanged',()=>{
  const changed=git(['diff','--name-only',lock.portalBaseline,'HEAD']).split('\n').filter(Boolean);
  const allowed=p=>p.startsWith('src/blog-engine/')||p.startsWith('src/pages/futebolando/')||p==='blog-engine.lock.json'||p==='scripts/check-blog-integration.mjs'||p==='.github/workflows/blog-integration-ci.yml'||p==='docs/BLOG-INTEGRATION.md';
  assert.ok(changed.every(allowed),'Unexpected changed paths: '+changed.filter(p=>!allowed(p)).join(', '));
}],
['Original portal pages built',()=>{
  for(const p of ['dist/index.html','dist/projetos/scratch/index.html','dist/projetos/fernando/index.html','dist/projetos/jack-up/index.html']){
    const html=text(p);
    assert.ok(html.length>500);
    assert.ok(!html.includes('class="blog"')&&!html.includes('pauta-search'),p);
  }
}],
['Public assets and domain unchanged',()=>{
  for(const source of walk('public')){
    const dest=path.join('dist',path.relative('public',source));
    assert.deepEqual(read(source),read(dest),dest);
  }
  assert.equal(text('dist/CNAME').trim(),'senhoritaminuto.com.br');
}],
['Portuguese blog route',()=>{
  const html=text('dist/futebolando/index.html');
  for(const token of ['lang="pt-BR"','noindex,nofollow','Futebolando','pauta-search','href="/futebolando/en/"','class="blog"'])assert.ok(html.includes(token),token);
}],
['English blog route',()=>{
  const html=text('dist/futebolando/en/index.html');
  for(const token of ['lang="en"','noindex,nofollow','Football beyond the 90 minutes','href="/futebolando/"','pauta-search','class="blog"'])assert.ok(html.includes(token),token);
}],
['Blog isolation and no monetization',()=>{
  for(const p of ['dist/futebolando/index.html','dist/futebolando/en/index.html']){
    const html=text(p);
    for(const token of ['data-page-title-key','hero-console','/assets/characters/','pagead2.googlesyndication.com','googletagmanager.com','adsbygoogle'])assert.ok(!html.includes(token),p+': '+token);
  }
  assert.ok(!existsSync('dist/culinaria-demo'));
}],
['Compiled asset references resolve',()=>{
  for(const file of walk('dist').filter(f=>f.endsWith('.html'))){
    const html=text(file);
    for(const match of html.matchAll(/(?:src|href)="(\/_astro\/[^"?#]+)(?:[?#][^"]*)?"/g)){
      assert.ok(existsSync(path.join('dist',match[1].slice(1))),file+': '+match[1]);
    }
  }
}]
];
for(const [name,fn] of checks)check(name,fn);
console.log(checks.length+' integration checks passed');
