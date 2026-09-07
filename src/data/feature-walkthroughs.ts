export const featureWalkthroughs = [
  {
    id: 'overview', name: 'Transactions & categories', question: '“Where is our money going?”',
    chapters: [
      { scene: 'categorize', label: 'Automatic categories', title: "Less time sorting transactions.", copy: "Vylo categorizes most purchases automatically. You can enable AI for unfamiliar merchants, then review anything it still can’t place." },
      { scene: 'review', label: 'Quick review', title: "Review the ones Vylo couldn’t place.", copy: "Pick a category, confirm it, and move to the next transaction. The review queue keeps track of what’s left." },
      { scene: 'remember', label: 'Remember merchant', title: "Categorize a merchant once.", copy: "Choose a category and check “Remember merchant.” Future purchases from that merchant use the same category." },
      { scene: 'categories', label: 'Your categories', title: "Make the categories your own.", copy: "Rename a category or create one from scratch. Remember a merchant to put future purchases in the right place." },
      { scene: 'reports', label: 'Monthly reports', title: "See what changed this month.", copy: "Compare spending with the month before. See which categories changed most and what you might want to adjust." },
    ],
  },
  {
    id: 'budget', name: 'Budgets & spending trends', question: '“How’s this month looking?”',
    chapters: [
      { scene: 'budget-build', label: 'Build a budget', title: "Start with what you actually spend.", copy: "Auto-build suggests a budget from your past spending. Adjust the amounts and apply it when you’re ready." },
      { scene: 'budget', label: 'Track this month', title: "The budget updates as you spend.", copy: "New purchases update category totals and what’s left for the month, so you can adjust before you go over." },
      { scene: 'budget-trends', label: 'See your progress', title: "See how your spending is changing.", copy: "Compare categories month to month. See what’s creeping up and where you’ve cut back. Building better habits takes time; small improvements count." },
    ],
  },
  {
    id: 'household', name: 'Shared household finances', question: '“Are we looking at the same numbers?”',
    chapters: [
      { scene: 'invite', label: 'Invite your household', title: "Share Vylo with your household.", copy: "Invite your partner, family, or housemates by email. They get their own login, at no extra cost." },
      { scene: 'household', label: 'Connect accounts', title: "Everyone’s accounts, in one view.", copy: "Each person connects their own accounts. Balances and transactions appear in the same household, so there’s no need to swap screenshots." },
      { scene: 'shared', label: 'See spending together', title: "Both grocery trips count toward the same budget.", copy: "Your purchase and your partner’s both update the grocery budget. Everyone sees the same total." },
    ],
  },
  {
    id: 'worth', name: 'Assets, debt & net worth', question: '“Are we actually getting somewhere?”',
    chapters: [
      { scene: 'worth', label: 'The whole picture', title: "See what you own and what you owe.", copy: "Track cash and investments alongside property and debt. Add anything that isn’t connected to a bank to see your household’s net worth." },
      { scene: 'worth-history', label: 'Progress over time', title: "Follow your net worth over time.", copy: "See whether your net worth is growing, and how much comes from rising assets or falling debt." },
    ],
  },
];

export const walkthroughDemoContent: Record<string, { title: string; description: string; captions: string[] }> = {
  categorize: { title: 'Transactions', description: 'Demonstration: a grocery purchase is categorized automatically. Optional AI is enabled with consent before it suggests a category for an unfamiliar merchant. An uncertain transaction remains in review.', captions: ["Whole Foods goes into Groceries.", "Enable AI to help with unfamiliar merchants.", "AI suggests a category for Poulet Rouge.", "One purchase still needs review."] },
  review: { title: 'Review', description: 'Demonstration: choose Dining out for a $27.17 purchase, confirm the category, and move to the next transaction in the review queue.', captions: ["Three transactions need a category.", "This purchase belongs in Dining out.", "Save the category.", "Two transactions left to review."] },
  remember: { title: 'Transactions', description: 'Demonstration: categorize a café purchase as Dining out, enable Remember merchant, and see the next purchase from that merchant use the remembered category.', captions: ["Choose Dining out for the café purchase.", "Check Remember merchant.", "Saved for next time.", "The next café purchase is already categorized."] },
  categories: { title: 'Categories', description: 'Demonstration: rename Dining out to Eating out, create a Pottery category, and remember a studio merchant in the new category.', captions: ["Rename Dining out to Eating out.", "Add a category for Pottery.", "Put Clay Studio in Pottery and remember it.", "The next visit is categorized as Pottery."] },
  reports: { title: 'Reports', description: 'Example monthly report: August spending is $2,820, $300 lower than July. Dining out decreases by $100 while Transport increases by $40. Six of eight budget categories are within their limits.', captions: ["August’s spending report.", "You spent $300 less than July.", "Dining out fell $100. Transport rose $40.", "Six categories stayed within budget, up from four."] },
  'budget-build': { title: 'Budgets', description: 'Demonstration: recent spending suggests a $3,050 budget. Review category amounts, adjust Dining out from $350 to $300, and apply a $3,000 monthly budget.', captions: ["Build from your past spending.", "Review the suggested amounts.", "Lower Dining out from $350 to $300.", "Apply the $3,000 budget."] },
  'budget-trends': { title: 'Budget trends', description: 'Example: monthly spending declines from $3,120 in July to $2,820 in August against a $3,000 budget. Dining out improves by $100; Transport increases by $40.', captions: ["Three months of spending against a $3,000 budget.", "August came in $180 under budget.", "Dining out fell. Transport rose.", "Six categories within budget, compared with four in July."] },
  invite: { title: 'Household', description: 'Demonstration: invite Sam by email. Sam accepts with a separate login and joins Alex in the household.', captions: ["Alex starts the household.", "Invite Sam by email.", "Sam gets an invitation.", "Sam joins with a separate login."] },
  shared: { title: 'Household spending', description: 'Example: Alex spends $42 and Sam spends $67.43 on groceries. Both purchases count toward one household grocery total of $109.43.', captions: ["Alex spends $42 on groceries.", "Sam spends $67.43.", "Both purchases count toward the grocery budget.", "Each person sees the same $109.43 total."] },
  'worth-history': { title: 'Net worth trends', description: 'Example: household net worth rises from $115,800 in June to $120,800 in August. Assets increase by $3,000 and debt decreases by $2,000.', captions: ["Net worth starts at $115,800 in June.", "By August, it’s $120,800.", "Assets rose $3,000. Debt fell $2,000.", "Net worth grew by $5,000."] },
};
