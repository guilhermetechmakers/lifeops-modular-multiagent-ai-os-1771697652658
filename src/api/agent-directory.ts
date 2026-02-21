import { supabase } from '@/lib/supabase'
import type { AgentDirectoryItem, AgentDetails, CreateAgentPayload } from '@/types/agent-directory'

export interface AgentDirectoryFilters {
  module?: string
  status?: string
  owner?: string
  tags?: string[]
}

const MOCK_AGENTS: AgentDirectoryItem[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: 'PR Triage Agent',
    description: 'Automatically triages and categorizes pull requests',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    module: 'Projects',
    owner: 'System',
    tags: ['GitHub', 'CI', 'automation'],
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    lastRunId: 'run-1',
    health: 'healthy',
    connectors: ['GitHub', 'CI'],
  },
  {
    id: '2',
    user_id: 'user-1',
    title: 'Content Outliner',
    description: 'Generates content outlines from briefs',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    module: 'Content',
    owner: 'System',
    tags: ['CMS', 'content'],
    lastRun: new Date(Date.now() - 7200000).toISOString(),
    lastRunId: 'run-2',
    health: 'healthy',
    connectors: ['CMS'],
  },
  {
    id: '3',
    user_id: 'user-1',
    title: 'Finance Categorizer',
    description: 'Categorizes transactions and reconciles accounts',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    module: 'Finance',
    owner: 'User',
    tags: ['Plaid', 'finance'],
    lastRun: new Date(Date.now() - 86400000).toISOString(),
    lastRunId: 'run-3',
    health: 'degraded',
    connectors: ['Plaid'],
  },
  {
    id: '4',
    user_id: 'user-1',
    title: 'Training Planner',
    description: 'Creates personalized training plans',
    status: 'idle',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    module: 'Health',
    owner: 'User',
    tags: ['Calendar', 'health'],
    lastRun: undefined,
    health: 'unknown',
    connectors: ['Calendar'],
  },
]

async function invokeAgentDirectory<T>(body: Record<string, unknown>): Promise<T> {
  if (supabase) {
    const { data, error } = await supabase.functions.invoke<T>('agent-directory', {
      method: 'POST',
      body,
    })
    if (!error && data) return data
  }
  throw new Error('Failed to fetch agent directory')
}

export async function fetchAgentDirectory(
  filters?: AgentDirectoryFilters
): Promise<AgentDirectoryItem[]> {
  try {
    const data = await invokeAgentDirectory<AgentDirectoryItem[]>({
      action: 'list',
      filters: { module: filters?.module, status: filters?.status, owner: filters?.owner, tags: filters?.tags },
    })
    return Array.isArray(data) ? data : []
  } catch {
    let result = [...MOCK_AGENTS]
    if (filters?.module) result = result.filter((a) => a.module === filters.module)
    if (filters?.status) result = result.filter((a) => a.status === filters.status)
    if (filters?.owner) result = result.filter((a) => a.owner === filters.owner)
    if (filters?.tags?.length)
      result = result.filter((a) =>
        filters.tags!.some((t) => a.tags?.includes(t))
      )
    return result
  }
}

export async function fetchAgentDetails(id: string): Promise<AgentDetails | null> {
  try {
    const data = await invokeAgentDirectory<AgentDetails>({ action: 'get', id })
    return data ?? null
  } catch {
    const agent = MOCK_AGENTS.find((a) => a.id === id)
    if (!agent) return null
    return {
      ...agent,
      purpose: agent.description,
      capabilities: ['Analyze', 'Categorize', 'Report'],
      memoryScope: 'Session',
      permissions: ['read', 'write'],
      runHistory: [
        {
          id: 'r1',
          runId: 'run-1',
          status: 'success',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3500000).toISOString(),
          duration: 100,
        },
      ],
    }
  }
}

export async function createAgent(payload: CreateAgentPayload): Promise<AgentDirectoryItem> {
  try {
    const data = await invokeAgentDirectory<AgentDirectoryItem>({
      action: 'create',
      title: payload.title,
      description: payload.description,
      templateId: payload.templateId,
    })
    return data
  } catch {
    return {
      id: crypto.randomUUID(),
      user_id: 'user-1',
      title: payload.title,
      description: payload.description ?? '',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
}

export async function updateAgentStatus(
  id: string,
  status: 'active' | 'idle' | 'archived'
): Promise<void> {
  try {
    await invokeAgentDirectory({ action: 'updateStatus', id, status })
  } catch {
    // Fallback: no-op for mock
  }
}

export async function cloneAgent(id: string): Promise<AgentDirectoryItem> {
  try {
    const data = await invokeAgentDirectory<AgentDirectoryItem>({
      action: 'clone',
      id,
    })
    return data
  } catch {
    const agent = MOCK_AGENTS.find((a) => a.id === id)
    return {
      ...(agent ?? MOCK_AGENTS[0]),
      id: crypto.randomUUID(),
      title: `Copy of ${agent?.title ?? 'Agent'}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }
}

export async function archiveAgent(id: string): Promise<void> {
  try {
    await invokeAgentDirectory({ action: 'archive', id })
  } catch {
    // Fallback: no-op for mock
  }
}
