import { useQueryClient } from '@tanstack/vue-query'
import { apiClient } from '@/api/client'
import { submissionKeys } from './keys'

export function usePrefetchSubmission() {
  const queryClient = useQueryClient()

  return function prefetch(id: string) {
    queryClient.prefetchQuery({
      queryKey: submissionKeys.detail(id),
      queryFn: async () => {
        const { data, error } = await apiClient.GET('/submissions/{id}', {
          params: { path: { id } },
        })
        if (error)
          throw error
        return data
      },
      staleTime: 1000 * 10,
    })
  }
}
