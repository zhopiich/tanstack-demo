import type { MaybeRefOrGetter } from 'vue'
import type { ApiResponse } from '@/types/api'
import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

/**
 * A generic utility hook to retrieve a specific item from a list query cache.
 * @param listQueryKey - The Query Key for the list
 * @param id - The ID of the specific item to find
 * @param findFn - Optional custom search logic, defaults to item.id === id
 */
export function useFindInQueryCache<
  TItem extends { id: string | number },
  TListResponse extends ApiResponse<TItem> = ApiResponse<TItem>,
>(
  listQueryKey: MaybeRefOrGetter<ReadonlyArray<unknown>>,
  id: MaybeRefOrGetter<string | number | undefined>,
  findFn?: (data: TListResponse, targetId: string | number) => TItem | undefined,
) {
  const queryClient = useQueryClient()

  const result = computed(() => {
    const targetId = toValue(id)
    const key = toValue(listQueryKey)

    if (!targetId)
      return null

    const queries = queryClient.getQueryCache().findAll({ queryKey: key })

    for (const query of queries) {
      const data = query.state.data as TListResponse | undefined
      if (!data?.data)
        continue

      const found = findFn
        ? findFn(data, targetId)
        : data.data.find(item => item.id === targetId)

      if (found) {
        return {
          data: found,
          updatedAt: query.state.dataUpdatedAt,
        }
      }
    }

    return null
  })

  return {
    data: computed(() => result.value?.data),
    updatedAt: computed(() => result.value?.updatedAt),
  }
}
