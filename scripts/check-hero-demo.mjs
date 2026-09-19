import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHeroDemo, sampleHeroDemo, heroHistory, heroFinanceHistory, STORY_END, arrivals, BUDGET_AT, WORTH_AT, accountUpdates } from '../src/data/hero-demo.js';
for (const market of ['CA','US']) {
  const demo=createHeroDemo(market),first=sampleHeroDemo(demo,0),last=sampleHeroDemo(demo,STORY_END);
  assert.equal(demo.history.length,0);
  assert.equal(first.expenses,0);
  assert.equal(first.cash,1000000);
  assert.equal(last.expenses,market==='CA'?22718:21518);
  assert.equal(last.cash,market==='CA'?1172282:1163482);
  assert.equal(last.netWorth,market==='CA'?42787282:42778482);
  assert.deepEqual(sampleHeroDemo(demo,BUDGET_AT).budgets,demo.transactions.slice(0,4).map(tx=>tx.amount));
  assert.deepEqual(sampleHeroDemo(demo,WORTH_AT).budgets,last.budgets);
  assert.equal(last.budgetSpent,last.expenses);
  assert.equal(last.investments,demo.openingInvestments+demo.investmentGain);
  assert.equal(last.liabilities,demo.liabilities-demo.principalPayment);
  assert.equal(sampleHeroDemo(demo,accountUpdates[2]).netWorth,last.netWorth);
  for(let time=0;time<=STORY_END;time+=25){
    const state=sampleHeroDemo(demo,time);
    assert.equal(state.netWorth,state.assets-state.liabilities);
    assert.equal(state.cash,demo.openingCash+state.posted[4]-state.expenses-state.principalPayment);
    assert.equal(state.savings,state.income-state.expenses);
    for(const value of [state.cash,state.assets,state.netWorth,...state.budgets])assert(Number.isInteger(value));
  }
  for(const at of arrivals)assert.equal(sampleHeroDemo(demo,at+1450).cash,sampleHeroDemo(demo,at+1550).cash);
  const finance=heroFinanceHistory(demo);
  assert.equal(Math.round(finance.cashFlow.at(-1).spend*100),demo.transactions.slice(0,4).reduce((s,t)=>s+t.amount,0));
  assert.equal(Math.round(finance.budgetPerformance.at(-1).spend*100),last.budgetSpent);
  const history=heroHistory(demo);
  history.forEach(point=>assert(Math.abs(point.netWorth-(point.totalAssets-point.totalLiabilities))<.000001));
  assert.equal(Math.round(history.at(-1).netWorth*100),last.netWorth);
  const html=fs.readFileSync(new URL(`../public/product/hero/${market.toLowerCase()}.html`,import.meta.url),'utf8');
  for(const source of ['TransactionsScreen','BudgetDetailPanel','NetWorthDashboardView','NetWorthHistoryPanel','DashboardTrendsSurface','BudgetTrendsSurface','ActivityView.swift + native capture'])assert(html.includes(`data-product-source="${source}"`));
  for(const tx of [...demo.transactions.slice(0,4),...demo.budgetTransactions])assert(html.includes(tx.merchant));
  assert(!html.includes('budget-focus'));
  assert(html.includes(demo.investmentAccount));
  assert(!html.includes(createHeroDemo(market==='CA'?'US':'CA').account));
}
console.log('PASS: empty opening; distinct regional transaction sets; cent-accurate budgets/balances; principal payment does not inflate net worth; trend endpoint reconciles.');
