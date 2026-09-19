# Feature demonstration provenance and checks — September 18, 2026

Reference: native iOS 1.0 (83), commit `feda931be0b8285a9015cdec078e8ddfcd3b8264`.

The released checkout and archive were not edited. A separate copy at `/private/tmp/vylo-website-build83-preview` runs in Xcode / Device Hub on iPhone 17 Pro Max, iOS 26.5. Device Hub saved the original 1320 × 2868 PNGs in `public/product/build83`.

The fixture changes are retained in `capture-fixtures-build83.patch`; `capture-manifest-build83.json` records original image dimensions and hashes.

## Capture preparation

The isolated copy enables the existing signed-in test transport, dark appearance, reports, and net-worth trends. Its test responses were extended with fictional data: populated budget groups, complete finance-trends responses, a growing investment account, two connected banks, and ephemeral category/manual-item creation. A regional response mapper supplies US institutions and merchants for the corresponding captures. Temporary initial tab/scroll/selection state was adjusted to capture the required screens; the product view layouts and design tokens were retained. These changes are capture fixtures, not release-app changes.

The real native forms saved Baby stuff → Diapers, Formula, Clothing; a $28,000 Family Car; and a $12,000 Renovation Loan. Each save was captured. Asset/liability totals progress from $842K to $870K to $858K. Account preparation uses the existing native `DashboardPreparationCompactCard`.

## Website composition

These are cropped native captures with synchronized CSS/WAAPI gestures and transitions, not embedded live SwiftUI. Native field-value overlays demonstrate typing. Review uses the product's review-card geometry, actual picker, fictional regional merchant data, and its green swipe-confirmation treatment. Auto-categorization reuses the approved Activity composition traced to native source. The liability's US bank text is a localized data overlay on the native card; other regional bank/investment images have separate native captures.

The feature flows are:

- Automatic sorting: receipts arrive, become Activity rows, and receive categories.
- Transaction review: three obscure purchases begin Uncategorized; select a category and swipe right for each; finish caught up.
- Smart memory: actual toggle-off and toggle-on captures, followed by category selection.
- Custom categories: create group, then three individual category forms and saved-list captures. The expanded completed group stays visible.
- Reports: open the month and scroll to its budget outcome and comparison.
- Auto-build: setup choice → suggested category amounts → scroll → Apply → populated Budget Health.
- Budget tracking: remaining / projected spending, all four populated groups, Restaurants detail.
- Budget trends: actual-spend chart selection and four-group Spending Mix; no data table is opened.
- Invite members: retained existing native invitation flow.
- Accounts: Add Account → real preparation state → both connected institutions.
- Assets and debts: save a vehicle and personal loan and show the resulting breakdowns.
- Net worth: history → assets / liabilities → accounts → investment balance and growth chart.

Budget fixtures total $3,150: Fixed $2,050, Flexible $760, Non-monthly $300, Digital subscriptions $40. Spending totals $2,867.89, leaving $282.11. Restaurants is $45 over its $100 budget. Charts show fictional historical periods; demo scenes are illustrative scenarios rather than a single shared live account.

## Interaction and verification

Desktop hover/focus plays the selected feature. At widths up to 900px, each question occupies one viewport with native vertical snapping. The document remains the vertical scroller; mandatory snapping applies only while inside the questions, so visitors can scroll freely into and out of the section. On very short screens or with enlarged text, cards can grow to keep all content reachable.

Horizontal swipes page through demos within the current question. Chips select the same panels and scroll into view as selection changes. A newly visible mobile demo starts automatically. Inactive panels are inert; offscreen/background playback pauses. Reduced motion shows each sequence's completed state, including after changing chips.

Authored timelines play at 1.65×; longer multi-step demonstrations retain their intermediate saved states and reading holds. No playback controls were added.

- `npm run build`
- `node scripts/check-feature-demos.mjs`: every referenced capture exists, animation offsets are valid, four saved category states exist, reduced-motion final states, desktop/mobile chip behavior, inactive-panel focus isolation, and question-paging boundaries.
- `node scripts/check-hero-demo.mjs`
- `node scripts/check-hero-playback.mjs`: includes hidden budget progress-column receipt-target regression at intermediate widths.

Browser checks use the local preview: 375×667 and 390×844 phone layouts, an 820×900 narrow window, and the 1200px desktop grid. Vertical forward/backward scrolling, horizontal feature selection, chip taps, automatic playback, selected-chip visibility, and resizing were checked. Work remains on the preview route for user review; no production deployment is performed.

The `/design-direction/` review route now renders the complete homepage through `HomePage.astro`, with the approved hero and `ProductMoments.astro` replacing the earlier visuals. The story, security, pricing, FAQs, App Store badge, and footer remain present. Preview metadata is noindex; the main route retains its existing design until approval.
