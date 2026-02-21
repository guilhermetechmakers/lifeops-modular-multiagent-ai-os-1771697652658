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
      const {
        data: { user },
      } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
      userId = user?.id
    }

    let userHealthRecords: { id: string; title: string; description?: string; status: string }[] = []
    if (userId) {
      const { data: records } = await supabase
        .from('module_dashboard_health')
        .select('id, title, description, status')
        .eq('user_id', userId)
        .eq('status', 'active')
      if (records?.length) {
        userHealthRecords = records
      }
    }

    if (req.method === 'GET' || req.method === 'POST') {
      const habits = [
        { id: '1', name: 'Morning routine', targetDaysPerWeek: 7, completedDays: 6, currentStreak: 4, longestStreak: 12, reminderTime: '07:00', adherencePercent: 86 },
        { id: '2', name: 'Workout adherence', targetDaysPerWeek: 5, completedDays: 4, currentStreak: 2, longestStreak: 8, reminderTime: '18:00', adherencePercent: 80 },
        { id: '3', name: 'Meditation', targetDaysPerWeek: 7, completedDays: 5, currentStreak: 3, longestStreak: 5, reminderTime: '08:30', adherencePercent: 71 },
      ]

      const trainingPlans = [
        { id: '1', name: 'Strength Builder', phase: 'Base', weekNumber: 3, totalWeeks: 12, sessionsThisWeek: 4, completedSessions: 2, nextSession: 'Tomorrow 09:00', calendarSynced: true },
      ]

      const mealTemplates = [
        { id: '1', name: 'High-protein breakfast', mealType: 'breakfast' as const, calories: 450, protein: 35, carbs: 40, fat: 15 },
        { id: '2', name: 'Lean lunch bowl', mealType: 'lunch' as const, calories: 550, protein: 45, carbs: 55, fat: 12 },
        { id: '3', name: 'Post-workout shake', mealType: 'snack' as const, calories: 280, protein: 30, carbs: 35, fat: 5 },
      ]

      const macroTargets = { calories: 2200, protein: 165, carbs: 220, fat: 73, adherencePercent: 78 }

      const recoveryMetrics = [
        { id: '1', type: 'sleep' as const, label: 'Sleep', value: '7.2h', status: 'good' as const, suggestion: 'Maintain consistency' },
        { id: '2', type: 'hrv' as const, label: 'HRV', value: '52 ms', status: 'good' as const, suggestion: 'Within normal range' },
        { id: '3', type: 'workload' as const, label: 'Workload', value: 'Balanced', status: 'good' as const, suggestion: 'No adjustments needed' },
      ]

      const deviceIntegrations = [
        { id: '1', provider: 'fitbit' as const, name: 'Fitbit Charge 5', connected: true, lastSync: new Date().toISOString(), health: 'healthy' as const },
        { id: '2', provider: 'google_calendar' as const, name: 'Google Calendar', connected: true, lastSync: new Date().toISOString(), health: 'healthy' as const },
        { id: '3', provider: 'garmin' as const, name: 'Garmin Connect', connected: false, health: 'error' as const },
      ]

      const payload = {
        habits,
        trainingPlans,
        mealTemplates,
        macroTargets,
        recoveryMetrics,
        deviceIntegrations,
        userHealthRecords,
        metrics: {
          activeHabits: habits.length,
          trainingWeek: 3,
          nutritionAdherence: 78,
          recoveryStatus: 'Good',
        },
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
