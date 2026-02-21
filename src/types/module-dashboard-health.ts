export interface ModuleDashboardHealth {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  name: string
  targetDaysPerWeek: number
  completedDays: number
  currentStreak: number
  longestStreak: number
  reminderTime?: string
  adherencePercent: number
}

export interface TrainingPlan {
  id: string
  name: string
  phase: string
  weekNumber: number
  totalWeeks: number
  sessionsThisWeek: number
  completedSessions: number
  nextSession?: string
  calendarSynced: boolean
}

export interface MealTemplate {
  id: string
  name: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface MacroTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
  adherencePercent: number
}

export interface RecoveryMetric {
  id: string
  type: 'sleep' | 'hrv' | 'workload'
  label: string
  value: string | number
  status: 'good' | 'fair' | 'poor'
  suggestion?: string
}

export interface DeviceIntegration {
  id: string
  provider: 'fitbit' | 'garmin' | 'apple_health' | 'google_calendar'
  name: string
  connected: boolean
  lastSync?: string
  health: 'healthy' | 'degraded' | 'error'
}

export interface ModuleDashboardHealthPayload {
  habits: Habit[]
  trainingPlans: TrainingPlan[]
  mealTemplates: MealTemplate[]
  macroTargets: MacroTargets
  recoveryMetrics: RecoveryMetric[]
  deviceIntegrations: DeviceIntegration[]
  metrics: {
    activeHabits: number
    trainingWeek: number
    nutritionAdherence: number
    recoveryStatus: string
  }
}
