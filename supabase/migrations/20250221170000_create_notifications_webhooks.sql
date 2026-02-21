-- notification_templates: templates for in-app, email, webhook
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID,
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('in_app', 'email', 'webhook')),
  subject TEXT,
  body_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- notification_rules: per-event rules (run events, approvals, failures)
CREATE TABLE IF NOT EXISTS notification_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID,
  event_type TEXT NOT NULL CHECK (event_type IN ('run_started', 'run_completed', 'run_failed', 'approval_pending', 'approval_resolved', 'agent_conflict', 'connector_expiring')),
  channels TEXT[] NOT NULL DEFAULT ARRAY['in_app'],
  template_id UUID REFERENCES notification_templates(id) ON DELETE SET NULL,
  webhook_url TEXT,
  enabled BOOLEAN DEFAULT true,
  retry_count INT DEFAULT 3,
  retry_delay_seconds INT DEFAULT 60,
  route_to TEXT[] DEFAULT ARRAY['master_dashboard'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- notification_deliveries: delivery log with retries and dead-letter
CREATE TABLE IF NOT EXISTS notification_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID REFERENCES notification_rules(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  recipient TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'dead_letter')),
  retry_count INT DEFAULT 0,
  last_error TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- in_app_notifications: for Master Dashboard and Approvals Queue routing
CREATE TABLE IF NOT EXISTS in_app_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL CHECK (type IN ('run_event', 'approval', 'failure', 'agent_conflict', 'other')),
  entity_id TEXT,
  entity_type TEXT,
  route_to TEXT DEFAULT 'master_dashboard',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE in_app_notifications ENABLE ROW LEVEL SECURITY;

-- notification_templates: readable by all (org-scoped in app; edge function uses service role)
CREATE POLICY "notification_templates_select" ON notification_templates FOR SELECT USING (true);
CREATE POLICY "notification_templates_insert" ON notification_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "notification_templates_update" ON notification_templates FOR UPDATE USING (true);

-- notification_rules: users manage their own rules
CREATE POLICY "notification_rules_read_own" ON notification_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notification_rules_insert_own" ON notification_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notification_rules_update_own" ON notification_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notification_rules_delete_own" ON notification_rules FOR DELETE USING (auth.uid() = user_id);

-- notification_deliveries: service role only (edge function bypasses RLS; deny client access)
CREATE POLICY "notification_deliveries_service_only" ON notification_deliveries FOR ALL USING (false);

-- in_app_notifications: users read their own
CREATE POLICY "in_app_notifications_read_own" ON in_app_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "in_app_notifications_insert_own" ON in_app_notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "in_app_notifications_update_own" ON in_app_notifications FOR UPDATE USING (auth.uid() = user_id);
