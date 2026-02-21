-- privacy_policy table (Privacy Policy - user preferences, consent, etc.)
CREATE TABLE IF NOT EXISTS privacy_policy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE privacy_policy ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "privacy_policy_read_own" ON privacy_policy
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "privacy_policy_insert_own" ON privacy_policy
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "privacy_policy_update_own" ON privacy_policy
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "privacy_policy_delete_own" ON privacy_policy
  FOR DELETE USING (auth.uid() = user_id);
