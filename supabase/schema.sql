create table if not exists public.hub_items (
  id text primary key,
  title text not null,
  description text not null,
  kind text not null check (kind in ('攻略','工具')),
  status text not null check (status in ('已完成','规划中')),
  href text not null,
  icon text not null check (icon in ('Flower2','Car','Calculator')),
  order_index integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hub_items enable row level security;

drop policy if exists "public read" on public.hub_items;
create policy "public read" on public.hub_items
for select
to anon
using (true);

