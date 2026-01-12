-- ==============================================================================
-- FIX: PERMISSÕES DE PERFIL (MUITO IMPORTANTE)
-- ==============================================================================
-- Descrição: Este script corrige o problema onde a página "Minha Conta" some/dá erro.
-- O erro ocorre porque o Supabase estava bloqueando a criação do perfil no cadastro.
-- ==============================================================================

-- 1. Permitir que o usuário CRIE seu próprio perfil (Insert)
-- Sem isso, o cadastro cria o login mas não cria o perfil, causando o erro na dashboard.
create policy "Users can insert their own profile" 
on profiles 
for insert 
with check (auth.uid() = id);

-- 2. Garantir que o usuário possa LER seu próprio perfil (Select)
-- (Caso a política anterior tenha sido deletada ou esteja incorreta)
drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile" 
on profiles 
for select 
using (auth.uid() = id);

-- 3. (Opcional) Trigger de Backup para criar perfil automaticamente se o front-end falhar
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', '/assets/img/user-avatar-default.jpg', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Remover trigger antigo se existir para evitar duplicidade
drop trigger if exists on_auth_user_created on auth.users;

-- Criar o trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
