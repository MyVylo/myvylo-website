import {validMarket, screenshotUrl, marketCopy} from '../edge/screenshot-market.js';
const root=document.documentElement;
const countrySwitch=document.querySelector<HTMLAnchorElement>('[data-screenshot-market-switch]');
const description=document.querySelector<HTMLElement>('[data-screenshot-market-description]');
let changedByVisitor=false;
const apply=(market:string)=>{
  root.dataset.screenshotMarket=market;
  document.querySelectorAll<HTMLImageElement>('img[data-market-image]').forEach(image=>{
    const url=screenshotUrl(image.dataset.marketImage!,market);
    if(image.getAttribute('src')!==url)image.src=url;
  });
  document.querySelectorAll<HTMLElement>('[data-screen-frame]').forEach(frame=>{
    frame.dataset.image=screenshotUrl(frame.dataset.image!.split('/').pop()!,market);
  });
  document.querySelectorAll<HTMLAnchorElement>('a[data-market-image-link]').forEach(link=>{
    link.href=screenshotUrl(link.getAttribute('href')!.split('/').pop()!,market);
  });
  const copy=marketCopy(market);
  if(description)description.textContent=copy.viewing;
  if(countrySwitch){
    countrySwitch.textContent=copy.switchLabel;
    const url=new URL(location.href);
    url.searchParams.set('market',copy.next);
    countrySwitch.href=url.pathname+url.search+url.hash;
  }
};
const requested=validMarket(new URL(location.href).searchParams.get('market'));
const saved=validMarket(document.cookie.match(/(?:^|;\s*)vylo_examples=(CA|US)(?:;|$)/i)?.[1]);
apply(requested||saved||validMarket(root.dataset.screenshotMarket)||'US');
// Static/local previews have no edge country data; explicit review links still work.
if(!root.dataset.marketResolved&&!requested&&!saved&&!['localhost','127.0.0.1'].includes(location.hostname)){
  fetch('/api/screenshot-market',{credentials:'same-origin',signal:AbortSignal.timeout(2000)})
    .then(response=>response.ok?response.json():null)
    .then(data=>{const market=validMarket(data?.market);if(market&&!changedByVisitor)apply(market);})
    .catch(()=>{});
}
countrySwitch?.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
  event.preventDefault();
  const market=marketCopy(root.dataset.screenshotMarket).next;
  changedByVisitor=true;
  document.cookie=`vylo_examples=${market}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;
  const url=new URL(location.href);
  url.searchParams.delete('market');
  history.replaceState(history.state,'',url);
  apply(market);
});
