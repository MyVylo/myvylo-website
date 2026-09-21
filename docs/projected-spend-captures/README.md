# September 2026 Projected Spend captures

Generated from the integrated native iOS candidate `release-20260921-evening-ios` on September 21, 2026. `source-sha256.json` identifies the original component versions. The real `HomeView`, `SpendView`, `BudgetHealthSummaryCard`, and `BudgetProjectionSheet` render the screenshots. No app layout, text, color, or type treatment was recreated in HTML.

`capture-fixtures.patch` applies only to an isolated copy of the iOS checkout. It seeds fictional CA/CAD and US/USD data, supplies the projection model, sets the initial disclosure state, and adds an XCTest image export. It does not modify the release checkout or connect to a real bank. The surrounding shell uses the same backdrop, toolbar, native tabs, and primary button composition as `MainTabView`. These are native view captures; the operating system status bar is outside the captured view.

Reproduce by applying the patch to a matching copy, then running `VyloAppTests/PlaceholderTests/testWebsiteProductCaptures` with xcodebuild on an iPhone simulator. Export the result bundle with `xcrun xcresulttool export attachments`. Attachment names map to `public/product/projected-spend/{ca,us}/<name>.png`. Home/Budget exports are 1242×2688; the expanded breakdown is 1242×3000. No screenshot pixels are retouched.

## Demo figures

The main walkthrough uses a September 21 date: $3,150 budget, $2,200 posted spending, $300 upcoming recurring costs, $680 remaining flexible pace, nine days remaining. Forecast = $3,180 ($30 over); daily limit = floor(($3,150 − $2,200 − $300) / 9) = $72. Ignoring a $90 Internet cost changes the forecast to $3,090 ($60 under), and the daily limit to $82. Left to spend stays $950. Ignore changes the forecast only.

The existing Budget tracking / Auto-build examples retain their original ledger and category captures. Their replacement health card uses those same $2,867.89 actual / $3,150 budget figures, with a $3,000 forecast and $20 daily limit. It is a separate demo from the new Projected Spend walkthrough.

## Refresh audit

- New Projected Spend chip: native Budget Health → breakdown → expanded recurring costs → Ignore Internet → updated forecast → updated daily limit. Uses the existing tap/swipe compositor and lifecycle (pause offscreen, completed state for reduced motion).
- Budget tracking, Auto-build result, Budget trends opening: old native health card replaced; existing category/trend surfaces remain unchanged.
- Help: fresh native Home/Budget captures and re-aligned callouts in eight existing articles; four illustrated steps in the expanded Projected Spend article.
- Hero: currently uses native Activity plus actual web Budget / Net Worth components. Those web surfaces do not contain this iOS-only Home redesign, so they remain faithful to the web product. No imitation of the new iPhone feature was inserted into web screenshots.
- CA/US selection: existing country choice plus local `?market=CA` / `?market=US` overrides apply to new captures and full-size Help links.

Release approved by the user on September 21, 2026 after preview review. The homepage FAQ accordion entry was removed at their request; the detailed Help article and walkthrough remain.
