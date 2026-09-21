import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {transform} from 'esbuild';
const product=process.env.VYLO_PRODUCT_SOURCE||'/Users/farazsworkmac/Desktop/Expense Tracker/implementation/approved-design-20260911/web/expense-tracker-frontend';
const {JSDOM}=createRequire(path.join(product,'package.json'))('jsdom');
const guide=JSON.parse(fs.readFileSync('src/data/help-guides.json','utf8'))['projected-spending'];
assert.deepEqual(Object.keys(guide),['ios'],'The new native design must not imply web availability.');
assert.equal(guide.ios.steps.length,4);
const page=fs.readFileSync('dist/help/articles/projected-spending/index.html','utf8');
const {code}=await transform(fs.readFileSync('src/scripts/screenshot-market.ts','utf8').replace(/^import.*\n/, '')+'\nwindow.applyTestMarket=apply;', {loader:'ts'});
for(const market of ['CA','US']) {
 const dom=new JSDOM(page,{url:`http://127.0.0.1:4321/help/articles/projected-spending/?market=${market}`,runScripts:'outside-only'});
 const w=dom.window;
 w.validMarket=value=>['CA','US'].includes(value?.toUpperCase())?value.toUpperCase():null;
 w.screenshotUrl=(name,region)=>`/product/current-20260914/${region.toLowerCase()}/${name}`;
 w.marketCopy=()=>({});
 w.eval(code);
 for(const region of [market,market==='CA'?'US':'CA']) {
  w.applyTestMarket(region);
  for(const img of w.document.querySelectorAll('img[data-native-market-ca]')) {
   const url=new URL(img.src).pathname;
   assert(url.includes(`/${region.toLowerCase()}/`));
   assert.equal(img.closest('a').href,img.src,'Enlarge must open the same regional image.');
   const bytes=fs.readFileSync('public'+url);
   assert.equal(bytes.readUInt32BE(16),Number(img.width));
   assert.equal(bytes.readUInt32BE(20),Number(img.height));
  }
 }
 dom.window.close();
}
const home=new JSDOM(fs.readFileSync('dist/index.html','utf8'));
assert.equal(home.window.document.querySelector('#feature-projected-spend').getAttribute('aria-selected'),'true');
assert(home.window.document.querySelector('#feature-panel-projected-spend [aria-label*="$72 to $82"]'));
home.window.close();
console.log('PASS: native-only walkthrough, screenshot dimensions, CA/US image and enlarge-link switching, homepage feature.');
