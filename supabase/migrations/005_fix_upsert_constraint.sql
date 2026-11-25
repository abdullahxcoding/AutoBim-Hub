-- The webhook upserts with ON CONFLICT (provider, provider_sub_id).
-- The original index was PARTIAL (… where provider_sub_id is not null),
-- which Postgres can't use as a conflict target (error 42P10).
-- Replace it with a real unique constraint so upsert works.

drop index if exists public.subscriptions_provider_idx;

alter table public.subscriptions
  drop constraint if exists subscriptions_provider_sub_unique;

alter table public.subscriptions
  add constraint subscriptions_provider_sub_unique unique (provider, provider_sub_id);

notify pgrst, 'reload schema';
