-- Allow admins to view all donations (idempotent)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'donations' and policyname = 'Admins can view all donations'
  ) then
    create policy "Admins can view all donations" on public.donations
    for select
    using (
      exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    );
  end if;
end $$;
