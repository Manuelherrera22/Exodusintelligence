-- ═══════════════════════════════════════════════════════════════════════════════
-- EXODUS INTELLIGENCE — Migration Profiles & Tasks
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════

-- Migration Profiles
CREATE TABLE IF NOT EXISTS migration_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  country_code TEXT,
  country_name TEXT,
  age INTEGER,
  education TEXT,
  field TEXT,
  english_level TEXT,
  french_level TEXT,
  work_years INTEGER,
  target_country TEXT,
  challenges TEXT[] DEFAULT '{}',
  overall_score INTEGER DEFAULT 0,
  crs_total INTEGER DEFAULT 0,
  raw_profile JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Migration Tasks (generated plan)
CREATE TABLE IF NOT EXISTS migration_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES migration_profiles(id) ON DELETE CASCADE,
  task_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  duration TEXT,
  points INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE migration_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profiles" ON migration_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profiles" ON migration_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profiles" ON migration_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own tasks" ON migration_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON migration_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON migration_tasks FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user ON migration_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON migration_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_profile ON migration_tasks(profile_id);
