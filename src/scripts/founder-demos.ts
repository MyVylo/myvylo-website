// A single clock animates only the selected, visible walkthrough.
const stageDuration = 4000;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const explorer = document.querySelector<HTMLElement>('.product-explorer');
const tabs = Array.from(explorer?.querySelectorAll<HTMLButtonElement>('.product-tabs [role="tab"]') ?? []);
let paused = reducedMotion.matches;
let inView = false;
let elapsed = 0;
let lastTimestamp: number | null = null;
let frame: number | null = null;
let activeIndex = 0;

const demos = Array.from(explorer?.querySelectorAll<HTMLElement>('[data-demo]') ?? []).map(root => {
  const surface = root.querySelector<HTMLElement>('.demo-surface')!;
  const controls = root.querySelector<HTMLElement>('.demo-controls')!;
  const caption = root.querySelector<HTMLElement>('[data-demo-caption]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-demo-toggle]')!;
  const replay = root.querySelector<HTMLButtonElement>('[data-demo-replay]')!;
  const progress = root.querySelector<HTMLElement>('.demo-timeline > span')!;
  const captions = JSON.parse(root.dataset.captions!) as string[];
  const frames = Array.from(root.querySelectorAll<HTMLElement>('[data-screen-frame]'));
  const phoneFrames = Array.from(root.querySelectorAll<HTMLElement>('[data-phone-frame]'));
  const enlarge = root.querySelector<HTMLAnchorElement>('[data-demo-image-link]')!;
  const duration = captions.length * stageDuration;
  const render = (time: number) => {
    const stage = Math.min(captions.length - 1, Math.floor(time / stageDuration));
    if (root.dataset.demoStage !== String(stage)) {
      root.dataset.demoStage = String(stage);
      caption.textContent = captions[stage];
      surface.setAttribute('aria-label', captions[stage]);
      frames.forEach((element, index) => { element.dataset.visible = String(index === stage); });
      phoneFrames.forEach((element, index) => { element.dataset.visible = String(index === stage); });
      enlarge.href = frames[stage].dataset.image!;
      enlarge.dataset.marketImageLink = frames[stage].dataset.image!.split('/').pop()!;
    }
    progress.style.transform = `scaleX(${Math.min(1, time / duration)})`;
  };
  controls.hidden = false;
  render(0);
  return { root, toggle, replay, render, duration };
});
const walkthroughs = Array.from(explorer?.querySelectorAll<HTMLElement>('[data-walkthrough]') ?? []).map(root => ({
  root,
  track: root.querySelector<HTMLElement>('[data-walkthrough-track]')!,
  slides: Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]')),
  buttons: Array.from(root.querySelectorAll<HTMLButtonElement>('[data-chapter-select]')),
  demos: demos.filter(demo => root.contains(demo.root)),
  index: 0,
}));
const currentDemo = () => walkthroughs[activeIndex]?.demos[walkthroughs[activeIndex].index];
const canPlay = () => !paused && inView && !document.hidden && Boolean(currentDemo());
const tick = (timestamp: number) => {
  frame = null;
  const demo = currentDemo();
  if (!canPlay() || !demo) { lastTimestamp = null; return; }
  if (lastTimestamp !== null) elapsed = (elapsed + Math.min(timestamp - lastTimestamp, 100)) % demo.duration;
  lastTimestamp = timestamp;
  demo.render(elapsed);
  frame = requestAnimationFrame(tick);
};
const syncPlayback = () => {
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
  lastTimestamp = null;
  if (canPlay()) frame = requestAnimationFrame(tick);
  demos.forEach(({ root, toggle }) => {
    const action = paused ? 'Play' : 'Pause';
    toggle.textContent = action;
    toggle.setAttribute('aria-label', `${action} ${root.dataset.demo!.replaceAll('-', ' ')} animation`);
  });
};
const selectChapter = (groupIndex: number, index: number) => {
  const group = walkthroughs[groupIndex];
  if (!group) return;
  group.index = Math.max(0, Math.min(index, group.slides.length - 1));
  group.buttons.forEach((button, i) => {
    if (i === group.index) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  group.slides.forEach((slide, i) => { slide.hidden = i !== group.index; });
  if (groupIndex === activeIndex) {
    elapsed = 0;
    currentDemo()?.render(0);
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
  selectChapter(index, walkthroughs[index].index);
  if (focus) tabs[index]?.focus();
};
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(index));
  tab.addEventListener('keydown', event => {
    let nextIndex: number;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(nextIndex, true);
  });
});
walkthroughs.forEach((group, groupIndex) => {
  selectChapter(groupIndex, 0);
  group.buttons.forEach((button, index) => button.addEventListener('click', () => selectChapter(groupIndex, index)));
  group.track.addEventListener('keydown', event => {
    if (event.target !== group.track) return;
    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      selectChapter(groupIndex, event.key === 'Home' ? 0 : event.key === 'End' ? group.slides.length - 1 : group.index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
});
demos.forEach(({ toggle, replay }) => {
  toggle.addEventListener('click', () => { paused = !paused; syncPlayback(); });
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
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    elapsed = 0;
    currentDemo()?.render(0);
    syncPlayback();
  });
  window.addEventListener('pagehide', () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTimestamp = null;
  });
  window.addEventListener('pageshow', syncPlayback);
}
