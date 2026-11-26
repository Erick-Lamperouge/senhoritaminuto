import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,mkdirSync,copyFileSync,lstatSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
const root=process.cwd(), core=path.join(root,'.blog-core-source'), editorial=path.join(root,'.blog-editorial-source');
const lock=JSON.parse(readFileSync('blog-engine.lock.json','utf8'));
const git=(cwd,args)=>execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
const npm=(cwd,args)=>execFileSync(process.platform==='win32'?'npm.cmd':'npm',args,{cwd,stdio:'inherit'});
const blob=bytes=>createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
assert.equal(lock.stage,'public-technical-preview');
assert.deepEqual(lock.policy,{editorialPublished:false,indexing:false,monetization:false});
assert.equal(git(core,['rev-parse','HEAD']),lock.core.commit);
assert.equal(git(editorial,['rev-parse','HEAD']),lock.editorial.commit);
const sourceLock=JSON.parse(readFileSync(path.join(core,'v2/content/futebolando.lock.json'),'utf8'));
assert.equal(sourceLock.repository,lock.editorial.repository);assert.equal(sourceLock.commit,lock.editorial.commit);
assert.equal(sourceLock.files.length,11);
const seen=new Set();
for(const f of sourceLock.files){
  assert.ok(f.source.startsWith('editorial/')&&f.target.startsWith('v2/')&&!f.source.includes('..')&&!f.target.includes('..')&&!seen.has(f.target));seen.add(f.target);
  const a=readFileSync(path.join(editorial,f.source)), b=readFileSync(path.join(core,f.target));
  assert.equal(blob(a),f.blob,f.source);assert.deepEqual(a,b,f.target);assert.equal(git(core,['rev-parse',lock.core.commit+':'+f.target]),f.blob);
}
npm(root,['run','build']);
const v2=path.join(core,'v2');
npm(v2,['install','--no-audit','--no-fund']);
npm(v2,['test']);
npm(v2,['run','build']);
const source=path.join(v2,'dist'), target=path.join(root,'dist');
function copyTree(from,to){
  assert.ok(!lstatSync(from).isSymbolicLink(),from);
  if(lstatSync(from).isDirectory()){
    mkdirSync(to,{recursive:true});for(const name of readdirSync(from))copyTree(path.join(from,name),path.join(to,name));return;
  }
  if(existsSync(to)){assert.deepEqual(readFileSync(from),readFileSync(to),'Collision: '+to);return;}
  mkdirSync(path.dirname(to),{recursive:true});copyFileSync(from,to);
}
for(const name of ['futebolando','_astro','blog-font-licenses'])copyTree(path.join(source,name),path.join(target,name));
assert.ok(!existsSync(path.join(target,'culinaria-demo')));
console.log('PASS pinned core, editorial files and collision-safe static assembly');
