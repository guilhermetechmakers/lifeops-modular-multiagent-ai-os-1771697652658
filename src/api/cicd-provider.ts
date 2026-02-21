import { supabase } from '@/lib/supabase'
import type {
  CicdProvider,
  CicdTriggerPayload,
  CicdStatusPayload,
  CicdArtifactsPayload,
  CicdRetryPayload,
  CicdCredentialsPayload,
  CicdCredentialRecord,
} from '@/types/cicd-provider'

export interface CicdApiError {
  error: string
}

async function invoke<T>(action: string, payload?: unknown): Promise<T> {
  if (!supabase) {
    throw new Error('Supabase client not configured')
  }
  const { data, error } = await supabase.functions.invoke<T | CicdApiError>('cicd-provider', {
    method: 'POST',
    body: { action, payload },
  })
  if (error) throw new Error(error.message)
  const result = data as T | CicdApiError
  if (result && typeof result === 'object' && 'error' in result && result.error) {
    throw new Error(result.error)
  }
  return result as T
}

export async function cicdTriggerPipeline(payload: CicdTriggerPayload): Promise<unknown> {
  return invoke('trigger', payload)
}

export async function cicdGetRunStatus(payload: CicdStatusPayload): Promise<unknown> {
  return invoke('status', payload)
}

export async function cicdFetchArtifacts(payload: CicdArtifactsPayload): Promise<{ artifacts?: unknown[] }> {
  return invoke('artifacts', payload)
}

export async function cicdRetryRun(payload: CicdRetryPayload): Promise<{ success?: boolean }> {
  return invoke('retry', payload)
}

export async function cicdListCredentials(provider?: CicdProvider): Promise<{
  credentials: CicdCredentialRecord[]
}> {
  return invoke('credentials_list', provider ? { provider } : undefined)
}

export async function cicdSaveCredentials(payload: CicdCredentialsPayload): Promise<{
  success: boolean
  credential: { id: string; provider: CicdProvider }
}> {
  return invoke('credentials_save', payload)
}

export async function cicdDeleteCredentials(payload: Pick<CicdCredentialsPayload, 'provider'>): Promise<{
  success: boolean
}> {
  return invoke('credentials_delete', payload)
}
