# The Launch Era Cleaning App — Migration-Friendly Data Model

This document defines the target relational model. It is intentionally backend-agnostic so production data can be imported later.

## Shared rules
Every business-owned record must include:
- id: stable UUID
- business_id: owning cleaning business
- created_at
- updated_at

Never rely on email alone as the permanent primary key.

## businesses
- id
- name
- owner_user_id
- email
- phone
- timezone
- default_language
- service_area
- preferred_contact_method
- trial_started_at
- trial_ends_at
- subscription_status
- subscription_customer_id
- booking_slug
- public_booking_enabled
- public_quote_enabled
- travel_buffer_minutes
- minimum_booking_notice_hours

## users
- id
- business_id
- email
- display_name
- role: owner | admin | cleaner
- active
- preferred_language
- created_at
- updated_at

Authentication secrets/password hashes should remain inside the chosen auth provider and should not be exported into application tables.

## services
- id
- business_id
- name
- description
- pricing_type: fixed | starting_at | hourly | quote_required
- base_price
- expected_duration_minutes
- booking_enabled
- active

## service_addons
- id
- business_id
- service_id
- name
- price
- duration_minutes
- active

## availability_rules
- id
- business_id
- day_of_week
- start_time
- end_time
- active

## leads
- id
- business_id
- name
- email
- phone
- source
- service_interest
- preferred_contact_method
- status
- notes
- last_contacted_at
- next_follow_up_at

## clients
- id
- business_id
- lead_id nullable
- name
- email
- phone
- service_address
- preferred_contact_method
- access_notes
- service_notes
- active

## quote_requests
- id
- business_id
- lead_id nullable
- client_id nullable
- service_id nullable
- requested_date
- address
- notes
- status

## quotes
- id
- business_id
- quote_request_id nullable
- lead_id nullable
- client_id nullable
- quote_number
- status
- subtotal
- total
- sent_at
- accepted_at
- declined_at
- expires_at
- notes

## quote_items
- id
- business_id
- quote_id
- service_id nullable
- description
- quantity
- unit_price
- total

## booking_requests
- id
- business_id
- lead_id nullable
- service_id
- requested_start_at
- address
- preferred_contact_method
- email
- phone nullable
- status: requested | approved | declined | converted
- notes

## jobs
- id
- business_id
- client_id
- quote_id nullable
- booking_request_id nullable
- service_id
- scheduled_start_at
- scheduled_end_at
- expected_duration_minutes
- address
- status: scheduled | en_route | in_progress | completed | canceled
- route_order nullable
- assigned_user_id nullable
- recurring_series_id nullable
- notes

## recurring_series
- id
- business_id
- client_id
- service_id
- recurrence_type
- recurrence_interval
- weekday nullable
- start_date
- active
- default_start_time
- expected_duration_minutes
- assigned_user_id nullable

## invoices
- id
- business_id
- client_id
- job_id nullable
- quote_id nullable
- invoice_number
- status: draft | sent | paid | overdue | canceled
- subtotal
- total
- payment_method: cash | check | zelle
- sent_at
- due_at
- paid_at

## invoice_items
- id
- business_id
- invoice_id
- description
- quantity
- unit_price
- total

## route_legs
- id
- business_id
- service_date
- from_job_id nullable
- to_job_id
- order_index
- estimated_minutes
- estimated_miles
- actual_miles nullable

## mileage_entries
- id
- business_id
- user_id nullable
- job_id nullable
- date
- origin
- destination
- miles
- classification: business | personal
- source: manual | calculated

## time_entries
- id
- business_id
- user_id
- job_id
- started_at
- ended_at nullable
- break_minutes
- status: running | paused | completed

## team_assignments
- id
- business_id
- job_id
- user_id
- role
- status

## payment_settings
- id
- business_id
- cash_enabled
- check_enabled
- check_payable_to nullable
- zelle_enabled
- zelle_instructions nullable

## audit_log
Later phase:
- id
- business_id
- user_id
- action
- entity_type
- entity_id
- created_at

## Migration mapping requirement
Before importing old Sites data, create a mapping sheet:
legacy_record_type | legacy_id | new_table | new_id | imported_at | notes

Never delete the Sites production data during the first import.
