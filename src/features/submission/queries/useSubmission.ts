import type { MaybeRefOrGetter } from 'vue'
import type { Submission } from '../schemas/submission'
import type { ApiResponse } from '@/types/api'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { apiClient } from '@/api/client'
import { useSubmissionFilters } from '../stores/useSubmissionFilters'
import { submissionKeys } from './keys'

export function useSubmission(id: MaybeRefOrGetter<string | undefined>) {
  const queryClient = useQueryClient()
  const targetId = toValue(id)
  const { filters } = useSubmissionFilters()
  const _filters = toValue(filters)
  return useQuery({
    queryKey: computed(() => submissionKeys.detail(toValue(id) ?? '')),
    queryFn: async (): Promise<{ data: Submission }> => {
      const { data, error } = await apiClient.GET('/submissions/{id}', {
        params: { path: { id: targetId ?? '' } },
      })
      if (error)
        throw error
      return data
    },
    select: raw => raw.data,
    enabled: computed(() => !!toValue(id)),
    initialData: () => {
      const listData = queryClient.getQueryData<ApiResponse<Submission>>(submissionKeys.list(_filters))
      const cached = listData?.data.find(s => s.id === targetId)
      return cached ? { data: cached } : undefined
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(submissionKeys.list(_filters))?.dataUpdatedAt,
    staleTime: 1000 * 10,
  })
}
