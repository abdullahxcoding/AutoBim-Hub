-- The webhook writes as the service_role key. Because "Grant API access to
-- new tables automatically" is OFF in this project, service_role has no table
-- privileges until granted here. (service_role bypasses RLS, but still needs
-- base table GRANTs.) These let the Edge Functions write subscriptions,
-- activations and the audit log.

grant select, insert, update on public.subscriptions  to service_role;
grant select, insert, update on public.activations    to service_role;
grant insert                 on public.license_events  to service_role;
grant select                 on public.products        to service_role;

notify pgrst, 'reload schema';
