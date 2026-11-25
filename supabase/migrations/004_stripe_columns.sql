-- Stripe needs the customer id stored so we can reuse one customer per user.
alter table public.subscriptions
  add column if not exists provider_customer_id text;

create index if not exists subscriptions_customer_idx
  on public.subscriptions(provider_customer_id);

notify pgrst, 'reload schema';
