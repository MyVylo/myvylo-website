# Hero product surfaces

The local concept presents one Vylo app frame: three chapters: Transactions (Activity → income/spending history), Budgets (category updates → Budget Trends), and Net Worth (account updates → net-worth history). Paper receipts are marketing annotations; app screens come from the product source. The production homepage is not changed by this concept.

## Rendering

`scripts/render-hero-product.jsx` imports the original desktop TransactionsScreen, shell, BudgetDetailPanel, NetWorthDashboardView , NetWorthHistoryPanel, DashboardTrendsSurface and BudgetTrendsSurface. The history panel includes the original SimpleGapLineTrendChart and asset/liability sparklines. Five data hooks receive fictional build-time fixtures. A closed transaction modal's empty portal is omitted for SSR. No product API is contacted or product source edited.

The native Activity view at widths ≤900px uses the actual native capture for toolbar, search, filter and bottom-navigation pixels. Fictional values and animated repeated rows are HTML overlays, traced to ActivityView.swift, SignedInTransactionRow in SurfaceChrome.swift, and DesignTokens.swift. This is a source-matched capture composition, not a live SwiftUI embed. Budgets, Net Worth and history use responsive presentations of the original web components. Feature-card capture provenance and interactions are documented in `../feature-captures-build83.md`.

The build exports static HTML, original CSS/fonts and local bank-logo assets. The website adds receipt motion, route transitions, row emphasis, account-event annotations and chart reveal. No React runtime or account connection ships. `product-provenance.json` records component hashes.

The net-worth chart's original SVG is fitted to the measured chart frame on resize. Plot coordinates adapt within the original axis margins; axis labels and line widths retain their product sizes. This replaces the responsive sizing hook that is absent from the static export, avoiding a small centered chart inside a wide card.

## Sequence and accounting

The opening ledger is empty. Four expenses enter and categorize. The Budgets page then receives four **new** purchases, increasing their respective category amounts and bars. Net Worth follows with a payroll credit, a $650 investment valuation gain, and a $500 mortgage principal payment. The payment reduces cash and liabilities equally; it does not create net worth. Income/spending and budget histories include the respective current-month figures at their point in the sequence, marked partial. The final history chart ends at these exact asset/liability balances, with fictional preceding monthly observations.

All calculations use integer cents. Canada and US switch merchants, accounts, currency and data as a unit.

| Final value | Canada (CAD) | US (USD) |
| --- | ---: | ---: |
| Expense purchases | $227.18 | $215.18 |
| Payroll | $2,450.00 | $2,350.00 |
| Cash | $11,722.82 | $11,634.82 |
| Investments | $100,650.00 | $100,650.00 |
| Property | $740,000.00 | $740,000.00 |
| Mortgage | $424,500.00 | $424,500.00 |
| Net worth | $427,872.82 | $427,784.82 |

Playback accelerates transaction arrivals to 1.6× and budget/account updates to 1.4×. Trends retain their original reading time. The completed dashboard appears at about 31 seconds, followed by a three-second hold and gentle reset; the full loop is about 35 seconds. Authored timeline timestamps remain unchanged so receipts, rows and accounting stay synchronized. Demo/Pause/Replay controls were removed at the user's request. Only the three chapter labels remain clickable; each associated trends surface follows inside its chapter. Playback pauses offscreen and in background tabs; reduced motion shows the completed history view without animation.

## Regeneration and verification

`VYLO_PRODUCT_SOURCE=/path/to/expense-tracker-frontend node scripts/build-hero-product.mjs`

Normal site builds use generated files and do not require the product checkout.

- `node scripts/check-hero-demo.mjs`: regional transactions, every accounting identity across the timeline, independent budget purchases and matching history endpoint.
- `npm run build`: Astro production build.
- `node scripts/check-hero-playback.mjs`: generated product DOM and animation bundle, route order, numeric updates, reduced motion, removed controls, visibility lifecycle and region switching.

The DOM check uses JSDOM from the adjacent product workspace. Visual verification uses the browser preview at desktop and phone widths.
