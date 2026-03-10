import { createClient } from '@supabase/supabase-js';

function requireENV(name) {
    const value = import.meta.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required but not defined.`);
    }
    return value;
}

const supabaseUrl = requireENV('VITE_SUPABASE_URL');
const supabaseAnonKey = requireENV('VITE_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);