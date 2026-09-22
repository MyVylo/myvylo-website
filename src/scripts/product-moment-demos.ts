// These are compositions of real native captures, with gestures timed to the UI response.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hoverAvailable = matchMedia('(hover: hover) and (pointer: fine)');
const mobileCards = matchMedia('(max-width: 900px)');
const defaultDuration = 10200;
// Keep gestures and their UI responses synchronized at a brisker pace.
// Even the longest sequence retains almost two seconds on its finished state.
const playbackRate = 1.65;
const ease = 'cubic-bezier(.22,.75,.18,1)';
type Point = [number, Keyframe];
type Demo = { root: HTMLElement; card: HTMLElement; animations: Animation[]; state: 'idle' | 'playing' | 'paused' | 'complete'; visible: boolean; generation: number };
const demos: Demo[] = [];

function compose(demo: Demo) {
  const durations: Record<string, number> = { 'projected-spend': 21000, review: 17500, categories: 22000, 'budget-build': 15500, budget: 23500, 'budget-trends': 14500, 'worth-history': 21500, worth: 25500, household: 12000, reports: 12500 };
  const duration = durations[demo.root.dataset.momentDemo!] ?? defaultDuration;
  const touch: Point[] = [[0, { opacity: 0 }]];
  const ripple: Point[] = [[0, { opacity: 0 }]];
  const at = (x: number, y: number) => ({ left: `${x / 796 * 100}%`, top: `${y / 920 * 100}%` });
  function animate(selector: string, points: Point[]) {
    const last = points[points.length - 1];
    if (last[0] < duration) points.push([duration, { ...last[1] }]);
    demo.root.querySelectorAll<HTMLElement>(selector).forEach(element => {
      const animation = element.animate(points.map(([time, frame]) => ({ easing: ease, ...frame, offset: time / duration })), { duration, fill: 'both' });
      animation.playbackRate = playbackRate;
      animation.pause();
      demo.animations.push(animation);
    });
  }
  function tap(time: number, x: number, y: number) {
    const position = at(x, y);
    touch.push([time, { ...position, opacity: 0, transform: 'translate(-50%,-50%) scale(1.1)' }], [time + 160, { ...position, opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }], [time + 320, { ...position, opacity: 1, transform: 'translate(-50%,-50%) scale(.68)' }], [time + 460, { ...position, opacity: 1, transform: 'translate(-50%,-50%) scale(1)' }], [time + 740, { ...position, opacity: 0, transform: 'translate(-50%,-50%) scale(1)' }]);
    ripple.push([time + 270, { ...position, opacity: 0, transform: 'translate(-50%,-50%) scale(.7)' }], [time + 330, { ...position, opacity: .8, transform: 'translate(-50%,-50%) scale(.9)' }], [time + 830, { ...position, opacity: 0, transform: 'translate(-50%,-50%) scale(3)' }]);
  }
  function swipe(time: number, from: [number, number], to: [number, number]) {
    touch.push([time, { ...at(...from), opacity: 0, transform: 'translate(-50%,-50%) scale(1.1)' }], [time + 160, { ...at(...from), opacity: 1, transform: 'translate(-50%,-50%) scale(.85)' }], [time + 300, { ...at(...from), opacity: 1, transform: 'translate(-50%,-50%) scale(.85)' }], [time + 1000, { ...at(...to), opacity: 1, transform: 'translate(-50%,-50%) scale(.85)' }], [time + 1300, { ...at(...to), opacity: 0, transform: 'translate(-50%,-50%) scale(1.2)' }]);
  }
  function sheet(selector: string, open: number, close?: number) {
    const poses: Point[] = [[0, { transform: 'translateY(105%)' }], [open, { transform: 'translateY(105%)' }], [open + 540, { transform: 'translateY(0)' }]];
    const dim: Point[] = [[0, { opacity: 0 }], [open, { opacity: 0 }], [open + 400, { opacity: .52 }]];
    if (close) {
      poses.push([close, { transform: 'translateY(0)' }], [close + 500, { transform: 'translateY(105%)' }]);
      dim.push([close, { opacity: .52 }], [close + 500, { opacity: 0 }]);
    }
    animate(selector, poses);
    animate('.native-dimmer', dim);
  }
  function swipeToTrends() {
    swipe(1000, [630, 420], [250, 420]);
    animate('.native-overview', [[0, { transform: 'translateX(0)' }], [1300, { transform: 'translateX(0)' }], [2000, { transform: 'translateX(-48%)' }], [2360, { transform: 'translateX(-112%)' }]]);
    animate('.native-trends', [[0, { transform: 'translateX(112%)' }], [1300, { transform: 'translateX(112%)' }], [2000, { transform: 'translateX(64%)' }], [2360, { transform: 'translateX(0)' }]]);
  }
  function pushPage(time: number) {
    animate('.sequence-result', [[0, { transform: 'translateX(105%)' }], [time, { transform: 'translateX(105%)' }], [time + 550, { transform: 'translateX(0)' }]]);
    animate('.sequence-base', [[0, { transform: 'translateX(0)', opacity: 1 }], [time, { transform: 'translateX(0)', opacity: 1 }], [time + 550, { transform: 'translateX(-20%)', opacity: 0 }]]);
  }
  function scrollPage(time: number, distance: number) {
    swipe(time, [580, 740], [580, 740 - distance]);
    animate('.sequence-scroll', [[0, { transform: 'translateY(0)' }], [time + 300, { transform: 'translateY(0)' }], [time + 1000, { transform: `translateY(-${distance / 796 * 100}cqw)` }]]);
  }
  switch (demo.root.dataset.momentDemo) {
    case 'categorize':
      animate('.sort-count-0', [[0,{opacity:1}],[2150,{opacity:1}],[2200,{opacity:0}]]);
      animate('.sort-count-1', [[0,{opacity:0}],[2150,{opacity:0}],[2200,{opacity:1}],[4550,{opacity:1}],[4600,{opacity:0}]]);
      animate('.sort-count-2', [[0,{opacity:0}],[4550,{opacity:0}],[4600,{opacity:1}]]);
      [1200, 3600].forEach((time, index) => {
        const category = `[data-native-category="${index}"]`;
        animate(`.sort-receipt-${index}`, [[0, { opacity: 1, transform: `translate(0,0) rotate(${index ? 5 : -6}deg) scale(1)` }], [time, { opacity: 1, transform: `translate(0,0) rotate(${index ? 5 : -6}deg) scale(1)` }], [time + 650, { opacity: .85, transform: `translate(${index ? '-10' : '19'}cqw,8cqw) rotate(0) scale(.8)` }], [time + 900, { opacity: 0, transform: `translate(${index ? '-10' : '19'}cqw,12cqw) rotate(0) scale(.55)` }]]);
        animate(`[data-native-row="${index}"]`, [[0, { opacity: 0, transform: 'translateY(3cqw)' }], [time + 550, { opacity: 0, transform: 'translateY(3cqw)' }], [time + 1000, { opacity: 1, transform: 'translateY(0)' }]]);
        animate(`${category} .sort-category-pending`, [[0, { opacity: 1 }], [time + 1100, { opacity: 1 }], [time + 1350, { opacity: 0 }]]);
        animate(`${category} .sort-category-result`, [[0, { opacity: 0, transform: 'translateY(5px)' }], [time + 1100, { opacity: 0, transform: 'translateY(5px)' }], [time + 1500, { opacity: 1, transform: 'translateY(0)' }]]);
        animate(category, [[0, { transform: 'scale(1)', boxShadow: '0 0 0 0 #b8a9ff00' }], [time + 1150, { transform: 'scale(1)', boxShadow: '0 0 0 0 #b8a9ff00' }], [time + 1500, { transform: 'scale(1.08)', boxShadow: '0 0 0 4px #b8a9ff50' }], [time + 2000, { transform: 'scale(1)', boxShadow: '0 0 0 4px #b8a9ff20' }], [time + 2550, { transform: 'scale(1)', boxShadow: '0 0 0 6px #b8a9ff00' }]]);
      });
      break;
    case 'remember':
      tap(900, 230, 490);
      sheet('.sequence-sheet', 1360, 4760);
      tap(2400, 704, 479);
      animate('.memory-on-state',[[0,{opacity:0}],[2710,{opacity:0}],[2960,{opacity:1}]]);
      tap(4300, 390, 815);
      break;
    case 'categories': {
      tap(500,670,100);
      animate('.group-create-sheet',[[0,{transform:'translateY(105%)'}],[950,{transform:'translateY(105%)'}],[1400,{transform:'translateY(0)'}],[3550,{transform:'translateY(0)'}],[4000,{transform:'translateY(105%)'}]]);
      tap(1550,360,750);

      animate('.group-typed-field span',[[0,{clipPath:'inset(0 100% 0 0)'}],[1940,{clipPath:'inset(0 100% 0 0)',easing:'steps(10,end)'}],[2750,{clipPath:'inset(0 0 0 0)'}]]);
      tap(3100,695,550);
      [3750,8350,13350,18350].forEach((time,i)=>animate(`.category-created-${i}`,[[0,{opacity:0}],[time,{opacity:0}],[time+250,{opacity:1}]]));
      const dim: Point[]=[[0,{opacity:0}],[950,{opacity:0}],[1350,{opacity:.52}],[3550,{opacity:.52}],[4000,{opacity:0}]];
      [4500,9500,14500].forEach((start,i)=>{
        const selector=`.category-create-${i}`;
        tap(start,700,260);
        animate(selector,[[0,{transform:'translateY(105%)'}],[start+450,{transform:'translateY(105%)'}],[start+900,{transform:'translateY(0)'}],[start+3650,{transform:'translateY(0)'}],[start+4100,{transform:'translateY(105%)'}]]);
        dim.push([start+450,{opacity:0}],[start+800,{opacity:.52}],[start+3650,{opacity:.52}],[start+4100,{opacity:0}]);
        tap(start+1100,365,740);

        animate(`${selector} .native-typed-name`,[[0,{clipPath:'inset(0 100% 0 0)'}],[start+1550,{clipPath:'inset(0 100% 0 0)',easing:'steps(7,end)'}],[start+2350,{clipPath:'inset(0 0 0 0)'}]]);
        tap(start+3150,695,450);
      });
      animate('.native-dimmer',dim);

      break;
    }
    case 'reports':
      tap(1000, 690, 130);
      pushPage(1460);
      scrollPage(3700, 540);
      break;
    case 'projected-spend':
      tap(1200, 580, 590);
      sheet('.projection-sheet', 1650, 16450);
      tap(3950, 720, 640);
      animate('.projection-breakdown', [[0,{opacity:1}],[4400,{opacity:1}],[4680,{opacity:0}]]);
      animate('.projection-expanded', [[0,{opacity:0}],[4400,{opacity:0}],[4680,{opacity:1}],[8500,{opacity:1}],[8750,{opacity:0}]]);
      swipe(5450, [670,790], [670,565]);
      tap(8050, 725, 638);
      animate('.projection-adjusted', [[0,{opacity:0}],[8500,{opacity:0}],[8750,{opacity:1}]]);
      swipe(10800, [665,790], [665,340]);
      animate('.projection-scroll', [[0,{transform:'translateY(0)'}],[5750,{transform:'translateY(0)'}],[6450,{transform:'translateY(-28cqw)'}],[11100,{transform:'translateY(-28cqw)'}],[12000,{transform:'translateY(-131cqw)'}]]);
      swipe(15150, [400,110], [400,730]);
      animate('.projection-home-after', [[0,{opacity:0}],[16000,{opacity:0}],[16400,{opacity:1}]]);
      break;
    case 'budget-build':
      tap(850,420,365);
      animate('.auto-setup',[[0,{opacity:1}],[1300,{opacity:1}],[1850,{opacity:0}]]);
      animate('.auto-generated',[[0,{transform:'translateX(105%)'}],[1300,{transform:'translateX(105%)'}],[1850,{transform:'translateX(0)'}],[11800,{transform:'translateX(0)',opacity:1}],[12400,{transform:'translateX(0)',opacity:0}]]);
      swipe(3000,[675,740],[675,450]);
      swipe(5700,[675,740],[675,400]);
      swipe(8500,[675,740],[675,400]);
      animate('.auto-categories-scroll',[[0,{transform:'translateY(0)'}],[3300,{transform:'translateY(0)'}],[4050,{transform:'translateY(-52cqw)'}],[6000,{transform:'translateY(-52cqw)'}],[6800,{transform:'translateY(-133cqw)'}],[8800,{transform:'translateY(-133cqw)'}],[9600,{transform:'translateY(-200cqw)'}]]);
      tap(11200,400,850);
      animate('.auto-applied',[[0,{opacity:0,transform:'translateY(3cqw)'}],[11800,{opacity:0,transform:'translateY(3cqw)'}],[12400,{opacity:1,transform:'translateY(0)'}]]);
      break;
    case 'budget': {
      swipe(1300, [680,760], [680,320]);
      animate('.budget-track-overview', [[0, { opacity: 1, transform: 'translateY(0)' }], [1600, { opacity: 1, transform: 'translateY(0)' }], [2300, { opacity: 0, transform: 'translateY(-48cqw)' }]]);
      const steps = [['groups',1900,4600],['fixed',4700,7700],['flexible',7800,10800],['nonmonthly',10900,13900],['digital',14000,16700],['flexible',16800,19300]] as const;
      for (const name of ['groups','fixed','flexible','nonmonthly','digital']) {
        const points: Point[] = [[0,{opacity:0,transform:'translateY(8cqw)'}]];
        steps.filter(([stage])=>stage===name).forEach(([,start,end])=>points.push([start-1,{opacity:0,transform:'translateY(8cqw)'}],[start+380,{opacity:1,transform:'translateY(0)'}],[end,{opacity:1,transform:'translateY(0)'}],[end+250,{opacity:0,transform:'translateY(-8cqw)'}]));
        animate(`.budget-track-${name}`,points);
      }
      tap(4250,710,210);
      swipe(6000,[680,780],[680,430]); tap(7350,710,110);
      swipe(9050,[680,780],[680,450]); tap(10450,710,100);
      swipe(12000,[680,780],[680,460]); tap(13550,710,120);
      swipe(14900,[680,360],[680,720]); tap(16350,710,105);
      tap(18400,410,450);
      animate('.budget-track-detail',[[0,{opacity:0,transform:'translateX(105%)'}],[18900,{opacity:0,transform:'translateX(105%)'}],[19500,{opacity:1,transform:'translateX(0)'}]]);
      break;
    }
    case 'household':
      tap(850,655,85);
      animate('.account-initial',[[0,{opacity:1}],[1300,{opacity:1}],[1650,{opacity:0}]]);
      animate('.account-preparing',[[0,{opacity:0,transform:'translateY(3cqw)'}],[1300,{opacity:0,transform:'translateY(3cqw)'}],[1700,{opacity:1,transform:'translateY(0)'}],[4600,{opacity:1,transform:'translateY(0)'}],[5000,{opacity:0,transform:'translateY(-3cqw)'}]]);
      animate('.account-connected',[[0,{opacity:0,transform:'translateY(3cqw)'}],[4700,{opacity:0,transform:'translateY(3cqw)'}],[5200,{opacity:1,transform:'translateY(0)'}]]);
      break;
    case 'shared':
      tap(1000, 734, 624);
      pushPage(1460);
      scrollPage(4100, 350);
      break;
    case 'worth': {
      const dim: Point[]=[[0,{opacity:0}]];
      [900,12000].forEach((start,i)=>{
        const name=i?'liability':'asset';
        tap(start,700,670);
        const selector=`.worth-${name}-form`;
        animate(selector,[[0,{transform:'translateY(105%)'}],[start+450,{transform:'translateY(105%)'}],[start+950,{transform:'translateY(0)'}],[start+5500,{transform:'translateY(0)'}],[start+6000,{transform:'translateY(105%)'}]]);
        dim.push([start+450,{opacity:0}],[start+850,{opacity:.52}],[start+5500,{opacity:.52}],[start+6000,{opacity:0}]);
        tap(start+1350,360,655);
        tap(start+2900,355,840);
        animate(`${selector} .worth-name-field span`,[[0,{clipPath:'inset(0 100% 0 0)'}],[start+1750,{clipPath:'inset(0 100% 0 0)',easing:'steps(12,end)'}],[start+2600,{clipPath:'inset(0 0 0 0)'}]]);
        animate(`${selector} .worth-value-field span`,[[0,{clipPath:'inset(0 100% 0 0)'}],[start+3300,{clipPath:'inset(0 100% 0 0)',easing:'steps(5,end)'}],[start+4100,{clipPath:'inset(0 0 0 0)'}]]);
        tap(start+4950,700,270);
        animate(`.worth-${name}-saved`,[[0,{opacity:0}],[start+5700,{opacity:0}],[start+6050,{opacity:1}]]);
      });
      animate('.native-dimmer',dim);
      swipe(8000,[660,760],[660,370]);
      animate('.worth-asset-scroll',[[0,{transform:'translateY(0)'}],[8300,{transform:'translateY(0)'}],[9100,{transform:'translateY(-56cqw)'}],[10200,{transform:'translateY(-56cqw)'}],[11000,{transform:'translateY(0)'}]]);
      swipe(19400,[660,760],[660,380]);
      animate('.worth-liability-scroll',[[0,{transform:'translateY(0)'}],[19700,{transform:'translateY(0)'}],[20500,{transform:'translateY(-40cqw)'}]]);
      break;
    }
    case 'review': {
      const sheetFrames: Point[] = [[0, { transform: 'translateY(105%)' }]];
      const dimFrames: Point[] = [[0, { opacity: 0 }]];
      [0, 4500, 9000].forEach((start, i) => {
        const card = `.review-card-${i}`;
        tap(start + 650, 395, 640);
        sheetFrames.push([start + 1100, { transform: 'translateY(105%)' }], [start + 1550, { transform: 'translateY(0)' }], [start + 2650, { transform: 'translateY(0)' }], [start + 3020, { transform: 'translateY(105%)' }]);
        dimFrames.push([start + 1100, { opacity: 0 }], [start + 1450, { opacity: .52 }], [start + 2650, { opacity: .52 }], [start + 3020, { opacity: 0 }]);
        tap(start + 2200, 390, 760);
        animate(`${card} .review-category-pending`, [[0, { opacity: 1 }], [start + 2650, { opacity: 1 }], [start + 2800, { opacity: 0 }]]);
        animate(`${card} .review-category-selected`, [[0, { opacity: 0 }], [start + 2650, { opacity: 0 }], [start + 2800, { opacity: 1 }]]);
        swipe(start + 3200, [285, 540], [645, 540]);
        animate(card, [[0, { transform: 'translateX(0) rotate(0deg)', opacity: 1 }], [start + 3500, { transform: 'translateX(0) rotate(0deg)', opacity: 1 }], [start + 4100, { transform: 'translateX(48%) rotate(7deg)', opacity: 1 }], [start + 4430, { transform: 'translateX(125%) rotate(8deg)', opacity: 0 }]]);
        animate(`${card} .review-confirm-tint`, [[0, { opacity: 0 }], [start + 3500, { opacity: 0 }], [start + 4100, { opacity: .18 }]]);
        animate(`${card} .review-swipe-check`, [[0, { opacity: 0 }], [start + 3500, { opacity: 0 }], [start + 3670, { opacity: 1 }]]);
        animate(`${card} .review-check-progress`, [[0, { strokeDashoffset: '1' }], [start + 3500, { strokeDashoffset: '1' }], [start + 4000, { strokeDashoffset: '0' }]]);
        animate(`[data-review-count="${i}"]`, [[0, { opacity: i === 0 ? 1 : 0 }], [Math.max(1,start - 1), { opacity: i === 0 ? 1 : 0 }], [Math.max(2,start), { opacity: 1 }], [start + 4380, { opacity: 1 }], [start + 4490, { opacity: 0 }]]);
      });
      animate('.review-sheet', sheetFrames);
      animate('.native-dimmer', dimFrames);
      animate('.review-completion', [[0, { opacity: 0 }], [13500, { opacity: 0 }], [14000, { opacity: 1 }]]);
      break;
    }
    case 'budget-trends':
      swipeToTrends();
      swipe(3000, [690, 760], [690, 610]);
      tap(5200, 485, 450);
      animate('.budget-chart-unselected', [[0, { opacity: 1 }], [5530, { opacity: 1 }], [5820, { opacity: 0 }]]);
      swipe(7800, [690, 760], [690, 220]);
      animate('.budget-trend-scroll', [[0, { transform: 'translateY(0)' }], [3300, { transform: 'translateY(0)' }], [4000, { transform: 'translateY(-19cqw)' }], [8100, { transform: 'translateY(-19cqw)' }], [9100, { transform: 'translateY(-131cqw)' }]]);
      break;
    case 'invite':
      tap(800, 622, 112);
      sheet('.household-sheet', 1250, 6050);
      tap(2550, 345, 526);
      animate('.native-email', [[0, { opacity: 0 }], [2920, { opacity: 0 }], [2990, { opacity: 1 }]]);
      animate('.native-email-value', [[0, { clipPath: 'inset(0 100% 0 0)' }], [3100, { clipPath: 'inset(0 100% 0 0)', easing: 'steps(17, end)' }], [4500, { clipPath: 'inset(0 0% 0 0)' }]]);
      tap(5600, 580, 676);
      animate('.native-invitation', [[0, { opacity: 0, transform: 'translateY(18px)' }], [6500, { opacity: 0, transform: 'translateY(18px)' }], [7100, { opacity: 1, transform: 'translateY(0)' }]]);
      break;
    case 'worth-history':
      swipeToTrends();
      swipe(4000,[680,760],[680,350]);
      swipe(8000,[680,760],[680,270]);
      animate('.native-history-scroll',[[0,{transform:'translateY(0)'}],[4300,{transform:'translateY(0)'}],[5250,{transform:'translateY(-105cqw)'}],[8300,{transform:'translateY(-105cqw)'}],[9300,{transform:'translateY(-218cqw)'}]]);
      tap(11200,410,725);
      sheet('.investment-sheet',11650);
      swipe(15000,[680,760],[680,450]);
      animate('.investment-detail-scroll',[[0,{transform:'translateY(0)'}],[15300,{transform:'translateY(0)'}],[16300,{transform:'translateY(-38cqw)'}]]);
      break;
  }
  animate('.gesture-touch', touch.sort((a,b)=>a[0]-b[0]));
  animate('.gesture-ripple', ripple.sort((a,b)=>a[0]-b[0]));
}

function pause(demo: Demo) {
  if (demo.state !== 'playing') return;
  demo.animations.forEach(animation => animation.pause());
  demo.state = 'paused';
  demo.root.dataset.state = demo.state;
}
function reset(demo: Demo) {
  demo.generation++;
  demo.animations.forEach(animation => animation.cancel());
  demo.animations = [];
  demo.state = 'idle';
  demo.root.dataset.state = demo.state;
}
function showCompleted(demo: Demo) {
  reset(demo);
  compose(demo);
  demo.animations.forEach(animation => animation.finish());
  demo.state = 'complete';
  demo.root.dataset.state = demo.state;
}
async function play(demo: Demo) {
  const panel = demo.root.closest<HTMLElement>('[data-feature-panel]');
  if (reducedMotion.matches || document.hidden || demo.state === 'playing' || panel?.hidden || panel?.inert) return;
  demos.forEach(other => { if (other !== demo) pause(other); });
  if (demo.state === 'complete') reset(demo);
  if (!demo.animations.length) compose(demo);
  demo.state = 'playing';
  demo.root.dataset.state = demo.state;
  demo.animations.forEach(animation => animation.play());
  const generation = demo.generation;
  try {
    await Promise.all(demo.animations.map(animation => animation.finished));
    if (generation !== demo.generation) return;
    demo.state = 'complete';
    demo.root.dataset.state = demo.state;
  } catch { /* Cancelled when leaving the page or enabling reduced motion. */ }
}

document.querySelectorAll<HTMLElement>('[data-moment-demo]').forEach(root => {
  const card = root.closest<HTMLElement>('.moment')!;
  const demo: Demo = { root, card, animations: [], state: 'idle', visible: false, generation: 0 };
  if (root.dataset.momentDemo === 'categorize') {
    root.querySelectorAll('[data-story-count]').forEach(node => {
      node.textContent = '';
      [0,1,2].forEach(i=>{ const count=document.createElement('span');count.className=`sort-count sort-count-${i}`;count.textContent=String(i);node.append(count); });
    });
    root.querySelectorAll('[data-native-category]').forEach(node => {
      const result = document.createElement('span');
      result.className = 'sort-category-result';
      result.append(...Array.from(node.childNodes));
      const pending = document.createElement('span');
      pending.className = 'sort-category-pending';
      pending.textContent = 'Uncategorized';
      node.append(pending, result);
    });
    root.classList.add('sort-enhanced');
  }
  const email = root.querySelector('[data-demo-email]');
  if (email) { const text = document.createElement('span'); text.className = 'native-email-value'; text.textContent = 'casey@example.com'; email.append(text); }
  demos.push(demo);
  if (reducedMotion.matches) showCompleted(demo);
  card.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && hoverAvailable.matches && !mobileCards.matches) play(demo); });
  card.addEventListener('pointerleave', () => { if (!mobileCards.matches && !root.matches(':focus-visible')) pause(demo); });
  root.addEventListener('focus', () => { if (root.matches(':focus-visible')) play(demo); });
  root.addEventListener('blur', () => { if (!card.matches(':hover')) pause(demo); });
  root.addEventListener('click', () => { if (mobileCards.matches || !hoverAvailable.matches || demo.state === 'complete') play(demo); });
  root.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); play(demo); }
    if (event.key === 'Escape') pause(demo);
  });
});
document.querySelectorAll<HTMLElement>('[data-feature-card]').forEach(card => {
  const buttons = Array.from(card.querySelectorAll<HTMLButtonElement>('[data-feature-select]'));
  const panels = Array.from(card.querySelectorAll<HTMLElement>('[data-feature-panel]'));
  const scroller = card.querySelector<HTMLElement>('.moment-feature-panels')!;
  const tabs = card.querySelector<HTMLElement>('.moment-feature-tabs')!;
  let request = 0;
  function markSelected(button: HTMLButtonElement) {
    buttons.forEach(item => { const selected = item === button; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
    panels.forEach(panel => { panel.inert = panel.dataset.featurePanel !== button.dataset.featureSelect; });
    if (mobileCards.matches) {
      const bounds = tabs.getBoundingClientRect();
      const chip = button.getBoundingClientRect();
      if (chip.left < bounds.left + 24 || chip.right > bounds.right - 24) {
        tabs.scrollTo({ left: tabs.scrollLeft + chip.left - bounds.left - (bounds.width - chip.width) / 2, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
    }
  }
  function updateLayout() {
    const current = buttons.find(button => button.getAttribute('aria-selected') === 'true') ?? buttons[0];
    markSelected(current);
    panels.forEach(panel => { panel.hidden = !mobileCards.matches && panel.dataset.featurePanel !== current.dataset.featureSelect; });
    if (mobileCards.matches) {
      const panel = panels.find(item => item.dataset.featurePanel === current.dataset.featureSelect)!;
      scroller.scrollTo({ left: panel.offsetLeft, behavior: 'instant' });
    }
  }
  async function select(button: HTMLButtonElement) {
    const ticket = ++request;
    const panel = panels.find(item => item.dataset.featurePanel === button.dataset.featureSelect)!;
    const demo = demos.find(item => item.root.closest('[data-feature-panel]') === panel)!;
    await Promise.all(Array.from(panel.querySelectorAll<HTMLImageElement>('img')).map(async image => {
      image.loading = 'eager';
      try { await image.decode(); } catch { /* Keep the native capture's loading state. */ }
    }));
    if (ticket !== request) return;
    demos.filter(item => item.card === card && item !== demo).forEach(pause);
    if (button.getAttribute('aria-selected') !== 'true') { if (reducedMotion.matches) showCompleted(demo); else reset(demo); }
    markSelected(button);
    if (mobileCards.matches) {
      scroller.scrollTo({ left: panel.offsetLeft, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      if (demo.visible) play(demo);
    } else {
      panels.forEach(item => { item.hidden = item !== panel; });
      play(demo);
    }
  }
  const pageObserver = new IntersectionObserver(entries => {
    if (!mobileCards.matches) return;
    for (const entry of entries) {
      if (entry.intersectionRatio < .65) continue;
      const panel = entry.target as HTMLElement;
      const button = buttons.find(item => item.dataset.featureSelect === panel.dataset.featurePanel)!;
      markSelected(button);
      const demo = demos.find(item => item.root.closest('[data-feature-panel]') === panel)!;
      if (demo.visible && demo.state !== 'complete') play(demo);
    }
  }, { root: scroller, threshold: [.65] });
  panels.forEach(panel => pageObserver.observe(panel));
  mobileCards.addEventListener('change', updateLayout);
  updateLayout();
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[next].focus();
      select(buttons[next]);
    });
  });
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  const demo = demos.find(item => item.root === entry.target);
  if (!demo) return;
  demo.visible = entry.intersectionRatio >= .65;
  if (!entry.isIntersecting) pause(demo);
  if (demo.visible && (mobileCards.matches || !hoverAvailable.matches) && (demo.state === 'idle' || demo.state === 'paused')) play(demo);
}), { threshold: [0, .65] });
demos.forEach(demo => observer.observe(demo.root));

// Native document snapping pages vertically through questions. Restrict the
// mandatory part to this section so the hero/footer remain freely scrollable.
const questionGrid = document.querySelector<HTMLElement>('.moments-grid');
function updateQuestionPaging() {
  if (!questionGrid) return;
  const bounds = questionGrid.getBoundingClientRect();
  const middle = window.innerHeight / 2;
  document.documentElement.toggleAttribute('data-question-paging', mobileCards.matches && bounds.top < middle && bounds.bottom > middle);
}
let pagingFrame = 0;
document.addEventListener('scroll', () => {
  if (pagingFrame) return;
  pagingFrame = requestAnimationFrame(() => { pagingFrame = 0; updateQuestionPaging(); });
}, { passive: true });
window.addEventListener('resize', updateQuestionPaging);
mobileCards.addEventListener('change', updateQuestionPaging);
updateQuestionPaging();
document.addEventListener('visibilitychange', () => { if (document.hidden) demos.forEach(pause); });
window.addEventListener('pagehide', () => { demos.forEach(reset); observer.disconnect(); });
reducedMotion.addEventListener('change', () => { demos.forEach(reducedMotion.matches ? showCompleted : reset); });
