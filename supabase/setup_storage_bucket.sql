-- ==============================================================================
-- SCRIPT PARA CONFIGURAR O STORAGE (UPLOAD DE IMAGENS)
-- Rode este script no Editor SQL do Supabase
-- ==============================================================================

-- 1. Criar o bucket 'project-images' (se não existir)
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- 2. Habilitar RLS no Storage
-- (Normalmente já é habilitado, mas vamos garantir que as políticas funcionem)

-- 3. Política: Qualquer pessoa pode LER (ver) as imagens
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'project-images' );

-- 4. Política: Apenas usuários autenticados (ou admins) podem FAZER UPLOAD
drop policy if exists "Authenticated can upload" on storage.objects;
create policy "Authenticated can upload"
on storage.objects for insert
with check (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- 5. Política: Permitir UPDATE/DELETE apenas para quem fez o upload ou admins
drop policy if exists "Authenticated can update" on storage.objects;
create policy "Authenticated can update"
on storage.objects for update
using ( bucket_id = 'project-images' AND auth.role() = 'authenticated' );

drop policy if exists "Authenticated can delete" on storage.objects;
create policy "Authenticated can delete"
on storage.objects for delete
using ( bucket_id = 'project-images' AND auth.role() = 'authenticated' );
