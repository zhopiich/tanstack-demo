import type { MaybeRefOrGetter } from 'vue'
import type { Submission } from '@/schemas/submission'
import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import { apiClient } from '@/api/client'
import { submissionKeys } from '@/queries/keys'
import { useFindInQueryCache } from '../composables/useFindInQueryCache'

export function useSubmission(id: MaybeRefOrGetter<string | undefined>) {
  const precached = useFindInQueryCache<Submission>(submissionKeys.lists(), id)
  const targetId = toValue(id)
  return useQuery({
    queryKey: computed(() => submissionKeys.detail(targetId ?? '')),
    queryFn: async (): Promise<Submission> => {
      const { data, error } = await apiClient.GET('/submissions/{id}', {
        params: { path: { id: targetId ?? '' } },
      })
      if (error)
        throw error
      return data.data
    },
    enabled: computed(() => !!targetId),
    initialData: () => precached.data.value,
    initialDataUpdatedAt: () => precached.updatedAt.value,
    staleTime: 1000 * 10,
  })
}
