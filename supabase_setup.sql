-- ==============================================================================
-- IMPACT OPS DASHBOARD - SUPABASE SETUP SCRIPT
-- Copy and paste this entire script into your Supabase SQL Editor and click RUN.
-- ==============================================================================

-- 1. Create the members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  designation TEXT NOT NULL DEFAULT 'L3',
  avatar_bg TEXT,
  avatar_fg TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create the score_entries table
CREATE TABLE score_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  score NUMERIC(3,1) NOT NULL CHECK (score IN (-1, -0.5, 0, 0.5, 1)),
  reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(member_id, date)
);

-- 3. Enable Realtime subscriptions for both tables
-- (This is what makes the dashboard update instantly without refreshing)
ALTER PUBLICATION supabase_realtime ADD TABLE score_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE members;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_entries ENABLE ROW LEVEL SECURITY;

-- 5. Create basic access policies (Open for now so the dashboard works)
-- You can lock these down later in Supabase if needed.
CREATE POLICY "Allow all" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON score_entries FOR ALL USING (true) WITH CHECK (true);
