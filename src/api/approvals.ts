export interface ApprovalItem {
  id: string
  action: string
  agent: string
  sla: string
}

// Mutable store for mock data (simulates backend state)
let mockApprovals: ApprovalItem[] = [
  { id: '1', action: 'Categorize 12 transactions', agent: 'Finance Categorizer', sla: '2h' },
  { id: '2', action: 'Merge PR #234', agent: 'PR Triage', sla: '4h' },
]

export async function fetchApprovals(): Promise<ApprovalItem[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400))
  return [...mockApprovals]
}

export async function approveItem(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300))
  mockApprovals = mockApprovals.filter((a) => a.id !== id)
}

export async function rejectItem(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300))
  mockApprovals = mockApprovals.filter((a) => a.id !== id)
}
