-- not_found_reports table (404 broken link reports)
-- Note: 404_not_found is invalid in SQL; using not_found_reports
CREATE TABLE IF NOT EXISTS not_found_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE not_found_reports ENABLE ROW LEVEL SECURITY;

-- Users can read their own data (admin reads via service role)
CREATE POLICY "not_found_reports_read_own" ON not_found_reports
  FOR SELECT USING (auth.uid() = user_id);

-- Service role inserts via Edge Function; allow authenticated users to insert their own
CREATE POLICY "not_found_reports_insert_own" ON not_found_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can update their own data
CREATE POLICY "not_found_reports_update_own" ON not_found_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "not_found_reports_delete_own" ON not_found_reports
  FOR DELETE USING (auth.uid() = user_id);
