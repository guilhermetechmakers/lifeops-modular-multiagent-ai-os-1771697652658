-- docs_help table (Docs & Help - user bookmarks, tickets, etc.)
CREATE TABLE IF NOT EXISTS docs_help (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE docs_help ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "docs_help_read_own" ON docs_help
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "docs_help_insert_own" ON docs_help
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "docs_help_update_own" ON docs_help
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "docs_help_delete_own" ON docs_help
  FOR DELETE USING (auth.uid() = user_id);
