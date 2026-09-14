import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { parse } from 'parse5';
import matter from 'gray-matter';
import { execFileSync } from 'node:child_process';
const imageMetadata=new Map();
function screenshotMetadata(file){
 if(!imageMetadata.has(file)){
  const raw=execFileSync('sips',['-g','pixelWidth','-g','pixelHeight',file],{encoding:'utf8'});
  const b=fs.readFileSync(file);
  imageMetadata.set(file,{format:b[0]===255&&b[1]===216?'jpeg':'png',width:Number(raw.match(/pixelWidth: (\d+)/)[1]),height:Number(raw.match(/pixelHeight: (\d+)/)[1])});
 }return imageMetadata.get(file);
}

const dist = path.resolve('dist');
const articles = fs.readdirSync('src/content/help').filter(n => n.endsWith('.md')).map(n => ({slug:n.slice(0,-3),...matter(fs.readFileSync(`src/content/help/${n}`,'utf8')).data}));
const slugs = new Set(articles.map(a=>a.slug));
const topics = new Set(articles.map(a=>a.category));
assert.equal(articles.length,72);
assert.equal(topics.size,10);
for(const a of articles){
  for(const related of a.related) assert(slugs.has(related),`${a.slug}: missing related article ${related}`);
  if(a.screenshot){assert(a.screenshotAlt,`${a.slug}: missing screenshot description`);assert(fs.existsSync(`public/help/${a.screenshot}`));}
}
function walk(n){return [n,...(n.childNodes||[]).flatMap(walk)];}
const attr = (n,k) => n.attrs?.find(a=>a.name===k)?.value;
const contents = n => n.nodeName==='#text'?n.value:(n.childNodes||[]).map(contents).join('');
const pages = ['/','/updates/','/help/',...articles.map(a=>`/help/articles/${a.slug}/`)];
const parsed = new Map(pages.map(url=>[url,parse(fs.readFileSync(path.join(dist,url,'index.html'),'utf8'))]));
let links=0, figures=0;
for(const [url,tree] of parsed){
 const nodes=walk(tree), ids=nodes.map(n=>attr(n,'id')).filter(Boolean);
 assert.equal(ids.length,new Set(ids).size,`${url}: duplicate element ids`);
 assert(nodes.some(n=>n.tagName==='a'&&attr(n,'href')==='/help/'),`${url}: Help missing from navigation`);
 if(url.startsWith('/help/')){
  assert.equal(nodes.filter(n=>n.tagName==='h1').length,1,`${url}: expected one h1`);
  assert(nodes.some(n=>n.tagName==='a'&&attr(n,'href')?.startsWith('mailto:hi@myvylo.com')),`${url}: email missing`);
  assert(nodes.some(n=>n.tagName==='input'&&attr(n,'type')==='search'),`${url}: search missing`);
 }
 for(const n of nodes){
  for(const key of ['href','src']){
   const value=attr(n,key);if(!value||/^(https?:|mailto:|data:)/.test(value))continue;
   const target=new URL(value,`http://localhost${url}`);
   const destination=path.join(dist,decodeURIComponent(target.pathname));
   const localFile=fs.existsSync(destination)&&fs.statSync(destination).isFile()?destination:path.join(destination,'index.html');
   assert(fs.existsSync(localFile),`${url}: broken ${key} ${value}`);
   if(target.hash&&localFile.endsWith('.html')){
    const targetTree=parsed.get(target.pathname)||parse(fs.readFileSync(localFile,'utf8'));
    assert(walk(targetTree).some(x=>attr(x,'id')===decodeURIComponent(target.hash.slice(1))),`${url}: missing anchor ${value}`);
   }
   links++;
  }
  if(n.tagName==='img'&&attr(n,'src')?.startsWith('/help/')){
   const meta=screenshotMetadata(path.join(dist,attr(n,'src')));
   assert(meta.format==='png'||meta.format==='jpeg',`${url}: unexpected screenshot format`);
   assert(meta.width>0&&meta.width<5000&&meta.height>0&&meta.height<5000,`${url}: invalid screenshot dimensions`);
   assert.equal(Number(attr(n,'width')),meta.width,`${url}: image width`);
   assert.equal(Number(attr(n,'height')),meta.height,`${url}: image height`);figures++;
  }
 }
 if(url.startsWith('/help/articles/')){
  const nav=nodes.find(n=>n.tagName==='nav'&&attr(n,'aria-label')==='Help articles');
  assert(nav,`${url}: article sidebar missing`);
  assert.equal(walk(nav).filter(n=>n.tagName==='a'&&attr(n,'aria-current')==='page').length,1);
  const headings=nodes.filter(n=>n.tagName==='h2'&&attr(n,'id'));
  for(const h of headings)assert(walk(nav).some(n=>attr(n,'href')===`#${attr(h,'id')}`),`${url}: section absent from sidebar`);
 }
}

// Run the exact production search bundle against a minimal document fixture.
// This checks event behavior and URL state without opening or controlling a browser.
const home=parsed.get('/help/'), nodes=walk(home);
const script=contents(nodes.find(n=>n.tagName==='script'&&attr(n,'type')==='module'));
class Element {
 constructor(node={}){this.tagName=node.tagName;this.attributes=new Map((node.attrs||[]).map(a=>[a.name,a.value]));this.dataset={};for(const[k,v]of this.attributes)if(k.startsWith('data-'))this.dataset[k.slice(5)]=v;this.hidden=this.attributes.has('hidden');this.open=this.attributes.has('open');this.textContent=contents(node);this.value='';this.children=[];this.handlers={};}
 addEventListener(event,fn){(this.handlers[event]||=[]).push(fn);}
 emit(event){const e={preventDefault(){this.prevented=true}};for(const fn of this.handlers[event]||[])fn(e);return e;}
 setAttribute(k,v){this.attributes.set(k,v);}
 removeAttribute(k){this.attributes.delete(k);}
 replaceChildren(...children){this.children=children;}
 append(...children){this.children.push(...children);}
 focus(){this.focused=true;}
}
function fixture(query='',mobile=false){
 const els=nodes.filter(n=>n.tagName).map(n=>new Element(n));
 const get=id=>els.find(e=>e.attributes.get('id')===id);
 const location=new URL(`http://localhost/help/${query}`);
 const document={querySelector:q=>get(q.slice(1)),querySelectorAll:q=>els.filter(e=>e.attributes.has(q.slice(1,-1))),createElement:tagName=>new Element({tagName})};
 const window={handlers:{},addEventListener(event,fn){this.handlers[event]=fn;}};
 const context=vm.createContext({document,window,location,history:{replaceState(_a,_b,url){location.href=new URL(url,location).href;}},URLSearchParams,setTimeout,clearTimeout,matchMedia:()=>({matches:mobile})});
 vm.runInContext(script,context);
 const submit=q=>{get('help-query').value=q;assert(get('help-search-form').emit('submit').prevented);};
 const results=()=>get('result-list').children.map(li=>li.children[0].href);
 return {get,els,location,window,submit,results};
}
let f=fixture();assert(f.get('search-results').hidden);assert(!f.get('topic-sections').hidden);
const searches=[
 ['default categories','default-categories'],
 ['Income','income-basics'],
 ['side hustle','side-gig-income-and-expenses'],
 ['reimbursement','excluded-categories'],
 ['How do I rename a category?','rename-a-category'],
 ['cancel my subscription','cancel-subscription'],
 ['cancelling','cancel-subscription'],
 ['how often do transactions sync','how-often-transactions-sync'],
 ['remember merchant','remember-merchant'],
 ['add a new category','add-a-category'],
 ['monthly reports','monthly-reports'],
 ['Plaid','connect-a-bank'],
 ['delete account','delete-account'],
 ['90 days','first-import'],
 ['App Store refund','apple-subscription'],
 ['how do I download my data','download-your-data'],
];
for(const[q,expected]of searches){f.submit(q);assert(f.results().slice(0,5).includes(`/help/articles/${expected}/`),`${q}: expected ${expected}; got ${f.results().slice(0,5)}`);assert(f.get('results-heading').focused);assert.equal(f.location.searchParams.get('q'),q);}
f.submit('zxqv nothing matches');assert.equal(f.results().length,0);assert(!f.get('no-results').hidden);
f.get('reset-search').emit('click');assert(f.get('search-results').hidden);assert.equal(f.location.search,'');
f.els.find(e=>e.dataset.topic==='categories').emit('click');assert.equal(f.location.searchParams.get('topic'),'categories');assert.equal(f.els.filter(e=>e.dataset.section&&!e.hidden).length,1);
f.submit('Income');assert(f.results().includes('/help/articles/income-basics/'));assert.equal(f.location.searchParams.get('topic'),null);
f.get('clear-search').emit('click');assert.equal(f.get('help-query').value,'');assert.equal(f.location.searchParams.get('topic'),null);
f.location.href='http://localhost/help/?q=cancel&topic=billing';f.window.handlers.popstate();assert.equal(f.get('help-query').value,'cancel');assert(f.results().includes('/help/articles/cancel-subscription/'));
f=fixture('?q=rename&topic=categories',true);assert(!f.get('topic-browser').open);assert(f.results().includes('/help/articles/rename-a-category/'));
f=fixture('?q=Income&topic=household');assert(f.results().includes('/help/articles/income-basics/'));assert.equal(f.location.searchParams.get('topic'),null);
f.els.find(e=>e.dataset.topic==='categories').emit('click');assert.equal(f.get('help-query').value,'');assert(f.get('search-results').hidden);assert.equal(f.location.searchParams.get('topic'),'categories');
f=fixture('?topic=bogus');assert.equal(f.els.find(e=>e.attributes.has('data-topic')&&e.attributes.has('aria-current'))?.dataset.topic,'');
f.submit('<img src=x onerror=alert(1)>');assert.equal(f.results().length,0);assert(f.get('result-status').textContent.includes('<img'));
f=fixture();f.get('help-query').value='cancel';f.get('help-query').emit('input');await new Promise(r=>setTimeout(r,150));assert(f.results().includes('/help/articles/cancel-subscription/'));
console.log(`PASS: ${pages.length} pages, ${articles.length} articles, ${topics.size} topics, ${links} local links/assets, ${figures} screenshot placements.`);
console.log('PASS: search ranking, submit, live input, deep links, empty state, topic filters, clear/reset, history restore, mobile navigation, and literal query handling.');
