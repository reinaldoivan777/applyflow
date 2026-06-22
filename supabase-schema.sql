create table if not exists public.applications (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  job_url text,
  status text not null check (
    status in ('applied', 'screening', 'interview', 'take-home', 'offer', 'rejected')
  ),
  deadline date,
  next_action text not null,
  notes text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index if not exists applications_user_id_updated_at_idx
  on public.applications (user_id, updated_at desc);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'applications'
  ) then
    alter publication supabase_realtime add table public.applications;
  end if;
end $$;

alter table public.applications enable row level security;

create policy "Users can read their applications"
  on public.applications
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their applications"
  on public.applications
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their applications"
  on public.applications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their applications"
  on public.applications
  for delete
  using (auth.uid() = user_id);
