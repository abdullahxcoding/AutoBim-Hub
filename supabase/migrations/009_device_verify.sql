-- ─────────────────────────────────────────────────────────────
--  009: Per-licence devices + verify support
--
--  The Revit tools check the licence ONLINE on every run (short
--  cache) via the `verify` Edge Function. Devices now belong to the
--  licence/account, not to one tool (migration 008 made
--  activations.product_slug nullable), with a 2-device limit.
--
--  Run once in Supabase → SQL Editor → New query.
-- ─────────────────────────────────────────────────────────────

-- 1. One device row per (user, device) for account-wide activations.
--    The old unique index (user_id, product_slug, device_id) does NOT
--    constrain rows where product_slug IS NULL (NULLs are distinct),
--    so add a partial unique index for the per-licence devices.
create unique index if not exists activations_unique_account_device
  on public.activations (user_id, device_id)
  where product_slug is null;

-- Helpful lookups for the verify function.
create index if not exists activations_device_idx on public.activations (device_id);
create index if not exists subscriptions_user_tool_idx
  on public.subscriptions (user_id, product_slug);

-- 2. The verify Edge Function runs as service_role and needs to read
--    profiles/subscriptions and read+write activations + license_events.
--    (Auto-grant is OFF in this project, so grant explicitly.)
grant select on public.profiles      to service_role;
grant select on public.subscriptions to service_role;
grant select, insert, update on public.activations    to service_role;
grant insert               on public.license_events to service_role;

notify pgrst, 'reload schema';
