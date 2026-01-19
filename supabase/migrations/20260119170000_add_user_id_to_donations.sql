-- Ensure donations has user_id column
alter table public.donations
  add column if not exists user_id uuid references public.profiles(id);
