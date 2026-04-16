import type { SubmissionFilters } from '../exports'
import { useRouteQuery } from '@vueuse/router'
import { computed } from 'vue'
import { useSubmissions } from '../exports'

export function useSubmissionsQuery() {
  const page = useRouteQuery('page', '1', { transform: Number })
  const pageSize = useRouteQuery('pageSize', '10', { transform: Number })
  const sortBy = useRouteQuery<SubmissionFilters['sortBy'] | null>('sortBy', null)
  const sortOrder = useRouteQuery<SubmissionFilters['sortOrder'] | null>('sortOrder', null)

  const filters = computed<SubmissionFilters>(() => ({
    page: page.value,
    pageSize: pageSize.value,
    ...(sortBy.value && { sortBy: sortBy.value }),
    ...(sortOrder.value && { sortOrder: sortOrder.value }),
  }))

  const { data, isFetching, isPending, isError } = useSubmissions(() => filters.value)

  return {
    filters,
    page,
    pageSize,
    sortBy,
    sortOrder,
    submissions: computed(() => data.value?.data ?? []),
    paginationMeta: computed(() => data.value?.pagination),
    isFetching,
    isPending,
    isError,
  }
}
