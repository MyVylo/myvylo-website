// Render the actual app components. No replacement UI markup lives here.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MotionConfig, motion } from 'framer-motion';
import TransactionsScreen from '@product/screens/desktop/TransactionsScreen';
import DesktopDashboardRouteShell from '@product/components/shell/DesktopDashboardRouteShell';
import AuthContext from '@product/AuthContext';
import { MonthProvider } from '@product/contexts/MonthContext';
import { ToastProvider } from '@product/contexts/ToastContext';
import { MemoryRouter } from 'react-router';
import { setHeroFixture } from './hero-product-fixture.js';
import BudgetDetailPanel from '@product/components/budget/BudgetDetailPanel';
import NetWorthDashboardView from '@product/components/networth/NetWorthDashboardView';
import { PageTimeControlGroup } from '@product/components/shell/PageTimeControls';
import DashboardTrendsSurface from '@product/components/dashboard/DashboardTrendsSurface';
import BudgetTrendsSurface from '@product/components/budget/BudgetTrendsSurface';
import NetWorthHistoryPanel from '@product/components/networth/NetWorthHistoryPanel';
import CategoryChip from '@product/components/ui/CategoryChip';
import { formatMoney } from '@product/utils/formatters/money';
import { createHeroDemo, sampleHeroDemo, heroHistory, heroFinanceHistory, HOME_TRENDS_AT, STORY_END } from '../src/data/hero-demo.js';
const noop = () => {};
export const formatProductMoney = cents => formatMoney(cents / 100, { context: 'kpi' });
export function renderProduct(market) {
  const demo = createHeroDemo(market);
  const state = sampleHeroDemo(demo, STORY_END);
  const categories = demo.budgets.map((b, i) => ({ id: i + 10, name: b.label, parent_id: 1, budget: b.limit / 100 }));
  const recentTransactions = demo.transactions.slice(0, 4).map((t, i) => ({ id: i + 1, merchant: t.merchant, amount: t.amount / 100, categoryId: i + 10, categoryName: t.category, parentCategoryName: t.income ? 'Income' : 'Flexible', date: '2026-09-18', accountSubtitle: demo.account, isPending: false }));
  const history = demo.history.map((t,i) => ({id:101+i,merchant:t.merchant,amount:t.amount/100,categoryId:t.categoryId,categoryName:t.category,parentCategoryName:t.income?'Income':t.category==='Bills'?'Fixed':'Flexible',date:`2026-09-${String(17-Math.floor(i/2)).padStart(2,'0')}`,accountSubtitle:demo.account,isPending:false}));
  const summary = { totalAssets: state.assets / 100, totalLiabilities: state.liabilities / 100, netWorth: state.netWorth / 100, balancesStale: false,
    accounts: [{ accountId: 'demo-cash', name: market === 'CA' ? 'Chequing' : 'Checking', institutionName: market === 'CA' ? 'TD Canada Trust' : 'Chase', type: 'depository', subtype: 'checking', category: 'cash', currentBalance: state.cash / 100, hasPersistedBalance: true, isLiability: false, mask: '1082', balanceUpdatedAt: '2026-09-18T12:00:00Z' }, { accountId: 'demo-investments', name: market === 'CA' ? 'TFSA' : 'Brokerage', institutionName: market === 'CA' ? 'Wealthsimple' : 'Fidelity', type: 'investment', category: 'investments', currentBalance: state.investments / 100, hasPersistedBalance: true, isLiability: false, mask: '2048', balanceUpdatedAt: '2026-09-18T12:00:00Z' }, { accountId: 'demo-mortgage', name: 'Mortgage', institutionName: market === 'CA' ? 'TD Canada Trust' : 'Chase', type: 'loan', subtype: 'mortgage', category: 'debt', currentBalance: state.liabilities / 100, hasPersistedBalance: true, isLiability: true, mask: '7012', balanceUpdatedAt: '2026-09-18T12:00:00Z' }],
    manualItems: [{ id: 1, itemType: 'property', label: 'Home', estimatedValue: demo.otherAssets / 100, updatedAt: '2026-09-18T12:00:00Z' }],
    latestSnapshot: { snapshotDate: '2026-09-18' } };
  const wrap = children => renderToStaticMarkup(<MotionConfig reducedMotion="always"><motion.div initial={false}>{children}</motion.div></MotionConfig>);
  const user = { id: 'fictional-demo', name: 'Casey Morgan', firstName: 'Casey', lastName: 'Morgan', email: 'casey@example.com' };
  const auth = { user, household: { id: 'fictional-household' }, accessToken: null, features: {}, logout: noop,
    authenticatedFetch: () => { throw new Error('The hero renderer must never request product data'); } };
  localStorage.setItem('vylo_selected_month:v2:hero', '2026-09');
  const screen = (route, children) => renderToStaticMarkup(<MotionConfig reducedMotion="always"><MemoryRouter initialEntries={[route]}><AuthContext.Provider value={auth}><MonthProvider scopeKey="hero"><ToastProvider>{children}</ToastProvider></MonthProvider></AuthContext.Provider></MemoryRouter></MotionConfig>);
  setHeroFixture({ transactions: [...recentTransactions,...history], categories: [...categories,{id:14,name:'Salary',parent_id:2},{id:30,name:'Bills',parent_id:3}], state: sampleHeroDemo(demo, HOME_TRENDS_AT) });
  return { demo, state,
    uncategorized: wrap(<CategoryChip categoryName="Uncategorized" />),
    activity: screen('/transactions', <TransactionsScreen />),
    budgets: screen('/budgets', <DesktopDashboardRouteShell title="Budgets" headerVariant="content" user={user} notifications={[]} logout={noop} navigate={noop} pageHeaderControls={<PageTimeControlGroup selectedMonth="2026-09" mode="month" hideMonthNavigation />}><BudgetDetailPanel groups={[{ id: 1, key: 'flexible', label: 'Flexible', totalSpend: state.budgetSpent / 100, budgetTotal: 900, budgetEnabled: true, status: { key: 'ON_TRACK' } }]} selectedGroupId={1} onSelectGroup={noop} categories={categories} spentByCategoryId={new Map(categories.map((c, i) => [c.id, state.budgets[i] / 100]))} transactions={recentTransactions} selectedMonth="2026-09" inlineEditingBudget={null} savingBudgetIds={{}} onStartInlineBudget={noop} onChangeInlineBudget={noop} onSaveInlineBudget={noop} onCancelInlineBudget={noop} onOpenBudgetSetup={noop} onEditBudget={noop} /></DesktopDashboardRouteShell>),
    homeTrends: screen('/dashboard', <DesktopDashboardRouteShell title="Dashboard" headerVariant="content" user={user} notifications={[]} logout={noop} navigate={noop} pageHeaderControls={<PageTimeControlGroup supportsTrends mode="trends" range="6m" onModeChange={noop} onRangeChange={noop} />}><DashboardTrendsSurface showRangeControl={false} resolved authoritativeOverview={heroFinanceHistory(demo)} currencyCode={demo.currency} range="6m" onRangeChange={noop} /></DesktopDashboardRouteShell>),
    budgetTrends: screen('/budgets', <DesktopDashboardRouteShell title="Budgets" headerVariant="content" user={user} notifications={[]} logout={noop} navigate={noop} pageHeaderControls={<PageTimeControlGroup supportsTrends mode="trends" range="6m" onModeChange={noop} onRangeChange={noop} />}><BudgetTrendsSurface showRangeControl={false} resolved authoritativeOverview={heroFinanceHistory(demo)} currencyCode={demo.currency} range="6m" onRangeChange={noop} /></DesktopDashboardRouteShell>),
    trends: screen('/net-worth', <DesktopDashboardRouteShell title="Net Worth" headerVariant="content" user={user} notifications={[]} logout={noop} navigate={noop}><NetWorthHistoryPanel summary={summary} snapshots={heroHistory(demo)} range="6m" onRangeChange={noop} currencyCode={demo.currency} meta={{bucket:'month',asOf:'2026-09-18'}} resolved trendsUnlocked /></DesktopDashboardRouteShell>),
    worth: screen('/net-worth', <DesktopDashboardRouteShell title="Net Worth" headerVariant="content" user={user} notifications={[]} logout={noop} navigate={noop}><NetWorthDashboardView summary={summary} loading={false} onAddAccount={noop} onCreateItem={noop} onUpdateItem={noop} onDeleteItem={noop} onFilterChange={noop} trendsUnlocked={false} /></DesktopDashboardRouteShell>),
  };
}
