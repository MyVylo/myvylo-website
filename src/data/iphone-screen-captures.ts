// Original native-app captures, also used by the iPhone Help guides.
// Match the four beats in each existing desktop walkthrough.
export const iphoneCaptures = {
  categorize: ['activity', 'activity', 'ai-consent', 'review'],
  review: ['review', 'review-category', 'review', 'review'],
  remember: ['activity', 'activity-category', 'review', 'review'],
  categories: ['categories', 'categories', 'category-edit', 'category-add'],
  reports: ['reports', 'report-detail', 'report-detail', 'reports'],
  'budget-build': ['budget-setup', 'budget-auto', 'budget-auto', 'budget-auto'],
  budget: ['budget', 'budget-table', 'budget-table', 'budget'],
  'budget-trends': ['budget-trends', 'budget-trends', 'budget-trends', 'budget-trends'],
  invite: ['household', 'household-invite', 'household-invite', 'household'],
  household: ['accounts', 'accounts', 'accounts', 'household'],
  shared: ['home', 'activity', 'budget', 'home'],
  worth: ['net-worth', 'manual-asset', 'net-worth', 'net-worth'],
  'worth-history': ['net-worth-history', 'net-worth-history', 'net-worth', 'manual-asset'],
} as const;
