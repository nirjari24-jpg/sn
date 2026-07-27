-- ==========================================
-- SKILLNOVA SUPABASE SCHEMA SETUP
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CONVERSATION_MEMORY
-- Stores the distilled memory profile of a user
CREATE TABLE IF NOT EXISTS public.conversation_memory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  summary TEXT,
  key_facts JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CHAT_HISTORY
-- Stores raw messages
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'nova')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ROADMAPS
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id TEXT,
  title TEXT,
  stages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 5. PLANNER
CREATE TABLE IF NOT EXISTS public.planner (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_title TEXT,
  tip TEXT,
  tasks JSONB DEFAULT '[]'::jsonb,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, date)
);

-- 6. WEEKLY_REVIEWS
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start_date DATE,
  summary JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. MOCK_INTERVIEWS
CREATE TABLE IF NOT EXISTS public.mock_interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  questions JSONB DEFAULT '[]'::jsonb,
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT,
  title TEXT,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. XP_PROGRESS
CREATE TABLE IF NOT EXISTS public.xp_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. ASSESSMENT_RESULTS
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  answers JSONB DEFAULT '{}'::jsonb,
  analysis JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. CAREER_RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.career_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  matches JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. LEARNING_PROGRESS
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  weak_topics JSONB DEFAULT '[]'::jsonb,
  strong_topics JSONB DEFAULT '[]'::jsonb,
  test_scores JSONB DEFAULT '[]'::jsonb,
  projects_finished INTEGER DEFAULT 0,
  total_study_hours INTEGER DEFAULT 0,
  learning_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We preserve the old `user_profiles` table for fallback if needed.
CREATE TABLE IF NOT EXISTS public.user_profiles (
  email TEXT PRIMARY KEY,
  state JSONB DEFAULT '{}'::jsonb,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Since this is a hackathon/demo environment, and the backend handles auth via service key, 
-- we can allow anonymous read/write or just keep it simple. 
-- The backend uses the service_role key which bypasses RLS anyway.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.conversation_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all memory" ON public.conversation_memory FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all chats" ON public.chat_history FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all roadmaps" ON public.roadmaps FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.planner ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all planner" ON public.planner FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all assessment" ON public.assessment_results FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all old_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);

-- INDEXES
CREATE INDEX idx_chat_history_user_id ON public.chat_history(user_id);
CREATE INDEX idx_roadmaps_user_id ON public.roadmaps(user_id);
