import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://crvjxuuxhiaqkgdzusqz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_kxL65M6FnI1ml67II-vgeQ_UQ1ori6F';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL ou Anon Key não encontradas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
