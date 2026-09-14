import assert from 'node:assert/strict';
import {resolveMarket} from '../src/edge/screenshot-market.js';
const request=(country,url='https://www.myvylo.com/',cookie='')=>({url,cf:{country},headers:new Headers({cookie})});
assert.equal(resolveMarket(request('CA')),'CA');
for(const country of ['US','GB','FR','XX',null,undefined])assert.equal(resolveMarket(request(country)),'US');
assert.equal(resolveMarket(request('CA','https://www.myvylo.com/','vylo_examples=US')),'US');
assert.equal(resolveMarket(request('US','https://www.myvylo.com/?market=ca','vylo_examples=US')),'CA');
assert.equal(resolveMarket(request('CA','https://www.myvylo.com/?market=invalid','vylo_examples=invalid')),'CA');
assert.equal(resolveMarket(request('US','https://www.myvylo.com/','bad_vylo_examples=CA')),'US');
assert.equal(resolveMarket({url:'https://www.myvylo.com/',headers:new Headers({'CF-IPCountry':'CA'})}),'US');
console.log('PASS: CA/US detection, other-country fallback, explicit override, saved choice, and invalid values.');

// Exercise the actual Worker entrypoint without a deployment.
const {default:worker}=await import('../src/worker.js');
const calls=[];
globalThis.HTMLRewriter=class{
  on(selector,handler){calls.push([selector,handler]);return this;}
  transform(response){return response;}
};
const env={ASSETS:{fetch:async()=>new Response('<html></html>',{headers:{'Content-Type':'text/html','Cache-Control':'public, max-age=3600','ETag':'example','Content-Length':'13'}})}};
const api=await worker.fetch(request('CA','https://www.myvylo.com/api/screenshot-market'),env);
assert.deepEqual(await api.json(),{market:'CA'});
assert.equal(api.headers.get('cache-control'),'private, no-store');
const html=await worker.fetch(request('CA'),env);
assert.equal(html.headers.get('cache-control'),'private, no-store');
assert.equal(html.headers.get('etag'),null);
assert.equal(html.headers.get('content-length'),null);
const el=(attrs)=>({attrs,getAttribute(k){return this.attrs[k];},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},setInnerContent(value){this.attrs.textContent=value;}});
for(const [selector,attrs,key,value] of [
 ['html',{},'data-screenshot-market','CA'],
 ['img[data-market-image]',{'data-market-image':'transactions.jpg'},'src','/product/current-20260914/ca/transactions.jpg'],
 ['[data-screen-frame]',{'data-image':'/product/current-20260914/us/review.jpg'},'data-image','/product/current-20260914/ca/review.jpg'],
 ['a[data-market-image-link]',{'data-market-image-link':'review.jpg'},'href','/product/current-20260914/ca/review.jpg'],
 ['[data-screenshot-market-description]',{},'textContent','You’re viewing the Canadian site.'],
 ['[data-screenshot-market-switch]',{},'href','?market=US'],
 ['[data-screenshot-market-switch]',{},'textContent','Switch to the U.S. site'],
]){const element=el(attrs);const rule=calls.find(([s])=>s===selector);assert(rule,`${selector}: missing rewrite`);rule[1].element(element);assert.equal(element.attrs[key],value);}
calls.length=0;
await worker.fetch(request('US'),env);
const description=el({});calls.find(([s])=>s==='[data-screenshot-market-description]')[1].element(description);assert.equal(description.attrs.textContent,'You’re viewing the U.S. site.');
const toggle=el({});calls.find(([s])=>s==='[data-screenshot-market-switch]')[1].element(toggle);assert.equal(toggle.attrs.href,'?market=CA');assert.equal(toggle.attrs.textContent,'Switch to the Canadian site');
const count=calls.length;
const help=await worker.fetch(request('CA','https://www.myvylo.com/help/'),env);
assert.equal(help.headers.get('cache-control'),'public, max-age=3600');assert.equal(calls.length,count);
const asset=await worker.fetch(request('CA','https://www.myvylo.com/product/current-20260914/ca/transactions.jpg'),{ASSETS:{fetch:async()=>new Response('image',{headers:{'Content-Type':'image/jpeg','Cache-Control':'public, max-age=3600'}})}});
assert.equal(await asset.text(),'image');assert.equal(calls.length,count);
console.log('PASS: Worker API, homepage image/frame/link rewrites, country selection, cache isolation, and unchanged Help/assets.');
