import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yhxcfhzfqxhbqsxxvegs.supabase.co';
const supabaseKey = 'sb_publishable_gTHgPDS8D04Nu8IewDtH4Q_hVFHeGG6';

export const supabase = createClient(supabaseUrl, supabaseKey);
