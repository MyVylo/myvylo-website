export const screenshotRoot = '/product/current-20260914';
export const validMarket = value => /^(CA|US)$/i.test(value || '') ? value.toUpperCase() : null;
export function resolveMarket(request) {
  const url = new URL(request.url);
  const explicit = validMarket(url.searchParams.get('market'));
  const saved = validMarket((request.headers.get('Cookie') || '').match(/(?:^|;\s*)vylo_examples=(CA|US)(?:;|$)/i)?.[1]);
  return explicit || saved || (request.cf?.country === 'CA' ? 'CA' : 'US');
}
export const screenshotUrl = (file, market) => `${screenshotRoot}/${market.toLowerCase()}/${file}`;

export const marketCopy = market => market === 'CA'
  ? { viewing: 'You’re viewing the Canadian site.', switchLabel: 'Switch to the U.S. site', next: 'US' }
  : { viewing: 'You’re viewing the U.S. site.', switchLabel: 'Switch to the Canadian site', next: 'CA' };
