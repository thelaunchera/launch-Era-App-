# The Launch Era Cleaning App — Product Blueprint

## Product direction
A mobile-first operations app for residential cleaning business owners. The goal is not to become a bloated CRM. The daily path should be obvious.

## Core workflow
Lead → Quote → Booking → Client → Job → Invoice

## Operational layer
Route + Mileage → Time Tracking → Reports → Team → Recurring Jobs

## Screen priorities

### 1. Today / Dashboard
- Today's jobs
- This week's booked revenue
- Open quotes
- Unpaid/overdue invoices
- New leads/booking requests
- Today's ordered route with travel time
- Quick actions

### 2. Booking Center
- Public booking link
- Public quote-request link
- Services and add-ons
- Duration per service
- Availability
- Travel buffer
- Minimum notice
- Payment methods
- Preferred contact method
- Booking/quote routing

Rules:
- Never show occupied slots.
- Quote Request goes to Quotes first.
- Public customers do not need an account.
- Email is required. Text/WhatsApp also require phone.

### 3. Leads
New → Contacted → Quoted → Booked / Lost

### 4. Clients
Contact details, service address, contact method, preferences, access notes, job history, quotes, invoices and balance.

### 5. Quotes
1. Request arrives in Quotes.
2. Owner edits/sends.
3. Client accepts.
4. Create/update Client.
5. Create Calendar Job.
6. Prepare Invoice.

### 6. Calendar & Jobs
One-time jobs, recurring jobs, team assignment, expected duration, travel-time block, status and notes/checklist.

### 7. Route & Mileage
Ordered stops, address, scheduled time, duration, travel time, miles per leg, daily mileage total and manual fallback.

### 8. Time Tracking
Clock in/out per job, per employee, job hours and weekly team hours.

### 9. Reports
Revenue, completed jobs, mileage, work hours and outstanding invoices.

### 10. Team
Team members, availability, assignments and work hours.

## Deliberately not in V1
- Live GPS tracking
- Full accounting
- Payroll/HR
- Heavy inventory
- Enterprise dispatch complexity
- Card-payment integrations (Cash, Check and Zelle only for now)

## Brand
- Warm Ivory #FAF8F3
- Butter Yellow #F2D85B
- Soft Black #191919
- Charcoal
- Light Soft Blue
- Prompt headings
- Contemporary SaaS/editorial feel
- No gradients
- No glassmorphism
- No generic admin-template aesthetic

## Migration rule
The current Sites app stays live until the replacement passes data, auth, booking, quote, invoice and tenant-isolation QA.
