-- Run this in your Supabase SQL Editor to create the users table

CREATE TABLE IF NOT EXISTS public.user_profiles (
  email TEXT PRIMARY KEY,
  state JSONB DEFAULT '{}'::jsonb,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional, for safety. But since we use email as lookup right now without real auth, we will just allow all for the demo, or require anon key to insert)
-- We will allow public read/write for the hackathon/demo purposes based on email.
-- In production, you MUST use Supabase Auth and RLS.
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert/update" ON public.user_profiles
  FOR ALL USING (true) WITH CHECK (true);
