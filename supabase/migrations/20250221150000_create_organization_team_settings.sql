-- organization_team_settings table (organization / team settings)
CREATE TABLE IF NOT EXISTS organization_team_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Organization & Team Settings',
  description TEXT,
  status TEXT DEFAULT 'active',
  team_roster JSONB DEFAULT '{}',
  rbac_policies JSONB DEFAULT '{}',
  billing JSONB DEFAULT '{}',
  enterprise JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE organization_team_settings ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "organization_team_settings_read_own" ON organization_team_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "organization_team_settings_insert_own" ON organization_team_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "organization_team_settings_update_own" ON organization_team_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "organization_team_settings_delete_own" ON organization_team_settings
  FOR DELETE USING (auth.uid() = user_id);
