// One clock plays the visible chapter. Native scrolling handles touch and trackpads.
const duration = 11000;
const stageDuration = 2200;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const explorer = document.querySelector<HTMLElement>('.product-explorer');
const tabs = Array.from(explorer?.querySelectorAll<HTMLButtonElement>('.product-tabs [role="tab"]') ?? []);
let paused = reducedMotion.matches;
let inView = false;
let elapsed = 0;
let lastTimestamp: number | null = null;
let frame: number | null = null;
let activeIndex = 0;

const interpolate = ([from, to, start, length]: number[], time: number) => {
  const progress = Math.min(1, Math.max(0, (time - start) / length));
  return from + (to - from) * (1 - Math.pow(1 - progress, 3));
};

const demos = Array.from(explorer?.querySelectorAll<HTMLElement>('[data-demo]') ?? []).map(root => {
  const surface = root.querySelector<HTMLElement>('.demo-surface')!;
  const controls = root.querySelector<HTMLElement>('.demo-controls')!;
  const caption = root.querySelector<HTMLElement>('[data-demo-caption]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-demo-toggle]')!;
  const replay = root.querySelector<HTMLButtonElement>('[data-demo-replay]')!;
  const progress = root.querySelector<HTMLElement>('.demo-timeline > span')!;
  const captions = JSON.parse(root.dataset.captions!) as string[];
  const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-in]')).map(element => ({ element, start: Number(element.dataset.in), end: Number(element.dataset.out ?? Infinity) }));
  const counters = Array.from(root.querySelectorAll<HTMLElement>('[data-number]')).map(element => ({ element, values: element.dataset.number!.split(',').map(Number), format: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: Number(element.dataset.decimals ?? 0), maximumFractionDigits: Number(element.dataset.decimals ?? 0) }) }));
  const bars = Array.from(root.querySelectorAll<HTMLElement>('[data-bar]')).map(element => ({ element, values: element.dataset.bar!.split(',').map(Number) }));
  const texts = Array.from(root.querySelectorAll<HTMLElement>('[data-text]')).map(element => ({ element, values: JSON.parse(element.dataset.text!) as string[] }));
  const lines = Array.from(root.querySelectorAll<SVGElement>('[data-draw]')).map(element => ({ element, values: element.dataset.draw!.split(',').map(Number) }));
  const netWorth = root.querySelector<HTMLElement>('[data-net-worth]');
  const assets = counters.find(counter => counter.element.dataset.total === 'assets');
  const liabilities = counters.find(counter => counter.element.dataset.total === 'liabilities');
  const render = (time: number) => {
    const stage = Math.min(captions.length - 1, Math.floor(time / stageDuration));
    if (root.dataset.demoStage !== String(stage)) root.dataset.demoStage = String(stage);
    if (caption.textContent !== captions[stage]) caption.textContent = captions[stage];
    progress.style.transform = `scaleX(${Math.min(1, time / duration)})`;
    reveals.forEach(({ element, start, end }) => {
      const visible = String(time >= start && time < end);
      if (element.dataset.visible !== visible) element.dataset.visible = visible;
    });
    texts.forEach(({ element, values }) => {
      const text = values[Math.min(stage, values.length - 1)];
      if (element.textContent !== text) element.textContent = text;
    });
    counters.forEach(({ element, values, format }) => {
      const value = format.format(interpolate(values, time));
      if (element.textContent !== value) element.textContent = value;
    });
    if (netWorth && assets && liabilities) {
      const value = assets.format.format(Math.round(interpolate(assets.values, time)) - Math.round(interpolate(liabilities.values, time)));
      if (netWorth.textContent !== value) netWorth.textContent = value;
    }
    bars.forEach(({ element, values }) => element.style.setProperty('--fill', `${interpolate(values, time)}%`));
    lines.forEach(({ element, values: [length, start, timeToDraw] }) => element.style.setProperty('--draw-offset', String(length - interpolate([0, length, start, timeToDraw], time))));
  };
  controls.hidden = false;
  surface.dataset.enhanced = 'true';
  render(duration);
  return { root, toggle, replay, render };
});

const walkthroughs = Array.from(explorer?.querySelectorAll<HTMLElement>('[data-walkthrough]') ?? []).map(root => ({
  root,
  track: root.querySelector<HTMLElement>('[data-walkthrough-track]')!,
  slides: Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]')),
  buttons: Array.from(root.querySelectorAll<HTMLButtonElement>('[data-chapter-select]')),
  demos: demos.filter(demo => root.contains(demo.root)),
  index: 0,
  pendingIndex: null as number | null,
  scrollFrame: null as number | null,
}));
const currentDemo = () => walkthroughs[activeIndex]?.demos[walkthroughs[activeIndex].index];
const updateControls = () => demos.forEach(({ root, toggle }) => {
  const action = paused ? 'Play' : 'Pause';
  toggle.textContent = action;
  toggle.setAttribute('aria-label', `${action} ${root.dataset.demo!.replaceAll('-', ' ')} animation`);
});
const canPlay = () => !paused && inView && !document.hidden && Boolean(currentDemo());
const tick = (timestamp: number) => {
  frame = null;
  if (!canPlay()) { lastTimestamp = null; return; }
  if (lastTimestamp !== null) elapsed = (elapsed + Math.min(timestamp - lastTimestamp, 100)) % duration;
  lastTimestamp = timestamp;
  currentDemo()?.render(elapsed);
  frame = requestAnimationFrame(tick);
};
const syncPlayback = () => {
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  lastTimestamp = null;
  if (canPlay()) frame = requestAnimationFrame(tick);
  updateControls();
};

const selectChapter = (groupIndex: number, index: number, scroll = true) => {
  const group = walkthroughs[groupIndex];
  if (!group) return;
  const nextIndex = Math.max(0, Math.min(index, group.slides.length - 1));
  const changed = group.index !== nextIndex;
  group.index = nextIndex;
  group.buttons.forEach((button, i) => {
    if (i === nextIndex) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  group.slides.forEach((slide, i) => { slide.inert = i !== nextIndex; });
  if (scroll) {
    const left = group.slides[nextIndex].offsetLeft - group.slides[0].offsetLeft;
    group.pendingIndex = Math.abs(group.track.scrollLeft - left) > 2 ? nextIndex : null;
    group.track.scrollTo({ left, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }
  if (changed && groupIndex === activeIndex) {
    elapsed = paused ? duration : 0;
    currentDemo()?.render(elapsed);
    group.buttons[nextIndex].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    syncPlayback();
  }
};
const selectTab = (index: number, focus = false) => {
  activeIndex = index;
  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls')!);
    if (panel) panel.hidden = !selected;
  });
  const group = walkthroughs[index];
  if (group) {
    // Hidden tracks have no layout; restore their last selected chapter after showing them.
    group.pendingIndex = null;
    group.track.scrollTo({ left: group.slides[group.index].offsetLeft - group.slides[0].offsetLeft, behavior: 'auto' });
    selectChapter(index, group.index, false);
  }
  elapsed = paused ? duration : 0;
  currentDemo()?.render(elapsed);
  if (focus) tabs[index]?.focus();
  syncPlayback();
};

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(index));
  tab.addEventListener('keydown', event => {
    let nextIndex: number;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(nextIndex, true);
  });
});
walkthroughs.forEach((group, groupIndex) => {
  selectChapter(groupIndex, 0, false);
  group.buttons.forEach((button, index) => button.addEventListener('click', () => selectChapter(groupIndex, index)));
  // A gesture takes over immediately from an in-progress button navigation.
  group.track.addEventListener('pointerdown', () => { group.pendingIndex = null; }, { passive: true });
  group.track.addEventListener('wheel', () => { group.pendingIndex = null; }, { passive: true });
  group.track.addEventListener('scroll', () => {
    if (group.scrollFrame !== null) return;
    group.scrollFrame = requestAnimationFrame(() => {
      group.scrollFrame = null;
      if (groupIndex !== activeIndex || !group.track.clientWidth) return;
      if (group.pendingIndex !== null) {
        const target = group.slides[group.pendingIndex].offsetLeft - group.slides[0].offsetLeft;
        if (Math.abs(target - group.track.scrollLeft) > 2) return;
        group.pendingIndex = null;
      }
      let closest = 0;
      let distance = Infinity;
      group.slides.forEach((slide, index) => {
        const candidate = Math.abs(slide.offsetLeft - group.slides[0].offsetLeft - group.track.scrollLeft);
        if (candidate < distance) { distance = candidate; closest = index; }
      });
      if (closest !== group.index) selectChapter(groupIndex, closest, false);
    });
  }, { passive: true });
  group.track.addEventListener('keydown', event => {
    // Player buttons retain normal keyboard behavior.
    if (event.target !== group.track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? group.slides.length - 1 : group.index + (event.key === 'ArrowRight' ? 1 : -1);
      selectChapter(groupIndex, index);
    }
  });
});
demos.forEach(({ toggle, replay }) => {
  toggle.addEventListener('click', () => {
    paused = !paused;
    if (!paused && elapsed >= duration) elapsed = 0;
    syncPlayback();
  });
  replay.addEventListener('click', () => {
    elapsed = 0;
    paused = false;
    currentDemo()?.render(0);
    syncPlayback();
  });
});
if (explorer && walkthroughs.length) {
  selectTab(0);
  const observer = new IntersectionObserver(entries => {
    inView = entries.some(entry => entry.isIntersecting);
    syncPlayback();
  }, { threshold: 0.1 });
  observer.observe(explorer.querySelector('.product-panels') ?? explorer);
  const resizeObserver = new ResizeObserver(() => {
    const group = walkthroughs[activeIndex];
    group.pendingIndex = null;
    group.track.scrollTo({ left: group.slides[group.index].offsetLeft - group.slides[0].offsetLeft, behavior: 'auto' });
  });
  resizeObserver.observe(explorer);
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    elapsed = paused ? duration : 0;
    currentDemo()?.render(elapsed);
    syncPlayback();
  });
  window.addEventListener('pagehide', () => {
    if (frame !== null) cancelAnimationFrame(frame);
    walkthroughs.forEach(group => {
      if (group.scrollFrame !== null) cancelAnimationFrame(group.scrollFrame);
      group.scrollFrame = null;
    });
    frame = null;
    lastTimestamp = null;
  });
  window.addEventListener('pageshow', syncPlayback);
}
