import type { MaybeRefOrGetter } from 'vue'
import type { SubmissionFilters } from './keys'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { apiClient } from '@/api/client'
import { useSubmissionFilters } from '../stores/useSubmissionFilters'
import { submissionKeys } from './keys'

export function useSubmissions(filters: MaybeRefOrGetter<SubmissionFilters> = {}) {
  const { setFilters } = useSubmissionFilters()
  return useQuery({
    queryKey: computed(() => submissionKeys.list(toValue(filters))),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/submissions', {
        params: { query: toValue(filters) },
      })
      if (error)
        throw error
      setFilters(toValue(filters))
      return data
    },
    placeholderData: keepPreviousData,
  })
}
