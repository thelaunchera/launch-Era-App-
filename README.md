# The Launch Era Cleaning App

Private migration/rebuild workspace for the future **The Launch Era Cleaning App**.

## Important
The current production app hosted in Sites remains live and untouched during this build.

## Product direction
Simple daily operations for residential cleaning business owners. The product should feel like a modern operating system for a small cleaning company, not a bloated CRM.

Core workflow:

Lead → Quote → Booking → Client → Job → Invoice

Operational priorities:
- Today dashboard
- Public Booking Center
- Clients
- Calendar + Jobs
- Quotes
- Invoices
- Today's Route
- Mileage
- Time Tracking
- Reports
- Services + Add-ons
- Team
- Settings
- Recurring jobs
- Travel-time blocking

Not in the first migration phase:
- live GPS tracking
- full accounting
- payroll / HR
- heavy inventory
- enterprise complexity

## Current stage
The private GitHub build is now connected to the dedicated Supabase project.

Functional now in the new build:
- Email/password authentication
- First-login business workspace setup
- 30-day trial dates stored at workspace creation
- Tenant-isolated Clients CRUD
- Services create/edit/activate/deactivate
- Jobs create/edit/cancel
- Quotes create/edit/status flow
- Quote acceptance transaction: accepted quote → client → calendar job → draft invoice
- Real Supabase RLS policies on business data

Still intentionally not cut over:
- The current Sites production app remains untouched.
- Production customer migration has not started.
- Billing is not connected to this replacement yet.
- Public booking and automations come after the core owner workflow passes QA.

## Safety
Do not point production traffic or app.thelaunchera.com here until authentication, tenant isolation, booking, quote, invoice, migration, emails and billing have all passed QA.
