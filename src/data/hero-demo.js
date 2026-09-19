// Integer cents; illustrative local transactions, never exchange-rate conversions.
// Debits and payroll affect the same linked cash account.
export const STORY_END = 40000;
export const LOOP_DURATION = 44500;
export const arrivals = [1400, 3000, 4600, 6200];
export const HOME_TRENDS_AT = 8500;
export const BUDGET_AT = 12000;
export const BUDGET_TRENDS_AT = 23000;
export const WORTH_AT = 26500;
export const TRENDS_AT = 37000;
export const budgetUpdates = [14700, 16500, 18300, 20100];
export const accountUpdates = [28200, 31100, 34000];
const clamp = v => Math.max(0, Math.min(1, v));
export const smooth = v => { const p = clamp(v); return p * p * (3 - 2 * p); };
export function createHeroDemo(market = 'US') {
  const ca = market === 'CA';
  const categories = ['Groceries', 'Coffee & snacks', 'Subscriptions', 'Transport'];
  const amounts = ca ? [8430, 545, 1899, 1320, 245000] : [8430, 525, 1549, 1160, 235000];
  const merchants = ca ? ['Loblaws', 'Tim Hortons', 'Netflix', 'TTC', 'Payroll'] : ['Whole Foods', 'Blue Bottle', 'Netflix', 'MTA', 'Payroll'];
  const initials = ca ? ['LO', 'TH', 'N', 'TTC', '↗'] : ['WF', 'BB', 'N', 'MTA', '↗'];
  const budgetMerchants = ca ? ['Costco', 'Second Cup', 'Spotify', 'Uber'] : ['Trader Joe’s', 'Peet’s', 'Spotify', 'Uber'];
  const budgetAmounts = ca ? [6240,525,1299,2460] : [5840,575,1199,2240];
  return {
    market: ca ? 'CA' : 'US', currency: ca ? 'CAD' : 'USD', country: ca ? 'Canada' : 'United States',
    account: ca ? 'TD · Chequing' : 'Chase · Checking', accountType: ca ? 'Chequing balance' : 'Checking balance',
    openingCash: 1000000, otherAssets: 74000000, openingInvestments: 10000000, liabilities: 42500000,
    investmentGain: 65000, principalPayment: 50000,
    investmentAccount: ca ? 'Wealthsimple · TFSA' : 'Fidelity · Brokerage',
    liabilityAccount: ca ? 'TD · Mortgage' : 'Chase · Mortgage',
    openingIncome: 0, otherSpending: 0,
    budgets: categories.map((label, i) => ({ label, opening: amounts[i], limit: [50000, 10000, 10000, 20000][i] })),
    transactions: merchants.map((merchant, i) => ({ merchant, initials: initials[i], amount: amounts[i], category: categories[i] || 'Salary', income: i === 4 })),
    budgetTransactions: budgetMerchants.map((merchant,i)=>({merchant, amount:budgetAmounts[i], category:categories[i], income:false})),
    history: [],
  };
}
// Four purchases post on Activity; four additional purchases post on Budgets.
// Payroll, investment appreciation and a principal transfer then
// update Net Worth. A principal payment reduces cash and debt equally.
export function sampleHeroDemo(demo, time) {
  const posted = demo.transactions.map((tx, i) => Math.round(tx.amount * smooth((time - (tx.income ? accountUpdates[0] : arrivals[i] + 950)) / (tx.income ? 1500 : 450))));
  const budgetPosted = demo.budgetTransactions.map((tx, i) => Math.round(tx.amount * smooth((time - budgetUpdates[i]) / 1250)));
  const investmentGain = Math.round(demo.investmentGain * smooth((time - accountUpdates[1]) / 1500));
  const principalPayment = Math.round(demo.principalPayment * smooth((time - accountUpdates[2]) / 1500));
  const expenseDelta = posted.slice(0, 4).reduce((a, b) => a + b, 0) + budgetPosted.reduce((a,b)=>a+b,0);
  const income = demo.openingIncome + posted[4];
  const expenses = expenseDelta;
  const cash = demo.openingCash + posted[4] - expenseDelta - principalPayment;
  const investments = demo.openingInvestments + investmentGain;
  const assets = cash + investments + demo.otherAssets;
  const liabilities = demo.liabilities - principalPayment;
  const netWorth = assets - liabilities;
  const budgets = demo.budgets.map((b, i) => posted[i] + budgetPosted[i]);
  const budgetSpent = budgets.reduce((a,b) => a+b,0);
  return { posted, budgetPosted, income, expenses, savings: income - expenses, savingsRate: income ? (income - expenses) / income * 100 : 0,
    cash, investments, investmentGain, principalPayment, assets, liabilities, netWorth,
    change: netWorth - (demo.openingCash + demo.openingInvestments + demo.otherAssets - demo.liabilities),
    budgets, budgetSpent, budgetRemaining: 90000 - budgetSpent };
}
export function heroHistory(demo) {
  const final = sampleHeroDemo(demo, STORY_END);
  // Fictional monthly observations; each point balances, the last is the exact
  // outcome of the account events above.
  return [
    ['2026-04-01','Apr',81350000,43800000],
    ['2026-05-01','May',82300000,43550000],
    ['2026-06-01','Jun',82700000,43300000],
    ['2026-07-01','Jul',84100000,43000000],
    ['2026-08-01','Aug',84450000,42750000],
    ['2026-09-18','Sep',final.assets,final.liabilities],
  ].map(([key,label,assets,liabilities])=>({key,date:key,snapshotDate:key,observedThrough:key,label,longLabel:label+' 2026',netWorth:(assets-liabilities)/100,totalAssets:assets/100,totalLiabilities:liabilities/100,isPartial:false}));
}
export function heroFinanceHistory(demo) {
  const activity = sampleHeroDemo(demo, HOME_TRENDS_AT);
  const budget = sampleHeroDemo(demo, BUDGET_TRENDS_AT);
  const points = ['Apr','May','Jun','Jul','Aug','Sep'].map((label,i)=>({
    key:`2026-${String(i+4).padStart(2,'0')}`,label,longLabel:label+' 2026',
    isPartial:i===5,isComplete:i!==5,observedThrough:i===5?'2026-09-18':null,
  }));
  const cashFlow=points.map((point,i)=>{
    const income=i===5?activity.income/100:[5900,6200,6050,6200,6150][i];
    const spend=i===5?activity.expenses/100:[3150,2900,3050,2800,2950][i];
    return {...point,income,spend,netSavings:income-spend};
  });
  const budgetPerformance=points.map((point,i)=>{
    const spend=i===5?budget.budgetSpent/100:[920,860,790,840,750][i];
    return {...point,spend,budget:900,budgetCoverage:'complete',budgetProvenance:'historical',isComparable:i!==5,variance:900-spend,overage:Math.max(0,spend-900),status:spend>900?'over':'under'};
  });
  const completed=cashFlow.slice(0,5);
  const averageIncome=completed.reduce((s,p)=>s+p.income,0)/5;
  const averageSpend=completed.reduce((s,p)=>s+p.spend,0)/5;
  return {cashFlow,budgetPerformance,summary:{sampleCount:5,averageIncome,averageSpend,averageSavings:averageIncome-averageSpend,averageSavingsRate:(averageIncome-averageSpend)/averageIncome*100}};
}
export const money = cents => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const wholeMoney = cents => '$' + (cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 });
