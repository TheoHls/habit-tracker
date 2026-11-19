-- Habit tracker schema. Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.habits (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  created_at date not null default current_date,
  done text[] not null default '{}',
  inserted_at timestamptz not null default now()
);

create index if not exists habits_user_id_idx on public.habits (user_id);

-- Row Level Security: each user only sees and edits their own habits.
alter table public.habits enable row level security;

drop policy if exists "Users read own habits" on public.habits;
create policy "Users read own habits" on public.habits
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own habits" on public.habits;
create policy "Users insert own habits" on public.habits
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own habits" on public.habits;
create policy "Users update own habits" on public.habits
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete own habits" on public.habits;
create policy "Users delete own habits" on public.habits
  for delete to authenticated using ((select auth.uid()) = user_id);
