-- Allow admins to view all donations
create policy if not exists "Admins can view all donations" on public.donations
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
