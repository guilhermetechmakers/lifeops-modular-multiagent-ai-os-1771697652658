import { supabase } from '@/lib/supabase'
import type { ModuleDashboardHealthPayload } from '@/types/module-dashboard-health'

const MOCK_PAYLOAD: ModuleDashboardHealthPayload = {
  habits: [
    { id: '1', name: 'Morning routine', targetDaysPerWeek: 7, completedDays: 6, currentStreak: 4, longestStreak: 12, reminderTime: '07:00', adherencePercent: 86 },
    { id: '2', name: 'Workout adherence', targetDaysPerWeek: 5, completedDays: 4, currentStreak: 2, longestStreak: 8, reminderTime: '18:00', adherencePercent: 80 },
    { id: '3', name: 'Meditation', targetDaysPerWeek: 7, completedDays: 5, currentStreak: 3, longestStreak: 5, reminderTime: '08:30', adherencePercent: 71 },
  ],
  trainingPlans: [
    { id: '1', name: 'Strength Builder', phase: 'Base', weekNumber: 3, totalWeeks: 12, sessionsThisWeek: 4, completedSessions: 2, nextSession: 'Tomorrow 09:00', calendarSynced: true },
  ],
  mealTemplates: [
    { id: '1', name: 'High-protein breakfast', mealType: 'breakfast', calories: 450, protein: 35, carbs: 40, fat: 15 },
    { id: '2', name: 'Lean lunch bowl', mealType: 'lunch', calories: 550, protein: 45, carbs: 55, fat: 12 },
    { id: '3', name: 'Post-workout shake', mealType: 'snack', calories: 280, protein: 30, carbs: 35, fat: 5 },
  ],
  macroTargets: { calories: 2200, protein: 165, carbs: 220, fat: 73, adherencePercent: 78 },
  recoveryMetrics: [
    { id: '1', type: 'sleep', label: 'Sleep', value: '7.2h', status: 'good', suggestion: 'Maintain consistency' },
    { id: '2', type: 'hrv', label: 'HRV', value: '52 ms', status: 'good', suggestion: 'Within normal range' },
    { id: '3', type: 'workload', label: 'Workload', value: 'Balanced', status: 'good', suggestion: 'No adjustments needed' },
  ],
  deviceIntegrations: [
    { id: '1', provider: 'fitbit', name: 'Fitbit Charge 5', connected: true, lastSync: new Date().toISOString(), health: 'healthy' },
    { id: '2', provider: 'google_calendar', name: 'Google Calendar', connected: true, lastSync: new Date().toISOString(), health: 'healthy' },
    { id: '3', provider: 'garmin', name: 'Garmin Connect', connected: false, health: 'error' },
  ],
  metrics: { activeHabits: 5, trainingWeek: 3, nutritionAdherence: 78, recoveryStatus: 'Good' },
}

export async function fetchModuleDashboardHealth(): Promise<ModuleDashboardHealthPayload> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<ModuleDashboardHealthPayload>(
      'module-dashboard-health',
      { method: 'POST' }
    )
    if (!error && data) return data
  }
  return MOCK_PAYLOAD
}
