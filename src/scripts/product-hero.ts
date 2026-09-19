const root = document.querySelector<HTMLElement>('[data-product-story]');
if (root) {
  const frame = root.querySelector<HTMLIFrameElement>('[data-story-frame]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  const send = (type: string, extra = {}) => frame.contentWindow?.postMessage({ type, ...extra }, location.origin);
  const playback = () => {
    send('vylo-story-playback', { playing: visible && !document.hidden && !reduced.matches, reduced: reduced.matches });
  };
  const market = () => {
    const region = document.documentElement.dataset.screenshotMarket === 'CA' ? 'ca' : 'us';
    const src = `/product/hero/${region}.html`;
    if (frame.getAttribute('src') !== src) frame.src = src;
    root.querySelector('[data-story-description]')!.textContent = `Fictional ${region === 'ca' ? 'Canadian' : 'US'} purchases enter Vylo’s ${innerWidth <= 900 ? 'native Activity list' : 'Transactions screen'} and receive categories, followed by income-versus-spending history. A second set of purchases updates their budget categories, followed by Budget Trends. Payroll and investment growth increase assets; a mortgage principal payment reduces cash and debt equally. The sequence ends with Vylo’s actual net-worth history chart. Figures and institutions are localized to ${region === 'ca' ? 'CAD and Canada' : 'USD and the United States'}.`;
  };
  market();
  new MutationObserver(market).observe(document.documentElement, { attributes: true, attributeFilter: ['data-screenshot-market'] });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.15; playback(); }, { threshold: 0.15 }).observe(frame);
  frame.addEventListener('load', playback);
  document.addEventListener('visibilitychange', playback);
  reduced.addEventListener('change', playback);
  root.querySelectorAll<HTMLElement>('[data-story-beat]').forEach((beat,i)=>beat.addEventListener('click',()=>{ send('vylo-story-seek',{beat:i}); playback(); }));
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
    if (event.data?.type === 'vylo-story-size' && Number.isFinite(event.data.height)) { frame.style.height = `${Math.max(300, Math.min(900, event.data.height))}px`; return; }
    if (event.data?.type !== 'vylo-story-state') return;
    root.dataset.storyPhase = event.data.phase;
    root.querySelectorAll<HTMLElement>('[data-story-beat]').forEach((beat, i) => beat.dataset.active = String(i === event.data.beat));
  });
}
