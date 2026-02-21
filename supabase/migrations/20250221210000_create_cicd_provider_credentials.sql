-- cicd_provider_credentials table for CI/CD provider integrations (CircleCI, Jenkins, GitHub Actions)
CREATE TABLE IF NOT EXISTS cicd_provider_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('circleci', 'jenkins', 'github_actions')),
  encrypted_credentials TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE cicd_provider_credentials ENABLE ROW LEVEL SECURITY;

-- Users can only read their own credentials
CREATE POLICY "cicd_credentials_read_own" ON cicd_provider_credentials
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own credentials
CREATE POLICY "cicd_credentials_insert_own" ON cicd_provider_credentials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own credentials
CREATE POLICY "cicd_credentials_update_own" ON cicd_provider_credentials
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own credentials
CREATE POLICY "cicd_credentials_delete_own" ON cicd_provider_credentials
  FOR DELETE USING (auth.uid() = user_id);
