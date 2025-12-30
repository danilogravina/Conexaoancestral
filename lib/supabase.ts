import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL ou Anon Key não encontradas no arquivo .env. Certifique-se de preencher as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
