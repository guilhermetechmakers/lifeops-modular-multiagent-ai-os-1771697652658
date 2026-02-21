-- run_details_artifacts table (run_details_&_artifacts in spec; & invalid in SQL)
CREATE TABLE IF NOT EXISTS run_details_artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE run_details_artifacts ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "run_details_artifacts_read_own" ON run_details_artifacts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "run_details_artifacts_insert_own" ON run_details_artifacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "run_details_artifacts_update_own" ON run_details_artifacts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "run_details_artifacts_delete_own" ON run_details_artifacts
  FOR DELETE USING (auth.uid() = user_id);
