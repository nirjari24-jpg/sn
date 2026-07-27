import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase URL or Service Key missing. Database operations will fail.');
}

// Use the service role key to bypass RLS from the backend securely
export const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseServiceKey || 'dummy');
