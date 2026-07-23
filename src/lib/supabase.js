import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yhxcfhzfqxhbqsxxvegs.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_gTHgPDS8D04Nu8IewDtH4Q_hVFHeGG6';

export const supabase = createClient(supabaseUrl, supabaseKey);
