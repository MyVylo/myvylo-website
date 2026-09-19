import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { build, transform } from 'esbuild';
import { createHash } from 'node:crypto';
import postcss from 'postcss';
import { nativeActivity } from './hero-native-activity.mjs';
const repo = path.resolve(import.meta.dirname, '..');
const product = process.env.VYLO_PRODUCT_SOURCE || '/Users/farazsworkmac/Desktop/Expense Tracker/implementation/approved-design-20260911/web/expense-tracker-frontend';
const requireProduct = createRequire(path.join(product, 'package.json'));
const { JSDOM } = requireProduct('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.localStorage = dom.window.localStorage;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.HTMLElement = dom.window.HTMLElement;
window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
Object.defineProperty(window, 'innerWidth', { value: 1280 });
const out = path.join(repo, 'public/product/hero');
await fs.mkdir(out, { recursive: true });
const modulePath = path.join(repo, '.astro/hero-product-render.mjs');
const fixturePath = path.join(repo, 'scripts/hero-product-fixture.js');
const hookExports = {
  useMonthScopedDashboardData: 'useMonthScopedDashboardData',
  usePaginatedTransactions: 'usePaginatedTransactions as default',
  useTransactionMonthOverview: 'useTransactionMonthOverview as default',
  useDashboardDataLifecycle: 'useDashboardDataLifecycle',
  useBankSync: 'useBankSync',
};
await build({ entryPoints: [path.join(repo, 'scripts/render-hero-product.jsx')], outfile: modulePath, bundle: true, platform: 'node', format: 'esm', jsx: 'automatic',
  alias: { '@product': path.join(product, 'src'), react: path.dirname(requireProduct.resolve('react')), 'react-dom': path.dirname(requireProduct.resolve('react-dom')), 'framer-motion': requireProduct.resolve('framer-motion') },
  plugins: [{ name: 'fictional-hero-data', setup(builder) {
    builder.onResolve({ filter: /\/hooks\/use(MonthScopedDashboardData|PaginatedTransactions|TransactionMonthOverview|DashboardDataLifecycle|BankSync)(\.js)?$/ }, args => ({ path: path.basename(args.path, '.js'), namespace: 'hero-fixture' }));
    builder.onLoad({ filter: /.*/, namespace: 'hero-fixture' }, args => ({ contents: `export { ${hookExports[args.path]} } from ${JSON.stringify(fixturePath)};`, resolveDir: repo }));
    // The closed modal renders an empty portal in the browser. SSR omits only
    // that empty portal; an accidentally opened modal fails the build.
    builder.onResolve({ filter: /\/ui\/AddTransactionModal$/ }, () => ({ path: 'closed-modal', namespace: 'hero-closed-portal' }));
    builder.onLoad({ filter: /.*/, namespace: 'hero-closed-portal' }, () => ({ contents: 'export default function ClosedModal({isOpen}) { if(isOpen) throw new Error("Hero cannot render an open transaction composer"); return null; }' }));
  } }],
  nodePaths: [path.join(product, 'node_modules')], loader: { '.js': 'jsx', '.css': 'empty', '.svg': 'text', '.png': 'dataurl' },
  external: ['node:*', 'stream', 'util', 'crypto', 'async_hooks'], define: { 'process.env.NODE_ENV': '"production"', 'process.env.PUBLIC_URL': '"/product/hero"' },
  banner: { js: 'import { createRequire as __createRequire } from "node:module"; const require = __createRequire(import.meta.url);' }, logLevel: 'warning' });
const { renderProduct } = await import(pathToFileURL(modulePath));
delete globalThis.document;
for (const market of ['US', 'CA']) {
  const result = renderProduct(market);
  const doc = html => new JSDOM(html).window.document;
  const activity = doc(result.activity);
  const budgets = doc(result.budgets);
  const worth = doc(result.worth);
  const trends = doc(result.trends);
  const homeTrends = doc(result.homeTrends);
  const budgetTrends = doc(result.budgetTrends);
  for (const document of [activity, budgets, worth, trends, homeTrends, budgetTrends]) for (const el of document.querySelectorAll('[style]')) {
    if (el.style.opacity === '0') el.style.opacity = '1';
    if (el.style.transform.includes('translate')) el.style.transform = 'none';
  }
  const activityShell = activity.querySelector('.expense-tracker-shell');
  activityShell.querySelector('.workflow-transaction-metrics dd').dataset.storyValue = 'expenses';
  activityShell.querySelectorAll('.workflow-transaction-metrics dd')[1].dataset.storyCount = '';
  [...activityShell.querySelectorAll('tbody tr')].slice(0,4).forEach((row, i) => {
    row.dataset.storyRow = i;
    row.querySelector('td:nth-child(4) button').dataset.storyCategory = i;
    for (const cell of row.querySelectorAll('td')) cell.innerHTML = `<div class="story-row-reveal">${cell.innerHTML}</div>`;
  });
  const categoryTable = budgets.querySelector('.budget-category-table');
  for (const row of categoryTable.querySelectorAll('[data-budget-card-id]')) row.dataset.storyBudget = Number(row.dataset.budgetCardId) - 10;
  const budgetShell = budgets.querySelector('.expense-tracker-shell');
  budgetShell.querySelector('.workflow-budget-balance .text-5xl').dataset.storyValue = 'budgetRemaining';
  budgetShell.querySelector('.workflow-budget-summary > p:last-child').dataset.storyBudgetSummary = '';
  const groupAmount = budgetShell.querySelector('.budget-group-tile .tabular-nums');
  for (const node of [...groupAmount.childNodes]) if (node.nodeType === 3 && node.textContent.includes('$')) {
    const span = budgets.createElement('span'); span.dataset.storyGroupSpent = ''; span.textContent = node.textContent; node.replaceWith(span);
  }
  for (const el of budgetShell.querySelectorAll('*')) if (!el.children.length && el.textContent.includes('4 categories ·')) el.dataset.storyGroupSummary = '';
  const worthShell = worth.querySelector('.expense-tracker-shell');
  const overview = worthShell.querySelector('.net-worth-review > div');
  const overviewSections = overview.querySelectorAll('section');
  overviewSections[0].querySelector('.text-5xl').dataset.storyValue = 'netWorth';
  overviewSections[1].querySelector('.text-xl').dataset.storyValue = 'assets';
  overviewSections[2].querySelector('.text-xl').dataset.storyValue = 'liabilities';
  for (const [key,label] of [['cash','Cash'],['investments','Investments']]) {
    const tile = [...overview.querySelectorAll('.net-worth-mini')].find(el => el.textContent.startsWith(label));
    tile.querySelector(':scope > p:last-child').dataset.storyValue = key;
    tile.dataset.accountTarget = key;
  }
  overviewSections[2].dataset.accountTarget = 'liabilities';
  for (const key of ['cash','investments','liabilities']) {
    const full = '$' + (result.state[key] / 100).toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2});
    for (const element of worthShell.querySelectorAll('*')) {
      if (!element.children.length && (element.textContent === full || element.textContent === '-'+full)) {
        element.dataset.storyValue = key;
        element.dataset.storyFormat = 'full';
      }
    }
  }
  const debtTile = [...overview.querySelectorAll('.net-worth-mini')].find(el=>el.textContent.startsWith('Mortgages'));
  if(debtTile)debtTile.querySelector(':scope > p:last-child').dataset.storyValue='liabilities';
  const trendsShell = trends.querySelector('.expense-tracker-shell');
  for(const path of trendsShell.querySelectorAll('[data-testid="trend-gap-line"]')) { path.setAttribute('pathLength','1'); path.dataset.trendLine=''; }
  for (const document of [activity,budgets,worth,trends,homeTrends,budgetTrends]) for (const img of document.querySelectorAll('img')) {
    const src=img.getAttribute('src');
    if(src?.startsWith('/product/hero/Bank%20Logos/')) {
      const relative=decodeURIComponent(src.slice('/product/hero/'.length));
      await fs.mkdir(path.dirname(path.join(out,relative)),{recursive:true});
      await fs.copyFile(path.join(product,'public',relative),path.join(out,relative));
    }
  }
  const homeTrendsShell = homeTrends.querySelector('.expense-tracker-shell');
  const budgetTrendsShell = budgetTrends.querySelector('.expense-tracker-shell');
  const events = [
    ['cash','↓','Pay deposited',result.demo.account,'+'+result.demo.transactions[4].amount/100,'income'],
    ['investments','↗','Investment growth',result.demo.investmentAccount,'+650','gain'],
    ['liabilities','✓','Principal paid',result.demo.liabilityAccount,'−500','payment']
  ].map(([key,icon,label,account,amount,type],i)=>`<div class="account-event account-event-${type}" data-account-event="${i}"><span class="account-event-icon">${icon}</span><div><small>${account}</small><strong>${label}</strong><p>${i===2?'Cash −$500 · Debt −$500':i===1?'Change in market value':'Direct deposit'}</p></div><b>${amount[0]}$${Number(amount.slice(1)).toLocaleString('en-US')}</b></div>`).join('');
  const receiptMarkup = (transactions,attr) => transactions.map((tx, i) => `<div class="story-receipt ${tx.income ? 'story-receipt-income' : ''}" ${attr}="${i}"><span class="receipt-symbol">${['✳','✦','N','↗','↙'][i]}</span><strong>${tx.merchant}</strong><span class="receipt-rule"></span><div class="receipt-lines"><i></i><i></i><i></i></div><span class="receipt-amount">${tx.income ? '+' : ''}$${(tx.amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span><small>${result.demo.currency} · ${tx.income ? 'Direct deposit' : 'Card payment'}</small><span class="receipt-barcode"></span></div>`).join('');
  const receipts = receiptMarkup(result.demo.transactions.slice(0,4),'data-story-receipt') + receiptMarkup(result.demo.budgetTransactions,'data-budget-receipt');
  const html = `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="./product.css"><link rel="stylesheet" href="./composition.css"><title>Vylo product demonstration · ${result.demo.currency}</title></head><body><main class="real-product-story" data-market="${market}"><div class="story-board"><div class="board-camera"><div class="board-activity" data-product-source="TransactionsScreen">${activityShell.outerHTML}${nativeActivity(result.demo)}</div><div class="board-home-trends" data-product-source="DashboardTrendsSurface">${homeTrendsShell.outerHTML}</div><div class="board-budget-trends" data-product-source="BudgetTrendsSurface">${budgetTrendsShell.outerHTML}</div><div class="board-budget" data-product-source="BudgetDetailPanel">${budgetShell.outerHTML}</div><div class="board-worth" data-product-source="NetWorthDashboardView">${worthShell.outerHTML}</div><div class="board-trends" data-product-source="NetWorthHistoryPanel">${trendsShell.outerHTML}</div><div class="account-events">${events}</div><span class="story-tap" aria-hidden="true"></span></div></div><div class="story-receipts">${receipts}</div><template data-story-uncategorized>${result.uncategorized}</template></main><script type="module" src="./story.js"></script></body></html>`;
  await fs.writeFile(path.join(out, `${market.toLowerCase()}.html`), html);
}
const sheets = ['src/index.css','src/components/transactions/Transactions.css','src/components/dashboard/Dashboard.css','src/components/budget/BudgetAppearance.css','src/components/budget/BudgetBalanceSummary.css','src/components/networth/NetWorth.css'];
let css = (await Promise.all(sheets.map(file => fs.readFile(path.join(product, file), 'utf8')))).join('\n');
css = css.replace(/^@import.*$/gm, '').replaceAll('./assets/fonts/', './');
const tailwind = requireProduct('tailwindcss');
const config = requireProduct(path.join(product, 'tailwind.config.js'));
const compiled = await postcss([tailwind({ ...config, content: [path.join(product, 'src/**/*.{js,jsx}')] })]).process(css, { from: undefined });
await fs.writeFile(path.join(out, 'product.css'), (await transform(compiled.css, { loader: 'css', minify: true })).code);
for (const font of ['DM-Sans.ttf','Lora-Italic.ttf']) await fs.copyFile(path.join(product, 'src/assets/fonts', font), path.join(out, font));
await fs.copyFile(path.join(product,'public/Final Favicon.svg'),path.join(out,'Final Favicon.svg'));
await build({ entryPoints: [path.join(repo,'src/scripts/hero-product-surface.ts')], outfile: path.join(out,'story.js'), bundle: true, minify: true, format: 'esm', alias: { '@product': path.join(product,'src') }, logLevel: 'warning' });
await fs.copyFile(path.join(repo, 'src/styles/hero-product-composition.css'), path.join(out, 'composition.css'));
const sources = ['src/screens/desktop/TransactionsScreen.jsx','src/components/shell/AppShell.jsx','src/components/shell/AppSidebarNav.jsx','src/components/shell/DesktopDashboardRouteShell.jsx','src/components/budget/BudgetDetailPanel.jsx','src/components/networth/NetWorthDashboardView.jsx','src/components/networth/NetWorthHistoryPanel.jsx','src/components/trends/SimpleGapLineTrendChart.jsx','src/components/dashboard/DashboardTrendsSurface.jsx','src/components/budget/BudgetTrendsSurface.jsx','src/components/trends/SimpleBarTrendChart.jsx','src/components/ui/CategoryChip.jsx', ...sheets];
const provenance = { source: 'approved-design-20260911/web/expense-tracker-frontend', method: 'Desktop: React renderToStaticMarkup of original product screens/components with fictional data. Native Activity: original iOS capture for chrome, source-matched repeated rows and fictional value overlays. Marketing receipts and account-event annotations are outside product UI.', sources: await Promise.all(sources.map(async file => ({ file, sha256: createHash('sha256').update(await fs.readFile(path.join(product,file))).digest('hex') }))) };
const nativeRoot = path.resolve(product,'../../ios/VyloApp');
provenance.nativeSources = await Promise.all(['Features/Activity/ActivityView.swift','Features/Shared/SurfaceChrome.swift','Core/Design/DesignTokens.swift'].map(async file=>({file,sha256:createHash('sha256').update(await fs.readFile(path.join(nativeRoot,file))).digest('hex')})));
provenance.nativeCapture = {file:'public/product/iphone/activity.jpg',sha256:createHash('sha256').update(await fs.readFile(path.join(repo,'public/product/iphone/activity.jpg'))).digest('hex')};
await fs.mkdir(path.join(repo,'docs/hero'), {recursive:true});
await fs.writeFile(path.join(repo,'docs/hero/product-provenance.json'), JSON.stringify(provenance,null,2)+'\n');
console.log('Rendered real TransactionsScreen, app shell, BudgetDetailPanel and NetWorthDashboardView for US and Canada.');
