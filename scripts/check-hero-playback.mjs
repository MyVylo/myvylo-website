import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { transform } from 'esbuild';
import { createHeroDemo, sampleHeroDemo, money, STORY_END, BUDGET_AT, WORTH_AT, TRENDS_AT, HOME_TRENDS_AT, BUDGET_TRENDS_AT, budgetUpdates } from '../src/data/hero-demo.js';

const product = process.env.VYLO_PRODUCT_SOURCE || '/Users/farazsworkmac/Desktop/Expense Tracker/implementation/approved-design-20260911/web/expense-tracker-frontend';
const { JSDOM } = createRequire(path.join(product, 'package.json'))('jsdom');
const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const makeDom = html => new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only' });
const animation = read('public/product/hero/story.js');

// Reduced motion must render the final actual product DOM without starting RAF.
for (const market of ['ca', 'us']) {
  const dom = makeDom(read(`public/product/hero/${market}.html`));
  const { window } = dom;
  window.matchMedia = () => ({ matches: true });
  let onResize;
  window.ResizeObserver = class { constructor(callback) { onResize = callback; } observe() {} };
  window.document.fonts = { ready: Promise.resolve() };
  window.requestAnimationFrame = () => { throw new Error('Reduced motion started animation'); };
  window.cancelAnimationFrame = () => {};
  window.eval(animation);
  await Promise.resolve();
  const root = window.document.querySelector('.real-product-story');
  assert.equal(root.dataset.time, String(STORY_END));
  assert.equal(root.querySelector('.board-trends').style.opacity, '1');
  assert.equal(root.querySelector('.board-activity').style.opacity, '0');
  assert.equal(root.querySelector('.board-budget').style.visibility, 'hidden');
  assert.equal(root.querySelectorAll('[data-story-category][data-categorized="true"]').length, 4);
  assert.equal(root.querySelector('[data-story-budget="0"] td:nth-child(3) p').textContent, market==='ca'?'$146.70':'$142.70');
  assert.equal(root.querySelector('[data-story-value="netWorth"]').getAttribute('aria-label'), market === 'ca' ? '$427,872.82' : '$427,784.82');
  // Static product SVGs must reflow to the actual frame, including repeated
  // desktop/phone resizing, without scaling their labels or changing data.
  const chart = root.querySelector('[data-testid="net-worth-main-chart-frame"]');
  const svg = chart.querySelector('svg');
  const line = chart.querySelector('[data-trend-line]');
  let chartWidth, chartHeight;
  Object.defineProperty(chart, 'clientWidth', { get: () => chartWidth });
  Object.defineProperty(chart, 'clientHeight', { get: () => chartHeight });
  for (const [width, height] of [[914,200],[332,135],[898,200],[914,200]]) {
    chartWidth = width; chartHeight = height; onResize();
    assert.equal(svg.getAttribute('viewBox'), `0 0 ${width} ${height}`);
    const labels = [...chart.querySelectorAll('[data-testid="trend-x-axis-label"]')];
    assert(Math.abs(Number(labels[0].getAttribute('x')) - 78) < .001);
    assert(Math.abs(Number(labels.at(-1).getAttribute('x')) - (width - 32)) < .001);
    assert(labels.every(label => label.getAttribute('font-size') === '11' && !label.hasAttribute('transform')));
    const endpoint = line.getAttribute('d').match(/(-?[\d.]+),(-?[\d.]+)$/);
    assert(Math.abs(Number(endpoint[1]) - (width - 32)) < .001,'The line and its animated reveal must reach the final month');
    assert(!line.hasAttribute('transform'),'Reflow path coordinates so pathLength animation matches the drawn line');
    assert.equal(line.getAttribute('stroke-width'),'2.5');
  }
  dom.window.close();
}

// Run the actual animation bundle against the generated product DOM. Verify
// callouts belong to the board, recede on time, and account totals agree.
for (const market of ['ca', 'us']) {
  const dom = makeDom(read(`public/product/hero/${market}.html`));
  const { window } = dom;
  let nextFrame;
  window.matchMedia = () => ({ matches: false });
  window.ResizeObserver = class { observe() {} };
  window.document.fonts = { ready: Promise.resolve() };
  window.requestAnimationFrame = callback => { nextFrame = callback; return 1; };
  window.cancelAnimationFrame = () => {};
  const root = window.document.querySelector('.real-product-story');
  Object.defineProperty(root, 'clientWidth', { value: 1160 });
  // Simulate the product's hidden lg progress column at intermediate widths.
  const categoryRect = {left:180,top:330,width:200,height:70};
  const progressRect = {left:380,top:330,width:180,height:70};
  const budgetRow = root.querySelector('[data-story-budget="0"]');
  budgetRow.children[0].getBoundingClientRect = () => categoryRect;
  budgetRow.children[1].getBoundingClientRect = () => market==='ca'
    ? {left:0,top:0,width:0,height:0} : progressRect;
  window.eval(animation);
  await Promise.resolve();
  assert.equal(root.querySelectorAll('.board-activity tbody tr').length, 4);
  assert.equal(root.querySelector('[data-story-row]').style.getPropertyValue('--row-open'), '0');
  window.dispatchEvent(new window.MessageEvent('message', { origin: 'http://localhost', source: window, data: { type: 'vylo-story-playback', playing: true } }));
  const fixture = createHeroDemo(market.toUpperCase());
  let previousTime = -1;
  const checkpoints = new Set();
  const enteredAt = new Map();
  for (let now = 1; now <= STORY_END+1; now += 25) {
    nextFrame(now);
    const elapsed = Number(root.dataset.time);
    if(!enteredAt.has(root.dataset.view))enteredAt.set(root.dataset.view,now-1);
    const crossed = point => {
      if(previousTime<point&&elapsed>=point){checkpoints.add(point);return true;}
      return false;
    };
    if (crossed(8000)) {
      assert.equal(root.dataset.view, 'transactions');
      assert.equal(root.querySelector('.board-budget').style.visibility, 'hidden');
      assert.equal(root.querySelectorAll('[data-story-category][data-categorized="true"]').length,4);
    }
    if (crossed(BUDGET_AT+1000) || crossed(BUDGET_TRENDS_AT-1000)) {
      assert.equal(root.dataset.view, 'budgets');
      assert.equal(root.querySelector('.board-activity').style.visibility, 'hidden');
      assert.equal(root.querySelector('.board-budget').style.opacity, '1');
      assert.equal(root.querySelector('.board-worth').style.visibility, 'hidden');
      const expected = money(sampleHeroDemo(fixture, elapsed).budgets[0]);
      assert.equal(root.querySelector('[data-story-budget="0"] td:nth-child(3) p').textContent,expected);
    }
    if(crossed(HOME_TRENDS_AT+1000)) { assert.equal(root.dataset.view,'home-trends'); assert.equal(root.querySelector('.board-home-trends').style.opacity,'1'); }
    if(crossed(BUDGET_TRENDS_AT+1000)) { assert.equal(root.dataset.view,'budget-trends'); assert.equal(root.querySelector('.board-budget-trends').style.opacity,'1'); }
    if(crossed(budgetUpdates[0]+100)) {
      const target = market==='ca'?categoryRect:progressRect;
      const landing = root.querySelector('[data-budget-receipt="0"]').style.transform;
      assert(landing.startsWith(`translate(${target.left+target.width*.45-75}px,${target.top+target.height/2-101}px)`), 'Budget receipt must land in a visible category cell');
    }
    if (crossed(WORTH_AT+2500) || crossed(WORTH_AT+5500) || crossed(WORTH_AT+8500)) {
      assert.equal(root.querySelector('.board-worth').style.opacity, '1');
      for(const key of ['cash','investments','liabilities','netWorth']) {
        const expected = money(sampleHeroDemo(fixture, elapsed)[key]);
        for (const cell of root.querySelectorAll(`[data-story-value="${key}"]`)) assert.equal(cell.getAttribute('aria-label'), expected);
      }
      const visibleEvents=[...root.querySelectorAll('[data-account-event]')].filter(n=>n.style.visibility==='visible');
      assert(visibleEvents.length<=1);
    }
    if(crossed(STORY_END)) {
      assert.equal(root.dataset.view,'trends');
      assert.equal(root.querySelector('.board-trends').style.opacity,'1');
      assert.equal(root.querySelector('[data-trend-line]').style.strokeDashoffset,'0');
      assert(now<31500,'Hero should reach its completed dashboard in about 31 seconds');
      break;
    }
    previousTime=elapsed;
  }
  assert.equal(checkpoints.size,10,'Every route and account checkpoint must be reached');
  assert(enteredAt.get('home-trends')<5500,'All transaction arrivals should finish in about five seconds');
  for(const [chart,next] of [['home-trends','budgets'],['budget-trends','net-worth']]) {
    const readingTime=enteredAt.get(next)-enteredAt.get(chart);
    assert(readingTime>=3400&&readingTime<=3550,'Trends must keep their original reading time');
  }
  dom.window.close();
}

// Parent lifecycle stays automatic; requested playback controls are absent.
const dom = makeDom(read('dist/design-direction/index.html'));
const { window } = dom;
const root = window.document.querySelector('[data-product-story]');
const frame = root.querySelector('iframe');
const messages = [];
const preference = { matches: false, addEventListener(_event, handler) { this.change = handler; } };
let visibility;
Object.defineProperty(window.document, 'hidden', { value: false, configurable: true });
window.matchMedia = () => preference;
window.IntersectionObserver = class { constructor(handler) { visibility = handler; } observe() {} };
frame.contentWindow.postMessage = message => messages.push(message);
window.eval((await transform(read('src/scripts/product-hero.ts'), { loader: 'ts' })).code);
assert.equal(root.querySelector('[data-story-toggle],[data-story-replay],[data-story-market-label]'),null);
assert.equal(root.querySelectorAll('[data-story-beat]').length,3);
const last = () => messages.at(-1);
visibility([{ isIntersecting: true, intersectionRatio: 0.8 }]);
assert.equal(last().playing,true);
visibility([{ isIntersecting: false, intersectionRatio: 0 }]);
assert.equal(last().playing,false);
visibility([{ isIntersecting: true, intersectionRatio: 0.8 }]);
Object.defineProperty(window.document,'hidden',{value:true});
window.document.dispatchEvent(new window.Event('visibilitychange'));
assert.equal(last().playing,false);
preference.matches=true;preference.change();assert.equal(last().reduced,true);
window.document.documentElement.dataset.screenshotMarket='CA';await Promise.resolve();
assert.equal(frame.getAttribute('src'),'/product/hero/ca.html');
assert(root.querySelector('[data-story-description]').textContent.includes('CAD and Canada'));
dom.window.close();
console.log('PASS: real product DOM, native Activity rows, phased updates, history ending, reduced motion, no playback controls, offscreen/background pause, regional switching.');
