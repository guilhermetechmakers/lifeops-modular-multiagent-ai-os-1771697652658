-- module_dashboard_projects table
CREATE TABLE IF NOT EXISTS module_dashboard_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE module_dashboard_projects ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "module_dashboard_projects_read_own" ON module_dashboard_projects
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "module_dashboard_projects_insert_own" ON module_dashboard_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "module_dashboard_projects_update_own" ON module_dashboard_projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "module_dashboard_projects_delete_own" ON module_dashboard_projects
  FOR DELETE USING (auth.uid() = user_id);
