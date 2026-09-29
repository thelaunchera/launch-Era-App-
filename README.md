# The Launch Era Cleaning App

Production PWA for cleaning-business operations, hosted on GitHub Pages and backed by the dedicated Supabase project.

## Current production scope

The app supports the active owner/admin/worker workflow:

- Owner / Admin / Worker access
- Clients, leads, quotes, invoices and jobs
- Public Booking Page and Request a Quote flow
- Real availability checks for bookings and quotes
- One-time and recurring jobs
- Calendar, route, mileage and time tracking
- Services and add-ons
- Customer payment method tracking: Cash, Zelle, Check and custom Other
- Quote/invoice customer-view tracking
- Transactional email flow and delivery-failure alerts
- Follow-up queue and editable multilingual follow-up messages
- EN / ES / FR / Haitian Creole UI and customer communications
- PWA install / service worker support
- Responsive phone, tablet and desktop layouts

## Runtime architecture

- Frontend: GitHub Pages PWA
- Backend/data/auth: Supabase
- Transactional email: Supabase → Make → Resend
- Public app domain: app.thelaunchera.com

No Stripe/card payment flow is part of the Cleaning App. Customers select a payment method and the cleaning business confirms payment after receipt.

## Core workflow

Lead → Quote or Booking Request → Client → Job → Invoice → Payment → Follow-up

Quote-only services and variable-price work stay in the quote flow. Fixed-price services can use direct booking when a real available slot is selected.

## Languages

The supported app/customer languages are:

- English
- Spanish
- French
- Haitian Creole

Do not reintroduce Portuguese as an active language without an explicit product decision and full translation QA.

## Release safety

Every push to `main` runs:

- JavaScript syntax checks
- Production dependency audit
- Frontend secret-pattern scan
- Local Supabase bundle check
- Repository health guardrails
- Functional smoke tests
- Browser smoke tests
- Cross-browser Playwright checks for Safari/WebKit, Chrome/Chromium and Firefox

`repo-health.mjs` also protects release-version synchronization, the version-agnostic PWA start URL, the supported language set, sensitive service-worker cache rules, and file-size growth limits.

## Maintenance rule

Avoid adding new “final override” CSS blocks for a component that already has multiple responsive overrides. Consolidate the component instead.

Large-file guardrails currently exist because `app.js`, `styles.css`, and `i18n.js` have accumulated substantial product history. New work should move toward feature modules rather than continuing to grow those files.

## Source of truth

Runtime code and the live Supabase schema are the source of truth for current behavior. `PRODUCT_BLUEPRINT.md` and `DATA_MODEL.md` are architecture/reference documents and may describe earlier design stages unless explicitly updated.

`demo.html` is a noindex visual/demo fixture only. It is not the production UI and must not be used as a behavioral source of truth.

## Current QA priorities

1. Keep CI green before considering a release stable.
2. Test phone, tablet and desktop after responsive changes.
3. Keep public booking/quote availability validated in both UI and backend.
4. Keep all customer-facing flows localized consistently.
5. Refactor CSS/JS incrementally, without behavior changes, behind passing smoke tests.
