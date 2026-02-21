import { apiPost } from '@/lib/api'
import type { ApiError } from '@/lib/api'

export interface NewsletterSubscribeRequest {
  email: string
}

export interface NewsletterSubscribeResponse {
  success: boolean
  message?: string
}

export async function subscribeNewsletter(
  email: string
): Promise<NewsletterSubscribeResponse> {
  try {
    const res = await apiPost<NewsletterSubscribeResponse>('/newsletter/subscribe', {
      email,
    })
    return res
  } catch (err) {
    const apiErr = err as ApiError
    throw new Error(apiErr.message ?? 'Failed to subscribe. Please try again.')
  }
}
