interface ReleaseItem { title: string; description: string; appStore?: boolean; article?: string; }
interface Release { month: string; items: ReleaseItem[]; }
export const releases: Release[] = [
  {
    month: 'September 2026',
    items: [{
      title: 'A new Home screen for iPhone',
      article: 'projected-spending',
      description: 'See your projected month-end spending and a daily spending limit to help you stay on track—or get back on track. Open Projected Spend from Home or Budget to check the breakdown and adjust upcoming recurring costs.',
    }, {
      title: 'Vylo for iPhone is here',
      description: 'Out of beta and officially launched on September 18, 2026. Download Vylo from the App Store.',
      appStore: true,
    }],
  },
  {
    month: 'July 2026',
    items: [{
      title: 'Monthly Reports',
      description: 'A monthly summary of spending and category changes, with comparisons to the month before.',
    }],
  },
  {
    month: 'June 2026',
    items: [
      {
        title: 'iPhone App Beta',
        description: 'The iPhone app entered beta testing.',
      },
    ],
  },
  {
    month: 'April 2026',
    items: [
      {
        title: 'Projected spending',
        description: 'See where each category is likely to finish the month, based on spending so far.',
      },
    ],
  },
  {
    month: 'March 2026',
    items: [
      {
        title: 'More accurate transaction categories',
        description: 'Fewer transactions need a category correction.',
      },
      {
        title: 'Net-worth tracking',
        description: 'Add property, vehicles, and other assets that aren’t in a connected account.',
      },
      {
        title: 'Manual transactions and income',
        description: 'Add cash purchases, side income, or other transactions that aren’t in a connected account.',
      },
      {
        title: 'Income tracking',
        description: 'Track incoming deposits alongside household spending.',
      },
      {
        title: 'Category manager',
        description: 'Create, rename, and merge categories to match how your household budgets.',
      },
    ],
  },
  {
    month: 'February 2026',
    items: [
      {
        title: 'Household members',
        description: 'Invite other people by email and combine connected accounts in one household view.',
      },
      {
        title: 'Category budgets',
        description: 'Set a monthly amount for each category and compare it with current spending.',
      },
    ],
  },
  {
    month: 'January 2026',
    items: [
      {
        title: 'Spending trends',
        description: 'Compare weekly and monthly spending to see how categories change over time.',
      },
      {
        title: 'Automatic categorization',
        description: 'New transactions are assigned to a category using their merchant details.',
      },
    ],
  },
  {
    month: 'December 2025',
    items: [
      {
        title: 'Vylo launched',
        description: 'The first public version included Plaid account connections, transaction tracking, and household spending views.',
      },
    ],
  },
];

export const comingSoon = [
  {
    title: 'An AI assistant',
    description: 'We’re building an AI assistant to spot recurring charges you no longer need and cancel them for you where supported, find better options for services you already use, and compare prices or negotiate a better deal on bigger purchases.',
  },
];
