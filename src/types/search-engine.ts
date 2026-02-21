export type SearchResourceType = 'agent' | 'run' | 'artifact' | 'log'

export interface SearchRequest {
  q: string
  types?: SearchResourceType[]
  limit?: number
  offset?: number
  facets?: boolean
}

export interface SearchResult {
  id: string
  type: SearchResourceType
  title: string
  description?: string
  href: string
  metadata?: Record<string, unknown>
  score?: number
}

export interface FacetCount {
  type: SearchResourceType
  count: number
}

export interface SearchResponse {
  results: SearchResult[]
  facets: FacetCount[]
  total: number
}
