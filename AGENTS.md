# The Launch Era Cleaning App — Mandatory QA Instructions

Read the canonical The Launch Era QA skill **before editing or deploying**:
- https://github.com/thelaunchera/the-launch-era-new-website-/blob/main/skills/the-launch-era-qa/SKILL.md
- https://github.com/thelaunchera/the-launch-era-new-website-/blob/main/skills/the-launch-era-qa/ROUTE_MAP.md
- https://github.com/thelaunchera/the-launch-era-new-website-/blob/main/skills/the-launch-era-qa/INCIDENT_LOG.md

This repository is the Cleaning App / PWA, served at \`https://app.thelaunchera.com/\`; it is NOT the main marketing site or Command Center. Sources include \`index.html\`, \`app.js\`, \`public.js\`, \`auth-storage.js\`, \`booking-price-review.js\`, \`service-worker.js\`, i18n modules and owner/admin/worker views.

MANDATORY release tests: sign-in/reset/logout, tenant separation, every sidebar item on Home/Calendar/Clients/Quotes/Invoices/Jobs/Follow-ups/Settings, all Back and Refresh controls; create/edit/save inert test invoices/quotes/jobs only in staging; booking and cancellation approvals; worker private access; PWA cached-state and update; all 4 supported app languages; responsive widths 360/390/820/1024/1440. No disappearing sidebar, browser-history blank screen, 404, unhandled loading state, clipped buttons or wrong pricing/branding. Never test against real client/end-customer data. Do not replace business-selected payment methods with Stripe.

When app linking changes, audit all entrypoints from \`thelaunchera.com\` and its \`/command-center/\`, test the destination page and session preservation, and update the canonical ROUTE_MAP/INCIDENT_LOG. Do not claim functionality is fixed without deployed/browser verification.
