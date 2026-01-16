
import { createClient } from '@supabase/supabase-js';

// Hardcoded values from lib/supabase.ts since we are in a text script without Vite env
const SUPABASE_URL = 'https://crvjxuuxhiaqkgdzusqz.supabase.co';
// Note: This key in lib/supabase.ts looked cleaner, ensuring we copy it exactly. 
// If it fails, we might need to verify the key.
const SUPABASE_KEY = 'sb_publishable_kxL65M6FnI1ml67II-vgeQ_UQ1ori6F'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EMAIL = 'danifreiman44@gmail.com';
const PASSWORD = '!Fluminense2024';

async function createUser() {
  console.log(`Tentando criar usuário: ${EMAIL}...`);

  const { data, error } = await supabase.auth.signUp({
    email: EMAIL,
    password: PASSWORD,
  });

  if (error) {
    console.error('Erro ao criar usuário:', error.message);
    return;
  }

  if (data.user) {
    console.log('✅ Usuário criado com sucesso!');
    console.log('ID do Usuário:', data.user.id);
    console.log('\n--- AÇÃO NECESSÁRIA ---');
    console.log('Para tornar este usuário um ADMIN, execute o seguinte SQL no Supabase Dashboard:');
    console.log(`
UPDATE profiles
SET role = 'admin'
WHERE id = '${data.user.id}';
    `);
  } else {
    console.log('Usuário pode já existir ou requer confirmação de email.');
  }
}

createUser();
