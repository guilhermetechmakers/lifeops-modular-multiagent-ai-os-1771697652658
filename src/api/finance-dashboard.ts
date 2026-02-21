import { supabase } from '@/lib/supabase'
import type { FinanceDashboardPayload } from '@/types/finance-dashboard'

const MOCK_PAYLOAD: FinanceDashboardPayload = {
  overview: {
    totalAccounts: 4,
    totalTransactions: 127,
    activeSubscriptions: 8,
    forecastTrend: 12,
  },
  accounts: [
    { id: '1', name: 'Primary Checking', institution: 'Chase', type: 'checking', balance: 12450.32, currency: 'USD', lastSyncedAt: new Date().toISOString(), isConnected: true },
    { id: '2', name: 'Savings', institution: 'Chase', type: 'savings', balance: 28500, currency: 'USD', lastSyncedAt: new Date().toISOString(), isConnected: true },
    { id: '3', name: 'Credit Card', institution: 'Amex', type: 'credit', balance: -1234.56, currency: 'USD', lastSyncedAt: new Date().toISOString(), isConnected: true },
  ],
  transactions: [
    { id: '1', accountId: '1', description: 'Starbucks Coffee', amount: -5.75, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Food & Drink', subcategory: 'Coffee', isAnomaly: false, merchantName: 'Starbucks', pending: false },
    { id: '2', accountId: '1', description: 'Amazon Web Services', amount: -342.00, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Software', subcategory: 'Cloud', isAnomaly: false, merchantName: 'AWS', pending: false },
    { id: '3', accountId: '1', description: 'Wire Transfer - Large', amount: -5000.00, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Transfer', isAnomaly: true, anomalyReason: 'Unusual large transfer', merchantName: 'Wire', pending: false },
    { id: '4', accountId: '1', description: 'Salary Deposit', amount: 8500.00, currency: 'USD', date: new Date().toISOString().slice(0, 10), category: 'Income', subcategory: 'Salary', isAnomaly: false, pending: false },
  ],
  subscriptions: [
    { id: '1', name: 'Netflix', amount: 15.99, currency: 'USD', interval: 'monthly', nextBillingDate: '2025-03-15', status: 'active', category: 'Entertainment' },
    { id: '2', name: 'Spotify', amount: 9.99, currency: 'USD', interval: 'monthly', nextBillingDate: '2025-03-08', status: 'active', category: 'Entertainment' },
    { id: '3', name: 'AWS', amount: 342.00, currency: 'USD', interval: 'monthly', nextBillingDate: '2025-03-01', status: 'active', category: 'Software' },
  ],
  forecast: [
    { month: 'Jan', actual: 4200, forecast: 4000, variance: 5 },
    { month: 'Feb', actual: 3800, forecast: 4100, variance: -7 },
    { month: 'Mar', actual: 4500, forecast: 4200, variance: 7 },
    { month: 'Apr', actual: 4100, forecast: 4300, variance: -5 },
  ],
  auditSnapshot: [
    { id: '1', action: 'Exported transactions', entity: 'Q1 2025', timestamp: new Date().toISOString(), details: 'CSV export' },
    { id: '2', action: 'Reconciled account', entity: 'Primary Checking', timestamp: new Date().toISOString() },
  ],
}

export async function fetchFinanceDashboard(): Promise<FinanceDashboardPayload> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<FinanceDashboardPayload>('finance-dashboard', {
      method: 'POST',
    })
    if (!error && data) return data
  }
  return MOCK_PAYLOAD
}
