export interface FinanceAccount {
  id: string
  name: string
  institution: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  balance: number
  currency: string
  lastSyncedAt?: string
  isConnected: boolean
}

export interface FinanceTransaction {
  id: string
  accountId: string
  description: string
  amount: number
  currency: string
  date: string
  category?: string
  subcategory?: string
  isAnomaly?: boolean
  anomalyReason?: string
  merchantName?: string
  pending?: boolean
}

export interface FinanceSubscription {
  id: string
  name: string
  amount: number
  currency: string
  interval: 'monthly' | 'yearly'
  nextBillingDate: string
  status: 'active' | 'cancelled' | 'past_due'
  category?: string
}

export interface FinanceForecast {
  month: string
  actual: number
  forecast: number
  variance?: number
}

export interface FinanceAuditItem {
  id: string
  action: string
  entity: string
  timestamp: string
  userId?: string
  details?: string
}

export interface FinanceDashboardPayload {
  accounts: FinanceAccount[]
  transactions: FinanceTransaction[]
  subscriptions: FinanceSubscription[]
  forecast: FinanceForecast[]
  auditSnapshot: FinanceAuditItem[]
  overview: {
    totalAccounts: number
    totalTransactions: number
    activeSubscriptions: number
    forecastTrend: number
  }
}
