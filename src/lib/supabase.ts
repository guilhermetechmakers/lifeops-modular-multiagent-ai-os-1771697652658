import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function invokePasswordReset(email: string): Promise<{ success?: boolean; error?: string }> {
  if (supabase) {
    return supabase.functions.invoke('password-reset', {
      body: { email },
    }).then(({ data, error }) => {
      if (error) return { error: error.message }
      const result = data as { success?: boolean; error?: string }
      return result?.error ? { error: result.error } : { success: true }
    })
  }
  return Promise.resolve({ success: true })
}
