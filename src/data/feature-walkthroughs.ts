export const featureWalkthroughs = [
  {
    id: 'overview', name: 'Transactions & categories', question: '“Where is our money going?”',
    chapters: [
      { scene: 'categorize', label: 'Auto-categorization', title: "Less time sorting transactions.", copy: "Purchases arrive and Vylo puts them into categories. Optional AI helps with unfamiliar merchants; anything it still can’t place is yours to review." },
      { scene: 'review', label: 'Transaction review', title: "Review the ones Vylo couldn’t place.", copy: "Pick a category, confirm it, and move to the next transaction. The review queue keeps track of what’s left." },
      { scene: 'remember', label: 'Smart memory', title: "Categorize a merchant once.", copy: "Choose a category and tell Vylo to remember it. Future purchases from that merchant use your choice." },
      { scene: 'categories', label: 'Custom categories', title: "Make the categories your own.", copy: "Create a group for whatever life brings. Add Diapers, Formula, and Clothing under Baby stuff, and keep related spending together." },
      { scene: 'reports', label: 'Monthly reports', title: "See what changed this month.", copy: "Compare spending with the month before. See which categories changed most and what you might want to adjust." },
    ],
  },
  {
    id: 'budget', name: 'Budgets & spending trends', question: '“How’s this month looking?”',
    chapters: [
      { scene: 'budget-build', label: 'Auto-build', title: "Start with what you actually spend.", copy: "Auto-build suggests a budget from your past spending. Adjust the amounts and apply it when you’re ready." },
      { scene: 'budget', label: 'Budget tracking', title: "The budget updates as you spend.", copy: "New purchases update category totals and what’s left for the month, so you can adjust before you go over." },
      { scene: 'budget-trends', label: 'Budget trends', title: "See how your spending is changing.", copy: "Compare categories month to month. See what’s creeping up and where you’ve cut back. Building better habits takes time; small improvements count." },
    ],
  },
  {
    id: 'household', name: 'Shared household finances', question: '“Are we looking at the same numbers?”',
    chapters: [
      { scene: 'invite', label: 'Invite members', title: "Share Vylo with your household.", copy: "Invite your partner, family, or housemates by email. They get their own login, at no extra cost." },
      { scene: 'household', label: 'Connected accounts', title: "Everyone’s accounts, in one view.", copy: "Each person connects their own accounts. Balances and transactions appear in the same household, so there’s no need to swap screenshots." },
    ],
  },
  {
    id: 'worth', name: 'Assets, debt & net worth', question: '“Are we actually getting somewhere?”',
    chapters: [
      { scene: 'worth', label: 'Assets & debts', title: "See what you own and what you owe.", copy: "Track cash and investments alongside property and debt. Add anything that isn’t connected to a bank to see your household’s net worth." },
      { scene: 'worth-history', label: 'Net worth trends', title: "Follow your net worth over time.", copy: "See whether your net worth is growing, and how much comes from rising assets or falling debt." },
    ],
  },
] as const;
