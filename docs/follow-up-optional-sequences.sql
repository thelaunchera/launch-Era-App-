-- Owner-opt-in staged follow-ups, isolated by cleaning-business tenant.
-- Existing first-email rules and hourly job remain untouched.
create table if not exists public.follow_up_sequence_rules (
 business_id uuid not null references public.businesses(id) on delete cascade,
 follow_up_type text not null check (follow_up_type in ('lead','quote','invoice','review','rebook')),
 stage smallint not null check (stage in (2,3)),
 delay_days integer not null default 4 check (delay_days between 1 and 30),
 enabled boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 primary key (business_id,follow_up_type,stage)
);
alter table public.follow_up_sequence_rules enable row level security;
revoke all on public.follow_up_sequence_rules from public,anon,authenticated;
grant select,insert,update on public.follow_up_sequence_rules to service_role;

create table if not exists public.follow_up_sequence_audit (
 business_id uuid not null references public.businesses(id) on delete cascade,
 follow_up_type text not null,
 resource_id uuid not null,
 stage smallint not null check (stage in (2,3)),
 outbox_id uuid not null references public.follow_up_email_outbox(id) on delete restrict,
 queued_at timestamptz not null default now(),
 primary key (business_id,follow_up_type,resource_id,stage)
);
alter table public.follow_up_sequence_audit enable row level security;
revoke all on public.follow_up_sequence_audit from public,anon,authenticated;
grant select,insert on public.follow_up_sequence_audit to service_role;
create index if not exists follow_up_sequence_audit_latest_idx on public.follow_up_sequence_audit(business_id,queued_at desc);

create or replace function public.get_follow_up_sequence_rules(p_business_id uuid)
returns table(follow_up_type text,stage smallint,delay_days integer,enabled boolean)
language plpgsql stable security definer set search_path=public as $$
begin
 if not public.is_business_admin(p_business_id) then raise exception 'Access denied'; end if;
 return query select r.follow_up_type,r.stage,r.delay_days,r.enabled
 from public.follow_up_sequence_rules r where r.business_id=p_business_id
 order by r.follow_up_type,r.stage;
end
$$;
revoke all on function public.get_follow_up_sequence_rules(uuid) from public,anon;
grant execute on function public.get_follow_up_sequence_rules(uuid) to authenticated,service_role;

create or replace function public.save_follow_up_sequence_rule(
 p_business_id uuid,p_follow_up_type text,p_stage integer,p_delay_days integer,p_enabled boolean
) returns void
language plpgsql security definer set search_path=public as $$
begin
 if not public.is_business_admin(p_business_id) then raise exception 'Access denied'; end if;
 if p_follow_up_type is null or p_follow_up_type not in ('lead','quote','invoice','review','rebook')
 then raise exception 'Unknown follow-up type'; end if;
 if p_stage is null or p_stage not in (2,3) then raise exception 'Invalid stage'; end if;
 if p_delay_days is null or p_delay_days < 1 or p_delay_days > 30 then raise exception 'Delay must be 1–30 days'; end if;
 if p_enabled is null then raise exception 'Enabled must be specified'; end if;
 -- An enabled extra stage is inert unless the original category is in Auto email mode.
 -- Do not silently turn on the first stage.
 insert into public.follow_up_sequence_rules(business_id,follow_up_type,stage,delay_days,enabled,updated_at)
 values(p_business_id,p_follow_up_type,p_stage::smallint,p_delay_days,p_enabled,now())
 on conflict (business_id,follow_up_type,stage) do update set
 delay_days=excluded.delay_days,enabled=excluded.enabled,updated_at=now();
end
$$;
revoke all on function public.save_follow_up_sequence_rule(uuid,text,integer,integer,boolean) from public,anon;
grant execute on function public.save_follow_up_sequence_rule(uuid,text,integer,integer,boolean) to authenticated,service_role;

-- Runs separately from the existing first-follow-up worker.
-- Eligibility and stage progression are both re-checked before each send.
create or replace function public.process_follow_up_sequences()
returns integer language plpgsql security definer set search_path=public as $$
declare
 r record;
 outcome jsonb;
 sent integer:=0;
begin
 for r in
  select rules.business_id,rules.follow_up_type,rules.stage,
         states.resource_id,states.sent_count,states.last_sent_at
  from public.follow_up_sequence_rules rules
  join public.follow_up_settings prefs on prefs.business_id=rules.business_id
  join public.follow_up_states states
   on states.business_id=rules.business_id and states.follow_up_type=rules.follow_up_type
  where rules.enabled=true
   and states.status='active'
   and states.sent_count=rules.stage-1
   and states.last_sent_at is not null
   and states.last_sent_at<=now()-make_interval(days=>rules.delay_days)
   and states.last_sent_at>=now()-interval '60 days'
   and (states.snoozed_until is null or states.snoozed_until<=now())
   and case rules.follow_up_type
    when 'lead' then prefs.lead_mode='auto'
    when 'quote' then prefs.quote_mode='auto'
    when 'invoice' then prefs.invoice_mode='auto'
    when 'review' then prefs.review_mode='auto'
    when 'rebook' then prefs.rebook_mode='auto'
    else false end
   and not exists (
    select 1 from public.follow_up_sequence_audit a
    where a.business_id=rules.business_id and a.follow_up_type=rules.follow_up_type
      and a.resource_id=states.resource_id and a.stage=rules.stage
   )
   and case rules.follow_up_type
    when 'lead' then exists (
     select 1 from public.leads l where l.id=states.resource_id
      and l.business_id=rules.business_id
      and l.archived_at is null and l.status in ('new','contacted','qualified')
      and nullif(trim(coalesce(l.email,'')),'') is not null
    )
    when 'quote' then exists (
     select 1 from public.quotes q where q.id=states.resource_id
      and q.business_id=rules.business_id and q.status='sent'
      and nullif(trim(coalesce(q.customer_email,'')),'') is not null
    )
    when 'invoice' then exists (
     select 1 from public.invoices i
      join public.clients c on c.id=i.client_id
      where i.id=states.resource_id and i.business_id=rules.business_id
       and i.status not in ('paid','void')
       and nullif(trim(coalesce(c.email,'')),'') is not null
    )
    when 'review' then exists (
     select 1 from public.jobs j join public.clients c on c.id=j.client_id
      join public.businesses b on b.id=j.business_id
      where j.id=states.resource_id and j.business_id=rules.business_id
       and j.status='completed'
       and nullif(trim(coalesce(c.email,'')),'') is not null
       and nullif(trim(coalesce(b.google_review_url,'')),'') is not null
    )
    when 'rebook' then exists (
     select 1 from public.jobs j join public.clients c on c.id=j.client_id
      where j.id=states.resource_id and j.business_id=rules.business_id
       and j.status='completed' and nullif(trim(coalesce(c.email,'')),'') is not null
       and not exists (
        select 1 from public.jobs future
        where future.business_id=j.business_id and future.client_id=j.client_id
         and future.status not in ('completed','canceled','no_show')
         and future.starts_at>now()
       )
    )
    else false end
  order by states.last_sent_at
  limit 40
 loop
  begin
   -- Existing sender performs tenant/status validation and advisory locking.
   outcome:=public.send_follow_up_internal(r.business_id,r.follow_up_type,r.resource_id);
   if outcome->>'sent'='true' then
    insert into public.follow_up_sequence_audit(
     business_id,follow_up_type,resource_id,stage,outbox_id
    ) values (
     r.business_id,r.follow_up_type,r.resource_id,r.stage,(outcome->>'outbox_id')::uuid
    ) on conflict do nothing;
    sent:=sent+1;
   end if;
  exception when others then
   raise warning 'Optional follow-up sequence stage failed for type % stage %',r.follow_up_type,r.stage;
  end;
 end loop;
 return sent;
end
$$;
revoke all on function public.process_follow_up_sequences() from public,anon,authenticated;
grant execute on function public.process_follow_up_sequences() to service_role,postgres;
select cron.schedule('cleaning-app-optional-followup-stages-hourly','27 * * * *','select public.process_follow_up_sequences();');
