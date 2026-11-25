-- ─────────────────────────────────────────────────────────────
--  Phase A schema: accounts, products, subscriptions, activations,
--  and a licence-event audit log.
--
--  Run this once in Supabase → SQL Editor → New query.
--  Row Level Security is ON everywhere: a signed-in user can read
--  ONLY their own rows, and can never grant themselves a licence.
--  Writes that create/extend subscriptions happen server-side
--  (Edge Function, service_role) in Phase B — not from the browser.
-- ─────────────────────────────────────────────────────────────

-- 1. PROFILES ----------------------------------------------------
-- One row per auth user, auto-created on sign-up via a trigger.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Create a profile automatically when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. PRODUCTS ----------------------------------------------------
-- Catalogue mirror (slug matches src/data/products.js). Public read.
create table if not exists public.products (
  slug        text primary key,
  name        text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products are public" on public.products;
create policy "products are public" on public.products
  for select to anon, authenticated using (true);

-- 3. SUBSCRIPTIONS ----------------------------------------------
create table if not exists public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  product_slug        text not null references public.products(slug),
  status              text not null default 'trialing'
                      check (status in ('trialing','active','past_due','canceled','expired')),
  plan                text,                 -- e.g. 'monthly'
  provider            text,                 -- 'paddle' | 'lemonsqueezy'
  provider_sub_id     text,                 -- id in the payment provider
  manage_url          text,                 -- customer billing portal link
  current_period_end  timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists subscriptions_user_idx on public.subscriptions(user_id);
create unique index if not exists subscriptions_provider_idx
  on public.subscriptions(provider, provider_sub_id)
  where provider_sub_id is not null;

alter table public.subscriptions enable row level security;

-- Users may READ their own subscriptions. No insert/update/delete
-- policy exists, so the browser can never fake or change a licence;
-- the Phase B webhook writes with the service_role key (bypasses RLS).
drop policy if exists "read own subscriptions" on public.subscriptions;
create policy "read own subscriptions" on public.subscriptions
  for select to authenticated using (auth.uid() = user_id);

-- 4. ACTIVATIONS (devices) --------------------------------------
create table if not exists public.activations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  product_slug   text not null references public.products(slug),
  device_id      text not null,            -- stable machine fingerprint
  device_name    text,
  active         boolean not null default true,
  activated_at   timestamptz not null default now(),
  last_seen_at   timestamptz
);

create index if not exists activations_user_idx on public.activations(user_id);
create unique index if not exists activations_unique_device
  on public.activations(user_id, product_slug, device_id);

alter table public.activations enable row level security;

drop policy if exists "read own activations" on public.activations;
create policy "read own activations" on public.activations
  for select to authenticated using (auth.uid() = user_id);

-- Users may deactivate their own devices (set active=false) to free a slot.
-- They cannot reactivate or change anything else — that's the tool's job
-- via the verify service. Enforced by the WITH CHECK below.
drop policy if exists "deactivate own device" on public.activations;
create policy "deactivate own device" on public.activations
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and active = false);

-- 5. LICENCE EVENTS (audit log) ---------------------------------
create table if not exists public.license_events (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users(id) on delete set null,
  product_slug  text,
  type          text not null,  -- 'subscribe','renew','cancel','activate','deactivate','verify','expire'
  detail        jsonb,
  created_at    timestamptz not null default now()
);

alter table public.license_events enable row level security;

drop policy if exists "read own events" on public.license_events;
create policy "read own events" on public.license_events
  for select to authenticated using (auth.uid() = user_id);
-- Only server-side (service_role) inserts events.

-- 6. SEED PRODUCTS ----------------------------------------------
-- Keep this list in step with src/data/products.js.
insert into public.products (slug, name) values
  ('example-tool', 'Example Tool')
on conflict (slug) do nothing;
