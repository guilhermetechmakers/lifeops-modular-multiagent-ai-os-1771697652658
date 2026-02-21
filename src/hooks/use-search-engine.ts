import { useMutation } from '@tanstack/react-query'
import { searchResources } from '@/api/search-engine'
import type { SearchRequest, SearchResponse } from '@/types/search-engine'

export const SEARCH_ENGINE_MUTATION_KEY = ['search-engine'] as const

export function useSearchEngine() {
  return useMutation<SearchResponse, Error, SearchRequest>({
    mutationKey: SEARCH_ENGINE_MUTATION_KEY,
    mutationFn: searchResources,
  })
}
