import type { SubmissionFilters } from '../exports'
import { useRouteQuery } from '@vueuse/router'
import { computed, readonly } from 'vue'

export function useSubmissionsRouteQuery() {
  const page = useRouteQuery('page', '1', { transform: Number })
  const pageSize = useRouteQuery('pageSize', '10', { transform: Number })
  const sortBy = useRouteQuery<SubmissionFilters['sortBy'] | undefined>('sortBy', undefined)
  const sortOrder = useRouteQuery<SubmissionFilters['sortOrder'] | undefined>('sortOrder', undefined)

  const filters = computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  }))

  return {
    filters: readonly(filters),
    page,
    pageSize,
    sortBy,
    sortOrder,
  }
}
