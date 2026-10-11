# Cleaning App: legacy pull request safety review

Date: 2026-10-11
Stable starting commit: `817edcf06c8f600773daf492a8ec57fb31786e65`.
Backup branch: `backup/app-main-2026-10-11`.
No old PR should be merged wholesale without rebasing and verifying current product behavior.

## Findings from source comparison

- The stable app already contains an **editable draft quote handoff** from the estimate calculator (`estimate-calculator.js` and `window.TLE_FOLLOWUPS_BRIDGE.openQuoteFromEstimate` in `app.js`). PR #192 must **not** replace it with its older version.
- The stable app treats **Special Spaces** as quote-only (`public.js` and `public-special-space.js`). PR #189 is at least partly superseded; separately test returning from the booking link on iPad.
- The app already has a customer-facing rescheduling experience (`public-manage.js`). PR #78 adds another older change-request mechanism and could create competing customer flows; verify access and approval policy against the live backend before migrating anything.
- PRs #194, #198, #188, #187 and #186 have been observed with GitHub merge conflicts. Even PRs listed as mergeable must be checked for semantic conflicts.
- Older PR branches replace app/cache identifiers and sometimes large sections of `index.html`, `app.js`, `public.js` or `service-worker.js`. Their cache and subscription wording may predate the currently deployed **$3.99/month** app.
- Existing CI runs syntax, npm tests and cross-browser checks, but previously did not explicitly exercise a rendered price estimate **into an editable draft quote** with sample data. The audit branch adds this and a concrete visible More menu assertion. Neither sends a live booking or invoice.
- Passing CI does not prove account isolation, real email delivery, live payment status, availability enforcement or database RLS: these require controlled end-to-end tests with separate test businesses before release.

## All 28 open PRs — safe treatment

| PR | Subject | Disposition | Why / verification |
|---|---|---|---|
| #222 | Mobile workspace stacking | **Hold** | Contains runtime, booking, CSS and service-worker version edits; isolate mobile-only pieces and retest quote routing |
| #204 | Tablet greeting density | **Visual review** | One CSS file; compare at iPad/laptop widths and day/night before adopting |
| #198 | Blank Pricing workspace | **Addressed selectively in audit branch** | Render from cached state immediately, async refresh remains; do not reuse old entire HTML |
| #194 | Blank More screen | **Addressed selectively in audit branch** | Restore drawer display/geometry on mobile only, preserve open/close behavior |
| #192 | Calculator → Quote | **Partially superseded** | Editable draft already exists on main; verify all 4 languages, exact price and quote-edit behavior |
| #191 | Booking Center mobile | **Visual review** | CSS-only; compare current phone cards, add-ons and booking link actions |
| #189 | iPad return + Special Spaces | **Partially superseded** | Special Spaces quote-only already; test touch/iPad return separately |
| #188 | Tablet invoices | **Hold pending comparison** | Conflicts with current invoice reflow in mobile-foundation.css |
| #187 | iPad calendar/jobs sizing | **Visual review** | Conflicts with current responsive CSS; test tablet landscape and portrait |
| #186 | iPad/laptop readability | **Visual review** | Broad !important overrides can mask current theme/scaling |
| #185 | Cache refresh for invoices | **Superseded candidate** | Must not restore older version tokens |
| #183 | Force-refresh app layout | **Superseded candidate** | Boot/index/SW version changes are obsolete |
| #181 | Lead contact compressed | **Visual review** | May overlap newer lead-card CSS |
| #178 | Mobile leads | **Visual review** | Includes older app/boot/index/SW plus mobile CSS; isolate styles |
| #161 | Public Booking Page design | **Visual review** | Public booking/quote parity before adopting UI-only changes |
| #160 | Remove invoice overflow trigger | **Superseded candidate** | Compare against current stable invoices before closing |
| #158 | Remove duplicate invoice button | **Superseded candidate** | Tiny older app deletion; compare DOM against current |
| #157 | Remove invoice overflow control | **Superseded candidate** | Overlaps #158/#160, shared CSS/JS |
| #151 | Sidebar swipe gesture | **Optional improvement** | Gesture can collide with normal page swiping; mobile usability test |
| #149 | Greeting and calendar bento | **Visual review** | Includes older boot/cache scripts and dashboard tests |
| #143 | Welcome translations | **Language review** | Compare EN/ES/FR/HT, copy changes only as needed |
| #142 | Navigation simplify | **Hold** | Replaces current UX/navigation patterns |
| #141 | Estimate rules separation | **Superseded candidate** | New calculator has guided/rules modes |
| #140 | Team access link | **Small candidate** | Verify settings access and role isolation first |
| #131 | Configurable estimator | **Do not merge wholesale** | 26 commits; large stale app/public/estimator changes |
| #97 | Witch/night sky | **Optional, likely obsolete** | Older season/night code and asset caches |
| #94 | Lunar greeting | **Optional, likely obsolete** | Older scripts and app cache versions |
| #78 | Customer rescheduling | **Hold, sensitive** | Conflicting customer change flow; needs real access/availability tests |

## Release gates before resolving each remaining PR

1. Preserve working `main` and the backup ref. Work in a fresh branch on **current main**, with one behavior per PR.
2. Confirm bug with a repeatable test. If the behavior already exists, record the exact equivalent and close *only after review*; do not merge code for bookkeeping.
3. Preserve current PWA cache/version synchronization, four languages, tenant/role isolation, quote-versus-fixed-price semantics and all current billing copy.
4. Run **Cleaning App CI** on the new branch and PR; run Safari iPhone, Safari iPad, Chrome, Firefox and phone/tablet/desktop viewport checks.
5. For critical flows, independently test two isolated businesses with controlled records: create quote, accept/reject/revise, book available slot, owner/admin/worker access, create invoice, reload persistence, follow-up messaging.
6. Merge one focused change only with a green CI and a manual acceptance of its specific behavior. Verify production deployment and repeat the smoke check; revert the focused merge if it regresses.

**This file is an internal engineering review and must not appear in the customer-facing Cleaning App.**
