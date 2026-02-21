import { supabase } from '@/lib/supabase'
import type { RunDetailsArtifactsPayload } from '@/types/run-details-artifacts'

const MOCK_PAYLOAD: RunDetailsArtifactsPayload = {
  summary: {
    id: '1',
    status: 'running',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    initiator: 'cron',
    costEstimate: 0.042,
    consumedCredits: 0.038,
    name: 'PR Triage',
  },
  messages: [
    {
      id: '1',
      fromAgent: 'PR Triage',
      toAgent: 'Code Reviewer',
      content: 'PR #234 ready for review. Changes in src/utils.ts',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      type: 'handoff',
    },
    {
      id: '2',
      fromAgent: 'Code Reviewer',
      toAgent: 'PR Triage',
      content: 'Approved with minor suggestions',
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      type: 'consensus',
    },
  ],
  diffs: [
    {
      id: '1',
      resourceType: 'code',
      resourcePath: 'src/utils/format.ts',
      beforeContent: 'export function formatDate(d: Date) {\n  return d.toISOString()\n}',
      afterContent: 'export function formatDate(d: Date) {\n  return d.toLocaleDateString()\n}',
      addedLines: 1,
      removedLines: 1,
    },
  ],
  artifacts: [
    { id: '1', type: 'pr', name: 'PR #234', url: 'https://github.com/org/repo/pull/234', createdAt: new Date().toISOString() },
    { id: '2', type: 'file', name: 'report.pdf', downloadUrl: '/api/artifacts/report.pdf', createdAt: new Date().toISOString() },
  ],
  canRollback: true,
}

export async function fetchRunDetailsArtifacts(runId: string): Promise<RunDetailsArtifactsPayload> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<RunDetailsArtifactsPayload>('run-details-artifacts', {
      method: 'POST',
      body: { runId },
    })
    if (!error && data) return data
  }
  return { ...MOCK_PAYLOAD, summary: { ...MOCK_PAYLOAD.summary, id: runId } }
}

export async function rollbackPreview(runId: string): Promise<{ preview: { affectedResources: string[]; steps: string[] } }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ preview: { affectedResources: string[]; steps: string[] } }>(
      'run-details-artifacts',
      { method: 'POST', body: { runId, action: 'rollback-preview' } }
    )
    if (!error && data) return data
  }
  return { preview: { affectedResources: ['src/utils/format.ts'], steps: ['Revert formatDate change'] } }
}

export async function rollbackRun(runId: string): Promise<{ success: boolean; message?: string }> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<{ success: boolean; message?: string }>('run-details-artifacts', {
      method: 'POST',
      body: { runId, action: 'rollback' },
    })
    if (!error && data) return data
  }
  return { success: true, message: 'Rollback initiated' }
}
