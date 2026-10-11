# Read-only two-business staging verification

This is a **developer-only QA script**, not customer-facing website copy. Use two dedicated test owner accounts, two distinct staging businesses and a **separate Supabase staging project**. Never use real customer credentials or run against the production database.

## Preparation
- Create a separate Supabase **staging** project/environment. Copy the current database schema, migrations, RLS functions and policies; do not copy client PII or production secrets.
- Create two independent test owners: A and B, each with one dedicated business. Give each business **at least one** synthetic row in `clients`, `jobs`, `quotes`, `invoices` and `services`.
- Configure environment variables in a trusted local terminal or GitHub staging-only secrets. **Never commit credentials.**

```sh
TLE_QA_NON_PRODUCTION=CONFIRMED_STAGING
TLE_QA_SUPABASE_URL=https://<staging-ref>.supabase.co
TLE_QA_ANON_KEY=<staging-anon-key>
TLE_QA_OWNER_A_EMAIL=<staging-a-email>
TLE_QA_OWNER_A_PASSWORD=<staging-a-password>
TLE_QA_BUSINESS_A_ID=<staging-a-business-uuid>
TLE_QA_OWNER_B_EMAIL=<staging-b-email>
TLE_QA_OWNER_B_PASSWORD=<staging-b-password>
TLE_QA_BUSINESS_B_ID=<staging-b-business-uuid>
npm run test:tenant-isolation:staging
```

All queries are read-only. The script rejects the known production project URL, rejects identical users/businesses and **fails rather than skipping** missing test fixtures. It checks owner A and B in both directions. A failing access rule or a missing fixture blocks release.

**Scope limitations:** This does **not** establish full E2E safety for owner/admin/worker permissions, quote acceptance, booking availability, invoice persistence, payment links or operational emails. After this first gate, complete those checks separately with staging account roles and controlled test events. Do not use production data or turn on real billing/email delivery for QA.

No recurring action is scheduled, and this test is intentionally not run in ordinary CI without staging credentials.
