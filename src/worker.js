import {resolveMarket, screenshotUrl, marketCopy} from './edge/screenshot-market.js';

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    const market = resolveMarket(request);
    const copy = marketCopy(market);
    if (path === '/api/screenshot-market') {
      return Response.json({market}, {headers:{'Cache-Control':'private, no-store'}});
    }
    const response = await env.ASSETS.fetch(request);
    if (!['/', '/founder-preview/', '/founder-preview'].includes(path) || !response.headers.get('Content-Type')?.includes('text/html')) return response;
    const headers = new Headers(response.headers);
    // The HTML varies by the visitor's country or their explicit choice. Assets stay cacheable.
    headers.set('Cache-Control', 'private, no-store');
    headers.delete('ETag');
    headers.delete('Content-Length');
    const html = new Response(response.body, {status:response.status, headers});
    return new HTMLRewriter()
      .on('html', {element(el){el.setAttribute('data-screenshot-market',market);el.setAttribute('data-market-resolved','true');}})
      .on('img[data-market-image]', {element(el){el.setAttribute('src',screenshotUrl(el.getAttribute('data-market-image'),market));}})
      .on('[data-screen-frame]', {element(el){const file=el.getAttribute('data-image')?.split('/').pop();if(file)el.setAttribute('data-image',screenshotUrl(file,market));}})
      .on('a[data-market-image-link]', {element(el){el.setAttribute('href',screenshotUrl(el.getAttribute('data-market-image-link'),market));}})
      .on('[data-screenshot-market-description]', {element(el){el.setInnerContent(copy.viewing);}})
      .on('[data-screenshot-market-switch]', {element(el){el.setAttribute('href',`?market=${copy.next}`);el.setInnerContent(copy.switchLabel);}})
      .transform(html);
  }
};
