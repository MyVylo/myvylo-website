type Link = { href: string; label: string };
type Value = { text: string; amount?: string; unit?: string; link?: Link };
type Cell = Value & { ca?: Value };
type Row = { label: string; vylo: Cell; competitor: Cell; featured?: boolean };
export interface Comparison {
  slug: string; name: string; shortName: string; description: string; intro: string; tagline: string;
  pricingLabel: string; availability: string; usOnly?: boolean;
  features: Row[]; prices: Row[]; fit: Row[]; sources: Link[]; details: string[];
}
const text = (value: string): Cell => ({ text: value });
const row = (label: string, vylo: string, competitor: string): Row => ({ label, vylo: text(vylo), competitor: text(competitor) });
const vyloMonthly: Cell = { amount: '$7', unit: '/month', text: '$2 for your first month. One plan for your whole household.' };
const vyloAccounts = 'Connect supported US and Canadian accounts. Transactions sort into categories automatically.';
const vyloBudget = 'Set monthly category budgets, adjust them as life changes, and see what’s left.';
const vyloSharing = 'Separate logins and one shared household budget. Unlimited members at no extra cost.';
const vyloNetWorth = 'Track cash, investments, property and debts over time, including assets you add manually.';
const vyloPlatforms = 'Web and iPhone.';
export const vyloWorkflows = {
  review: 'Work through purchases that need attention one card at a time. Confirm the category, change it or skip it for later, on web and iPhone.',
  daily: 'On iPhone, get a daily spending target from your remaining budget after allowing for expected recurring costs.',
  forecast: 'On iPhone, see where the month is heading based on spending so far, upcoming costs and your spending pace. Open the breakdown and ignore a cost you don’t expect.',
  reports: 'Open a completed month to see budget results, category totals, the biggest changes and notable purchases. Dig into the transactions behind the numbers.',
};
const vyloCurrency = 'Vylo bills in your local currency: USD in the US and CAD in Canada. Prices exclude taxes. Vylo’s first 12 paid months total $79; after that, 12 monthly payments total $84.';
const simplifiCanada: Value = { text: 'Quicken directs Canadian subscribers to the mobile app stores for local offers.', link: { href: 'https://apps.apple.com/ca/app/quicken-budget-track-money/id1449777194', label: 'See Canadian App Store pricing' } };

export const copilot: Comparison = {
  slug: 'copilot', name: 'Copilot Money', shortName: 'Copilot',
  description: 'Compare Vylo and Copilot Money on household sharing, budgets, investment views, pricing and availability in the US and Canada.',
  intro: 'If you want everyday budgeting at a lower monthly price, with a separate login for everyone at home, go with Vylo. If you’re in the US and want native Mac and iPad apps alongside more detailed investment views, Copilot is worth a look.',
  tagline: 'Spending and investment tracking, with native Apple apps', pricingLabel: 'Web subscriptions', usOnly: true,
  availability: 'Vylo supports US and Canadian accounts. Copilot is available in the US and supports US financial institutions and USD. Bank coverage varies by institution.',
  features: [
    row('Accounts & transactions', vyloAccounts, 'Connect supported US accounts, categorize spending automatically and review new transactions.'),
    row('Your budget', vyloBudget, 'Customize categories and budgets, with rollovers for amounts you don’t spend in a month.'),
    row('Getting started', 'Build a starting budget from recent spending, then make it your own.', 'Start with budgets based on your spending history, then adjust the categories and amounts.'),
    row('Reviewing purchases', vyloWorkflows.review, 'The dashboard’s To Review list collects new transactions. Edit individual purchases or mark the list as reviewed.'),
    row('Day-to-day guidance', vyloWorkflows.daily, 'Compare your spending with an ideal pace on the dashboard, see what’s free to spend, or add a Daily Spending widget.'),
    row('Looking ahead', vyloWorkflows.forecast, 'See upcoming recurring payments and budget progress. Cash Flow reports cover spending so far, rather than unpaid upcoming costs.'),
    row('Household sharing', vyloSharing, 'Partners can share the same Copilot account through a sign-in link. Both have full access to that account.'),
    row('Net worth', vyloNetWorth, 'See your net worth alongside account balances, assets and debts.'),
    row('Investment views', 'Include investment account balances in your household’s net worth.', 'Track investment performance and portfolio allocation alongside your everyday accounts.'),
    row('Monthly reviews', vyloWorkflows.reports, 'Month and Year in Review cover spending, income, investments and trends. Individual slides can be shared.'),
    row('Where you can use it', vyloPlatforms, 'Web, iPhone, iPad and Mac. Some features are still specific to the native apps.'),
  ],
  prices: [
    { label: 'Paying monthly', featured: true, vylo: vyloMonthly, competitor: { amount: '$13', unit: '/month', text: 'U.S. subscription price.' } },
    row('Paying annually', 'No annual plan. Pay monthly and cancel anytime.', '$95/year, paid upfront. About $7.92/month.'),
    row('Trying it out', '$2 for your first month. This is a paid introduction.', 'A free trial is offered at signup. Select a plan and check the renewal terms before starting.'),
    row('First 12 paid months', '$79 total: $2 + eleven $7 payments.', '$95 paid annually, or $156 across 12 monthly payments, after the trial.'),
    row('Ongoing yearly cost', '$84 across 12 monthly payments.', '$95 paid annually, or $156 across 12 monthly payments.'),
    row('Sharing at home', 'Separate member logins are included.', 'Sharing one account with a partner is included.'),
  ],
  fit: [
    row('How you use it', 'You want household spending and budgets on web and iPhone, with everyone using their own login.', 'You use several Apple devices and want native Mac and iPad apps as well as web access.'),
    row('What you want to follow', 'Everyday expenses and the bigger picture of your household’s net worth are your focus.', 'You want to spend more time exploring investment performance and allocation, too.'),
    row('Where you live', 'You’re in the US or Canada and want a monthly household plan.', 'You’re in the US and are comfortable with a shared account if your partner joins you.'),
  ],
  sources: [
    { href: 'https://www.copilot.money/', label: 'pricing and investment features' },
    { href: 'https://help.copilot.money/en/articles/11157550-quick-start-guide', label: 'budgets and setup' },
    { href: 'https://help.copilot.money/en/articles/4523792-sharing-your-account-with-a-partner', label: 'partner sharing' },
    { href: 'https://help.copilot.money/en/articles/6045480-dashboard-tab-overview', label: 'dashboard and insights' },
    { href: 'https://help.copilot.money/en/articles/9834331-adding-widgets', label: 'daily spending widget' },
    { href: 'https://help.copilot.money/en/articles/9682232-cash-flow-tab-overview', label: 'cash flow' },
    { href: 'https://help.copilot.money/en/articles/10310024-month-and-year-in-review', label: 'monthly and yearly reviews' },
    { href: 'https://help.copilot.money/en/articles/13157382-web-faq', label: 'web availability and feature differences' },
    { href: 'https://help.copilot.money/en/articles/10715424-international-currency', label: 'countries and currencies' },
  ],
  details: [vyloCurrency, 'Copilot prices are in USD; there is no Canadian subscription in this comparison. Prices are for new web subscriptions before taxes or special offers. App Store prices and legacy plans may differ. Twelve-month totals cover paid periods after any trial.'],
};

export const simplifi: Comparison = {
  slug: 'simplifi', name: 'Quicken Simplifi', shortName: 'Simplifi',
  description: 'Compare Vylo and Quicken Simplifi: monthly budgets, Spending Plan, household sharing, annual billing and Canadian pricing options.',
  intro: 'If you want a monthly household plan with room for everyone and no year-long commitment, go with Vylo. If you want your budget built around income, upcoming bills and savings goals—and you’re happy paying for a year at a time—take a look at Simplifi.',
  tagline: 'A Spending Plan built around income, bills and goals', pricingLabel: 'Vylo web plan · Simplifi by market',
  availability: 'Both apps support US and Canadian accounts. Simplifi supports one currency at a time. Check that your banks and account types are supported before subscribing.',
  features: [
    row('Accounts & transactions', vyloAccounts, 'Connect supported accounts, categorize transactions and keep balances in one place.'),
    row('Your budget', vyloBudget, 'The Spending Plan starts with income, subtracts bills and savings contributions, and shows what remains.'),
    row('Getting started', 'Use recent spending to build a starting budget, then adjust the amounts.', 'Review detected income and bills, add savings goals and planned spending, then adjust your Spending Plan.'),
    row('Reviewing purchases', vyloWorkflows.review, 'Filter and approve transactions on web. Its help center says the mobile card-review flow is unavailable on Simplifi Basic.'),
    row('Day-to-day guidance', vyloWorkflows.daily, 'The Spending Plan shows what remains after bills, planned spending and savings, including a daily average.'),
    row('Looking ahead', vyloWorkflows.forecast, 'Projected Spend looks ahead up to 12 months. Set other spending yourself or use a historical average, alongside planned bills and goals.'),
    row('Household sharing', vyloSharing, 'Share your space with one other person, using their own Quicken ID, at no extra cost.'),
    row('Net worth', vyloNetWorth, 'Track assets, liabilities and net worth alongside your spending.'),
    row('Monthly reviews', vyloWorkflows.reports, 'Filter reports for spending, income, savings and net worth on web and mobile.'),
    row('Investment views', 'Include investment account balances in your household’s net worth.', 'Explore holdings and investment performance alongside your accounts.'),
    row('Where you can use it', vyloPlatforms, 'Web, iPhone and Android.'),
  ],
  prices: [
    { label: 'Standard plan', featured: true, vylo: vyloMonthly, competitor: { amount: '$83.88', unit: '/year', text: 'Paid upfront on the U.S. website. Equivalent to $6.99/month.', ca: simplifiCanada } },
    { label: 'Monthly billing', vylo: text('Pay $7 each month after your $2 first month. Cancel anytime.'), competitor: { text: 'The web subscription is annual. The advertised monthly figure is the yearly cost divided by 12.', ca: { text: 'Check available plans in your Canadian app store. Its prices and billing options can differ from the U.S. website.' } } },
    { label: 'Introductory offers', vylo: text('$2 for the first month, then $7/month.'), competitor: { text: 'Quicken advertises discounted first-year offers. Check the total at checkout and the renewal price.', link: { href: 'https://www.quicken.com/products/simplifi/', label: 'See current offers' }, ca: simplifiCanada } },
    { label: 'Trying it out', vylo: text('Your $2 first month is paid. There’s no annual commitment.'), competitor: { text: 'Direct Quicken purchases have a 30-day money-back guarantee. This is not a free trial.', ca: { text: 'App-store purchases follow that store’s trial and refund terms. Check the offer before subscribing.' } } },
    { label: 'Ongoing yearly cost', vylo: text('$84 across 12 monthly payments.'), competitor: { text: '$83.88 at the standard U.S. web price we checked. That’s almost the same yearly cost as Vylo; the billing schedule differs.', ca: { text: 'Use the renewal price shown in your Canadian app store to compare with Vylo’s $84 across 12 monthly payments.' } } },
    row('Household members', 'Unlimited members included, with separate logins.', 'One additional person included, with their own Quicken ID.'),
  ],
  fit: [
    row('How you like to budget', 'You want to set amounts for your categories and keep up with everyday spending.', 'You want a Spending Plan that works out what remains after income, bills and savings goals.'),
    row('Who’s joining you', 'You want separate logins for more than two people on one household plan.', 'You’re budgeting alone or with one other person.'),
    row('How you want to pay', 'You’d rather pay monthly without committing to a full year.', 'You’re comfortable paying annually and may benefit from a first-year discount.'),
  ],
  sources: [
    { href: 'https://www.quicken.com/products/simplifi/', label: 'features and current offers' },
    { href: 'https://cart.quicken.com/create?addproduct=170522', label: 'standard U.S. web checkout price' },
    { href: 'https://www.quicken.com/products/pricing-comparison/', label: 'Canadian purchase guidance' },
    { href: 'https://support.simplifi.quicken.com/en/articles/3363727-quicken-simplifi-subscription-questions', label: 'subscription terms' },
    { href: 'https://support.simplifi.quicken.com/en/articles/4212702-understanding-your-spending-plan', label: 'Spending Plan' },
    { href: 'https://support.simplifi.quicken.com/en/articles/16634251-how-to-review-your-transactions-in-quicken-simplifi', label: 'web transaction review' },
    { href: 'https://support.simplifi.quicken.com/en/articles/16634429-how-to-review-your-transactions-in-quicken-simplifi-mobile-app', label: 'mobile review and plan restriction' },
    { href: 'https://support.simplifi.quicken.com/en/articles/4730541-using-reports-on-the-quicken-simplifi-mobile-app', label: 'reports' },
    { href: 'https://support.simplifi.quicken.com/en/articles/4776195-tracking-investments-on-the-mobile-app', label: 'investment views' },
    { href: 'https://support.simplifi.quicken.com/en/articles/6443103-how-to-use-spaces-sharing-in-quicken-simplifi', label: 'sharing' },
    { href: 'https://support.simplifi.quicken.com/en/articles/3828353-what-currencies-does-quicken-simplifi-support', label: 'supported currencies' },
    { href: 'https://apps.apple.com/ca/app/quicken-budget-track-money/id1449777194', label: 'Canadian App Store listing' },
  ],
  details: [vyloCurrency, 'The U.S. comparison uses Simplifi’s standard annual web price, not a temporary first-year discount. Quicken directs Canadian Simplifi customers to their mobile app stores. We link to the Canadian listing instead of presenting a U.S. web price as a Canadian price. Prices, available plans and refund terms can differ by store.'],
};

export const rocketMoney: Comparison = {
  slug: 'rocket-money', name: 'Rocket Money', shortName: 'Rocket Money',
  description: 'Compare Vylo with Rocket Money’s free and Premium plans: budgets, subscription help, household sharing, pricing and Canadian availability.',
  intro: 'If you want one paid plan for shared household budgets, spending and net worth, go with Vylo. If you’re in the US and want to start with free mobile tracking—or pay for help canceling subscriptions—Rocket Money may be a better fit.',
  tagline: 'Free mobile basics, with more tools in Premium', pricingLabel: 'Vylo web plan · Rocket Money Free and Premium', usOnly: true,
  availability: 'Vylo supports US and Canadian accounts. Rocket Money supports US members and US banks only. This comparison covers its Free and Premium plans.',
  features: [
    row('Accounts & transactions', vyloAccounts, 'Connect supported US accounts to follow spending and recurring subscriptions.'),
    row('Your budget', vyloBudget, 'The free plan includes two custom category budgets. Premium adds unlimited custom budgets and categories.'),
    row('Reviewing purchases', vyloWorkflows.review, 'Open purchases to change their categories. You can also exclude transactions from budgets or from spending reports.'),
    row('Day-to-day guidance', vyloWorkflows.daily, 'Follow category budgets and spending alerts, with widgets for monthly or category spending.'),
    row('Looking ahead', vyloWorkflows.forecast, 'See upcoming subscriptions. Budget setup suggests category amounts from past spending and shows projected savings as you adjust the plan.'),
    row('Subscription help', 'See charges in your transactions and keep track of them in your household budget.', 'Track subscriptions on the free plan. Premium adds help canceling unwanted subscriptions.'),
    row('Household sharing', vyloSharing, 'Premium includes one partner, with their own login. Both people share the same accounts and transactions.'),
    row('Net worth', vyloNetWorth, 'Net-worth tracking is included in Premium.'),
    row('Monthly reviews', vyloWorkflows.reports, 'Monthly spending reports show category breakdowns and changes in spending, alongside alerts.'),
    row('Where you can use it', vyloPlatforms, 'iPhone and Android. Full desktop web features require Premium.'),
  ],
  prices: [
    { label: 'Getting started', featured: true, vylo: vyloMonthly, competitor: { amount: '$0', text: 'For the Free plan. Premium costs extra.' } },
    row('Paid plan', '$7/month per household after the $2 first month. All Vylo features included.', 'Premium uses a sliding price selection at signup. Available prices vary by platform and offer.'),
    row('Trying it out', '$2 for your first month. This is a paid introduction.', 'Keep using the Free plan, or try Premium with a seven-day trial.'),
    row('Yearly cost', '$79 for your first 12 paid months, then $84 across 12 monthly payments.', 'Free remains $0. Premium’s total depends on the price and billing option you select.'),
    row('Sharing at home', 'Unlimited household members included.', 'One partner included with Premium. Sharing is not included in the Free plan.'),
    row('Bill negotiation', 'Not a service offered by Vylo.', 'Separate from Premium pricing: a successful negotiation costs 35–60% of the first year’s savings, based on your selected fee.'),
  ],
  fit: [
    row('What you need first', 'You want shared household budgets and net worth together in one paid plan.', 'You want a free starting point for mobile spending and subscription tracking.'),
    row('What you’ll pay for', 'You prefer a fixed monthly price with all Vylo features and household members included.', 'You want Premium’s subscription-cancellation help or other tools enough to pay for the upgrade.'),
    row('Where you live', 'You’re in the US or Canada.', 'You’re in the US. Rocket Money doesn’t currently support Canadian members or banks.'),
  ],
  sources: [
    { href: 'https://www.rocketmoney.com/faq', label: 'Free and Premium features' },
    { href: 'https://help.rocketmoney.com/en/articles/2217739-how-much-does-rocket-money-cost', label: 'pricing, trial and negotiation fees' },
    { href: 'https://help.rocketmoney.com/en/articles/4562634-account-sharing-in-rocket-money', label: 'partner sharing' },
    { href: 'https://help.rocketmoney.com/en/articles/12166750-rocket-money-for-desktop', label: 'desktop access' },
    { href: 'https://help.rocketmoney.com/en/articles/79778-does-rocket-money-support-international-banks', label: 'U.S. availability' },
    { href: 'https://help.rocketmoney.com/en/articles/1940551-how-to-get-the-most-out-of-rocket-money', label: 'monthly reports and spending tools' },
    { href: 'https://help.rocketmoney.com/en/articles/2649810-creating-a-budget', label: 'budgets and projected savings' },
    { href: 'https://help.rocketmoney.com/en/articles/3584535-ignoring-transactions', label: 'transaction exclusions' },
    { href: 'https://help.rocketmoney.com/en/articles/9217610-rocket-money-widgets', label: 'spending widgets' },
  ],
  details: [vyloCurrency, 'Rocket Money is available in the US. Its Premium prices and billing choices can vary, so we don’t present one advertised offer as a universal price. Check the price, renewal and trial terms at signup. Bill-negotiation charges are separate from subscription fees. This page does not compare Premium+ or other paid tiers.'],
};
