import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {transform} from 'esbuild';
const product=process.env.VYLO_PRODUCT_SOURCE||'/Users/farazsworkmac/Desktop/Expense Tracker/implementation/approved-design-20260911/web/expense-tracker-frontend';
const {JSDOM}=createRequire(path.join(product,'package.json'))('jsdom');
const dom=new JSDOM(fs.readFileSync('dist/design-direction/index.html','utf8'),{runScripts:'outside-only'});
const {window}=dom;
for(const section of ['opening-title','product-preview','the-story','inside-vylo','before-and-after','security','pricing','faq','closing-title']){
  assert(window.document.getElementById(section),`Full homepage preview is missing ${section}`);
}
assert.equal(window.document.querySelector('meta[name="robots"]').content,'noindex, nofollow');
const production=new JSDOM(fs.readFileSync('dist/index.html','utf8'));
assert.equal(production.window.document.querySelector('main').outerHTML,window.document.querySelector('main').outerHTML,'Production must render the approved homepage composition');
assert.equal(production.window.document.querySelector('link[rel="canonical"]').href,'https://www.myvylo.com/');
assert(!production.window.document.querySelector('meta[name="robots"]')?.content.includes('noindex'),'The public homepage must remain indexable');
assert(production.window.document.querySelector('a[href="https://apps.apple.com/ca/app/vylo-budget-expense-tracker/id6760635052"]'),'The production footer must link to the live App Store listing');
production.window.close();
assert.equal(window.document.querySelectorAll('[data-feature-card]').length,4);
const ids=[...window.document.querySelectorAll('[id]')].map(el=>el.id);
assert.equal(new Set(ids).size,ids.length,'Full homepage preview must not contain duplicate IDs');
window.matchMedia=()=>({matches:false});
let tracks=[];
window.Element.prototype.animate=function(frames,options){
  frames.forEach((frame,i)=>{
    assert(frame.offset>=0&&frame.offset<=1,`${this.className}: offset outside duration`);
    assert(!i||frame.offset>=frames[i-1].offset,`${this.className}: animation goes backwards in time`);
  });
  tracks.push({element:this,frames,options});
  return {pause(){},playbackRate:1};
};
const source=fs.readFileSync('src/scripts/product-moment-demos.ts','utf8').split("document.querySelectorAll<HTMLElement>('[data-moment-demo]')")[0];
window.eval((await transform(source+'\nwindow.testCompose=compose',{loader:'ts'})).code);
for(const root of window.document.querySelectorAll('[data-moment-demo]')){
  tracks=[];
  window.testCompose({root,animations:[]});
  assert(tracks.length>2,`${root.dataset.momentDemo}: missing animation`);
  for(const image of root.querySelectorAll('img')){
    const src=image.getAttribute('src');
    if(src.startsWith('/'))assert(fs.existsSync('public'+src),`Missing demo capture: ${src}`);
  }
  if(root.dataset.momentDemo==='categories'){
    const states=[0,1,2,3].map(i=>tracks.find(t=>t.element.matches('.category-created-'+i)));
    states.forEach((state,i)=>assert(state,`Missing saved category state ${i}`));
    assert.equal(states[3].frames.at(-1).opacity,1);
    for(const track of tracks.filter(t=>t.element.matches('.native-sheet')))assert.equal(track.frames.at(-1).transform,'translateY(105%)');
  }
}
console.log('Feature demos: every capture exists, all timelines valid, all four category save states present.');

// Exercise the actual initialization in reduced-motion mode: every demo must
// present its completed state, including after selecting another mobile chip.
for(const mobile of [false,true]){
  const page=new JSDOM(fs.readFileSync('dist/design-direction/index.html','utf8'),{runScripts:'outside-only'});
  const w=page.window;
  w.matchMedia=query=>({matches:query.includes('reduced-motion')||query.includes('max-width')&&mobile,addEventListener(){}});
  w.IntersectionObserver=class{observe(){} disconnect(){}};
  const grid=w.document.querySelector('.moments-grid');
  let gridBounds={top:16,bottom:3000};
  grid.getBoundingClientRect=()=>gridBounds;
  w.HTMLElement.prototype.scrollTo=function(options){this.scrollLeft=options.left||0;};
  w.HTMLImageElement.prototype.decode=async()=>{};
  w.Element.prototype.animate=function(frames){const el=this;return {pause(){},cancel(){},finish(){for(const [key,value] of Object.entries(frames.at(-1)))if(!['offset','easing'].includes(key))el.style[key]=String(value);},playbackRate:1};};
  w.eval((await transform(fs.readFileSync('src/scripts/product-moment-demos.ts','utf8'),{loader:'ts'})).code);
  assert.equal(w.document.documentElement.hasAttribute('data-question-paging'),mobile,'Question paging is only enabled on mobile inside the question section');
  for(const bounds of [{top:w.innerHeight,bottom:4000},{top:-4000,bottom:0}]){
    gridBounds=bounds;
    w.dispatchEvent(new w.Event('resize'));
    assert(!w.document.documentElement.hasAttribute('data-question-paging'),'The page must scroll freely before and after the questions');
  }
  assert([...w.document.querySelectorAll('[data-moment-demo]')].every(e=>e.dataset.state==='complete'));
  const category=w.document.querySelector('[data-moment-demo="categories"]');
  assert.equal(category.querySelector('.category-created-3').style.opacity,'1');
  assert.equal(category.querySelector('.group-create-sheet').style.transform,'translateY(105%)');
  w.document.querySelector('#feature-categories').click();
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(w.document.querySelector('#feature-categories').getAttribute('aria-selected'),'true');
  assert.equal(category.dataset.state,'complete');
  for(const panel of w.document.querySelector('[data-feature-card]').querySelectorAll('[data-feature-panel]')){
    assert.equal(panel.inert,panel.dataset.featurePanel!=='categories','Only the selected feature can receive focus or play');
  }
  if(mobile)assert([...w.document.querySelectorAll('[data-feature-panel]')].every(p=>!p.hidden));
  else assert.equal([...w.document.querySelectorAll('[data-feature-card]')][0].querySelectorAll('[data-feature-panel]:not([hidden])').length,1);
  page.window.close();
}
console.log('Reduced motion, desktop/mobile chip selection, inactive-panel focus isolation, and question paging boundaries passed.');
