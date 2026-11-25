-- ─────────────────────────────────────────────────────────────
--  008: No-card trial, licence keys, multi-tool subscriptions
--
--  • Every account gets a 14-day trial of ALL tools on sign-up
--    (no card, tracked here, not in Stripe).
--  • Every account gets ONE licence key for life. Customers type it
--    into the Revit tools once per PC.
--  • One Stripe subscription can now cover several tools (cart
--    checkout), so subscriptions are unique per (subscription, tool).
--
--  Run once in Supabase → SQL Editor → New query.
-- ─────────────────────────────────────────────────────────────

-- 1. LICENCE KEY GENERATOR ------------------------------------
-- Format ABH-XXXX-XXXX-XXXX-XXXX, from a 32-character alphabet without
-- look-alikes (no 0/O, 1/I). Uses cryptographic random bytes: the key
-- is a credential, so it must not be guessable.
create or replace function public.generate_licence_key()
returns text
language plpgsql
volatile
set search_path = public, extensions
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  bytes bytea := extensions.gen_random_bytes(16);
  k text := 'ABH';
begin
  for i in 0..15 loop
    if i % 4 = 0 then k := k || '-'; end if;
    k := k || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
  end loop;
  return k;
end;
$$;

-- 2. PROFILES: trial end + licence key -------------------------
alter table public.profiles
  add column if not exists trial_ends_at timestamptz,
  add column if not exists licence_key   text;

-- Backfill accounts that already exist.
update public.profiles
   set trial_ends_at = coalesce(trial_ends_at, now() + interval '14 days'),
       licence_key   = coalesce(licence_key, public.generate_licence_key());

alter table public.profiles
  alter column trial_ends_at set default (now() + interval '14 days'),
  alter column licence_key   set default public.generate_licence_key(),
  alter column licence_key   set not null;

alter table public.profiles drop constraint if exists profiles_licence_key_unique;
alter table public.profiles add constraint profiles_licence_key_unique unique (licence_key);

-- Sign-up trigger: rely on the column defaults for trial + key.
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

-- SECURITY: users could previously UPDATE their whole profile row,
-- which would let them extend their own trial. Now they may only
-- change their name. Trial and key are server-side only.
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Edge Functions (service_role) read profiles for trial / key checks.
grant select on public.profiles to service_role;

-- 3. SUBSCRIPTIONS: one row per (Stripe subscription, tool) ------
alter table public.subscriptions
  drop constraint if exists subscriptions_provider_sub_unique;
alter table public.subscriptions
  drop constraint if exists subscriptions_provider_sub_product_unique;
alter table public.subscriptions
  add constraint subscriptions_provider_sub_product_unique
  unique (provider, provider_sub_id, product_slug);

-- Whether the customer has turned off auto-renew (shown on My Account).
alter table public.subscriptions
  add column if not exists cancel_at_period_end boolean not null default false;

-- 4. DEVICES belong to the licence key, not to one tool ----------
alter table public.activations alter column product_slug drop not null;

notify pgrst, 'reload schema';
