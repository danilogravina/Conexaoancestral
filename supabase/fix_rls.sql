-- ==============================================================================
-- FIX: PERMISSÕES DE PERFIL E CORREÇÃO DE DADOS (VERSÃO CORRIGIDA)
-- ==============================================================================
-- Descrição: Este script corrige o problema onde a página "Minha Conta" some/dá erro.
-- O erro ocorre porque o Supabase estava bloqueando a criação do perfil no cadastro.
-- ESTA VERSÃO TAMBÉM CRIA PERFIS PARA USUÁRIOS QUE JÁ ESTÃO CADASTRADOS MAS SEM PERFIL.
-- ==============================================================================

-- 1. Permitir que o usuário CRIE seu próprio perfil (Insert)
drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile" 
on profiles 
for insert 
with check (auth.uid() = id);

-- 2. Garantir que o usuário possa LER seu próprio perfil (Select)
drop policy if exists "Users can view their own profile" on profiles;
create policy "Users can view their own profile" 
on profiles 
for select 
using (auth.uid() = id);

-- 3. Trigger para criar perfil automaticamente (CORRIGIDO: REMOVIDA COLUNA EMAIL)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  -- Atenção: A tabela profiles não tem coluna 'email' no esquema padrão fornecido.
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', '/assets/img/user-avatar-default.jpg')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Remove antigo se existir
drop trigger if exists on_auth_user_created on auth.users;

-- Cria o trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 4. BACKFILL: CORRIGIR USUÁRIOS EXISTENTES (Que estão vendo a tela de erro)
-- ==============================================================================
-- Insere perfil para usuários que existem em auth.users mas não em public.profiles
insert into public.profiles (id, full_name, avatar_url)
select 
  id, 
  coalesce(raw_user_meta_data->>'full_name', 'Usuário'), 
  '/assets/img/user-avatar-default.jpg'
from auth.users
where id not in (select id from public.profiles);
