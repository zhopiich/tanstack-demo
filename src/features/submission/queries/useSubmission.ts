import type { MaybeRefOrGetter } from 'vue'
import type { Submission } from '@/schemas/submission'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { apiClient } from '@/api/client'
import { submissionKeys } from '@/queries/keys'

interface DetailData { data: Submission }
interface ListData { data: Submission[], pagination: unknown }

export function useSubmission(id: MaybeRefOrGetter<string | undefined>) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: computed(() => submissionKeys.detail(toValue(id) ?? '')),
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/submissions/{id}', {
        params: { path: { id: toValue(id) ?? '' } },
      })
      if (error)
        throw error
      return data
    },
    enabled: computed(() => toValue(id) != null),
    initialData: (): DetailData | undefined => {
      const queries = queryClient.getQueryCache().findAll({ queryKey: submissionKeys.lists() })
      for (const query of queries) {
        const listData = query.state.data as ListData | undefined
        const found = listData?.data.find(s => s.id === toValue(id))
        if (found)
          return { data: found }
      }
      return undefined
    },
    initialDataUpdatedAt: () => {
      const queries = queryClient.getQueryCache().findAll({ queryKey: submissionKeys.lists() })
      for (const query of queries) {
        const listData = query.state.data as ListData | undefined
        if (listData?.data.find(s => s.id === toValue(id))) {
          return query.state.dataUpdatedAt
        }
      }
      return undefined
    },
  })
}
