-- finance_accounts table
CREATE TABLE IF NOT EXISTS finance_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'investment')),
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  is_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- finance_transactions table
CREATE TABLE IF NOT EXISTS finance_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES finance_accounts(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  date DATE NOT NULL,
  category TEXT,
  subcategory TEXT,
  is_anomaly BOOLEAN DEFAULT false,
  anomaly_reason TEXT,
  merchant_name TEXT,
  pending BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- finance_subscriptions table
CREATE TABLE IF NOT EXISTS finance_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  next_billing_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- finance_audit_log table
CREATE TABLE IF NOT EXISTS finance_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_audit_log ENABLE ROW LEVEL SECURITY;

-- finance_accounts policies
CREATE POLICY "finance_accounts_read_own" ON finance_accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "finance_accounts_insert_own" ON finance_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "finance_accounts_update_own" ON finance_accounts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "finance_accounts_delete_own" ON finance_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- finance_transactions policies
CREATE POLICY "finance_transactions_read_own" ON finance_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "finance_transactions_insert_own" ON finance_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "finance_transactions_update_own" ON finance_transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "finance_transactions_delete_own" ON finance_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- finance_subscriptions policies
CREATE POLICY "finance_subscriptions_read_own" ON finance_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "finance_subscriptions_insert_own" ON finance_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "finance_subscriptions_update_own" ON finance_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "finance_subscriptions_delete_own" ON finance_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- finance_audit_log policies
CREATE POLICY "finance_audit_log_read_own" ON finance_audit_log
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "finance_audit_log_insert_own" ON finance_audit_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);
