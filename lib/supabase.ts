import { createClient } from '@supabase/supabase-js';

// Acestea trag datele din fisierul .env.local pe care l-ai făcut
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);