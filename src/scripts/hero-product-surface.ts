import { createHeroDemo, sampleHeroDemo, arrivals, budgetUpdates, accountUpdates, BUDGET_AT, WORTH_AT, TRENDS_AT, HOME_TRENDS_AT, BUDGET_TRENDS_AT, smooth, STORY_END, LOOP_DURATION, money } from '../data/hero-demo.js';
import { formatMoney } from '@product/utils/formatters/money';
import { createTrendLayout } from './hero-trend-layout';
const root = document.querySelector<HTMLElement>('.real-product-story')!;
const camera = root.querySelector<HTMLElement>('.board-camera')!;
const activity = root.querySelector<HTMLElement>('.board-activity')!;
const homeTrends = root.querySelector<HTMLElement>('.board-home-trends')!;
const budgetTrends = root.querySelector<HTMLElement>('.board-budget-trends')!;
const budget = root.querySelector<HTMLElement>('.board-budget')!;
const worth = root.querySelector<HTMLElement>('.board-worth')!;
const trends = root.querySelector<HTMLElement>('.board-trends')!;
const fitWorthChart = createTrendLayout(trends.querySelector<HTMLElement>('[data-testid="net-worth-main-chart-frame"]')!);
const budgetReceipts = Array.from(root.querySelectorAll<HTMLElement>('[data-budget-receipt]'));
const trendLines = Array.from(root.querySelectorAll<SVGElement>('[data-trend-line]'));
const tap = root.querySelector<HTMLElement>('.story-tap')!;
const demo = createHeroDemo(root.dataset.market);
const rows = Array.from(activity.querySelectorAll<HTMLElement>('[data-story-row]'));
const nativeRows = Array.from(activity.querySelectorAll<HTMLElement>('[data-native-row]'));
const receipts = Array.from(root.querySelectorAll<HTMLElement>('[data-story-receipt]'));
const budgetRows = Array.from(budget.querySelectorAll<HTMLElement>('[data-story-budget]'));
const categories = rows.map(row => row.querySelector<HTMLElement>('[data-story-category]')!);
const categoryMarkup = categories.map(category => category.innerHTML);
const nativeCategories = Array.from(activity.querySelectorAll<HTMLElement>('[data-native-category]'));
const nativeMarkup = nativeCategories.map(category => category.innerHTML);
const uncategorizedMarkup = root.querySelector<HTMLTemplateElement>('[data-story-uncategorized]')!.content.firstElementChild!.innerHTML;
const values = Array.from(root.querySelectorAll<HTMLElement>('[data-story-value]'));
const events = Array.from(root.querySelectorAll<HTMLElement>('[data-account-event]'));
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let time = 0, last = 0, raf = 0, playing = false, lastBeat = -1;
let compact = innerWidth <= 900, sceneWidth = root.clientWidth, scale = 1, cameraWidth = 1100;
let targets: { x:number; y:number }[] = [];
let navs: { x:number; y:number }[] = [];
const setText = (node:Element|null, value:string) => { if (node && node.textContent !== value) node.textContent = value; };
const clamp = (v:number,min=0,max=1) => Math.max(min,Math.min(max,v));
function measure() {
  compact = innerWidth <= 900;
  sceneWidth = root.clientWidth;
  scale = compact ? Math.min(1,(sceneWidth-32)/390) : Math.min(1,(sceneWidth-96)/1100);
  cameraWidth = compact ? 390 : 1100;
  root.style.setProperty('--camera-scale',String(scale));
  root.style.setProperty('--camera-width',`${cameraWidth}px`);
  root.style.setProperty('--camera-height',compact?'730px':'720px');
  root.style.setProperty('--scene-height',`${compact?730*scale+95:(720*scale+60)}px`);
  fitWorthChart();
  // Communicate intrinsic mobile height without coupling it to window width.
  parent.postMessage({type:'vylo-story-size',height:compact?730*scale+95:720*scale+60},location.origin);
  root.classList.add('is-measuring');
  const base = root.getBoundingClientRect(), app = camera.getBoundingClientRect();
  targets = rows.map(row => {
    const merchant = row.querySelector('td:nth-child(2)')!.getBoundingClientRect();
    return compact ? {x:app.left-base.left+130*scale,y:app.top-base.top+433*scale}
      : {x:merchant.left-base.left+60*scale,y:merchant.top-base.top+merchant.height/2};
  });
  navs = ['/budgets','/net-worth'].map(route=>{
    const rect=activity.querySelector(`a[href="${route}"]`)?.getBoundingClientRect();
    return compact ? {x:route==='/budgets'?237:323,y:686} : rect ? {x:(rect.left-app.left+rect.width/2)/scale,y:(rect.top-app.top+rect.height/2)/scale}:{x:35,y:200};
  });
  root.classList.remove('is-measuring');
}
function receiptStart(i:number,t:number) {
  const positions = compact
    ? [[sceneWidth/2-166,-8,-8],[sceneWidth/2+38,0,8],[sceneWidth/2-148,-4,-6],[sceneWidth/2+40,-5,7]]
    : [[3,100,-8],[sceneWidth-153,86,7],[sceneWidth-153,315,5],[7,430,-6]];
  const [x,y,r] = positions[i];
  return {x:x+Math.sin(t/1400+i)*3,y:y*(compact?1:scale)+Math.sin(t/1100+i*2)*4,r:r+Math.sin(t/1800+i)*.8};
}
function page(node:HTMLElement, opacity:number, offset:number) {
  node.style.opacity=String(opacity); node.style.visibility=opacity>.001?'visible':'hidden';
  node.style.transform=`translateY(${offset}px)`;
}
function render(elapsed:number) {
  const reset = elapsed >= 43600, t = reset ? 0 : elapsed;
  root.style.opacity=elapsed>43000&&elapsed<43600?String(1-smooth((elapsed-43000)/600)):reset?String(smooth((elapsed-43600)/900)):'1';
  const state=sampleHeroDemo(demo,t);
  const toBudget=smooth((t-BUDGET_AT)/650), toWorth=smooth((t-WORTH_AT)/650);
  const toHomeTrends=smooth((t-HOME_TRENDS_AT)/650),toBudgetTrends=smooth((t-BUDGET_TRENDS_AT)/650);
  page(activity,1-toHomeTrends,-10*toHomeTrends);
  page(homeTrends,toHomeTrends*(1-toBudget),12*(1-toHomeTrends)-10*toBudget);
  page(budget,toBudget*(1-toBudgetTrends),12*(1-toBudget)-10*toBudgetTrends);
  page(budgetTrends,toBudgetTrends*(1-toWorth),12*(1-toBudgetTrends)-10*toWorth);
  for(const [node,at] of [[homeTrends,HOME_TRENDS_AT],[budgetTrends,BUDGET_TRENDS_AT]] as const) {
    node.querySelectorAll<SVGElement>('[data-trend-slot="income-spending"] svg > path[fill],[data-trend-slot="budget-vs-actual"] svg > path[fill]').forEach(path=>{
      path.style.transformBox='fill-box';path.style.transformOrigin='center bottom';path.style.transform=`scaleY(${smooth((t-at-300)/1100)})`;
    });
  }
  const toTrends=smooth((t-TRENDS_AT)/700);
  page(worth,toWorth*(1-toTrends),12*(1-toWorth)-10*toTrends);
  page(trends,toTrends,12*(1-toTrends));
  trendLines.forEach(line=>{line.style.strokeDasharray='1';line.style.strokeDashoffset=String(1-smooth((t-TRENDS_AT-400)/1600));});
  trends.querySelectorAll<SVGElement>('[data-testid="trend-gap-area"],[data-testid="trend-gap-markers"]').forEach(el=>el.style.opacity=String(smooth((t-TRENDS_AT-1000)/1000)));
  // Actual page content scrolls to its category table after the route settles.
  const budgetMain=budget.querySelector<HTMLElement>('main');
  const table=budget.querySelector<HTMLElement>('.budget-category-table');
  if(budgetMain&&table){
    const tableTop=(table.getBoundingClientRect().top-budgetMain.getBoundingClientRect().top)/scale+budgetMain.scrollTop;
    budgetMain.scrollTop=Math.max(0,tableTop-(compact?150:190))*smooth((t-BUDGET_AT-700)/900);
  }
  values.forEach(node=>{
    const key=node.dataset.storyValue!,raw=state[key];
    setText(node,node.dataset.storyFormat==='full'?money(raw):formatMoney((key==='liabilities'?-raw:raw)/100,{context:'kpi'}));
    node.setAttribute('aria-label',money(raw));
  });
  root.querySelectorAll('[data-story-count]').forEach(node=>setText(node,String(arrivals.filter(at=>t>=at+950).length)));
  const count=arrivals.filter(at=>t>=at+950).length;
  setText(root.querySelector('[data-native-count-word]'),count===1?'transaction':'transactions');
  rows.forEach((row,i)=>{
    const age=t-arrivals[i],reveal=smooth((age-850)/320),categorized=age>=1400;
    row.style.opacity=String(reveal);row.style.setProperty('--row-open',String(reveal));
    const glow=Math.max(0,1-Math.abs(age-1650)/650);
    row.style.backgroundColor=`rgba(184,169,255,${glow*.09})`;
    categories[i].style.filter=`brightness(${1+glow*.4})`;
    nativeRows[i].style.setProperty('--row-open',String(reveal));
    nativeRows[i].style.opacity=String(reveal);
    nativeCategories[i].style.boxShadow=`0 0 0 3px rgba(184,169,255,${glow*.12})`;
    if(categories[i].dataset.categorized!==String(categorized)){
      categories[i].dataset.categorized=String(categorized);
      categories[i].innerHTML=categorized?categoryMarkup[i]:uncategorizedMarkup;
      nativeCategories[i].innerHTML=categorized?nativeMarkup[i]:'Uncategorized <i>⌄</i>';
    }
    const receipt=receipts[i];
    if(age>1100||age<(compact?-1100:-2000)){receipt.style.opacity='0';return;}
    const p=smooth(age/1050),start=receiptStart(i,age<0?t:arrivals[i]);
    const width=compact?126:150,height=compact?173:202;
    const x0=start.x+width/2,y0=start.y+height/2,end=targets[i]||{x:x0,y:y0};
    const cx=x0+(end.x-x0)*.25+(i%2?40:-40),cy=Math.min(y0,end.y)-35;
    const x=(1-p)**2*x0+2*(1-p)*p*cx+p*p*end.x,y=(1-p)**2*y0+2*(1-p)*p*cy+p*p*end.y;
    const s=(compact?.7:1)*(1-.64*p);
    receipt.style.transform=`translate(${x-width/2}px,${y-height/2}px) rotate(${start.r*(1-p)}deg) scale(${s},${s*(1-.35*p)})`;
    receipt.style.opacity=String(smooth((age+(compact?1100:2000))/350)*(1-smooth((age-820)/280)));
  });
  budgetRows.forEach(row=>{
    const i=Number(row.dataset.storyBudget),cells=row.querySelectorAll('td'),amount=state.budgets[i],percent=amount/demo.budgets[i].limit;
    const progress=cells[1].querySelector<HTMLElement>('[class*="budget-progress--"]');
    if(progress)progress.style.width=`${percent*100}%`;
    setText(cells[1].querySelector('.tabular-nums'),`${Math.round(percent*100)}%`);
    setText(cells[2].querySelector('p'),money(amount));
    setText(cells[4].querySelector('p')||cells[4],`+${money(demo.budgets[i].limit-amount)}`);
    const highlight=smooth((t-budgetUpdates[i]+150)/250)*(1-smooth((t-budgetUpdates[i]-1350)/550));
    row.style.backgroundColor=`rgba(184,169,255,${highlight*.1})`;
  });
  const summary=budget.querySelector('[data-story-budget-summary]');
  setText(summary,`${formatMoney(state.budgetSpent/100,{context:'kpi'})} spent of $900 budgeted`);
  budget.querySelectorAll('[data-story-group-spent]').forEach(node=>setText(node,money(state.budgetSpent)));
  budget.querySelectorAll('[data-story-group-summary]').forEach(node=>setText(node,`4 categories · $900 budgeted · ${money(state.budgetSpent)} spent`));
  budget.querySelectorAll('[data-story-group-remaining]').forEach(node=>setText(node,money(state.budgetRemaining)));
  events.forEach((event,i)=>{
    const age=t-accountUpdates[i],show=smooth((age+650)/450)*(1-smooth((age-1900)/450));
    event.style.opacity=String(show);event.style.visibility=show>0?'visible':'hidden';
    event.style.transform=`translateY(${(1-show)*12}px) scale(${.98+.02*show})`;
    const target=worth.querySelector<HTMLElement>(`[data-account-target="${['cash','investments','liabilities'][i]}"]`);
    if(target)target.style.boxShadow=`0 0 0 2px rgba(184,169,255,${show*.6}),0 0 24px rgba(184,169,255,${show*.08})`;
  });
  budgetReceipts.forEach((receipt,i)=>{
    const age=t-(budgetUpdates[i]-950);
    if(age < -750 || age > 1100){receipt.style.opacity='0';return;}
    const start=receiptStart(i,age<0?t:budgetUpdates[i]-950),p=smooth(age/1050);
    const width=compact?126:150,height=compact?173:202;
    const row=budgetRows.find(row=>Number(row.dataset.storyBudget)===i)!;
    const progress=row.querySelector('td:nth-child(2)')!.getBoundingClientRect();
    // The product hides its progress column below lg. Land on the visible
    // category instead of the hidden cell's empty rectangle at that width.
    const rect=progress.width&&progress.height?progress:row.querySelector('td:first-child')!.getBoundingClientRect();
    const base=root.getBoundingClientRect();
    const end={x:rect.left-base.left+rect.width*.45,y:rect.top-base.top+rect.height/2};
    const x0=start.x+width/2,y0=start.y+height/2,cx=x0+(end.x-x0)*.3,cy=Math.min(y0,end.y)-35;
    const x=(1-p)**2*x0+2*(1-p)*p*cx+p*p*end.x,y=(1-p)**2*y0+2*(1-p)*p*cy+p*p*end.y;
    const size=(compact?.7:1)*(1-.66*p);
    receipt.style.transform=`translate(${x-width/2}px,${y-height/2}px) rotate(${start.r*(1-p)}deg) scale(${size})`;
    receipt.style.opacity=String(smooth((age+750)/350)*(1-smooth((age-800)/300)));
  });
  let cue=0,nav={x:35,y:200};
  [BUDGET_AT,WORTH_AT].forEach((at,i)=>{const value=smooth((t-at+350)/150)*(1-smooth((t-at+50)/400));if(value>cue){cue=value;nav=navs[i]||nav;}});
  tap.style.opacity=String(cue);tap.style.left=`${nav.x-15}px`;tap.style.top=`${nav.y-15}px`;tap.style.transform=`scale(${.8+cue*.35})`;
  const beat=t<BUDGET_AT?0:t<WORTH_AT?1:2;
  if(beat!==lastBeat){lastBeat=beat;parent.postMessage({type:'vylo-story-state',beat,phase:['arriving','budgeting','balances','history'][beat]},location.origin);}
  root.dataset.time=String(Math.round(t));root.dataset.view=t>=TRENDS_AT?'trends':t>=WORTH_AT?'net-worth':t>=BUDGET_TRENDS_AT?'budget-trends':t>=BUDGET_AT?'budgets':t>=HOME_TRENDS_AT?'home-trends':'transactions';
}
function playbackSpeed(t:number) {
  // Quicker receipts and account updates; trends retain their reading time.
  if(t<HOME_TRENDS_AT)return 1.6;
  if((t>=BUDGET_AT&&t<BUDGET_TRENDS_AT)||(t>=WORTH_AT&&t<TRENDS_AT))return 1.4;
  return 1;
}
function tick(now:number){if(!playing)return;if(last)time=(time+Math.min(now-last,80)*playbackSpeed(time))%LOOP_DURATION;last=now;render(time);raf=requestAnimationFrame(tick);}
function stop(){playing=false;cancelAnimationFrame(raf);raf=0;last=0;}
window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==parent)return;
  if(event.data?.type==='vylo-story-seek'&&[0,1,2].includes(event.data.beat)){time=[0,BUDGET_AT+650,WORTH_AT+650][event.data.beat];last=0;render(reduced.matches?STORY_END:time);}
  if(event.data?.type==='vylo-story-replay'){time=0;render(reduced.matches?STORY_END:0);}
  if(event.data?.type==='vylo-story-playback'){stop();if(event.data.reduced||reduced.matches){time=STORY_END;render(time);return;}if(event.data.playing){playing=true;raf=requestAnimationFrame(tick);}}
});
new ResizeObserver(()=>{measure();render(reduced.matches?STORY_END:time);}).observe(root);
document.fonts.ready.then(()=>{measure();render(reduced.matches?STORY_END:time);});
root.dataset.enhanced='true';measure();render(reduced.matches?STORY_END:time);
