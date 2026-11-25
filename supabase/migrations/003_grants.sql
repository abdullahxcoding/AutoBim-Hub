-- ─────────────────────────────────────────────────────────────
--  Expose the Phase A tables to the API roles.
--  Needed because "Grant API access to new tables automatically"
--  is turned OFF in this project (the safe default we chose).
--
--  Row Level Security still restricts every row: these grants only
--  say "the API may touch this table", while the policies in
--  002_accounts.sql decide WHICH rows each user sees.
-- ─────────────────────────────────────────────────────────────

-- Public catalogue: anyone may read.
grant select on public.products to anon, authenticated;

-- Signed-in users: read own rows (policies enforce "own").
grant select on public.profiles       to authenticated;
grant update on public.profiles        to authenticated;
grant select on public.subscriptions   to authenticated;
grant select on public.activations     to authenticated;
grant update on public.activations     to authenticated;  -- deactivate own device
grant select on public.license_events  to authenticated;

-- Make sure PostgREST reloads its schema cache immediately.
notify pgrst, 'reload schema';
