export const helpCategories = [
  { id: 'getting-started', title: 'Getting started', description: 'Your first connection, first budget, and a quick tour.' },
  { id: 'bank-connections', title: 'Bank connections & syncing', description: 'Connect accounts, understand delays, and get back in sync.' },
  { id: 'transactions', title: 'Transactions & review', description: 'Find, correct, and sort the money coming in and going out.' },
  { id: 'categories', title: 'Categories & rules', description: 'Understand the defaults, choose your own names, and adjust how purchases are sorted.' },
  { id: 'budgets', title: 'Budgets & income', description: 'Build a monthly plan and adjust it as life changes.' },
  { id: 'household', title: 'Your household', description: 'Invite someone and understand what you share.' },
  { id: 'reports', title: 'Reports & net worth', description: 'See what changed this month and over time.' },
  { id: 'billing', title: 'Subscription & billing', description: 'Payments, invoices, cancellation, and App Store subscriptions.' },
  { id: 'account', title: 'Account, privacy & security', description: 'Sign-in help, preferences, data controls, and security.' },
  { id: 'feedback', title: 'Help & feedback', description: 'Get in touch, report a problem, or suggest something better.' },
];
export const articleUrl = (slug: string) => `/help/articles/${slug}/`;
export const normalizeSearch = (text: string) => text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function searchArticles(articles: any[], query: string, category = '') {
  const synonyms: Record<string,string> = { cancelling: 'cancel', canceling: 'cancel', cancellation: 'cancel', cancelled: 'cancel', canceled: 'cancel', renaming: 'rename', renames: 'rename', syncing: 'sync', synced: 'sync', synchronizing: 'sync', synchronise: 'sync', categorization: 'category', categorise: 'category', categorize: 'category', categories: 'category', invoices: 'invoice', refunds: 'refund', passwords: 'password' };
  const tokens = (value: string) => normalizeSearch(value).split(' ').filter(Boolean).map(word => synonyms[word] || word);
  const stopWords = new Set(['a','an','the','how','do','does','did','i','we','my','our','your','can','is','it','in','of','to','for','and','on','with','why','what']);
  const terms = tokens(query).filter(word => !stopWords.has(word));
  return articles.filter(a => !category || a.category === category).map(a => {
    const title = tokens(a.title).join(' '), keywords = tokens(a.keywords.join(' ')).join(' '), description = tokens(a.description).join(' '), body = tokens(a.body).join(' ');
    const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 12 : keywords.includes(term) ? 8 : description.includes(term) ? 5 : body.includes(term) ? 1 : -1000), 0);
    return { article: a, score };
  }).filter(hit => hit.score >= 0).sort((a,b) => b.score - a.score || a.article.order - b.article.order).map(hit => hit.article);
}
