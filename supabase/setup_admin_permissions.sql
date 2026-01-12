-- ==============================================================================
-- SCRIPT PARA HABILITAR PERMISSÕES DE ADMINISTRAÇÃO
-- Rode este script no Editor SQL do Supabase
-- ==============================================================================

-- 1. Garantir que a tabela profiles tenha a coluna role
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
    END IF;
END $$;

-- 2. Habilitar RLS na tabela de projetos (se ainda não estiver)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 3. Criar (ou recriar) a política que permite ADMINS fazerem TUDO na tabela projects
DROP POLICY IF EXISTS "Admins can manage everything" ON projects;

CREATE POLICY "Admins can manage everything" ON projects
FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Definir seu usuário como ADMIN
-- SUBSTITUA 'seu-email@exemplo.com' PELO SEU EMAIL DE LOGIN
UPDATE profiles
SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com');

-- 5. Verificação (Opcional)
-- SELECT * FROM profiles WHERE role = 'admin';
