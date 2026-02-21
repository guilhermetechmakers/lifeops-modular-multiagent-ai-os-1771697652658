import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    })

    let userId: string | undefined
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id
    }

    if (req.method === 'GET' || req.method === 'POST') {
      const accounts = [
        { id: '1', name: 'Primary Checking', institution: 'Chase', type: 'checking' as const, balance: 12450.32, currency: 'USD', lastSyncedAt: new Date().toISOString(), isConnected: true },
        { id: '2', name: 'Savings', institution: 'Chase', type: 'savings' as const, balance: 28500, currency: 'USD', lastSyncedAt: new Date().toISOString(), isConnected: true },
        { id: '3', name: 'Credit Card', institution: 'Amex', type: 'credit' as const, balance: -1234.56, currency: 'USD', lastSyncedAt: new Date().toISOString(), isConnected: true },
      ]

      const transactions = [
        { id: '1', accountId: '1', description: 'Starbucks Coffee', amount: -5.75, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Food & Drink', subcategory: 'Coffee', isAnomaly: false, merchantName: 'Starbucks', pending: false },
        { id: '2', accountId: '1', description: 'Amazon Web Services', amount: -342.00, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Software', subcategory: 'Cloud', isAnomaly: false, merchantName: 'AWS', pending: false },
        { id: '3', accountId: '1', description: 'Wire Transfer - Large', amount: -5000.00, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Transfer', isAnomaly: true, anomalyReason: 'Unusual large transfer', merchantName: 'Wire', pending: false },
        { id: '4', accountId: '1', description: 'Salary Deposit', amount: 8500.00, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Income', subcategory: 'Salary', isAnomaly: false, pending: false },
        { id: '5', accountId: '3', description: 'Netflix', amount: -15.99, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Entertainment', subcategory: 'Streaming', isAnomaly: false, merchantName: 'Netflix', pending: false },
      ]

      const subscriptions = [
        { id: '1', name: 'Netflix', amount: 15.99, currency: 'USD', interval: 'monthly' as const, nextBillingDate: '2025-03-15', status: 'active' as const, category: 'Entertainment' },
        { id: '2', name: 'Spotify', amount: 9.99, currency: 'USD', interval: 'monthly' as const, nextBillingDate: '2025-03-08', status: 'active' as const, category: 'Entertainment' },
        { id: '3', name: 'AWS', amount: 342.00, currency: 'USD', interval: 'monthly' as const, nextBillingDate: '2025-03-01', status: 'active' as const, category: 'Software' },
        { id: '4', name: 'Adobe Creative Cloud', amount: 54.99, currency: 'USD', interval: 'monthly' as const, nextBillingDate: '2025-03-12', status: 'active' as const, category: 'Software' },
      ]

      const forecast = [
        { month: 'Jan', actual: 4200, forecast: 4000, variance: 5 },
        { month: 'Feb', actual: 3800, forecast: 4100, variance: -7 },
        { month: 'Mar', actual: 4500, forecast: 4200, variance: 7 },
        { month: 'Apr', actual: 4100, forecast: 4300, variance: -5 },
      ]

      const auditSnapshot = [
        { id: '1', action: 'Exported transactions', entity: 'Q1 2025', timestamp: new Date().toISOString(), userId, details: 'CSV export' },
        { id: '2', action: 'Reconciled account', entity: 'Primary Checking', timestamp: new Date().toISOString(), userId },
        { id: '3', action: 'Categorized transaction', entity: 'Starbucks Coffee', timestamp: new Date().toISOString(), userId },
      ]

      const overview = {
        totalAccounts: accounts.length,
        totalTransactions: transactions.length,
        activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
        forecastTrend: 12,
      }

      const payload = {
        accounts,
        transactions,
        subscriptions,
        forecast,
        auditSnapshot,
        overview,
      }

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
