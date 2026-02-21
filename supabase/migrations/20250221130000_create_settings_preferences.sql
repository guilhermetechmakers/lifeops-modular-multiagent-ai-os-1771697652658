-- settings_preferences table (settings & preferences)
CREATE TABLE IF NOT EXISTS settings_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Settings & Preferences',
  description TEXT,
  status TEXT DEFAULT 'active',
  notification_rules JSONB DEFAULT '{}',
  automation_defaults JSONB DEFAULT '{}',
  data_retention JSONB DEFAULT '{}',
  developer_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE settings_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "settings_preferences_read_own" ON settings_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "settings_preferences_insert_own" ON settings_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "settings_preferences_update_own" ON settings_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "settings_preferences_delete_own" ON settings_preferences
  FOR DELETE USING (auth.uid() = user_id);
