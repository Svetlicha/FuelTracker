create table if not exists public.fuel_tracker_snapshots (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.fuel_tracker_snapshots enable row level security;

drop policy if exists fuel_tracker_snapshots_select on public.fuel_tracker_snapshots;
drop policy if exists fuel_tracker_snapshots_insert on public.fuel_tracker_snapshots;
drop policy if exists fuel_tracker_snapshots_update on public.fuel_tracker_snapshots;

create policy fuel_tracker_snapshots_select
on public.fuel_tracker_snapshots
for select
to anon
using (id = 'default');

create policy fuel_tracker_snapshots_insert
on public.fuel_tracker_snapshots
for insert
to anon
with check (id = 'default');

create policy fuel_tracker_snapshots_update
on public.fuel_tracker_snapshots
for update
to anon
using (id = 'default')
with check (id = 'default');

grant select, insert, update on public.fuel_tracker_snapshots to anon;
