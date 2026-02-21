export interface NotFoundReport {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ReportBrokenLinkRequest {
  title: string
  description?: string
}

export interface ReportBrokenLinkResponse {
  id: string
  success: boolean
}
