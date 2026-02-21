import { supabase } from '@/lib/supabase'
import type { SearchRequest, SearchResponse } from '@/types/search-engine'

export async function searchResources(
  request: SearchRequest
): Promise<SearchResponse> {
  if (!supabase) {
    return { results: [], facets: [], total: 0 }
  }
  const { data, error } = await supabase.functions.invoke<SearchResponse>(
    'search-engine',
    {
      method: 'POST',
      body: request,
    }
  )
  if (error) {
    throw new Error(error.message ?? 'Search failed')
  }
  if (!data) {
    return { results: [], facets: [], total: 0 }
  }
  return data
}
