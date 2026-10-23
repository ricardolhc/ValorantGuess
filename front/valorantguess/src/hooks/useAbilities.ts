import { useQuery } from '@tanstack/react-query'
import { fetchAbilities } from '../services/abilities'

export function useAbilities() {
  return useQuery({
    queryKey: ['abilities'],
    queryFn: ({ signal }) => fetchAbilities(signal),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })
}
