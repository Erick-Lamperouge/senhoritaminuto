/** Targeted secret-pattern checks; never emit a matching value. Not a full security audit. */
import {readFileSync,readdirSync,lstatSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const forbiddenPath=/(?:^|\/)(?:\.git|\.env(?:\.[^/]*)?|\.venv|__pycache__|node_modules|(?:id_rsa|id_ed25519)(?:\.pub)?|[^/]+\.(?:pem|p12|pfx|key|sqlite|db|bak|map))$/i;
const checks=[
 ['private-key',/-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/],
 ['github-token',/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
 ['cloud-api-key',/\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{30,}|sk_live_[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{35}|AKIA[A-Z0-9]{16})\b/]
];
const textFile=/\.(?:mjs|cjs|js|ts|astro|css|html|json|ya?ml|md|txt|svg|xml)$/i;
const findings=[];let scanned=0;
function inspect(full,label,{publicBuild=false}={}){
  if(!existsSync(full))return;
  if(lstatSync(full).isSymbolicLink()){findings.push({path:label,kind:'symlink'});return;}
  if(forbiddenPath.test(label)&&!label.endsWith('.env.example')){findings.push({path:label,kind:'unexpected-sensitive-file'});return;}
  if(!textFile.test(full)&&path.basename(full)!=='CNAME')return;
  if(path.basename(full)==='package-lock.json')return;
  const content=readFileSync(full,'utf8');scanned++;
  for(const [kind,pattern] of checks)if(pattern.test(content))findings.push({path:label,kind});
  if(publicBuild&&/\$\{\{\s*secrets\./.test(content))findings.push({path:label,kind:'secret-template-in-public-build'});
}
function tracked(root,scope=''){
  const paths=execFileSync('git',['ls-files','-z','--',scope||'.'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
  for(const file of paths)inspect(path.join(root,file),root+'/'+file);
}
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else inspect(full,full,{publicBuild:true});}}
if(!existsSync('dist/index.html'))throw Error('Build required before public surface check');
tracked('.');tracked('.blog-core-source','v2');tracked('.blog-editorial-source','editorial');walk('dist');
if(findings.length){console.error(JSON.stringify({status:'REVIEW_REQUIRED',findings},null,2));process.exitCode=1;}
else console.log('PASS public surface: '+scanned+' text files inspected; no targeted secret patterns or forbidden file types found');
