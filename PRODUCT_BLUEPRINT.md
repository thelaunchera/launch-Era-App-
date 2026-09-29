> **Status note — 2026-09-29:** This document is architectural/reference material, not the live product specification. The production runtime and live Supabase schema are the source of truth. Current production includes GitHub Pages PWA hosting, EN/ES/FR/Haitian Creole, public booking + quote availability validation, invoices/payment-method selection, follow-ups, worker access, and transactional email flows.

# The Launch Era Cleaning App — Product Blueprint

## Product promise
One simple operating system for residential cleaning business owners: know who needs attention, where the team is going, what is booked, what is owed, and what happens next.

## Core workflow
Lead → Quote → Booking → Client → Job → Invoice

### Quote rule
A quote request stays in **Quotes**. It must not create a booked job immediately.

When a quote is accepted:
1. create/update Client,
2. create Calendar Job,
3. create/prepare Invoice,
4. keep the original quote linked for history.

## Primary navigation

### 1. Today
Purpose: answer “what needs my attention right now?”
- Today’s jobs
- Weekly revenue
- Open quotes
- Unpaid invoices
- New booking requests
- Today’s schedule
- Travel buffers
- Quick actions
- Attention queue

### 2. Booking Center
Purpose: make customer acquisition and scheduling self-service without forcing customers to create an account.
- Public booking URL
- Public quote request URL
- Copy-link controls
- Services visible online
- Add-ons
- Service duration
- Real availability only
- Travel-time buffer
- Minimum booking notice
- Service area
- Preferred contact: Email / Text / WhatsApp
- Email always required
- Text / WhatsApp also require phone
- Payment methods: Cash / Check / Zelle
- Booking requests and quote requests stay distinct

### 3. Leads
- New
- Contacted
- Qualified
- Quoted
- Booked
- Lost
- Source
- Service interest
- Next action
- Last contacted
- Follow-up date

### 4. Clients
- Contact details
- Service address
- Access notes
- Service preferences
- History
- Jobs
- Quotes
- Invoices
- Preferred contact
- Recurring schedule if applicable

### 5. Calendar + Jobs
- One-time jobs
- Recurring jobs
- Duration
- Team assignment
- Travel buffer
- Job status
- Service notes
- Client address
- Reschedule / cancel
- No double booking

### 6. Quotes
Statuses:
- Requested
- Draft
- Sent
- Accepted
- Declined
- Expired

Accepted quote workflow:
Quote accepted → Client → Job → Invoice.

### 7. Invoices
Statuses:
- Draft
- Sent
- Paid
- Overdue
- Canceled

Payment-method tracking:
- Cash on Spot
- Zelle
- Check
- Other (customer can type a custom offline payment method)

Do not add card-payment or Stripe integrations. The customer selects an offline payment method and the cleaning business confirms payment after it is actually received.

## Cleaning-operations layer

### Today’s Route
A daily ordered list of jobs with:
- route order
- client
- address
- start time
- expected duration
- travel minutes
- estimated miles
- assigned cleaner/team
- job status

The production app includes route/GPS handoff and route guidance. Keep routing optional and non-blocking so core scheduling still works if map/traffic data is unavailable.

### Mileage
Phase 1:
- manual starting/ending mileage or per-drive mileage
- job linkage
- business/personal classification
- daily / weekly / monthly totals

Phase 2:
- calculate mileage between job addresses automatically.

### Time Tracking
- clock in / pause / finish
- job
- team member
- actual duration
- planned duration
- weekly hours

### Recurring Jobs
Support:
- weekly
- every 2 weeks
- every 4 weeks
- monthly
- custom future pattern later

Recurring schedules should generate future jobs without creating duplicate clients.

### Reports
Keep reports simple:
- revenue
- completed jobs
- outstanding invoices
- miles
- work hours
- average job duration
- recurring vs one-time jobs

### Team
- Owner / Admin / Worker
- active/inactive
- job assignment
- schedule
- time entries
- worker guest/private access limited to assigned work

Do not build payroll/HR in the first migration.

## Services + Add-ons
Each service needs:
- name
- active/inactive
- pricing type
- base price or quote-required flag
- expected duration
- online-booking enabled
- description
- add-ons
- optional add-on duration
- optional add-on price

## Settings
- business name
- owner name
- business email
- phone
- service area
- timezone
- language
- preferred contact
- business hours
- booking availability
- travel buffer
- booking notice
- payment methods
- brand logo/colors later

## Auth
Current direction:
- email + password for Owner/Admin
- password reset
- account isolation by business
- Owner/Admin session persistence with inactivity protection
- Worker private/guest access limited to assigned jobs
- remember username only; never store a password in app fields

## Billing
One product plan:
- first 30 days free
- no card required to start
- then $5.99/month
- full feature access during trial

The production app already uses this trial/subscription model. Keep subscription state separate from customer invoice/payment tracking.

## Explicitly out of scope for the current product
- payroll
- HR
- full accounting
- tax filing
- complex inventory
- enterprise permissions
- large-team dispatch system
- marketplace behavior

## UX rule
The app should feel useful in under 10 seconds:
1. What is happening today?
2. What needs attention?
3. What is the next action?
4. How do I get to it in one tap?


## Workspace roles

### Owner
Owner-only controls:
- Owner Admin
- subscription / billing
- workspace ownership
- teammate access + permission changes
- integrations / credentials
- migration + security controls
- Owner Reports and business-level financial summaries

Operational access:
- everything in the app

### Admin
Can operate the business day to day:
- Booking Center
- Leads
- Clients
- Calendar + Jobs
- Quotes
- Invoices
- Services + Add-ons
- Team operations
- Settings

Cannot access Owner Admin, subscription ownership, permission management, integration credentials or migration/security controls.

### Worker
Needs only what is required to perform assigned work:
- Today
- assigned Calendar + Jobs
- Today’s Route
- Mileage related to assigned jobs
- Time Tracking
- necessary client/job details for assigned jobs

Cannot access:
- all-clients directory
- Leads
- Quotes
- Invoices
- Services pricing
- team permission management
- Owner Reports
- billing
- integrations
- security/migration settings

### Sharing flow
Owner creates access for **Admin** or **Worker** according to the active sharing flow.
The invite token is tied to that email, expires after 14 days, and is claimed only after that email signs in.
