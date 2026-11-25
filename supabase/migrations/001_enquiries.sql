-- Project enquiries submitted from the public website.
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 120),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  company     text check (char_length(company) <= 160),
  topic       text not null default 'project'
              check (topic in ('project', 'plugin', 'pyrevit', 'autocad', 'software', 'consultancy', 'other')),
  message     text not null check (char_length(message) between 10 and 5000),
  status      text not null default 'new' check (status in ('new', 'in_progress', 'closed'))
);

alter table public.enquiries enable row level security;

-- Visitors may only INSERT. No select/update/delete policies exist,
-- so nobody can read enquiries through the public API.
-- You read them in the Supabase dashboard (Table Editor), which bypasses RLS.
grant insert on public.enquiries to anon, authenticated;

drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
create policy "Anyone can submit an enquiry"
  on public.enquiries for insert
  to anon, authenticated
  with check (status = 'new');
